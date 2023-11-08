import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";
import { useParams, useNavigate } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";
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
import useConfirmModal from "../../../reusables/ConfirmModal/useConfirmModal";
import ConfirmModal from "../../../reusables/ConfirmModal/ConfirmModal";
import Modal from "../../../reusables/Modal";
import EditOrganizationForm from "./editOrganizationInfoModal";
import UpdateOrgDP from "./updateOrganizationDP";
import { IStyledFC } from "../../../IStyledFC";
import Error404 from "../../../Error404";

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
    const {data:organizationMembers, isLoading: iseLoadingMembers, isError: isErrorLoadingMembers, isUpdating: isUpdatingMembersList, setData} = useGetOrganizatioMembers(orgUID as string);
    const {data, isLoading, isError, isUpdating, error} = useGetOrganizationInfo(orgUID as string);
    const [baseData, setBaseData] = React.useState<{
        organizationName: string,
        description: string,
        avatar: string | null
    } | null>(null);
    const [editOrganizationModal, updateEditOrganizationModal] = React.useState<"close" | "ondisplay" | "open" | "remove" | "inactive">("inactive");
    const [modalIsLoading, updateModalIsLoading] = React.useState(false);

    const [updateOrgDPModal, setUpdateOrgDPModal] = React.useState<"close" | "ondisplay" | "open" | "remove" | "inactive">("inactive");
    const [updateOrgDPmodalIsLoading, setUpdateOrgDPModalIsLoading] = React.useState(false);

    const [addMemberState, setAddMemberState] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    React.useEffect(() => {
        data && setBaseData({organizationName: data.organizationName, description: data.description, avatar: data.avatar});
    }, [data])

    return (
        isLoading? <SkeletonLoading height="500px" /> : <>
        {
            !isError && baseData?
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
                                <Avatar size="140px " src={baseData?.avatar} alt={baseData?.organizationName} />
                            </div>
                            <div className="group-info">
                                <h1>{baseData?.organizationName}</h1>
                                <p>{baseData?.description}</p>
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
                                    <MenuItemLabel>Delete this Organization</MenuItemLabel>
                                </MenuItem>
                                <MenuItem onClick={() => {
                                     handleClose();
                                     setTimeout(() => {
                                         updateEditOrganizationModal('ondisplay')
                                     }, 400)
                                }}>
                                    <MenuItemIcon>
                                        <FontAwesomeIcon icon={["fas", "edit"]} />
                                    </MenuItemIcon>
                                    <MenuItemLabel>Edit Organization Info</MenuItemLabel>
                                </MenuItem>
                                <MenuItem onClick={() => {
                                    handleClose();
                                    setTimeout(() => {
                                        setUpdateOrgDPModal('ondisplay')
                                    }, 400)
                                }}>
                                    <MenuItemIcon>
                                        <FontAwesomeIcon icon={["fas", "edit"]} />
                                    </MenuItemIcon>
                                    <MenuItemLabel>Update display picture</MenuItemLabel>
                                </MenuItem>
                            </Menu>
                            { 
                                data && baseData && (editOrganizationModal == "open" || editOrganizationModal == "ondisplay" || editOrganizationModal == "close") && 
                                <Modal isLoading={modalIsLoading} state={editOrganizationModal} title="Edit Ministry" onClose={() => updateEditOrganizationModal("remove")} maxWidth="550px"> 
                                    <EditOrganizationForm update={(data) => setBaseData({...baseData, organizationName: data.organizationName, description: data.description})} data={{...baseData, organizationUID: data.organizationUID}} onLoading={(isLoading) => updateModalIsLoading(isLoading)} />
                                </Modal>
                            }
                            {
                                data && baseData && (updateOrgDPModal == "open" || updateOrgDPModal == "ondisplay" || updateOrgDPModal == "close") &&
                                <Modal isLoading={updateOrgDPmodalIsLoading} state={updateOrgDPModal} title="Update Display Picture" onClose={() => setUpdateOrgDPModal('remove')} maxWidth="550px">
                                    <UpdateOrgDP update={(data) => setBaseData({...baseData, avatar: data})} data={{organizationName: baseData.organizationName, organizationUID: data?.organizationUID, picture: baseData.avatar}} onLoading={(isLoading) => setUpdateOrgDPModalIsLoading(isLoading)}/>
                                </Modal>
                            }
                        </header>
                        <div className="list-container">
                            {
                                organizationMembers && data?.organizationUID && 
                                <MembersList 
                                remove={(memberUID) => {
                                    setData(organizationMembers.filter(item => item.memberUID !== memberUID))
                                }} 
                                organizationUID={data.organizationUID}
                                list={[...organizationMembers.map(item => ({...item, age: (new Date().getFullYear() - new Date(item.dateOfBirth).getFullYear()), name: `${item.firstName} ${item.middleName[0]}. ${item.surname} ${item.extName? item.extName : ""}`.toUpperCase()}))] as IMember[]} />
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
            : <Error404 />
        }
        </>
    )
}


