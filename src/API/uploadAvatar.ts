import axios, { AxiosResponse } from 'axios';
import { AVATAR_UPLOAD_BASE_URL } from './BASE_URL';
import { TResponseFlag } from "./TResponseFlag";

const uploadAvatar = (formData: FormData, onProgress: (progress: number) => void) : Promise<TResponseFlag<{filename: string}>> => {
    return new Promise<TResponseFlag<{filename: string}>>(async (res, rej) => {
        try {
            const response: AxiosResponse = await axios.post(`${AVATAR_UPLOAD_BASE_URL}/add-to-temp`, formData, {
              onUploadProgress: (progressEvent) => {
                const progress = progressEvent.total && Math.round((progressEvent.loaded / progressEvent.total) * 100);
                progress && onProgress(progress);
              },
            });

            (response.data.success)? res({success: true, data: response.data.data}) : rej({success: false, error: "Faild to Upload image!"})
          } catch (error) {
            rej({success: false, error: "Faild to Upload image!"})
          }
    })
}

export default uploadAvatar;