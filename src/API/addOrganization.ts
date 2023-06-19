import axios from 'axios';
import { API_BASE_URL } from './BASE_URL';
import { TResponseFlag } from "./TResponseFlag";

type TOrgData = {
    name: string,
    description: string,
    avatar: string | null
}

const addOrganization = (orgData: TOrgData) : Promise<TResponseFlag<null>> => {
    return new Promise<TResponseFlag<null>>((res, rej) => {
        axios.post(`${API_BASE_URL}/add-organization`, { data: orgData })
        .then(resonse => {
            const responseFlag = resonse.data as TResponseFlag<null>;
            responseFlag.success? res(responseFlag) : rej(responseFlag);
        })
        .catch(err => rej(err));
    })
}

export default addOrganization;