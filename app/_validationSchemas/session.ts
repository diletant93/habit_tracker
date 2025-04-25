import { TypeOf, z } from "zod";
const baseSessionSchema = {
    userId:z.coerce.string().min(1),
    expire:z.string().datetime({offset:true}),
    sessionId:z.coerce.string().min(1),
    permissions:z.array(z.enum(['view','create','update','delete'])),
    roles:z.array(z.enum(['user','admin'])),
    organizations:z.array(z.enum(['google']))
}

const coreSessionSchema = z.object(baseSessionSchema)
const partialCoreSessionSchema = coreSessionSchema.partial()

export const sessionSchema = z.object({
    ...baseSessionSchema,
    id:z.coerce.string().min(1),
    created_at:z.string().datetime({offset:true}),
})

export const sessionCreationSchema = coreSessionSchema

export const currentSessionSchema = coreSessionSchema

export type SessionRecord = z.infer<typeof sessionSchema>
export type SessionToCreate = z.infer<typeof sessionCreationSchema>
export type CurrentSession = z.infer<typeof sessionCreationSchema>
export type SessionToUpdate = z.infer<typeof partialCoreSessionSchema>