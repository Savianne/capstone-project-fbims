import { Link, useNavigate } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";

import Pagenation from "../../../reusables/Pagenation/Pagenation";
import Devider from "../../../reusables/devider";
import SiteMap from "../../SiteMap";


import GoBackBtn from "../../../GoBackBtn";
import InformationRouteMainBoard from "../../InformationRouteMainBoard";
import MembersTable from "./MembersTable";
import Input from "../../../reusables/Inputs/Input";

const ContentWraper = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    height: fit-content;
    padding: 15px 5px;

    & .table-control {
        display: flex;
        flex: 0 1 100%;
        align-items: center;
        height: fit-content;
        padding: 20px 5px 0 5px;
    }

    & .table-control ${Pagenation} {
        margin-left: auto;
    }
`;

const Members: React.FC = () => {

    return (
        <RouteContentBase>
            <RouteContentBaseHeader>
                <strong>Members</strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    / <Link to='/information'> information</Link>  / <Link to='/information/members'> members</Link>
                </SiteMap>
                <GoBackBtn />
            </RouteContentBaseHeader>
            <RouteContentBaseBody>
                <ContentWraper>
                    <InformationRouteMainBoard 
                    bgImage="/assets/images/church.png"
                    verseText={{verse: 'Matthew 28:19-20 (NIV)', content: 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,  and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.”'}}
                    dataFolderIcon={<FontAwesomeIcon icon={["fas", "users"]} />}
                    dataFolderTitle="Members"
                    dataFolderTotal={556}
                    addRecordFormUrl="./new-member" />
                    <div className="table-control">
                        <Pagenation totalPage={17} onChange={(value) => alert(value)} />
                    </div>
                    <MembersTable 
                    membersList={
                        []
                    } />
                    <div className="table-control">
                        <Pagenation totalPage={18} onChange={(value) => alert(value)} />
                    </div>
                </ContentWraper>                
            </RouteContentBaseBody>
        </RouteContentBase>
    )
};

export default Members;