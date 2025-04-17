'use client'
import { useEffect, useState } from "react";

export default function InitialLoadingIndicator() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    useEffect(() => {
        setIsLoading(false)
    }, []);
    if (!isLoading) return null
    return (
        <div className="fixed inset-0 flex justify-center items-center">
            <p className="text-2xl uppercase">initi!!!!al loa!!ding</p>
        </div>
    );
}
