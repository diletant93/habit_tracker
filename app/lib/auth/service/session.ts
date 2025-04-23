import { SessionRecord, sessionSchema } from "@/app/_validationSchemas/session";
import { ActionResponse } from "@/app/types/actions";
import { deleteUser ,getUserContext } from "./user";
import { generateSecretKey } from "../crypto";
import { handleErrors } from "@/app/_utils/errorHandlers";
import supabase from "@/app/lib/supabase";
import { cookies } from "next/headers";
import { cache } from "react";
import { COOKIE_SESSION_ID_KEY, SESSION_EXPIRE_SECONDS } from "@/app/_constants/session";
import { validateApiResponse } from "@/app/_validationSchemas/utils";

export async function createSession(user: {id:string}):Promise<ActionResponse<SessionRecord>>{
    try {
        if(!('id' in user))return {status:'error', message:'Pass user id to create session'}

        const userContextResponse = await getUserContext(user.id)
        if(userContextResponse.status === 'error') return userContextResponse

        const {roles, organizations, permissions} = userContextResponse.data
        const roleNames = roles.map(role => role.name)
        const organizationNames = organizations.map(organization => organization.name)
        const permissionNames = permissions.map(permission => permission.name)


        const sessionId = generateSecretKey()

        const sessionToCreate = {
            userId:user.id,
            expire:Date.now() + SESSION_EXPIRE_SECONDS * 1000,
            sessionId,
            roles:roleNames,
            organizations:organizationNames,
            permissions:permissionNames,
        }

        const [{data:createdSession , error:createdSessionError}, setSessionIdResponse] = await Promise.all([ 
            supabase.from('sessions').insert([sessionToCreate]).select('*').single(),
            setCookieSessionId(sessionId)
        ])

        if(createdSessionError) {
              const deleteUserResponse = await deleteUser(user)
             return deleteUserResponse.status === 'error' ? deleteUserResponse : {status:'error', message:'Could not create session'}
        }

        if(setSessionIdResponse.status === 'error') return setSessionIdResponse
        
        const validatedSessionResponse = validateApiResponse(sessionSchema, createdSession)
        if(validatedSessionResponse.status === 'error') return validatedSessionResponse


        const session =  validatedSessionResponse.data
        return {status:'success', data: session}

    } catch (error) {
        return handleErrors(error, {defaultError:'Unexpected error while creating a session'})
    }

}
export const getCookie = cache(async()=> await cookies())

export async function setCookieSessionId(sessionId:string):Promise<ActionResponse>{
    try{
        const cookies = await getCookie()
        cookies.set(COOKIE_SESSION_ID_KEY, sessionId,{
            httpOnly:true,
            secure:true,
            sameSite:'lax',
            expires:Date.now() + SESSION_EXPIRE_SECONDS * 1000,
        })  
        return {status:'success', data:undefined as never}
    }catch(error){
        return handleErrors(error, {defaultError:'Unexpected error setting session id to cookies'})
    }   
    
}

