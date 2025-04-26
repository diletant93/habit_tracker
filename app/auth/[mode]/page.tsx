import SocialLogin from "@/app/_components/auth/SocialLogin"
import AuthForm from "@/app/_components/forms/AuthForm"
import ClientToast from "@/app/_components/global/ClientToast"
import H2 from "@/app/_components/ui/H2"
import Link from "next/link"

type AuthPageProps = {
    params: Promise<{
        mode: 'sign-in' | 'sign-up',
    }>;
    searchParams: Promise<{
        error?: string,
    }>
}
export async function generateStaticParams(): Promise<{ mode: 'sign-in' | 'sign-up' }[]> {
    return [{ mode: 'sign-up' }, { mode: 'sign-in' }]
}
export default async function AuthPage({ params, searchParams }: AuthPageProps) {
    const [{ mode }, { error }] = await Promise.all([params, searchParams])
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
            <p className="text-base text-grey-300 uppercase tracking-wider text-center font-medium mt-auto pb-10 pt-4 px-0.5">
                {mode === 'sign-in' && <>Don't have an account? <Link href={'/auth/sign-up'} className="text-blue-700">Sign up</Link></>}
                {mode === 'sign-up' && <>Already have an account? <Link href={'/auth/sign-in'} className="text-blue-700">Sign in</Link></>}
            </p>
            <ClientToast message={error || 'Unexpected error'} type="error" show={Boolean(error)} />
        </div>
    );
}
