"use client"
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
import CheckSuccess from "../ui/CheckSuccess"
import VisibilityToggle from "../ui/VisibilityToggle"
import { useAuthForm } from "@/app/_hooks/useAuthForm"

type AuthFormProps = {
  mode: AuthMode
}

export default function AuthForm({ mode }: AuthFormProps) {

  const {
    form, onSubmit,
    usernameError, privacyConsentError,
    handleFieldChange, handleVisibleToggle,
    passwordInputType,
  } = useAuthForm(mode)

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
                    isError={privacyConsentError !== undefined}
                  />
                </FormControl>

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
