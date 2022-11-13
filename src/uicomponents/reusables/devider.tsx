import React from "react";
import styled, { css } from "styled-components";

interface IFCDevider {
    className?: string,
}

const FCDevider: React.FC<IFCDevider> = ({className}) => {
    
    return (
        <div className={className}>
            <span className="devider"></span>
        </div>
    )
}



const Devider = styled(FCDevider)<{$orientation?: string, $variant?: string, $css?: string, $flexItem?: boolean}>`
    display: flex;
    justify-content: center;
    align-items: center;
    ${({$orientation, $variant, $flexItem, $css, theme}) => {
        switch($orientation) {
            case 'vertical':
                return css`
                    height: 100%;
                    flex: ${$flexItem? '1' : '0 1 10px'};
                    & .devider {
                        border-left: 1.5px solid ${theme.borderColor};
                        width: 0;
                        height: ${$variant == 'center'? '70%' : '100%'};
                    }
                `;
                break;
            default: 
                return css`
                flex: 1;
                    height: 30px;
                    & .devider {
                        border-top: 1.5px solid ${theme.borderColor};
                        flex: ${$variant == 'center'? '0 1 90%' : '1'};
                        height: fit-content;
                    }
                `;
        }
    }}

    ${({$css}) => $css}
`

export default Devider;