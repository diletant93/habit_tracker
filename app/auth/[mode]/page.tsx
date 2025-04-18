import SocialLogin from "@/app/_components/auth/SocialLogin"
import AuthForm from "@/app/_components/forms/AuthForm"
import H2 from "@/app/_components/ui/H2"

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
        <div>
            <H2 className="mb-9 text-center">
                {mode === 'sign-in' ? 'Welcome back!' : 'Create your account'}
            </H2>
            <SocialLogin />
            <p className="my-10 uppercase text-center text-grey-300 text-base font-semibold tracking-wider">
                {mode === 'sign-in' ? 'Or Log In with email' : 'Or Create with email'}
            </p>

        </div>
    );
}
