import React from "react";
import { Renderer } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";

import usePhilippinePlacesPicker from "../../../../utils/hooks/usePhilippinePlacesPicker";

import Devider from "../../../reusables/devider";
import { SiteMap } from "../Information";
import GoBackBtn from "../../../GoBackBtn";
import Input from "../../../reusables/Inputs/Input";
import Select, { Option } from "../../../reusables/Inputs/Select";
import Revealer from "../../../reusables/Revealer";
import IconInput from "../../../reusables/Inputs/IconInput";
import DynamicAvatarList from "../../../reusables/DynamicAvatarList";
import AvatarGroup from "../../../reusables/AvatarGroup";
import UseRipple from "../../../reusables/Ripple/UseRipple";
import Button from "../../../reusables/Buttons/Button";

//Custom Hooks
import useFormControl from "../../../../utils/hooks/useFormControl";
import { IStyledFC } from "../../../IStyledFC";

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
        flex: 0 1 800px;
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

    & #membershipForm .data-category .input-category-group ${IconInput} {
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
    }

    & #membershipForm .submit-button-container ${Button} {
        margin-left: auto;
    }
`;

const MembershipForm: React.FC = ({}) => {
    const philippinePlaces = usePhilippinePlacesPicker();
    const philippinePlacesForPermanentAddress = usePhilippinePlacesPicker();
    const [sameAsCurrentAddress, updateSameAsCurrentAddress] = React.useState(false);
    const [isBaptised, updateIsBaptised] = React.useState(false);
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
            maxValLen: 6,
        },
        surName: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'text',
            minValLen: 5,
            maxValLen: 6,
        },
        extName: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'select',
            validValues: ['jr', 'sr']
        },
        dateOfBirth: {
            required: true,
            errorText: 'Invalid Date',
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
        cityOrMunincipality: {
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
        }
    });

    const [permanentAddressForm, permanentAddressFormDispatchers] = useFormControl({
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
        cityOrMunincipality: {
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
    
    React.useEffect(() => {
       console.log(philippinePlaces.regions)
    }, [])
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
                                <Input name="first-name" placeholder="First Name"  type="text" error={form.errors.firstName} onValChange={(val) => formDispatcher?.firstName(val)} />
                                <Input name="middle-name" placeholder="Middle Name"  type="text" error={form.errors.middleName} onValChange={(val) => formDispatcher?.middleName(val)}  />
                                <Input name="sur-name" placeholder="Sur Name"  type="text" error={form.errors.surName} onValChange={(val) => formDispatcher?.surName(val)}  />
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
                                <Input name="date-of-birth" type="date" placeholder="Date of Birth" error={form.errors.dateOfBirth} onValChange={(val) => formDispatcher?.dateOfBirth(val)} />
                            </div>
                        </div>
                        <div className="data-category gender-group">
                            <span className="data-category-title-container">
                                <FontAwesomeIcon icon={["fas", "venus-mars"]} />
                                <p>Gender</p>
                            </span>
                            <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                            <div className="input-category-group">
                                <Select placeholder="Gender" error={form.errors.gender} onValChange={(val) => formDispatcher?.gender(val)}>
                                    <Option value="">Please select</Option>
                                    <Option value="male">Male</Option>
                                    <Option selected value="female">Female</Option>
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
                                <Select placeholder="Marital Status" error={form.errors.maritalStatus} onValChange={(val) => formDispatcher?.maritalStatus(val)}>
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
                                    formDispatcher?.region(val);
                                }}>
                                    <Option callBackFC={() => philippinePlaces.setRegionCode(null)} value="">Please Select a Region</Option>
                                    {
                                        philippinePlaces.regions.map((regions, index) => {
                                            return (
                                                <Option callBackFC={() => philippinePlaces.setRegionCode(regions.reg_code)} value={regions.name} key={index}>{regions.name}</Option>
                                            )
                                        }) 
                                    }
                                </Select>
                                <Select disabled={philippinePlaces.regionCode? false : true} placeholder="Province" 
                                error={form.errors.province}
                                onValChange={(val) => {
                                    formDispatcher?.province(val)
                                }}>
                                    <Option callBackFC={() => philippinePlaces.setProvinceCode(null)} value="">Please Select a Province</Option>
                                    {
                                        philippinePlaces.provinces?.map((province, index) => {
                                            return (
                                                <Option callBackFC={() => philippinePlaces.setProvinceCode(province.prov_code)} value={province.name} key={index}>{province.name}</Option>
                                            )
                                        }) 
                                    }
                                </Select>
                                <Select disabled={philippinePlaces.provinceCode? false : true} placeholder="City / Municipality" 
                                error={form.errors.cityOrMunincipality}
                                onValChange={(val) => {
                                    formDispatcher?.cityOrMunincipality(val)
                                }}>
                                    <Option callBackFC={() => philippinePlaces.setCityMunCode(null)} value="">Please Select a Region</Option>
                                    {
                                        philippinePlaces.cityMun?.map((cityMun, index) => {
                                            return (
                                                <Option callBackFC={() => philippinePlaces.setCityMunCode(cityMun.mun_code)} value={cityMun.name} key={index}>{cityMun.name}</Option>
                                            )
                                        }) 
                                    }
                                </Select>
                                <Select disabled={philippinePlaces.cityMunCode? false : true} placeholder="Barangay" 
                                error={form.errors.barangay}
                                onValChange={(val) => {
                                    formDispatcher?.barangay(val)
                                }}>
                                    <Option value="">Please Select a Barangay</Option>
                                    {
                                        philippinePlaces.barangay?.map((barangay, index) => {
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
                                <Input type="checkbox" placeholder="hEY" label="Same as Current Address?" onValChange={(val) => {
                                    const v = val as boolean;
                                    updateSameAsCurrentAddress(v)}
                                }/>
                                <Revealer reveal={!sameAsCurrentAddress}>
                                    <Select placeholder="Region" 
                                    error={permanentAddressForm.errors.region}
                                    onValChange={(val) => {
                                        permanentAddressFormDispatchers?.region(val);
                                    }}>
                                        <Option callBackFC={() => philippinePlacesForPermanentAddress.setRegionCode(null)} value="">Please Select a Region</Option>
                                        {
                                            philippinePlacesForPermanentAddress.regions.map((regions, index) => {
                                                return (
                                                    <Option callBackFC={() => philippinePlacesForPermanentAddress.setRegionCode(regions.reg_code)} value={regions.name} key={index}>{regions.name}</Option>
                                                )
                                            }) 
                                        }
                                    </Select>
                                    <Select disabled={philippinePlacesForPermanentAddress.regionCode? false : true} placeholder="Province" 
                                    error={permanentAddressForm.errors.province}
                                    onValChange={(val) => {
                                        permanentAddressFormDispatchers?.province(val)
                                    }}>
                                        <Option callBackFC={() => philippinePlacesForPermanentAddress.setProvinceCode(null)} value="">Please Select a Province</Option>
                                        {
                                            philippinePlacesForPermanentAddress.provinces?.map((province, index) => {
                                                return (
                                                    <Option callBackFC={() => philippinePlacesForPermanentAddress.setProvinceCode(province.prov_code)} value={province.name} key={index}>{province.name}</Option>
                                                )
                                            }) 
                                        }
                                    </Select>
                                    <Select disabled={philippinePlacesForPermanentAddress.provinceCode? false : true} placeholder="City / Municipality" 
                                    error={permanentAddressForm.errors.cityOrMunincipality}
                                    onValChange={(val) => {
                                        permanentAddressFormDispatchers?.cityOrMunincipality(val)
                                    }}>
                                        <Option callBackFC={() => philippinePlacesForPermanentAddress.setCityMunCode(null)} value="">Please Select a Region</Option>
                                        {
                                            philippinePlacesForPermanentAddress.cityMun?.map((cityMun, index) => {
                                                return (
                                                    <Option callBackFC={() => philippinePlacesForPermanentAddress.setCityMunCode(cityMun.mun_code)} value={cityMun.name} key={index}>{cityMun.name}</Option>
                                                )
                                            }) 
                                        }
                                    </Select>
                                    <Select disabled={philippinePlacesForPermanentAddress.cityMunCode? false : true} placeholder="Barangay" 
                                    error={permanentAddressForm.errors.barangay}
                                    onValChange={(val) => {
                                        permanentAddressFormDispatchers?.barangay(val)
                                    }}>
                                        <Option value="">Please Select a Barangay</Option>
                                        {
                                            philippinePlacesForPermanentAddress.barangay?.map((barangay, index) => {
                                                return (
                                                    <Option value={barangay.name} key={index}>{barangay.name}</Option>
                                                )
                                            }) 
                                        }
                                    </Select>
                                </Revealer>
                                {
                                    sameAsCurrentAddress? <AddressBox>Sandiat West, San Manuel Isabela, Region II (CAGAYAN VALLEY) dvsdvsdvsvd</AddressBox> : ''
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
                                <IconInput type="email" placeholder="Email Address" error={form.errors.email} onValChange={(e) => formDispatcher?.email(e)} icon={<FontAwesomeIcon icon={["fas", "at"]} />} />
                                <IconInput type="number" placeholder="Mobile Number" onValChange={(e) => console.log(e)} icon={<FontAwesomeIcon icon={["fas", "mobile-alt"]} />} />
                                <IconInput type="number" placeholder="Phone" onValChange={(e) => console.log(e)} icon={<FontAwesomeIcon icon={["fas", "phone-alt"]} />} />
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
                                <Input type="checkbox" placeholder="" label="Not Yet Baptised?" onValChange={(val) => {
                                    const v = val as boolean;
                                    updateIsBaptised(v)}
                                }/>
                                <Revealer reveal={!isBaptised}>
                                    <Input name="date-of-baptism" type="date" placeholder="Date of Baptism" error={form.errors.dateOfBirth} onValChange={(val) => formDispatcher?.dateOfBirth(val)} />
                                </Revealer>
                            </div>
                        </div>
                        <strong className="information-category-title">Organization & Ministry</strong>
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
                                    <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                                    <AddMembershipBtn><FontAwesomeIcon icon={["fas", "plus"]} /></AddMembershipBtn>
                                </div>
                            </div>
                        </div>
                        <Devider $orientation="horizontal"  $css="margin: 0 5px" />
                        <div className="submit-button-container">
                            <Button label="Add Member" icon={<FontAwesomeIcon icon={["fas", "plus"]} />} variant="standard" color="primary" isLoading />
                        </div>
                    </div>
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
    )
}

export default MembershipForm;