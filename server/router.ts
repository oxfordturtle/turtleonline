import { STATUS_CODE } from "http";
import type { Imp } from "./types.ts";
import { asafely } from "./utils/tools.ts";
import parseRequest from "./router/parseRequest.ts";
import response from "./router/response.ts";
import error from "./pages/error.tsx";

export default async (request: Request, imp: Imp): Promise<Response> => {
  const requestParams = await parseRequest(request, imp);
  const result = await asafely(() => response(requestParams, imp));
  if (result[0] === "left") {
    console.log(result[1]);
    return error(requestParams, STATUS_CODE.InternalServerError);
  }
  return result[1];
};
