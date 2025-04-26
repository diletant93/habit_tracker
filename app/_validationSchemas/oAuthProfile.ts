import { z } from "zod";
const profileBaseFields = {
    userId:z.string().min(1),
    provider:z.enum(['google','facebook']),
    providerAccountId:z.string().min(1),
}
export const oAuthProfileSchema = z.object({
    ...profileBaseFields,
    id:z.string().min(1),
    created_at:z.string().datetime({offset:true}),
})
export const oAuthProfileCreatingSchema = z.object({
    ...profileBaseFields
})
export type OAuthProfile = z.infer<typeof oAuthProfileSchema>
export type OAuthProfileToCreate = z.infer<typeof oAuthProfileCreatingSchema>