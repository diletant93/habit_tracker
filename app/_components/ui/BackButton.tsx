'use client'
import { cn } from "@/app/lib/utils";
import { cva } from "class-variance-authority";
import LeftArrowSmall from '@/public/svgs/left_arrow_small.svg'
import LeftArrowBig from '@/public/svgs/left_arrow_big.svg'
import { useRouter } from "next/navigation";

type BackButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
    variant?: 'small' | 'big',
}
export default function BackButton({ variant = 'small', className, ...props }: BackButtonProps) {
    const router = useRouter()
    return (
        <button {...props} className={cn(backButtonVariants({ variant }), className)} onClick={() => router.back()}>
            {variant === 'small' ? (
                <LeftArrowSmall />
            ) : (
                <LeftArrowBig />
            )
            }
        </button>
    );
}
const backButtonVariants = cva(
    'cursor-pointer',
    {
        variants: {
            variant: {
                small: 'py-3 px-3.5 rounded-lg',
                big: 'py-4 px-4 border border-white-800 rounded-full'
            }
        },
        defaultVariants: {
            variant: 'big'
        }
    }
)
