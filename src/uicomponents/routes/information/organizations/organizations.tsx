import { Link, useNavigate } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";

import UseRipple from "../../../reusables/Ripple/UseRipple";
import Devider from "../../../reusables/devider";
import { SiteMap } from "../Information";


import GoBackBtn from "../../../GoBackBtn";

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
               Organizations
            </RouteContentBaseBody>
        </RouteContentBase>
    )
};

export default Organizations;