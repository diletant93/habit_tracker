import { forwardRef } from "react";
import Checkbox from "../ui/Checkbox";
type PolicyConsentProps = {
  name?: string;
  value?: boolean,
  onChange: (checked:boolean) => void,
  onBlur?: () => void,
}
const PolicyConsent = forwardRef<HTMLInputElement, PolicyConsentProps>(({ name = 'privacyConsent', onChange, value, onBlur }, ref) => {
  return (
    <div className="flex justify-between items-center pr-2">
      <p className="text-base text-grey-300 tracking-wider">i have read the <span className="text-blue-700">Privace Policy</span></p>
      <Checkbox id={name} name={name} onChange={onChange} value={value} onBlur={onBlur} ref={ref} />
    </div>
  );
})
PolicyConsent.displayName = 'Policy Consent'
export default PolicyConsent