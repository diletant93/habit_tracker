"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Button from "../ui/Button"
import PolicyConsent from "../global/PolicyConsent"
import Link from "next/link"
import { AuthMode } from "@/app/types/auth"
import { getCurrentSchema, getDefaultValues, SignInSchema, SignUpSchema } from "@/app/_validationSchemas/auth"
import CheckSuccess from "../ui/CheckSuccess"
import { MouseEvent, useState } from "react"
import VisibilityToggle from "../ui/VisibilityToggle"

type AuthFormProps = {
  mode: AuthMode
}
function isSignUpSchema(defaultValues: SignInSchema | SignUpSchema): defaultValues is SignUpSchema {
  return (defaultValues as SignUpSchema)?.username !== undefined
}
export default function AuthForm({ mode }: AuthFormProps) {

  const formSchema = getCurrentSchema(mode)
  const defaultValues = getDefaultValues(mode)

  const [passwordInputType, setPasswordInputType] = useState<'text' | 'password'>('password')

  const form = useForm<SignUpSchema | SignInSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
    criteriaMode: 'all'
  })
  const { error: usernameError } = form.getFieldState('username')

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }
  function handleVisibleToggle(e: MouseEvent<HTMLButtonElement>) {
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

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {mode === 'sign-up' && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <CheckSuccess className="form-item-icon" isShown={usernameError === undefined && field.value.trim() != ''} />
                  <FormControl>
                    <Input placeholder="Username" {...field} className="shadcn-input"
                      onChange={(e) => {
                        handleFieldChange(e);
                      }} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <CheckSuccess className="form-item-icon"
                  isShown={
                    !form.formState.errors.email
                    && field.value.trim() != ''
                    && z.string().email().safeParse(field.value).success} />
                <FormControl>
                  <Input placeholder="Email address" {...field} className="shadcn-input"
                    onChange={(e) => {
                      handleFieldChange(e);
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem >
              <div className="relative">
                <VisibilityToggle
                  className='form-item-icon'
                  isVisible={passwordInputType === 'text'}
                  onClick={handleVisibleToggle} />
                <FormControl>
                  <Input placeholder="Password" type={passwordInputType} {...field} className="shadcn-input"
                    onChange={(e) => {
                      handleFieldChange(e);
                    }} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {mode === 'sign-up' && (
          <FormField
            control={form.control}
            name="privacyConsent"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PolicyConsent
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button variant="blue" size="big" className="mt-2">{mode === 'sign-in' ? 'Log in' : 'Get started'}</Button>
        {mode === 'sign-in' && (
          <Link href={'/REPLACE_WITH_ACTUAL_ROUTE'} className="mx-auto text-dark-800 font-medium tracking-wide">
            Forgot password?
          </Link>
        )}
      </form>
    </Form>

  );
}
