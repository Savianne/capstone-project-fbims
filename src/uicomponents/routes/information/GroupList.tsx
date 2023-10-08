import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ScaleLoader from "react-spinners/ScaleLoader";
import { AVATAR_BASE_URL } from "../../../API/BASE_URL";
import { IStyledFC } from "../../IStyledFC";

import AvatarGroup from '../../reusables/AvatarGroup';
import Avatar from '../../reusables/Avatar';
import Button from "../../reusables/Buttons/Button";
import useGetMinistryMembers from "../../../API/hooks/useGetMinistryMembers";
import useGetOrganizatioMembers from "../../../API/hooks/useGetOrganizationMembers";
import { useNavigate } from "react-router-dom";
// const FCManageBtn: React.FC<IStyledFC> = ({className}) => {
//     return (
//         <span className={className}
//         onClick={() => {
            
//         }}>
//             <i className="icon"><FontAwesomeIcon icon={["fas", "arrow-circle-right"]} /></i> Manage
//         </span>
//     )
// }

// const ManageBtn = styled(FCManageBtn)`
//     display: flex;
//     margin-left: auto;
//     border: none;
//     flex-direction: row;
//     align-items: center;
//     justify-content: center;
//     font-size: 13px;
//     color: ${({theme}) => theme.staticColor.primary};
//     cursor: pointer;

//     & .icon {
//         width: fit-content;
//         height: fit-content;
//         margin-right: 5px;
//     }
// `

export interface IFCGroupListItem extends IStyledFC {
    avatar?: string | null,
    groupName: string,
    groupUID: string,
} 

export const MinistryListItem: React.FC<IFCGroupListItem> = ({className, avatar, groupName, groupUID}) => {
    const navigate = useNavigate()
    const {data, isLoading, isError, isUpdating, error} = useGetMinistryMembers(groupUID);
    const [avatarList, setAvatarList] = React.useState<{ alt: string, src?: string | null}[]>([]);

    React.useEffect(() => {
        if(data) {
            const itemList = data.map(item => {
                return {src: item.avatar, alt: item.firstName}
            });
            setAvatarList(itemList);
        }
    }, [data])
    return (
        <GroupListItem>
            <span className="avatar-container">
                <Avatar size="35px" alt={groupName} src={avatar} />
            </span>
            <span className="vertical-items">
                <h1>{ groupName }</h1>
                <span className="group-member-avatar-list">
                    {
                        isLoading? <ScaleLoader color="#36d7b7" height={"20px"}/> :
                        isError? <i className="error-load-icon"><FontAwesomeIcon icon={["fas", "exclamation-circle"]} size="lg" /></i> :
                        (data && data.length)? <AvatarGroup size="20px" limit={5} avatars={avatarList} /> :  <p>0 Member</p>
                    }

                    {/* <AvatarGroup size="20px" limit={5} avatars={membersAvatar} /> */}
                </span>
            </span>
            <Button label="Manage" icon={<FontAwesomeIcon icon={["fas", "arrow-circle-right"]} />} variant="hidden-bg-btn" color="primary" onClick={() => navigate(`/app/information/ministry/${groupUID}`)} />
        </GroupListItem>
    )
}

export const OrgaizationListItem: React.FC<IFCGroupListItem> = ({className, avatar, groupName, groupUID}) => {
    const navigate = useNavigate();
    const {data, isLoading, isError, isUpdating, error} = useGetOrganizatioMembers(groupUID);
    const [avatarList, setAvatarList] = React.useState<{ alt: string, src?: string | null}[]>([]);

    React.useEffect(() => {
        if(data) {
            const itemList = data.map(item => {
                return {src: item.avatar, alt: item.firstName}
            });
            setAvatarList(itemList);
        }
    }, [data])
    return (
        <GroupListItem>
            <span className="avatar-container">
                <Avatar size="35px" alt={groupName} src={avatar} />
            </span>
            <span className="vertical-items">
                <h1>{ groupName }</h1>
                <span className="group-member-avatar-list">
                    {
                        isLoading? <ScaleLoader color="#36d7b7" height={"20px"}/> :
                        isError? <i className="error-load-icon"><FontAwesomeIcon icon={["fas", "exclamation-circle"]} size="lg" /></i> :
                        (data && data.length)? <AvatarGroup size="20px" limit={5} avatars={avatarList} /> :  <p>0 Member</p>
                    }

                    {/* <AvatarGroup size="20px" limit={5} avatars={membersAvatar} /> */}
                </span>
            </span>
            <Button label="Manage" icon={<FontAwesomeIcon icon={["fas", "arrow-circle-right"]} />} variant="hidden-bg-btn" color="primary" onClick={() => navigate(`/app/information/organizations/${groupUID}`)} />
        </GroupListItem>
    )
}

export const GroupListItem = styled.div`
    display: flex;
    flex: 0 1 100%;
    align-items: center;
    border: 1px solid ${({theme}) => theme.borderColor};
    border-left-width: 5px;
    border-left-color: rgb(0, 150, 136);;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 10px;
    background-color: ${({theme}) => theme.background.lighter};

    & .avatar-container {
        width: fit-content;
        height: fit-content;
        margin-right: 15px;
    }

    & .avatar-container ${Avatar} {
        border-width: 3px;
    }

    & .vertical-items {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
    }

    & .vertical-items h1 {
        flex: 0 1 100%;
        font-size: 16px;
        color: ${({theme}) => theme.textColor.strong};
        margin-bottom: 5px;
        font-weight: 200;
        /* font-family: Sen-Regular; */
    }

    & .vertical-items .group-member-avatar-list ${Avatar} {
        font-size: 11px;
        margin-left: -6px;
        border: 2px solid ${({theme}) => theme.borderColor};
    }

    & .vertical-items .group-member-avatar-list .error-load-icon {
        color: ${({theme}) => theme.staticColor.delete};
    }

    & .vertical-items .group-member-avatar-list p {
        font-size: 11px;
        font-weight: 600;
        color: ${({theme}) => theme.textColor.light};
    }
`

const GroupList = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex: 0 1 100%;
    align-items: center;
    padding: 10px 0;
`;

export default GroupList;
