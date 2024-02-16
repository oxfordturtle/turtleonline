import {
  operatorLexeme,
  type IdentifierLexeme,
  type KeywordLexeme,
  type Lexeme,
  type TypeLexeme,
} from "../../lexer/lexeme.ts";
import { token } from "../../tokenizer/token.ts";
import { CompilerError } from "../../tools/error.ts";
import parseExpression from "../common/expression.ts";
import * as find from "../common/find.ts";
import parseProcedureCall from "../common/procedureCall.ts";
import typeCheck from "../common/typeCheck.ts";
import { type Expression } from "../definitions/expression.ts";
import makeCompoundExpression from "../definitions/expressions/compoundExpression.ts";
import makeVariableValue from "../definitions/expressions/variableValue.ts";
import type { Lexemes } from "../definitions/lexemes.ts";
import type { Program } from "../definitions/routines/program.ts";
import {
  getResultType,
  getSubroutineType,
  type Subroutine,
} from "../definitions/routines/subroutine.ts";
import { type Statement } from "../definitions/statement.ts";
import makeForStatement, { type ForStatement } from "../definitions/statements/forStatement.ts";
import makeIfStatement, { type IfStatement } from "../definitions/statements/ifStatement.ts";
import makePassStatement, { type PassStatement } from "../definitions/statements/passStatement.ts";
import { type ProcedureCall } from "../definitions/statements/procedureCall.ts";
import makeRepeatStatement, {
  type RepeatStatement,
} from "../definitions/statements/repeatStatement.ts";
import makeReturnStatement, {
  type ReturnStatement,
} from "../definitions/statements/returnStatement.ts";
import makeVariableAssignment, {
  type VariableAssignment,
} from "../definitions/statements/variableAssignment.ts";
import makeWhileStatement, {
  type WhileStatement,
} from "../definitions/statements/whileStatement.ts";
import { isArray, type Variable } from "../definitions/variable.ts";
import constant from "./constant.ts";
import variable from "./variable.ts";

/** checks for semicolon at the end of a statement */
export function eosCheck(lexemes: Lexemes): void {
  if (!lexemes.get() || lexemes.get()?.content !== ";") {
    throw new CompilerError("Statement must be followed by a semicolon.", lexemes.get(-1));
  }
  lexemes.next();
}

/** parses lexemes as a statement */
export function statement(lexeme: Lexeme, lexemes: Lexemes, routine: Subroutine): Statement {
  let statement: Statement;

  switch (lexeme.type) {
    // identifiers and type keywords (variable declaration/assignment or procedure call)
    case "identifier": // fallthrough
    case "type":
      statement = simpleStatement(lexeme, lexemes, routine);
      eosCheck(lexemes);
      break;

    // keywords
    case "keyword":
      switch (lexeme.subtype) {
        case "const":
          statement = simpleStatement(lexeme, lexemes, routine);
          eosCheck(lexemes);
          break;

        // start of RETURN statement
        case "return":
          lexemes.next();
          statement = returnStatement(lexeme, lexemes, routine);
          break;

        // start of IF statement
        case "if":
          lexemes.next();
          statement = ifStatement(lexeme, lexemes, routine);
          break;

        // else is an error
        case "else":
          throw new CompilerError(
            'Statement cannot begin with "else". If you have an "if" above, you may be missing a closing bracket "}".',
            lexemes.get()
          );

        // start of FOR statement
        case "for":
          lexemes.next();
          statement = forStatement(lexeme, lexemes, routine);
          break;

        // start of DO (REPEAT) statement
        case "do":
          lexemes.next();
          statement = doStatement(lexeme, lexemes, routine);
          break;

        // start of WHILE statement
        case "while":
          lexemes.next();
          statement = whileStatement(lexeme, lexemes, routine);
          break;

        // anything else is an error
        default:
          throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
      }
      break;

    default:
      throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
  }

  // all good
  return statement;
}

