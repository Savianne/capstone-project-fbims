import { Link, useNavigate } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";

import UseRipple from "../../../reusables/Ripple/UseRipple";
import Devider from "../../../reusables/devider";
import { SiteMap } from "../Information";

import InformationRouteMainBoard from "../../InformationRouteMainBoard";
import GoBackBtn from "../../../GoBackBtn";

const ContentWraper = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    height: fit-content;
    padding: 15px 5px;
`;

const Organizations: React.FC = () => {

    return (
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
                    dataFolderTitle="Members"
                    dataFolderTotal={556}
                    addRecordFormUrl="./add-organization" />
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
    )
};

export default Organizations;