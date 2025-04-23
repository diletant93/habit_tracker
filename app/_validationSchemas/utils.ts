import { z, ZodError } from "zod";
import { ActionResponse } from "../types/actions";

export function validateApiResponse<T>(schema: z.ZodType<T>, data: unknown):ActionResponse<T>{
    try{    
        console.log('INSIDE VALIDATION=>>',{
            schema,
            data
        })
        const result = schema.safeParse(data)

        if(!result.success){
            console.log(result.error.format())
            throw new Error()
        }

        return {status:'success', data:result.data}
    }catch(error){
        if(error instanceof ZodError){
            return {status:'error', message:`API validation error, schema:${schema._type}`}
        }
        return {status:'error', message:'Unexpected error while API validation'}
    }
}   