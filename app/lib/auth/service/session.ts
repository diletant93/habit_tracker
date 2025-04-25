import { CurrentSession, SessionRecord, sessionSchema, SessionToCreate } from "@/app/_validationSchemas/session";
import { ActionResponse, SuccessResponse } from "@/app/types/actions";
import { deleteUser ,getUserContext } from "./user";
import { generateSecretKey } from "../crypto";
import { handleErrors } from "@/app/_utils/errorHandlers";
import supabase from "@/app/lib/supabase";
import { cookies } from "next/headers";
import { cache } from "react";
import { COOKIE_SESSION_ID_KEY, COOKIES_SESSION_EXPIRE_KEY, SESSION_EXPIRE_SECONDS } from "@/app/_constants/session";
import { validateApiResponse } from "@/app/_validationSchemas/utils";
import { SessionUser } from "@/app/_validationSchemas/user";
import { redirect } from "next/navigation";

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

        const sessionToCreate: SessionToCreate = {
            userId:user.id,
            expire:new Date((Date.now() + SESSION_EXPIRE_SECONDS * 1000)).toISOString(),
            sessionId,
            roles:roleNames,
            organizations:organizationNames,
            permissions:permissionNames,
        }

        const [{data:createdSession , error:createdSessionError}, 
            setSessionIdResponse,
            setSessionExpireResponse,
         ] = await Promise.all([ 
            supabase.from('sessions').insert([sessionToCreate]).select('*').single(),
            setCookieSessionId(sessionId),
            setCookieSessionExpire()
        ])

        if(createdSessionError) {
            const deleteUserResponse = await deleteUser(user)
            return deleteUserResponse.status === 'error' ? deleteUserResponse : {status:'error', message:'Could not create session'}
        }

        if(setSessionIdResponse.status === 'error') {
            const deleteSessionResponse = await deleteSession()
            return deleteSessionResponse.status === 'error' ? deleteSessionResponse : setSessionIdResponse
        }

        if(setSessionExpireResponse.status === 'error'){
            const deleteSessionResponse = await deleteSession()
            return deleteSessionResponse.status === 'error' ? deleteSessionResponse : setSessionExpireResponse
        }
        
        const validatedSessionResponse = validateApiResponse(sessionSchema, createdSession)
        if(validatedSessionResponse.status === 'error') {
            const deleteSessionResponse = await deleteSession()
            return deleteSessionResponse.status === 'error' ? deleteSessionResponse : validatedSessionResponse
        }


        const session =  validatedSessionResponse.data
        return {status:'success', data: session}

    } catch (error) {
        return handleErrors(error, {defaultError:'Unexpected error while creating a session'})
    }

}

export async function setCookieSessionExpire():Promise<ActionResponse>{
    try {
        const cookies = await getCookie()
        cookies.set(
            COOKIES_SESSION_EXPIRE_KEY, 
            String(Date.now() + SESSION_EXPIRE_SECONDS * 1000),
            {
                httpOnly:true,
                secure:true,
                sameSite:'lax',
            })
        return {status:'success', data:undefined as never}
    } catch (error) {
        return handleErrors(error, {defaultError:'Unexpected error while setting session expire'})
    }
}

export async function setCookieSessionId(sessionId:string):Promise<ActionResponse>{
    try{
        const cookies = await getCookie()
        cookies.set(COOKIE_SESSION_ID_KEY, sessionId,{
            httpOnly:true,
            secure:true,
            sameSite:'lax',
        })  
        return {status:'success', data:undefined as never}
    }catch(error){
        return handleErrors(error, {defaultError:'Unexpected error setting session id to cookies'})
    }   
    
}
export async function getCookieSessionId():Promise<ActionResponse<string>>{
    try {
        const cookies = await getCookie()
        const sessionId = cookies.get(COOKIE_SESSION_ID_KEY)?.value
        if(!sessionId) return {status:'error', message:'Could not get session id from cookies'}

        return {status:'success', data:sessionId}
    } catch (error) {
        return handleErrors(error, {defaultError:'Unexpected error getting session id to cookies'})
    }
}
export async function getCookieSessionExpire():Promise<ActionResponse<number>>{
    try {
        const cookies = await getCookie()
        const sessionExpire = Number(cookies.get(COOKIES_SESSION_EXPIRE_KEY)?.value)
        if(!sessionExpire) return {status:'error', message:'Could not get session id from cookies'}

        return {status:'success', data:sessionExpire}
    } catch (error) {
        return handleErrors(error, {defaultError:'Unexpected error getting session id to cookies'})
    }
}

export async function sessionExpired():Promise<ActionResponse<boolean>>{
    try {
        const expireResponse = await getCookieSessionExpire()
        if(expireResponse.status === 'error') return expireResponse

        const expire = expireResponse.data
        return {status:'success', data:Date.now() > expire}
    } catch (error) {
        return handleErrors(error, {defaultError:'Unexpected error getting session id to cookies'})
    }
}

export async function deleteSession():Promise<ActionResponse>{
    try {
        const sessionIdResponse = await getCookieSessionId()
        if(sessionIdResponse.status==='error') return sessionIdResponse
        const sessionId = sessionIdResponse.data
        
        const {error:deleteSessionError} = await supabase.from('sessions').delete().eq('sessionId',sessionId)
        if(deleteSessionError) return {status:'error', message:'Could not delete the sessison'}

        const cookie = await getCookie()
        cookie.delete(COOKIE_SESSION_ID_KEY)
        cookie.delete(COOKIES_SESSION_EXPIRE_KEY)
        
        return{
            status:'success',
            data:undefined as never
        }

    } catch (error) {
        return handleErrors(error, {defaultError:'Unexpected error deleting a session'})
    }
}

async function _getCurrentSession():Promise<ActionResponse<CurrentSession>>{
    try {
        const sessionIdResponse = await getCookieSessionId()
        if(sessionIdResponse.status === 'error') return sessionIdResponse

        const sessionId = sessionIdResponse.data

        const {data:sessionData} = await supabase.from('sessions').select('*').eq('sessionId',sessionId).single()

        const validatedSessionResponse = validateApiResponse(sessionSchema, sessionData)
        if(validatedSessionResponse.status === 'error') return validatedSessionResponse
        
        const session = validatedSessionResponse.data
        return {
            status:'success',
            data:session
        }

    } catch (error) {
        return handleErrors(error,{
            ZodError:'Error parsing current session',
            defaultError:'Unexpected error getting current session'
        })
    }
}
export const getCurrentSession = cache(_getCurrentSession)

function _getCurrentUser(options?:{
    redirectToIfNoUser?:null | undefined
}):Promise<ActionResponse<SessionUser>>
function _getCurrentUser(options:{
    redirectToIfNoUser:string
}):Promise<SuccessResponse<SessionUser>>
async function _getCurrentUser(options:{redirectToIfNoUser?:string | null | undefined} = {}):Promise<ActionResponse<SessionUser> | SuccessResponse<SessionUser> | never>{
        const {redirectToIfNoUser} = options
        const currentSessionResponse = await getCurrentSession()
        if(currentSessionResponse.status === 'error'){
            if(redirectToIfNoUser) return redirect(redirectToIfNoUser)    

            return currentSessionResponse   
        }

        const currentUser = currentSessionResponse.data as SessionUser
        console.log('CURRENT SESSION ====>',currentUser)
        return {
            status:'success',
            data:currentUser
        }
}

export const getCurrentUser = cache(_getCurrentUser)
export const getCookie = cache(async()=> await cookies())