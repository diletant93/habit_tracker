import Link from "next/link";
import Circles from "../_components/ui/Circles";

export default function page() {
  return (
    <div className="w-full h-screen flex-center">
      <div className="">
        1
        <Circles initialColor='#A3ABFF' circlesNumber={4} initialRadius={142}incrementRadius={35} />
      </div>
    </div>
  );
}
