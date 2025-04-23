import { cn } from "@/app/lib/utils";

type H1Props = React.HTMLAttributes<HTMLHeadingElement> & {
    variant?: 'white' | 'dark';
}

export default function H1({ variant, className, ...props }: H1Props) {
    return <h1 {...props} className={cn('text-xl text-creamy-300 font-medium', className)}></h1>
}