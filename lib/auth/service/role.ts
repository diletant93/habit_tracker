import { RoleRecord, roleSchema } from "@/app/_validationSchemas/role"
import { ActionResponse } from "@/app/types/actions"
import supabase from "@/lib/supabase"
import { ZodError } from "zod"

export async function getRoleByName(roleName:string):Promise<ActionResponse<RoleRecord>>{
    try {
        const {data:role, error:roleError} = await supabase.from('roles').select('*').eq('name',roleName).single()
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
