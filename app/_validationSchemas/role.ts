import { z } from "zod";

export const roleSchema = z.object({
    id:z.string().min(1),
    created_at:z.string().datetime(),
    name:z.string().min(1)
})
export const userRoleJoinSchema = z.object({
    role_id:z.string().min(1),
    roles:roleSchema
})
export type RoleRecord = z.infer<typeof roleSchema> 