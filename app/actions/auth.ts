'use server'
import { SignInSchema, SignUpSchema } from "../_validationSchemas/auth";
import { ActionResponse } from "../types/actions";
import { handleErrors } from "../_utils/errorHandlers";
import { createUser, deleteUser } from "@/app/lib/auth/service/user";
import { generateSecretKey, hashPassword } from "@/app/lib/auth/crypto";
import { createSession } from "@/app/lib/auth/service/session";

export async function signUp({username, email, password, privacyConsent} : SignUpSchema):Promise<ActionResponse>{
    try {
        if(!privacyConsent) return {status:'error', message:'You should accept the privacy policy'}

        const salt = generateSecretKey()
        const hashedPassword = await hashPassword(password, salt)

        const createdUserResponse = await createUser({name:username, email, password:hashedPassword, salt})
        if(createdUserResponse.status === 'error') {
            const deleteReponse = await deleteUser({email})
            return deleteReponse.status === 'error' ? deleteReponse : createdUserResponse
        }
        
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