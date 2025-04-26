import { z } from "zod";

export type OAuthProvider = 'google' | 'facebook'

export type OAuthUrls = {
    auth:string;
    token:string;
    user:string;
}
export type OAuthUserParser<T> =(data:T) => {id:string;email:string;name:string;}
export type OAuthUser<T> = {
    schema:z.ZodSchema<T>;
    parser:OAuthUserParser<T>
}
export type OAuthClientConstructorProps<T> = {
    provider:OAuthProvider;
    clientId:string;
    clientSecret:string;
    urls:OAuthUrls;
    scopes:string[];
    user:OAuthUser<T>;
}