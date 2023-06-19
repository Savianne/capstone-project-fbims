import axios from 'axios';
import { API_BASE_URL } from './BASE_URL';
import { TResponseFlag } from "./TResponseFlag";

export type TOrganizationMembersData = {
    memberUID: string,
    firstName: string,
    middleName: string,
    surname: string,
    extName: string | null,
    avatar: string | null
}

const getOrganizationMembers = (organizationUID: string) : Promise<TResponseFlag<TOrganizationMembersData[]>> => {
    return new Promise<TResponseFlag<TOrganizationMembersData[]>>((res, rej) => {
        axios.post(`${API_BASE_URL}/get-organization-member`, {data: {organizationUID: organizationUID}})
        .then(resonse => {
            const responseFlag = resonse.data as TResponseFlag<TOrganizationMembersData[]>;
            responseFlag.success? res(responseFlag) : rej(responseFlag);
        })
        .catch(err => rej(err));
    })
}

export default getOrganizationMembers;