import {z} from 'zod'
import { AuthMode } from '../types/auth'
const base = {
    email: z.string({required_error:'Provide an email'}).email({message:'Provide a proper email'})
}

const signInValidationSchema = z.object({
    ...base,
    password:z.string({required_error:'Provide a password'}).refine(data => data.trim() !== '', {message:'Provide a password'})
})
const signUpValidationSchema = z.object({
    ...base,
    username:z.string({ required_error: 'Provide a name' })
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[a-zA-Zà-žÀ-Ž' -]+$/, 'Name can only include a-Z - ,'),
    password: z.string({ required_error: 'Provide a password' })
    .trim()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must not exceed 50 characters')
    .regex(/[A-Za-z]/, 'Password must include at least one letter')
    .regex(/[0-9]/, 'Password must include at least one number'),
    privacyConsent: z.literal(true,{
        errorMap:() => ({message:'You must accept the privacy policy'})
    })
})

export type SignInSchema = z.infer<typeof signInValidationSchema>
export type SignUpSchema = z.infer<typeof signUpValidationSchema>

export const getDefaultValues = (mode :AuthMode) => {
    const base  = {email:'',password:''}
    return mode === 'sign-in'? base : {...base,  username:'', privacyConsent:false}
}
export const getCurrentSchema = (mode:AuthMode) => mode === 'sign-in' ? signInValidationSchema : signUpValidationSchema
