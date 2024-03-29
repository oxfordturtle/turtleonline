import PCode from "../../constants/pcodes.ts";
import { getMemoryNeeded } from "../../parser/definitions/routine.ts";
import {
  getParameters,
  getProgram,
  getSubroutineType,
  type Subroutine,
} from "../../parser/definitions/routines/subroutine.ts";
import {
  elementCount,
  getSubVariables,
  isArray,
  type Variable,
} from "../../parser/definitions/variable.ts";
import {
  lengthByteAddress,
  resultAddress,
  subroutineAddress,
  variableAddress,
} from "../addresses.ts";
import type { Options } from "../options.ts";
import statements from "./statements.ts";

export default (subroutines: Subroutine[], startLine: number, options: Options): number[][] => {
  const pcode: number[][] = [];

  // generate the pcode for each subroutine in turn, concatenating the results
  for (const subroutine of subroutines) {
    // at this point, we know where the code for this subroutine starts; add this
    // information to the subroutine object so we can call it from now on
    subroutine.startLine = startLine;

    // generate the code for the subroutine
    const startCode = subroutineStartCode(subroutine, options);
    const innerCode = statements(subroutine, startLine + startCode.length, options);
    const subroutineCode = startCode.concat(innerCode);

    if (getSubroutineType(subroutine) === "procedure" || subroutine.language === "Pascal") {
      // all procedures need end code, as do functions in Pascal
      // (functions in other languages include at least one RETURN statement)
      const endCode = subroutineEndCode(subroutine, options);
      subroutineCode.push(...endCode);
    }

    // increment the start line for the next subroutine
    startLine += subroutineCode.length;

    // add the code for the subroutine
    pcode.push(...subroutineCode);
  }

  // return the pcode
  return pcode;
};

const subroutineStartCode = (subroutine: Subroutine, options: Options): number[][] => {
  const pcode: number[][] = [];

  pcode.push([PCode.pssr, subroutine.index]);

  // initialise variables
  if (subroutine.variables.length > 0) {
    // claim memory
    pcode.push([PCode.memc, subroutineAddress(subroutine), getMemoryNeeded(subroutine)]);

    // zero memory
    if (options.initialiseLocals) {
      if (subroutine.variables.length > getParameters(subroutine).length) {
        // TODO: speak to Peter about this - his latest compiler doesn't appear to be doing this in every case
        pcode.push([
          PCode.ldav,
          subroutineAddress(subroutine),
          1,
          PCode.ldin,
          getMemoryNeeded(subroutine),
          PCode.zptr,
        ]);
      }
    }

    // setup local variables
    for (const variable of subroutine.variables) {
      const setup = setupLocalVariable(variable);
      if (setup.length > 0) {
        pcode.push(...setup);
      }
    }

    // store values of parameters
    // (these should have been loaded onto the stack before the subroutine call)
    const parameters = getParameters(subroutine);
    if (parameters.length > 0) {
      pcode.push([]);
      for (const parameter of parameters.reverse()) {
        const lastStartLine = pcode[pcode.length - 1];
        if (isArray(parameter) && !parameter.isReferenceParameter) {
          // TODO: copy the array
        } else if (parameter.type === "string" && !parameter.isReferenceParameter) {
          // copy the string
          lastStartLine.push(
            PCode.ldvv,
            subroutineAddress(subroutine),
            variableAddress(parameter),
            PCode.cstr
          );
        } else {
          // for booleans and integers, or longer reference parameters, just store the value/address
          lastStartLine.push(PCode.stvv, subroutineAddress(subroutine), variableAddress(parameter));
        }
      }
    }
  }

  return pcode;
};

const setupLocalVariable = (variable: Variable): number[][] => {
  const subroutine = variable.routine as Subroutine;
  const pcode: number[][] = [];

  if (isArray(variable) && !variable.isReferenceParameter) {
    pcode.push([
      PCode.ldav,
      subroutineAddress(subroutine),
      lengthByteAddress(variable),
      PCode.stvv,
      subroutineAddress(subroutine),
      variableAddress(variable),
      PCode.ldin,
      elementCount(variable),
      PCode.stvv,
      subroutineAddress(subroutine),
      lengthByteAddress(variable),
    ]);
    for (const subVariable of getSubVariables(variable)) {
      const subPcode = setupLocalVariable(subVariable);
      if (subPcode.length > 0) {
        pcode.push(...subPcode);
      }
    }
    return pcode;
  }

  if (variable.type === "string") {
    pcode.push([
      PCode.ldav,
      subroutineAddress(subroutine),
      lengthByteAddress(variable) + 1,
      PCode.stvv,
      subroutineAddress(subroutine),
      variableAddress(variable),
      PCode.ldin,
      variable.stringLength + 1, // +1 for the actual length byte (??)
      PCode.stvv,
      subroutineAddress(subroutine),
      lengthByteAddress(variable),
    ]);
  }

  return pcode;
};

const subroutineEndCode = (subroutine: Subroutine, _options: Options): number[][] => {
  const pcode: number[] = [];
  if (getSubroutineType(subroutine) === "function") {
    // store function result
    pcode.push(
      PCode.ldvg,
      subroutineAddress(subroutine),
      PCode.stvg,
      resultAddress(getProgram(subroutine))
    );
  }
  if (subroutine.variables.length > 0) {
    // release memory
    pcode.push(PCode.memr, subroutineAddress(subroutine));
  }
  pcode.push(PCode.plsr, PCode.retn);

  return [pcode];
};
