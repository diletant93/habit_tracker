import { cn } from "@/app/lib/utils";
import Image from "next/image";
type LogoProps = {
    width?: number;
    height?: number;
    className?: string;
}
export default function Logo({ width, height, className }: LogoProps) {
    if (!width || !height) return <Image
        src={'/images/initialLoading.png'}
        alt="loading image"
        fill
        className={cn('object-cover', className)} />

    return <Image
        width={width}
        height={height}
        src={'/images/initialLoading.png'}
        alt="loading image"
        className={className} />

}
