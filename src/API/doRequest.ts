import axios, { AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './BASE_URL';
import { TResponseFlag } from "./TResponseFlag";

interface IServerResponseFlag {
    success: boolean;
    error?: any;
    data?: any;
}

const doRequest = <T>(config: AxiosRequestConfig) : Promise<TResponseFlag<T>> => {
    return new Promise<TResponseFlag<T>>((res, rej) => {
        axios({
            ...config,
            baseURL: API_BASE_URL,
        })
        .then(response => {
            const serverResponseFla = response.data as IServerResponseFlag;
            if(serverResponseFla.success) {
                res(serverResponseFla) 
            } else throw serverResponseFla.error;
        })
        .catch(error => {
            rej(error)
        })
    })
}

export default doRequest;