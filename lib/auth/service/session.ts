import { SessionRecord } from "@/app/_validationSchemas/session";
import { ActionResponse } from "@/app/types/serverActions";
import { getOrganizationsByUserId, getPermissionsByUserId, getRolesByUserId } from "./user";
import { generateSecretKey } from "../crypto";
import { checkForErrors } from "@/app/_utils/errorHandlers";

export async function createSession(user: {id:string}):Promise<ActionResponse<SessionRecord>>{
    try {
        if(!('id' in user))return {status:'error', message:'Pass user id to create session'}
        const [getRolesResponse, getOrganizationsResponse, getPermissionsResponse] = await Promise.all([
            getRolesByUserId(user.id),
            getOrganizationsByUserId(user.id),
            getPermissionsByUserId(user.id)
        ]);

        const maybeErrorResponse = checkForErrors([getRolesResponse, getOrganizationsResponse, getPermissionsResponse])
        if(maybeErrorResponse) return maybeErrorResponse

        

        const sessionId = generateSecretKey()
        const sessionToCreate = {
            userId:user.id,
            expire:Date.now() + SESSION_EXPIRE_SECONDS * 1000,
            sessionId,
            
        }

    } catch (error) {
        
    }

}