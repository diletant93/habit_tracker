import { z } from "zod";
const userBaseFields = {
    email:z.string().email()
}
export const userSchema = z.object({
    ...userBaseFields,
    name:z.string().min(2),
    created_at:z.string().datetime({offset:true}),
    id:z.coerce.string(),
    password:z.string().min(1).nullable(),
    salt:z.string().min(1).nullable(),
})
export const userCreationSchema = z.object({
    ...userBaseFields,
    name:z.string().min(2),
    password:z.string().min(1).nullable(),
    salt:z.string().min(1).nullable(),
})
export const userSessionSchema = z.object({
    userId:z.coerce.string().min(1),
    roles:z.array(z.enum(['user','admin'])),
    organizations:z.array(z.enum(['google'])),
    permissions:z.array(z.enum(['view','create','update','delete']))
})
export const userRoleOrganizationCreationSchema = z.object({
    user_id:z.coerce.string().min(1),
    role_id:z.coerce.string().min(1),
    organization_id:z.string().min(1)
})

export type UserRecord = z.infer<typeof userSchema>
export type UserToCreate = z.infer<typeof userCreationSchema>
export type SessionUser = z.infer<typeof userSessionSchema>
export type UROToCreate = z.infer<typeof userRoleOrganizationCreationSchema>

    //role:z.enum(['user','admin']),
    // organization:z.enum(['google'])