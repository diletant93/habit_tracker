import supabase from "@/lib/supabase";
import { SignInSchema, SignUpSchema } from "../_validationSchemas/auth";
import { ActionResponse } from "../types/actions";
import { handleErrors } from "../_utils/errorHandlers";
import { createUser } from "@/lib/auth/service/user";
import { generateSecretKey, hashPassword } from "@/lib/auth/crypto";
import { createSession } from "@/lib/auth/service/session";

export async function signUp({username, email, password, privacyConsent} : SignUpSchema):Promise<ActionResponse>{
    try {
        if(!privacyConsent) return {status:'error', message:'You should accept the privacy policy'}

        const salt = generateSecretKey()
        const hashedPassword = await hashPassword(password, salt)

        const createdUserResponse = await createUser({email, password,salt})
        if(createdUserResponse.status === 'error') return createdUserResponse
        
        const createdUser = createdUserResponse.data

        const createdSessionResponse  =  await createSession(createdUser)
        if(createdSessionResponse.status === 'error') return createdSessionResponse

        
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