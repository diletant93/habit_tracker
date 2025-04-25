import { NextRequest, NextResponse } from "next/server";
import { COOKIE_SESSION_ID_KEY } from "./app/_constants/session";
import { deleteSession, sessionExpired } from "./app/lib/auth/service/session";

export async function middleware(request:NextRequest){
    const authGateResponse = authGate(request)
    if(authGateResponse) return authGateResponse

    const handleSessionExpiryResponse = await handleSessionExpiry()
    if(handleSessionExpiryResponse) return handleSessionExpiryResponse


    return  NextResponse.next()
}

function authGate(request:NextRequest):NextResponse | null{
    const url = request.nextUrl.clone()
    const sessionId = request.cookies.get(COOKIE_SESSION_ID_KEY)?.value
    
    const isAuthUrl = url.pathname.startsWith('/auth')
    
    if(isAuthUrl && sessionId){
        const redirectUrl = new URL('/',request.nextUrl)
        return NextResponse.redirect(redirectUrl)
    }
    return null
}
async function handleSessionExpiry():Promise<NextResponse | null>{
    const isSessionExpiredResponse = await sessionExpired()
    if(isSessionExpiredResponse.status==='error') return NextResponse.next()
    
    const isSessionExpired = isSessionExpiredResponse.data
    if(!isSessionExpired) return null

    const deleteResponse = await deleteSession()
    if(deleteResponse.status==='error') return NextResponse.next()

    return null
}
export const config={
    matcher:['/auth/:path*']
}