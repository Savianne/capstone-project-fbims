import React from "react";
import styled from "styled-components";
import { IStyledFC } from "./IStyledFC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Scrollbars } from 'react-custom-scrollbars-2';

//Global state actions
import { openSideBar, closeSideBar } from "../global-state/action-creators/sideBarToggleSlice";

//Reusable Components 
import Button from "./reusables/Buttons/Button";
import Devider from "./reusables/devider";
import CuteCalendar from "./CuteCalendar";

import { useAppSelector, useAppDispatch } from "../global-state/hooks";

const SideBarToggle = styled(Button)`
    width: 40px;
    height: 40px;
    font-size: 18px;
`;

const ExpandToggle = styled(SideBarToggle)`

`;

const ToggleBoxContainer = styled.span`
    display: flex;
    width: 65px;
    height: 65px;
    align-items: center;
    justify-content: center;
`;

const FCTodaysBibleVerse: React.FC<IStyledFC> = ({className}) => {

    return (
        <div className={className}>
            <div className="glass-container">
                <h3>TODAY:</h3>
                <h1>Thursday</h1>
                <h5>February 23 2023</h5>
                <div className="bible-verse-area">
                    <p className="verse-text">
                        <FontAwesomeIcon icon={["fas", "quote-left"]} pull="left" size="lg" />
                        Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and 
                        of the Holy Spirit, and teaching them to obey everything I have commanded you. And surely I am with you always, 
                        to the very end of the age.
                    </p>
                    <p className="verse">- Matthew 28:19-20 (NIV)</p>
                </div>
            </div>
        </div>
    )
}

const TodaysBibleVerse = styled(FCTodaysBibleVerse)`
    position: relative;
    display: flex;
    width: 300px;
    height: 200px;
    background-image: url(/assets/images/abstract-background-landscape-mountains-illustration_574033-2.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 5px;
    justify-content: center;
    
    .glass-container {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        width: 100%;
        height: 100%;
        /* From https://css.glass */
        background: #39050533;
        border-radius: 5px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(0);
        -webkit-backdrop-filter: blur(0);
        transition: backdrop-filter 500ms, -webkit-backdrop-filter 500ms;
        overflow: hidden;
    }

    .glass-container:hover {
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
    }

    .glass-container h1, .glass-container h5, .glass-container h3 {
        font-size: 25px;
        font-weight: bold;
        display: block;
        flex: 0 1 100%;
        color: white;
        margin-left: 20px;
        max-height: 30px;
    }
    
    .glass-container h3 {
        margin-top: 5px;
        font-size: 10px;
    }

    .glass-container h5 {
        /* margin-top: 3px; */
        font-size: 13px;
        color: whitesmoke;
        font-weight: normal;
    }

    .bible-verse-area {
        display: flex;
        flex-wrap: wrap;
        flex: 0 1 100%;
        height: fit-content;
        /* border-left: 1px solid white; */
        margin-left: 10px;
        padding: 10px;
        margin-top: 20px;
    }

    .bible-verse-area .verse-text {
        color: white;
        flex: 0 1 100%;
        font-size: 10px;
        font-style: italic;
        font-family: AssistantExtraLight;
        text-align: justify;
    }

    .bible-verse-area .verse {
        font-size: 10px;
        margin-top: 10px;
        color: whitesmoke
    }
`;

const FCNoEventMessage: React.FC<IStyledFC> = ({className}) => {

    return (
        <div className={className}>
            <i className="icon">
                <FontAwesomeIcon icon={["fas", "calendar-times"]} />
            </i>
            <h5>
                No Schedule for this Date!
            </h5>
        </div>
    )
};

const NoEventMessage = styled(FCNoEventMessage)`
    display: flex;
    flex: 0 1 100%;
    height: fit-content;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: ${({theme}) => theme.textColor.light};
    opacity: 0.2;
    margin-top: 15px;

    .icon {
        font-size: 55px;
    }

    h5 {
        font-size: 20px;
    }
`;

