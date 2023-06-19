import { Link, useNavigate } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";
import { useParams } from "react-router-dom";
import Devider from "../../../reusables/devider";
import SiteMap from "../../SiteMap";
import GoBackBtn from "../../../GoBackBtn";
import Button from "../../../reusables/Buttons/Button";
import Avatar from "../../../reusables/Avatar";
import { AVATAR_BASE_URL } from "../../../../API/BASE_URL";
import Input from "../../../reusables/Inputs/Input";

import useGetMinistryInfo from "../../../../API/hooks/useGetMinistryInfo";

const ContentWraper = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    height: fit-content;
    padding: 15px 0;
    align-items: center;
    justify-content: center;

    header {
        display: flex;
        align-items: center;
        flex: 0 1 100%;
        min-height: 200px;
        background-color: ${({theme}) => theme.background.light};
        padding: 10px 15px;
    }

    header .avatar-area {
        display: flex;
        flex: 0 0 140px;
        height: 140px;
    }
    
    header .group-info {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        height: fit-content;
        margin-left: 15px;
        color: ${({theme}) => theme.textColor.strong}
    }

    header .group-info h1 {
        width: 100%;
        font-size: 40px;
        font-weight: 600;
    }

    header .button-group {
        display: flex;
        gap: 10px;
        flex-direction: column;
        width fit-content;
        height: fit-content;
    }

    header .button-group ${Button} {
        width: 100px;
    }
`;

const ManageMinistryView: React.FC = () => {
    const { ministryUID } = useParams();
    const {data, isLoading, isError, isUpdating, error} = useGetMinistryInfo(ministryUID as string);
    React.useEffect(() => {
        console.log(data)
    }, [data]);
    React.useEffect(() => {
        console.log(ministryUID)
    }, [ministryUID])
    return (
        <RouteContentBase>
            <RouteContentBaseHeader>
                <strong>Manage {data?.ministryName} </strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    / <Link to='/app/information'> information</Link>  / <Link to='/app/information/ministry'> ministry</Link> / <Link to='./'>{ministryUID}</Link>
                </SiteMap>
                <GoBackBtn />
            </RouteContentBaseHeader>
            <RouteContentBaseBody>
                <ContentWraper>
                    <header>
                        <div className="avatar-area">
                            <Avatar size="140px " src={`${AVATAR_BASE_URL}/${data?.avatar}`} alt="A" />
                        </div>
                        <div className="group-info">
                            <h1>{data?.ministryName}</h1>
                            <p>{data?.description}</p>
                        </div>
                        <div className="button-group">
                            <Button icon={<FontAwesomeIcon icon={["fas", "trash"]} />} label="Delete" color="delete" />
                            <Button icon={<FontAwesomeIcon icon={["fas", "edit"]} />} label="Edit" color="edit" />
                        </div>
                    </header>
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
    )
}

export default ManageMinistryView;