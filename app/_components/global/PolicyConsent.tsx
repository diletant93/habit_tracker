import Checkbox from "../ui/Checkbox";

export default function PolicyConsent({isChecked,onCheck}:{isChecked:boolean,onCheck:()=>void}) {
  return (
    <div className="flex justify-between items-center pr-2">
       <p className="text-base text-grey-300 tracking-wider">i have read the <span className="text-blue-700">Privace Policy</span></p>
        <Checkbox id="1" onChange={onCheck}/>
    </div>
  );
}
