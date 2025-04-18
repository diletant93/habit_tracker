import SocialLogin from "@/app/_components/auth/SocialLogin"
import AuthForm from "@/app/_components/forms/AuthForm"
import H2 from "@/app/_components/ui/H2"
import Link from "next/link"

type AuthPageProps = {
    params: Promise<{
        mode: 'sign-in' | 'sign-up'
    }>
}
export async function generateStaticParams(): Promise<{ mode: 'sign-in' | 'sign-up' }[]> {
    return [{ mode: 'sign-up' }, { mode: 'sign-in' }]
}
export default async function AuthPage({ params }: AuthPageProps) {
    const mode = (await params).mode
    return (
        <div className="h-full flex flex-col">
            <H2 className="mb-9 text-center">
                {mode === 'sign-in' ? 'Welcome back!' : 'Create your account'}
            </H2>
            <SocialLogin />
            <p className="my-10  uppercase text-center text-grey-300 text-base font-semibold tracking-wider">
                {mode === 'sign-in' ? 'Or Log In with email' : 'Or Create with email'}
            </p>
            <AuthForm mode={mode} />
            <p className="text-base text-grey-300 uppercase tracking-wider text-center font-medium mt-auto pb-10">
                {mode === 'sign-in' && <>Don't have an account? <Link href={'/auth/sign-up'} className="text-blue-700">Sign up</Link></>}
                {mode === 'sign-up' && <>Already have an account? <Link href={'/auth/sign-in'} className="text-blue-700">Sign in</Link></>}
            </p>
        </div>
    );
}
