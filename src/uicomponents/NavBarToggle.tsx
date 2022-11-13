import styled from "styled-components";
import React from "react";

//FontAwesomeIcons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Global State Dispatch Hook
import { useAppDispatch } from "../global-state/hooks";

//Global State Action
import { closeNav, openNav } from "../global-state/action-creators/navBarToggleSlice";

//Reusable Utility Components
import UseToggle from "./reusables/Toggle/UseToggle";
import UseRipple from "./reusables/Ripple/UseRipple";

const SNavbarToggle = styled(UseToggle)`
    & {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        transition: background-color 1s linear, color 0.5s linear;
        font-size: 20px;
        cursor: pointer;
    }
    &[state='off'] {
        background-color: ${({theme}) => theme.staticColor.primary};
        color: #fff;
    }

    &[state='on'] {
        color: ${({theme}) => theme.staticColor.primary};
        background-color: transparent;
    }
`;

const SNavbarToggleWithRipple = styled(UseRipple)`
    display: flex;
    width: 65px;
    height: 65px;
`;

const NavBarToggle: React.FC = () => {
    const dispatcher = useAppDispatch();

    return (
        <SNavbarToggleWithRipple>
            <SNavbarToggle
            name="navbar-toggle"
            off={(name: string) => dispatcher(closeNav())} 
            on={(name: string) => dispatcher(openNav())}>
                <FontAwesomeIcon icon={["fas", "bars"]} />
            </SNavbarToggle>
        </SNavbarToggleWithRipple>
    );
}

export default NavBarToggle;