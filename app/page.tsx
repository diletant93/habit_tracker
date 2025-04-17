import Image from "next/image";
import Button from "./_components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-full flex justify-center items-center ">
      <Button variant="blue" size="big" >log in</Button>
      <Link href={'/test'}>Test</Link>
    </div>
  );
}
