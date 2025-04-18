import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import LeftArrowSmall from '@/public/svgs/left_arrow_small.svg'
import LeftArrowBig from '@/public/svgs/left_arrow_big.svg'

type BackButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
    variant?: 'small' | 'big',
}
export default function BackButton({ variant = 'small', className, ...props }: BackButtonProps) {
    return (
        <button {...props} className={cn(backButtonVariants({variant}), className)}>
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
    '',
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
