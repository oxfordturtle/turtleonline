import { type IdentifierLexeme, type KeywordLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import * as find from "../../common/find.ts";
import parseProcedureCall from "../../common/procedureCall.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Program } from "../../definitions/routines/program.ts";
import { type Subroutine } from "../../definitions/routines/subroutine.ts";
import makePassStatement, {
  type PassStatement,
} from "../../definitions/statements/passStatement.ts";
import { type ProcedureCall } from "../../definitions/statements/procedureCall.ts";
import { type VariableAssignment } from "../../definitions/statements/variableAssignment.ts";
import type { Variable } from "../../definitions/variable.ts";
import constant from "../constant.ts";
import variable from "../variable.ts";
import parseVariableAssignment from "./variableAssignment.ts";

const parseSimpleStatement = (
  lexeme: KeywordLexeme | IdentifierLexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine
): VariableAssignment | ProcedureCall | PassStatement => {
  switch (lexeme.type) {
    case "keyword":
      switch (lexeme.subtype) {
        // "const" means constant definition
        case "const":
          lexemes.next();
          // bypass duplicate check on the second pass (and forget about the result)
          constant(lexemes, routine, false);
          return makePassStatement();

        // "var" means a variable declaration
        case "var": {
          lexemes.next();
          // on the second pass, we know the next lexeme is an identifier, and that it
          // names a variable that has been defined
          const variableLexeme = lexemes.get() as IdentifierLexeme;
          const foo = find.variable(routine, variableLexeme.content) as Variable;
          // bypass duplicate check on the second pass (and forget about the result)
          variable(lexemes, routine, false);
          if (lexemes.get()?.content === "=") {
            return parseVariableAssignment(variableLexeme, lexemes, routine, foo);
          } else {
            return makePassStatement();
          }
        }

        // any other keyword is an error
        default:
          // this should never happen, as this function should only be called
          // with "const" or "var" keyword
          throw new CompilerError("Simple statement cannot begin with {lex}.", lexeme);
      }

    // identifier means variable assignment or procedure call
    case "identifier": {
      const foo = find.constant(routine, lexeme.value);
      const bar = find.variable(routine, lexeme.value);
      const baz = find.command(routine, lexeme.value);
      if (foo) {
        throw new CompilerError("{lex} is a constant and cannot be assigned a new value.", lexeme);
      } else if (bar) {
        lexemes.next();
        return parseVariableAssignment(lexeme, lexemes, routine, bar);
      } else if (baz) {
        lexemes.next();
        const statement = parseProcedureCall(lexeme, lexemes, routine, baz);
        return statement;
      } else {
        throw new CompilerError("{lex} is not defined.", lexemes.get());
      }
    }
  }
};

export default parseSimpleStatement;
