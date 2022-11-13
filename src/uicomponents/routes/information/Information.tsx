import { Link, useNavigate } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../RouteContentBase";

import UseRipple from "../../reusables/Ripple/UseRipple";
import Devider from "../../reusables/devider";

interface ISiteMap {
    className?: string,
    children?: React.ReactChild | React.ReactChild[],
}

const FCSiteMap: React.FC<ISiteMap> = ({className, children}) => {
    return (
        <div className={className}>
            <span className='icon'>
                <FontAwesomeIcon icon={["fas", "sitemap"]} />
            </span>
            { children }
        </div>
    );
}

export const SiteMap = styled(FCSiteMap)`
    display: flex;
    width: fit-content;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: ${({theme}) => theme.staticColor.primary};

    & .icon {
        font-size: 11px;
        margin-right: 5px;
        color: ${({theme}) => theme.textColor.light}
    }

    & a {
        text-decoration: none;
        color: inherit;
    }

`

const FolderContainer = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    flex-wrap: wrap;
    height: fit-content;
`;

const FolderBase = styled.div`
    display: flex;
    width: 280px;
    height: 200px;
    align-items: center;
    justify-content: center;
`;


const ManageBtn = styled(UseRipple)`
    position: absolute;
    right: 20px;
    bottom: -25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    height: 80px;
    width: 80px;
    background-color: ${({theme}) => theme.mode == 'dark'? '#0e5269' : theme.background.lighter};
    font-size: 50px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    color: ${({theme}) => theme.textColor.strong};
    transition: background-color 300ms linear, height 300ms, width 300ms, right 300ms, box-shadow 300ms;
    cursor: pointer;

    &:hover {
        height: 83px;
        width: 83px;
        right: 15px;
        box-shadow: -0.9px 8px 4px 0 rgba(0, 0, 0, 0.25);
    }
`

interface IFolder {
    icon: JSX.Element,
    name: string,
    records: number,
    className?: string,
    path: string
}

const FCFolder: React.FC<IFolder> = ({icon, name, records, className, path}) => {
    const navigate = useNavigate();
    return (
        <div className={className}>
            <span className="icon"> { icon } </span>
            <div className="container top">
                <div className="folder-icon-base">
                    <span className="folder-icon"> { icon } </span>
                </div>
                <p className="folder-name">{name}</p>
            </div>
            <div className="container bot">
                <span className="records">
                    <strong>{ records }</strong>
                    <p>Records</p>
                </span>
                <ManageBtn onClick={() => navigate(path)}>
                    <FontAwesomeIcon icon={["fas", "angle-right"]} />
                </ManageBtn>
            </div>
        </div>
    )
}

const Folder = styled(FCFolder)`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    width: 240px;
    height: 125px;
    border-radius: 5px;
    background-color: rgba(217, 217, 217, 0.29);
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    background-color: ${({theme}) => theme.mode == 'dark'? '#253156' : theme.background.lighter};
    transition: background-color 300ms linear;

    & .container {
        display: flex;
        align-items: center;
        flex: 0 1 100%;
        height: 50%;
        z-index: 10;
    }

    & .top .folder-icon-base {
        position: relative;
        display: flex;
        height: 100%;
        width: 79px;
        padding: 0 10px;
    }

    & .top .folder-icon-base .folder-icon  {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 67px;
        width: 79px;
        background-color: ${({theme}) => theme.staticColor.primary};
        border-radius: 3px;
        position: absolute;
        top: -15px;
        color: #fff;
        font-size: 35px;
    }

    & .top .folder-name {
        font-size: 20px;
        color: ${({theme}) => theme.textColor.strong};
    }

    & .bot {
        flex-wrap: wrap;
        position: relative;
        padding-left: 10px;
        background-color: rgba(217, 217, 217, 0.29);
    }

    & .bot .records {
        display: flex;
        flex-direction: column;
        width: 90%;
        height: fit-content;
        font-size: 12px;
        color: ${({theme}) => theme.textColor.strong}
    }

    & .bot .records strong {
        font-weight: 600;
    }

    & .icon {
        font-size: 95px;
        position: absolute;
        left: 15px;
        color: rgba(217, 217, 217, 0.40);
    }
`;

const Information: React.FC = () => {
    return (
        <RouteContentBase>
            <RouteContentBaseHeader>
                <strong>Information</strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    / <Link to='/information'> information</Link>
                </SiteMap>
            </RouteContentBaseHeader>
            <RouteContentBaseBody>
                <FolderContainer>
                    <FolderBase>
                        <Folder name='Members' icon={<FontAwesomeIcon icon={["fas", "users"]} />} records={564} path="./members" />
                    </FolderBase>
                    <FolderBase>
                        <Folder name='Ministry' icon={<FontAwesomeIcon icon={["fas", "hand-holding-heart"]} />} records={564} path="./ministry" />
                    </FolderBase>
                    <FolderBase>
                        <Folder name='Organizations' icon={<FontAwesomeIcon icon={["fas", "hands-helping"]} />} records={564} path="./organizations" />
                    </FolderBase>
                </FolderContainer>
            </RouteContentBaseBody>
        </RouteContentBase>
    )
}



export default Information;