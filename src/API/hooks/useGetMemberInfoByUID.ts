import React from "react";
import getOrganizationInfo, { TOrgData } from "../getOrganizationInfo";
import doRequest from "../doRequest";

type TMemberRecord = {
    member_uid: string,
    gender: string,
    date_of_birth: string,
    marital_status: string,
    first_name: string,
    middle_name: string,
    surname: string,
    ext_name: null | string,
    personalCPNumber: null | string,
    personalEmail: null | string,
    personalTelNumber: null | string,
    homeCPNUmber: null | string,
    homeEmail:null | string,
    homeTelNumber: null | string,
    localCurrentAddressRegion:null | string,
    localCurrentAddressProvince: null | string,
    localCurrentAddressMunCity: null | string,
    localCurrentAddressBarangay:null | string,
    localPermanentAddressRegion: null | string,
    localPermanentAddressProvince:null|string,
    localPermanentAddressMunCity:null | string,
    localPermanentAddressBarangay:null | string,
    outsidePHCurrentAddress: null | string,
    outsidePHpermanentAddress: null | string,
    date_of_baptism: null | string,
    avatar:null | string
}

function useGetMemberInfoByUID() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [isError, setIsError] = React.useState(false);
    const [error, setError] = React.useState<null | any>(null);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [data, setData] = React.useState<null | TMemberRecord>(null);

    return {
        getMemberRecord: (uid: string) => {
            if(uid) {
                doRequest<TMemberRecord>({
                    method: "GET",
                    url: `/get-members-record/${uid}`
                })
                .then(response => {
                    if(response.success) {
                        setIsLoading(false);
                        isError && setIsError(false);
                        setData(response.data as TMemberRecord);
                    } else throw response;
                })
                .catch(error => {
                    setIsLoading(false);
                    setIsError(true);
                    setError(error);
                });
            }
        },
        isLoading,
        isUpdating,
        isError,
        error,
        data
    }
}

export default useGetMemberInfoByUID;