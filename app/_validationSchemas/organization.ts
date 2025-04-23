import { z } from "zod";

export const organizationSchema = z.object({
    id:z.string().min(1),
    created_at:z.string().datetime(),
    name:z.string().min(1)
})

export type OrganizationRecord = z.infer<typeof organizationSchema> 