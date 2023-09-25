import { Link, useNavigate } from "react-router-dom";
import React, { ReactNode } from "react";
import styled, { css } from "styled-components";
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
import Alert, {AlertTitle} from "../../../reusables/Alert";
import Revealer from "../../../reusables/Revealer";
import useGetMemberInfoByUID from "../../../../API/hooks/useGetMemberInfoByUID";
import IconInput from "../../../reusables/Inputs/IconInput";
import PHCPNumberInput from "../../../reusables/Inputs/PHCPNumberInput";
import PHTelNumberInput from "../../../reusables/Inputs/PHTelNumberInput";
import DataDisplayChip from "../../../reusables/DataDisplayChip";

import { IStyledFC } from "../../../IStyledFC";
import UseRipple from "../../../reusables/Ripple/UseRipple";

const ContentWraper = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    height: fit-content;
    padding: 15px 0;
    align-items: center;
    justify-content: center;

    .tabs {
        display: flex;
        flex: 0 1 100%;
        justify-content: center;
        height: 40px;
        margin: 10px 0 15px 0;
        
        ${Devider} {
            margin: 0 4px;
        }
    }

    .tab-content {
        display: flex;
        flex: 0 1 700px;
        flex-wrap: wrap;
        margin: 0 auto;
        padding: 20px;
        gap: 10px;
        border-radius: 5px;
        background-color: ${({theme}) => theme.background.lighter};

        h1 {
            flex: 0 1 100%;
            padding: 10px 0 5px 0;
            color: ${({theme}) => theme.textColor.light};
            font-size: 14px;
            font-weight: 500;
        }

        .row {
            flex: 0 1 100%;
        }

        ${Input}, ${Select} {
            flex: 1;
            min-width: 150px;
            margin: 15px 0;
        }

        .btn-submit-area {
            display: flex;
            flex: 0 1 100%;
            justify-content: flex-end;
            gap: 10px

            /* ${Button} {
                margin-left: auto;
            } */
        }

    }

