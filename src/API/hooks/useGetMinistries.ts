import React from "react";
import io  from "socket.io-client";
import getMinistries from "../getMinistries";
import { IministryMember } from "../getMinistries";
import { SOCKETIO_URL } from "../BASE_URL";

function useGetMinistries() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [isError, setIsError] = React.useState(false);
    const [error, setError] = React.useState<null | any>(null);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [data, setData] = React.useState<null | IministryMember[]>(null);

    React.useEffect(() => {
        getMinistries()
        .then(response => {
            if(response.success) {
                setIsLoading(false);
                isError && setIsError(false);
                setData(response.data as IministryMember[]);
            } else throw response;
        })
        .catch(error => {
            setIsLoading(false);
            setIsError(true);
            setError(error);
        });
        
        const socket = io(SOCKETIO_URL);

        socket.on('ADDED_NEW_MINISTRY', () => {
            setIsUpdating(true);
            getMinistries()
            .then(response => {
                if(response.success) {
                    setIsUpdating(false);
                    isError && setIsError(false);
                    setData(response.data as IministryMember[]);
                } else throw response;
            })
            .catch(error => {
                setIsUpdating(false);
                setIsError(true);
                setError(error);
            });
        });

        socket.on('DELETED_MINISTRY', () => {
            setIsUpdating(true);
            getMinistries()
            .then(response => {
                if(response.success) {
                    setIsUpdating(false);
                    isError && setIsError(false);
                    setData(response.data as IministryMember[]);
                } else throw response;
            })
            .catch(error => {
                setIsUpdating(false);
                setIsError(true);
                setError(error);
            });
        });

        return function () {
            socket.disconnect();
        }

    }, []);

    return {
        isLoading,
        isUpdating,
        isError,
        error,
        data
    }
}

export default useGetMinistries;