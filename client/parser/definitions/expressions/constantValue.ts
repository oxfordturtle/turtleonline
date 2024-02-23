import type { IdentifierLexeme } from "../../../lexer/lexeme.ts";
import type { Constant } from "../constant.ts";
import { makeExpression, type Expression, type ExpressionCommon } from "../expression.ts";

export interface ConstantValue extends ExpressionCommon {
  readonly expressionType: "constant";
  readonly lexeme: IdentifierLexeme;
  readonly constant: Constant;
  readonly indexes: Expression[];
}

const makeConstantValue = (lexeme: IdentifierLexeme, constant: Constant): ConstantValue => ({
  ...makeExpression(),
  expressionType: "constant",
  lexeme,
  constant,
  indexes: [],
});

export default makeConstantValue;
