import React from "react";
import io  from "socket.io-client";
import getOrganizations from "../getOrganizations";
import { IOrganizationMember } from "../getOrganizations";
import { SOCKETIO_URL } from "../BASE_URL";
import { useAppSelector } from "../../global-state/hooks";

function useGetOrganizations() {
    const admin = useAppSelector(state => state.setAdmin.admin);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isError, setIsError] = React.useState(false);
    const [error, setError] = React.useState<null | any>(null);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [data, setData] = React.useState<null | IOrganizationMember[]>(null);

    React.useEffect(() => {
        getOrganizations()
        .then(response => {
            if(response.success) {
                setIsLoading(false);
                isError && setIsError(false);
                setData(response.data as IOrganizationMember[]);
            } else throw response;
        })
        .catch(error => {
            setIsLoading(false);
            setIsError(true);
            setError(error);
        });
        
        const socket = io(SOCKETIO_URL);

        socket.on(`${admin?.congregation}-ADDED_NEW_ORGANIZATION`, () => {
            setIsUpdating(true);
            getOrganizations()
            .then(response => {
                if(response.success) {
                    setIsUpdating(false);
                    isError && setIsError(false);
                    setData(response.data as IOrganizationMember[]);
                } else throw response;
            })
            .catch(error => {
                setIsUpdating(false);
                setIsError(true);
                setError(error);
            });
        });

        socket.on(`${admin?.congregation}-DELETED_ORGANIZATION`, () => {
            setIsUpdating(true);
            getOrganizations()
            .then(response => {
                if(response.success) {
                    setIsUpdating(false);
                    isError && setIsError(false);
                    setData(response.data as IOrganizationMember[]);
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

export default useGetOrganizations;