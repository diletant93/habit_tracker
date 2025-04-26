import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON: z.string().min(1),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID:z.string().min(1),
  NEXT_PUBLIC_BASE_URL:z.string().min(1),
  NEXT_PUBLIC_BASE_REDIRECT_URL:z.string().min(1),
});

const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON: process.env.NEXT_PUBLIC_SUPABASE_ANON,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_BASE_REDIRECT_URL: process.env.NEXT_PUBLIC_BASE_REDIRECT_URL,
};

export default clientEnvSchema.parse(env);