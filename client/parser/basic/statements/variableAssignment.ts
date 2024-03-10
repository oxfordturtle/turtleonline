import { type IdentifierLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import parseExpression from "../../common/expression.ts";
import typeCheck from "../../common/typeCheck.ts";
import { type Expression } from "../../definitions/expression.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Program } from "../../definitions/routines/program.ts";
import { type Subroutine } from "../../definitions/routines/subroutine.ts";
import makeVariableAssignment, {
  type VariableAssignment,
} from "../../definitions/statements/variableAssignment.ts";
import { isArray, type Variable } from "../../definitions/variable.ts";

const parseVariableAssignment = (
  variableLexeme: IdentifierLexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine,
  variable: Variable
): VariableAssignment => {
  // array variables permit element indexes at this point
  const indexes: Expression[] = [];
  if (lexemes.get()?.content === "(") {
    if (isArray(variable)) {
      lexemes.next();
      while (lexemes.get() && lexemes.get()?.content !== ")") {
        // expecting integer expression for the element index
        let exp = parseExpression(lexemes, routine);
        exp = typeCheck(routine.language, exp, "integer");
        indexes.push(exp);
        // maybe move past comma
        if (lexemes.get()?.content === ",") {
          lexemes.next();
          // check for trailing comma
          if (lexemes.get()?.content === ")") {
            throw new CompilerError("Trailing comma at the end of array indexes.", lexemes.get(-1));
          }
        }
      }
      // check we came out of the loop above for the right reason
      if (!lexemes.get()) {
        throw new CompilerError('Closing bracket ")" needed after array indexes.', lexemes.get(-1));
      }
      // move past the closing bracket
      lexemes.next();
    } else {
      throw new CompilerError("{lex} is not an array variable.", variableLexeme);
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
      lexemes.get(-1)
    );
  }
  let value = parseExpression(lexemes, routine);
  value = typeCheck(routine.language, value, variable.type);

  // create and return the variable assignment statement
  return makeVariableAssignment(assignmentLexeme, variable, indexes, value);
};

export default parseVariableAssignment;
