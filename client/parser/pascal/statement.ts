import {
  integerLexeme,
  operatorLexeme,
  type IdentifierLexeme,
  type KeywordLexeme,
  type Lexeme,
} from "../../lexer/lexeme.ts";
import { token } from "../../tokenizer/token.ts";
import { CompilerError } from "../../tools/error.ts";
import parseExpression from "../common/expression.ts";
import * as find from "../common/find.ts";
import parseProcedureCall from "../common/procedureCall.ts";
import typeCheck from "../common/typeCheck.ts";
import { type Expression } from "../definitions/expression.ts";
import makeCompoundExpression from "../definitions/expressions/compoundExpression.ts";
import makeIntegerValue from "../definitions/expressions/integerValue.ts";
import makeVariableValue from "../definitions/expressions/variableValue.ts";
import type { Lexemes } from "../definitions/lexemes.ts";
import type { Program } from "../definitions/routines/program.ts";
import type { Subroutine } from "../definitions/routines/subroutine.ts";
import { type Statement } from "../definitions/statement.ts";
import makeForStatement, { type ForStatement } from "../definitions/statements/forStatement.ts";
import makeIfStatement, { type IfStatement } from "../definitions/statements/ifStatement.ts";
import { type ProcedureCall } from "../definitions/statements/procedureCall.ts";
import makeRepeatStatement, {
  type RepeatStatement,
} from "../definitions/statements/repeatStatement.ts";
import makeVariableAssignment, {
  type VariableAssignment,
} from "../definitions/statements/variableAssignment.ts";
import makeWhileStatement, {
  type WhileStatement,
} from "../definitions/statements/whileStatement.ts";
import { isArray, type Variable } from "../definitions/variable.ts";

/** parses semicolons */
export function semicolon(lexemes: Lexemes, compulsory = false, context = "statement"): void {
  // check for semicolon
  if (compulsory && (!lexemes.get() || lexemes.get()?.content !== ";")) {
    throw new CompilerError(`Semicolon needed after ${context}.`, lexemes.get(-1));
  }

  // move past any semicolons
  while (lexemes.get() && lexemes.get()?.content === ";") {
    lexemes.next();
  }
}

/** checks for a semicolon at the end of a statement (where necessary) */
export function eosCheck(lexemes: Lexemes): void {
  const noSemiAfter = ["begin", "do", ".", "repeat", ";", "then"];
  const noSemiBefore = ["else", "end", ";", "until"];
  if (lexemes.get()) {
    if (lexemes.get()?.content !== ";") {
      if (noSemiAfter.indexOf(lexemes.get(-1)?.content?.toLowerCase() as string) === -1) {
        if (noSemiBefore.indexOf(lexemes.get()?.content?.toLowerCase() as string) === -1) {
          throw new CompilerError("Semicolon needed after command.", lexemes.get());
        }
      }
    } else {
      while (lexemes.get() && lexemes.get()?.content === ";") {
        lexemes.next();
      }
    }
  }
}

/** parses lexemes as a statement */
export function statement(
  lexeme: Lexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine
): Statement {
  // declare the return value
  let statement: Statement;

  // assign the return value accordingly
  switch (lexeme.type) {
    // identifiers (variable assignment or procedure call)
    case "identifier":
      statement = simpleStatement(lexeme, lexemes, routine);
      break;

    // keywords
    case "keyword":
      switch (lexeme.subtype) {
        // start of IF structure
        case "if":
          lexemes.next();
          statement = ifStatement(lexeme, lexemes, routine);
          break;

        // start of FOR structure
        case "for":
          lexemes.next();
          statement = forStatement(lexeme, lexemes, routine);
          break;

        // start of REPEAT structure
        case "repeat":
          lexemes.next();
          statement = repeatStatement(lexeme, lexemes, routine);
          break;

        // start of WHILE structure
        case "while":
          lexemes.next();
          statement = whileStatement(lexeme, lexemes, routine);
          break;

        // any other keyword is an error
        default:
          throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
      }
      break;

    // any other lexeme is an error
    default:
      throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
  }

  // semicolon check
  eosCheck(lexemes);

  // all good
  return statement;
}

