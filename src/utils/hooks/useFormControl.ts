import React from "react";

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

type TValDispatcher = (newVal: TInputVal | null) => void;

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

function formHasError(fields: IFormErrorFieldValues[]) {
    return fields.filter(item => {
        return item.validationResult.filter(inner => !inner.passed).length > 0
    }).length > 0? true : false;
}

function useFormControl<T extends unknown>(fields: TParam<T>) {
    // const [formState, updateFormState] = React.useState<'init' | 'ready' | 'incomplete' | 'onsubmit' | 'onerror' | 'validating'>('init');
    const [formValues, updateFormValues] = React.useState<TFormFieldsValues<T>>(createFormInitialValues(fields));
    const [activeFromField, updateActiveFromField] = React.useState<null | TFormFieldsValues<T>>(null);
    const [formErrors, updateFormErrors] = React.useState<TFormErrorFieldsValues<T>>(createFormInitialErrorValues(fields));
    const [formDispatchers, updateFormDispatchers] = React.useState<null | TFormDispatchers<T>>(null);
    const [isReady, updateIsReadyState] = React.useState(false);
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
            
           // startValidating(() => {
                const key = Object.keys(activeFromField)[0] as keyof typeof fields;
                const newValue = Object.values(activeFromField)[0] as TInputVal;
                
                if(newValue == null) {
                    const obj = {
                        [key]: null
                    } as TFormErrorFieldsValues<T>;
    
                    updateFormErrors({...formErrors, ...obj});
                }
                else if(fields[key].required && newValue == '') 
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
                        case 'date':
                            const currentDateField = fields[key] as IValidateAsDateInput;
                            if(currentDateField.min) validationResultContainer.push(validateMinDateInput(currentDateField.min, newValue as string));
                            if(currentDateField.max) validationResultContainer.push(validateMaxDateInput(currentDateField.max, newValue as string));
                        break;
                        case 'select':
                            const currentSelectField = fields[key] as IValidateAsSelectInput;
                            if(currentSelectField.validValues) validationResultContainer.push(validateSelectField(newValue as string, currentSelectField.validValues));
                    }

                    //Write a Logic to run validator functions if there is any
                    if(fields[key].validators && fields[key].validators?.length) {
                        fields[key].validators?.every(validator => {
                            const validationResult = validator(newValue);
                            validationResultContainer.push(validationResult);
                        })
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
    
            //})

        }
    }, [activeFromField]);
    
    React.useEffect(() => {

    }, [isValidating]);

    interface IForm {
        isReady: typeof isReady,
        isValidating: typeof isValidating,
        values: typeof formValues,
        errors: typeof formErrors,
        clear: () => void
    }

    const retVal: [IForm, typeof formDispatchers] = [{isReady, isValidating, values: formValues, errors: formErrors, clear() {
        const clearedForm = Object.keys(fields).reduce((P, C) => {
            const obj = {[C]: null} as TFormFieldsValues<T>;
            return {...P, ...obj }
        }, {});
        updateFormValues(clearedForm as TFormFieldsValues<T>)
    },}, formDispatchers];
    
    return retVal;
}

export default useFormControl;