import { NextRequest, NextResponse } from "next/server";
import { deleteSession, getCurrentSession, sessionExpired, setNewCookieSessionExpire, updateSession } from "./app/lib/auth/service/session";
import { SESSION_EXPIRE_SECONDS } from "./app/_constants/session";

export async function middleware(request:NextRequest){
    const handleSessionExpiryResponse = await handleSessionExpiry(request)
    if(handleSessionExpiryResponse) return handleSessionExpiryResponse

    const authorizedGateResponse = await authorizedGate(request)
    if(authorizedGateResponse) return authorizedGateResponse
    
    const refreshSessionExpiryResponse = await refreshSessionExpiry(request)
    if(refreshSessionExpiryResponse) return refreshSessionExpiryResponse

    return  NextResponse.next()
}
async function authorizedGate(request: NextRequest):Promise<NextResponse | null>{
    const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
    const sessionResponse = await getCurrentSession()
    const isAuthenticated = sessionResponse.status === 'success'
    if(!isAuthenticated && !isAuthRoute) {
        const redirectUrl = new URL('/auth/sign-in',request.nextUrl)
        return NextResponse.redirect(redirectUrl)
    }
    if(isAuthenticated && isAuthRoute){
        const redirectUrl = new URL('/',request.nextUrl)
        return NextResponse.redirect(redirectUrl)
    }
    return null
}
async function handleSessionExpiry(request:NextRequest):Promise<NextResponse | null>{
    const isSessionExpiredResponse = await sessionExpired()
    if(isSessionExpiredResponse.status==='error') return NextResponse.next()
    
    const isSessionExpired = isSessionExpiredResponse.data
    if(!isSessionExpired) return null

    const deleteResponse = await deleteSession()
    if(deleteResponse.status==='error') return NextResponse.next()
    
    const redirectUrl = new URL('/auth/sign-in?expired=true',request.nextUrl)
    return NextResponse.redirect(redirectUrl)
}
async function refreshSessionExpiry(request:NextRequest):Promise<NextResponse | null>{
    const updatedSessionResponse = await updateSession({expire:new Date(Date.now() + SESSION_EXPIRE_SECONDS * 1000).toISOString()})
    if(updatedSessionResponse.status === 'error') return NextResponse.next()

    const setCookieSessionExpireRespone = await setNewCookieSessionExpire()
    if(setCookieSessionExpireRespone.status === 'error') return NextResponse.next()
    
    return null
}

export const config={
    matcher: [
        '/',
        '/welcome',

        '/auth/:path*'
    ],
}