/** parses lexemes as a simple statement */
function simpleStatement(
  lexeme: IdentifierLexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine
): VariableAssignment | ProcedureCall {
  // look for a constant (for meaningful error message)
  const constant = find.constant(routine, lexeme.value);
  if (constant) {
    throw new CompilerError("{lex} is a constant, not a variable.", lexeme);
  }

  // look for a variable
  // N.B. look for variable before command, in case variable name overwrites a native command
  const variable = find.variable(routine, lexeme.value);
  if (variable) {
    lexemes.next();
    return variableAssignment(lexeme, lexemes, routine, variable);
  }

  // look for a command
  const command = find.command(routine, lexeme.value);
  if (command) {
    lexemes.next();
    return parseProcedureCall(lexeme, lexemes, routine, command);
  }

  // if there are no matches, throw an error
  throw new CompilerError("Identifier {lex} is not defined.", lexeme);
}

/** parses lexemes as a variable assignment */
function variableAssignment(
  variableLexeme: IdentifierLexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine,
  variable: Variable
): VariableAssignment {
  // strings and array variables permit element indexes at this point
  const indexes: Expression[] = [];
  if (lexemes.get()?.content === "[") {
    if (isArray(variable)) {
      lexemes.next();
      while (lexemes.get() && lexemes.get()?.content !== "]") {
        // expecting integer expression for the element index
        let exp = parseExpression(lexemes, routine);
        exp = typeCheck(routine.language, exp, "integer");
        indexes.push(exp);
        // maybe move past comma
        if (lexemes.get()?.content === ",") {
          lexemes.next();
          // check for trailing comma
          if (lexemes.get()?.content === "]") {
            throw new CompilerError("Trailing comma at the end of array indexes.", lexemes.get(-1));
          }
        }
      }
      // check we came out of the loop above for the right reason
      if (!lexemes.get()) {
        throw new CompilerError('Closing bracket "]" needed after array indexes.', lexemes.get(-1));
      }
      // move past the closing bracket
      lexemes.next();
    } else if (variable.type === "string") {
      lexemes.next();
      // expecting integer expression for the character index
      let exp = parseExpression(lexemes, routine);
      exp = typeCheck(routine.language, exp, "integer");
      indexes.push(exp);
      // expecting closing bracket
      if (!lexemes.get() || lexemes.get()?.content !== "]") {
        throw new CompilerError(
          'Closing bracket "]" missing after string variable index.',
          exp.lexeme
        );
      }
      lexemes.next();
    } else {
      throw new CompilerError("{lex} is not a string or array variable.", variableLexeme);
    }
  }

  // check the right number of array variable indexes have been given
  if (isArray(variable)) {
    const allowedIndexes =
      variable.type === "string"
        ? variable.arrayDimensions.length + 1 // one more for characters within strings
        : variable.arrayDimensions.length;
    if (indexes.length > allowedIndexes) {
      throw new CompilerError("Too many indexes for array variable {lex}.", variableLexeme);
    }
  }

  // expecting assignment operator
  const assignmentLexeme = lexemes.get();
  if (
    !assignmentLexeme ||
    assignmentLexeme.type !== "operator" ||
    assignmentLexeme.subtype !== "asgn"
  ) {
    throw new CompilerError(
      'Variable must be followed by assignment operator ":=".',
      variableLexeme
    );
  }
  lexemes.next();

  // expecting an expression as the value to assign to the variable
  if (!lexemes.get()) {
    throw new CompilerError(
      `Variable "${variable.name}" must be assigned a value.`,
      assignmentLexeme
    );
  }
  const typeToCheck =
    variable.type === "string" && indexes.length > 0 ? "character" : variable.type;
  let value = parseExpression(lexemes, routine);
  value = typeCheck(routine.language, value, typeToCheck);

  // create and return the variable assignment
  return makeVariableAssignment(assignmentLexeme, variable, indexes, value);
}

