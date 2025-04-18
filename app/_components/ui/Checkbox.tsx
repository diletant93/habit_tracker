import { CheckIcon } from "lucide-react";
import { useState } from "react";

type CheckboxProps = {
    id: string;
    onChange: (checked: boolean) => void,
    required?: boolean,
}
export default function Checkbox({ id, onChange, required = true }: CheckboxProps) {
    const [isChecked, setIsChecked] = useState<boolean>(false)
    function handleCheck() {
        const newChecked = !isChecked
        setIsChecked(newChecked)
        onChange(newChecked)
    }
    return (
        <div>
            <input
                id={id}
                type="checkbox"
                checked={isChecked}
                onChange={handleCheck}
                hidden
                required
            ></input>
            <label htmlFor={id}
                className="flex-center w-6 h-6 border-2 border-grey-300 cursor-pointer rounded-sm">
                {isChecked && <CheckIcon className="w-4 h-4" />}
            </label>
        </div>
    );
}