`;

const EditMember: React.FC = () => {
    const { memberUID } = useParams();
    const {getMemberRecord, data: memberInformation} = useGetMemberInfoByUID();
    const [tab, setTab] = React.useState<"basic-info" | 'address' | "contact" | "picture">("basic-info")
    React.useEffect(() => {
        if(memberUID) getMemberRecord(memberUID)
    }, [memberUID])
    return (
        <RouteContentBase>
            <RouteContentBaseHeader>
                <strong>{`Edit profile [ ${memberInformation?.member_uid} ]`}</strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    / <Link to='/app/information'> information</Link>  / <Link to='/app/information/ministry'> members</Link> / <Link to='./'>{memberInformation?.member_uid}</Link>
                </SiteMap>
                <GoBackBtn />
            </RouteContentBaseHeader>
            <RouteContentBaseBody>
                <ContentWraper>
                    <div className="tabs">
                        <Tab active={tab == "basic-info"} onClick={() => setTab("basic-info")} icon={<FontAwesomeIcon icon={["fas", "user"]} />} text="Basic Info" />
                        <Devider $orientation="vertical" $variant="center" />
                        <Tab active={tab == "address"} onClick={() => setTab("address")} icon={<FontAwesomeIcon icon={["fas", "map-marked-alt"]} />} text="Address" />
                        <Devider $orientation="vertical" $variant="center" />
                        <Tab active={tab == "contact"} onClick={() => setTab("contact")} icon={<FontAwesomeIcon icon={["fas", "phone-alt"]} />} text="Contact" />
                        <Devider $orientation="vertical" $variant="center" />
                        <Tab active={tab == "picture"} onClick={() => setTab("picture")} icon={<FontAwesomeIcon icon={["fas", "image"]} />} text="Picture" />
                    </div>
                    <div className="tab-content">
                        {
                            tab == "basic-info" && <>
                                <Input value={memberInformation?.first_name} name="first-name" type="text" placeholder="First Name" onValChange={(e) => console.log(e)}/>
                                <Input value={memberInformation?.middle_name} name="middle-name" type="text" placeholder="Middle Name" onValChange={(e) => console.log(e)}/>
                                <Input value={memberInformation?.surname} name="surname" type="text" placeholder="Surname" onValChange={(e) => console.log(e)}/>
                                <Select value={memberInformation?.ext_name as string} placeholder="Ext. name" onValChange={(e) => console.log(e)}>
                                    <Option value="">Select Ext. name</Option>
                                    <Option value="male">Male</Option>
                                    <Option value="female">Female</Option>
                                </Select>
                                <Input value={(() => {
                                // Create a new Date object representing the current date and time
                                const currentDate = memberInformation?.date_of_birth? new Date(memberInformation?.date_of_birth) : new Date();

                                // Convert the Date object to a string in ISO 8601 format
                                const isoDateStr = currentDate.toISOString();

                                // Use regex to extract the "YYYY-mm-dd" part
                                const regex = /^(\d{4}-\d{2}-\d{2})/;
                                const match = isoDateStr.match(regex);

                                return match? match[1] : "1998-08-0"
                            })()} name="date-of-birth" type="date" placeholder="Date of Birth" onValChange={() => {}} />
                            <Select value={memberInformation?.gender} placeholder="Gender" onValChange={() => {}}>
                                <Option value="">Please select</Option>
                                <Option selected={memberInformation?.gender == 'male'} value="male">Male</Option>
                                <Option selected={memberInformation?.gender == 'female'} value="female">Female</Option>
                            </Select>
                            <Select value={memberInformation?.marital_status} placeholder="Marital Status" onValChange={() => {}}>
                                <Option value="">Please select</Option>
                                <Option value="single">Single</Option>
                                <Option value="married">Married</Option>
                                <Option value="widowed">Widowed</Option>
                                <Option value="divorced">Divorced</Option>
                                <Option value="separated">Separated</Option>
                            </Select>
                            <Alert variant="outlined" severity="warning">Please note that clicking the 'Update changes' button will immediately update the data to the database. To revert any changes, you can click the 'Revert' button.</Alert>
                            <div className="btn-submit-area">
                                <Button label="Revert changes" />
                                <Button label="Update changes" color="edit" />
                            </div>
                            </>
                        }
                        {
                            tab == "address" && <>
                            <Alert variant="outlined">
                                <AlertTitle>Note</AlertTitle>
                                Kindly utilize the corresponding input fields below to update the address.
                            </Alert>
                            <h1>Permanent address:</h1>
                            <div className="row">
                                {
                                    memberInformation?.outsidePHpermanentAddress? <>
                                        <DataDisplayChip variant="filled" icon={<FontAwesomeIcon icon={["fas", "map-marker-alt"]} />}>{memberInformation.outsidePHpermanentAddress}</DataDisplayChip>
                                    </> : <DataDisplayChip variant="filled" icon={<FontAwesomeIcon icon={["fas", "map-marker-alt"]} />}>{`${memberInformation?.localPermanentAddressRegion}: ${memberInformation?.localCurrentAddressBarangay}, ${memberInformation?.localCurrentAddressMunCity}, ${memberInformation?.localCurrentAddressProvince}`}</DataDisplayChip>
                                }
                            </div>
                            <div className="row">
                                <Input disabled={false} checked={false} type="checkbox" placeholder="Outside PH Address" label="Outside PH Address?" onValChange={(val) => {
                                    const v = val as boolean;
                                   
                                }}/>
                            </div>
                            <Select value={memberInformation?.gender} placeholder="Gender" onValChange={() => {}}>
                                <Option value="">Please select</Option>
                                <Option selected={memberInformation?.gender == 'male'} value="male">Male</Option>
                                <Option selected={memberInformation?.gender == 'female'} value="female">Female</Option>
                            </Select>
                            <Select value={memberInformation?.gender} placeholder="Gender" onValChange={() => {}}>
                                <Option value="">Please select</Option>
                                <Option selected={memberInformation?.gender == 'male'} value="male">Male</Option>
                                <Option selected={memberInformation?.gender == 'female'} value="female">Female</Option>
                            </Select>
                            <Select value={memberInformation?.gender} placeholder="Gender" onValChange={() => {}}>
                                <Option value="">Please select</Option>
                                <Option selected={memberInformation?.gender == 'male'} value="male">Male</Option>
                                <Option selected={memberInformation?.gender == 'female'} value="female">Female</Option>
                            </Select>
                            <Select value={memberInformation?.gender} placeholder="Gender" onValChange={() => {}}>
                                <Option value="">Please select</Option>
                                <Option selected={memberInformation?.gender == 'male'} value="male">Male</Option>
                                <Option selected={memberInformation?.gender == 'female'} value="female">Female</Option>
                            </Select>
                            <div className="btn-submit-area">
                                <Button label="Update Address" color="edit" />
                            </div>
                            <Devider $orientation="horizontal" $flexItem $css="flex: 0 1 100%" />
                            <h1>Current address:</h1>
                            <div className="row">
                                {
                                    memberInformation?.outsidePHpermanentAddress? <>
                                        <DataDisplayChip variant="filled" icon={<FontAwesomeIcon icon={["fas", "map-marker-alt"]} />}>{memberInformation.outsidePHpermanentAddress}</DataDisplayChip>
                                    </> : <DataDisplayChip variant="filled" icon={<FontAwesomeIcon icon={["fas", "map-marker-alt"]} />}>{`${memberInformation?.localPermanentAddressRegion}: ${memberInformation?.localCurrentAddressBarangay}, ${memberInformation?.localCurrentAddressMunCity}, ${memberInformation?.localCurrentAddressProvince}`}</DataDisplayChip>
                                }
                            </div>
                            <div className="row">
                                <Input disabled={false} checked={false} type="checkbox" placeholder="Outside PH Address" label="Outside PH Address?" onValChange={(val) => {
                                    const v = val as boolean;
                                   
                                }}/>
                            </div>
                            <Select value={memberInformation?.gender} placeholder="Gender" onValChange={() => {}}>
                                <Option value="">Please select</Option>
                                <Option selected={memberInformation?.gender == 'male'} value="male">Male</Option>
                                <Option selected={memberInformation?.gender == 'female'} value="female">Female</Option>
                            </Select>
                            <Select value={memberInformation?.gender} placeholder="Gender" onValChange={() => {}}>
                                <Option value="">Please select</Option>
                                <Option selected={memberInformation?.gender == 'male'} value="male">Male</Option>
                                <Option selected={memberInformation?.gender == 'female'} value="female">Female</Option>
                            </Select>
                            <Select value={memberInformation?.gender} placeholder="Gender" onValChange={() => {}}>
                                <Option value="">Please select</Option>
                                <Option selected={memberInformation?.gender == 'male'} value="male">Male</Option>
                                <Option selected={memberInformation?.gender == 'female'} value="female">Female</Option>
                            </Select>
                            <Select value={memberInformation?.gender} placeholder="Gender" onValChange={() => {}}>
                                <Option value="">Please select</Option>
                                <Option selected={memberInformation?.gender == 'male'} value="male">Male</Option>
                                <Option selected={memberInformation?.gender == 'female'} value="female">Female</Option>
                            </Select>
                            <div className="btn-submit-area">
                                <Button label="Update Address" color="edit" />
                            </div>
                            </>
                        }
                    </div>
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
    )
}

interface ITab extends IStyledFC {
    icon: ReactNode,
    text: string,
    active?: boolean,
    onClick?: () => void
}

const TabFC: React.FC<ITab> = ({className, icon, text, active, onClick}) => {
    return (
        <div className={className} onClick={onClick}>
            <UseRipple>
                <span className="tab-icon">
                    {icon}
                </span>
                <p className="tab-text">
                    {text}
                </p>
            </UseRipple>
        </div>
    )
}

const Tab = styled(TabFC)`
    display: inline-flex;
    transition: background-color 300ms linear, color 300ms linear;
    border-radius: 5px;
    color: ${({theme}) => theme.textColor.light};
    cursor: pointer;

    :hover {
        background-color: ${({theme}) => theme.background.lighter};
    }

    ${UseRipple} {
        display: flex;
        border-radius: 5px;
        align-items: center;
        padding: 0 10px;

        .tab-icon {
            font-size: 13px;
            margin-right: 8px;
        }
    
        .tab-text {
            font-size: 14px;
        }
    }

    ${(props) => props.active && css`color: ${props.theme.staticColor.primary};`}
    
`


export default EditMember;