/** parses lexemes as an IF statement */
function ifStatement(
  ifLexeme: KeywordLexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine
): IfStatement {
  // expecting a boolean expression
  if (!lexemes.get()) {
    throw new CompilerError('"IF" must be followed by a boolean expression.', ifLexeme);
  }
  let condition = parseExpression(lexemes, routine);
  condition = typeCheck(routine.language, condition, "boolean");

  // now we can create the statement
  const ifStatement = makeIfStatement(ifLexeme, condition);

  // expecting "then"
  if (!lexemes.get() || lexemes.get()?.content?.toLowerCase() !== "then") {
    throw new CompilerError('"IF ..." must be followed by "THEN".', condition.lexeme);
  }
  lexemes.next();

  // expecting a command or a block of commands
  const firstSubLexeme = lexemes.get();
  if (!firstSubLexeme) {
    throw new CompilerError('No commands found after "IF ... THEN".', lexemes.get(-1));
  }
  if (firstSubLexeme.content?.toLowerCase() === "begin") {
    lexemes.next();
    ifStatement.ifStatements.push(...block(lexemes, routine, "begin"));
  } else {
    ifStatement.ifStatements.push(statement(firstSubLexeme, lexemes, routine));
  }

  // happy with an "else" here (but it's optional)
  if (lexemes.get() && lexemes.get()?.content?.toLowerCase() === "else") {
    // expecting a command or a block of commands
    lexemes.next();
    const firstSubLexeme = lexemes.get();
    if (!firstSubLexeme) {
      throw new CompilerError('No commands found after "ELSE".', lexemes.get(-1));
    }
    if (firstSubLexeme.content?.toLowerCase() === "begin") {
      lexemes.next();
      ifStatement.elseStatements.push(...block(lexemes, routine, "begin"));
    } else {
      ifStatement.elseStatements.push(statement(firstSubLexeme, lexemes, routine));
    }
  }

  // now we have everything we need
  return ifStatement;
}

/** parses lexemes as a FOR statement */
function forStatement(
  forLexeme: KeywordLexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine
): ForStatement {
  // expecting an integer variable
  const variableLexeme = lexemes.get();
  if (!variableLexeme) {
    throw new CompilerError('"FOR" must be followed by an integer variable.', forLexeme);
  }
  if (variableLexeme.type !== "identifier") {
    throw new CompilerError('"FOR" must be followed by an integer variable.', variableLexeme);
  }
  if (variableLexeme.subtype === "turtle") {
    throw new CompilerError('Turtle attribute cannot be used as a "FOR" variable.', variableLexeme);
  }
  const variable = find.variable(routine, variableLexeme.value);
  if (!variable) {
    throw new CompilerError("Variable {lex} has not been declared.", variableLexeme);
  }
  if (variable.type !== "integer" && variable.type !== "boolint") {
    throw new CompilerError("{lex} is not an integer variable.", variableLexeme);
  }
  if (isArray(variable)) {
    throw new CompilerError("FOR variable cannot be an array or array element.", variableLexeme);
  }
  lexemes.next();

  // expecting variable assignment
  const initialisation = variableAssignment(variableLexeme, lexemes, routine, variable);

  // expecting "to" or "downto"
  const toLexeme = lexemes.get();
  const toOrDownTo = toLexeme?.content?.toLowerCase();
  if (!toLexeme || (toOrDownTo !== "to" && toOrDownTo !== "downto")) {
    throw new CompilerError(
      '"FOR ... := ..." must be followed by "TO" or "DOWNTO".',
      initialisation.lexeme
    );
  }
  const oneToken = token("decimal", "1", forLexeme.line, -1);
  const assignmentToken = token("operator", "=", forLexeme.line, -1);
  const operatorToken = token("operator", toOrDownTo === "to" ? "+" : "-", forLexeme.line, -1);
  const oneLexeme = integerLexeme(oneToken, 10);
  const assignmentLexeme = operatorLexeme(assignmentToken, "Pascal");
  const plusLexeme = operatorLexeme(operatorToken, "Pascal");
  const left = makeVariableValue(variableLexeme, variable);
  const right = makeIntegerValue(oneLexeme);
  const changeOperator = toOrDownTo === "to" ? "plus" : "subt";
  const value = makeCompoundExpression(plusLexeme, left, right, changeOperator);
  const change = makeVariableAssignment(assignmentLexeme, variable, [], value);
  lexemes.next();

  // expecting integer expression (for the final value)
  if (!lexemes.get()) {
    throw new CompilerError(
      `"${toOrDownTo.toUpperCase()}" must be followed by an integer (or integer constant).`,
      toLexeme
    );
  }
  let finalValue = parseExpression(lexemes, routine);
  finalValue = typeCheck(routine.language, finalValue, "integer");
  const comparisonToken = token("operator", toOrDownTo === "to" ? "<=" : ">=", forLexeme.line, -1);
  const comparisonLexeme = operatorLexeme(comparisonToken, "Pascal");
  const comparisonOperator = toOrDownTo === "to" ? "lseq" : "mreq";
  const condition = makeCompoundExpression(comparisonLexeme, left, finalValue, comparisonOperator);

  // now we can create the FOR statement
  const forStatement = makeForStatement(forLexeme, initialisation, condition, change);

  // expecting "do"
  const doLexeme = lexemes.get();
  if (!doLexeme) {
    throw new CompilerError('"FOR" loop range must be followed by "DO".', lexemes.get(-1));
  }
  lexemes.next();

  // expecting a command or block of commands
  const firstSubLexeme = lexemes.get();
  if (!firstSubLexeme) {
    throw new CompilerError('No commands found after "FOR" loop initialisation.', doLexeme);
  }
  if (firstSubLexeme.content?.toLowerCase() === "begin") {
    lexemes.next();
    forStatement.statements.push(...block(lexemes, routine, "begin"));
  } else {
    forStatement.statements.push(statement(firstSubLexeme, lexemes, routine));
  }

  // now we have everything we need
  return forStatement;
}

