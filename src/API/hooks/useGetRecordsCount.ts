import React from "react";
import { io } from "socket.io-client";
import doRequest from "../doRequest";

function useGetRecordsCount() {
    const [membersCount, setMembersCount] = React.useState(0);
    const [ministryCount, setMinistryCount] = React.useState(0);
    const [orgCount, setOrgCount] = React.useState(0);

    const [isLoadingMembersCount, setIsLoadingMembersCount] = React.useState(false);
    const [iseLoadingMinistryCount, setIsLoadingMinistryCount] = React.useState(false);
    const [isLoadingOrgCount, setIsLoadingOrgCount] = React.useState(false);

    const [isErrorMembersCount, setIsErrorMembersCount] = React.useState(false);
    const [isErrorMinistryCount, setIsErrorMinistryCount] = React.useState(false);
    const [isErrorOrgCount, setIsErrorOrgCount] = React.useState(false);

    React.useEffect(() => {
        setIsLoadingMembersCount(true);
        doRequest<{total_count: number}>({
            url: `/get-records-count/members`,
            method: "POST"
        })
        .then(response => {
            if(response.success) {
                setMembersCount(response.data?.total_count as number);
                setIsLoadingMembersCount(false);
                if(isErrorMembersCount) setIsErrorMembersCount(false);
            } else throw response
        })
        .catch(err => {
            setIsLoadingMembersCount(false);
            setIsErrorMembersCount(true);
        });

        setIsLoadingMinistryCount(true);
        doRequest<{total_count: number}>({
            url: `/get-records-count/ministry`,
            method: "POST"
        })
        .then(response => {
            if(response.success) {
                setMinistryCount(response.data?.total_count as number);
                setIsLoadingMinistryCount(false);
                if(isErrorMinistryCount) setIsErrorMinistryCount(false);
            } else throw response
        })
        .catch(err => {
            setIsLoadingMinistryCount(false);
            setIsErrorMinistryCount(true);
        });

        setIsLoadingOrgCount(true);
        doRequest<{total_count: number}>({
            url: `/get-records-count/organizations`,
            method: "POST"
        })
        .then(response => {
            if(response.success) {
                setOrgCount(response.data?.total_count as number);
                setIsLoadingOrgCount(false);
                if(isErrorOrgCount) setIsErrorOrgCount(false);
            } else throw response
        })
        .catch(err => {
            setIsLoadingOrgCount(false);
            setIsErrorOrgCount(true);
        });

        const socket = io('http://localhost:3008');

        socket.on('NEW_MEMBERS_RECORD_ADDED', () => {
            setIsLoadingMembersCount(true);
            doRequest<{total_count: number}>({
                url: `/get-records-count/members`,
                method: "POST"
            })
            .then(response => {
                if(response.success) {
                    setMembersCount(response.data?.total_count as number);
                    setIsLoadingMembersCount(false);
                    if(isErrorMembersCount) setIsErrorMembersCount(false);
                } else throw response
            })
            .catch(err => {
                setIsLoadingMembersCount(false);
                setIsErrorMembersCount(true);
            });
        });

        socket.on('DELETED_MEMBER_RECORD', () => {
            setIsLoadingMembersCount(true);
            doRequest<{total_count: number}>({
                url: `/get-records-count/members`,
                method: "POST"
            })
            .then(response => {
                if(response.success) {
                    setMembersCount(response.data?.total_count as number);
                    setIsLoadingMembersCount(false);
                    if(isErrorMembersCount) setIsErrorMembersCount(false);
                } else throw response
            })
            .catch(err => {
                setIsLoadingMembersCount(false);
                setIsErrorMembersCount(true);
            });
        });

        socket.on('ADDED_NEW_MINISTRY', () => {
            setIsLoadingMinistryCount(true);
            doRequest<{total_count: number}>({
                url: `/get-records-count/ministry`,
                method: "POST"
            })
            .then(response => {
                if(response.success) {
                    setMinistryCount(response.data?.total_count as number);
                    setIsLoadingMinistryCount(false);
                    if(isErrorMinistryCount) setIsErrorMinistryCount(false);
                } else throw response
            })
            .catch(err => {
                setIsLoadingMinistryCount(false);
                setIsErrorMinistryCount(true);
            });
        });

        socket.on('DELETED_MINISTRY', () => {
            setIsLoadingMinistryCount(true);
            doRequest<{total_count: number}>({
                url: `/get-records-count/ministry`,
                method: "POST"
            })
            .then(response => {
                if(response.success) {
                    setMinistryCount(response.data?.total_count as number);
                    setIsLoadingMinistryCount(false);
                    if(isErrorMinistryCount) setIsErrorMinistryCount(false);
                } else throw response
            })
            .catch(err => {
                setIsLoadingMinistryCount(false);
                setIsErrorMinistryCount(true);
            });
        });

        socket.on('ADDED_NEW_ORGANIZATION', () => {
            setIsLoadingOrgCount(true);
            doRequest<{total_count: number}>({
                url: `/get-records-count/organizations`,
                method: "POST"
            })
            .then(response => {
                if(response.success) {
                    setOrgCount(response.data?.total_count as number);
                    setIsLoadingOrgCount(false);
                    if(isErrorOrgCount) setIsErrorOrgCount(false);
                } else throw response
            })
            .catch(err => {
                setIsLoadingOrgCount(false);
                setIsErrorOrgCount(true);
            });
        });

        socket.on('DELETED_ORGANIZATION', () => {
            setIsLoadingOrgCount(true);
            doRequest<{total_count: number}>({
                url: `/get-records-count/organizations`,
                method: "POST"
            })
            .then(response => {
                if(response.success) {
                    setOrgCount(response.data?.total_count as number);
                    setIsLoadingOrgCount(false);
                    if(isErrorOrgCount) setIsErrorOrgCount(false);
                } else throw response
            })
            .catch(err => {
                setIsLoadingOrgCount(false);
                setIsErrorOrgCount(true);
            });
        });

        return function () {
            socket.disconnect();
        }
    }, []);

    return {
        members: {
            count: membersCount,
            isLoading: isLoadingMembersCount,
            isError: isErrorMembersCount
        },
        ministry: {
            count: ministryCount,
            isLoading: iseLoadingMinistryCount,
            isError: isErrorMinistryCount
        },
        organizations: {
            count: orgCount,
            isLoading: isLoadingOrgCount,
            isError: isErrorOrgCount
        }
    }
}

export default useGetRecordsCount;