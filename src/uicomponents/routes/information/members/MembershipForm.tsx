import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";

//API import 
import { useAddMemberRecordMutation } from "../../../../global-state/api/api";
// import usePhilippinePlacesPicker from "../../../../utils/hooks/usePhilippinePlacesPicker";
import usePhilippinePlacesPickerSelect, { optionValue } from "../../../../utils/hooks/usePhilippinePlacePickerSelect";

import Devider from "../../../reusables/devider";
import SiteMap from "../../SiteMap";
import GoBackBtn from "../../../GoBackBtn";
import Input from "../../../reusables/Inputs/Input";
import Select, { Option } from "../../../reusables/Inputs/Select";
import Revealer from "../../../reusables/Revealer";
import IconInput from "../../../reusables/Inputs/IconInput";
import DynamicAvatarList from "../../../reusables/DynamicAvatarList";
import AvatarGroup from "../../../reusables/AvatarGroup";
import UseRipple from "../../../reusables/Ripple/UseRipple";
import Button from "../../../reusables/Buttons/Button";
import PHCPNumberInput from "../../../reusables/Inputs/PHCPNumberInput";
import PHTelNumberInput from "../../../reusables/Inputs/PHTelNumberInput";

//Custom Hooks
import useFormControl from "../../../../utils/hooks/useFormControl";
import { IStyledFC } from "../../../IStyledFC";

//Input Validators
import validatePHNumber from "../../../../utils/inputValidators/validators/validatePHNumber";
import validatePHTelephone from "../../../../utils/inputValidators/validators/validatePHTelNumber";

const FCAddressBox: React.FC<IStyledFC> = ({className, children}) => {
    return (
        <div className={className}>
            <p>{children}</p>
        </div>
    )
}

const AddMembershipBtn = styled(UseRipple)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    width: 30px;
    font-size: 11px;
    color: ${({theme}) => theme.textColor.strong};
    border-radius: 50%;
    background-color: ${({theme}) => theme.background.light};
    cursor: pointer;
    
