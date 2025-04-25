import { z } from "zod";

export const roleSchema = z.object({
    id:z.coerce.string().min(1),
    created_at:z.string().datetime({offset:true}),
    name:z.enum(['user','admin'])
})
export const userRoleJoinSchema = z.object({
    role_id:z.coerce.string().min(1),
    roles:roleSchema
})
export type RoleRecord = z.infer<typeof roleSchema> 