import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { IStyledFC } from "../../IStyledFC";

import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../RouteContentBase";
import SiteMap from "../SiteMap";
import Devider from "../../reusables/devider";

// import Calendar6x7 from "../../reusables/6x7Calendar";
import Calendar6x7 from "../../reusables/Calendar6x7/Calendar6x7";

const Content = styled.div`
    display: flex;
    flex: 0 1 100%;
    padding: 15px 0;
    justify-content: center;
`; 

const Calendar: React.FC = () => {

    return(
        <RouteContentBase>
            <RouteContentBaseHeader>
                <strong>Calendar</strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    / <Link to='/calendar'> calendar</Link>
                </SiteMap>
            </RouteContentBaseHeader>
            <RouteContentBaseBody>
                <Content>
                    <Calendar6x7 />    
                </Content>                
            </RouteContentBaseBody>
        </RouteContentBase>
    )
}

export default Calendar;