`

const AddressBox = styled(FCAddressBox)`
    display: flex;
    flex: 0 1 100%;
    align-items: center;
    padding-left: 10px;
    background-color: ${({theme}) => theme.background.light};
    height: 35px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 400;
    color:  ${({theme}) => theme.textColor.strong};
    border:  2px solid ${({theme}) => theme.borderColorStrong};
    transition: background-color 400ms linear;
    min-width: 0;

    & p {
        flex: 1;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const ContentWraper = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    flex-wrap: wrap;
    padding: 15px 5px;
    min-width: 0;

    & #membershipForm {
        display: flex;
        flex-wrap: wrap;
        flex: 0 1 100%;
        padding: 15px;
        height: fit-content;
        background-color:  ${({theme}) => theme.background.primary};
        /* box-shadow: 3px 3px 5px 1px rgb(0 0 0 / 5%); */
        min-width: 0;
    }

    & #membershipForm .information-category-title {
        flex: 0 1 100%;
        height: fit-content;
        text-align: center;
        border-bottom: 1px solid ${({theme}) => theme.borderColor};
        padding-bottom: 5px;
        margin-bottom: 15px;
        color: ${({theme}) => theme.textColor.strong};
    }

    & #membershipForm .data-category {
        display: flex;
        flex: 0 1 100%;
        align-items: center;
        padding: 10px 0;
        min-width: 0;
    }

    & #membershipForm .data-category .data-category-title-container,
    & #membershipForm .data-category .input-category-group {
        display: flex;
        flex: 0 0 75px;
        height: 55px;
    }
    
    & #membershipForm .data-category .data-category-title-container {
        background-color: ${({theme}) => theme.background.light};
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    & #membershipForm .data-category .data-category-title-container p {
        font-size: 11px;
        text-align: center;
    }

    & #membershipForm .full-name-group .data-category-title-container {
        background-color: #019aff33;
        color: #4bb2f7;
    }

    & #membershipForm .birth-date-group .data-category-title-container {
        background-color: #ffb72f75;
        color: #ffac1f;
    }

    & #membershipForm .gender-group .data-category-title-container {
        background-color: #f696fc52;
        color: #ee3ff9;
    }

    & #membershipForm .marital-status-group .data-category-title-container {
        background-color: #fd151547;
        color: #f74a4a;
    }

    & #membershipForm .address-group .data-category-title-container,
     & #membershipForm .ministry-group .data-category-title-container {
        background-color: #2dff7636;
        color: #23c703;
    }

    & #membershipForm .current-address-group .data-category-title-container {
        background-color: #0beed930;
        color: #0beed9;
    }

    & #membershipForm .contact-group .data-category-title-container {
        background-color: #4706a13d;
        color: #9245ff;
    }

    & #membershipForm .date-of-baptism-group .data-category-title-container {
        background-color: #8b088a59;
        color: #cd28cc;
    }

    & #membershipForm .organization-group .data-category-title-container {
        background-color: #00bcd43d;
        color: #27e7ff;
    }

    & #membershipForm .data-category .input-category-group {
        display: flex;
        flex-wrap: wrap;
        flex: 0 1 100%;
        height: fit-content;
        min-width: 0;
    }

    & #membershipForm .data-category .input-category-group ${Input},
    & #membershipForm .data-category .input-category-group ${Select},
    & #membershipForm .address-group .input-category-group ${AddressBox} {
        margin-left: 10px;
    }

    & #membershipForm .data-category .input-category-group ${IconInput},
    & #membershipForm .data-category .input-category-group ${PHCPNumberInput},
    & #membershipForm .data-category .input-category-group ${PHTelNumberInput} {
        margin: 10px 0 10px 10px;
    }
    
    & #membershipForm .address-group .input-category-group ${Revealer},
    & #membershipForm .date-of-baptism-group .input-category-group ${Revealer} {
        margin: 0 10px; 
    }

    & #membershipForm .address-group .input-category-group ${Revealer} ${Select},
    & #membershipForm .date-of-baptism-group .input-category-group ${Revealer} ${Input},
    & #membershipForm .current-address-group .input-category-group ${Select} {
        flex: 0 1 100%;
        margin: 10px 0 25px 10px;
    }

    & #membershipForm .organization-group .input-category-group .organization-avatar-container,
    & #membershipForm .ministry-group .input-category-group .ministry-avatar-container {
        display: flex;
        flex: 1;
    }

    & #membershipForm .submit-button-container {
        display: flex;
        flex: 0 1 100%;
        gap: 5px;
    }

    & #membershipForm .submit-button-container ${Button}:first-child {
        margin-left: auto;
    }
