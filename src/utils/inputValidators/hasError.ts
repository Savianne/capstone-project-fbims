import { IValidationResult } from "../hooks/useFormControl";

function hasError(validationResults: IValidationResult[]) {
    return validationResults.filter(item => item.passed == false).length > 0? true : false;
}

export default hasError;