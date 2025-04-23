import supabase from "@/lib/supabase";
import { SignInSchema, SignUpSchema } from "../_validationSchemas/auth";
import { ActionResponse } from "../types/serverActions";
import { handleErrors } from "../_utils/errorHandlers";
import { createUser } from "@/lib/auth/service/user";

export async function signUp(formData : SignUpSchema):Promise<ActionResponse>{
    try {

        
        return {
            status:'success',
            message:'User was registered',
            data:undefined as never
        }
    } catch (error) {
        return handleErrors(error, {defaultError:'Unexpected error occured while signing up'})
    }
}
export async function signIn(formData : SignInSchema):Promise<ActionResponse>{
    return {
        status:'success',
        message:'Success',
        data:undefined as never
    }
}