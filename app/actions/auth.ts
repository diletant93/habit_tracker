'use server'
import { SignInSchema, SignUpSchema } from "../_validationSchemas/auth";
import { ActionResponse } from "../types/actions";
import { handleErrors } from "../_utils/errorHandlers";
import { createUser, deleteUser, getUser } from "@/app/lib/auth/service/user";
import { comparePassword, generateSecretKey, hashPassword } from "@/app/lib/auth/crypto";
import { createSession, deleteSession } from "@/app/lib/auth/service/session";

export async function signUp({username, email, password, privacyConsent} : SignUpSchema):Promise<ActionResponse>{
    try {
        if(!privacyConsent) return {status:'error', message:'You should accept the privacy policy'}

        const salt = generateSecretKey()
        const hashedPassword = await hashPassword(password, salt)

        const createdUserResponse = await createUser({name:username, email, password:hashedPassword, salt})
        if(createdUserResponse.status === 'error') {
            const deleteUserResponse = await deleteUser({email})
            return deleteUserResponse.status === 'error' ? deleteUserResponse : createdUserResponse
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
export async function signIn({email, password} : SignInSchema):Promise<ActionResponse>{
    try{
        const userResponse = await getUser({email})
        if(userResponse.status === 'error') return userResponse

        const {id,salt,password:userHashedPassword} = userResponse.data
        if(!salt || !userHashedPassword) return {status:'error', message:'This email is associated with a different login method. Try signing in with Google'}

        const isIdenticalPasswords = await comparePassword({inputPassword:password, userHashedPassword,salt})
        if(!isIdenticalPasswords) return {status:'error', message:'Invalid password'}

        const sessionResponse = await createSession({id})
        if(sessionResponse.status === 'error') return sessionResponse

        return {
            status:'success',
            message:'You logged in',
            data:undefined as never
        }
        
    }catch(error){
        return handleErrors(error, {defaultError:'Could not sign in'})
    }
}
export async function signOut():Promise<ActionResponse>{
    const deleteSessionResponse = await deleteSession()
    if(deleteSessionResponse.status === 'error') return deleteSessionResponse

    return {
        status:'success',
        message:'You logged out',
        data:undefined as never
    }
}