import { TInputVal } from "../../hooks/useFormControl";
import { IValidationResult } from "../../hooks/useFormControl";

function validateTextMaxValLen(maxLen: number, val: string) {
    const caption =  `Value Must not be exceeded to ${maxLen} character(s)`;
    return val.length > maxLen? {caption: caption, passed: false} as IValidationResult : {caption: caption, passed: true} as IValidationResult;
}

export default validateTextMaxValLen;