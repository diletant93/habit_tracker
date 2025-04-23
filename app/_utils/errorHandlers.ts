import { ZodError } from "zod";
import { ActionResponse } from "../types/serverActions";

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