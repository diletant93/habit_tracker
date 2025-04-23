import { z } from "zod";

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON: z.string().min(1),
  NEXT_PRIVATE_SUPABASE_SECRET_ROLE:z.string().min(1)
});
const env = serverEnvSchema.parse(process.env)

export default env;