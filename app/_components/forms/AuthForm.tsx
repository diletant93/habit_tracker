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
import { useState } from "react"
import Link from "next/link"
import { AuthMode } from "@/app/types/auth"
import { getCurrentSchema, getDefaultValues, SignInSchema, SignUpSchema } from "@/app/_validationSchemas/auth"
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})


type AuthFormProps = {
  mode: AuthMode
}
export default function AuthForm({ mode }: AuthFormProps) {
  const formSchema = getCurrentSchema(mode)
  const defaultValues = getDefaultValues(mode)

  const form = useForm<SignInSchema | SignUpSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }
  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {mode === 'sign-up' && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="shadcn" {...field} className="shadcn-input" />
                </FormControl>
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
              <FormControl>
                <Input placeholder="Email address" {...field} className="shadcn-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="shadcn" {...field} className="shadcn-input" />
              </FormControl>
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
