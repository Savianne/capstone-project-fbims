import React from "react";
import styled from "styled-components";

//FontAwesome Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Reusable Components
import UseRipple from "./reusables/Ripple/UseRipple";
import UseToggle from "./reusables/Toggle/UseToggle";

//Gobal state Hooks
import { useAppSelector, useAppDispatch } from "../global-state/hooks";

//Global State Actions
import { activeLightTheme, activeDarkTheme } from "../global-state/action-creators/themeModeSwitcherSlice";

const SThemeModeToggle = styled(UseToggle)`
    & {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        transition: background-color 1s linear, color 0.5s linear;
        font-size: 20px;
        cursor: pointer;
        color: gray;
        font-size: 25px;
    }
    /* &[state='off'] {
        background-color: ${({theme}) => theme.staticColor.primary};
        color: #fff;
    }

    &[state='on'] {
        color: ${({theme}) => theme.staticColor.primary};
        background-color: transparent;
    } */
`;

const SThemeModeToggleWithRipple = styled(UseRipple)`
    display: flex;
    width: 65px;
    height: 65px;
    margin-left: auto;
    border-left: 1px solid ${({theme}) => theme.borderColor};
    align-items: center;
    justify-content: center;
    transition: background-color 1s linear, color 0.5s linear;
    font-size: 20px;
    cursor: pointer;
    color: ${({theme}) => theme.textColor.strong};
    font-size: 25px;
`;

const ThemeModeToggle: React.FC = () => {
    const themeMode = useAppSelector(state => state.switchThemeModeReducer.theme.mode);
    const dispatch = useAppDispatch();

    return (
        <SThemeModeToggleWithRipple onClick={() => {
            themeMode == 'dark'? dispatch(activeLightTheme()) : dispatch(activeDarkTheme()) 
        }}>
            <FontAwesomeIcon icon={["fas", themeMode == 'light'? "moon" : 'sun']} />
        </SThemeModeToggleWithRipple>
    );
}

export default ThemeModeToggle;