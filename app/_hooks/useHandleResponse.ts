import { useRouter } from "next/navigation";
import { useActionToast } from "./useActionToast";
import { ActionResponse } from "../types/actions";

export function useHandleResponse(){
    const {actionToast} = useActionToast()
    const router = useRouter()
    function handleResponse<T>(response:ActionResponse<T>,options?:{redirectTo:string}){
        const {redirectTo} = options || {}
        actionToast(response)
        if(response.status === 'success'){
            if(redirectTo) router.push(redirectTo)
        }
    }
    return {handleResponse}
}