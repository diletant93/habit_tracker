import { cn } from '@/app/lib/utils';
import Eye from '@/public/svgs/half_eye.svg'
import { MouseEvent } from 'react';
type VisibilityToggleProps = {
    isVisible: boolean;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
    className?: string;
}
export default function VisibilityToggle({ isVisible, className, onClick }: VisibilityToggleProps) {
    return (
        <button onClick={onClick} className={cn(className, 'top-[54%] right-4')} type='button'>
            {isVisible ? (
                <div className='relative'>
                    <Eye className='-mb-0.5 transform rotate-180' />
                    <div className='absolute -translate-y-1/2 translate-x-1/2 right-[51%] top-1/2  h-1.5 w-1.5 rounded-full bg-dark-800'></div>
                    <Eye />
                </div>
            ) : (
                <Eye />
            )}
        </button>
    );
}
