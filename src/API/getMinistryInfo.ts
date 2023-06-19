import axios from 'axios';
import { API_BASE_URL } from './BASE_URL';
import { TResponseFlag } from "./TResponseFlag";

export type TMinistryData = {
    ministryUID: string,
    ministryName: string,
    description: string,
    avatar: string | null
}

const getMinistryInfo = (ministryUID: string) : Promise<TResponseFlag<TMinistryData>> => {
    return new Promise<TResponseFlag<TMinistryData>>((res, rej) => {
        axios.post(`${API_BASE_URL}/get-ministry-info`, { data: ministryUID })
        .then(resonse => {
            const responseFlag = resonse.data as TResponseFlag<TMinistryData>;
            responseFlag.success? res(responseFlag) : rej(responseFlag);
        })
        .catch(err => rej(err));
    })
}

export default getMinistryInfo;