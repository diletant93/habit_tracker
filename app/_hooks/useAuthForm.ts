import { MouseEvent, useState } from "react";
import { getCurrentSchema, getDefaultValues, SignInSchema, SignUpSchema } from "../_validationSchemas/auth";
import { AuthMode } from "../types/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useActionToast } from "./useActionToast";
import { signIn, signUp } from "../actions/auth";
import { ActionResponse } from "../types/actions";
import { useRouter } from "next/navigation";
import { useHandleResponse } from "./useHandleResponse";


function isSignUp(values:SignUpSchema | SignInSchema): values is SignUpSchema{
    return (values as SignUpSchema)?.username !== undefined
}

export function useAuthForm(mode: AuthMode){
      const formSchema = getCurrentSchema(mode)
      const defaultValues = getDefaultValues(mode)

      const [passwordInputType, setPasswordInputType] = useState<'text' | 'password'>('password')
    
      const form = useForm<SignUpSchema | SignInSchema>({
        resolver: zodResolver(formSchema),
        defaultValues,
        mode: 'onChange',
        criteriaMode: 'all'
      })
      const {handleResponse} = useHandleResponse()

      const { error: usernameError } = form.getFieldState('username')
      const {error:privacyConsentError} = form.getFieldState('privacyConsent')
    
      async function onSubmit(values: z.infer<typeof formSchema>) {
        let response : ActionResponse<unknown>
        if(isSignUp(values)){
            response = await signUp(values)
        }else{
            response = await signIn(values)
        }
        handleResponse(response , {redirectTo:'/'})
      }
    
      function handleVisibleToggle(e:MouseEvent<HTMLButtonElement>) {
        setPasswordInputType(curr => curr === 'password' ? 'text' : 'password')
      }
      
      const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const name = e.target.name;
    
        form.setValue(name as any, value);
    
        if (value.trim() === '') {
          form.clearErrors(name as any);
        } else {
          form.trigger(name as any);
        }
      };

    return {
        formSchema,
        defaultValues,
        passwordInputType, 
        setPasswordInputType, 
        form, 
        usernameError,
        privacyConsentError,
        onSubmit,
        handleVisibleToggle,
        handleFieldChange,
      }
}