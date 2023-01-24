import React from "react";
import styled from "styled-components";

import InputErrorToltip from "./InputErrorToltip";

import { TInputType } from "../../../utils/hooks/useFormControl";
import { IFormErrorFieldValues } from "../../../utils/hooks/useFormControl";
import { IStyledFC } from "../../IStyledFC";

interface IFCIconInput extends IStyledFC {
    icon: any,
    placeholder: string,
    type: TInputType,
    error?: IFormErrorFieldValues | null,
    onValChange: (val: string | number) => void
}

const FCIconInput: React.FC<IFCIconInput> = ({icon, type, placeholder, error, onValChange, className, children}) => {
    const [inputVal, updateInputVal] = React.useState<string | number | null>(null);

    React.useEffect(() => {
        if(!(inputVal == null)) onValChange(inputVal);
    },[inputVal]);

    return (
        <div className={className}>
            <span className="icon-container">
                { icon }
            </span>
            <input type={type} placeholder={placeholder} onChange={(e) => updateInputVal(e.target.value)} />
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

const IconInput = styled(FCIconInput)`
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
    }

    & .error-toltip {
        position: absolute;
        top: calc(100% + 2px);
        width: 100%;
        font-size: 11px;
        color: ${({theme}) => theme.staticColor.delete};
        z-index: 100;
    }
`;

export default IconInput;