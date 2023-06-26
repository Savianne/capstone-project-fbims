import axios from 'axios';
import { API_BASE_URL } from './BASE_URL';
import { TResponseFlag } from "./TResponseFlag";

export type TMinistryMembersData = {
    memberUID: string,
    firstName: string,
    middleName: string,
    surname: string,
    extName: string | null,
    avatar: string | null,
    gender: string,
    dateOfBirth: string
}

const getMinistryMembers = (ministryUID: string) : Promise<TResponseFlag<TMinistryMembersData[]>> => {
    return new Promise<TResponseFlag<TMinistryMembersData[]>>((res, rej) => {
        axios.post(`${API_BASE_URL}/get-ministry-members`, {data: {ministryUID: ministryUID}})
        .then(resonse => {
            const responseFlag = resonse.data as TResponseFlag<TMinistryMembersData[]>;
            responseFlag.success? res(responseFlag) : rej(responseFlag);
        })
        .catch(err => rej(err));
    })
}

export default getMinistryMembers;