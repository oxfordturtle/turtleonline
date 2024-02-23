import { Category, Expression } from "../constants/categories.ts";
import type { Language } from "../constants/languages.ts";
import type { Lexeme } from "../lexer/lexeme.ts";
import usageExpression from "./usageExpression.ts";

export type UsageCategory<Exp extends Expression = Expression> = ReturnType<
  typeof usageCategory<Exp>
>;

const usageCategory = <Exp extends Expression>(
  language: Language,
  lexemes: Lexeme[],
  category: Category<Exp>
) => {
  const filtered = category.expressions.filter((expression) =>
    isUsed(language, lexemes, expression)
  );
  const mapped = filtered.map((expression) => usageExpression(language, lexemes, expression));
  mapped.sort((a, b) => {
    return a.level === b.level ? a.name.localeCompare(b.name) : a.level - b.level;
  });

  return {
    category: category.title,
    expressions: mapped,
    total: mapped.reduce((x, y) => x + y.count, 0),
  } as const;
};

const isUsed = (language: Language, lexemes: Lexeme[], expression: Expression) => {
  const name = expression.__ === "command" ? expression.names[language] : expression.name;

  if (!name) {
    return false;
  }

  const uses =
    language === "Pascal"
      ? lexemes.filter((lexeme) => lexeme.content?.toLowerCase() === name.toLowerCase())
      : lexemes.filter((lexeme) => lexeme.content === name);

  return uses.length > 0;
};

export default usageCategory;
