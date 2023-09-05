import React from "react";
import styled from "styled-components";
import UseRipple from "../Ripple/UseRipple";
import { usePopper } from 'react-popper';
import { Placement } from "@popperjs/core";

import { IStyledFC } from "../../IStyledFC";

interface IMenuFC extends IStyledFC {
    onClose: () => void;
    open: boolean;
    anchorEl: HTMLElement | null,
    placement: Placement
}

const MenuFC: React.FC<IMenuFC> = ({className, open, onClose, children, anchorEl, placement}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const [referenceElement, setReferenceElement] = React.useState<null | HTMLElement>(null);
    const [arrowElement, setArrowElement] = React.useState<null | HTMLDivElement>(null);
    const [popperElement, setPopperElement] = React.useState<null | HTMLDivElement>(null);

    const { styles, attributes } = usePopper(referenceElement, popperElement,
        {
            placement: placement,
            modifiers: [
                { name: 'arrow', options: { element: arrowElement } },
                {
                    name: 'preventOverflow',
                    options: {
                        altBoundary: true,
                    },
                },
                {
                    name: 'offset',
                    options: {
                        offset: [0, 5],
                    },
                },
            ],
        });

    React.useEffect(() => {
        if(open) {
            setIsOpen(true);
        } else {
            setTimeout(() => {
                setIsOpen(false);
            }, 300)
        }
    }, [open]);

    React.useEffect(() => {
        if(open) {
            setReferenceElement(anchorEl);
        }
    }, [anchorEl])
    return (
        isOpen? <>
        <MenuBackdrop onClick={() => onClose() } />
        <div 
        className={className}
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}>
            <div ref={setArrowElement} style={styles.arrow} />
            {
                children
            }
        </div>
        </> : null
    )
}

const Menu = styled(MenuFC)`
    display: flex;
    /* flex: 1 0 180px; */
    min-width: 0;
    width: 210px;
    /* max-width: 200px; */
    flex-wrap: wrap;
    height: fit-content;
    border-radius: 5px;
    color: ${({theme}) => theme.textColor.strong};
    background-color: ${({theme}) => theme.background.primary};
    border: 1px solid ${({theme}) => theme.borderColor};
    box-shadow: rgb(0 0 0 / 20%) 0px 5px 5px -3px, rgb(0 0 0 / 14%) 0px 8px 10px 1px, rgb(0 0 0 / 12%) 0px 3px 14px 2px;
    z-index: 10001;
`;

const MenuBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    background-color: transparent;
    z-index: 10000;
`;

export const MenuItem = styled(UseRipple)`
    display: flex;
    flex: 0 1 200px;
    min-width: 0;
    align-items: center;
    justify-content: center;
    height: 30px;
    padding: 5px 10px;
    cursor: pointer;
    /* overflow: hidden; */

    :hover {
        background-color: ${({theme}) => theme.background.lighter};
        transition: background-color 0.2s linear;
    }
`;

export const MenuItemIcon = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    margin-right: 5px;
    width: 30px;
    height: 30px;
`;

export const MenuItemLabel = styled.h1`
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;


export default Menu;