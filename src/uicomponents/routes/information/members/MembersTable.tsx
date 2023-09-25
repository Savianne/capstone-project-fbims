import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IStyledFC } from "../../../IStyledFC";
import Avatar from '../../../reusables/Avatar';
import AvatarGroup from '../../../reusables/AvatarGroup';
import Button from '../../../reusables/Buttons/Button';
import Devider from '../../../reusables/devider';
import SkeletonLoading from "../../../reusables/SkeletonLoading";
import DeleteModal from "../../../reusables/DeleteModal/DeleteModal";

import useDeleteModal from "../../../reusables/DeleteModal/useDeleteModal";
import { useNavigate } from "react-router-dom";

import deleteMembersRecord from "../../../../API/deleteMembersRecord";

import { DeleteModalContextProvider, TConfirmDeleteFunction } from "../../../reusables/DeleteModal/DeleteModalContext";
import { resolve } from "path";
import { AVATAR_BASE_URL } from "../../../../API/BASE_URL";

interface IMinisty {
    name: string,
    avatar: string,
    id: number,
}

interface IListEntry {
    first_name: string,
    middle_name: string,
    surname: string,
    avatar: string,
    member_uid: string,
    added_by: string,
    creation_time: string,
}

const SMembersTable = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 5px;
    color: ${({theme}) => theme.textColor.strong};
    font-size: 12px;
    & tr {
        height: 45px;
    }

    & tr th {
        vertical-align: bottom;
    }

    & tr th[cell-name=fullname] {
        font-size: 20px;
        font-weight: 600;
        text-align: left;
        color: ${({theme}) => theme.staticColor.primary}
    }

    & tr th[cell-name=avatar] {
        text-align: center;
    }

    & tr td,
    & .skeleton-row td {
        background-color: ${({theme}) => theme.background.light};
        text-align: center;  
        vertical-align: middle;
        padding: 0 10px;
    }

    & .skeleton-row td {
        background-color: transparent;
        padding: 0;
    }

    & .skeleton-row td[cell-name=avatar] {
        width: 95px;
    }

    & .skeleton-row td[cell-name=created-by] {
        width: 220px;
    }

    & .skeleton-row td[cell-name=creation-time] {
        width: 170px;
    }

    & .skeleton-row td[cell-name=action] {
        width: 120px;
    }

    & tr td[cell-name=fullname] {
        border-left: 4px solid ${({theme}) => theme.staticColor.primary};
        text-align: left;
        font-weight: 600;
        /* width: 180px; */
    }

    & .skeleton-row td[cell-name=fullname] {
        border-left: 0;
        padding-left: 4px;
    }

    & tr td[cell-name=avatar] {
        width: 75px;
    }

    & tr td[cell-name=created-by] {
        width: 200px;
    }

    & tr td[cell-name=creation-time] {
        width: 150px;
    }

    & tr td[cell-name=avatar] ${Avatar},  & tr td[cell-name=ministry] ${AvatarGroup} {
        margin-left: auto;
        margin-right: auto;
    }

    & tr td[cell-name=action] {
        width: 100px;

        ${Button} {
            margin-left: auto;
            margin-right: auto;
        }
    }

    & tr td[cell-name=action] .action-button-group-container {
        display: flex;
        /* flex: 0 1 100%; */
        width: fit-content;
        margin: 0 auto;
        gap: 8px;
        height: 25px;
        justify-content: center;
        align-items: center;
    }
    
    & tr td[cell-name=action] .action-button-group-container ${Button} {
        font-size: 11px;
        flex-shrink: 0;
        flex-grow: 0;
        height: 25px;
        width: 25px;
    }
 
    & tr td[cell-name=action] .action-button-group-container ${Devider} .devider {
        border-color: ${({theme}) => theme.mode == 'light'? '#adadad6b' : '#f7f6f642'};
        border-width: 1px;
    }
