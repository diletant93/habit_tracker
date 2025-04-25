import { NextRequest, NextResponse } from "next/server";
import { deleteSession, getCurrentSession, sessionExpired } from "./app/lib/auth/service/session";

export async function middleware(request:NextRequest){
    const authorizedGateResponse = await authorizedGate(request)
    if(authorizedGateResponse) return authorizedGateResponse
    
    const handleSessionExpiryResponse = await handleSessionExpiry()
    if(handleSessionExpiryResponse) return handleSessionExpiryResponse


    return  NextResponse.next()
}
async function authorizedGate(request: NextRequest):Promise<NextResponse | null>{
    const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
    const sessionResponse = await getCurrentSession()
    const isAuthenticated = sessionResponse.status === 'success'
    console.log({sessionResponse, isAuthenticated})
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
async function handleSessionExpiry():Promise<NextResponse | null>{
    const isSessionExpiredResponse = await sessionExpired()
    if(isSessionExpiredResponse.status==='error') return NextResponse.next()
    
    const isSessionExpired = isSessionExpiredResponse.data
    if(!isSessionExpired) return null

    const deleteResponse = await deleteSession()
    if(deleteResponse.status==='error') return NextResponse.next()
    
    const redirectUrl = new URL('/auth/sign-in?expired=true')
    return NextResponse.redirect(redirectUrl)
}
export const config={
    matcher: [
        '/',
        '/welcome',

        '/auth/:path*'
    ],
}