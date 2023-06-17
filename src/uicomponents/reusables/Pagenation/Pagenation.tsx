import React from "react";
import styled, {css} from "styled-components";

import UsePagenation from "./UsePagenation";

const Pagenation = styled(UsePagenation)`
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 5px;
    height: 30px;
    padding: 5px;
    width: fit-content;
    border: 1px solid ${({theme}) => theme.borderColor};
    border-radius: 3px;

    opacity: ${(props) => props.disabled? 0.5 : 1};
    ${(props) => props.disabled && css`cursor: wait;`}

    & .btn {
        display: flex;
        width: 25px;
        height: 25px;
        align-items: center;
        justify-content: center;
        /* border: 1px solid ${({theme}) => theme.borderColor}; */
        color: ${({theme}) => theme.textColor.strong};
        font-size: 13px;
        cursor: pointer;
        transition: background-color 300ms;
    }

    & .btn-prev, & .btn-next {
        background-color: ${({theme}) => theme.background.light};
        border-radius: 2px;
    } 

    & .disabled {
        /* background-color: ${({theme}) => theme.staticColor.disabled}; */
        opacity: 0.40;
        cursor: not-allowed;
    }

    & .current-page {
        border-radius: 2px;
        background-color: ${({theme}) => theme.staticColor.primary};
        color: white;
    }    

    ${(props) => props.disabled && css`pointer-events: none;`}
`;

export default Pagenation;