`

interface IMembersTable {
    membersList: IListEntry[];
    isLoading: boolean,
    expectedListLen: number,
}

const MembersTable: React.FC<IMembersTable> = ({membersList, isLoading, expectedListLen}) => {
    const navigate = useNavigate();
    const deleteModal = useDeleteModal();
    const [expectedListLenVal, setExpctedListLen] = React.useState<null | number[]>(null);

    React.useEffect(() => {
        const renderLen = []
        for(let n = 0; n < expectedListLen; n++) {
            renderLen.push(n);
        }
        setExpctedListLen(renderLen)
    }, [expectedListLen])

    return (
        <>
        <DeleteModal />
        <SMembersTable>
            <tr>
                <th cell-name="fullname">Member's Full Name</th>
                <th cell-name="avatar">Avatar</th>
                <th cell-name="created-by">Created By</th>
                <th cell-name="date-created">Date Created</th>
                <th cell-name="action">Action</th>
            </tr>
            {
                isLoading && expectedListLenVal? <>
                {
                    expectedListLenVal.map((item, id) => {
                        return <tr key={id} className="skeleton-row">
                        <td cell-name="fullname"><SkeletonLoading height="45px" /></td>
                        <td cell-name="avatar"><SkeletonLoading height="45px" /></td>
                        <td cell-name="created-by"><SkeletonLoading height="45px" /></td>
                        <td cell-name="creation-time"><SkeletonLoading height="45px" /></td>
                        <td cell-name="action">
                            <SkeletonLoading height="45px" />
                        </td>
                    </tr>
                    })
                }
                </> : <>
                {
                    membersList.length? <>
                        {
                            membersList.map((item, index) => {
                                return (
                                <tr key={item.member_uid}>
                                    <td cell-name="fullname">{item.first_name.toLocaleUpperCase()} {item.middle_name[0].toLocaleUpperCase()}. {item.surname.toLocaleUpperCase()}</td>
                                    <td cell-name="avatar"><Avatar size='30px' src={item.avatar} alt={item.first_name} /></td>
                                    <td cell-name="created-by">{item.added_by.toLocaleUpperCase()}</td>
                                    <td cell-name="creation-time">{new Date(item.creation_time).toDateString()}</td>
                                    <td cell-name="action">
                                        <div className="action-button-group-container">
                                            <Button label="Add Member" icon={<FontAwesomeIcon icon={["fas", "user-pen"]} />} variant="bordered-btn" color="edit" iconButton onClick={() => navigate(`/app/information/members/edit/${item.member_uid}`)} />
                                            {/* <Devider $orientation="vertical" $variant="center" /> */}
                                            {/* <Button label="Add Member" icon={<FontAwesomeIcon icon={["fas", "trash"]} />} variant="hidden-bg-btn" color="delete" iconButton 
                                            onClick={(e) => {
                                                deleteModal(`Records of ${item.first_name.toLocaleUpperCase()} ${item.middle_name[0].toLocaleUpperCase()}. ${item.surname.toLocaleUpperCase()}`, () => {
                                                    return new Promise<{success: boolean}>((res, rej) => {
                                                        deleteMembersRecord(item.member_uid)
                                                        .then(response => {
                                                            response.success? res(response) : rej(response);
                                                        })
                                                        .catch(err => rej({success: false}))
                                                    })
                                                })
                                            }} /> */}
                                            {/* <Devider $orientation="vertical" $variant="center" /> */}
                                            <Button label="Add Member" icon={<FontAwesomeIcon icon={["fas", "user"]} />} variant="bordered-btn" color="primary" iconButton onClick={() => navigate(`/app/information/members/view/${item.member_uid}`)} />
                                        </div>
                                        {/* <Button label="View profile" icon={<FontAwesomeIcon icon={["fas", "user"]} />} variant="hidden-bg-btn" color="primary" onClick={() => navigate(`/app/information/members/view/${item.member_uid}`)} /> */}
                                    </td>
                                </tr>
                                )
                            })
                        }
                    </> : "NO Data"
                }
                </>
            }
            

        </SMembersTable>
        </>
    )
}

export default MembersTable;