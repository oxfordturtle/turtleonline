import { CompilerError } from "../../tools/error.ts";
import evaluate from "../common/evaluate.ts";
import parseExpression from "../common/expression.ts";
import typeCheck from "../common/typeCheck.ts";
import type { Lexemes } from "../definitions/lexemes.ts";
import type { Routine } from "../definitions/routine.ts";
import makeVariable, { type Variable } from "../definitions/variable.ts";
import identifier from "./identifier.ts";
import type from "./type.ts";

/** parses lexemes as a variable declaration */
export default function variable(lexemes: Lexemes, routine: Routine): Variable {
  const typeLexeme = lexemes.get();

  // expecting type specification
  const [variableType, stringLength] = type(lexemes);

  // "void" not allowed for variables
  if (variableType === null) {
    throw new CompilerError(
      'Variable cannot be void (expected "boolean", "char", "int", or "String").',
      lexemes.get()
    );
  }

  // "*" possible here (to indicate pointer variable)
  let isPointer = false;
  if (lexemes.get()?.content === "*") {
    lexemes.next();
    isPointer = true;
  }

  // expecting identifier
  const name = identifier(lexemes, routine);

  // create the variable
  const variable = makeVariable(name, routine);
  variable.type = variableType;
  variable.stringLength = stringLength;
  variable.isPointer = isPointer;

  // possibly expecting brackets (for arrays)
  while (lexemes.get()?.content === "[") {
    lexemes.next();

    // expecting array dimension size
    if (!lexemes.get()) {
      throw new CompilerError(
        'Opening bracket "[" must be followed by an array size.',
        lexemes.get(-1)
      );
    }
    const exp = parseExpression(lexemes, routine);
    typeCheck(routine.language, exp, "integer");
    const value = evaluate(exp, "C", "array");
    if (typeof value === "string") {
      throw new CompilerError("Array size must be an integer.", lexemes.get());
    }
    if (value <= 0) {
      throw new CompilerError("Array size must be positive.", lexemes.get());
    }
    variable.arrayDimensions.push([0, value - 1]); // -1 because arrays are indexed from zero

    // expecting closing bracket
    if (!lexemes.get()) {
      throw new CompilerError(
        'Array size specification must be followed by closing bracket "]".',
        lexemes.get(-1)
      );
    }
    if (lexemes.get()?.content !== "]") {
      throw new CompilerError(
        'Array size specification must be followed by closing bracket "]".',
        lexemes.get()
      );
    }
    lexemes.next();
  }

  // sanity check
  if (type === null && variable.arrayDimensions.length > 0) {
    throw new CompilerError("Array of void is not allowed.", typeLexeme);
  }

  // return the variable
  return variable;
}
