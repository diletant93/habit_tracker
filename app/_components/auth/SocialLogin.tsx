import Button from "../ui/Button";
import GoogleIcon from '@/public/svgs/google_icon.svg'
import FacebookIcon from '@/public/svgs/facebook_icon.svg'
export default function SocialLogin() {
    return (
        <section area-label='Social login options' className="space-y-4">
            <Button size="big" variant="blue" className="bg-facebook relative tracking-wide">
                <FacebookIcon className='absolute top-1/2 -translate-y-1/2 left-8' />
                Continue with facebook
            </Button>
            <Button size="big" variant="white" className="bg-white border border-white-800 relative tracking-wide">
                <GoogleIcon className='absolute top-1/2 -translate-y-1/2 left-7' />
                Continue with Google
            </Button>
        </section>
    );
}
