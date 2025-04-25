import { z } from "zod";
import { ActionResponse } from "../types/actions";
import { handleErrors } from "../_utils/errorHandlers";

export function validateApiResponse<T>(schema: z.ZodType<T>, data: unknown):ActionResponse<T>{
    try{    
        const result = schema.safeParse(data)
        
        if(!result.success){
            throw new Error()
        }

        return {status:'success', data:result.data}
    }catch(error){
        return handleErrors(error, {
            ZodError:`API validation error, schema:${schema._type}`,
            defaultError:'Unexpected error while API validation'
        })
    }
}   