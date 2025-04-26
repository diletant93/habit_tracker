import { OAuthProvider } from "@/app/types/oAuth";
import {getGoogleClient} from "./google";

export function getOAuthClient(provider:OAuthProvider){
    switch(provider){
        case 'google':
            return getGoogleClient();
        case 'facebook':
            return getGoogleClient();
        default:
            throw new Error('You gave me wrong provider')
    }
}