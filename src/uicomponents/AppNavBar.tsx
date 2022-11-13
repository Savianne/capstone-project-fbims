import React from "react";
import styled from "styled-components";

//Reusable Components
import UseRipple from "./reusables/Ripple/UseRipple";

//React Router
import { useNavigate } from "react-router-dom";

//FontAwesome Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Global State Hooks Dependencies
import { useAppSelector, useAppDispatch } from "../global-state/hooks";


interface INavBar {
    className?: string,
    children?: JSX.Element | string | never[],
}

const NavBar: React.FC<INavBar> = ({className}) => {
    const navBarState = useAppSelector(state => state.navBarToggle.state);
    const navRef = React.useRef<HTMLElement>(null);
    const [currentPath, updateCurrentPath] = React.useState<string>(window.location.pathname);

    React.useEffect(() => {
        navRef.current?.setAttribute('navState', navBarState);    
    }, [navBarState]);
    return (
        <nav ref={navRef} className={className}>
            <SNavBarLink 
            title="Information" 
            icon={<FontAwesomeIcon icon={["fas", "users"]} />} 
            path={
                {
                    root: '/information', 
                    children: ['/information/members', '/information/ministry', '/information/organizations']
                }
            } 
            switchPath={(path) => updateCurrentPath(path)}
            currentPath={currentPath}
            />
            <SNavBarLink 
            title="Attendance" 
            icon={<FontAwesomeIcon icon={["fas", "clipboard-list"]} />} 
            path="/attendance" 
            switchPath={(path) => updateCurrentPath(path)}
            currentPath={currentPath}
            />
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
        </div>
    );
}


const SNavBarLink = styled(NavBarLink)`
    display: flex;
    height: 50px;
    flex: 0 1 100%;
    align-items: center;
`

const AppNavBar = styled(NavBar)`
    background-color: ${({theme}) => theme.background.primary};
    overflow: hidden;

    &[navstate='open'] {
        width: 215px;
    }
    &[navstate='close'] {
        width: 65px;
    }

    transition: width 300ms ease-in-out;

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
`;

export default AppNavBar;