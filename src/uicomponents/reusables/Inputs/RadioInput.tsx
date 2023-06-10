import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../../IStyledFC";

import UseRipple from "../Ripple/UseRipple";

const RadioBase = styled(UseRipple)`
    position: relative;
    display: flex;
    height: 30px;
    width: 30px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 300ms ease-in-out;

    &:hover {
        background-color: ${({theme}) => theme.background.light};
    }
`;

interface IRadioInput extends IStyledFC {
    name: string;
    value: string;
    label: string;
}

const FCRadioInput: React.FC<IRadioInput> = ({className, name, value, label}) => {

    return (
        <div className={className}>
            <RadioBase>
                <input type="radio" name={name} value={value} />
            </RadioBase>
            <strong>{label}</strong>
        </div>
    )
}

const RadioInput = styled(FCRadioInput)`
    display: flex;
    width: fit-content;
    align-items: center;

    .label {
        margin-left: 2px;
    }

    ${RadioBase} input[type="radio"] {
        appearance: none;
        background-color: #fff;
        margin: 0;
        font: inherit;
        color: currentColor;
        width: 1.15em;
        height: 1.15em;
        border: 0.15em solid ${({theme}) => theme.borderColor};
        border-radius: 50%;
        display: grid;
        place-content: center;
    }

    ${RadioBase} input[type="radio"]::before {
        content: "";
        width: 0.65em;
        height: 0.65em;
        border-radius: 50%;
        transform: scale(0);
        transition: 120ms transform ease-in-out;
        box-shadow: inset 1em 1em ${({theme}) => theme.staticColor.primary};
    }

    ${RadioBase} input[type="radio"]:checked::before {
        transform: scale(1);
    }
`;

export default RadioInput;