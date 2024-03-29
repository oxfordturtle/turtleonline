import constant, { type Constant } from "../definitions/constant.ts";
import type { Lexemes } from "../definitions/lexemes.ts";
import type { Routine } from "../definitions/routine.ts";
import makeVariable, { type Variable } from "../definitions/variable.ts";
import identifier from "./identifier.ts";
import type from "./type.ts";

export default (lexemes: Lexemes, routine: Routine): Constant | Variable => {
  // expecting identifier
  const name = identifier(lexemes, routine, true);

  // colon followed by type hint is permissible here
  if (lexemes.get() && lexemes.get()?.content === ":") {
    lexemes.next();

    // expecting type specification
    const [isConstant, variableType, stringLength, arrayDimensions] = type(lexemes, routine);

    if (isConstant) {
      // return the constant with any value; the value will be set later
      return constant("Python", name, 0);
    }

    // create and return the variable
    const variable = makeVariable(name, routine);
    variable.type = variableType;
    variable.typeIsCertain = true;
    variable.stringLength = stringLength;
    variable.arrayDimensions = arrayDimensions;
    return variable;
  }

  // if there's no type hint, just return a default (boolint) variable
  return makeVariable(name, routine);
};
