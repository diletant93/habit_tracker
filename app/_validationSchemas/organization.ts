import { z } from "zod";

export const organizationSchema = z.object({
    id:z.string().min(1),
    created_at:z.string().datetime(),
    name:z.string().min(1)
})
export const userOrganizationJoinSchema = z.object({
    organization_id:z.string().min(1),
    organizations:organizationSchema
})
export type OrganizationRecord = z.infer<typeof organizationSchema> 