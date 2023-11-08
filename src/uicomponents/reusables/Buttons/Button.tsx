import React from "react";
import styled, { css } from "styled-components";

import { IStyledFC } from "../../IStyledFC";
import UseRipple from "../Ripple/UseRipple";
import SpinnerLoadingIndicator from "../SpinnerLoadingIndicator";

interface IFCButton extends IStyledFC {
    icon?: JSX.Element,
    label: string,
    iconButton?: boolean,
    disabled?: boolean,
    isLoading?: boolean,
    fullWidth?: boolean,
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const FCButton: React.FC<IFCButton> = ({className, icon, label, iconButton, disabled, isLoading, onClick}) => {

    return (
        <button className={className} onClick={disabled || isLoading? undefined : onClick}>
            <UseRipple>
                {
                    icon && !(iconButton)? <i className="btn-icon">
                        {
                            isLoading? <SpinnerLoadingIndicator msSpeed={1000} /> : icon
                        }
                    </i> : ''
                }
                {
                    iconButton? <>
                        {
                            isLoading? <SpinnerLoadingIndicator msSpeed={1000} /> : icon
                        }
                    </> : <>
                        {isLoading && !icon && <SpinnerLoadingIndicator msSpeed={1000} />} <p className="label">{label}</p>
                    </> 
                }
            </UseRipple>
        </button>   
    )
}

interface IButton {
    variant?: 'bordered-btn' | 'hidden-bg-btn' | 'standard', 
    color?: 'primary' | 'delete' | 'edit' | 'theme' 
}

const Button = styled(FCButton)<IButton>`
    position: relative;
    display: flex;
    width:  ${(props) => props.iconButton? '30px' : props.fullWidth? '100%' : 'fit-content'};
    height: ${(props) => props.iconButton? '30px' : 'fit-content'};
    padding: 0;
    outline: 0;
    border-radius: 3px;
    font-size: ${(props) => props.iconButton? '15px' : '13px'};
    box-shadow: rgb(0 0 0 / 10%) 0px 5px 5px -3px;
    transition: box-shadow 120ms ease-in-out;
    cursor: ${(props) => props.disabled? 'not-allowed' : props.isLoading? 'wait' : 'pointer'};
    opacity: ${(props) => props.disabled? '0.40' : 1};

    &:hover {
        box-shadow: ${(props) => props.disabled? 'none' : 'rgb(0 0 0 / 20%) 0px 5px 5px -3px'};
    }
    
    &:active {
        box-shadow: ${(props) => props.disabled || props.isLoading? 'none' : 'rgb(0 0 0 / 10%) 0px 5px 5px -3px, rgb(0 0 0 / 5%) 0px 8px 10px 1px, rgb(0 0 0 / 6%) 0px 3px 14px 2px'};
    }
    
    & ${UseRipple} {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: ${(props) => props.iconButton? '0' : '10px 15px'};
        border-radius: 3px;
        width: 100%;
        height: 100%;
    }

    & ${UseRipple} .btn-icon {
        margin-right: ${(props) => props.iconButton? 0 : '10px'};
    }

    & ${UseRipple} #ripple {
        background-color: ${(props) => props.disabled || props.isLoading? 'transparent' : props.theme.ripple};
    }

    .label {
        margin-left: ${(props) => props.isLoading && !(props.icon)? "10px" : 0};
    }

    ${(props) => {
        switch(props.variant as string) {
            case 'bordered-btn': 
                switch(props.color as string) {
                    case 'primary':
                        return css`
                            & {
                                border: 1.5px solid ${props.theme.staticColor.primary};
                                color: ${props.theme.staticColor.primary};
                                background-color: transparent;
                            }
                        `
                    break;
                    case 'delete':
                        return css`
                            & {
                                border: 1.5px solid ${props.theme.staticColor.delete};
                                color: ${props.theme.staticColor.delete};
                                background-color: transparent;
                            }
                        `
                    break;
                    case 'edit':
                        return css`
                            & {
                                border: 1.5px solid ${props.theme.staticColor.edit};
                                color: ${props.theme.staticColor.edit};
                                background-color: transparent;
                            }
                        `
                    break;
                    default:
                        return css`
                            & {
                                border: 1.5px solid ${props.theme.textColor.strong};
                                color: ${props.theme.textColor.strong};
                                background-color: transparent;
                            }
                        `
                }
            break;
            case 'hidden-bg-btn':
                switch(props.color as string) {
                    case 'primary':
                        return css`
                            & {
                                border: 0;
                                color: ${props.theme.staticColor.primary};
                                background-color: transparent;
                                transition: background-color 400ms ease-in-out;
                                box-shadow: none;
                            }

                            &:hover {
                                background-color: ${props.disabled? 'transparent' : '#15a9fd0d'};
                                box-shadow: none;
                            }
                        `
                    break;
                    case 'delete':
                        return css`
                            & {
                                border: 0;
                                color: ${props.theme.staticColor.delete};
                                background-color: transparent;
                                transition: background-color 400ms ease-in-out;
                                box-shadow: none;
                            }

                            &:hover {
                                background-color: ${props.disabled? 'transparent' : '#f600001a'};
                                box-shadow: none;
                            }
                        `
                    break;
                    case 'edit':
                        return css`
                            & {
                                border: 0;
                                color: ${props.theme.staticColor.edit};
                                background-color: transparent;
                                transition: background-color 400ms ease-in-out;
                                box-shadow: none;
                            }

                            &:hover {
                                background-color: ${props.disabled? 'transparent' : '#15fd5614'};
                                box-shadow: none;
                            }
                        `
                    break;
                    default:
                        return css`
                            & {
                                border: 0;
                                color: ${props.theme.textColor.strong};
                                background-color: transparent;
                                transition: background-color 400ms ease-in-out;
                                box-shadow: none;
                            }

                            &:hover {
                                background-color: ${props.disabled? 'transparent' : props.theme.background.lighter};
                                box-shadow: none;
                            }
                        `
                }
            break;
            default: 
                switch(props.color as string) {
                    case "primary":
                        return css`
                            & {
                                border: 1px solid ${props.theme.borderColor};
                                color: white;
                                background-color: ${props.theme.staticColor.primary};
                            }

                            & ${UseRipple} #ripple {
                                background-color: ${props.disabled || props.isLoading? 'transparent' : 'lightgray'};
                            }
                        `
                    break;
                    case "delete":
                        return css`
                            & {
                                border: 1px solid ${props.theme.borderColor};
                                color: white;
                                background-color: ${props.theme.staticColor.delete};
                            }
                        `
                    break;
                    case "edit":
                        return css`
                            & {
                                border: 1px solid ${props.theme.borderColor};
                                color: white;
                                background-color: ${props.theme.staticColor.edit};
                            }
                        `
                    break;
                    default:
                        return css`
                            & {
                                border: 1px solid ${props.theme.borderColor};
                                color: ${props.theme.textColor.strong};
                                background-color: ${props.theme.background.light};
                            }
                        `
                }
        }
    }}
`;

export default Button;