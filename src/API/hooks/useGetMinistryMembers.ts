import React from "react";
import io  from "socket.io-client";
import getMinistryMembers from "../getMinistryMembers";
import { TMinistryMembersData } from "../getMinistryMembers";

function useGetMinistryMembers(ministryUID: string) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [isError, setIsError] = React.useState(false);
    const [error, setError] = React.useState<null | any>(null);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [data, setData] = React.useState<null | TMinistryMembersData[]>(null);

    React.useEffect(() => {
        getMinistryMembers(ministryUID)
        .then(response => {
            if(response.success) {
                setIsLoading(false);
                isError && setIsError(false);
                setData(response.data as TMinistryMembersData[]);
            } else throw response;
        })
        .catch(error => {
            setIsLoading(false);
            setIsError(true);
            setError(error);
        });
        
        const socket = io('http://localhost:3008');

        socket.on(`ADDED_NEW_MINISTRY_MEMBER_TO${ministryUID}`, () => {
            setIsUpdating(true);
            getMinistryMembers(ministryUID)
            .then(response => {
                if(response.success) {
                    setIsUpdating(false);
                    isError && setIsError(false);
                    setData(response.data as TMinistryMembersData[]);
                } else throw response;
            })
            .catch(error => {
                setIsUpdating(false);
                setIsError(true);
                setError(error);
            });
        });

        socket.on(`DELETED_MINISTRY_MEMBER_FROM_${ministryUID}`, () => {
            setIsUpdating(true);
            getMinistryMembers(ministryUID)
            .then(response => {
                if(response.success) {
                    setIsUpdating(false);
                    isError && setIsError(false);
                    setData(response.data as TMinistryMembersData[]);
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

export default useGetMinistryMembers;