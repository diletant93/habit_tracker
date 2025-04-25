import { z } from "zod";

export const permissionSchema = z.object({
    id:z.coerce.string().min(1),
    created_at:z.string().datetime({offset:true}),
    name:z.enum(['view','create','delete','update'])
})
export const rolePermissionJoinSchema = z.object({
    permission_id:z.coerce.string().min(1),
    permissions:permissionSchema,
})
export type PermissionRecord = z.infer<typeof permissionSchema> 