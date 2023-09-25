import { Link, useNavigate, useParams } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import ScaleLoader from "react-spinners/ScaleLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";
import Devider from "../../../reusables/devider";
import SiteMap from "../../SiteMap";
import GoBackBtn from "../../../GoBackBtn";
import Button from "../../../reusables/Buttons/Button";
import Avatar from "../../../reusables/Avatar";
import { AVATAR_BASE_URL } from "../../../../API/BASE_URL";
import Input from "../../../reusables/Inputs/Input";
import AddMinistryMemberSearchComp from "../../../search/AddMinistryMemberSearchComponent";
import SkeletonLoading from "../../../reusables/SkeletonLoading";
import UseRipple from "../../../reusables/Ripple/UseRipple";
import { IStyledFC } from "../../../IStyledFC";
import doRequest from "../../../../API/doRequest";
import ConfirmModal from "../../../reusables/ConfirmModal/ConfirmModal";
import Menu, { MenuItem, MenuItemIcon, MenuItemLabel } from "../../../reusables/Menu/Menu";
import useConfirmModal from "../../../reusables/ConfirmModal/useConfirmModal";
import useGetMinistryInfo from "../../../../API/hooks/useGetMinistryInfo";
import useGetMinistryMembers from "../../../../API/hooks/useGetMinistryMembers";
import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";
import useDeleteModal from "../../../reusables/DeleteModal/useDeleteModal";
import Alert, { AlertTitle } from "../../../reusables/Alert";

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

const ManageMinistryView: React.FC = () => {
    const addSnackBar = useAddSnackBar();
    const navigate = useNavigate();
    const { ministryUID } = useParams();
    const deleteModal = useDeleteModal();
    const {data:ministryMembers, isLoading: iseLoadingMembers, isError: isErrorLoadingMembers, isUpdating: isUpdatingMembersList, setData} = useGetMinistryMembers(ministryUID as string);
    const {data, isLoading, isError, isUpdating, error} = useGetMinistryInfo(ministryUID as string);

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
        !isError?
        <RouteContentBase>
            {
                addMemberState && <AddMinistryMemberSearchComp close={() => setAddMemberState(!addMemberState)} ministryUID={ministryUID as string} />
            }
            <RouteContentBaseHeader>
                <strong>Manage {data?.ministryName} </strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    / <Link to='/app/information'> information</Link>  / <Link to='/app/information/ministry'> ministry</Link> / <Link to='./'>{ministryUID}</Link>
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
                            <h1>{data?.ministryName}</h1>
                            <p>{data?.description}</p>
                        </div>
                        <div className="data-total">
                            <h1>{ministryMembers?.length}</h1>
                            <p>{ministryMembers && ministryMembers.length > 1? "Members" : "Member"}</p>
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
                                        data?.ministryName as string, 
                                        `Successfully deleted ${data?.ministryName}`,
                                        () => new Promise((res, rej) => {
                                            doRequest<null>({
                                                method: "delete",
                                                url: `/delete-ministry/${data?.ministryUID}`
                                            })
                                            .then(response => {
                                                res({success: true});
                                                navigate("/app/information/ministry")
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
                            ministryMembers && data?.ministryUID && 
                            <MembersList 
                            remove={(memberUID) => {
                                setData(ministryMembers.filter(item => item.memberUID !== memberUID))
                            }} 
                            ministryUID={data.ministryUID} 
                            list={[...ministryMembers.map(item => ({...item, age: (new Date().getFullYear() - new Date(item.dateOfBirth).getFullYear()), name: `${item.firstName} ${item.middleName[0]}. ${item.surname} ${item.extName? item.extName : ""}`.toUpperCase()}))] as IMember[]} />
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
        : <h1>{error}</h1>
    )
}


interface IFCMembersTable extends IStyledFC {
    list: IMember[] | null,
    ministryUID: string,
    remove: (memberUID: string) => void
} 


const FCMembersList: React.FC<IFCMembersTable> = ({className, list, ministryUID, remove}) => {

    return (
        <div className={className}>
            <Alert severity="warning" variant="default" action={<Button onClick={() => alert('hey')} label="View" variant="standard" color="primary" />}>
                <AlertTitle>Warning</AlertTitle>
                The Quick Brown fox jump over the head of the lazy dog!
            </Alert>
            <Alert>
                <AlertTitle>Error</AlertTitle>
                The Quick Brown fox jump over the head of the lazy dog!
            </Alert>
            <Alert severity="info" variant="default" onClose={() => alert('close')}>
                <AlertTitle>Error</AlertTitle>
                The Quick Brown fox jump over the head of the lazy dog!
            </Alert>
            <Alert severity="success" variant="default" onClose={() => alert('close')}>
                The Quick Brown fox jump over the head of the lazy dog!
            </Alert>
            {
                list && list.map(item => {
                    return <ListItem key={item.memberUID} remove={(memberUID) => remove(memberUID)} item={item} ministryUID={ministryUID} />
                })
            }
        </div>
    )
}

interface IFCList extends IStyledFC {
    item: IMember,
    ministryUID: string,
    remove: (memberUID: string) => void
}

const FCListItem: React.FC<IFCList> = ({className, item, ministryUID, remove}) => {
    const addSnackBar = useAddSnackBar();
    const navigate = useNavigate();
    const {modal, confirm} = useConfirmModal();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
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
                url: "/remove-ministry-member",
                data: {
                    ministryUID: ministryUID,
                    memberUID: item.memberUID
                }
            })
            .then(response => {
                remove(item.memberUID);
                addSnackBar("Successfully removed a member from ministry", "default", 5);
            })
            .catch(err => {
                addSnackBar("Faild to removed a member from the ministry", "error", 5);
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
            </div>
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
                        confirm("Remove Member", `Are you sure you want to remove ${item.name} to this Ministry?`, () => {
                            setItemOnRemove(true);
                        })
                    }, 300)
                }}>
                    <MenuItemIcon>
                        <FontAwesomeIcon icon={["fas", "user-minus"]} />
                    </MenuItemIcon>
                    <MenuItemLabel>Remove to Ministry</MenuItemLabel>
                </MenuItem>
            </Menu>
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
            /* font-weight: bold; */
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
                font-size: 13px;

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


export default ManageMinistryView;