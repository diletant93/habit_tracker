import { OAuthClientConstructorProps, OAuthProvider, OAuthUrls, OAuthUser, OAuthUserParser } from "@/app/types/oAuth";
import { ActionResponse } from "@/app/types/actions";
import { z } from "zod";
import { validateApiResponse } from "@/app/_validationSchemas/utils";
import { handleErrors } from "@/app/_utils/errorHandlers";

export class OAuthClient<T>{
    private readonly provider: OAuthProvider;
    private readonly urls:OAuthUrls; 
    private readonly clientId:string;
    private readonly clientSecret:string;
    private readonly scopes:string[];
    private readonly tokenSchema = z.object({
        access_token:z.string().min(1),
        token_type:z.string().min(1)
    })
    private readonly user: OAuthUser<T>;
    constructor({provider, urls, clientId,scopes, clientSecret,user}:OAuthClientConstructorProps<T>){
        this.provider = provider
        this.urls = urls
        this.clientId = clientId
        this.scopes = scopes
        this.clientSecret = clientSecret
        this.user = user
    }
    get redirectUrl(){
        console.log({provider:this.provider, uri:process.env.NEXT_PUBLIC_BASE_REDIRECT_URL})
        return new URL(this.provider,process.env.NEXT_PUBLIC_BASE_REDIRECT_URL)
    }
    createAuthUrl(){
        const url = new URL(this.urls.auth)
        url.searchParams.set('redirect_uri', this.redirectUrl.toString())
        url.searchParams.set('client_id',this.clientId)
        url.searchParams.set('response_type','code')
        url.searchParams.set('scope',this.scopes.join(' '))
        return url.toString()
    }
    async fetchUser(code:string):Promise<ActionResponse<ReturnType<OAuthUserParser<T>>>>{
        try {
            const tokenResponse = await this.fetchToken(code)
            if(tokenResponse.status === 'error') return tokenResponse
            const {accessToken, tokenType} = tokenResponse.data 
            const response = await fetch(this.urls.user,{
                headers:{
                    Authorization:`${tokenType} ${accessToken}`
                }
            })
            const data = await response.json()
            const validatedUserResponse = validateApiResponse(this.user.schema, data)
            if(validatedUserResponse.status ==='error') return validatedUserResponse
            return {
                status:'success',
                data:this.user.parser(validatedUserResponse.data)
            }
        } catch (error) {
            return handleErrors(error,{defaultError:'Unexpected error fetching user data'})
        }
    }
    async fetchToken(code:string):Promise<ActionResponse<{accessToken:string; tokenType:string;}>>{
        try {
            const response = await fetch(this.urls.token,{
                method:'POST',
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    Accept:'application/json',
                },
                body:new URLSearchParams({
                    code,
                    client_id:this.clientId,
                    client_secret:this.clientSecret,
                    redirect_uri:this.redirectUrl.toString(),
                    grant_type:'authorization_code',
                })
            })
            const data = await response.json()
            console.log(data)
            const validatedTokenResponse = validateApiResponse(this.tokenSchema, data)
            if(validatedTokenResponse.status === 'error') return validatedTokenResponse
            const token = validatedTokenResponse.data
            return {
                status:'success',
                data:{
                    accessToken:token.access_token,
                    tokenType:token.token_type,
                }
            }
        } catch (error) {
            return handleErrors(error,{defaultError:'Unexpected error fetching token'})
        }
    }
}