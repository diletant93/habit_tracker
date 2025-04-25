'use client'

import { useActionToast } from "@/app/_hooks/useActionToast";
import { useEffect } from "react";

type ClientToastProsp = {
    message: string;
    type: 'success' | 'error';
    show: boolean;
}
export default function ClientToast({ message, type = 'success', show }: ClientToastProsp) {
    const { actionToast } = useActionToast()
    useEffect(() => {
        if (show) {
            actionToast({
                status: type,
                message: message
            })
        }
    }, [message, type, show, actionToast])
    return null
}
