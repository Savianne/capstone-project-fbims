import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";
import { useParams, useNavigate } from "react-router-dom";
import Devider from "../../../reusables/devider";
import SiteMap from "../../SiteMap";
import GoBackBtn from "../../../GoBackBtn";
import Button from "../../../reusables/Buttons/Button";
import Avatar from "../../../reusables/Avatar";
import { AVATAR_BASE_URL } from "../../../../API/BASE_URL";
import SkeletonLoading from "../../../reusables/SkeletonLoading";
import Input from "../../../reusables/Inputs/Input";
import UseRipple from "../../../reusables/Ripple/UseRipple";
import useGetOrganizationInfo from "../../../../API/hooks/useGetOrganizationInfo";
import useGetOrganizatioMembers from "../../../../API/hooks/useGetOrganizationMembers";
import AddOrganizationMemberSearchComp from "../../../search/AddOrganizationMembersSearchComponent";
import Menu, {MenuItem, MenuItemIcon, MenuItemLabel } from "../../../reusables/Menu/Menu";
import useDeleteModal from "../../../reusables/DeleteModal/useDeleteModal";
import doRequest from "../../../../API/doRequest";
import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";
import { IStyledFC } from "../../../IStyledFC";

interface IMember {
    name: string,
    avatar: string | null,
    age: number,
    memberUID: string,
    gender: string
}

const MenuBtn = styled(UseRipple)`
    display: flex;
    width: 23px;
    height: 23px;
    border: 1.5px solid ${({theme}) => theme.textColor.strong};
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    color: ${({theme}) => theme.textColor.strong};
    font-size: 13px;
    cursor: pointer;

    & #ripple {
        background-color: whitesmoke;
    }

`

const ContentWraper = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    height: fit-content;
    padding: 15px 0;
    align-items: center;
    justify-content: center;

    header {
        position: relative;
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

    header ${MenuBtn} {
        position: absolute;
        top: 20px;
        right: 20px;
    }

    header .data-total {
        position: absolute;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        text-align: right;
        font-size: 16px;
        line-height: 23px;
        color: ${({theme}) => theme.textColor.strong};
        font-weight: 100;

        h1 {
            font-size: 24px;
            font-weight: 600;
        }
    }

    .list-container {
        display: flex;
        flex: 0 1 100%;
        margin-top: 15px;

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
    const addSnackBar = useAddSnackBar();
    const navigate = useNavigate();
    const deleteModal = useDeleteModal();
    const {data:organizationMembers, isLoading: iseLoadingMembers, isError: isErrorLoadingMembers, isUpdating: isUpdatingMembersList} = useGetOrganizatioMembers(orgUID as string);
    const {data, isLoading, isError, isUpdating, error} = useGetOrganizationInfo(orgUID as string);
    const [addMemberState, setAddMemberState] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
                            <Avatar size="140px " src={data?.avatar} alt="A" />
                        </div>
                        <div className="group-info">
                            <h1>{data?.organizationName}</h1>
                            <p>{data?.description}</p>
                        </div>
                        <div className="data-total">
                            <h1>{organizationMembers?.length}</h1>
                            <p>{organizationMembers && organizationMembers.length > 1? "Members" : "Member"}</p>
                        </div>
                        <MenuBtn onClick={handleClick}><FontAwesomeIcon icon={["fas", "ellipsis-h"]} /></MenuBtn>
                        <Menu
                        placement="left"
                        anchorEl={anchorEl} 
                        open={open} 
                        onClose={handleClose}>
                            <MenuItem onClick={() => {
                                handleClose();
                                setTimeout(() => {
                                    setAddMemberState(true);
                                }, 400)
                            }}>
                                <MenuItemIcon>
                                    <FontAwesomeIcon icon={["fas", "plus"]} />
                                </MenuItemIcon>
                                <MenuItemLabel>Add Member</MenuItemLabel>
                            </MenuItem>
                            <MenuItem onClick={() => {
                                handleClose();
                                setTimeout(() => {
                                    deleteModal(
                                        data?.organizationName as string, 
                                        `Successfully deleted ${data?.organizationName}`,
                                        () => new Promise((res, rej) => {
                                            doRequest<null>({
                                                method: "delete",
                                                url: `/delete-organization/${data?.organizationUID}`
                                            })
                                            .then(response => {
                                                res({success: true});
                                                navigate("/app/information/organizations")
                                            })
                                            .catch(err => {
                                                addSnackBar("Deletion Faild!", "error", 5);
                                            })
                                    }))
                                }, 400)
                            }}>
                                <MenuItemIcon>
                                    <FontAwesomeIcon icon={["fas", "trash"]} />
                                </MenuItemIcon>
                                <MenuItemLabel>Delete this Ministry</MenuItemLabel>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <MenuItemIcon>
                                    <FontAwesomeIcon icon={["fas", "edit"]} />
                                </MenuItemIcon>
                                <MenuItemLabel>Edit Ministry Name</MenuItemLabel>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <MenuItemIcon>
                                    <FontAwesomeIcon icon={["fas", "edit"]} />
                                </MenuItemIcon>
                                <MenuItemLabel>Edit Ministry Description</MenuItemLabel>
                            </MenuItem>
                        </Menu>
                    </header>
                    <div className="list-container">
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
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className={className}>
            <Avatar alt={item.name} src={item.avatar} size="40px" />
            <div className="info">
                <h1>{item.name}</h1>
                {/* <span>
                    <strong>Gender: <p>{item.gender}</p></strong>
                    <Devider $orientation="vertical" $flexItem $variant="center" $css="margin: 0 10px; border-width: 2px"/>
                    <strong>Age: <p>{item.age}</p></strong>
                </span> */}
                <Button label="More" color="theme" variant="hidden-bg-btn" iconButton icon={<FontAwesomeIcon icon={["fas", "ellipsis-h"]} />} onClick={handleClick} />
                <Menu
                placement="left"
                anchorEl={anchorEl} 
                open={open} 
                onClose={handleClose}>
                    <MenuItem onClick={() => {
                        handleClose()
                    }}>
                        <MenuItemIcon>
                            <FontAwesomeIcon icon={["fas", "user"]} />
                        </MenuItemIcon>
                        <MenuItemLabel>View profile</MenuItemLabel>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <MenuItemIcon>
                            <FontAwesomeIcon icon={["fas", "user-minus"]} />
                        </MenuItemIcon>
                        <MenuItemLabel>Remove to Ministry</MenuItemLabel>
                    </MenuItem>
                </Menu>
            </div>
        </div>
    )
} 

const ListItem = styled(FCListItem)`
    display: flex;
    flex: 0 1 100%;
    height: 50px;
    padding: 10px;
    align-items: center;
    border-radius: 5px;
    background-color: ${({theme}) => theme.background.lighter};
    
    .info {
        display: flex;
        flex: 1;
        /* flex-wrap: wrap; */
        height: fit-content;
        margin-left: 15px;
        color:  ${({theme}) => theme.textColor.strong};

        h1 {
            flex: 0 1 100%;
            font-size: 15px;
            /* font-weight: 300; */
        }

        /* span {
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
        } */
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

export default ManageOrganizationView;