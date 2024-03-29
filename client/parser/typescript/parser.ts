import type { Lexeme } from "../../lexer/lexeme.ts";
import type { Lexemes } from "../definitions/lexemes.ts";
import makeProgram, { type Program } from "../definitions/routines/program.ts";
import type { Subroutine } from "../definitions/routines/subroutine.ts";
import constant from "./constant.ts";
import eosCheck from "./statements/eosCheck.ts";
import parseStatement from "./statement.ts";
import subroutine from "./subroutine.ts";
import variable from "./variable.ts";

/** parses lexemes as a TypeScript program */
export default function typescript(lexemes: Lexemes): Program {
  // create the program
  const program = makeProgram("TypeScript");
  program.end = lexemes.lexemes.length;

  // parse the program (which will parse its subroutines in turn)
  parseBody(lexemes, program);

  // return the program
  return program;
}

/** parses the body of a routine, generating statements from its lexemes */
function parseBody(lexemes: Lexemes, routine: Program | Subroutine): void {
  // first pass: hoist all constants, variables, and functions
  lexemes.index = routine.start;
  // TODO: allow block-scoped variables with 'let' and make constants block-scoped as well
  while (lexemes.index < routine.end) {
    const lexeme = lexemes.get() as Lexeme;
    lexemes.next();
    switch (lexeme.type) {
      case "keyword":
        switch (lexeme.subtype) {
          // constant definitions (temporary: don't do this when block-scoping is possible)
          case "const":
            routine.constants.push(constant(lexemes, routine, true)); // TODO: set second parameter to FALSE when constants aren't hoisted on first pass
            eosCheck(lexemes);
            break;

          // variable declarations
          case "var":
            routine.variables.push(variable(lexemes, routine, true));
            break;

          // subroutine definitions
          case "function":
            routine.subroutines.push(subroutine(lexeme, lexemes, routine));
            break;
        }
    }
  }

  // second pass: parse the statements of this routine and any subroutines recursively
  lexemes.index = routine.start;
  while (lexemes.index < routine.end) {
    routine.statements.push(parseStatement(lexemes.get() as Lexeme, lexemes, routine));
  }
  for (const sub of routine.subroutines) {
    parseBody(lexemes, sub);
  }
}
