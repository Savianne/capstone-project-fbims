import axios from 'axios';
import { API_BASE_URL } from './BASE_URL';
import { TResponseFlag } from "./TResponseFlag";

export type TOrgData = {
    organizationUID: string,
    organizationName: string,
    description: string,
    avatar: string | null
}

const getOrganizationInfo = (orgUID: string) : Promise<TResponseFlag<TOrgData>> => {
    return new Promise<TResponseFlag<TOrgData>>((res, rej) => {
        axios.post(`${API_BASE_URL}/get-organization-info`, { data: orgUID })
        .then(resonse => {
            const responseFlag = resonse.data as TResponseFlag<TOrgData>;
            responseFlag.success? res(responseFlag) : rej(responseFlag);
        })
        .catch(err => rej(err));
    })
}

export default getOrganizationInfo;