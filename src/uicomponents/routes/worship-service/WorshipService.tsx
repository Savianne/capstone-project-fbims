import { Link, useNavigate } from "react-router-dom";
import React, {useState, useEffect} from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../RouteContentBase";
import Devider from "../../reusables/devider";
import SiteMap from "../SiteMap";
import GoBackBtn from "../../GoBackBtn";

const ContentWraper = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    height: fit-content;
    padding: 15px 5px;
`;

const WorshipService: React.FC = () => {
    return (<>
        <RouteContentBase>
            <RouteContentBaseHeader>
                <strong>Worship Service</strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    / <Link to='/worship-service'> worship-service</Link>
                </SiteMap>
                <GoBackBtn />
            </RouteContentBaseHeader>
            <RouteContentBaseBody>
                <ContentWraper>
                  
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
    </>)
};


export default WorshipService;