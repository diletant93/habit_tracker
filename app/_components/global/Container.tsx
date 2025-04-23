import { cn } from "@/app/lib/utils";

export default function Container({ className, children }: { className?: string; children: Readonly<React.ReactNode> }) {
    return (
        <div className={cn('px-5', className)}>
            {children}
        </div>
    );
}
