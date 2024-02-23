import { type OperatorLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import parseExpression from "../../common/expression.ts";
import typeCheck from "../../common/typeCheck.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Program } from "../../definitions/routines/program.ts";
import {
  getResultType,
  getSubroutineType,
  type Subroutine,
} from "../../definitions/routines/subroutine.ts";
import makeReturnStatement, {
  type ReturnStatement,
} from "../../definitions/statements/returnStatement.ts";

const parseReturnStatement = (
  lexeme: OperatorLexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine
): ReturnStatement => {
  // check a return statement is allowed
  if (routine.__ === "Program") {
    throw new CompilerError("Statement in the main program cannot begin with {lex}.", lexeme);
  }
  if (getSubroutineType(routine) !== "function") {
    throw new CompilerError("Procedures cannot return a value.", lexeme);
  }

  // expecting an expression of the right type
  let value = parseExpression(lexemes, routine);
  value = typeCheck(routine.language, value, getResultType(routine)!);

  // create and return the statement
  return makeReturnStatement(lexeme, routine, value);
};

export default parseReturnStatement;
