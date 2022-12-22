import React from "react";

interface IInputField {
    name: string,
    required?: boolean,
}

interface IInputValue {
    name: string,
    value: string | number | boolean | null,
    required: boolean,
}

export interface IInputError {
    name: string,
    error: string | null
}

const useFormControl = (fields: Array<IInputField>) => {

    const [formState, updateFormState] = React.useState<'init' | 'ready' | 'incomplete' | 'onsubmit' | 'onerro' | 'verifying'>('init');
    const [inputValues, updateInputValues] = React.useState<IInputValue[] | null>(null);
    const [inputErrors, updateInputErrors] = React.useState<IInputError[] | null>(null);

    React.useEffect(() => {
        const inputFields: {
            values: IInputValue[],
            errors: IInputError[]
        } = {
            values: [],
            errors: []
        } 

        fields.forEach(item => {
            inputFields.values.push({name: item.name, value: null, required: item.required? true : false}); 
            inputFields.errors.push({name: item.name, error: null});
        });

        updateInputValues(inputFields.values);
        updateInputErrors(inputFields.errors);
    }, []);

    // React.useEffect(() => {
    //     console.log(inputErrors);
    //     console.log(inputValues);
    // }, [inputErrors, inputValues]);

    function dispatchValue<TPayload extends { type: 'text' | 'password' | 'email' | 'number' | 'date' | 'select', name: string, value: string | number}>(payload: TPayload) {
        if(inputValues && inputValues.length)  {
            
        }
    }

    return (
        [formState]
    )
}

// useFormControl([{name: 'he', required: true, values: ['ssss']}, {name: 'mail', required: true, type: 'email'}]);

export default useFormControl;