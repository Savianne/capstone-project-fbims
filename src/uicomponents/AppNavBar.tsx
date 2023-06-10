import React from "react";
import styled from "styled-components";

//Reusable Components
import UseRipple from "./reusables/Ripple/UseRipple";
import Devider from "./reusables/devider";
import Button from "./reusables/Buttons/Button";
import SkeletonLoading from "./reusables/SkeletonLoading";

//React Router
import { useNavigate } from "react-router-dom";

//FontAwesome Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Global State Hooks Dependencies
import { useAppSelector, useAppDispatch } from "../global-state/hooks";

//Global State Actions
import { openSideBar, closeSideBar } from "../global-state/action-creators/sideBarToggleSlice";

interface INavBar {
    className?: string,
    children?: JSX.Element | string | never[],
}

const NavBar: React.FC<INavBar> = ({className}) => {
    const admin = useAppSelector(state => state.setAdmin.admin);
    const navBarState = useAppSelector(state => state.navBarToggle.state);
    const navRef = React.useRef<HTMLElement>(null);
    const [currentPath, updateCurrentPath] = React.useState<string>(window.location.pathname);

    const sideBarState = useAppSelector(state => state.sideBarToggleReducer.state);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        navRef.current?.setAttribute('navState', navBarState);    
    }, [navBarState]);
    return (
        <nav ref={navRef} className={className}>
        {
        admin? <>
            <SNavBarLink 
            title="Information" 
            icon={<FontAwesomeIcon icon={["fas", "users"]} />} 
            path={
                {
                    root: '/app/information', 
                    children: ['/information/members', '/information/ministry', '/information/organizations']
                }
            } 
            switchPath={(path) => updateCurrentPath(path)}
            currentPath={currentPath}
            />
            <SNavBarLink 
            title="Attendance" 
            icon={<FontAwesomeIcon icon={["fas", "clipboard-list"]} />} 
            path="/app/attendance" 
            switchPath={(path) => updateCurrentPath(path)}
            currentPath={currentPath}
            />
            <SNavBarLink 
            title="Calendar" 
            icon={<FontAwesomeIcon icon={["fas", "calendar-alt"]} />} 
            path="/app/calendar" 
            switchPath={(path) => updateCurrentPath(path)}
            currentPath={currentPath}
            />
        </> : <>
            <NavLinkLoadingSkeleton />
            <NavLinkLoadingSkeleton />
            <NavLinkLoadingSkeleton />
        </>
        }
            <Devider $variant="center"/>
        {
            admin? <>
            <SideBarToggleContainer onClick={(e) => sideBarState == "open"? dispatch(closeSideBar()) : dispatch(openSideBar())}>
                <ToggleBoxContainer>
                    <SideBarToggle label="Toggle Sidebar" 
                        icon={<FontAwesomeIcon icon={["fas", "calendar-day"]} />} 
                        variant="standard" 
                        color="theme" 
                        iconButton 
                        onClick={(e) => {
                            // sideBarState == 'open'? dispatcher(closeSideBar()) : dispatcher(openSideBar());
                        }} />
                </ToggleBoxContainer>
                <p className="toggle-title">Today's Events</p>
            </SideBarToggleContainer>
            <SideBarToggleContainer onClick={(e) => sideBarState == "open"? dispatch(closeSideBar()) : dispatch(openSideBar())}>
                <ToggleBoxContainer>
                    <SideBarToggle label="Toggle Sidebar" 
                        icon={<FontAwesomeIcon icon={["fas", "bell"]} />} 
                        variant="standard" 
                        color="theme" 
                        iconButton 
                        onClick={(e) => {
                            // sideBarState == 'open'? dispatcher(closeSideBar()) : dispatcher(openSideBar());
                        }} />
                </ToggleBoxContainer>
                <p className="toggle-title">Notifications</p>
            </SideBarToggleContainer>
            </> : <>
                <NavLinkLoadingSkeleton round />
                <NavLinkLoadingSkeleton round />
            </>
        }  
        </nav>
    );
}

interface INavLink {
    className?: string,
    children?: JSX.Element | string | never[],
    icon: JSX.Element,
    title: string,
    path: string | {root: string, children: string[]},
    switchPath: (path: string) => void,
    currentPath: string,
}

const NavBarLink: React.FC<INavLink> = ({className, title, icon, path, currentPath, switchPath}) => {

    const navLinkRef = React.useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        if(typeof path == 'string') {
            currentPath === path? navLinkRef.current?.setAttribute('navLinkState', 'active') : navLinkRef.current?.setAttribute('navLinkState', 'inactive');
        } else {
            currentPath === path.root || path.children.includes(currentPath)? navLinkRef.current?.setAttribute('navLinkState', 'active') : navLinkRef.current?.setAttribute('navLinkState', 'inactive');
        }
    }, [currentPath]);

    return (
        
        <div ref={navLinkRef} className={className}  
        onClick={() => {
            navigate(typeof path == 'string'? path : path.root);
            switchPath(typeof path == 'string'? path : path.root);
        }}>
            <UseRipple>
                <span className="nav-link-container">
                    <span className="nav-link-icon-container">
                        <i className="nav-link-icon">
                            {
                                icon
                            }
                        </i>
                    </span>
                    <p className="nav-link-text">{ title }</p>
                </span>
            </UseRipple>
        </div>
    );
}

