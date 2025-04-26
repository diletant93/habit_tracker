import { redirect } from "next/navigation";
import { getOAuthClient } from "../lib/auth/oauth/providers";
import { OAuthProvider } from "../types/oAuth";

export async function signIn(provider:OAuthProvider){
    const oAuthClient = getOAuthClient(provider)
    const oAuthUrl = oAuthClient.createAuthUrl()
    return redirect(oAuthUrl)
}