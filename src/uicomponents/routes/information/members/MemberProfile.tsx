import { Link, useNavigate } from "react-router-dom";
import React, { ReactNode } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";
import { useParams } from "react-router-dom";
import Devider from "../../../reusables/devider";
import SiteMap from "../../SiteMap";
import GoBackBtn from "../../../GoBackBtn";
import useGetMemberInfoByUID from "../../../../API/hooks/useGetMemberInfoByUID";
import SkeletonLoading from "../../../reusables/SkeletonLoading";
import SimpleTab, { Tab } from "../../../reusables/SimpleTabs";
import doRequest from "../../../../API/doRequest";

import ProfileCard from "./ProfileCard";
import BasicInfoDataDisplay from "./BasicInfoDataDisplay";
import ContactInfoDataDisplay from "./ContactInfoDataDisplay";
import MonthlyWorshipAttendanceChart from "./MonthlyWorshipAttendanceChart";
import InvolvementsList from "./InvolvementsList";
import DataDisplayChip from "../../../reusables/DataDisplayChip";

const ContentWraper = styled.div`
    display: flex;
    flex: 0 1 100%;
    gap: 10px;
    flex-wrap: wrap;
    height: fit-content;
    padding: 15px 0;
    /* align-items: center; */
    justify-content: center;

    ${SimpleTab} {
        flex: 0 1 100%;
    }

    .left-col, .right-col {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        align-content: flex-start;
        gap: 10px;
    }

    .left-col {

        .address-data-group {
            display: flex;
            flex: 0 1 100%;
            padding: 30px;
            flex-wrap: wrap;
            border-radius: 5px;
            background-color: ${({theme}) => theme.background.lighter};

            .data-label {
                flex: 0 1 100%;
                color: ${({theme}) => theme.textColor.light};
                font-size: 11px;
                font-weight: bold;
                padding: 0 0 10px 0;
            }

            ${DataDisplayChip} {
                flex: 0 1 100%;
                justify-content: flex-start;
                margin-bottom: 10px;
            }
        }
    }
`;

const MemberProfile: React.FC = () => {
    const navigate = useNavigate();
    const [tab, setTab] = React.useState("information");
    const { memberUID } = useParams();
    const {getMemberRecord, data: memberInformation, isLoading} = useGetMemberInfoByUID();

    const [orgs, setOrgs] = React.useState<{
        avatar: null | string,
        description: string,
        organizationName: string,
        organizationUID: string
    }[] | null>(null);

    const [ministries, setMinistries] = React.useState<{
        avatar: null | string,
        description: string,
        ministryName: string,
        ministryUID: string
    }[] | null>(null);

    React.useEffect(() => {
        if(memberUID) {
            getMemberRecord(memberUID);

            doRequest<{
                ministries: {
                    avatar: null | string,
                    description: string,
                    ministryName: string,
                    ministryUID: string
                }[] | null,
                orgs: {
                    avatar: null | string,
                    description: string,
                    organizationName: string,
                    organizationUID: string
                }[] | null
            }>({
                method: "GET",
                url: `/get-member-involvements/${memberUID}`
            })
            .then(response => {
                if(response.success && response.data)  {
                    setMinistries(response.data.ministries);
                    setOrgs(response.data.orgs)
                }
            })
            .catch(err => console.log(err))
        }
    }, [memberUID]);

    return (
        <RouteContentBase>
            <RouteContentBaseHeader>
                <strong>{`${memberInformation?.first_name} ${memberInformation?.middle_name[0]} ${memberInformation?.surname} ${memberInformation?.ext_name || ""}`}</strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    / <Link to='/app/information'> information</Link>  / <Link to='/app/information/ministry'> members</Link> / <Link to='./'>{memberInformation?.member_uid}</Link>
                </SiteMap>
                <GoBackBtn />
            </RouteContentBaseHeader>
            <RouteContentBaseBody>
                <ContentWraper>
                    {
                        isLoading && <>
                            <SkeletonLoading height="200px" />
                            <SkeletonLoading height="400px" />
                        </>
                    }
                    {
                        !(isLoading) && memberInformation && <>
                            <ProfileCard
                            name={`${memberInformation.first_name} ${memberInformation.middle_name[0]}. ${memberInformation.surname} ${memberInformation.ext_name || ""}`}
                            picture={memberInformation.avatar} 
                            memberUID={memberInformation.member_uid} />
                            {/* <SimpleTab value={tab} onChange={(tab) => setTab(tab)}>
                                <Tab value="information" label="Information"/>
                                <Tab value="involvements" label="Involvements"/>
                                <Tab value="engagement" label="Engagements"/>
                                <Tab value="badges" label="Badges"/>
                            </SimpleTab> */}
                            {
                                tab == "information"? <>
                                    <div className="left-col">
                                        <BasicInfoDataDisplay data={{
                                        firstName: memberInformation.first_name,
                                        middleName: memberInformation.middle_name,
                                        surname: memberInformation.surname,
                                        extName: memberInformation.ext_name,
                                        dateOfBirth: memberInformation.date_of_birth,
                                        gender: memberInformation.gender,
                                        maritalStatus: memberInformation.marital_status
                                        }}/>
                                        <div className="address-data-group">
                                            <p className="data-label">Current Address</p>
                                            <DataDisplayChip variant="outlined" icon={<FontAwesomeIcon icon={["fas", "map-marker-alt"]} />}>
                                                {
                                                    memberInformation.outsidePHCurrentAddress? memberInformation.outsidePHCurrentAddress :
                                                    `${memberInformation.localCurrentAddressBarangay}, ${memberInformation.localCurrentAddressMunCity}, ${memberInformation.localCurrentAddressProvince}, ${memberInformation.localCurrentAddressRegion}`
                                                }
                                            </DataDisplayChip>
                                            <p className="data-label">Permanent Address</p>
                                            <DataDisplayChip variant="outlined" icon={<FontAwesomeIcon icon={["fas", "map-marker-alt"]} />}>
                                                {
                                                    memberInformation.outsidePHpermanentAddress? memberInformation.outsidePHpermanentAddress :
                                                    `${memberInformation.localPermanentAddressBarangay}, ${memberInformation.localPermanentAddressMunCity}, ${memberInformation.localPermanentAddressProvince}, ${memberInformation.localPermanentAddressRegion}`
                                                }
                                            </DataDisplayChip>
                                        </div>
                                        <ContactInfoDataDisplay 
                                        cpNumber={memberInformation.homeCPNUmber} 
                                        email={memberInformation.homeEmail}
                                        telNumber={memberInformation.homeTelNumber}
                                        personal={false}/>
                                        <ContactInfoDataDisplay 
                                        cpNumber={memberInformation.personalCPNumber} 
                                        email={memberInformation.personalEmail}
                                        telNumber={memberInformation.personalTelNumber}
                                        personal={true}/>
                                    </div>
                                    <div className="right-col">
                                        <MonthlyWorshipAttendanceChart memberUID={memberInformation.member_uid} />
                                        <InvolvementsList orgs={orgs} ministries={ministries}/>
                                    </div>
                                </> : ""
                            }
                        </>
                    }
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
    )
}


export default MemberProfile;