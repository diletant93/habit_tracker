import { Toaster } from "sonner";
import InitialLoadingIndicator from "../global/InitialLoadingIndicator";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <InitialLoadingIndicator />
            <Toaster position="top-right" richColors/>
            {children}
        </>
    );
}
