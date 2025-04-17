'use client'
import { useEffect, useState } from "react";
import Loader from "./Loader";

export default function InitialLoadingIndicator() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    useEffect(() => {
        setIsLoading(false)
    }, []);
    if (!isLoading) return null
    return (
        <Loader/>
    );
}
