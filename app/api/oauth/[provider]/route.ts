import { createOAuthProfile } from "@/app/lib/auth/oauth/oAuthProfile";
import { getOAuthClient } from "@/app/lib/auth/oauth/providers";
import { createSession } from "@/app/lib/auth/service/session";
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

    const profileDataResponse = await oAuthClient.fetchProfile(code)
    if(profileDataResponse.status === 'error') return redirect(`${signInPathError}${encodeURIComponent('Failed fetching user')}`)
    
    const profileData = profileDataResponse.data
    const createOAuthProfileResponse = await createOAuthProfile(provider, profileData)

    if(createOAuthProfileResponse.status === 'error') return redirect(`${signInPathError}${encodeURIComponent('OAuth profile error')}`)

    const user = createOAuthProfileResponse.data
    const createSessionResponse = await createSession(user)

    if(createSessionResponse.status === 'error') return redirect(`${signInPathError}${encodeURIComponent('Creating session error')}`)
    

    return redirect('/auth/sign-in')
}