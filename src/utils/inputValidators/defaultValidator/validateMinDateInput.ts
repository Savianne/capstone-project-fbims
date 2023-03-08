import { TInputVal } from "../../hooks/useFormControl";
import { IValidationResult } from "../../hooks/useFormControl";

function validateMinDateInput(min: string, val: string) {
    const minDate = new Date(min);
    const valDate = new Date(val);

    const minDateStr = `${minDate.getFullYear()}-${minDate.getMonth() + 1}-${minDate.getDate()}`;

    const caption =  `Date value Must be ${minDateStr} or onward`;

    const minDateMs = new Date(minDate.getFullYear(), minDate.getMonth() + 1, minDate.getDate()).getTime();
    const valDateMs = new Date(valDate.getFullYear(), valDate.getMonth() + 1, valDate.getDate()).getTime();

    return valDateMs >= minDateMs? {caption: caption, passed: true} as IValidationResult : {caption: caption, passed: false} as IValidationResult;
}

export default validateMinDateInput;