const SNavBarLink = styled(NavBarLink)`
    display: flex;
    height: 50px;
    flex: 0 1 100%;
    align-items: center;
`

const SideBarToggleContainer = styled.div`
    display: flex;
    height: 50px;
    width: 200px;
    align-items: center;
    cursor: pointer;

    .toggle-title {
        margin-left: 5px;
        font-size: 14px;
        color: ${({theme}) => theme.textColor.strong};
    }
`
const SideBarToggle = styled(Button)`
    width: 35px;
    height: 35px;
    border-radius: 50%;
    font-size: 15px;
    overflow: hidden;
`;

const ToggleBoxContainer = styled.span`
    display: flex;
    width: 65px;
    height: fit-content;
    align-items: center;
    justify-content: center;
`;

const AppNavBar = styled(NavBar)`
    background-color: ${({theme}) => theme.background.primary};
    overflow: hidden;
    border-right: 1px solid ${({theme}) => theme.borderColor};
    transition: width 300ms ease-in-out;

    &[navstate='open'] {
        width: 215px;
    }
    &[navstate='close'] {
        width: 65px;
    }

    & ${SNavBarLink} .nav-link-container {
        display: flex;
        align-items: center;
        height: 35px;
        width: 200px;
        border-radius: 0 7px 7px 0;
        transition: background-color 350ms linear;
        cursor: pointer;
    }

    &[navstate='open'] ${SNavBarLink}[navlinkstate='active'] .nav-link-container {
        background-color: ${({theme}) => theme.staticColor.primary};
    }

    &[navstate='open'] ${SNavBarLink}[navlinkstate='inactive'] .nav-link-container:hover {
        background-color: ${({theme}) => theme.background.light};
    }

    & ${SNavBarLink} .nav-link-container .nav-link-icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 65px;
        /* background-color: gray; */
    }

    & ${SNavBarLink} .nav-link-container .nav-link-icon-container .nav-link-icon {
        display: flex;
        height: 35px;
        width: 35px;
        font-size: 15px;
        border-radius: 3px;
        align-items: center;
        justify-content: center;
        transition: background-color 190ms linear;
        color: ${({theme}) => theme.staticColor.primary};
    }

    & ${SNavBarLink}[navlinkstate='active'] .nav-link-container .nav-link-icon-container .nav-link-icon {
        color: #fff;
    }

    &[navstate='close'] ${SNavBarLink}[navlinkstate='active'] .nav-link-container .nav-link-icon-container .nav-link-icon {
        background-color: ${({theme}) => theme.staticColor.primary};
    }

    &[navstate='close'] ${SNavBarLink}[navlinkstate='inactive'] .nav-link-container .nav-link-icon-container .nav-link-icon:hover {
        background-color: ${({theme}) => theme.background.light};
    }

    & ${SNavBarLink} .nav-link-container .nav-link-text {
        margin-left: 5px;
        font-size: 14px;
        color: ${({theme}) => theme.staticColor.primary};
    }

    & ${SNavBarLink}[navlinkstate='active'] .nav-link-container .nav-link-text {
        color: #fff;
    }

    @media screen and (max-width: 500px) {
        & {
            display: none;
        }
    }
`;

const NavLinkLoadingSkeleton: React.FC<{round?: boolean}> = ({round}) => {
    return (
        <NavLinkLoadingContainer>
            <span className="nav-link-container">
                    <span className="nav-link-icon-container">
                        <i className="nav-link-icon">
                            <SkeletonLoading width="35px" height='35px' round={round} />
                        </i>
                    </span>
                    <p className="nav-link-text"><SkeletonLoading width="100%" height='100%' /></p>
                </span>
        </NavLinkLoadingContainer>
    )
}

const NavLinkLoadingContainer = styled.div`
    display: flex;
    height: 50px;
    flex: 0 1 100%;
    align-items: center;

    .nav-link-container {
        display: flex;
        align-items: center;
        height: 35px;
        width: 200px;
        border-radius: 0 7px 7px 0;
    }

    .nav-link-container .nav-link-icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 65px;
        /* background-color: gray; */
    }

    .nav-link-container .nav-link-icon-container .nav-link-icon {
        display: flex;
        height: 35px;
        width: 35px;
        font-size: 15px;
        border-radius: 3px;
        align-items: center;
        justify-content: center;
    }

    .nav-link-container .nav-link-text {
        flex: 1;
        margin-left: 5px;
        height: height: 35px;
    }
`;

export default AppNavBar;