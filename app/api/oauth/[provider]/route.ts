import { getOAuthClient } from "@/app/lib/auth/oauth/providers";
import { OAuthProvider } from "@/app/types/oAuth";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
type GETIncomingData = {
    params:Promise<{provider:OAuthProvider}>;
}
const signInPathError = '/auth/sign-in?error='
export async function GET(request:NextRequest, {params}:GETIncomingData){
    const provider = (await params).provider
    const oAuthClient = getOAuthClient(provider)

    const code = request.nextUrl.searchParams.get('code')
    if(!code) return redirect(`${signInPathError}${encodeURIComponent('InvalidCode')}`)

    const userDataResponse = await oAuthClient.fetchUser(code)
    if(userDataResponse.status === 'error') return redirect(`${signInPathError}${encodeURIComponent('Failed fetching user')}`)
    console.log(userDataResponse.data)
    return redirect('/auth/sign-in')
}