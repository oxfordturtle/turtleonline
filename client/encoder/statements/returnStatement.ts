import PCode from "../../constants/pcodes.ts";
import type Program from "../../parser/definitions/program.ts";
import type { ReturnStatement } from "../../parser/definitions/statement.ts";
import { VariableAssignment } from "../../parser/definitions/statement.ts";
import type { Options } from "../options.ts";
import variableAssignment from "./variableAssignment.ts";

export default (
  stmt: ReturnStatement,
  program: Program,
  startLine: number,
  options: Options
): number[][] => {
  // N.B. stmt.lexeme is a KeywordLexeme, but VariableAssignment constructor
  // requires an IdentifierLexeme; it makes no difference here
  const va = new VariableAssignment(stmt.lexeme as any, stmt.routine.variables[0], [], stmt.value);

  const pcode = variableAssignment(va, program, startLine, options);
  pcode.push([
    PCode.ldvg,
    stmt.routine.address,
    PCode.stvg,
    program.resultAddress,
    PCode.memr,
    stmt.routine.address,
    PCode.plsr,
    PCode.retn,
  ]);

  return pcode;
};
