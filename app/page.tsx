'use client'
import { useRouter } from "next/navigation";
import Button from "./_components/ui/Button";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()
  useEffect(()=>{
    router.push('/welcome')
  })
  return (
    <div className="h-screen w-full flex justify-center items-center ">
      <Button variant="blue" size="big" >log in</Button>
      <Link href={'/test'}>Test</Link>
    </div>
  );
}
