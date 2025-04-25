'use client'
import { useHandleResponse } from "@/app/_hooks/useHandleResponse";
import { signOut } from "@/app/actions/auth";
import Button from "../ui/Button";

export default function SignOutButton({ children }: { children?: React.ReactNode }) {
    const { handleResponse } = useHandleResponse()
    async function handleSignOut() {
        const signOutResponse = await signOut()
        handleResponse(signOutResponse, { redirectTo: '/auth/sign-in' })

    }
    return (
        <Button onClick={handleSignOut}>
            {children ? children : 'SignOutButton'}
        </Button>
    );
}
