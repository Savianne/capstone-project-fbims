import React from "react";
import styled from "styled-components";

//FontAwesome Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


interface IFCGoBackBtn {
    className?: string,
}

const FCGoBackBtn: React.FC<IFCGoBackBtn> = ({className}) => {

    return (
        <div className={className}  onClick={() => window.history.back()}>
            <span className="back-icon">
                <FontAwesomeIcon icon={["fas", 'arrow-left']} />
            </span>
            Go Back
        </div>
    );
}

const GoBackBtn = styled(FCGoBackBtn)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: fit-content;
    font-size: 11px;
    cursor: pointer;
    color: ${({theme}) => theme.textColor.strong};

    & .back-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
        background-color: ${({theme}) => theme.mode == 'dark'? '#444d52' : theme.background.lighter};
        font-size: 13px;
        border-radius: 2px;
        margin-right: 5px;
        color: ${({theme}) => theme.textColor.strong};
    }
`;

export default GoBackBtn;