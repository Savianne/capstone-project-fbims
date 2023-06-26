import { Link, useNavigate } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";
import { useParams } from "react-router-dom";
import Devider from "../../../reusables/devider";
import SiteMap from "../../SiteMap";
import GoBackBtn from "../../../GoBackBtn";
import Button from "../../../reusables/Buttons/Button";
import Avatar from "../../../reusables/Avatar";
import { AVATAR_BASE_URL } from "../../../../API/BASE_URL";
import SkeletonLoading from "../../../reusables/SkeletonLoading";
import Input from "../../../reusables/Inputs/Input";

import useGetOrganizationInfo from "../../../../API/hooks/useGetOrganizationInfo";
import useGetOrganizatioMembers from "../../../../API/hooks/useGetOrganizationMembers";
import AddOrganizationMemberSearchComp from "../../../search/AddOrganizationMembersSearchComponent";

import { IStyledFC } from "../../../IStyledFC";

interface IMember {
    name: string,
    avatar: string | null,
    age: number,
    memberUID: string,
    gender: string
}

const ContentWraper = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    height: fit-content;
    padding: 15px 0;
    align-items: center;
    justify-content: center;

    header {
        display: flex;
        align-items: center;
        flex: 0 1 100%;
        min-height: 200px;
        background-color: ${({theme}) => theme.background.light};
        padding: 10px 15px;
    }

    header .avatar-area {
        display: flex;
        flex: 0 0 140px;
        height: 140px;
    }
    
    header .group-info {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        height: fit-content;
        margin-left: 15px;
        color: ${({theme}) => theme.textColor.strong}
    }

    header .group-info h1 {
        width: 100%;
        font-size: 40px;
        font-weight: 600;
    }

    header .button-group {
        display: flex;
        gap: 10px;
        flex-direction: column;
        width fit-content;
        height: fit-content;
    }

    header .button-group ${Button} {
        width: 100px;
    }

    .tab-toggle {
        display: flex;
        flex: 0 1 100%;
        padding: 20px 0;
        align-items: center;
    }

    .tab-content {
        display: flex;
        flex: 0 1 100%;

        .skeleton-item {
            display: flex;
            flex: 0 1 100%;
            flex-wrap: wrap;
            gap: 10px;
        }
    }
`;

const ManageOrganizationView: React.FC = () => {
    const { orgUID } = useParams();
    const {data:organizationMembers, isLoading: iseLoadingMembers, isError: isErrorLoadingMembers, isUpdating: isUpdatingMembersList} = useGetOrganizatioMembers(orgUID as string);
    const {data, isLoading, isError, isUpdating, error} = useGetOrganizationInfo(orgUID as string);
    const [addMemberState, setAddMemberState] = React.useState(false);
    return (
        <RouteContentBase>
            {
                addMemberState && <AddOrganizationMemberSearchComp close={() => setAddMemberState(!addMemberState)} organizationUID={orgUID as string} />
            }
            <RouteContentBaseHeader>
                <strong>Manage {data?.organizationName} </strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    /information/organization/ {orgUID as string}
                </SiteMap>
                <GoBackBtn />
            </RouteContentBaseHeader>
            <RouteContentBaseBody>
                <ContentWraper>
                    <header>
                        <div className="avatar-area">
                            <Avatar size="140px " src={`${AVATAR_BASE_URL}/${data?.avatar}`} alt="A" />
                        </div>
                        <div className="group-info">
                            <h1>{data?.organizationName}</h1>
                            <p>{data?.description}</p>
                        </div>
                        <div className="button-group">
                            <Button icon={<FontAwesomeIcon icon={["fas", "trash"]} />} label="Delete" color="delete" />
                            <Button icon={<FontAwesomeIcon icon={["fas", "edit"]} />} label="Edit" color="edit" />
                        </div>
                    </header>
                    <div className="tab-toggle">
                        <MembersListTabToggle membersTotal={543} isActive={false} />
                        <Addmemberbtn onClick={() => setAddMemberState(true)} />
                    </div>
                    <div className="tab-content">
                        {
                            organizationMembers && <MembersList list={[...organizationMembers.map(item => ({...item, age: (new Date().getFullYear() - new Date(item.dateOfBirth).getFullYear()), name: `${item.firstName} ${item.middleName[0]}. ${item.surname} ${item.extName? item.extName : ""}`.toUpperCase()}))] as IMember[]} />
                        }
                        {
                            iseLoadingMembers && <>
                            <div className="skeleton-item">
                                <SkeletonLoading height="85px" />
                                <SkeletonLoading height="85px" />
                                <SkeletonLoading height="85px" />
                                <SkeletonLoading height="85px" />
                                <SkeletonLoading height="85px" />
                            </div>
                            </>
                        }
                    </div>
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
    )
}

interface IFCMembersListTabToggle extends IStyledFC {
    membersTotal: number;
    isActive: boolean
}

const FCMembersListTabToggle: React.FC<IFCMembersListTabToggle> = ({className, membersTotal, isActive}) => {

    return (
        <div className={className}>
            <span className="bar"></span>
            <div className="content">
                <h1>Members List</h1>
                <span>Total: <h5>{membersTotal}</h5></span>
            </div>
        </div>
    )
}

const MembersListTabToggle = styled(FCMembersListTabToggle)`
    display: flex;
    height: 90px;
    flex: 0 1 fit-content;
    min-width: 100px;
    padding: 5px;
    border-radius: 5px;
    align-items: center;
    color: ${({theme}) => theme.textColor.strong};
    background-color: ${({theme}) => theme.background.lighter};
    box-shadow: 0 4px 4px 0 rgba(0,0,0,0.25);

    .bar {
        display: flex;
        height: 100%;
        border-radius: 5px;
        width: 5px;
        background-color: ${({theme, isActive}) => isActive? theme.staticColor.primary : theme.staticColor.disabled};;
    }

    .content {
        display: flex;
        flex; 1;
        flex-wrap: wrap;
        padding: 15px 0;
        margin-left: 10px;
        height: fit-content;
        font-weight: bold;

        h1 {
            flex: 0 1 100%;
            font-size: 25px;
        }

        span {
            display: flex;
            align-items: center;
            font-size: 13px;

            h5 {
                font-size: 25px;
                margin-left: 10px;
            }
        }
    }
