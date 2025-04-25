import { OrganizationRecord} from "@/app/_validationSchemas/organization";
import { RoleRecord } from "@/app/_validationSchemas/role";
import { UserRecord, userSchema, UserToCreate } from "@/app/_validationSchemas/user";
import { validateApiResponse } from "@/app/_validationSchemas/utils";
import { ActionResponse } from "@/app/types/actions";
import supabase from "@/app/lib/supabase";
import { getRoleByName, getRolesByUserId } from "./role";
import { getOrganizationByName, getOrganizationsByUserId } from "./organization";
import { PermissionRecord} from "@/app/_validationSchemas/permission";
import { ensureAllSuccess, handleErrors } from "@/app/_utils/errorHandlers";
import { getPermissionsByUserId } from "./permission";

export async function userExists(email:string):Promise<ActionResponse<boolean>>{
    try {
        const {data} = await supabase.from('users').select('id').eq('email',email).single()
        return {status:'success', data:Boolean(data)}
    } catch (error) {
        return handleErrors(error, {defaultError:'Unexpected error checking user existance'})
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
        if(validatedCreatedUserResponse.status === 'error'){
            const deleteUserResponse = await deleteUser({id:(data as {id:string}).id})
            return deleteUserResponse.status === 'error' ? deleteUserResponse : validatedCreatedUserResponse
        }

        const validatedCreatedUser = validatedCreatedUserResponse.data

        const createUROResponse = await createUserRoleOrganization(validatedCreatedUser.id)
        if(createUROResponse.status == 'error'){
            const deleteUserResponse = await deleteUser(validatedCreatedUser)
            return deleteUserResponse.status === 'error' ? deleteUserResponse : createUROResponse
        }

        return {
            status:'success',
            data:validatedCreatedUser
        }

    } catch (error) {
        return handleErrors(error, {
            defaultError:'Unexpected error checking user existance',
            ZodError:'Failed parsing the created user'
        })
    }
}

export async function getUser(user:{email:string} | {id:string}):Promise<ActionResponse<UserRecord>>{
    try {
        let query = supabase.from('users').select('*')
        if('id' in user){
            query = query.eq('id',user.id)
        }
        if('email' in user){
            query = query.eq('email',user.email)
        }
        const {data:rawFetchedUser} = await query.single()
        if(!rawFetchedUser) return {status:'error',message:'Could not fetch the user by the given id or email'}

        const validatedFetchedUserResponse = validateApiResponse(userSchema, rawFetchedUser)
        if(validatedFetchedUserResponse.status === 'error') return validatedFetchedUserResponse

        const validatedFetchedUser = validatedFetchedUserResponse.data
        return {
            status:'success',
            data:validatedFetchedUser
        }
    } catch (error) {
        return handleErrors(error,{
            ZodError:'Could not parse fetched user',
            defaultError:'Unexpected error while fetching user'
        })
    }
}
export async function createUserRoleOrganization(
    userId:string, 
    roleName:string = 'user', 
    organizationName:string = 'google'
    ):Promise<ActionResponse>{
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
         return {status:'success', data:undefined as never}
    } catch (error) {
        return handleErrors(error, {defaultError:'Unexpected error checking user existance'})
    }
}

export async function deleteUser(user:{id:string} | {email:string} ):Promise<ActionResponse>{
    try {
        let query = supabase.from('users').delete()

        if('id' in user){
            query = query.eq('id',user.id)
        }
        if('email' in user){
            query = query.eq('email',user.email)
        }

        const {error:deletedUserError} = await query
        if(deletedUserError) return {status:'error', message:'Failed deleting user'}

        return {status:'success', data:undefined as never}
    } catch (error) {
        return handleErrors(error, {defaultError:'Unexpected error deleting user existance'})
    }
}

export async function getUserContext(userId:string):Promise<ActionResponse<{
    roles:RoleRecord[];
    organizations:OrganizationRecord[];
    permissions:PermissionRecord[];
}>>{
    try {
        const [rolesResponse, organizationsResponse, permissionsResponse] = await Promise.all([
                    getRolesByUserId(userId),
                    getOrganizationsByUserId(userId),
                    getPermissionsByUserId(userId)
                ]);

                
        if(rolesResponse.status === 'error') return rolesResponse
        if(organizationsResponse.status === 'error') return organizationsResponse
        if(permissionsResponse.status === 'error') return permissionsResponse

        const roles = rolesResponse.data
        const organizations = organizationsResponse.data
        const permissions = permissionsResponse.data
       
        return {
            status:'success',
            data:{roles, organizations, permissions}
        }
        
    } catch (error) {
        return handleErrors(error,{defaultError:'Unexpected error while fetching user context'})
    }
}
