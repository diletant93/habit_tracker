import { toast } from "sonner";
import { ActionToastPayload } from "../types/actions";

export function useActionToast(){
    function actionToast (actionResponse: ActionToastPayload){
        const {status , message} = actionResponse
        switch(status){
            case 'success':
                toast.success(message ?? 'Success')
                break;
            case 'error':
                toast.error(message ?? 'Error')
            default:
                toast.info(`Unexpected response. Status:${status}`)
                break;
        }
    }
    return {actionToast}
}