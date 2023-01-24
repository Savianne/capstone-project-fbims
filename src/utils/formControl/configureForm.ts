import React from "react";

//validators
import hasError from "../inputValidators/hasError";
import validateEmailFormat from "../inputValidators/defaultValidator/emailFormatValidator";
import validateTextMinValLen from "../inputValidators/defaultValidator/validateTextMinValLen";
import validateTextMaxValLen from "../inputValidators/defaultValidator/validateTextMaxValLen";
import validateSelectField from "../inputValidators/defaultValidator/validateSelectField";

export type TInputVal = string | number | boolean;

export type TInputType = 'text' | 'number' | 'radio' | 'checkbox' | 'date' | 'email';

export type TValidateAs = 'text' | 'email' | 'number' | 'select' | 'boolean';

type TFormFieldsValues<K> = Record<keyof K, TInputVal | null>;

export interface IValidationResult {
    caption: string,
    passed: boolean,
}

interface IFormErrorFieldValues {
    errorText: string,
    validationResult: IValidationResult[]
};

type TFormErrorFieldsValues<K> = Record<keyof K, IFormErrorFieldValues | null>;

type TValDispatcher = (newVal: TInputVal) => void;

type TFormDispatchers<K> = Record<keyof K, TValDispatcher>;

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

interface IValidateAsSelectInput extends IInputExtendable {
    validateAs: 'select',
    validValues: string[]
}

interface IValidateAsBooleanInput extends IInputExtendable {
    validateAs: 'boolean',
}

type TParamValues = IValidateAsTextInput | IValidateAsEmailInput | IValidateAsSelectInput | IValidateAsBooleanInput | IValidateAsNumberInput;

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

function formHasError(fields: IFormErrorFieldValues[]) {
    return fields.filter(item => {
        return item.validationResult.filter(inner => !inner.passed).length > 0
    }).length > 0? true : false;
}


function configureForm<T extends unknown>(fields: TParam<T>) {
    // const [formState, updateFormState] = React.useState<'init' | 'ready' | 'incomplete' | 'onsubmit' | 'onerror' | 'validating'>('init');
    const [formValues, updateFormValues] = React.useState<TFormFieldsValues<T>>(createFormInitialValues(fields));
    const [activeFromField, updateActiveFromField] = React.useState<null | TFormFieldsValues<T>>(null);
    const [formErrors, updateFormErrors] = React.useState<TFormErrorFieldsValues<T>>(createFormInitialErrorValues(fields));
    const [formDispatchers, updateFormDispatchers] = React.useState<null | TFormDispatchers<T>>(null);
    const [isReady, updateIsReadyState] = React.useState(false);
    const [isOnSubmit, updateIsOnSubmitState] = React.useState(false);
    const [isValidating, startValidating] = React.useTransition();


    React.useEffect(() => {

        const formDispatchersInitialState = Object.keys(fields).reduce((P, C) => {
            const key = C as keyof typeof fields;
            const dispatcherFunction: TValDispatcher = (newValue) => {
                const obj = {[C]: newValue} as TFormFieldsValues<T>;
                updateActiveFromField(obj);
            }

            const objMutable = {
                [key]: dispatcherFunction
            } as TFormDispatchers<T>

            return {...P, ...objMutable }
        }, {});

        updateFormDispatchers(formDispatchersInitialState as TFormDispatchers<T>);
    }, []);

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

    React.useEffect(() => {
        if(activeFromField) {
            const newFormValues: TFormFieldsValues<T> = {
                ...formValues,
                ...activeFromField
            }
            
            updateFormValues(newFormValues);
            
            startValidating(() => {
                const key = Object.keys(activeFromField)[0] as keyof typeof fields;
                const newValue = Object.values(activeFromField)[0] as TInputVal;
                
                if(fields[key].required && newValue == '') 
                {
                    const mutableObj: IFormErrorFieldValues = {
                        errorText: 'Required Input!',
                        validationResult: [{caption: 'Field must have a value', passed: false}]
                    }
    
                    const obj = {
                        [key]: {...mutableObj}
                    } as TFormErrorFieldsValues<T>;
    
                    updateFormErrors({...formErrors, ...obj});
                }
                else if(!(fields[key].required) && newValue == '')
                {
                    const obj = {
                        [key]: null
                    } as TFormErrorFieldsValues<T>;
    
                    updateFormErrors({...formErrors, ...obj});
                } 
                else 
                {
                    const validationResultContainer: IValidationResult[] = [];

                    switch(fields[key].validateAs as string) {
                        case 'email':
                            validationResultContainer.push(validateEmailFormat(newValue));
                        break;
                        case 'text': 
                            const currentField = fields[key] as IValidateAsTextInput;
                            if(currentField.minValLen) validationResultContainer.push(validateTextMinValLen(currentField.minValLen, newValue as string));
                            if(currentField.maxValLen) validationResultContainer.push(validateTextMaxValLen(currentField.maxValLen, newValue as string));
                        break;
                        case 'select':
                            const currentSelectField = fields[key] as IValidateAsSelectInput;
                            validationResultContainer.push(validateSelectField(newValue as string, currentSelectField.validValues));
                    }

    
                    if(hasError(validationResultContainer)) 
                    {
                        const mutableObj: IFormErrorFieldValues = {
                            errorText: fields[key].errorText,
                            validationResult: [...validationResultContainer]
                        }
    
                        const obj = {
                            [key]: {...mutableObj}
                        } as TFormErrorFieldsValues<T>;
    
                        updateFormErrors({...formErrors, ...obj});
                    } 
                    else 
                    {
                        const obj = {
                            [key]: null
                        } as TFormErrorFieldsValues<T>;
    
                        updateFormErrors({...formErrors, ...obj});
                    }
                }
    
            })

        }
    }, [activeFromField]);
    
    React.useEffect(() => {

    }, [isValidating]);

    interface IForm {
        isReady: typeof isReady,
        isValidating: typeof isValidating,
        values: typeof formValues,
        errors: typeof formErrors
    }

    const retVal: [IForm, typeof formDispatchers] = [{isReady, isValidating, values: formValues, errors: formErrors}, formDispatchers];
    
    interface IUseFormControlParam {
        endpoint: string,
        method: 'POST' | 'GET',
    }
    
    type TUseFormControl = (param: IUseFormControlParam) => typeof retVal
    
    const useFormControl: TUseFormControl = (param) => {
        
        return retVal;
    }

    return retVal;
}

export default configureForm;