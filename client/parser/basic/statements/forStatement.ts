import { integerLexeme, operatorLexeme, type KeywordLexeme } from "../../../lexer/lexeme.ts";
import { token } from "../../../tokenizer/token.ts";
import { CompilerError } from "../../../tools/error.ts";
import evaluate from "../../common/evaluate.ts";
import parseExpression from "../../common/expression.ts";
import * as find from "../../common/find.ts";
import typeCheck from "../../common/typeCheck.ts";
import makeCompoundExpression from "../../definitions/expressions/compoundExpression.ts";
import makeIntegerValue from "../../definitions/expressions/integerValue.ts";
import makeVariableValue from "../../definitions/expressions/variableValue.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Program } from "../../definitions/routines/program.ts";
import { getProgram, type Subroutine } from "../../definitions/routines/subroutine.ts";
import makeForStatement, { type ForStatement } from "../../definitions/statements/forStatement.ts";
import makeVariableAssignment from "../../definitions/statements/variableAssignment.ts";
import type { Variable } from "../../definitions/variable.ts";
import parseStatement from "../statement.ts";
import { variable } from "../variable.ts";
import parseBlock from "./block.ts";
import parseVariableAssignment from "./variableAssignment.ts";

const parseForStatement = (
  lexeme: KeywordLexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine
): ForStatement => {
  // expecting an integer variable
  const variableLexeme = lexemes.get();
  if (!variableLexeme) {
    throw new CompilerError('"FOR" must be followed by an integer variable.', lexeme);
  }
  if (variableLexeme.type !== "identifier") {
    throw new CompilerError('"FOR" must be followed by an integer variable.', variableLexeme);
  }
  if (variableLexeme.subtype === "turtle") {
    throw new CompilerError('Turtle attribute cannot be used as a "FOR" variable.', variableLexeme);
  }
  let foo: Variable;
  const existing = find.variable(routine, variableLexeme.content);
  if (!existing) {
    // create the variable as a global
    const program = routine.__ === "Program" ? routine : getProgram(routine);
    foo = variable(lexemes, program);
    program.variables.push(foo);
  } else {
    foo = existing;
    lexemes.next();
  }
  if (foo.type !== "integer" && foo.type !== "boolint") {
    throw new CompilerError("{lex} is not an integer variable.", lexemes.get());
  }

  // expecting variable assignment
  const initialisation = parseVariableAssignment(variableLexeme, lexemes, routine, foo);

  // expecting "to"
  if (!lexemes.get()) {
    throw new CompilerError('"FOR" loop initialisation must be followed by "TO".', lexemes.get(-1));
  }
  if (lexemes.get()?.content !== "TO") {
    throw new CompilerError('"FOR" loop initialisation must be followed by "TO".', lexemes.get());
  }
  lexemes.next();

  // expecting integer expression (for the final value)
  if (!lexemes.get()) {
    throw new CompilerError(
      '"TO" must be followed by an integer (or integer constant).',
      lexemes.get(-1)
    );
  }
  let finalValue = parseExpression(lexemes, routine);
  finalValue = typeCheck(routine.language, finalValue, "integer");

  // create some dummy lexemes for the condition and step change
  const oneToken = token("decimal", "1", lexeme.line, -1);
  const assignmentToken = token("operator", "=", lexeme.line, -1);
  const plusToken = token("operator", "+", lexeme.line, -1);
  const lseqToken = token("operator", "<=", lexeme.line, -1);
  const mreqToken = token("operator", ">=", lexeme.line, -1);
  const oneLexeme = integerLexeme(oneToken, 10);
  const assignmentLexeme = operatorLexeme(assignmentToken, "BASIC");
  const plusLexeme = operatorLexeme(plusToken, "BASIC");
  const lseqLexeme = operatorLexeme(lseqToken, "BASIC");
  const mreqLexeme = operatorLexeme(mreqToken, "BASIC");

  // define default condition and step change
  const left = makeVariableValue(variableLexeme, foo);
  const right = makeIntegerValue(oneLexeme);
  let change = makeVariableAssignment(
    assignmentLexeme,
    foo,
    [],
    makeCompoundExpression(plusLexeme, left, right, "plus")
  );
  let condition = makeCompoundExpression(lseqLexeme, left, finalValue, "lseq");

  // "STEP" permissible here
  if (lexemes.get() && lexemes.get()?.content === "STEP") {
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError(
        '"STEP" instruction must be followed by an integer value.',
        lexemes.get(-1)
      );
    }
    const stepValue = typeCheck(routine.language, parseExpression(lexemes, routine), "integer");
    const evaluatedStepValue = evaluate(stepValue, "BASIC", "step") as number;
    if (evaluatedStepValue === 0) {
      throw new CompilerError("Step value cannot be zero.", stepValue.lexeme);
    }
    change = makeVariableAssignment(
      assignmentLexeme,
      foo,
      [],
      makeCompoundExpression(plusLexeme, left, stepValue, "plus")
    );
    if (evaluatedStepValue < 0) {
      condition = makeCompoundExpression(mreqLexeme, left, finalValue, "mreq");
    } else {
      condition = makeCompoundExpression(lseqLexeme, left, finalValue, "lseq");
    }
  }

  // now we can create the FOR statement
  const forStatement = makeForStatement(lexeme, initialisation, condition, change);

  // expecting a statement on the same line or a block of statements on a new line
  const firstInnerLexeme = lexemes.get();
  if (!firstInnerLexeme) {
    throw new CompilerError('No statements found after "FOR" loop initialisation.', lexeme);
  }
  if (firstInnerLexeme.type === "newline") {
    while (lexemes.get()?.type === "newline") {
      lexemes.next();
    }
    forStatement.statements.push(...parseBlock(lexemes, routine, "FOR"));
  } else {
    forStatement.statements.push(parseStatement(firstInnerLexeme, lexemes, routine));
  }

  // now we have everything we need
  return forStatement;
};

export default parseForStatement;
