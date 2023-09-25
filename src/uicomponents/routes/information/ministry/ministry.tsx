import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";
import doRequest from "../../../../API/doRequest";
import Devider from "../../../reusables/devider";
import SiteMap from "../../SiteMap";
import Modal from "../../../reusables/Modal";
import AvatarUploader from "../../../reusables/AvatarUploader/AvatarUploader";
import GroupList, { GroupListItem, MinistryListItem } from "../GroupList";
import SkeletonLoading from "../../../reusables/SkeletonLoading";
import InformationRouteMainBoard from "../../InformationRouteMainBoard";
import GoBackBtn from "../../../GoBackBtn";
import AddMinistryForm from "./addMinistryModalView";

import useGetMinistries from "../../../../API/hooks/useGetMinistries";

import { SOCKETIO_URL } from "../../../../API/BASE_URL";

const ContentWraper = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    height: fit-content;
    padding: 15px 5px;
`;

const Ministry: React.FC = () => {
    const [addMinistryModal, updateAddMinistryModal] = React.useState<"close" | "ondisplay" | "open" | "remove" | "inactive">("inactive");
    const [modalIsLoading, updateModalIsLoading] = React.useState(false);
    const [ministryCountTotal, setMinistryCountTotal] = React.useState<"isLoading" | "isLoadError" | number>("isLoading");
    const {data, isLoading, isError, isUpdating, error} = useGetMinistries();
   
    React.useEffect(() => {
        doRequest<{total_count: number}>({
          method: "POST",
          url: "/get-records-count/ministry" 
        })
        .then(response => {
            setMinistryCountTotal(response.data?.total_count as number);
        })
        .catch(err => setMinistryCountTotal("isLoadError"));

        const socket = io(SOCKETIO_URL);

        socket.on(`ADDED_NEW_MINISTRY`, () => {
            doRequest<{total_count: number}>({
                method: "POST",
                url: "/get-records-count/ministry" 
            })
            .then(response => {
                setMinistryCountTotal(response.data?.total_count as number);
            })
            .catch(err => setMinistryCountTotal("isLoadError"));
        });

        socket.on(`DELETED_MINISTRY`, () => {
            doRequest<{total_count: number}>({
                method: "POST",
                url: "/get-records-count/ministry" 
            })
            .then(response => {
                setMinistryCountTotal(response.data?.total_count as number);
            })
            .catch(err => setMinistryCountTotal("isLoadError"));
        });

        return function () {
            socket.disconnect();
        }
    }, []);

    return (<>
        <RouteContentBase>
            <RouteContentBaseHeader>
                <strong>Ministry</strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    / <Link to='/information'> information</Link>  / <Link to='/information/ministry'> ministry</Link>
                </SiteMap>
                <GoBackBtn />
            </RouteContentBaseHeader>
            <RouteContentBaseBody>
                <ContentWraper>
                    <InformationRouteMainBoard 
                    bgImage="/assets/images/ministry.jpeg"
                    verseText={{verse: 'Matthew 28:19-20 (NIV)', content: 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,  and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.”'}}
                    dataFolderIcon={<FontAwesomeIcon icon={["fas", "hand-holding-heart"]} />}
                    dataFolderTitle="Ministries"
                    dataFolderTotal={ministryCountTotal}
                    addRecordFormUrl="./add-ministry" 
                    addRecordFN={() => updateAddMinistryModal("ondisplay")}/>
                    <GroupList>
                        {
                           data && data.length && data.map(group => {
                                return (
                                    <MinistryListItem key={group.ministryUID} avatar={group.avatar} groupName={group.ministryName} groupUID={group.ministryUID} />
                                )
                            })
                        }
                        {
                            isLoading && <>
                                <SkeletonLoading height="85px" />
                                <SkeletonLoading height="85px" />
                                <SkeletonLoading height="85px" />
                                <SkeletonLoading height="85px" />
                                <SkeletonLoading height="85px" />
                            </>
                        }
                    </GroupList>
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
        { 
        (addMinistryModal == "open" || addMinistryModal == "ondisplay" || addMinistryModal == "close") && 
        <Modal isLoading={modalIsLoading} state={addMinistryModal} title="Add New Ministry" onClose={() => updateAddMinistryModal("remove")} maxWidth="550px"> 
            <AddMinistryForm onLoading={(isLoading) => updateModalIsLoading(isLoading)} />
        </Modal>
    }
    </>)
};


export default Ministry;