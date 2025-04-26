import { OAuthProfileToCreate } from "@/app/_validationSchemas/oAuthProfile";
import { OAuthProvider } from "@/app/types/oAuth";
import { createUser, getUser, userExists } from "../service/user";
import { ActionResponse } from "@/app/types/actions";
import { SessionUser, UserRecord } from "@/app/_validationSchemas/user";
import supabase from "../../supabase";
import { handleErrors } from "@/app/_utils/errorHandlers";

export async function createOAuthProfile(provider:OAuthProvider, {id,email,name}:{id:string;  email:string;name:string;}):Promise<ActionResponse<UserRecord>>{
    const isExistingUserResponse = await userExists(email)
    if(isExistingUserResponse.status === 'error') return isExistingUserResponse
    const exists = isExistingUserResponse.data

    let user:UserRecord
    if(!exists){
        const createUserResponse = await createUser({name,email})
        if(createUserResponse.status === 'error') return createUserResponse

        user = createUserResponse.data
    }else{
        const userResponse = await getUser({email})
        if(userResponse.status === 'error') return userResponse
        user = userResponse.data
    }

   const profileExistsResponse = await oAuthProfileExists(provider, user.id)
   if(profileExistsResponse.status === 'error')  return profileExistsResponse

   const profileExists = profileExistsResponse.data
   if(profileExists) return {status:'success', data:user}  
   
   try {
    const profileToCreate :OAuthProfileToCreate = { 
        userId:user.id,
        provider,
        providerAccountId:id
    } 
    await supabase.from('o_auth_accounts').insert([profileToCreate])
    return {status:'success', data:user}
   } catch (error) {
        await deleteOAuthProfile(provider, user.id)
       return handleErrors(error, {defaultError:'Unexpected error creating auth profile'})
   }
}   

export async function oAuthProfileExists(provider:OAuthProvider, userId:string):Promise<ActionResponse<boolean>>{
    try {
        const {data:existingProfile} = await supabase.from('o_auth_accounts').select('id').eq('userId',userId).eq('provider',provider).single()
        return {status:'success', data:Boolean(existingProfile)}
    } catch (error) {
        return handleErrors(error,{defaultError:'Unexpected error checking oAuth profile'})
    }
}
export async function deleteOAuthProfile(provider:OAuthProvider, userId:string):Promise<ActionResponse>{
    try {
        const {error} = await supabase.from('o_auth_accounts').delete().eq('userId',userId).eq('provider',provider)
        return {status:'success', data:undefined as never}
    } catch (error) {
        return handleErrors(error,{defaultError:'Unexpected error checking oAuth profile'})
    }
}