/** parses lexemes as a simple statement (variable declaration/assignment or procedure call) */
export function simpleStatement(
  lexeme: KeywordLexeme | TypeLexeme | IdentifierLexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine
): VariableAssignment | ProcedureCall | PassStatement {
  switch (lexeme.type) {
    // keyword means constant definition
    // (because "const" is the only keyword that will bring us here)
    case "keyword":
      lexemes.next();
      routine.constants.push(constant(lexemes, routine));
      return makePassStatement();

    // type specification means a variable declaration
    case "type": {
      const variableLexeme = lexemes.get(1) as IdentifierLexeme; // it will be if the next line doesn't throw an error
      const foo = variable(lexemes, routine);
      routine.variables.push(foo);
      if (lexemes.get()?.content === "=") {
        return variableAssignment(variableLexeme, lexemes, routine, foo);
      } else {
        return makePassStatement();
      }
    }

    // identifier means variable assignment or procedure call
    case "identifier": {
      const bar = find.variable(routine, lexeme.value);
      const baz = find.command(routine, lexeme.value);
      if (bar) {
        lexemes.next();
        return variableAssignment(lexeme, lexemes, routine, bar);
      } else if (baz) {
        lexemes.next();
        const statement = parseProcedureCall(lexeme, lexemes, routine, baz);
        return statement;
      } else {
        throw new CompilerError("{lex} is not defined.", lexemes.get());
      }
    }
  }
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
        // maybe move past "]["
        if (lexemes.get()?.content === "]" && lexemes.get(1)?.content === "[") {
          lexemes.next();
          lexemes.next();
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

  // expecting "="
  const assignmentLexeme = lexemes.get();
  if (!assignmentLexeme) {
    throw new CompilerError(
      'Variable must be followed by assignment operator "=".',
      lexemes.get(-1)
    );
  }
  if (assignmentLexeme.type !== "operator" || assignmentLexeme.content !== "=") {
    throw new CompilerError(
      'Variable must be followed by assignment operator "=".',
      assignmentLexeme
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
  let value = parseExpression(lexemes, routine);
  const variableValue = makeVariableValue(variableLexeme, variable);
  variableValue.indexes.push(...indexes);
  // check against variableValue.type rather than variableAssignment.variable.type
  // in case string has indexes and should be a character
  value = typeCheck(routine.language, value, variableValue.type);

  // create and return the variable assignment statement
  return makeVariableAssignment(assignmentLexeme, variable, indexes, value);
}

/** parses lexemes as a RETURN statement */
function returnStatement(
  returnLexeme: KeywordLexeme,
  lexemes: Lexemes,
  routine: Subroutine
): ReturnStatement {
  if (getSubroutineType(routine) !== "function") {
    throw new CompilerError("Procedures cannot return a value.", lexemes.get());
  }

  // expecting an expression of the right type, followed by semicolon
  let value = parseExpression(lexemes, routine);
  value = typeCheck(routine.language, value, getResultType(routine)!);
  eosCheck(lexemes);

  // mark that this function has a return statement
  routine.hasReturnStatement = true;

  // create and return the return statement
  return makeReturnStatement(returnLexeme, routine, value);
}

/** parses lexemes as an IF statement */
function ifStatement(ifLexeme: KeywordLexeme, lexemes: Lexemes, routine: Subroutine): IfStatement {
  // expecting an opening bracket
  if (!lexemes.get() || lexemes.get()?.content !== "(") {
    throw new CompilerError('"if" must be followed by an opening bracket "(".', ifLexeme);
  }
  lexemes.next();

  // expecting a boolean expression
  if (!lexemes.get()) {
    throw new CompilerError('"if (" must be followed by a Boolean expression.', lexemes.get(-1));
  }
  let condition = parseExpression(lexemes, routine);
  condition = typeCheck(routine.language, condition, "boolean");

  // expecting a closing bracket
  if (!lexemes.get() || lexemes.get()?.content !== ")") {
    throw new CompilerError(
      '"if (..." must be followed by a closing bracket ")".',
      lexemes.get(-1)
    );
  }
  lexemes.next();

  // create the if statement
  const ifStatement = makeIfStatement(ifLexeme, condition);

  // expecting an opening curly bracket
  if (!lexemes.get() || lexemes.get()?.content !== "{") {
    throw new CompilerError(
      '"if (...)" must be followed by an opening curly bracket "{".',
      lexemes.get(-1)
    );
  }
  lexemes.next();

  // expecting a block of statements
  ifStatement.ifStatements.push(...block(lexemes, routine));

  // happy with an "else" here (but it's optional)
  if (lexemes.get() && lexemes.get()?.content === "else") {
    lexemes.next();

    // expecting an opening bracket
    if (!lexemes.get() || lexemes.get()?.content !== "{") {
      throw new CompilerError(
        '"else" must be followed by an opening bracket "{".',
        lexemes.get(-1)
      );
    }
    lexemes.next();

    // expecting a block of statements
    ifStatement.elseStatements.push(...block(lexemes, routine));
  }

  // now we have everything we need
  return ifStatement;
}

/** parses lexemes as a FOR statement */
function forStatement(
  forLexeme: KeywordLexeme,
  lexemes: Lexemes,
  routine: Subroutine
): ForStatement {
  // expecting opening bracket
  if (!lexemes.get() || lexemes.get()?.content !== "(") {
    throw new CompilerError('"for" must be followed by an opening bracket "(".', lexemes.get(-1));
  }
  lexemes.next();

  // expecting a variable assignment
  const firstInitialisationLexeme = lexemes.get();
  if (!firstInitialisationLexeme) {
    throw new CompilerError(
      '"for" conditions must begin with a variable assignment.',
      lexemes.get(-1)
    );
  }
  if (
    firstInitialisationLexeme.type !== "identifier" &&
    firstInitialisationLexeme.type !== "type"
  ) {
    throw new CompilerError(
      '"for" conditions must begin with a variable assignment.',
      lexemes.get()
    );
  }
  const initialisation = simpleStatement(firstInitialisationLexeme, lexemes, routine);
  if (initialisation.statementType !== "variableAssignment") {
    throw new CompilerError(
      '"for" conditions must begin with a variable assignment.',
      lexemes.get(-1)
    );
  }
  if (initialisation.variable.type !== "integer") {
    throw new CompilerError("Loop variable must be an integer.", lexemes.get());
  }
  eosCheck(lexemes);

  // expecting boolean expression
  if (!lexemes.get()) {
    throw new CompilerError('"for (...;" must be followed by a loop condition.', lexemes.get(-1));
  }
  let condition = parseExpression(lexemes, routine);
  condition = typeCheck(routine.language, condition, "boolean");
  eosCheck(lexemes);

  // expecting a variable assignment
  const firstChangeLexeme = lexemes.get();
  if (!firstChangeLexeme) {
    throw new CompilerError(
      '"for" conditions must begin with a variable assignment.',
      lexemes.get(-1)
    );
  }
  if (firstChangeLexeme.type !== "identifier" && firstChangeLexeme.type !== "type") {
    throw new CompilerError(
      '"for" conditions must begin with a variable assignment.',
      firstChangeLexeme
    );
  }
  const change = simpleStatement(firstChangeLexeme, lexemes, routine);
  if (change.statementType !== "variableAssignment") {
    throw new CompilerError('"for" loop variable must be changed on each loop.', lexemes.get(-1));
  }
  if (change.variable !== initialisation.variable) {
    throw new CompilerError(
      "Initial loop variable and change loop variable must be the same.",
      lexemes.get(-1)
    );
  }

  // expecting a closing bracket
  if (!lexemes.get() || lexemes.get()?.content !== ")") {
    throw new CompilerError(
      'Closing bracket ")" missing after "for" loop initialisation.',
      lexemes.get(-1)
    );
  }
  lexemes.next();

  // create the for statement
  const forStatement = makeForStatement(forLexeme, initialisation, condition, change);

  // expecting an opening curly bracket
  if (!lexemes.get() || lexemes.get()?.content !== "{") {
    throw new CompilerError(
      '"for (...)" must be followed by an opening bracket "{".',
      lexemes.get(-1)
    );
  }
  lexemes.next();

  // expecting a block of statements
  forStatement.statements.push(...block(lexemes, routine));

  // return the for statement
  return forStatement;
}

/** parses lexemes as a DO (REPEAT) statement */
function doStatement(
  doLexeme: KeywordLexeme,
  lexemes: Lexemes,
  routine: Subroutine
): RepeatStatement {
  // expecting an opening bracket
  if (!lexemes.get() || lexemes.get()?.content !== "{") {
    throw new CompilerError('"do" must be followed by an opening bracket "{".', lexemes.get(-1));
  }
  lexemes.next();

  // expecting a block of code
  const repeatStatements = block(lexemes, routine);

  // expecting "while"
  if (!lexemes.get() || lexemes.get()?.content !== "while") {
    throw new CompilerError('"do { ... }" must be followed by "while".', lexemes.get(-1));
  }
  lexemes.next();

  // expecting an opening bracket
  if (!lexemes.get() || lexemes.get()?.content !== "(") {
    throw new CompilerError('"while" must be followed by an opening bracket "(".', lexemes.get(-1));
  }
  lexemes.next();

  // expecting a boolean expression
  if (!lexemes.get()) {
    throw new CompilerError('"while (" must be followed by a boolean expression.', lexemes.get(-1));
  }
  let condition = parseExpression(lexemes, routine);
  condition = typeCheck(routine.language, condition, "boolean");
  // negate the condition
  const notToken = token("operator", "!", condition.lexeme.line, condition.lexeme.character);
  const notLexeme = operatorLexeme(notToken, "C");
  condition = makeCompoundExpression(notLexeme, null, condition, "not");

  // expecting a closing bracket
  if (!lexemes.get() || lexemes.get()?.content !== ")") {
    throw new CompilerError(
      '"while (..." must be followed by a closing bracket ")".',
      lexemes.get(-1)
    );
  }
  lexemes.next();

  // expecting a semicolon
  eosCheck(lexemes);

  // create and return the repeat statement
  const repeatStatement = makeRepeatStatement(doLexeme, condition);
  repeatStatement.statements.push(...repeatStatements);
  return repeatStatement;
}

/** parses lexemes as a WHILE statement */
function whileStatement(
  whileLexeme: KeywordLexeme,
  lexemes: Lexemes,
  routine: Subroutine
): WhileStatement {
  // expecting an opening bracket
  if (!lexemes.get() || lexemes.get()?.content !== "(") {
    throw new CompilerError('"while" must be followed by an opening bracket "(".', lexemes.get(-1));
  }
  lexemes.next();

  // expecting a boolean expression
  if (!lexemes.get()) {
    throw new CompilerError('"while (" must be followed by a Boolean expression.', lexemes.get(-1));
  }
  let condition = parseExpression(lexemes, routine);
  condition = typeCheck(routine.language, condition, "boolean");

  // expecting a closing bracket
  if (!lexemes.get() || lexemes.get()?.content !== ")") {
    throw new CompilerError(
      '"while (..." must be followed by a closing bracket ")".',
      lexemes.get(-1)
    );
  }
  lexemes.next();

  // create the while statement
  const whileStatement = makeWhileStatement(whileLexeme, condition);

  // expecting an opening curly bracket
  if (!lexemes.get() || lexemes.get()?.content !== "{") {
    throw new CompilerError(
      '"while (...)" must be followed by an opening curly bracket "{".',
      lexemes.get(-1)
    );
  }
  lexemes.next();

  // expecting a block of statements
  whileStatement.statements.push(...block(lexemes, routine));

  // now we have everything we need
  return whileStatement;
}

/** parses lexemes as a block of statements */
function block(lexemes: Lexemes, routine: Subroutine): Statement[] {
  const statements: Statement[] = [];

  // loop through until the end of the block (or we run out of lexemes)
  while (lexemes.get() && lexemes.get()?.content !== "}") {
    statements.push(statement(lexemes.get() as Lexeme, lexemes, routine));
  }

  // check we came out of the loop for the right reason
  if (lexemes.get()?.content === "}") {
    lexemes.next();
  } else {
    throw new CompilerError('Closing bracket "}" missing after statement block.', lexemes.get(-1));
  }

  return statements;
}
