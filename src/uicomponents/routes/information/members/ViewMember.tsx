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
import Select, {Option} from "../../../reusables/Inputs/Select";
import Revealer from "../../../reusables/Revealer";
import useGetMemberInfoByUID from "../../../../API/hooks/useGetMemberInfoByUID";
import IconInput from "../../../reusables/Inputs/IconInput";
import PHCPNumberInput from "../../../reusables/Inputs/PHCPNumberInput";
import PHTelNumberInput from "../../../reusables/Inputs/PHTelNumberInput";
import SimpleTab, { Tab } from "../../../reusables/SimpleTabs";
import SkeletonLoading from "../../../reusables/SkeletonLoading";
import { IStyledFC } from "../../../IStyledFC";

const ContentWraper = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    height: fit-content;
    padding: 15px 0;
    align-items: center;
    justify-content: center;

    ${SkeletonLoading}:last-child {
        margin-top: 15px;
    }

    header {
        display: flex;
        align-items: center;
        flex: 0 1 100%;
        min-height: 200px;
        background-color: ${({theme}) => theme.background.lighter};
        padding: 10px 15px;
        border-radius: 4px;
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
        color: ${({theme}) => theme.textColor.strong};
    }

    header .group-info h1 {
        width: 100%;
        font-size: 35px;
        font-weight: 600;
    }

    header .group-info p {
        width: 100%;
        font-size: 13px;
        color: ${({theme}) => theme.textColor.light}
    }

    .members-info-data-container {
        display: flex;
        flex-wrap: wrap;
        flex: 0 1 100%;
        padding: 15px;
        height: fit-content;
        background-color:  ${({theme}) => theme.background.lighter};
        /* box-shadow: 3px 3px 5px 1px rgb(0 0 0 / 5%); */
        min-width: 0;
        border-radius: 4px;
        margin-top: 15px;

        .tab-content {
            display: flex;
            flex: 0 1 100%;
            flex-wrap: wrap;
            padding: 20px 0 0 0;
        
            .basic-info-group {
                display: flex;
                flex: 0 1 100%;
                padding: 10px 0;
                min-width: 0;
                margin-bottom: 30px;
                align-items: center;
            }

            .basic-info-category-group {
                display: flex;
                flex: 1;
            }

            .basic-info-group .avatar-uploader-container {
                display: flex;
                width: 350px;
                justify-content: center;
                align-content: flex-start;
            }

            .information-category-title {
                flex: 0 1 100%;
                height: fit-content;
                text-align: center;
                border-bottom: 1px solid ${({theme}) => theme.borderColor};
                padding-bottom: 5px;
                /* font-size: 20px; */
                margin-bottom: 15px;
                margin-top: 15px;
                color: ${({theme}) => theme.textColor.strong};
            }

            .data-category {
                display: flex;
                flex: 0 1 100%;
                align-items: center;
                padding: 10px 0;
                min-width: 0;
            }

            .data-category .data-category-title-container,
            .data-category .input-category-group {
                display: flex;
                flex: 0 0 75px;
                height: 55px;
            }
            
            .data-category .data-category-title-container {
                /* background-color: ${({theme}) => theme.background.light}; */
                align-items: center;
                justify-content: center;
                flex-direction: column;
            }

            .data-category .data-category-title-container p {
                font-size: 11px;
                text-align: center;
            }

            .full-name-group .data-category-title-container {
                /* background-color: #019aff33; */
                color: #4bb2f7;
            }

            .birth-date-group .data-category-title-container {
                /* background-color: #ffb72f75; */
                color: #ffac1f;
            }

            .gender-group .data-category-title-container {
                /* background-color: #f696fc52; */
                color: #ee3ff9;
            }

            .marital-status-group .data-category-title-container {
                /* background-color: #fd151547; */
                color: #f74a4a;
            }

            .address-group .data-category-title-container,
            .ministry-group .data-category-title-container {
                /* background-color: #2dff7636; */
                color: #23c703;
            }

            .current-address-group .data-category-title-container {
                /* background-color: #0beed930; */
                color: #0beed9;
            }

            .contact-group .data-category-title-container {
                /* background-color: #4706a13d; */
                color: #9245ff;
            }

            .date-of-baptism-group .data-category-title-container {
                /* background-color: #8b088a59; */
                color: #cd28cc;
            }

            .organization-group .data-category-title-container {
                /* background-color: #00bcd43d; */
                color: #27e7ff;
            }

            .data-category .input-category-group {
                display: flex;
                flex-wrap: wrap;
                flex: 0 1 100%;
                height: fit-content;
                min-width: 0;
            }

            .data-category .input-category-group ${Input},
            .data-category .input-category-group ${Select} {
                margin-left: 10px;
            }

            .data-category .input-category-group ${IconInput},
            .data-category .input-category-group ${PHCPNumberInput},
            .data-category .input-category-group ${PHTelNumberInput} {
                margin: 10px 0 10px 10px;
            }
            
            .address-group .input-category-group ${Revealer},
            .current-address-group .input-category-group ${Revealer},
            .date-of-baptism-group .input-category-group ${Revealer} {
                margin: 0 10px; 
            }

            .address-group .input-category-group ${Revealer} ${Select},
            .address-group .input-category-group ${Revealer} ${Input},
            .date-of-baptism-group .input-category-group ${Revealer} ${Input},
            .current-address-group .input-category-group ${Select},
            .current-address-group .input-category-group ${Revealer} ${Input},
            .current-address-group .input-category-group ${Revealer} ${Select} {
                flex: 0 1 100%;
                margin: 10px 0 25px 10px;
            }

            .address-group .input-category-group ${Revealer} ${Input},
            .current-address-group .input-category-group ${Revealer} ${Input} {
                margin: 10px 0 0 0;
            }

            .organization-group .input-category-group .organization-avatar-container,
            .ministry-group .input-category-group .ministry-avatar-container {
                display: flex;
                flex: 1;
            }
        }  
    }
