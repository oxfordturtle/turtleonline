import type { Expression } from "../constants/categories.ts";
import type { Language } from "../constants/languages.ts";
import type { Lexeme } from "../lexer/lexeme.ts";

export interface UsageExpression {
  readonly name: string;
  readonly level: number;
  readonly count: number;
  readonly lines: string;
}

const usageExpression = (
  language: Language,
  lexemes: Lexeme[],
  expression: Expression
): UsageExpression => {
  const name = expression.__ === "Command" ? expression.names[language]! : expression.name;

  const uses =
    language === "Pascal"
      ? lexemes.filter((lexeme) => lexeme.content?.toLowerCase() === name.toLowerCase())
      : lexemes.filter((lexeme) => lexeme.content === name);
  uses.sort((a, b) => a.line - b.line);

  return {
    name: language === "Pascal" ? name.toLowerCase() : name,
    level: expression.level + 1,
    count: uses.length,
    lines: uses.reduce((x, y) => `${x} ${y.line.toString(10)}`, "").trim(),
  };
};

export default usageExpression;
