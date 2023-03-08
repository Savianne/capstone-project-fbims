import { Link, useNavigate } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";

import Devider from "../../../reusables/devider";
import SiteMap from "../../SiteMap";
import GoBackBtn from "../../../GoBackBtn";
import Button from "../../../reusables/Buttons/Button";

import Input from "../../../reusables/Inputs/Input";

const ContentWraper = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    height: fit-content;
    padding: 15px 5px;
    align-items: center;
    justify-content: center;

    & .add-ministry-form {
        display: flex;
        flex-wrap: wrap;
        flex: 0 1 700px;
        /* height: 500px; */
        align-items: center;
        justify-content: center;
        margin: 30px 0;
    }

    & .add-ministry-form ${Input} {
        display: flex;
        flex: 0 1 100%;
        margin: 25px 0;
    }

    & .add-ministry-form ${Button} {
        margin-left: auto;
    }
`;

const AddNewMinistryForm: React.FC = () => {

    return (
        <RouteContentBase>
            <RouteContentBaseHeader>
                <strong>Add Ministry</strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    / <Link to='/information'> information</Link>  / <Link to='/information/ministry'> ministry</Link> / <Link to='/information/ministry/add-new-ministry'> add-new-ministry</Link>
                </SiteMap>
                <GoBackBtn />
            </RouteContentBaseHeader>
            <RouteContentBaseBody>
                <ContentWraper>
                    <div className="add-ministry-form">
                        <Input type="text" placeholder="Title" onValChange={(val) => console.log(val)}/>
                        <Input type="text" placeholder="Description" onValChange={(val) => console.log(val)}/>
                        <Button label="Add Mnistry" icon={<FontAwesomeIcon icon={["fas", "plus"]} />} color="primary" />
                    </div>
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
    )
}

export default AddNewMinistryForm;