/** parses lexemes as a REPEAT statement */
function repeatStatement(
  repeatLexeme: KeywordLexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine
): RepeatStatement {
  // expecting a block of code
  const repeatStatements = block(lexemes, routine, "repeat");

  // expecting a boolean expression
  if (!lexemes.get()) {
    throw new CompilerError('"UNTIL" must be followed by a boolean expression.', lexemes.get(-1));
  }
  let condition = parseExpression(lexemes, routine);
  condition = typeCheck(routine.language, condition, "boolean");

  // now we have everything we need
  const repeatStatement = makeRepeatStatement(repeatLexeme, condition);
  repeatStatement.statements.push(...repeatStatements);
  return repeatStatement;
}

/** parses lexemes as a WHILE statement */
function whileStatement(
  whileLexeme: KeywordLexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine
): WhileStatement {
  // expecting a boolean expression
  if (!lexemes.get()) {
    throw new CompilerError('"WHILE" must be followed by a boolean expression.', whileLexeme);
  }
  let condition = parseExpression(lexemes, routine);
  condition = typeCheck(routine.language, condition, "boolean");

  // now we can create the statement
  const whileStatement = makeWhileStatement(whileLexeme, condition);

  // expecting "DO"
  if (!lexemes.get()) {
    throw new CompilerError('"WHILE ..." must be followed by "DO".', condition.lexeme);
  }
  if (lexemes.get()?.content !== "do") {
    throw new CompilerError('"WHILE ..." must be followed by "DO".', lexemes.get());
  }
  lexemes.next();

  // expecting a block of code
  const firstSubLexeme = lexemes.get();
  if (!firstSubLexeme) {
    throw new CompilerError(
      'No commands found after "WHILE" loop initialisation.',
      lexemes.get(-1)
    );
  }
  if (lexemes.get()?.content?.toLowerCase() === "begin") {
    lexemes.next();
    whileStatement.statements.push(...block(lexemes, routine, "begin"));
  } else {
    whileStatement.statements.push(statement(firstSubLexeme, lexemes, routine));
  }

  // now we have everything we need to generate the pcode
  return whileStatement;
}

/** parses a block of statements */
function block(
  lexemes: Lexemes,
  routine: Program | Subroutine,
  start: "begin" | "repeat"
): Statement[] {
  const statements: Statement[] = [];
  let end = false;

  // expecting something
  if (!lexemes.get()) {
    throw new CompilerError(`No commands found after "${start.toUpperCase()}".`, lexemes.get(-1));
  }

  // loop through until the end of the block (or we run out of lexemes)
  while (!end && lexemes.get()) {
    const lexeme = lexemes.get() as Lexeme;
    end = blockEndCheck(start, lexeme);
    if (end) {
      // move past the end lexeme
      lexemes.next();
    } else {
      // compile the statement
      statements.push(statement(lexeme, lexemes, routine));
    }
  }

  // if we've run out of lexemes without reaching the end, this is an error
  if (!end) {
    if (start === "begin") {
      throw new CompilerError('"BEGIN" does not have any matching "END".', lexemes.get(-1));
    }
    throw new CompilerError('"REPEAT" does not have any matching "UNTIL".', lexemes.get(-1));
  }

  // otherwise all good
  return statements;
}

/** checks for the ending to a block, and throws an error if it doesn't match the beginning */
function blockEndCheck(start: "begin" | "repeat", lexeme: Lexeme): boolean {
  switch (lexeme.content.toLowerCase()) {
    case "end":
      if (start !== "begin") {
        throw new CompilerError('"END" does not have any matching "BEGIN".', lexeme);
      }
      return true;

    case "until":
      if (start !== "repeat") {
        throw new CompilerError('"UNTIL" does not have any matching "REPEAT".', lexeme);
      }
      return true;

    default:
      return false;
  }
}
