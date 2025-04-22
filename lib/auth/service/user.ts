import { userSchema, UserToCreate } from "@/app/_validationSchemas/user";
import { validateApiResponse } from "@/app/_validationSchemas/utils";
import { ActionResponse } from "@/app/types/serverActions";
import supabase from "@/lib/supabase";

export async function userExists(email:string):Promise<ActionResponse<boolean>>{
    try {
        const {data, error} = await supabase.from('users').select('id').eq('email',email).single()
        if(error) return {status:'error', message:'Error while checking if user exists'}
        return {status:'success', data:Boolean(data)}
    } catch (error) {
        return {status:'error', message:'Unexpected error checking user existance'}
    }
}

export async function createUser(userData: UserToCreate){
    try {
        const userExistsResponse = await userExists(userData.email)
        if(userExistsResponse.status === 'error') return userExistsResponse
        if(userExistsResponse.status === 'success' && userExistsResponse.data) return {status:'error', message:'User already exists'}

        const {data, error:createdUserError} = await supabase.from('users').insert([userData]).select('*').single()
        if(createdUserError || !data) return {status:'error', message:'Error while creating a new user'}
        
        const validatedCreatedUserResponse = validateApiResponse(userSchema, data)
        if(validatedCreatedUserResponse.status === 'error' || !validatedCreatedUserResponse.data) return validatedCreatedUserResponse

        const {id:userId} = validatedCreatedUserResponse.data


    } catch (error) {
        
    }
}