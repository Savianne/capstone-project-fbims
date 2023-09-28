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
import useUpdateBasicInfo from "./useUpdateBasicInfo";
import { IStyledFC } from "../../../IStyledFC";
import UseRipple from "../../../reusables/Ripple/UseRipple";
import transformDateToYYYYMMDD from "../../../../utils/helpers/transformDateToYYYY-MM-DD";
import usePhilippinePlacesPickerSelect, { optionValue } from "../../../../utils/hooks/usePhilippinePlacePickerSelect";
import useUpdateLocalAddressInfo from "./useUpdateLocalAddressInfo";
import useUpdateOutsidePHAddress from "./useUpdateOutsidePHAddress";
import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";

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
    const addSnackBar = useAddSnackBar();
    const { memberUID } = useParams();
    const {getMemberRecord, data: memberInformation} = useGetMemberInfoByUID();
    const [tab, setTab] = React.useState<"basic-info" | 'address' | "contact" | "picture">("basic-info");
    const [outsidePHPermanetAddress, updateOutsidePHPermanetAddress] = React.useState(false);
    const [outsidePHCurrentAddress, updateOutsidePHCurrentAddress] = React.useState(false);
    const [permanentAddressValue, setPermanentAddressValue] = React.useState("");
    const [currentAddressValue, setCurrentAddressValue] = React.useState("");

    const {
        setBaseData,
        input: basicDataInput,
        values: basicDataValues,
        errors: basicInfoInputErrors,
        revertChange,
        isModified: basicDataIsModified,
        isUpdateError,
        isUpdateSuccess,
        isUpdating,
        updateError,
        submitUpdate: submitBasicInfoUpdate,
    } = useUpdateBasicInfo();

    const {
        input: localPermanentAddressInput,
        isReady: isReadyLocalPermanentAddress,
        values: localPermanentAddressValues,
        errors: localPermanentInputErrors,
        isUpdateError: isLocalPermanentUpdateError,
        isUpdateSuccess: isLocalPermanentAddressUpdateSuccess,
        isUpdating: isUpdatingLocalPermanentAddress,
        updateError: localPermanentAddressUpdateError,
        submitUpdate: submitLocalPermanentAddressUpdate,
    } = useUpdateLocalAddressInfo("permanent");

    const {
        input: outsidePermanentAddressInput,
        isReady: isReadyOutsidePermanentAddress,
        values: outsidePermanentAddressValues,
        errors: outsidePermanentInputErrors,
        isUpdateError: isOutsdePermanentUpdateError,
        isUpdateSuccess: isOutsidePermanentAddressUpdateSuccess,
        isUpdating: isUpdatingOutsidePermanentAddress,
        updateError: outsidePermanentAddressUpdateError,
        submitUpdate: submitOutsidePermanentAddressUpdate,
    } = useUpdateOutsidePHAddress("permanent");

    const {
        input: localCurrentAddressInput,
        isReady: isReadyLocalCurrentAddress,
        values: localCurrentAddressValues,
        errors: localCurrentInputErrors,
        isUpdateError: isLocalCurrentUpdateError,
        isUpdateSuccess: isLocalCurrentAddressUpdateSuccess,
        isUpdating: isUpdatingLocalCurrentAddress,
        updateError: localCurrentAddressUpdateError,
        submitUpdate: submitLocalCurrentAddressUpdate,
    } = useUpdateLocalAddressInfo("current");

    const {
        input: outsideCurrentAddressInput,
        isReady: isReadyOutsideCurrentAddress,
        values: outsideCurrentAddressValues,
        errors: outsideCurrentInputErrors,
        isUpdateError: isOutsdeCurrentUpdateError,
        isUpdateSuccess: isOutsideCurrentAddressUpdateSuccess,
        isUpdating: isUpdatingOutsideCurrentAddress,
        updateError: outsideCurrentAddressUpdateError,
        submitUpdate: submitOutsideCurrentAddressUpdate,
    } = useUpdateOutsidePHAddress("current");

    const permanentAddress = usePhilippinePlacesPickerSelect(
        (region) => localPermanentAddressInput?.region(region),
        (province) => localPermanentAddressInput?.province(province),
        (cityMun) => localPermanentAddressInput?.munCity(cityMun),
        (barangay) => localPermanentAddressInput?.barangay(barangay)
    );

    const currentAddress = usePhilippinePlacesPickerSelect(
        (region) => localCurrentAddressInput?.region(region),
        (province) => localCurrentAddressInput?.province(province),
        (cityMun) => localCurrentAddressInput?.munCity(cityMun),
        (barangay) => localCurrentAddressInput?.barangay(barangay)
    );

    React.useEffect(() => {
        if(memberUID) getMemberRecord(memberUID)
    }, [memberUID]);

    React.useEffect(() => {
        memberInformation && setBaseData({
            first_name: memberInformation.first_name,
            middle_name: memberInformation.middle_name,
            surname: memberInformation.surname,
            ext_name: memberInformation.ext_name,
            gender: memberInformation.gender,
            marital_status: memberInformation.marital_status, 
            date_of_birth: transformDateToYYYYMMDD(memberInformation.date_of_birth)
        });

        memberInformation?.outsidePHpermanentAddress? setPermanentAddressValue(memberInformation.outsidePHpermanentAddress) : setPermanentAddressValue(`${memberInformation?.localPermanentAddressRegion}: ${memberInformation?.localPermanentAddressBarangay}, ${memberInformation?.localPermanentAddressMunCity}, ${memberInformation?.localPermanentAddressProvince}`);
        memberInformation?.outsidePHCurrentAddress? setCurrentAddressValue(memberInformation.outsidePHCurrentAddress) : setCurrentAddressValue(`${memberInformation?.localCurrentAddressRegion}: ${memberInformation?.localCurrentAddressBarangay}, ${memberInformation?.localCurrentAddressMunCity}, ${memberInformation?.localCurrentAddressProvince}`)
    }, [memberInformation]);

    React.useEffect(() => {

    }, [])
    return (
        <RouteContentBase>
            <RouteContentBaseHeader>
                <strong>{`Edit profile [ ${memberInformation?.member_uid? memberInformation?.member_uid : "Loading..."} ]`}</strong>
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
                            memberInformation && <>
                            {
                                tab == "basic-info" && <>
                                    {
                                        basicDataValues && basicDataInput? <>
                                            {
                                                updateError && <Alert variant="outlined" severity="error">Error occurred! try again</Alert>
                                            }
                                            <Input error={basicInfoInputErrors.first_name} value={basicDataValues.first_name} name="first-name" type="text" placeholder="First Name" onValChange={(e) => basicDataInput.first_name(e as string)}/>
                                            <Input error={basicInfoInputErrors.middle_name} value={basicDataValues.middle_name} name="middle-name" type="text" placeholder="Middle Name" onValChange={(e) => basicDataInput.middle_name(e as string)} />
                                            <Input error={basicInfoInputErrors.surname} value={basicDataValues.surname} name="surname" type="text" placeholder="Surname" onValChange={(e) => basicDataInput.surname(e as string)}/>
                                            <Select error={basicInfoInputErrors.ext_name} value={basicDataValues.ext_name as string} placeholder="Ext. name" onValChange={(e) => basicDataInput.ext_name(e)}>
                                                <Option value="">Select Ext. name</Option>
                                                <Option value="jr">Jr.</Option>
                                                <Option value="sr">Sr.</Option>
                                            </Select>
                                            <Input error={basicInfoInputErrors.date_of_birth} value={basicDataValues.date_of_birth} name="date-of-birth" type="date" placeholder="Date of Birth" onValChange={(e) => basicDataInput.date_of_birth(e as string)} />
                                            <Select error={basicInfoInputErrors.gender} value={basicDataValues.gender} placeholder="Gender" onValChange={(e) => basicDataInput.gender(e)}>
                                                <Option value="">Please select</Option>
                                                <Option value="male">Male</Option>
                                                <Option value="female">Female</Option>
                                            </Select>
                                            <Select error={basicInfoInputErrors.marital_status} value={basicDataValues.marital_status} placeholder="Marital Status" onValChange={(e) => basicDataInput.marital_status(e)}>
                                                <Option value="">Please select</Option>
                                                <Option value="single">Single</Option>
                                                <Option value="married">Married</Option>
                                                <Option value="widowed">Widowed</Option>
                                                <Option value="divorced">Divorced</Option>
                                                <Option value="separated">Separated</Option>
                                            </Select>
                                            <Alert variant="outlined" severity="info">Please note that clicking the 'Update changes' button will immediately update the data to the database. To revert any changes, you can click the 'Revert' button.</Alert>
                                            <div className="btn-submit-area">
                                                <Button disabled={!basicDataIsModified} label="Revert changes" onClick={revertChange}/>
                                                <Button disabled={!(basicDataIsModified) || (basicDataIsModified && Object.values(basicInfoInputErrors).length > 0)} label="Update changes" color="edit" isLoading={isUpdating} onClick={() => submitBasicInfoUpdate && submitBasicInfoUpdate(memberInformation.member_uid)} />
                                            </div>
                                        </> : "Loading..."
                                    }
                                </> 
                            }
                            {
                                tab == "address" && <>
                                <Alert variant="outlined">
                                    {/* <AlertTitle>Note</AlertTitle> */}
                                    Kindly utilize the corresponding input fields below to update the address.
                                </Alert>
                                <h1>Permanent address:</h1>
                                <div className="row">
                                    <DataDisplayChip variant="outlined" icon={<FontAwesomeIcon icon={["fas", "map-marker-alt"]} />}>{permanentAddressValue}</DataDisplayChip>
                                </div>
                                <div className="row">
                                    <Input disabled={isUpdatingLocalPermanentAddress} checked={outsidePHPermanetAddress} type="checkbox" placeholder="Outside Philippines" label="Outside Philippines?" onValChange={(val) => {
                                        const v = val as boolean;
                                        updateOutsidePHPermanetAddress(v)}
                                    }/>
                                </div>
                                {
                                    !outsidePHPermanetAddress? <>
                                    <Select 
                                    value={permanentAddress.values.region}
                                    disabled={isUpdatingLocalPermanentAddress} placeholder="Region" 
                                    error={localPermanentInputErrors.region}
                                    onValChange={(val) => {
                                        permanentAddress?.setRegion(val);
                                    }}>
                                        <Option value="">Please Select a Region</Option>
                                        {
                                            permanentAddress.regions?.map((region, index) => {
                                                return (
                                                    <Option value={optionValue(region.reg_code, region.name)} key={index}>{region.name}</Option>
                                                )
                                            }) 
                                        }
                                    </Select>
                                    <Select
                                    value={permanentAddress.values.province}
                                    disabled={!permanentAddress.values.region || isUpdatingLocalPermanentAddress} placeholder="Province" 
                                    error={localPermanentInputErrors.province}
                                    onValChange={(val) => {
                                        permanentAddress?.setProvince(val)
                                    }}>
                                        <Option value="">Please Select a Province</Option>
                                        {
                                            permanentAddress.provinces?.map((province, index) => {
                                                return (
                                                    <Option value={optionValue(province.prov_code, province.name)} key={index}>{province.name}</Option>
                                                )
                                            }) 
                                        }
                                    </Select>
                                    <Select 
                                    value={permanentAddress.values.cityMun}
                                    disabled={!permanentAddress.values.province || isUpdatingLocalPermanentAddress} placeholder="City / Municipality" 
                                    error={localPermanentInputErrors.cityOrMunicipality}
                                    onValChange={(val) => {
                                        permanentAddress.setCityMun(val)
                                    }}>
                                        <Option value="">Please Select a Region</Option>
                                        {
                                            permanentAddress.cityMun?.map((cityMun, index) => {
                                                return (
                                                    <Option value={optionValue(cityMun.mun_code, cityMun.name)} key={index}>{cityMun.name}</Option>
                                                )
                                            }) 
                                        }
                                    </Select>
                                    <Select 
                                    value={permanentAddress.values.barangay}
                                    disabled={!permanentAddress.values.cityMun || isUpdatingLocalPermanentAddress} placeholder="Barangay" 
                                    error={localPermanentInputErrors.barangay}
                                    onValChange={(val) => {
                                        permanentAddress.setBarangay(val)
                                    }}>
                                        <Option value="">Please Select a Barangay</Option>
                                        {
                                            permanentAddress.barangay?.map((barangay, index) => {
                                                return (
                                                    <Option value={barangay.name} key={index}>{barangay.name}</Option>
                                                )
                                            }) 
                                        }
                                    </Select>
                                    <div className="btn-submit-area">
                                        <Button 
                                        disabled={!(isReadyLocalPermanentAddress) || isUpdatingLocalPermanentAddress} 
                                        label="Update permanent Address" color="edit" 
                                        onClick={() => submitLocalPermanentAddressUpdate? submitLocalPermanentAddressUpdate(memberInformation.member_uid, 
                                            (data) => {
                                                addSnackBar("Update success", "success", 5);
                                                permanentAddress.setRegion(null);
                                                setPermanentAddressValue(`${data.region}: ${data.barangay}, ${data.cityOrMunicipality}, ${data.province}`)
                                            }): null
                                        } />
                                    </div>
                                    </> : <>
                                        <Input disabled={isUpdatingOutsidePermanentAddress} value={outsidePermanentAddressValues.address as string} type="text" error={outsidePermanentInputErrors.address} placeholder="Specify your complete address outside PH" label="Complete Address" onValChange={(e) => outsidePermanentAddressInput.address(e as string)}/>
                                        <div className="btn-submit-area">
                                            <Button 
                                            disabled={!(isReadyOutsidePermanentAddress) || isUpdatingOutsidePermanentAddress} 
                                            label="Update permanent Address" 
                                            color="edit" 
                                            onClick={() => submitOutsidePermanentAddressUpdate? submitOutsidePermanentAddressUpdate(memberInformation.member_uid, (data) => {
                                                addSnackBar("Update success", "success", 5);
                                                setPermanentAddressValue(data);
                                            }): null} />
                                        </div>
                                    </>
                                }
                                
                                <Devider $orientation="horizontal" $flexItem $css="flex: 0 1 100%" />
                                <h1>Current address:</h1>
                                <div className="row">
                                    <DataDisplayChip variant="outlined" icon={<FontAwesomeIcon icon={["fas", "map-marker-alt"]} />}>{currentAddressValue}</DataDisplayChip>
                                </div>
                                <div className="row">
                                    <Input disabled={isUpdatingLocalCurrentAddress} checked={outsidePHCurrentAddress} type="checkbox" placeholder="Outside Philippines" label="Outside Philippines?" onValChange={(val) => {
                                        const v = val as boolean;
                                        updateOutsidePHCurrentAddress(v)}
                                    }/>
                                </div>
                                {
                                    !outsidePHCurrentAddress? <>
                                    <Select 
                                    value={currentAddress.values.region}
                                    disabled={isUpdatingLocalCurrentAddress} placeholder="Region" 
                                    error={localCurrentInputErrors.region}
                                    onValChange={(val) => {
                                        currentAddress?.setRegion(val);
                                    }}>
                                        <Option value="">Please Select a Region</Option>
                                        {
                                            currentAddress.regions?.map((region, index) => {
                                                return (
                                                    <Option value={optionValue(region.reg_code, region.name)} key={index}>{region.name}</Option>
                                                )
                                            }) 
                                        }
                                    </Select>
                                    <Select
                                    value={currentAddress.values.province}
                                    disabled={!currentAddress.values.region || isUpdatingLocalCurrentAddress} placeholder="Province" 
                                    error={localCurrentInputErrors.province}
                                    onValChange={(val) => {
                                        currentAddress?.setProvince(val)
                                    }}>
                                        <Option value="">Please Select a Province</Option>
                                        {
                                            currentAddress.provinces?.map((province, index) => {
                                                return (
                                                    <Option value={optionValue(province.prov_code, province.name)} key={index}>{province.name}</Option>
                                                )
                                            }) 
                                        }
                                    </Select>
                                    <Select 
                                    value={currentAddress.values.cityMun}
                                    disabled={!currentAddress.values.province || isUpdatingLocalCurrentAddress} placeholder="City / Municipality" 
                                    error={localCurrentInputErrors.cityOrMunicipality}
                                    onValChange={(val) => {
                                        currentAddress.setCityMun(val)
                                    }}>
                                        <Option value="">Please Select a Region</Option>
                                        {
                                            currentAddress.cityMun?.map((cityMun, index) => {
                                                return (
                                                    <Option value={optionValue(cityMun.mun_code, cityMun.name)} key={index}>{cityMun.name}</Option>
                                                )
                                            }) 
                                        }
                                    </Select>
                                    <Select 
                                    value={currentAddress.values.barangay}
                                    disabled={!currentAddress.values.cityMun || isUpdatingLocalPermanentAddress} placeholder="Barangay" 
                                    error={localCurrentInputErrors.barangay}
                                    onValChange={(val) => {
                                        currentAddress.setBarangay(val)
                                    }}>
                                        <Option value="">Please Select a Barangay</Option>
                                        {
                                            currentAddress.barangay?.map((barangay, index) => {
                                                return (
                                                    <Option value={barangay.name} key={index}>{barangay.name}</Option>
                                                )
                                            }) 
                                        }
                                    </Select>
                                    <div className="btn-submit-area">
                                        <Button 
                                        disabled={!(isReadyLocalCurrentAddress) || isUpdatingLocalCurrentAddress} 
                                        label="Update permanent Address" color="edit" 
                                        onClick={() => submitLocalCurrentAddressUpdate? submitLocalCurrentAddressUpdate(memberInformation.member_uid, 
                                            (data) => {
                                                addSnackBar("Update success", "success", 5);
                                                currentAddress.setRegion(null);
                                                setCurrentAddressValue(`${data.region}: ${data.barangay}, ${data.cityOrMunicipality}, ${data.province}`)
                                            }): null
                                        } />
                                    </div>
                                    </> : <>
                                        <Input disabled={isUpdatingOutsideCurrentAddress} value={outsideCurrentAddressValues.address as string} type="text" error={outsideCurrentInputErrors.address} placeholder="Specify your complete address outside PH" label="Complete Address" onValChange={(e) => outsideCurrentAddressInput.address(e as string)}/>
                                        <div className="btn-submit-area">
                                            <Button 
                                            disabled={!(isReadyOutsideCurrentAddress) || isUpdatingOutsideCurrentAddress} 
                                            label="Update permanent Address" 
                                            color="edit" 
                                            onClick={() => submitOutsideCurrentAddressUpdate? submitOutsideCurrentAddressUpdate(memberInformation.member_uid, (data) => {
                                                addSnackBar("Update success", "success", 5);
                                                setCurrentAddressValue(data);
                                            }): null} />
                                        </div>
                                    </>
                                }
                                </>
                            }     
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