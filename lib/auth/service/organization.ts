import { OrganizationRecord, organizationSchema } from "@/app/_validationSchemas/organization"
import { ActionResponse } from "@/app/types/serverActions"
import supabase from "@/lib/supabase"
import { ZodError } from "zod"

export async function getOrganizationByName(organizationName:string):Promise<ActionResponse<OrganizationRecord>>{
    try {
        const {data:organization, error:organizationError} = await supabase.from('organizations').select('*').eq('name',organizationName).single()
        if(organizationError) return {status:'error', message:'Error while fetching an organization'}
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
