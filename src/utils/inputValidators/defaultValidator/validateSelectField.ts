import { IValidationResult } from "../../hooks/useFormControl";

function validateSelectField(val: string, validValues: string[]) {
    const caption = 'Value must be includen in valid values list';
    return validValues.includes(val)? {caption: caption, passed: true} as IValidationResult : {caption: caption, passed: false} as IValidationResult;
}

export default validateSelectField;