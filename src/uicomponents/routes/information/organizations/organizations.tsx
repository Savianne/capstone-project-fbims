import { Link, useNavigate } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";
import { io } from "socket.io-client";
import doRequest from "../../../../API/doRequest";
import useGetOrganizations from "../../../../API/hooks/useGetOrganizations";
import UseRipple from "../../../reusables/Ripple/UseRipple";
import Devider from "../../../reusables/devider";
import SiteMap from "../../SiteMap";
import AddOrganizationForm from "./addOrganizationFormModalView";
import Modal from "../../../reusables/Modal";
import InformationRouteMainBoard from "../../InformationRouteMainBoard";
import GoBackBtn from "../../../GoBackBtn";
import GroupList from "../GroupList";
import SkeletonLoading from "../../../reusables/SkeletonLoading";
import { AVATAR_BASE_URL, SOCKETIO_URL } from "../../../../API/BASE_URL";
import { OrgaizationListItem } from "../GroupList";

const ContentWraper = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    height: fit-content;
    padding: 15px 5px;
`;

const Organizations: React.FC = () => {
    const [addOrganizationModal, updateAddOrganizationModal] = React.useState<"close" | "ondisplay" | "open" | "remove" | "inactive">("inactive");
    const [modalIsLoading, updateModalIsLoading] = React.useState(false);
    const [organizationCountTotal, setorganizationCountTotal] = React.useState<"isLoading" | "isLoadError" | number>("isLoading");
    const {data, isLoading, isError, isUpdating, error} = useGetOrganizations();

    React.useEffect(() => {
        doRequest<{total_count: number}>({
          method: "POST",
          url: "/get-records-count/organizations" 
        })
        .then(response => {
            setorganizationCountTotal(response.data?.total_count as number);
        })
        .catch(err => setorganizationCountTotal("isLoadError"));

        const socket = io(SOCKETIO_URL);

        socket.on(`ADDED_NEW_ORGANIZATION`, () => {
            doRequest<{total_count: number}>({
                method: "POST",
                url: "/get-records-count/organizations" 
            })
            .then(response => {
                setorganizationCountTotal(response.data?.total_count as number);
            })
            .catch(err => setorganizationCountTotal("isLoadError"));
        });

        socket.on(`DELETED_ORGANIZATION`, () => {
            doRequest<{total_count: number}>({
                method: "POST",
                url: "/get-records-count/organizations" 
            })
            .then(response => {
                setorganizationCountTotal(response.data?.total_count as number);
            })
            .catch(err => setorganizationCountTotal("isLoadError"));
        });

        return function () {
            socket.disconnect();
        }

    }, []);

    React.useEffect(() => {
        console.log(data)
    }, [data])

    return (<>
        <RouteContentBase>
            <RouteContentBaseHeader>
                <strong>Organizations</strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    / <Link to='/information'> information</Link>  / <Link to='/information/organizations'> organizations</Link>
                </SiteMap>
                <GoBackBtn />
            </RouteContentBaseHeader>
            <RouteContentBaseBody>
                <ContentWraper>
                    <InformationRouteMainBoard 
                    bgImage="/assets/images/organizations.jpg"
                    verseText={{verse: 'Matthew 28:19-20 (NIV)', content: 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,  and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.”'}}
                    dataFolderIcon={<FontAwesomeIcon icon={["fas", "people-group"]} />}
                    dataFolderTitle="Organizations"
                    dataFolderTotal={organizationCountTotal}
                    addRecordFormUrl="./add-organization" 
                    addRecordFN={() => updateAddOrganizationModal("ondisplay")}/>
                    <GroupList>
                        {
                           data && data.length && data.map(group => {
                                return (
                                    <OrgaizationListItem key={group.organizationUID} avatar={group.avatar} groupName={group.organizationName} groupUID={group.organizationUID} />
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
            (addOrganizationModal == "open" || addOrganizationModal == "ondisplay" || addOrganizationModal == "close") && 
            <Modal isLoading={modalIsLoading} state={addOrganizationModal} title="Add New Organization" onClose={() => updateAddOrganizationModal("remove")} maxWidth="550px"> 
                <AddOrganizationForm onLoading={(isLoading) => updateModalIsLoading(isLoading)} />
            </Modal>
        }
    </>)
};

export default Organizations;