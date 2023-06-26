import React from "react";
import io  from "socket.io-client";
import getOrganizationMembers from "../getOrganizationMembers";
import { TOrganizationMembersData } from "../getOrganizationMembers";

function useGetOrganizatioMembers(orgUID: string) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [isError, setIsError] = React.useState(false);
    const [error, setError] = React.useState<null | any>(null);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [data, setData] = React.useState<null | TOrganizationMembersData[]>(null);

    React.useEffect(() => {
        getOrganizationMembers(orgUID)
        .then(response => {
            if(response.success) {
                setIsLoading(false);
                isError && setIsError(false);
                setData(response.data as TOrganizationMembersData[]);
            } else throw response;
        })
        .catch(error => {
            setIsLoading(false);
            setIsError(true);
            setError(error);
        });
        
        const socket = io('http://localhost:3008');

        socket.on(`ADDED_NEW_ORGANIZATION_MEMBER_TO${orgUID}`, () => {
            setIsUpdating(true);
            getOrganizationMembers(orgUID)
            .then(response => {
                if(response.success) {
                    setIsUpdating(false);
                    isError && setIsError(false);
                    setData(response.data as TOrganizationMembersData[]);
                } else throw response;
            })
            .catch(error => {
                setIsUpdating(false);
                setIsError(true);
                setError(error);
            });
        });

        socket.on(`DELETED_ORGANIZATION_MEMBER_FROM_${orgUID}`, () => {
            setIsUpdating(true);
            getOrganizationMembers(orgUID)
            .then(response => {
                if(response.success) {
                    setIsUpdating(false);
                    isError && setIsError(false);
                    setData(response.data as TOrganizationMembersData[]);
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

export default useGetOrganizatioMembers;