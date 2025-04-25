import { PermissionRecord, rolePermissionJoinSchema } from "@/app/_validationSchemas/permission"
import { ActionResponse } from "@/app/types/actions"
import { getRolesIdsByUserId } from "./role"
import supabase from "../../supabase"
import { validateApiResponse } from "@/app/_validationSchemas/utils"
import { z } from "zod"
import { handleErrors } from "@/app/_utils/errorHandlers"

export async function getPermissionsByUserId(userId:string):Promise<ActionResponse<PermissionRecord[]>>{
    try {
        const roleIdsResponse = await getRolesIdsByUserId(userId)
        if(roleIdsResponse.status === 'error') return roleIdsResponse
        const roleIds = roleIdsResponse.data.map(roleIdObject => roleIdObject.role_id)


        const {data:rawRolePermissionsJoins} = await supabase.from('roles_permissions').select('permission_id, permissions(*)').in('role_id',roleIds)
        const validatedRolePermissionsJoinResponse = validateApiResponse(z.array(rolePermissionJoinSchema), rawRolePermissionsJoins)
        if(validatedRolePermissionsJoinResponse.status === 'error') return validatedRolePermissionsJoinResponse

        const userPermissions = validatedRolePermissionsJoinResponse.data.map(rolePermissionJoin => rolePermissionJoin.permissions)
        return {
            status:'success',
            data:userPermissions
        }

    } catch (error) {
        return handleErrors(error,{
            defaultError:'Unexpected error while fetching user permissions',
            ZodError:'Failed parsing user organizations',
        })
    }
}
