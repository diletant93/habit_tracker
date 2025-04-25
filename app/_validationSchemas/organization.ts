import { z } from "zod";

export const organizationSchema = z.object({
    id:z.coerce.string().min(1),
    created_at:z.string().datetime({offset:true}),
    name:z.enum(['google'])
})
export const userOrganizationJoinSchema = z.object({
    organization_id:z.coerce.string().min(1),
    organizations:organizationSchema
})
export type OrganizationRecord = z.infer<typeof organizationSchema> 