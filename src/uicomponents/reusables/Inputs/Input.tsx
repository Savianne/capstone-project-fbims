import styled from "styled-components";
import React, { useEffect } from "react";
import { IStyledFC } from "../../IStyledFC";
import UseRipple from "../Ripple/UseRipple";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Interfaces
import { IInputError } from "../../../utils/hooks/useFormControl";

//Utils
import { validateEmail } from '../../../utils/emailFormatValidator';

export interface IFCInput extends IStyledFC {
    name: string,
    placeholder: string,
    control?: { errors: IInputError[], dispatchValue: <TDispatch>(payload: TDispatch) => void },
    type?: 'text' | 'password' | 'email' | 'number',  
    error?: string,
    disabled?: boolean,
    onValChange?: (param: {inputState: 'init' | 'onfocus' | 'onblur', value: string | number, type: 'text' | 'password' | 'email' | 'number' | 'date' | 'select'}) => void,
}

const FCInput: React.FC<IFCInput> = ({className, onValChange, disabled, type = 'text', placeholder, error}) => {
    const inputRef = React.useRef<null | HTMLInputElement>(null);
    const [inputVal, updateInputVal] = React.useState<string | null>(null);
    const [inputState, updateInputState] = React.useState<'init' | 'onfocus' | 'onblur'>('init');
    // const [isPending, startTransition] = React.useTransition();
    // const [validationState, updateValidationState] = React.useState<{ isValid?: boolean | 'init', errorText?: string}>({ isValid: 'init'});

    // function validateInput(e: React.FocusEvent<HTMLInputElement, Element>) {
    //     if(typeof inputVal == 'string') {
    //         if(!(required) && inputVal == '') {
    //                 updateValidationState(
    //                     {
    //                         isValid: 'init',
    //                     }
    //                 );
    
    //                 return;
    //         };

    //         if(required && inputVal == '') {
    //             updateValidationState(
    //                 {
    //                     errorText: 'Input field can\'t be empty',
    //                     isValid: false,
    //                 }
    //             );

    //             return;
    //         } 

    //         if(type == 'email') { 
    //             const validateInput = validateEmail(inputVal);
    //             if(!(validateInput.isValidEmail)) updateValidationState(
    //                 {
    //                     errorText: 'invalid email address',
    //                     isValid: false,
    //                 }
    //             );
    //         }        
            
    //         if(type == 'text') {
    //             if(minCharLen && inputVal.length < minCharLen) {
    //                 updateValidationState(
    //                     {
    //                         errorText: `Value must be atleast ${minCharLen} characters`,
    //                         isValid: false,
    //                     }
    //                 );
    //             }

    //             if(maxCharLen && inputVal.length > maxCharLen) {
    //                 updateValidationState(
    //                     {
    //                         errorText: `Value must be less than ${minCharLen} characters only`,
    //                         isValid: false,
    //                     }
    //                 );
    //             }
    //         }
    //     } 
    // }

    React.useEffect(() => {
        if(inputVal && onValChange) onValChange({inputState: inputState, value: inputVal, type: type});
    },[inputVal, inputState]);

    return (
        <div className={className}>
            <input 
            ref={inputRef}
            type={type}
            onChange={(e) => updateInputVal(e.target.value)} 
            onBlur={(e) => updateInputState('onblur')}
            onFocus={(e) => updateInputState('onfocus')}
            value={typeof inputVal == 'string'? inputVal : ''}
            placeholder={placeholder}
            className={error? 'error-field input-field' : 'input-field'}
            />
            <label onClick={(e) => inputRef.current?.focus()}>{ placeholder }</label>
            {
                error? <>
                    <p className="error-text">
                        {
                           error
                        }
                    </p>
                </> : ''
            }

            {
                error? <i className='error-icon'><FontAwesomeIcon icon={["fas", "circle-exclamation"]} /></i>  : ''
            }
        </div>
    )
}

const Input = styled(FCInput)`
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    height: fit-content;
    
    & input {
        font-family: inherit;
        width: 100%;
        border: 0;
        border-bottom: 1px solid #d2d2d2;
        outline: 0;
        font-size: 15px;
        color: ${({theme}) => theme.textColor.strong};
        padding: 7px 3px;
        background: transparent;
        transition: border-color 0.2s;
        /* background-color: ${({theme}) => theme.mode == 'dark'? '#f9f9f90a' : '#f9f9f9'}; */
    }

    & input::placeholder {
        color: transparent;
    }

    & input:placeholder-shown ~ label {
        font-size: 15px;
        cursor: text;
        top: 5px;
        left: 5px;
        z-index: 0;
    }

    & label,
    & input:focus ~ label {
        position: absolute;
        top: -18px;
        left: 0;
        display: block;
        transition: 0.2s;
        font-size: 12px;
        color: #9b9b9b;
    }

    & input:focus ~ label {
        color: ${({theme}) => theme.staticColor.primary};
    }

    & input:focus {
        padding-bottom: 6px;
        border-bottom: 2px solid ${({theme}) => theme.staticColor.primary};
    }

    & .error-text {
        position: absolute;
        top: calc(100% + 1px);
        font-size: 11px;
        color: ${({theme}) => theme.staticColor.delete}
    }

    & .error-field, & .error-field:focus {
        border-color: ${({theme}) => theme.staticColor.delete};
    }

    & .error-field ~ label, & .error-field:focus ~ label {
        color: ${({theme}) => theme.staticColor.delete};
    }

    & .error-icon {
        width: fit-content;
        height: fit-content;
        position: absolute;
        right: 5px;
        font-size: 11px;
        color: ${({theme}) => theme.staticColor.delete}
    }
`;

export default Input;