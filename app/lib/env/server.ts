import { z } from "zod";

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON: z.string().min(1),
  NEXT_PRIVATE_SUPABASE_SECRET_ROLE: z.string().min(1),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1),
  NEXT_PRIVATE_GOOGLE_CLIENT_SECRET: z.string().min(1),
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  NEXT_PUBLIC_BASE_REDIRECT_URL: z.string().url(),
});

const relevantEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON: process.env.NEXT_PUBLIC_SUPABASE_ANON,
  NEXT_PRIVATE_SUPABASE_SECRET_ROLE: process.env.NEXT_PRIVATE_SUPABASE_SECRET_ROLE,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PRIVATE_GOOGLE_CLIENT_SECRET: process.env.NEXT_PRIVATE_GOOGLE_CLIENT_SECRET,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_BASE_REDIRECT_URL: process.env.NEXT_PUBLIC_BASE_REDIRECT_URL,
};

console.log("RELEVANT ENV VARS:", relevantEnvVars);

const result = serverEnvSchema.safeParse(relevantEnvVars);
const env = result.data
export default env;
