import React from "react";
import { debounce, reject } from "lodash";

//validators
import hasError from "../inputValidators/hasError";
import validateEmailFormat from "../inputValidators/defaultValidator/emailFormatValidator";
import validateTextMinValLen from "../inputValidators/defaultValidator/validateTextMinValLen";
import validateTextMaxValLen from "../inputValidators/defaultValidator/validateTextMaxValLen";
import validateSelectField from "../inputValidators/defaultValidator/validateSelectField";
import validateMinDateInput from "../inputValidators/defaultValidator/validateMinDateInput";
import validateMaxDateInput from "../inputValidators/defaultValidator/validateMaxDateInput";

export type TInputVal = string | number | boolean | readonly string[]

export type TInputType = 'text' | 'number' | 'radio' | 'checkbox' | 'date' | 'email';

export type TValidateAs = 'text' | 'email' | 'number' | 'select' | 'boolean' | 'date';

type TFormFieldsValues<K> = Record<keyof K, TInputVal | null>;

export interface IValidationResult {
    caption: string,
    passed: boolean,
}

export interface IFormErrorFieldValues {
    errorText: string,
    validationResult: IValidationResult[]
};

type TFormErrorFieldsValues<K> = Record<keyof K, IFormErrorFieldValues | null>;

export type TValidatorFunction = (val: TInputVal) => IValidationResult

interface IInputExtendable {
    required: boolean,
    errorText: string,
    validators?: TValidatorFunction[],
}

interface IValidateAsTextInput extends IInputExtendable {
    validateAs: 'text',
    minValLen?: number,
    maxValLen?: number
}

interface IValidateAsNumberInput extends IInputExtendable {
    validateAs: 'number',
    minValLen?: number,
    maxValLen?: number
}

interface IValidateAsEmailInput extends IInputExtendable {
    validateAs: 'email'
}

interface IValidateAsDateInput extends IInputExtendable {
    validateAs: 'date',
    min?: string,
    max?: string,
}

interface IValidateAsSelectInput extends IInputExtendable {
    validateAs: 'select',
    validValues?: string[] | null
}

interface IValidateAsBooleanInput extends IInputExtendable {
    validateAs: 'boolean',
}

type TParamValues = IValidateAsTextInput | IValidateAsEmailInput | IValidateAsSelectInput | IValidateAsBooleanInput | IValidateAsNumberInput | IValidateAsDateInput;

type TParam<K> = Record<keyof K, TParamValues>;

function createFormInitialValues<K extends unknown>(fields: TParam<K>) {
    const initialValues = Object.keys(fields).reduce((P, C) => {
        const obj = {[C]: null} as TFormFieldsValues<K>;
        return {...P, ...obj }
    }, {});

    return initialValues as TFormFieldsValues<K>
}

function createFormInitialErrorValues<K extends unknown>(fields: TParam<K>) {
    const initialErrorValues = Object.keys(fields).reduce((P, C) => {
        const obj = {[C]: null} as TFormErrorFieldsValues<K>;
        return {...P, ...obj }
    }, {});

    return initialErrorValues as TFormErrorFieldsValues<K>;
}