`

interface IFCMembersTable extends IStyledFC {
    list: IMember[] | null,
} 


const FCMembersList: React.FC<IFCMembersTable> = ({className, list}) => {

    return (
        <div className={className}>
            {
                list && list.map(item => {
                    return <ListItem item={item} />
                })
            }
        </div>
    )
}

interface IFCList extends IStyledFC {
    item: IMember
}

const FCListItem: React.FC<IFCList> = ({className, item}) => {
    return (
        <div className={className}>
            <Avatar alt={item.name} src={item.avatar} size="50px" />
            <div className="info">
                <h1>{item.name}</h1>
                <span>
                    <strong>Gender: <p>{item.gender}</p></strong>
                    <Devider $orientation="vertical" $flexItem $variant="center" $css="margin: 0 10px; border-width: 2px"/>
                    <strong>Age: <p>{item.age}</p></strong>
                </span>
            </div>
            <Button label="Remove" color="delete" variant="hidden-bg-btn" onClick={() => alert(item.memberUID)} />
        </div>
    )
} 

const ListItem = styled(FCListItem)`
    display: flex;
    flex: 0 1 100%;
    height: 70px;
    padding: 10px;
    align-items: center;
    border-radius: 5px;
    background-color: ${({theme}) => theme.background.lighter};
    
    .info {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        height: fit-content;
        margin-left: 15px;
        color:  ${({theme}) => theme.textColor.strong};

        h1 {
            flex: 0 1 100%;
            font-size: 20px;
            font-weight: 300;
        }

        span {
            display: flex;
            align-items: center;
            height: 15px;
            margin-top: 5px;

            strong {
                display: flex;
                align-items: center;
                font-weight: 600;
                font-size: 15px;

                p {
                    margin-left: 10px;
                    font-weight: 200;
                }
            }
        }
    }

    ${Button} {
        margin-left: auto;
    }

`

const MembersList = styled(FCMembersList)`
    display: flex;
    flex: 0 1 100%;
    flex-wrap: wrap;
    gap: 10px;
`;

interface IAddMemberBtn extends IStyledFC {
    onClick: () => void
}

const FCAddMembersBtn: React.FC<IAddMemberBtn> = ({className, onClick}) => {

    return (
        <div className={className}>
            <Button onClick={() => onClick()} iconButton icon={<FontAwesomeIcon icon={['fas', "plus"]} />} label="" variant="hidden-bg-btn" color="primary" />
        </div>
    )
}

const Addmemberbtn = styled(FCAddMembersBtn)`
    width: fit-content;
    height: fit-content;
    margin: 0 10px;

    ${Button} {
        height: 50px;
        width: 50px;
        font-size: 30px;
    }
`;

export default ManageOrganizationView;