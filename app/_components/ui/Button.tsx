import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
type ButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
    variant?: 'blue' | 'white',
    size?: 'big' | 'medium' | 'small'
}

export default function Button({ variant, size, className, ...props }: ButtonProps) {
    return (
        <button {...props} className={cn(buttonVariants({ variant, size }), className)}></button>
    );
}

const buttonVariants = cva(
    'py-[1.2rem] px-3 uppercase font-medium rounded-full cursor-pointer hover:brightness-90',
    {
        variants: {
            variant: {
                blue: 'bg-blue text-white-850',
                white: 'bg-white-800 text-dark-800'
            },
            size: {
                big: 'w-full text-base',
                medium: 'px-[4rem] text-md',
                small: 'px-[2.4rem] text-sm'
            }
        },
        defaultVariants: {
            variant: 'blue',
            size: 'big'
        }
    }
)