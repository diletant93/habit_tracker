type H1Props = React.HTMLAttributes<HTMLHeadingElement> & {
    variant?: 'white' | 'dark'
}

export default function H1({ variant, ...props }: H1Props) {
    return <h2 {...props} className="text-lg-md text-dark-800"></h2>
}