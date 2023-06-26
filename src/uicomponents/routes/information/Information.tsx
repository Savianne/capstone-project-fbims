import { Link, useNavigate } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ScaleLoader from "react-spinners/ScaleLoader";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../RouteContentBase";
import doRequest from "../../../API/doRequest";
import UseRipple from "../../reusables/Ripple/UseRipple";
import Devider from "../../reusables/devider";
import SiteMap from "../SiteMap";
import useGetRecordsCount from "../../../API/hooks/useGetRecordsCount";

const FolderContainer = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    flex-wrap: wrap;
    height: fit-content;
    padding-bottom: 40px;
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
    /* font-size: 50px; */
    font-size: 30px;
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
    path: string,
    isLoading: boolean,
    isError: boolean
}

const FCFolder: React.FC<IFolder> = ({icon, name, records, className, path, isLoading, isError}) => {
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
                    {
                        isLoading? <ScaleLoader color="#36d7b7" height={"15px"}/> : isError? <span className="isError"><FontAwesomeIcon icon={["fas", "exclamation-circle"]} /> Error!</span> : <strong>{ records }</strong>
                    }
                    <p>Records</p>
                </span>
                <ManageBtn onClick={() => setTimeout(() => navigate(path), 400) }>
                    {/* <FontAwesomeIcon icon={["fas", "angle-right"]} /> */}
                    <FontAwesomeIcon icon={["fas", "folder-open"]} />
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
    background-color: ${({theme}) => theme.mode == 'dark'? '#383e51' : theme.background.lighter};
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
        background-color: ${({theme}) => theme.mode == 'light'? 'rgba(217, 217, 217, 0.29)' : 'rgb(37 38 45 / 29%)'} ;
    }

    & .bot .records {
        display: flex;
        flex-direction: column;
        width: 90%;
        height: fit-content;
        font-size: 12px;
        color: ${({theme}) => theme.textColor.strong};

        .isError {
            color: ${({theme}) => theme.staticColor.delete};
        }
    }

    & .bot .records strong {
        font-weight: 600;
    }

    & .icon {
        font-size: 95px;
        position: absolute;
        left: 15px;
        color: ${({theme}) => theme.mode == 'light'? 'rgba(217, 217, 217, 0.40)' : 'rgb(64 68 86)'};
    }
`;

const Information: React.FC = () => {
    const {
        members,
        ministry,
        organizations
    } = useGetRecordsCount();

    return (
        <RouteContentBase>
            <RouteContentBaseHeader>
                <strong>Information</strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    / <Link to='/app/information'> information</Link>
                </SiteMap>
            </RouteContentBaseHeader>
            <RouteContentBaseBody>
                <FolderContainer>
                    <FolderBase>
                        <Folder isError={members.isError} isLoading={members.isLoading} name='Members' icon={<FontAwesomeIcon icon={["fas", "users"]} />} records={members.count} path="members" />
                    </FolderBase>
                    <FolderBase>
                        <Folder isError={ministry.isError} isLoading={ministry.isLoading} name='Ministry' icon={<FontAwesomeIcon icon={["fas", "hand-holding-heart"]} />} records={ministry.count} path="ministry" />
                    </FolderBase>
                    <FolderBase>
                        <Folder isError={organizations.isError} isLoading={organizations.isLoading} name='Organizations' icon={<FontAwesomeIcon icon={["fas", "people-group"]} />} records={organizations.count} path="organizations" />
                    </FolderBase>
                    {/* <FolderBase>
                        <Folder name='Families' icon={<FontAwesomeIcon icon={["fas", "people-roof"]} />} records={0} path="families" />
                    </FolderBase> */}
                </FolderContainer>
            </RouteContentBaseBody>
        </RouteContentBase>
    )
}



export default Information;