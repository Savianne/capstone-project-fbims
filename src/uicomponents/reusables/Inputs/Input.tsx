import styled, { css } from "styled-components";
import React, { useEffect } from "react";
import { IStyledFC } from "../../IStyledFC";
import UseRipple from "../Ripple/UseRipple";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import InputErrorToltip from "./InputErrorToltip";

//Types 
import { TInputType } from "../../../utils/hooks/useFormControl";
import { TInputVal } from "../../../utils/hooks/useFormControl";
import { IFormErrorFieldValues } from "../../../utils/hooks/useFormControl";


export interface IFCInput extends IStyledFC {
    name?: string,
    value?: string | boolean | number | readonly string[],
    placeholder: string,
    type: TInputType,  
    error?: IFormErrorFieldValues | string | null,
    disabled?: boolean,
    onValChange: (val: TInputVal) => void,
    label?: string,
    checked?: boolean;
    autoFocus?: boolean,
    viewOnly?: boolean
}

const CheckboxBase = styled(UseRipple)<{disabled?: boolean}>`
    position: relative;
    display: flex;
    height: 40px;
    width: 40px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 300ms ease-in-out;
    ${(props) => props.disabled && css`opacity: 1; cursor: not-allowed;background-color: ${props.theme.background.light}`};

    &:hover {
        background-color: ${({theme}) => theme.background.light};
    }

    & input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 100%;
        width: 100%;
        z-index: 2;
    }
    
    input,
    input:checked {
        ${(props) => props.disabled && css`opacity: 0; cursor: not-allowed;`};
    }

    & input ~ .checkboxChecked {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 13px;
        height: 13px;
        border-radius: 3px;
        border: 2px solid ${({theme}) => theme.borderColor};
        background-color: ${({theme}) => theme.background.primary};
        font-size: 13px;
        z-index: 1;
        color: #fff;
        transition: background-color 300ms linear, border-color 300ms liner;
    }

    & input ~ .checkboxChecked > i {
        opacity: 0;
        transition: opacity 300ms linear;
    }

    & input:checked ~ .checkboxChecked {
        background-color: #2196F3;
        border-color: #2196F3;
    }

    & input:checked ~ .checkboxChecked  i {
        opacity: 1;
    }

    /* & input:checked ~ .checkboxChecked {
        background-color: #2196F3;
        border-color: #2196F3;
        color: #fff;
    }

    &input:checked ~ .checkboxChecked i {
        display: inline;
    } */
`;

const FCInput: React.FC<IFCInput> = ({className, onValChange, name, value, disabled, type = 'text', placeholder, error, label, checked, autoFocus}) => {
    const inputRef = React.useRef<null | HTMLInputElement>(null);
    const [inputState, updateInputState] = React.useState<'init' | 'onfocus' | 'onblur'>('init');
    
    const checkboxInput = 'checkbox' as typeof type;

    return (
        <div className={className}>
            {
                type == checkboxInput? <>
                    <CheckboxBase disabled={disabled}>
                        <input 
                        disabled={disabled}
                        autoFocus={autoFocus}
                        checked={checked}
                        ref={inputRef}
                        type={type}
                        onChange={(e) => {
                            onValChange(e.target.checked)
                        }} 
                        onBlur={(e) => {
                            if(type == 'date') e.preventDefault();
                            updateInputState('onblur')
                        }}
                        onFocus={(e) => updateInputState('onfocus')}
                        placeholder={placeholder}
                        className='input-field' />
                        <span className="checkboxChecked"><i><FontAwesomeIcon icon={["fas", "check"]} /></i></span>
                    </CheckboxBase>
                    <p className="label">{label}</p>
                </> 
                :
                <>
                    <input 
                    disabled={disabled}
                    autoFocus={autoFocus}
                    ref={inputRef}
                    type={type}
                    onChange={(e) => {
                        onValChange(e.target.value);
                    }} 
                    onBlur={(e) => {
                        if(type == 'date') e.preventDefault();
                        updateInputState('onblur')
                    }}
                    onFocus={(e) => updateInputState('onfocus')}
                    value={value? value as string | number | readonly string[] : ""}
                    placeholder={placeholder}
                    className={error? 'error-field input-field' : 'input-field'}
                    />
                    <label onClick={(e) => inputRef.current?.focus()}>{ placeholder }</label>
                    {
                        error && typeof error !== 'string' && <span className="error-toltip">
                                <InputErrorToltip error={error as IFormErrorFieldValues} />
                            </span>
                    }

                    {
                        error && typeof error === 'string' && <span className="input-error-text">{error}</span>
                    }
        
                    {
                        error? <i className='error-icon'><FontAwesomeIcon icon={["fas", "circle-exclamation"]} /></i>  : ''
                    }         
                </>
            }
        </div>
    )
}

const Input = styled(FCInput)`
    position: relative;
    display: flex;
    align-items: center;

    ${(prop) => {
        const inputType = prop.type as string;
        
        switch(inputType) {
            case 'checkbox':
                return css`
                    width: fit-content;
                    padding: 10px 0;

                    & .label {
                        margin-left: 5px;
                        color: ${({theme}) => theme.textColor.strong};
                    }
                `;
            break;
            default:
                return css`
                    flex: 1;
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

                    & input::-webkit-calendar-picker-indicator { filter: ${({theme}) => theme.mode == 'dark'? 'invert(100%)' : 'none'}; }

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
                `
        }
    }}

    &, input {
        ${(props) => props.disabled && css`opacity: 0.5; cursor: not-allowed;`};
    }

    &, input {
        ${(props) => props.viewOnly && css`opacity: 1; cursor: not-allowed; pointer-events: none`};
    }

    /* & .error-text, */
    & .error-toltip, & .input-error-text {
        position: absolute;
        top: calc(100% + 1px);
        width: 100%;
        font-size: 11px;
        color: ${({theme}) => theme.staticColor.delete};
        z-index: 100;
    }

    & .input-error-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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