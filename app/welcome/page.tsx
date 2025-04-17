import Container from "../_components/global/Container";
import Logo from "../_components/global/Logo";
import H1 from "../_components/ui/H1";

export default function Welcome() {
    return (
        <Container className="bg-blue-600 flex flex-col items-center">
            <Logo width={142} height={142} />
            <H1 className="w-2/3 text-center">
                Hi Jhon, Welcome
               <span className="italic"> to Main Habits</span>
            </H1>
        </Container>
    );
}
