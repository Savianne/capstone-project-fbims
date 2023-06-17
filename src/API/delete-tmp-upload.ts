import axios from 'axios';
import { AVATAR_UPLOAD_BASE_URL } from './BASE_URL';
import { TResponseFlag } from "./TResponseFlag";

const deleteTmpUpload = (imageName: string) : Promise<TResponseFlag<null>> => {
    return new Promise<TResponseFlag<null>>((res, rej) => {
        axios.delete(`${AVATAR_UPLOAD_BASE_URL}/delete-temp-upload/${imageName}`)
        .then(resonse => {
            const responseFlag = resonse.data as TResponseFlag<null>;
            responseFlag.success? res(responseFlag) : rej(responseFlag);
        })
        .catch(err => rej(err));
    })
}

export default deleteTmpUpload;