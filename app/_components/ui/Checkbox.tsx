'use client'
import { CheckIcon } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";

type CheckboxProps = {
    id: string;
    name: string;
    onChange: (checked: boolean) => void;
    value?: boolean;
    onBlur?: () => void;
    required?: boolean;
}
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ name, id, value, onBlur, onChange, required = true, ...props }, ref) => {
    const [isChecked, setIsChecked] = useState<boolean>(false)

    useEffect(() => {
        if (value !== undefined) {
            setIsChecked(value)
        }
    }, [value])

    function handleCheck() {
        const newChecked = !isChecked
        setIsChecked(newChecked)
        onChange(newChecked)
    }
    return (
        <div>
            <input
                id={id}
                name={name}
                type="checkbox"
                checked={isChecked}
                onChange={handleCheck}
                onBlur={onBlur}
                
                ref={ref}
                {...props}
                className="opacity-0 absolute w-6 h-6"
            />
            <label htmlFor={id}
                className="flex-center w-6 h-6 border-2 border-grey-300 cursor-pointer rounded-sm">
                {isChecked && <CheckIcon className="w-4 h-4" />}
            </label>
        </div>
    );
})

Checkbox.displayName = 'Checkbox'
export default Checkbox