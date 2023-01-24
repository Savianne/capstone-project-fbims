
import { TValidatorFunction } from "../../hooks/useFormControl"

const validateEmailFormat: TValidatorFunction = (param) => {
    const val = param as string;
    const caption =  'Email must be in a valid format e.g: youremail@mail.com';
    let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return (val.match(mailformat))? {caption: caption, passed: true} : {caption: caption, passed: false}
}

export default validateEmailFormat;