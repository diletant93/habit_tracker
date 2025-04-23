import { z } from "zod";

export const roleSchema = z.object({
    id:z.string().min(1),
    created_at:z.string().datetime(),
    name:z.string().min(1)
})

export type RoleRecord = z.infer<typeof roleSchema> 