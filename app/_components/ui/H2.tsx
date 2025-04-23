import { cn } from "@/app/lib/utils"

type H2Props = React.HTMLAttributes<HTMLHeadingElement> & {
    variant?: 'white' | 'dark'
}

export default function H2({ variant, className, ...props }: H2Props) {
    return <h2 {...props} className={`text-lg-md font-semibold  text-dark-800 ${className}`}></h2>
}