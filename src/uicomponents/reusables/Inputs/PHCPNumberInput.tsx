import React, { useState } from "react";
import styled, { css } from "styled-components";

import InputErrorToltip from "./InputErrorToltip";

import { TInputType } from "../../../utils/hooks/useFormControl(old)";
import { IFormErrorFieldValues } from "../../../utils/hooks/useFormControl(old)";
import { IStyledFC } from "../../IStyledFC";

interface IFCIconInput extends IStyledFC {
  icon: any,
  placeholder: string,
  error?: IFormErrorFieldValues | null,
  value?: string,
  viewOnly?: boolean,
  disabled?: boolean,
  onChange: (val: string) => void
}

const FCPHCPNumberInput: React.FC<IFCIconInput> = ({value, icon, placeholder, error, disabled, onChange, className, children}) => {
  const [formattedValue, setFormattedValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const formattedNumericValue = formatValue(inputValue);
    onChange(formattedNumericValue); // Pass the unformatted numeric value to the onChange function
    if(value !== null && value == undefined) setFormattedValue(formattedNumericValue);
  };

  function formatValue(inputValue:string) {
    const numericValue = inputValue.replace(/\D/g, "").slice(0, 11); // Remove non-numeric characters and limit to 11 digits
    const formattedNumericValue = numericValue.replace(/(\d{0,4})(\d{0,3})(\d{0,4})/, (_, p1, p2, p3) => {
      let parts = [];
      if (p1) parts.push(p1);
      if (p2) parts.push(p2);
      if (p3) parts.push(p3);
      return parts.join("-");
    }); // Format the numeric value as XXXX-XXX-XXXX

    return formattedNumericValue;
  }

  React.useEffect(() => {
    value? setFormattedValue(formatValue(value as string)) : setFormattedValue("")
  }, [value]);

  return (
    <div className={className}>
      <span className="icon-container">
          { icon }
      </span>
      <input type="tel" value={formattedValue? formattedValue : ""} onChange={handleChange} maxLength={13} placeholder={placeholder} disabled={disabled} />
      {
          error? <>
              <span className="error-toltip">
                  <InputErrorToltip error={error} />
              </span>
          </> : ''
      }
    </div>
  )
}

const PHCPNumberInput = styled(FCPHCPNumberInput)`
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

    & .error-toltip {
        position: absolute;
        top: calc(100% + 2px);
        width: 100%;
        font-size: 11px;
        color: ${({theme}) => theme.staticColor.delete};
        z-index: 100;
    }

    ${(props) => props.disabled && css`opacity: 0.5; cursor: not-allowed;`};
    ${(props) => props.viewOnly && css`cursor: not-allowed; pointer-events: none`};
`;


export default PHCPNumberInput;
