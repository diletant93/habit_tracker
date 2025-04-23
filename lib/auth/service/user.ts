import { OrganizationRecord, organizationSchema, userOrganizationJoinSchema } from "@/app/_validationSchemas/organization";
import { RoleRecord, roleSchema, userRoleJoinSchema } from "@/app/_validationSchemas/role";
import { UserRecord, userSchema, UserToCreate } from "@/app/_validationSchemas/user";
import { validateApiResponse } from "@/app/_validationSchemas/utils";
import { ActionResponse } from "@/app/types/serverActions";
import supabase from "@/lib/supabase";
import { z } from "zod";
import { getRoleByName } from "./role";
import { getOrganizationByName } from "./organization";
import { PermissionRecord, userPermissionsJoinSchema } from "@/app/_validationSchemas/permission";
import { handleErrors } from "@/app/_utils/errorHandlers";

export async function userExists(email:string):Promise<ActionResponse<boolean>>{
    try {
        const {data, error} = await supabase.from('users').select('id').eq('email',email).single()
        if(error) return {status:'error', message:'Error while checking if user exists'}
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
        if(validatedCreatedUserResponse.status === 'error') return validatedCreatedUserResponse

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

export async function createUserRoleOrganization(
    userId:string, 
    roleName:string = 'user', 
    organizationName:string = 'organization'
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

export async function getRolesByUserId(userId:string):Promise<ActionResponse<RoleRecord[]>>{
    try {
        const {data:rawUserRolesJoin, error:rawUserRolesJoinError} = await supabase.from('users_roles_organizations').select('role_id, roles(*)').eq('user_id',userId)
        if(rawUserRolesJoinError) return {status:'error', message:'Failed fetching user roles'}

        const validatedUserRolesJoinResponse = validateApiResponse(z.array(userRoleJoinSchema),rawUserRolesJoin)

        if(validatedUserRolesJoinResponse.status === 'error') return validatedUserRolesJoinResponse

        const userRoles = validatedUserRolesJoinResponse.data.map(userRoleJoin => userRoleJoin.roles)
        return {
            status:'success',
            data:userRoles
        }

    } catch (error) {
        return handleErrors(error,{
            defaultError:'Unexpected error while fetching user roles',
            ZodError:'Failed parsing user roles',
        })
    }
}   

export async function getPermissionsByUserId(userId:string):Promise<ActionResponse<PermissionRecord[]>>{
    try {
        const {data:rawUserPermissionsJoin, error:rawUserPermissionsJoinError} = await supabase.from('users_roles_organizations').select('roles_permissions(permission_id, permissions(*))').eq('user_id',userId)
        if(rawUserPermissionsJoinError) return {status:'error', message:'Failed fetching user permissions'}

        const validatedUserPermissionJoinResponse = validateApiResponse(z.array(userPermissionsJoinSchema), rawUserPermissionsJoin)
        if(validatedUserPermissionJoinResponse.status === 'error') return validatedUserPermissionJoinResponse

        const userPermissions = validatedUserPermissionJoinResponse.data.map(item => item.role_permissions.permissions)
        return {
            status:'success',
            data:userPermissions
        }

    } catch (error) {
        return handleErrors(error,{
            defaultError:'Unexpected error while fetching user organizations',
            ZodError:'Failed parsing user organizations',
        })
    }
}

export async function getOrganizationsByUserId(userId:string):Promise<ActionResponse<OrganizationRecord[]>>{
    try {
        const {data:rawUserOrganizationsJoin, error:rawUserOrganizationsJoinError} = await supabase.from('users_roles_organizations').select('organization_id, organizations(*)').eq('user_id',userId)
        if(rawUserOrganizationsJoinError) return {status:'error', message:'Failed fetching user organizations'}

        const validatedUserOrganizationsJoinResponse = validateApiResponse(z.array(userOrganizationJoinSchema),rawUserOrganizationsJoin)

        if(validatedUserOrganizationsJoinResponse.status === 'error') return validatedUserOrganizationsJoinResponse

        const userOrganizations = validatedUserOrganizationsJoinResponse.data.map(userOrganizaitonJoin => userOrganizaitonJoin.organizations)
        return {
            status:'success',
            data:userOrganizations
        }

    } catch (error) {
        return handleErrors(error,{
            defaultError:'Unexpected error while fetching user organizations',
            ZodError:'Failed parsing user organizations',
        })
    }
}