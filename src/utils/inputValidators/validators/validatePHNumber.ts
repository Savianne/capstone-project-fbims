import { TValidatorFunction } from "../../hooks/useFormControl"

const validatePHNumber: TValidatorFunction = (param) => {
    const val = param as string;
    const cleanedPhoneNumber = val.replace(/-/g, "");
    const caption =  'Cellphone Number must be in a valid format e.g: 09128486122 or 0912-848-6122';
    const phoneNumberRegex = /^(09)\d{9}$/;
    const res = phoneNumberRegex.test(cleanedPhoneNumber);

    return res? {caption: caption, passed: true} : {caption: caption, passed: false}
}

export default validatePHNumber;