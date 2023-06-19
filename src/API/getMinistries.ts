import axios from 'axios';
import { API_BASE_URL } from './BASE_URL';
import { TResponseFlag } from "./TResponseFlag";

export interface IministryMember {
    ministryUID: string,
    avatar: string | null,
    description: string,
    ministryName: string
}

const getMinistries = () : Promise<TResponseFlag<IministryMember[]>> => {
    return new Promise<TResponseFlag<IministryMember[]>>((res, rej) => {
        axios.post(`${API_BASE_URL}/get-ministries`)
        .then(resonse => {
            const responseFlag = resonse.data as TResponseFlag<IministryMember[]>;
            responseFlag.success? res(responseFlag) : rej(responseFlag);
        })
        .catch(err => rej(err));
    })
}

export default getMinistries;