`;

const ViewMember: React.FC = () => {
    const navigate = useNavigate();
    const [tab, setTab] = React.useState("information");
    const { memberUID } = useParams();
    const {getMemberRecord, data: memberInformation, isLoading} = useGetMemberInfoByUID();

    React.useEffect(() => {
        if(memberUID) {
            getMemberRecord(memberUID);
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
                        <header>
                            <div className="avatar-area">
                                <Avatar size="140px " src={memberInformation?.avatar} alt="A" />
                            </div>
                            <div className="group-info">
                                <h1>{`${memberInformation?.first_name} ${memberInformation?.middle_name[0]}. ${memberInformation?.surname} ${memberInformation?.ext_name || ""}`}</h1>
                                <p><FontAwesomeIcon icon={["fas", "user"]} style={{marginRight: "5px", fontSize: '13px'}}/> {memberInformation?.member_uid}</p>
                                <WorshipServiceAttendanceBadge remark="Active Member" />
                            </div>
                        </header>
                        <div className="members-info-data-container">
                            
                            <SimpleTab value={tab} onChange={(tab) => setTab(tab)}>
                                <Tab value="information" label="Information"/>
                                <Tab value="organization" label="Organizations & Ministries"/>
                                <Tab value="engagement" label="Engagements"/>
                                <Tab value="badges" label="Badges"/>
                            </SimpleTab>
                            <div className="tab-content">
                                {
                                    tab == "information"? <>
                                    <div className="data-category full-name-group">
                                        <span className="data-category-title-container">
                                            <FontAwesomeIcon icon={["fas", "user"]} />
                                            <p>Fullname</p>
                                        </span>
                                        <Devider $orientation="vertical"  $css="margin: 0 5px" />
                                        <div className="input-category-group">
                                            <Input viewOnly value={memberInformation?.first_name} name="first-name" placeholder="First Name"  type="text" onValChange={(val) => {}} />
                                            <Input viewOnly  value={memberInformation?.middle_name as string} name="middle-name" placeholder="Middle Name"  type="text"  onValChange={(val) =>{}}  />
                                            <Input viewOnly value={memberInformation?.surname as string} name="sur-name" placeholder="Sur Name"  type="text" onValChange={(val) => {}}  />
                                            <Select viewOnly value={memberInformation?.ext_name as string} placeholder="Ex. Name" onValChange={(val) => {}}>
                                                <Option value="">Please select</Option>
                                                <Option value="jr">JR</Option>
                                                <Option value="sr">SR</Option>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="data-category birth-date-group">
                                        <span className="data-category-title-container">
                                            <FontAwesomeIcon icon={["fas", "cake-candles"]} />
                                            <p>Date of Birth</p>
                                        </span>
                                        <Devider $orientation="vertical"  $css="margin: 0 5px" />
                                        <div className="input-category-group">
                                            <Input viewOnly value={(() => {
                                                // Create a new Date object representing the current date and time
                                                const currentDate = memberInformation?.date_of_birth? new Date(memberInformation?.date_of_birth) : new Date();

                                                // Convert the Date object to a string in ISO 8601 format
                                                const isoDateStr = currentDate.toISOString();

                                                // Use regex to extract the "YYYY-mm-dd" part
                                                const regex = /^(\d{4}-\d{2}-\d{2})/;
                                                const match = isoDateStr.match(regex);

                                                return match? match[1] : "1998-08-0"
                                            })()} name="date-of-birth" type="date" placeholder="Date of Birth" onValChange={() => {}} />
                                        </div>
                                    </div>
                                    <div className="data-category gender-group">
                                        <span className="data-category-title-container">
                                            <FontAwesomeIcon icon={["fas", "venus-mars"]} />
                                            <p>Gender</p>
                                        </span>
                                        <Devider $orientation="vertical" $css="margin: 0 5px" />
                                        <div className="input-category-group">
                                            <Select viewOnly value={memberInformation?.gender} placeholder="Gender" onValChange={() => {}}>
                                                <Option value="">Please select</Option>
                                                <Option selected={memberInformation?.gender == 'male'} value="male">Male</Option>
                                                <Option selected={memberInformation?.gender == 'female'} value="female">Female</Option>
                                            </Select>
                                        </div> 
                                    </div>
                                    <div className="data-category marital-status-group">
                                        <span className="data-category-title-container">
                                            <FontAwesomeIcon icon={["fas", "heart"]} />
                                            <p>Marital Status</p>
                                        </span>
                                        <Devider $orientation="vertical" $css="margin: 0 5px" />
                                        <div className="input-category-group">
                                            <Select viewOnly value={memberInformation?.marital_status} placeholder="Marital Status" onValChange={() => {}}>
                                                <Option value="">Please select</Option>
                                                <Option value="single">Single</Option>
                                                <Option value="married">Married</Option>
                                                <Option value="widowed">Widowed</Option>
                                                <Option value="divorced">Divorced</Option>
                                                <Option value="separated">Separated</Option>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="data-category address-group">
                                        <span className="data-category-title-container">
                                            <FontAwesomeIcon icon={["fas", "map-location-dot"]} />
                                            <p>Permanent Address</p>
                                        </span>
                                        <Devider $orientation="vertical"  $css="margin: 0 5px" />
                                        <div className="input-category-group">
                                            {
                                                memberInformation?.outsidePHpermanentAddress? <>
                                                    <Input viewOnly value={memberInformation.outsidePHpermanentAddress} name="Region" type="text" placeholder="Permanent Address" onValChange={() => {}} />
                                                </> : <>
                                                    <Input viewOnly value={memberInformation?.localPermanentAddressRegion as string} type="text" name="Region"  placeholder="Region" onValChange={() => {}} />
                                                    <Input viewOnly value={memberInformation?.localPermanentAddressMunCity as string} type="text" name="City / Municipality"  placeholder="City / Municipality" onValChange={() => {}} />
                                                    <Input viewOnly value={memberInformation?.localPermanentAddressBarangay as string} type="text" name="Barangay"  placeholder="Barangay" onValChange={() => {}} />
                                                    <Input viewOnly value={memberInformation?.localPermanentAddressProvince as string} type="text" name="Province"  placeholder="Province" onValChange={() => {}} />
                                                </>
                                            }
                                        </div>
                                    </div>
                                    <div className="data-category current-address-group">
                                        <span className="data-category-title-container">
                                            <FontAwesomeIcon icon={["fas", "map-location-dot"]} />
                                            <p>Current Address</p>
                                        </span>
                                        <Devider $orientation="vertical" $css="margin: 0 5px" />
                                        <div className="input-category-group">
                                        {
                                            memberInformation?.outsidePHCurrentAddress? <>
                                                <Input viewOnly value={memberInformation.outsidePHCurrentAddress} name="permanent address" type="text" placeholder="Current Address" onValChange={() => {}} />
                                            </> : <>
                                                <Input viewOnly value={memberInformation?.localCurrentAddressRegion as string} type="text" name="Region"  placeholder="Region" onValChange={() => {}} />
                                                <Input viewOnly value={memberInformation?.localCurrentAddressProvince as string} type="text" name="Province"  placeholder="Province" onValChange={() => {}} />
                                                <Input viewOnly value={memberInformation?.localCurrentAddressMunCity as string} type="text" name="City / Municipality"  placeholder="City / Municipality" onValChange={() => {}} />
                                                <Input viewOnly value={memberInformation?.localCurrentAddressBarangay as string} type="text" name="Barangay"  placeholder="Barangay" onValChange={() => {}} />
                                            </>
                                        }
                                        </div>
                                    </div>
                                    {/* <Devider $orientation="horizontal"  $css="margin: 0 5px" /> */}
                                    <div className="data-category contact-group">
                                        <span className="data-category-title-container">
                                            <FontAwesomeIcon icon={["fas", "user"]} />
                                            <p>Contact (Personal)</p>
                                        </span>
                                        <Devider $orientation="vertical" $css="margin: 0 5px" />
                                        <div className="input-category-group">
                                            <IconInput viewOnly value={memberInformation?.personalEmail as string} type="email" placeholder="Email Address"onValChange={(e) => {}} icon={<FontAwesomeIcon icon={["fas", "at"]} />} />
                                            <PHCPNumberInput viewOnly value={memberInformation?.personalCPNumber as string} placeholder="Mobile Number"  onChange={(e) => {}} icon={<FontAwesomeIcon icon={["fas", "mobile-alt"]} />} />
                                            <PHTelNumberInput viewOnly value={memberInformation?.personalTelNumber as string} placeholder="Telephone Number" onChange={(e) => {}} icon={<FontAwesomeIcon icon={["fas", "phone-alt"]} />} />
                                        </div>
                                    </div>
                                    <div className="data-category contact-group">
                                        <span className="data-category-title-container">
                                            <FontAwesomeIcon icon={["fas", "home"]} />
                                            <p>Contact (Home)</p>
                                        </span>
                                        <Devider $orientation="vertical" $css="margin: 0 5px" />
                                        <div className="input-category-group">
                                            <IconInput viewOnly value={memberInformation?.homeEmail as string} type="email" placeholder="Email Address" onValChange={(e) =>{}} icon={<FontAwesomeIcon icon={["fas", "at"]} />} />
                                            <PHCPNumberInput viewOnly value={memberInformation?.homeCPNUmber as string} placeholder="Mobile Number"   onChange={(e) => {}} icon={<FontAwesomeIcon icon={["fas", "mobile-alt"]} />} />
                                            <PHTelNumberInput viewOnly value={memberInformation?.homeTelNumber as string} placeholder="Telephone Number"   onChange={(e) => {}} icon={<FontAwesomeIcon icon={["fas", "phone-alt"]} />} />
                                        </div>
                                    </div>
                                    <div className="data-category date-of-baptism-group">
                                        <span className="data-category-title-container">
                                            <FontAwesomeIcon icon={["fas", "place-of-worship"]} />
                                            <p>Baptism</p>
                                        </span>
                                        <Devider $orientation="vertical" $css="margin: 0 5px" />
                                        <div className="input-category-group">
                                            <Input viewOnly value={memberInformation?.date_of_baptism || ""} name="date-of-baptism" type="date" placeholder="Date of Baptism" onValChange={(val) => {}} />
                                        </div>
                                    </div>
                                    </> : ""
                                }
                            </div>
                            
                        </div>
                        </>
                    }
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
    )
}

interface IWorshipServiceAttendanceBadge extends IStyledFC {
    remark: "Regular Attendee" | "Active Member" | "Less Engaged"
}

const WorshipServiceAttendanceBadgeFC: React.FC<IWorshipServiceAttendanceBadge> = ({className, remark}) => {
    return ( 
        <div className={className}>
            <div className="icon-badge">
                <span className="fa-layers fa-fw fa-lg">
                    <FontAwesomeIcon icon={["fas", "certificate"]} />
                    <FontAwesomeIcon icon={["fas", "check"]} transform="shrink-6" inverse />
                </span>
            </div> 
            <p className="remark">{remark}</p>
        </div>
    )
}

const WorshipServiceAttendanceBadge = styled(WorshipServiceAttendanceBadgeFC)`
    display: flex;
    width: fit-content;
    height: fit-content;
    align-items: center;
    font-size: 12px;
    border: 1px solid ${({theme}) => theme.borderColor};
    border-radius: 16px;
    padding: 5px 8px;
    margin-top: 8px;
    
    && .remark {
        color:  ${({theme}) => theme.textColor.light};
    }

    .icon-badge {
        display: flex;
        width: fit-content;
        height: fit-content;
        margin-right: 5px;
        color: ${(props) => props.remark == "Less Engaged"? props.theme.textColor.disabled : props.theme.staticColor.primary};
    }
`

export default ViewMember;