function useFormControl<T extends unknown>(fields: TParam<T>) {
    // const [formState, updateFormState] = React.useState<'init' | 'ready' | 'incomplete' | 'onsubmit' | 'onerror' | 'validating'>('init');
    const [formValues, updateFormValues] = React.useState<TFormFieldsValues<T>>(createFormInitialValues(fields));
    const [formErrors, updateFormErrors] = React.useState<TFormErrorFieldsValues<T>>(createFormInitialErrorValues(fields));
    const [isReady, updateIsReadyState] = React.useState(false);
    const [isValidating, startValidating] = React.useTransition();

    React.useEffect(() => {
        console.log(formValues)
        debounce(async () => {
            const errorResult = createFormInitialErrorValues(fields);
            await (async () => {
                Object.entries(formValues).forEach(([key, val], i) => {
                    if(val == null) {
                        const obj = {
                            [key]: null
                        } as TFormErrorFieldsValues<T>;
            
                        updateFormErrors({...formErrors, ...obj});
                    }
                    else if(fields[key as keyof typeof fields].required && val == '') 
                    {
                        errorResult[key as keyof TFormErrorFieldsValues<T>] = {
                            errorText: 'Required Input!',
                            validationResult: [{caption: 'Field must have a value', passed: false}]
                        };
                    }
                    else if(!(fields[key as keyof typeof fields].required) && val == '')
                    {
                        errorResult[key as keyof TFormErrorFieldsValues<T>] = null;
                    } 
                    else 
                    {
                        const validationResultContainer: IValidationResult[] = [];
        
                        switch(fields[key as keyof typeof fields].validateAs as string) {
                            case 'email':
                                validationResultContainer.push(validateEmailFormat(val as string));
                            break;
                            case 'text': 
                                const currentField = fields[key as keyof typeof fields] as IValidateAsTextInput;
                                if(currentField.minValLen) validationResultContainer.push(validateTextMinValLen(currentField.minValLen, (val as string).trim()));
                                if(currentField.maxValLen) validationResultContainer.push(validateTextMaxValLen(currentField.maxValLen, (val as string).trim()));
                            break;
                            case 'date':
                                const currentDateField = fields[key as keyof typeof fields] as IValidateAsDateInput;
                                if(currentDateField.min) validationResultContainer.push(validateMinDateInput(currentDateField.min, val as string));
                                if(currentDateField.max) validationResultContainer.push(validateMaxDateInput(currentDateField.max, val as string));
                            break;
                            case 'select':
                                const currentSelectField = fields[key as keyof typeof fields] as IValidateAsSelectInput;
                                if(currentSelectField.validValues) validationResultContainer.push(validateSelectField(val as string, currentSelectField.validValues));
                        }
        
                        //Write a Logic to run validator functions if there is any
                        if(fields[key as keyof typeof fields].validators && fields[key as keyof typeof fields].validators?.length) {
                            fields[key as keyof typeof fields].validators?.every(validator => {
                                const validationResult = validator(val as TInputVal);
                                validationResultContainer.push(validationResult);
                            })
                        }   
        
                        if(hasError(validationResultContainer)) 
                        {
                            errorResult[key as keyof TFormErrorFieldsValues<T>] = {
                                errorText: fields[key as keyof typeof fields].errorText,
                                validationResult: [...validationResultContainer]
                            };
                        } 
                        else 
                        {
                            errorResult[key as keyof TFormErrorFieldsValues<T>] = null;
                        }
                    } 
                })
                
            })()
            updateFormErrors(errorResult)
        }, 300)();
    }, [formValues]);

    React.useEffect(() => {
        Object.entries(formErrors).filter(item => {
            const key = item[0] as keyof typeof fields
            const value = item[1] as IFormErrorFieldValues;
            if(item[1]) 
            {
                return value.validationResult.filter(inner => !(inner.passed)).length > 0? true : false
            }
            else {
                return fields[key].required && formValues[key] === null? true : false;
            }
            
        }).length > 0? updateIsReadyState(false) : updateIsReadyState(true);

    }, [formErrors]);

    interface IForm {
        isReady: typeof isReady,
        isValidating: typeof isValidating,
        errors: typeof formErrors,
        clear: () => void
    }

    type TInput = (val: TFormFieldsValues<T>) => void;

    const retVal: [IForm, typeof formValues, TInput] = [
        {
            isReady, 
            isValidating, 
            errors: formErrors, 
            async clear() {
                const clearedForm = await (async () => {
                    return Object.keys(fields).reduce((P, C) => {
                        const obj = {[C]: null} as TFormFieldsValues<T>;
                        return {...P, ...obj }
                    }, {});
                })();
                
                updateFormValues(clearedForm as TFormFieldsValues<T>);

                const clearedErrors = await (async () => {
                    return Object.keys(fields).reduce((P, C) => {
                        const obj = {[C]: null} as TFormErrorFieldsValues<T>;
                        return {...P, ...obj }
                    }, {});
                })();

                updateFormErrors(clearedErrors as TFormErrorFieldsValues<T>)

                updateIsReadyState(false);
            }
        }, 
        formValues, 
        (values) => {
            updateFormValues(values)
        }
    ];
    
    return retVal;
}

export default useFormControl;