`;

const MembershipForm: React.FC = ({}) => {
    const [addMemberRecord, {isLoading, isError, isSuccess}] = useAddMemberRecordMutation();

    const [dob, setDob] = React.useState<null | string>(null);
    const [doBap, setDoBap] = React.useState<null | string>(null);
    const [sameAsCurrentAddress, updateSameAsCurrentAddress] = React.useState(false);
    const [isBaptised, updateIsBaptised] = React.useState(true);
    const [formIsReadyState, updateFormIsReadyState] = React.useState(false);
    const [form, formDispatcher] = useFormControl({
        firstName: {
            required: true,
            minValLen: 3,
            maxValLen: 15,
            errorText: 'Invalid Entry',
            validateAs: 'text',
        },
        middleName: {
            required: false,
            errorText: 'Invalid Entry',
            validateAs: 'text',
            minValLen: 5,
            maxValLen: 25,
        },
        surName: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'text',
            minValLen: 5,
            maxValLen: 25,
        },
        extName: {
            required: false,
            errorText: 'Invalid Entry',
            validateAs: 'select',
            validValues: ['jr', 'sr']
        },
        dateOfBirth: {
            required: true,
            errorText: 'Invalid Date',
            max: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
            validateAs: 'date',
        },
        gender: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'select',
            validValues: ['male', 'female']
        },
        maritalStatus: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'select',
            validValues: ['married', 'widowed', 'divorced', 'separated', 'single']
        },
        region: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'select'
        },
        province: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'select'
        },
        cityOrMunicipality: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'select'
        },
        barangay: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'select'
        },
        email: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'email'
        },
        cpNumber: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: "number",
            validators: [validatePHNumber]
        },
        telephoneNumber: {
            required: false,
            errorText: 'Invalid Entry',
            validateAs: "number",
            validators: [validatePHTelephone]
        }
    });

    const [permanentAddressForm, permanentAddressFormValueDispatchers] = useFormControl({
        region: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'select'
        },
        province: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'select'
        },
        cityOrMunicipality: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'select'
        },
        barangay: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'select'
        }
    });
    
    const [dateOfBaptismForm, dateOfBaptismFormDispatcher] = useFormControl({
        dateOfBaptism: {
            required: true,
            errorText: 'Invalid Date',
            validateAs: 'date',
        },
    });

    const currentAddress = usePhilippinePlacesPickerSelect(
        (region) => formDispatcher?.region(region),
        (province) => formDispatcher?.province(province),
        (cityMun) => formDispatcher?.cityOrMunicipality(cityMun),
        (barangay) => formDispatcher?.barangay(barangay)
    );

    const permanentAddress = usePhilippinePlacesPickerSelect(
        (region) => permanentAddressFormValueDispatchers?.region(region),
        (province) => permanentAddressFormValueDispatchers?.province(province),
        (cityMun) => permanentAddressFormValueDispatchers?.cityOrMunicipality(cityMun),
        (barangay) => permanentAddressFormValueDispatchers?.barangay(barangay)
    );


    React.useEffect(() => {
        if(
            //Form must be field up w/o errors same to other forms
            //when same as current address is not checked? permanent address form must be fieldup. 
            //also, when is baptised is checked? date of baptism must be fieldup
            //but when is baptised is not checked? date of baptism is not required to be fieldup.
            //when same as current address is checked? permanent address form is not required to be fieldup.
            form.isReady && (!(sameAsCurrentAddress) && permanentAddressForm.isReady) && (isBaptised && dateOfBaptismForm.isReady)
            || form.isReady && (!(sameAsCurrentAddress) && permanentAddressForm.isReady) && !isBaptised
            || form.isReady && sameAsCurrentAddress && (isBaptised && dateOfBaptismForm.isReady)
            || form.isReady && sameAsCurrentAddress && !isBaptised
        )
        {
           updateFormIsReadyState(true);
        } else updateFormIsReadyState(false)
    }, [form.isReady, permanentAddressForm.isReady, dateOfBaptismForm.isReady, isBaptised, sameAsCurrentAddress]);

    React.useEffect(() => {
        console.log(form.values)
    }, [form.values]);

    React.useEffect(() => {
        formDispatcher?.dateOfBirth(dob)
    }, [dob]);
    
    React.useEffect(() => {
        dateOfBaptismFormDispatcher?.dateOfBaptism(doBap)
    }, [doBap])
    return (
        <RouteContentBase>
            <RouteContentBaseHeader>
                <strong>Membership Form</strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    / <Link to='/information'> information</Link>  / <Link to='/information/members'> members</Link>
                </SiteMap>
                <GoBackBtn />
            </RouteContentBaseHeader>
            <RouteContentBaseBody>
                <ContentWraper>
                    <div id="membershipForm">
                        <strong className="information-category-title">Personal Information</strong>
                        <div className="data-category full-name-group">
                            <span className="data-category-title-container">
                                <FontAwesomeIcon icon={["fas", "user"]} />
                                <p>Full Name</p>
                            </span>
                            <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                            <div className="input-category-group">
                                <Input disabled={isLoading} value={form.values.firstName as string} name="first-name" placeholder="First Name"  type="text" error={form.errors.firstName} onValChange={(val) => formDispatcher?.firstName(val)} />
                                <Input disabled={isLoading} value={form.values.middleName as string} name="middle-name" placeholder="Middle Name"  type="text" error={form.errors.middleName} onValChange={(val) => formDispatcher?.middleName(val)}  />
                                <Input disabled={isLoading} value={form.values.surName as string} name="sur-name" placeholder="Sur Name"  type="text" error={form.errors.surName} onValChange={(val) => formDispatcher?.surName(val)}  />
                                <Select placeholder="Ex. Name" error={form.errors.extName} onValChange={(val) => formDispatcher?.extName(val)}>
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
                            <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                            <div className="input-category-group">
                                <Input disabled={isLoading} value={dob? dob : ""} name="date-of-birth" type="date" placeholder="Date of Birth" error={form.errors.dateOfBirth} onValChange={(val) => setDob(val as string)} />
                                {/* <input type="date" value={dob} onChange={(e) => setDob(e.target.value)}/> */}
                            </div>
                        </div>
                        <div className="data-category gender-group">
                            <span className="data-category-title-container">
                                <FontAwesomeIcon icon={["fas", "venus-mars"]} />
                                <p>Gender</p>
                            </span>
                            <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                            <div className="input-category-group">
                                <Select value={form.values.gender as string} placeholder="Gender" error={form.errors.gender} onValChange={(val) => formDispatcher?.gender(val)}>
                                    <Option value="">Please select</Option>
                                    <Option value="male">Male</Option>
                                    <Option value="female">Female</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="data-category marital-status-group">
                            <span className="data-category-title-container">
                                <FontAwesomeIcon icon={["fas", "heart"]} />
                                <p>Marital Status</p>
                            </span>
                            <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                            <div className="input-category-group">
                                <Select value={form.values.maritalStatus as string} placeholder="Marital Status" error={form.errors.maritalStatus} onValChange={(val) => formDispatcher?.maritalStatus(val)}>
                                    <Option value="">Please select</Option>
                                    <Option value="single">Single</Option>
                                    <Option value="married">Married</Option>
                                    <Option value="widowed">Widowed</Option>
                                    <Option value="divorced">Divorced</Option>
                                    <Option value="separated">Separated</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="data-category current-address-group">
                            <span className="data-category-title-container">
                                <FontAwesomeIcon icon={["fas", "map-location-dot"]} />
                                <p>Current Address</p>
                            </span>
                            <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                            <div className="input-category-group">
                                <Select placeholder="Region" 
                                error={form.errors.region}
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
                                <Select disabled={!currentAddress.values.region} placeholder="Province" 
                                error={form.errors.province}
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
                                <Select disabled={!currentAddress.values.province} placeholder="City / Municipality" 
                                error={form.errors.cityOrMunicipality}
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
                                <Select disabled={!currentAddress.values.cityMun} placeholder="Barangay" 
                                error={form.errors.barangay}
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
                            </div>
                        </div>
                        <div className="data-category address-group">
                            <span className="data-category-title-container">
                                <FontAwesomeIcon icon={["fas", "map-location-dot"]} />
                                <p>Permanent Address</p>
                            </span>
                            <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                            <div className="input-category-group">
                                <Input disabled={isLoading} checked={sameAsCurrentAddress} type="checkbox" placeholder="same as current address" label="Same as Current Address?" onValChange={(val) => {
                                    const v = val as boolean;
                                    updateSameAsCurrentAddress(v)}
                                }/>
                                <Revealer reveal={!sameAsCurrentAddress}>
                                    <Select placeholder="Region" 
                                    error={permanentAddressForm.errors.region}
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
                                    <Select disabled={!permanentAddress.values.region} placeholder="Province" 
                                    error={permanentAddressForm.errors.province}
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
                                    <Select disabled={!permanentAddress.values.province} placeholder="City / Municipality" 
                                    error={permanentAddressForm.errors.cityOrMunicipality}
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
                                    <Select disabled={!permanentAddress.values.cityMun} placeholder="Barangay" 
                                    error={permanentAddressForm.errors.barangay}
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
                                </Revealer>
                                {
                                    sameAsCurrentAddress && (form.values.region && form.values.province && form.values.cityOrMunicipality && form.values.barangay)? <AddressBox>{`${form.values.barangay}, ${form.values.cityOrMunicipality}, ${form.values.province}, ${form.values.region}`}</AddressBox> : ''
                                }
                            </div>
                        </div>
                        <div className="data-category contact-group">
                            <span className="data-category-title-container">
                                <FontAwesomeIcon icon={["fas", "map-location-dot"]} />
                                <p>Contact</p>
                            </span>
                            <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                            <div className="input-category-group">
                                <IconInput disabled={isLoading} value={form.values.email as string} type="email" placeholder="Email Address" error={form.errors.email} onValChange={(e) => formDispatcher?.email(e)} icon={<FontAwesomeIcon icon={["fas", "at"]} />} />
                                <PHCPNumberInput disabled={isLoading} value={form.values.cpNumber as string} placeholder="Mobile Number" error={form.errors.cpNumber} onChange={(e) => formDispatcher?.cpNumber(e)} icon={<FontAwesomeIcon icon={["fas", "mobile-alt"]} />} />
                                <PHTelNumberInput disabled={isLoading} value={form.values.telephoneNumber as string} placeholder="Mobile Number" error={form.errors.telephoneNumber} onChange={(e) => formDispatcher?.telephoneNumber(e)} icon={<FontAwesomeIcon icon={["fas", "phone-alt"]} />} />
                                {/* <IconInput value={form.values.telephoneNumber as number} type="number" placeholder="Telephone" error={form.errors.telephoneNumber} onValChange={(e) => formDispatcher?.telephoneNumber(e)} icon={<FontAwesomeIcon icon={["fas", "phone-alt"]} />} /> */}
                            </div>
                        </div>
                        <strong className="information-category-title">Baptism Information</strong>
                        <div className="data-category date-of-baptism-group">
                            <span className="data-category-title-container">
                                <FontAwesomeIcon icon={["fas", "place-of-worship"]} />
                                <p>Baptism</p>
                            </span>
                            <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                            <div className="input-category-group">
                                <Input disabled={isLoading} checked={isBaptised} type="checkbox" placeholder="" label="Is Baptised" onValChange={(val) => {
                                    const v = val as boolean;
                                    updateIsBaptised(v)}
                                }/>
                                <Revealer reveal={isBaptised}>
                                    <Input disabled={isLoading} value={doBap? doBap : ""} name="date-of-baptism" type="date" placeholder="Date of Baptism" error={dateOfBaptismForm.errors.dateOfBaptism} onValChange={(val) => setDoBap(val as string)} />
                                </Revealer>
                            </div>
                        </div>
                        {/* <strong className="information-category-title">Organization & Ministry</strong>
                        <div className="data-category ministry-group">
                            <span className="data-category-title-container">
                                <FontAwesomeIcon icon={["fas", "hand-holding-heart"]} />
                                <p>Ministry</p>
                            </span>
                            <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                            <div className="input-category-group">
                                <div className="ministry-avatar-container">
                                    <AvatarGroup size='30px' avatars={[
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                    ]} limit={5}/>
                                    <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                                    <AddMembershipBtn><FontAwesomeIcon icon={["fas", "plus"]} /></AddMembershipBtn>
                                </div>
                            </div>
                        </div>
                        <div className="data-category organization-group">
                            <span className="data-category-title-container">
                                <FontAwesomeIcon icon={["fas", "people-group"]} />
                                <p>Organization</p>
                            </span>
                            <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                            <div className="input-category-group">
                                <div className="organization-avatar-container">
                                    <AvatarGroup size='30px' avatars={[
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                        {alt: 'radio'},
                                    ]} limit={5}/>
                                    0 Selected
                                    <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                                    <AddMembershipBtn><FontAwesomeIcon icon={["fas", "plus"]} /></AddMembershipBtn>
                                </div>
                            </div>
                        </div> */}
                        <Devider $orientation="horizontal"  $css="margin: 0 5px" />
                        <div className="submit-button-container">
                            <Button label="Clear Form" variant="standard" color="theme" onClick={(e) => {
                                form.clear();
                                setDob(null);
                                setDoBap(null);
                                permanentAddressForm.clear();
                                permanentAddress.setRegion(null);
                                currentAddress.setRegion(null);
                                addMemberRecord({name: "apple"})
                            }}/>
                            <Button label="Add Member" icon={<FontAwesomeIcon icon={["fas", "plus"]} />} variant="standard" color="primary" disabled={!formIsReadyState} />
                        </div>
                    </div>
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
    )
}

export default MembershipForm;