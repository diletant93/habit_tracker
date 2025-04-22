import supabase from "@/lib/supabase";
import { SignInSchema, SignUpSchema } from "../_validationSchemas/auth";
import { ActionResponse } from "../types/serverActions";

export async function signUp(formData : SignUpSchema):Promise<ActionResponse<null>>{
    const {data, error} = await supabase.from('comments').select('*').eq('id',6).single()
    if(error || !data) return {status:'error', message:'Failed fetching'}
    return {
        status:'success',
        message:`Success:${(data as {body:string}).body}`
    }
}
export async function signIn(formData : SignInSchema):Promise<ActionResponse<null>>{
    return {
        status:'success',
        message:'Success'
    }
}