import { forwardRef } from "react";
import Checkbox from "../ui/Checkbox";
import { cn } from "@/app/lib/utils";
type PolicyConsentProps = {
  name?: string;
  value?: boolean,
  onChange: (checked: boolean) => void,
  onBlur?: () => void,
  isError?: boolean,
}
const PolicyConsent = forwardRef<HTMLInputElement, PolicyConsentProps>(({ name = 'privacyConsent', onChange, value, onBlur, isError = false }, ref) => {
  return (
    <div className="flex justify-between items-center pr-2">
      <p className={cn("text-base text-grey-300 tracking-wider", isError && 'text-red-600')}>i have read the <span className={cn("text-blue-700", isError && 'text-red-600 font-bold')}>Privace Policy</span></p>
      <Checkbox id={name} name={name} onChange={onChange} value={value} onBlur={onBlur} ref={ref} />
    </div>
  );
})
PolicyConsent.displayName = 'Policy Consent'
export default PolicyConsent