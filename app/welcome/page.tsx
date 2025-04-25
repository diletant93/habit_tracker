import Image from "next/image";
import Logo from "../_components/global/Logo";
import H1 from "../_components/ui/H1";
import Button from "../_components/ui/Button";
import Circles from "../_components/ui/Circles";
import Link from "next/link";
import SignOutButton from "../_components/auth/SignOutButton";

export default async function Welcome() {
    return (
        <main className="bg-blue-600 flex flex-col items-center h-[100dvh] overflow-hidden">
            <SignOutButton/>
            <div className="relative h-1/5 max-h-[142px] aspect-square">
                <Logo className="mb-[13px]" />
            </div>
            <H1 className="w-2/3 text-center mb-4">
                Hi Jhon, Welcome
                <span className="italic font-light"> to Main Habits</span>
            </H1>
            <p className="text-white-800 w-5/7 text-center z-10">Explore the app, Find some peace of mind to achive good habits.</p>
            <div className="relative h-[28%] w-full mt-24">
                <Image
                    src={'/images/welcome.png'}
                    alt="welcome image"
                    fill
                    className="z-10"
                />
                <div className="absolute position-center top-5/6 z-0">
                    <Circles initialColor='#A3ABFF' circlesNumber={4} initialRadius={142} incrementRadius={35} />
                </div>
                <div className="relative h-[143px] -top-12">
                    <Image
                        src={'/images/welcome_birds_clouds.png'}
                        alt="welcome image"
                        fill
                        className="z-10"
                    >

                    </Image>
                </div>
            </div>
            <div className="p-container w-full pt-20 pb-2 bg-[#8C96FF] grow z-10 flex-center">
                <Link href="/auth/sign-in" className="w-full">
                    <Button variant="white">Get Started</Button>
                </Link>
            </div>
        </main>
    );
}
