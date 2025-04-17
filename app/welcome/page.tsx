import Image from "next/image";
import Container from "../_components/global/Container";
import Logo from "../_components/global/Logo";
import H1 from "../_components/ui/H1";
import Button from "../_components/ui/Button";

export default function Welcome() {
    return (
        <main className="bg-blue-600 flex flex-col items-center h-[100dvh]">
            <Logo width={142} height={142} className="mb-[13px]" />
            <H1 className="w-2/3 text-center mb-4">
                Hi Jhon, Welcome
                <span className="italic font-light"> to Main Habits</span>
            </H1>
            <p className="text-white-800 w-5/7 text-center">Explore the app, Find some peace of mind to achive good habits.</p>
            <div className="relative w-full aspect-[13/9] mt-24">
                <Image
                    src={'/images/welcome.png'}
                    alt="loading image"
                    fill
                    className="object-cover"/>
            </div>
            <div className="p-container w-full mt-20 bg-[#8C96FF] grow">
                <Button variant="white">Get Started</Button>
            </div>
        </main>
    );
}
