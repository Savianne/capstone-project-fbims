import styled from "styled-components";
import React from "react";
import { IStyledFC } from "../../IStyledFC";
import UseRipple from "../Ripple/UseRipple";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Utils
import { limitTextLen } from '../../../utils/limitTextLen';
import { validateEmail } from '../../../utils/emailFormatValidator';

interface IFCInput extends IStyledFC {
    type?: 'text' | 'password' | 'email' | 'number',  
    required?: boolean,
    placeholder: string,
    error?: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    minCharLen?: number,
    maxCharLen?: number,
}

const FCInput: React.FC<IFCInput> = ({className, onChange, type = 'text', required, placeholder, minCharLen, maxCharLen}) => {
    const inputRef = React.useRef<null | HTMLInputElement>(null);
    const [inputVal, updateInputVal] = React.useState<string | null>(null);
    const [isPending, startTransition] = React.useTransition();
    const [validationState, updateValidationState] = React.useState<{ isValid?: boolean | 'init', errorText?: string}>({ isValid: 'init'});

    function validateInput(e: React.FocusEvent<HTMLInputElement, Element>) {
        if(typeof inputVal == 'string') {
            if(!(required) && inputVal == '') {
                    updateValidationState(
                        {
                            isValid: 'init',
                        }
                    );
    
                    return;
            };

            if(required && inputVal == '') {
                updateValidationState(
                    {
                        errorText: 'Input field can\'t be empty',
                        isValid: false,
                    }
                );

                return;
            } 

            if(type == 'email') { 
                const validateInput = validateEmail(inputVal);
                updateValidationState(
                    {
                        errorText: validateInput.isValidEmail? 'valid email address' : 'invalid email address',
                        isValid: validateInput.isValidEmail,
                    }
                );
            }            
        } 
    }

    return (
        <div className={className}>
            <input 
            ref={inputRef}
            type={type}
            onChange={(e) => updateInputVal(e.target.value)} 
            value={typeof inputVal == 'string'? inputVal : ''}
            onBlur={validateInput}
            placeholder={placeholder}
            className={validationState.isValid == 'init' || validationState.isValid? 'valid-field' : 'error-field'}
            />
            <label onClick={(e) => inputRef.current?.focus()}>{ placeholder }</label>
            {
                (!isPending) && !validationState.isValid? <>
                    <p className="error-text">
                        {
                            validationState.errorText
                        }
                    </p>
                </> : ''
            }

            {
                validationState.isValid == 'init' || validationState.isValid? '' : <i className='error-icon'><FontAwesomeIcon icon={["fas", "circle-exclamation"]} /></i> 
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
    margin-top: 10px;
    margin-right: 20px;
    
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
        background-color: ${({theme}) => theme.mode == 'dark'? '#f9f9f90a' : '#f9f9f9'};
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
        bottom: -17px;
        font-size: 11px;
        color: ${({theme}) => theme.staticColor.delete}
    }

    & .error-field, & .error-field:focus {
        border-color: ${({theme}) => theme.staticColor.delete};
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