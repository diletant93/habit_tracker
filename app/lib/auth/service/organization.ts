import { OrganizationRecord, organizationSchema, userOrganizationJoinSchema } from "@/app/_validationSchemas/organization"
import { ActionResponse } from "@/app/types/actions"
import supabase from "@/app/lib/supabase"
import { z, ZodError } from "zod"
import { validateApiResponse } from "@/app/_validationSchemas/utils"
import { handleErrors } from "@/app/_utils/errorHandlers"

export async function getOrganizationByName(organizationName:string):Promise<ActionResponse<OrganizationRecord>>{
    try {
        const {data:organization} = await supabase.from('organizations').select('*').eq('name',organizationName).single()
        if(!organization) return {status:'error', message:'Could not find the organization'}

        return {
            status:'success',
            data:organizationSchema.parse(organization)
        }
        
    } catch (error) {
        if(error instanceof ZodError){
            return {status:'error', message:'Failed parsing organization'}
        }
        return {status:'error',message:'Unexpected error fetching organization'}
    }
}

export async function getOrganizationsByUserId(userId:string):Promise<ActionResponse<OrganizationRecord[]>>{
    try {
        const {data:rawUserOrganizationsJoin} = await supabase.from('users_roles_organizations').select('organization_id, organizations(*)').eq('user_id',userId)

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