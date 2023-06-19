import React from "react";
import getMinistryInfo, { TMinistryData } from "../getMinistryInfo";

function useGetMinistryInfo(minstryUId: string) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [isError, setIsError] = React.useState(false);
    const [error, setError] = React.useState<null | any>(null);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [data, setData] = React.useState<null | TMinistryData>(null);

    React.useEffect(() => {
        if(minstryUId) {
            getMinistryInfo(minstryUId)
            .then(response => {
                if(response.success) {
                    setIsLoading(false);
                    isError && setIsError(false);
                    setData(response.data as TMinistryData);
                } else throw response;
            })
            .catch(error => {
                setIsLoading(false);
                setIsError(true);
                setError(error);
            });
        }
        
    }, [minstryUId]);

    return {
        isLoading,
        isUpdating,
        isError,
        error,
        data
    }
}

export default useGetMinistryInfo;