interface IFCMembersTable extends IStyledFC {
    list: IMember[] | null,
    organizationUID: string,
    remove: (memberUID: string) => void
} 


const FCMembersList: React.FC<IFCMembersTable> = ({className, list, organizationUID, remove}) => {

    return (
        <div className={className}>
            {
                list && list.map(item => {
                    return <ListItem key={item.memberUID} remove={(memberUID) => remove(memberUID)} item={item} organizationUID={organizationUID} />
                })
            }
        </div>
    )
}

interface IFCList extends IStyledFC {
    item: IMember,
    organizationUID: string,
    remove: (organizationUID: string) => void
}

const FCListItem: React.FC<IFCList> = ({className, item, organizationUID, remove}) => {
    const addSnackBar = useAddSnackBar();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const {modal, confirm} = useConfirmModal();
    const [itemOnRemove, setItemOnRemove] = React.useState(false);
    const itemComponentRef = React.useRef<null | HTMLDivElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    React.useEffect(() => {
        if(itemOnRemove) {
            itemComponentRef.current?.setAttribute('ondelete', 'true');
            doRequest({
                method: 'delete',
                url: "/remove-organization-member",
                data: {
                    organizationUID: organizationUID,
                    memberUID: item.memberUID
                }
            })
            .then(response => {
                remove(item.memberUID);
                addSnackBar("Successfully removed a member from the organization", "default", 5);
            })
            .catch(err => {
                addSnackBar("Faild to removed a member from the organization", "error", 5);
            })
        } else {
            itemComponentRef.current?.removeAttribute('ondelete');
        }
    }, [itemOnRemove])   
    return (
        <div className={className} ref={itemComponentRef}>
            <ConfirmModal context={modal} variant={"warning"} />
            <Avatar alt={item.name} src={item.avatar} size="40px" />
            <div className="info">
                <h1>{item.name}</h1>
                {
                    itemOnRemove? <ScaleLoader color="#36d7b7" height={"20px"}/> : 
                    <Button label="More" color="theme" variant="hidden-bg-btn" iconButton icon={<FontAwesomeIcon icon={["fas", "ellipsis-h"]} />} onClick={handleClick} />
                }
                <Menu
                placement="left"
                anchorEl={anchorEl} 
                open={open} 
                onClose={handleClose}>
                    <MenuItem onClick={() => {
                    handleClose();
                    navigate(`/app/information/members/view/${item.memberUID}`)
                }}>
                    <MenuItemIcon>
                        <FontAwesomeIcon icon={["fas", "user"]} />
                    </MenuItemIcon>
                    <MenuItemLabel>View profile</MenuItemLabel>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleClose();
                    setTimeout(() => {
                        confirm("Remove Member", `Are you sure you want to remove ${item.name} to this Organization?`, () => {
                            setItemOnRemove(true);
                        })
                    }, 300)
                }}>
                    <MenuItemIcon>
                        <FontAwesomeIcon icon={["fas", "user-minus"]} />
                    </MenuItemIcon>
                    <MenuItemLabel>Remove to Organization</MenuItemLabel>
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
    
    &[ondelete='true'] {
        opacity: 0.3;
    }

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