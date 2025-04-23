import { z } from "zod";

export const sessionSchema = z.object({
    id:z.coerce.string().min(1),
    created_at:z.string().datetime({offset:true}),
    userid:z.coerce.string().min(1),
    expire:z.string().datetime(),
    sessionid:z.coerce.string().min(1),
    permissions:z.array(z.enum(['view','create','update','delete'])),
    roles:z.array(z.enum(['user','admin'])),
    organizations:z.array(z.enum(['google']))
})

export type SessionRecord = z.infer<typeof sessionSchema>