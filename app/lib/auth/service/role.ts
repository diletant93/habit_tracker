import { RoleRecord, roleSchema, userRoleJoinSchema } from "@/app/_validationSchemas/role"
import { ActionResponse } from "@/app/types/actions"
import supabase from "@/app/lib/supabase"
import { z, ZodError } from "zod"
import { validateApiResponse } from "@/app/_validationSchemas/utils"
import { handleErrors } from "@/app/_utils/errorHandlers"

export async function getRoleByName(roleName:string):Promise<ActionResponse<RoleRecord>>{
    try {
        const {data:role, error:roleError} = await supabase.from('roles').select('*').eq('name',roleName).single()
        if(!role) return {status:'error', message:'Could not find the role'}

        return {
            status:'success',
            data:roleSchema.parse(role)
        }
    } catch (error) {
        if(error instanceof ZodError){
            return {status:'error', message:'Failed parsing role'}
        }
        return {status:'error',message:'Unexpected error fetching role'}
    }
}
export async function getRoleById(roleId:string):Promise<ActionResponse<RoleRecord>>{
    try {
        const {data:role, error:roleError} = await supabase.from('roles').select('*').eq('id',roleId).single()
        if(roleError) return {status:'error', message:'Error while fetching a role'}
        if(!role) return {status:'error', message:'Could not find the role'}

        return {
            status:'success',
            data:roleSchema.parse(role)
        }
    } catch (error) {
        if(error instanceof ZodError){
            return {status:'error', message:'Failed parsing role'}
        }
        return {status:'error',message:'Unexpected error fetching role'}
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


export async function getRolesIdsByUserId(userId:string):Promise<ActionResponse<Array<{role_id:string}>>>{
    try {
        const {data: rawUserRolesIds} = await supabase.from('users_roles_organizations').select('role_id').eq('user_id',userId)
        const validatedUserRolesIds = validateApiResponse(z.array(z.object({role_id:z.coerce.string()})), rawUserRolesIds)
        if(validatedUserRolesIds.status === 'error') return validatedUserRolesIds

        const roleIds = [...validatedUserRolesIds.data]
        return {status:'success', data:roleIds}

    } catch (error) {
        return handleErrors(error, {
            ZodError:'Error while parsing user role ids',
            defaultError:'Unexpected error while fetching role ids'
        })
    }
}