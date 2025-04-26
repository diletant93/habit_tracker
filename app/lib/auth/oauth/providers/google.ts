import env from "@/app/lib/env/server";
import { OAuthClient } from "../client";
import { z } from "zod";

export function getGoogleClient(){
    const googleClient = new OAuthClient({
        provider:'google',
        clientId:process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        clientSecret:process.env.NEXT_PRIVATE_GOOGLE_CLIENT_SECRET||'',
        urls:{
            auth:'https://accounts.google.com/o/oauth2/v2/auth',
            token:'https://oauth2.googleapis.com/token',
            user:'https://www.googleapis.com/oauth2/v3/userinfo',
        },
        user:{
            schema:googleUserSchema,
            parser:(data)=>{
                return {id: data.sub, name:data.name, email:data.email }
            }
        },
        scopes:['profile','email']
    })
    return googleClient
}
const googleUserSchema = z.object({
    sub:z.string().min(1),
    name:z.string().min(1),
    email:z.string().email()
})