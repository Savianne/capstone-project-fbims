import React, { useState } from "react";
import styled, { css } from "styled-components";

import InputErrorToltip from "./InputErrorToltip";

import { TInputType } from "../../../utils/hooks/useFormControl(old)";
import { IFormErrorFieldValues } from "../../../utils/hooks/useFormControl(old)";
import { IStyledFC } from "../../IStyledFC";

interface IFCIconInput extends IStyledFC {
  icon: any,
  placeholder: string,
  error?: IFormErrorFieldValues | string | null,
  value?: string,
  disabled?: boolean,
  viewOnly?: boolean,
  onChange: (val: string) => void
}

const FCPHTelNumberInput: React.FC<IFCIconInput> = ({value, icon, placeholder, error, disabled, onChange, className, children}) => {
  const [formattedValue, setFormattedValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const formattedNumericValue = formatPhoneNumber(inputValue);
    onChange(formattedNumericValue); // Pass the unformatted numeric value to the onChange function
    if(value !== null && value == undefined) setFormattedValue(formattedNumericValue);
  };

  function formatPhoneNumber(input: string): string {
    // Remove any non-digit characters from the input
    const digitsOnly = input.replace(/\D/g, '');
  
    // Check if the input has a valid length
    if (digitsOnly.length > 5) {
      if (digitsOnly.length <= 8) {
        return digitsOnly.replace(/(\d{4})(\d{1,4})/, '$1-$2');
      } else if (digitsOnly.length <= 10) {
        const areaCode = digitsOnly.substring(0, 2);
        const localExchangeCode = digitsOnly.substring(2, 6);
        const subscriberNumber = digitsOnly.substring(6);
  
        return `(${areaCode}) ${localExchangeCode}-${subscriberNumber}`;
      } else if (digitsOnly.length > 10) {
        const areaCode = digitsOnly.substring(0, 3);
        const localExchangeCode = digitsOnly.substring(3, 7);
        const subscriberNumber = digitsOnly.substring(7);
  
        return `(${areaCode}) ${localExchangeCode}-${subscriberNumber}`;
      }
    }
  
    // Return input as is if it doesn't meet the formatting condition
    return input;
  }
  
  
  React.useEffect(() => {
    value? setFormattedValue(formatPhoneNumber(value as string)) : setFormattedValue("")
  }, [value]);

  return (
    <div className={className}>
      <span className="icon-container">
          { icon }
      </span>
      <input type="tel" value={formattedValue? formattedValue : ""} onChange={handleChange} placeholder={placeholder} disabled={disabled} />
      {
        error && typeof error !== 'string' && <span className="error-toltip">
            <InputErrorToltip error={error as IFormErrorFieldValues} />
        </span>
      }
      {
        error && typeof error === 'string' && <span className="input-error-text">{error}</span>
      }
    </div>
  )
}

const PHTelNumberInput = styled(FCPHTelNumberInput)`
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    background-color: ${({theme}) => theme.background.light};
    height: 35px;
    border: 1px solid ${(prop) => prop.error? prop.theme.staticColor.delete : prop.theme.borderColorStrong};
    border-radius: 4px;
    color: ${(prop) => prop.error? prop.theme.staticColor.delete : prop.theme.textColor.strong};

    & .icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 36px;
        width: 35px;
        font-size: 15px;
        color: inherit;
        border-right: 1px solid ${(prop) => prop.error? prop.theme.staticColor.delete : prop.theme.borderColorStrong};
    }

    & input,
    & input:focus,
    & input:active {
        display: flex;
        flex: 1;
        min-width: 0;
        height: 35px;
        font-size: 13px;
        padding: 0;
        padding-left: 10px;
        outline: 0;
        border: 0;
        background-color: transparent;
        color: inherit;
        ${(props) => props.disabled && css`cursor: not-allowed;`};
    }

    & .error-toltip, & .input-error-text {
      position: absolute;
      top: calc(100% + 2px);
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

    ${(props) => props.disabled && css`opacity: 0.5; cursor: not-allowed;`};
    ${(props) => props.viewOnly && css`cursor: not-allowed; pointer-events: none`};
`;


export default PHTelNumberInput;
