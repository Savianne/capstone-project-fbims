import React from "react";
import styled from "styled-components";

import Avatar from '../../../reusables/Avatar';
import AvatarGroup from '../../../reusables/AvatarGroup';

interface IMinisty {
    name: string,
    avatar: string,
    id: number,
}

interface IListEntry {
    fullName: string,
    avatar: string,
    id: string,
    ministry: IMinisty[],
    organization: IMinisty[],
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

    & tr td {
        background-color: ${({theme}) => theme.background.light};
        text-align: center;  
        vertical-align: middle;
        padding: 0 10px;
    }

    & tr td[cell-name=fullname] {
        border-left: 4px solid ${({theme}) => theme.staticColor.primary};
        text-align: left;
        width: 180px;
    }

    & tr td[cell-name=avatar] {
        width: 75px;
    }

    & tr td[cell-name=avatar] ${Avatar},  & tr td[cell-name=ministry] ${AvatarGroup} {
        margin-left: auto;
        margin-right: auto;
    }

    & tr td[cell-name=action] {
        width: 150px;
    }
`

interface IMembersTable {
    membersList: IListEntry[]
}

const MembersTable: React.FC<IMembersTable> = ({membersList}) => {

    return (
        <SMembersTable>
            <tr>
                <th cell-name="fullname">Member's Full Name</th>
                <th cell-name="avatar">Avatar</th>
                <th cell-name="ministry">Ministry</th>
                <th cell-name="organization">Organization</th>
                <th>Actions</th>
            </tr>
            <tr>
                <td cell-name="fullname">Apple Jane De Guzman</td>
                <td cell-name="avatar"><Avatar size='30px' src="/assets/images/avatar/apple.png" alt="apple" /></td>
                <td cell-name="ministry">list</td>
                <td cell-name="organization">list</td>
                <td cell-name="action">edir, delete, view</td>
            </tr>
            <tr>
                <td cell-name="fullname">Apple Jane De Guzman</td>
                <td cell-name="avatar"><Avatar size='30px' src="/assets/images/avatar/apple.png" alt="apple" /></td>
                <td cell-name="ministry"><AvatarGroup size='20px' avatars={[
                    {alt: 'radio'},
                    {alt: 'radio'},
                    {alt: 'radio'},
                    {alt: 'radio'},
                    {alt: 'radio'},
                ]}/></td>
                <td cell-name="organization">list</td>
                <td cell-name="action">edir, delete, view</td>
            </tr>
            <tr>
                <td cell-name="fullname">Apple Jane De Guzman</td>
                <td cell-name="avatar"><Avatar size='30px' src="/assets/images/avatar/apple.png" alt="apple" /></td>
                <td cell-name="ministry"><AvatarGroup size='20px' avatars={[
                    {alt: 'radio'},
                    {alt: 'radio'},
                ]}/></td>
                <td cell-name="organization">list</td>
                <td cell-name="action">edir, delete, view</td>
            </tr>
            <tr>
                <td cell-name="fullname">Apple Jane De Guzman</td>
                <td cell-name="avatar"><Avatar size='30px' alt="apple" /></td>
                <td cell-name="ministry"><AvatarGroup size='20px' avatars={[
                    {alt: 'radio'},
                    {alt: 'radio'},
                    {alt: 'radio'},
                    {alt: 'radio'},
                ]}/></td>
                <td cell-name="organization">list</td>
                <td cell-name="action">edir, delete, view</td>
            </tr>
            <tr>
                <td cell-name="fullname">Apple Jane De Guzman</td>
                <td cell-name="avatar"><Avatar size='30px' src="/assets/images/avatar/apple.png" alt="apple" /></td>
                <td cell-name="ministry"><AvatarGroup size='20px' avatars={[
                    {alt: 'radio', },
                    {alt: 'radio', },
                    {alt: 'radio', },
                    {alt: 'radio', },
                    {alt: 'radio', },
                    {alt: 'radio'},
                    {alt: 'radio', }
                ]} limit={5} /></td>
                <td cell-name="organization">list</td>
                <td cell-name="action">edir, delete, view</td>
            </tr>
            <tr>
                <td cell-name="fullname">Apple Jane De Guzman</td>
                <td cell-name="avatar"><Avatar size='30px' src="/assets/images/avatar/apple.png" alt="apple" /></td>
                <td cell-name="ministry">No Ministry</td>
                <td cell-name="organization">list</td>
                <td cell-name="action">edir, delete, view</td>
            </tr>

        </SMembersTable>
    )
}

export default MembersTable;