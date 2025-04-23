import { cn } from '@/app/lib/utils';
import CheckSuccessIcon from '@/public/svgs/check_success.svg'

type CheckSuccess = {
    isShown: boolean;
    className?: string;
}
export default function CheckSuccess({ isShown, className }: CheckSuccess) {
    return isShown ? <CheckSuccessIcon className={cn("w-6 h-6 text-[#6CB28E]", className)} /> : null
}
