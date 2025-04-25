import { z, ZodError } from "zod";
import { ActionResponse, ActionResponseStatus, ErrorResponse, SuccessResponse } from "../types/actions";

type ErrorHandlingConfig = {
    [key: string]:string;
    defaultError:string;
}

export function handleErrors(error:unknown, errorMessages:ErrorHandlingConfig): ActionResponse {
    if(error instanceof ZodError) return {status:'error', message:errorMessages['ZodError'] ?? 'Error while parsing object'}
    if(error instanceof Error) {
        const errorName = error.constructor.name
        if(errorMessages[errorName]) return {status:'error', message:errorMessages[errorName]}
    }
    return {status:'error', message: errorMessages.defaultError}
}

export function checkForErrors(responses:ActionResponse<any>[]):ActionResponse | null{
    const failedResponse = responses.find(response => response.status === 'error')
    return failedResponse? failedResponse : null
}   
//later to fix

export function ensureAllSuccess<T>(responses: ActionResponse<T>[], schemas:z.ZodType):ActionResponse<SuccessResponse<T>[]> {
      const maybeError = checkForErrors(responses);
      if (maybeError) return {status:'error', message:maybeError.message}
      return {status:'success', data:responses as SuccessResponse<T>[]}
}