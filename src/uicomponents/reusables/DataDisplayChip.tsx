import React, { ReactNode } from "react";
import styled, { css } from "styled-components";
import { IStyledFC } from "../IStyledFC";
import UseRipple from "./Ripple/UseRipple";

interface IDataDisplayChip extends IStyledFC {
    icon?: ReactNode,
    severity?:  "info" | "warning" | "error" | "success";
    variant?: "outlined" | "filled" | "default";
    clickable?: boolean;
    action?: () => void
}

const DataDisplayChipFC: React.FC<IDataDisplayChip> = ({className, icon, severity = "info", variant = "default", children, clickable, action}) => {

    return (
        <div className={className} onClick={() => action? action() : null}>
            {clickable && <UseRipple onClick={() => action? action() : null} />}
            {
                icon && <span className="icon">
                    {icon}
                </span>
            }
            <p className="text">
                {children}
            </p>
        </div>
    )
};

const DataDisplayChip = styled(DataDisplayChipFC)`
    position: relative;
    max-width: 100%;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    font-size: 0.8125rem;
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    height: 32px;
    border-radius: 16px;
    white-space: nowrap;
    transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    cursor: unset;
    outline: 0px;
    text-decoration: none;
    border: 0px;
    padding: 0px;
    vertical-align: middle;
    box-sizing: border-box;

    /* border: 1px solid rgb(189, 189, 189); */

    && > ${UseRipple} {
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 16px;
        width: 100%;
        height: 100%;
    }

    .icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        height: 24px;
        width: 24px;
        margin-left: 5px;
        margin-right: -6px;
        color: inherit;
    }

    .text {
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 12px;
        padding-right: 12px;
        white-space: nowrap;
        color: inherit;
    }

    ${(props) => {
        switch(props.severity) {
            case "info": return css`
                background-color: ${props.theme.mode == "dark"?  "rgb(7, 19, 24)" : "rgb(229, 246, 253)"};
                color: ${props.theme.mode == "dark"?  "rgb(184, 231, 251)" : "rgb(1, 67, 97)"};
            `;
            case "warning": return css`
                background-color: ${props.theme.mode == "dark"?  "rgb(25, 18, 7)" : "rgb(255, 244, 229)"};
                color: ${props.theme.mode == "dark"?  "rgb(255, 226, 183)" : "rgb(102, 60, 0)"};
            `;
            case "success": return css`
                background-color: ${props.theme.mode == "dark"?  "rgb(12, 19, 13)" : "rgb(237, 247, 237)"};
                color: ${props.theme.mode == "dark"?  "rgb(204, 232, 205)" : "rgb(30, 70, 32)"};

            `;
            case "error": return css`
                background-color: rgb(253, 237, 237);
                background-color: ${props.theme.mode == "dark"?  "rgb(22, 11, 11)" : "rgb(253, 237, 237)"};
                color: ${props.theme.mode == "dark"?  "rgb(244, 199, 199)" : "rgb(95, 33, 32)"};

            `;
            default: return css`
                background-color: ${props.theme.mode == "dark"?  "rgb(104 102 102)" : "rgb(243 243 243)"};
                color: ${props.theme.textColor.strong};
            `;
        }
    }};

    ${(props) => {
        return props.variant == "filled"? css`
            background-color: ${
            props.severity == "info"? "#0288d1" :
            props.severity == "warning"? "#ed6c02" :
            props.severity == "success"? "#2e7d32" :
            props.severity == "error"? "#d32f2f" : "#0288d1"
            };

            & {
                color: #fff;
            }
        `: 
        props.variant == "outlined"? css`
            background-color: transparent;
            border: 1px solid ${
            props.severity == "info"? "#03a9f4" :
            props.severity == "warning"? "#ff9800" :
            props.severity == "success"? "#4caf50" :
            props.severity == "error"? "#ef5350" : props.theme.borderColor
            };

            ${
                !(props.severity) && css`color: ${props.theme.textColor.light}`
            }
        ` : ""
    }}

`;

export default DataDisplayChip;