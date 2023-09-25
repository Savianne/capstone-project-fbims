import React, { ReactElement, ReactNode } from "react";
import { IStyledFC } from "../IStyledFC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled, { css } from "styled-components";
import Button from "./Buttons/Button";

interface IAlert extends IStyledFC {
    severity?:  "info" | "warning" | "error" | "success";
    variant?: "outlined" | "filled" | "default";
    onClose?: () => void;
    action?: ReactElement;
    icon?: ReactElement;
}

const AlertFC: React.FC<IAlert> = ({className, severity = "info", variant = "default", icon, onClose, action, children}) => {

    return (
        <div className={className}>
            <span className="icon-area">
                {
                    icon? icon : 
                    severity == "info"? <FontAwesomeIcon icon={["fas", "info-circle"]} /> : 
                    severity == "warning"? <FontAwesomeIcon icon={["fas", "exclamation-triangle"]} /> :
                    severity == "error"? <FontAwesomeIcon icon={["fas", "exclamation-circle"]} /> :
                    <FontAwesomeIcon icon={["fas", "check-circle"]} />
                }
            </span>
            <div className="text-area">
                { children }
            </div>
            {
                onClose? <span className="action-btn btn-close" onClick={onClose}>
                    <Button label="close" iconButton icon={<FontAwesomeIcon icon={["fas", "times"]} />} variant="hidden-bg-btn"/>
                </span> : 
                action? <span className="action-btn" onClick={onClose}>
                    {action}
                </span> : ""
            }
            
        </div>
    )
};

const Alert = styled(AlertFC)`
    display: flex;
    flex: 0 1 100%;
    padding: 6px 16px;
    border-radius: 4px;

    & .action-btn {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: flex-start;
        -webkit-box-align: flex-start;
        -ms-flex-align: flex-start;
        align-items: flex-start;
        padding: 4px 0 0 16px;
        margin-left: auto;
        margin-right: -8px;
    };

    & .icon-area {
        margin-right: 12px;
        padding: 7px 0;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        font-size: 22px;
        opacity: 0.9;
    }

    & .text-area {
        font-size: 14px;
        padding: 8px 0;
        min-width: 0;
        overflow: auto;
    }

    & .btn-close ${Button}:hover {
        background-color: transparent;
    }   

    ${(props) => {
        switch(props.severity) {
            case "info": return css`
                background-color: ${props.theme.mode == "dark"?  "rgb(7, 19, 24)" : "rgb(229, 246, 253)"};
                color: ${props.theme.mode == "dark"?  "rgb(184, 231, 251)" : "rgb(1, 67, 97)"};

                & .icon-area ${Button} {
                    color: ${props.theme.mode == "dark"?  "rgb(41, 182, 246)" : "#0288d1"};
                }

                & .btn-close ${Button} {
                    color: ${props.theme.mode == "dark"?  "rgb(184, 231, 251)" : "rgb(1, 67, 97)"};
                }
            `;
            case "warning": return css`
                background-color: ${props.theme.mode == "dark"?  "rgb(25, 18, 7)" : "rgb(255, 244, 229)"};
                color: ${props.theme.mode == "dark"?  "rgb(255, 226, 183)" : "rgb(102, 60, 0)"};

                & .icon-area {
                    color: ${props.theme.mode == "dark"?  "rgb(255, 167, 38)" : "#ed6c02"};
                }

                & .btn-close ${Button} {
                    color: ${props.theme.mode == "dark"?  "rgb(255, 226, 183)" : "rgb(102, 60, 0)"};
                }
            `;
            case "success": return css`
                background-color: ${props.theme.mode == "dark"?  "rgb(12, 19, 13)" : "rgb(237, 247, 237)"};
                color: ${props.theme.mode == "dark"?  "rgb(204, 232, 205)" : "rgb(30, 70, 32)"};

                & .icon-area {
                    color: ${props.theme.mode == "dark"?  "rgb(102, 187, 106)" : "#2e7d32"};
                }

                & .btn-close ${Button} {
                    color: ${props.theme.mode == "dark"?  "rgb(204, 232, 205)" : "rgb(30, 70, 32)"};
                }
            `;
            case "error": return css`
                background-color: rgb(253, 237, 237);
                background-color: ${props.theme.mode == "dark"?  "rgb(22, 11, 11)" : "rgb(253, 237, 237)"};
                color: ${props.theme.mode == "dark"?  "rgb(244, 199, 199)" : "rgb(95, 33, 32)"};

                & .icon-area {
                    color: ${props.theme.mode == "dark"?  "rgb(244, 67, 54)" : "#d32f2f"};
                }

                & .btn-close ${Button} {
                    color: ${props.theme.mode == "dark"?  "rgb(244, 199, 199)" : "rgb(95, 33, 32)"};
                }
            `
            default: return css`
                background-color: ${props.theme.mode == "dark"?  "rgb(7, 19, 24)" : "rgb(229, 246, 253)"};
                color: ${props.theme.mode == "dark"?  "rgb(184, 231, 251)" : "rgb(1, 67, 97)"};

                & .icon-area ${Button} {
                    color: ${props.theme.mode == "dark"?  "rgb(41, 182, 246)" : "#0288d1"};
                }

                & .btn-close ${Button} {
                    color: ${props.theme.mode == "dark"?  "rgb(184, 231, 251)" : "rgb(1, 67, 97)"};
                }
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

            & .icon-area, & .text-area, & .btn-close ${Button} {
                color: #fff;
            }
        `: 
        props.variant == "outlined"? css`
            background-color: transparent;
            border: 1px solid ${
            props.severity == "info"? "#03a9f4" :
            props.severity == "warning"? "#ff9800" :
            props.severity == "success"? "#4caf50" :
            props.severity == "error"? "#ef5350" : "#03a9f4"
            };
        ` : "";
    }}

`;

export const AlertTitle = styled.div`
    margin: 0;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.5;
    letter-spacing: 0.00938em;
    margin-bottom: 0.35em;
    font-weight: 500;
    margin-top: -2px;
`

export default Alert;