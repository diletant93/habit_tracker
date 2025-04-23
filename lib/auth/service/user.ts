import { OrganizationRecord, organizationSchema } from "@/app/_validationSchemas/organization";
import { RoleRecord, roleSchema } from "@/app/_validationSchemas/role";
import { UserRecord, userSchema, UserToCreate } from "@/app/_validationSchemas/user";
import { validateApiResponse } from "@/app/_validationSchemas/utils";
import { ActionResponse } from "@/app/types/serverActions";
import supabase from "@/lib/supabase";
import { ZodError } from "zod";
import { getRoleByName } from "./role";
import { getOrganizationByName } from "./organization";

export async function userExists(email:string):Promise<ActionResponse<boolean>>{
    try {
        const {data, error} = await supabase.from('users').select('id').eq('email',email).single()
        if(error) return {status:'error', message:'Error while checking if user exists'}
        return {status:'success', data:Boolean(data)}
    } catch (error) {
        return {status:'error', message:'Unexpected error checking user existance'}
    }
}

export async function createUser(userData: UserToCreate):Promise<ActionResponse<UserRecord>>{
    try {
        const userExistsResponse = await userExists(userData.email)
        if(userExistsResponse.status === 'error') return userExistsResponse
        if(userExistsResponse.status === 'success' && userExistsResponse.data) return {status:'error', message:'User already exists'}

        const {data, error:createdUserError} = await supabase.from('users').insert([userData]).select('*').single()
        if(createdUserError || !data) return {status:'error', message:'Error while creating a new user'}
        
        const validatedCreatedUserResponse = validateApiResponse(userSchema, data)
        if(validatedCreatedUserResponse.status === 'error') return validatedCreatedUserResponse

        const validatedCreatedUser = validatedCreatedUserResponse.data

        const createUROResponse = await createUserRoleOrganization(validatedCreatedUser.id)
        if(createUROResponse.status == 'error')  return createUROResponse

        return {
            status:'success',
            data:validatedCreatedUser
        }

    } catch (error) {
        if(error instanceof ZodError){
            return {status:'error', message:'Failed parsing the created user'}
        }
        return {status:'error', message:'Unexpected error checking user existance'}
    }
}

export async function createUserRoleOrganization(
    userId:string, 
    roleName:string = 'user', 
    organizationName:string = 'organization'
    ):Promise<ActionResponse<void>>{
    try {
        const [getRoleResponse, getOrganizationResponse] = await Promise.all([
            getRoleByName(roleName),
            getOrganizationByName(organizationName)
        ])

        if(getRoleResponse.status === 'error') return getRoleResponse
        if(getOrganizationResponse.status === 'error') return getOrganizationResponse


        const {id:roleId} = getRoleResponse.data
        const {id:organizationId} = getOrganizationResponse.data
        const UROToCreate = {
            user_id:userId,
            role_id:roleId,
            organization_id:organizationId
        }
        const {error:createdUROError} =
         await supabase.from('users_roles_organizations').insert([UROToCreate])
        
         if(createdUROError) return {status:'error', message:'Failed creating URO record'}
         return {status:'success', data:undefined as void}
    } catch (error) {
        return {status:'error', message:'Unexpected error checking user existance'}
    }
}

