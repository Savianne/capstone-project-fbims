import { TInputVal } from "../../hooks/useFormControl";
import { IValidationResult } from "../../hooks/useFormControl";

function validateMaxDateInput(max: string, val: string) {
    const maxDate = new Date(max);
    const valDate = new Date(val);

    const maxDateStr = `${maxDate.getFullYear()}-${maxDate.getMonth() + 1}-${maxDate.getDate()}`;

    const caption =  `Date value Must not exceed on ${maxDateStr}`;

    const maxDateMs = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, maxDate.getDate()).getTime();
    const valDateMs = new Date(valDate.getFullYear(), valDate.getMonth() + 1, valDate.getDate()).getTime();

    return valDateMs > maxDateMs? {caption: caption, passed: false} as IValidationResult : {caption: caption, passed: true} as IValidationResult;
}

export default validateMaxDateInput;