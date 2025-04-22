import { z, ZodError } from "zod";
import { ActionResponse } from "../types/serverActions";

export function validateApiResponse<T>(schema: z.ZodType<T>, data: unknown):ActionResponse<T>{
    try{    
        const parsedData = schema.parse(data)
        return {status:'success', data:parsedData}
    }catch(error){
        if(error instanceof ZodError){
            return {status:'error', message:'API validation error'}
        }
        return {status:'error', message:'Unexpected error while API validation'}
    }
}