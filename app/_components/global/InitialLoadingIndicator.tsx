'use client'
import { useEffect, useState } from "react";
import Loader from "./Loader";
import Image from "next/image";
import Logo from "./Logo";

export default function InitialLoadingIndicator() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    useEffect(()=>{
        setIsLoading(false)
    },[])
    if (!isLoading) return null
    return (
        <div className="fixed inset-0 bg-gradient-to-r from-blue-300 to-blue-500 flex-center z-50">
            <div className="absolute w-full aspect-square -translate-y-10">
                <Logo/>
            </div>
        </div>
    );
}
