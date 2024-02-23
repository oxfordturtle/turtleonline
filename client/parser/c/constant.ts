import { CompilerError } from "../../tools/error.ts";
import constant, { type Constant } from "../definitions/constant.ts";
import type { Lexemes } from "../definitions/lexemes.ts";
import type { Routine } from "../definitions/routine.ts";
import evaluate from "../evaluate.ts";
import { expression, typeCheck } from "../expression.ts";
import identifier from "./identifier.ts";
import type from "./type.ts";

export default (lexemes: Lexemes, routine: Routine): Constant => {
  // expecting type specification
  const [constantType] = type(lexemes);
  if (constantType === null) {
    throw new CompilerError(
      'Constant type cannot be void (expected "bool", "char", "int", or "string").',
      lexemes.get()
    );
  }

  // expecting identifier
  const name = identifier(lexemes, routine);

  // expecting "="
  if (!lexemes.get()) {
    throw new CompilerError(`Constant ${name} must be assigned a value.`, lexemes.get(-1));
  }
  if (lexemes.get()?.content === "[") {
    throw new CompilerError("Constant cannot be an array.", lexemes.get(-1));
  }
  if (lexemes.get()?.content !== "=") {
    throw new CompilerError(`Constant ${name} must be assigned a value.`, lexemes.get());
  }
  lexemes.next();

  // expecting value expression
  const exp = expression(lexemes, routine);
  typeCheck(routine.language, exp, constantType);
  const value = evaluate(exp, "C", "constant");

  // create and return the constant
  return constant("C", name, value);
};
