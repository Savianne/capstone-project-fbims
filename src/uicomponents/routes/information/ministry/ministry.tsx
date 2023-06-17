import { Link, useNavigate } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";

import UseRipple from "../../../reusables/Ripple/UseRipple";
import Input from "../../../reusables/Inputs/Input";
import Button from "../../../reusables/Buttons/Button";
import Devider from "../../../reusables/devider";
import SiteMap from "../../SiteMap";
import Modal from "../../../reusables/Modal";
import AvatarUploader from "../../../reusables/AvatarUploader/AvatarUploader";
import GroupList, { GroupListItem, IFCGroupListItem } from "../GroupList";
import InformationRouteMainBoard from "../../InformationRouteMainBoard";
import GoBackBtn from "../../../GoBackBtn";
import AddMinistryForm from "./addMinistryModalView";

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
    const [groupList, updateGroupList] = React.useState<null | IFCGroupListItem[]>([
        {
            groupName: 'Usher Ministry',
            membersAvatar: [
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
            ],
        },
        {
            avatar: '/assets/images/avatar/apple.png',
            groupName: 'Music Ministry',
            membersAvatar: [
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
            ],
        },
        {
            groupName: 'Documentation Ministry',
            membersAvatar: [
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
            ],
        },
        {
            groupName: 'Tech Ministry',
            membersAvatar: [
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
                {alt: 'radio'},
            ],
        },
    ])
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
                    dataFolderTitle="Members"
                    dataFolderTotal={556}
                    addRecordFormUrl="./add-ministry" 
                    addRecordFN={() => updateAddMinistryModal("ondisplay")}/>
                    <GroupList>
                        {
                            groupList?.map(group => {
                                return (
                                    <GroupListItem avatar={group.avatar} groupName={group.groupName} membersAvatar={group.membersAvatar} />
                                )
                            })
                        }
                    </GroupList>
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
        { 
        (addMinistryModal == "open" || addMinistryModal == "ondisplay" || addMinistryModal == "close") && 
        <Modal isLoading={modalIsLoading} state={addMinistryModal} title="Add New Ministry" onClose={() => updateAddMinistryModal("remove")} maxWidth="1000px"> 
            <AddMinistryForm />
        </Modal>
    }
    </>)
};


export default Ministry;