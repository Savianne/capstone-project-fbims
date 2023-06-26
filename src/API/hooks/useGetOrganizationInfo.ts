import React from "react";
import getOrganizationInfo, { TOrgData } from "../getOrganizationInfo";

function useGetOrganizationInfo(orgUId: string) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [isError, setIsError] = React.useState(false);
    const [error, setError] = React.useState<null | any>(null);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [data, setData] = React.useState<null | TOrgData>(null);

    React.useEffect(() => {
        if(orgUId) {
            getOrganizationInfo(orgUId)
            .then(response => {
                if(response.success) {
                    setIsLoading(false);
                    isError && setIsError(false);
                    setData(response.data as TOrgData);
                } else throw response;
            })
            .catch(error => {
                setIsLoading(false);
                setIsError(true);
                setError(error);
            });
        }
        
    }, [orgUId]);

    return {
        isLoading,
        isUpdating,
        isError,
        error,
        data
    }
}

export default useGetOrganizationInfo;