const FCTodaysEventsSideBar: React.FC<IStyledFC> = ({className}) => {
    const dispatcher = useAppDispatch();
    const sideBarState = useAppSelector(state => state.sideBarToggleReducer.state);
    const calendarAndEventElemRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        calendarAndEventElemRef?.current?.setAttribute('state', sideBarState)
    }, [sideBarState]);
    return (
        <div className={className} ref={calendarAndEventElemRef}>
            <div className="sidebar-header">
                <h5><i><FontAwesomeIcon icon={["fas", "calendar-day"]} /></i>Today's Events</h5>
                <span className="expand-toggle">
                    <Button label="Expand" 
                    icon={<FontAwesomeIcon icon={["fas", "expand"]} />} 
                    variant="hidden-bg-btn" 
                    color="theme" 
                    iconButton 
                    onClick={(e) => {
                        sideBarState == 'open'? dispatcher(closeSideBar()) : dispatcher(openSideBar());
                    }} />
                </span>
                <Devider $orientation="vertical" $variant="center" />
                <span className="sidebar-toggle">
                    <Button label="Toggle Sidebar" 
                    icon={<FontAwesomeIcon icon={["fas", "times"]} />} 
                    variant="hidden-bg-btn" 
                    color="theme" 
                    iconButton 
                    onClick={(e) => {
                        sideBarState == 'open'? dispatcher(closeSideBar()) : dispatcher(openSideBar());
                    }} />
                </span>
            </div>
            {/* <div className="toggle-container">
                <ToggleBoxContainer>
                    <SideBarToggle label="Toggle Sidebar" 
                    icon={<FontAwesomeIcon icon={["fas", "calendar-day"]} />} 
                    variant="standard" 
                    color="theme" 
                    iconButton 
                    onClick={(e) => {
                        sideBarState == 'open'? dispatcher(closeSideBar()) : dispatcher(openSideBar());
                    }} />
                </ToggleBoxContainer>
            </div> */}
            <Devider $variant="center"/>
            <Scrollbars
            autoHide>
                <div className="sidebar-content-area">
                    <TodaysBibleVerse />
                    <div className="event-list-container">
                        <NoEventMessage />
                    </div>
                </div>
            </Scrollbars>
        </div>
    )
}



const TodaysEventsSideBar = styled(FCTodaysEventsSideBar)`
    position: relative;
    display: flex;
    height: calc(100% - 20px);
    transition: margin-left 400ms linear, width 400ms ease-in-out;
    overflow-x: hidden;
    flex-direction: column;
    border: 1px solid ${({theme}) => theme.borderColor};
    border-radius: 5px;
    margin: 10px 10px 10px 0;
    background-color: ${({theme}) => theme.background.primary};
    
    .sidebar-header {
        position: relative;
        display: flex;
        width: 330px;
        max-height: 40px;
        padding: 5px;
        align-items: center;
        align-self: flex-start;
        flex: 0 1 100%;
    }

    .sidebar-header h5 {
        font-size: 15px;
        color: ${({theme}) => theme.textColor.strong};
        margin-left: 10px;
        white-space: nowrap;
    }

    .sidebar-header h5 i {
        margin-right: 8px;
    }

    .sidebar-header .sidebar-toggle,
    .sidebar-header .expand-toggle {
        display: flex;
        height: fit-content;
        width: 40px;
        align-items: center;
        justify-content: center;
        z-index: 2;
        /* width: 350px; */
    }

    .sidebar-header .expand-toggle {
        margin-left: auto;
        /* width: 40px; */
    }

    /* &[state="open"] {
        width: 340px;
    }

    &[state="close"] {
        width: 0;
    } */

    &[state="open"] {
        margin-left: 0;
        width: 340px;
    }

    &[state="close"] {
        margin-left: 100%;
        margin-right: 0;
        width: 0;
    }

    /* .toggle-container {
        position: absolute;
        top: 0;
        display: flex;
        height: 100%;
        width: 65px;
        z-index: 100;
        background-color: ${({theme}) => theme.background.primary};
        transition: right 370ms ease-in-out;
    }

    &[state='open'] .toggle-container {
        right: -65px;
    }

    &[state='close'] .toggle-container {
        right: 0;
    } */

    .sidebar-content-area {
        display: flex;
        flex: 0 1 100%;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        padding: 10px 0;
    }

    .sidebar-content-area .event-list-container {
        display: flex;
        flex-wrap: wrap;
        flex: 0 1 300px;
        height: 1000px;
        margin: 15px 0;
    }

`;


export default TodaysEventsSideBar;