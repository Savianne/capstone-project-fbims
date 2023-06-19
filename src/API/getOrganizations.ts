import axios from 'axios';
import { API_BASE_URL } from './BASE_URL';
import { TResponseFlag } from "./TResponseFlag";

export interface IOrganizationMember {
    organizationUID: string,
    avatar: string | null,
    description: string,
    organizationName: string
}

const getOrganizations = () : Promise<TResponseFlag<IOrganizationMember[]>> => {
    return new Promise<TResponseFlag<IOrganizationMember[]>>((res, rej) => {
        axios.post(`${API_BASE_URL}/get-organizations`)
        .then(resonse => {
            const responseFlag = resonse.data as TResponseFlag<IOrganizationMember[]>;
            responseFlag.success? res(responseFlag) : rej(responseFlag);
        })
        .catch(err => rej(err));
    })
}

export default getOrganizations;