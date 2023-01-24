import { TInputVal } from "../../hooks/useFormControl";
import { IValidationResult } from "../../hooks/useFormControl";

function validateTextMinValLen(minLen: number, val: string) {
    const caption =  `Value Must be ${minLen} character(s)`;
    return val.length < minLen? {caption: caption, passed: false} as IValidationResult : {caption: caption, passed: true} as IValidationResult;
}

export default validateTextMinValLen;