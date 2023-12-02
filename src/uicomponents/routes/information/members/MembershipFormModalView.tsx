import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TInputVal } from "../../../../utils/hooks/useFormControl";

//API import 
import { useAddMemberRecordMutation } from "../../../../global-state/api/api";
// import usePhilippinePlacesPicker from "../../../../utils/hooks/usePhilippinePlacesPicker";
import usePhilippinePlacesPickerSelect, { optionValue } from "../../../../utils/hooks/usePhilippinePlacePickerSelect";

import Devider from "../../../reusables/devider";
import Input from "../../../reusables/Inputs/Input";
import Select, { Option } from "../../../reusables/Inputs/Select";
import Revealer from "../../../reusables/Revealer";
import IconInput from "../../../reusables/Inputs/IconInput";
import UseRipple from "../../../reusables/Ripple/UseRipple";
import Button from "../../../reusables/Buttons/Button";
import PHCPNumberInput from "../../../reusables/Inputs/PHCPNumberInput";
import PHTelNumberInput from "../../../reusables/Inputs/PHTelNumberInput";
import { AvatarUploaderComponent, useAvatarUploaderContext } from "../../../reusables/AvatarUploader/AvatarUploader";
import AvatarPicker from "../../../reusables/AvatarPicker/AvatarPicker";
import Alert from "../../../reusables/Alert";
import FullScreenSpinner from "../../../reusables/FullScreenSpinner";

//Custom Hooks
import useFormControl from "../../../../utils/hooks/useFormControl";
import { IStyledFC } from "../../../IStyledFC";
import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";

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

interface IFCMembershipForm extends IStyledFC {
    onLoading: () => void;
    onSuccess: () => void;
    onError: () => void;
}

const FCMembershipFormModalView: React.FC<IFCMembershipForm> = ({className, onLoading, onSuccess, onError}) => {
    
    const addSnackBar = useAddSnackBar()
    const [addMemberRecord, {data: addRecordTransactionFlag, isLoading, isError, isSuccess}] = useAddMemberRecordMutation();
    
    const [isUploadingDp, setIsUploadingDp] = React.useState(false);
    const [errorUploadingDp, setErrorUploadingDp] = React.useState(false);
    const [tempDpName, setTempDpName] = React.useState<null | string>(null); 
    const [disablePictureInput, setDisablePictureInput] = React.useState(false);
    const [resetDpInputValue, setResetDpInputValue] = React.useState(false);
    const [dob, setDob] = React.useState<null | string>(null);
    const [doBap, setDoBap] = React.useState<null | string>(null);
    const [isBaptised, updateIsBaptised] = React.useState(true);
    const [formIsReadyState, updateFormIsReadyState] = React.useState(false);
    const [formOnClear, setFormOnClear] = React.useState(false);
    const [addingMemberLoadingState, setAddingMemberLoadingState] = React.useState<"loading" | "done" | "close" | "error">("close");
    const [sameAsCurrentAddress, updateSameAsCurrentAddress] = React.useState(false);
    const [sameAsPermanetAddress, updateSameAsPermanentAddress] = React.useState(false);
    const [outsidePHPermanetAddress, updateOutsidePHPermanetAddress] = React.useState(false);
    const [outsidePHCurrentAddress, updateOutsidePHCurrentAddress] = React.useState(false);

    const [form, formValues, formDispatcher] = useFormControl({
        firstName: {
            required: true,
            minValLen: 3,
            maxValLen: 25,
            errorText: 'Invalid Entry',
            validateAs: 'text',
        },
        middleName: {
            required: true,
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
        email: {
            required: false,
            errorText: 'Invalid Entry',
            validateAs: 'email'
        },
        cpNumber: {
            required: false,
            errorText: 'Invalid Entry',
            validateAs: "number",
            validators: [validatePHNumber]
        },
        telephoneNumber: {
            required: false,
            errorText: 'Invalid Entry',
            validateAs: "number",
            validators: [validatePHTelephone]
        },
        avatar: {
            required: false,
            errorText: 'Invalid Entry',
            validateAs: 'text',
        }
    });

    const [homeContactInfoForm, homeContactInfoFormValues, homeContactInfoFormDispatchers] = useFormControl({
        email: {
            required: false,
            errorText: 'Invalid Entry',
            validateAs: 'email'
        },
        cpNumber: {
            required: false,
            errorText: 'Invalid Entry',
            validateAs: "number",
            validators: [validatePHNumber]
        },
        telephoneNumber: {
            required: false,
            errorText: 'Invalid Entry',
            validateAs: "number",
            validators: [validatePHTelephone]
        },
    })

    const [permanentAddressForm, permanentAddressFormValues, permanentAddressFormValueDispatchers] = useFormControl({
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
    
    const [currentAddressForm, currentAddressFormValues, currentAddressFormValueDispatcher] = useFormControl({
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
    });

    const [dateOfBaptismForm, dateOfBaptismFormValues, dateOfBaptismFormDispatcher] = useFormControl({
        dateOfBaptism: {
            required: true,
            errorText: 'Invalid Date',
            validateAs: 'date',
        },
    });

    const [outsidePHPermanentAdressForm, outsidePHPermanentAdressFormValues, updateOutsidePHPermanentAdressForm] = useFormControl({
        outsidePHPermanentAddress: {
            required: true,
            minValLen: 5,
            maxValLen: 300,
            errorText: 'Invalid Entry',
            validateAs: 'text',
        }
    });

    const [outsidePHCurrentAdressForm, outsidePHCurrentAdressFormValues, updateOutsidePHCurrentAdressForm] = useFormControl({
        outsidePHCurrentAddress: {
            required: true,
            minValLen: 5,
            maxValLen: 300,
            errorText: 'Invalid Entry',
            validateAs: 'text',
        }
    })

    const permanentAddress = usePhilippinePlacesPickerSelect(
        (region) => permanentAddressFormValueDispatchers({...permanentAddressFormValues, region}),
        (province) => permanentAddressFormValueDispatchers({...permanentAddressFormValues, province}),
        (cityMun) => permanentAddressFormValueDispatchers({...permanentAddressFormValues, cityOrMunicipality: cityMun}),
        (barangay) => permanentAddressFormValueDispatchers({...permanentAddressFormValues, barangay}),
    );

    const currentAddress = usePhilippinePlacesPickerSelect(
        (region) => currentAddressFormValueDispatcher({...currentAddressFormValues, region}),
        (province) => currentAddressFormValueDispatcher({...currentAddressFormValues, province}),
        (cityMun) => currentAddressFormValueDispatcher({...currentAddressFormValues, cityOrMunicipality: cityMun}),
        (barangay) => currentAddressFormValueDispatcher({...currentAddressFormValues, barangay}),
    );


    React.useEffect(() => {
        const personalInfoReady = form.isReady;
        const homeContactInfoReady = homeContactInfoForm.isReady;
        const permanentAddressReady = sameAsCurrentAddress? true : (outsidePHPermanetAddress? outsidePHPermanentAdressForm.isReady : permanentAddressForm.isReady);
        const currentAddressReady = sameAsPermanetAddress? true : (outsidePHCurrentAddress? outsidePHCurrentAdressForm.isReady : currentAddressForm.isReady);
        const dateOfBaptismReady = !isBaptised? true : dateOfBaptismForm.isReady;

        (personalInfoReady && homeContactInfoReady && permanentAddressReady && currentAddressReady && dateOfBaptismReady)? updateFormIsReadyState(true) : updateFormIsReadyState(false);

    }, [
        homeContactInfoForm.isReady,
        form.isReady, 
        permanentAddressForm.isReady, 
        currentAddressForm.isReady,  
        dateOfBaptismForm.isReady, 
        outsidePHPermanentAdressForm.isReady,
        outsidePHCurrentAdressForm.isReady,
        isBaptised, 
        sameAsCurrentAddress, 
        sameAsPermanetAddress,
        outsidePHPermanetAddress,
        outsidePHCurrentAddress
    ]);

    React.useEffect(() => {
       isSuccess && onSuccess();
       isError && onError();
       isLoading && onLoading();
       if(isSuccess) setAddingMemberLoadingState('done');
       if(isError) setAddingMemberLoadingState('error')
    }, [isLoading, isError, isSuccess])

    React.useEffect(() => {
        formDispatcher({...formValues, dateOfBirth: dob})
    }, [dob]);
    
    React.useEffect(() => {
        dateOfBaptismFormDispatcher({...dateOfBaptismFormValues, dateOfBaptism: doBap})
    }, [doBap]);

    React.useEffect(() => {
        currentAddress.setRegion(null);
        if(sameAsCurrentAddress) updateSameAsCurrentAddress(false);
        if(outsidePHCurrentAddress == false && outsidePHCurrentAdressForm.isReady) outsidePHCurrentAdressForm.clear();
    }, [outsidePHCurrentAddress]);

    React.useEffect(() => {
        permanentAddress.setRegion(null);
        if(sameAsPermanetAddress) updateSameAsPermanentAddress(false);
        if(outsidePHPermanetAddress == false && outsidePHPermanentAdressForm.isReady) outsidePHPermanentAdressForm.clear();
    }, [outsidePHPermanetAddress]);

    React.useEffect(() => {
        if(permanentAddressForm.isReady == false && sameAsPermanetAddress) updateSameAsPermanentAddress(false);
    }, [permanentAddressForm.isReady]);

    React.useEffect(() => {
        if(currentAddressForm.isReady == false && sameAsCurrentAddress) updateSameAsCurrentAddress(false);
    }, [currentAddressForm.isReady]);

    React.useEffect(() => {
        if(addRecordTransactionFlag) {
            addRecordTransactionFlag.querySuccess? (() => { 
                setFormOnClear(true)
                setDob(null);
                setDoBap(null);
                permanentAddress.setRegion(null);
                currentAddress.setRegion(null);
                tempDpName && setResetDpInputValue(true);
                updateSameAsCurrentAddress(false);
                updateSameAsPermanentAddress(false);
                setResetDpInputValue(true);
                setDisablePictureInput(false);
                form.clear();
                homeContactInfoForm.clear();
                dateOfBaptismForm.clear();
                outsidePHCurrentAdressForm.clear();
                outsidePHPermanentAdressForm.clear();
                setFormOnClear(false);
            })() : (() => {
                setDisablePictureInput(false);
                // addSnackBar("Query Failed!", "error", 5)
            })()
        }
    }, [addRecordTransactionFlag])

    React.useEffect(() => {
        formDispatcher({...formValues, avatar: tempDpName as string | null});
    }, [tempDpName]);

    return (
    <div className={className}>
        <FullScreenSpinner state={addingMemberLoadingState} onClose={() => setAddingMemberLoadingState("close")}/>
        <strong className="information-category-title">Basic Information</strong>
        <div className="data-category full-name-group">
            <span className="data-category-title-container">
                <FontAwesomeIcon icon={["fas", "user"]} />
                <p>Full Name</p>
            </span>
            <Devider $orientation="vertical" $css="margin: 0 5px" />
            <div className="input-category-group">
                <Input disabled={isLoading} value={formValues.firstName as string} name="first-name" placeholder="First Name"  type="text" error={form.errors.firstName} onValChange={(val) => formDispatcher({...formValues, firstName: val})} />
                <Input disabled={isLoading} value={formValues.middleName as string} name="middle-name" placeholder="Middle Name"  type="text" error={form.errors.middleName} onValChange={(val) => formDispatcher({...formValues, middleName: val})}  />
                <Input disabled={isLoading} value={formValues.surName as string} name="sur-name" placeholder="Sur Name"  type="text" error={form.errors.surName} onValChange={(val) => formDispatcher({...formValues, surName: val})}  />
                <Select disabled={isLoading} value={formValues.extName as string} placeholder="Ex. Name" error={form.errors.extName} onValChange={(val) => formDispatcher({...formValues, extName: val})}>
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
                <Input disabled={isLoading} value={dob? dob : ""} name="date-of-birth" type="date" placeholder="Date of Birth" error={form.errors.dateOfBirth} onValChange={(val) => setDob(val as string)} />
                {/* <Input disabled={isLoading} value={dob? dob : ""} name="date-of-birth" type="date" placeholder="Date of Birth" error={form.errors.dateOfBirth} onValChange={(val) => setDob(val as string)} /> */}
                {/* <input type="date" value={dob} onChange={(e) => setDob(e.target.value)}/> */}
            </div>
        </div>
        <div className="data-category gender-group">
            <span className="data-category-title-container">
                <FontAwesomeIcon icon={["fas", "venus-mars"]} />
                <p>Gender</p>
            </span>
            <Devider $orientation="vertical" $css="margin: 0 5px" />
            <div className="input-category-group">
                <Select disabled={isLoading} value={formValues.gender as string} placeholder="Gender" error={form.errors.gender} onValChange={(val) => formDispatcher({...formValues, gender: val})}>
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
            <Devider $orientation="vertical" $css="margin: 0 5px" />
            <div className="input-category-group">
                <Select disabled={isLoading} value={formValues.maritalStatus as string} placeholder="Marital Status" error={form.errors.maritalStatus} onValChange={(val) => formDispatcher({...formValues, maritalStatus: val})}>
                    <Option value="">Please select</Option>
                    <Option value="single">Single</Option>
                    <Option value="married">Married</Option>
                    <Option value="widowed">Widowed</Option>
                    <Option value="divorced">Divorced</Option>
                    <Option value="separated">Separated</Option>
                </Select>
            </div>
        </div>
        {/* <Devider $orientation="horizontal"  $css="margin: 0 5px" /> */}
        <strong className="information-category-title">Location Information</strong>
        <div className="data-category address-group">
            <span className="data-category-title-container">
                <FontAwesomeIcon icon={["fas", "map-location-dot"]} />
                <p>Permanent Address</p>
            </span>
            <Devider $orientation="vertical"  $css="margin: 0 5px" />
            <div className="input-category-group">
                {
                    (currentAddressForm.isReady || outsidePHCurrentAdressForm.isReady) && sameAsPermanetAddress == false && 
                    <Input disabled={isLoading} checked={sameAsCurrentAddress} type="checkbox" placeholder="same as current address" label="Same as Current Address?" onValChange={(val) => {
                        const v = val as boolean;
                        updateSameAsCurrentAddress(v)}
                    }/>
                }  
                <Revealer reveal={!sameAsCurrentAddress}>
                    <Input disabled={isLoading} checked={outsidePHPermanetAddress} type="checkbox" placeholder="Outside PH Address" label="Outside PH Address?" onValChange={(val) => {
                        const v = val as boolean;
                        updateOutsidePHPermanetAddress(v)}
                    }/>
                    {
                        !outsidePHPermanetAddress? <>
                        <Select 
                        value={permanentAddress.values.region}
                        disabled={isLoading} placeholder="Region" 
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
                        <Select
                        value={permanentAddress.values.province}
                        disabled={!permanentAddress.values.region || isLoading} placeholder="Province" 
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
                        <Select 
                        value={permanentAddress.values.cityMun}
                        disabled={!permanentAddress.values.province || isLoading} placeholder="City / Municipality" 
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
                        <Select 
                        value={permanentAddress.values.barangay}
                        disabled={!permanentAddress.values.cityMun || isLoading} placeholder="Barangay" 
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
                        </> : <Input disabled={isLoading} value={outsidePHPermanentAdressFormValues.outsidePHPermanentAddress as string} type="text" error={outsidePHPermanentAdressForm.errors.outsidePHPermanentAddress} placeholder="Specify your complete address outside PH" label="Complete Address" onValChange={(e) => updateOutsidePHPermanentAdressForm({...outsidePHPermanentAdressFormValues, outsidePHPermanentAddress: e})}/>
                    }
                </Revealer>
                {
                    outsidePHCurrentAddress == false && currentAddressForm.isReady && sameAsCurrentAddress && <AddressBox>{`${currentAddressFormValues.barangay}, ${currentAddressFormValues.cityOrMunicipality}, ${currentAddressFormValues.province}, ${currentAddressFormValues.region}`}</AddressBox> 
                }
                {
                    outsidePHCurrentAddress && outsidePHCurrentAdressForm.isReady && sameAsCurrentAddress && <AddressBox>{`${outsidePHCurrentAdressFormValues.outsidePHCurrentAddress}`}</AddressBox> 
                }
            </div>
        </div>
        {/* <Devider $orientation="horizontal"  $css="margin: 0 5px" /> */}
        <div className="data-category current-address-group">
            <span className="data-category-title-container">
                <FontAwesomeIcon icon={["fas", "map-location-dot"]} />
                <p>Current Address</p>
            </span>
            <Devider $orientation="vertical" $css="margin: 0 5px" />
            <div className="input-category-group">
                {
                    (permanentAddressForm.isReady || outsidePHPermanentAdressForm.isReady) && sameAsCurrentAddress == false && 
                    <Input disabled={isLoading} checked={sameAsPermanetAddress} type="checkbox" placeholder="Same as Permanent address" label="Same as Permanent Address?" onValChange={(val) => {
                        const v = val as boolean;
                        updateSameAsPermanentAddress(v)}
                    }/>
                }
                <Revealer reveal={!sameAsPermanetAddress}>
                    <Input disabled={isLoading} checked={outsidePHCurrentAddress} type="checkbox" placeholder="Outside PH Address" label="Outside PH Address?" onValChange={(val) => {
                        const v = val as boolean;
                        updateOutsidePHCurrentAddress(v)}
                    }/>
                    {
                        !outsidePHCurrentAddress? <>
                        <Select 
                        value={currentAddress.values.region}
                        disabled={isLoading} placeholder="Region" 
                        error={currentAddressForm.errors.region}
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
                        disabled={!currentAddress.values.region || isLoading} placeholder="Province" 
                        error={currentAddressForm.errors.province}
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
                        disabled={!currentAddress.values.province || isLoading} placeholder="City / Municipality" 
                        error={currentAddressForm.errors.cityOrMunicipality}
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
                        disabled={!currentAddress.values.cityMun || isLoading} placeholder="Barangay" 
                        error={currentAddressForm.errors.barangay}
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
                        </> : <Input disabled={isLoading} value={outsidePHCurrentAdressFormValues.outsidePHCurrentAddress as string} error={outsidePHCurrentAdressForm.errors.outsidePHCurrentAddress} type="text" placeholder="Specify your complete address outside PH" label="Complete Address" onValChange={(e) => updateOutsidePHCurrentAdressForm({...outsidePHCurrentAdressFormValues, outsidePHCurrentAddress: e})}/>
                    }
                </Revealer> 
                {
                    outsidePHPermanetAddress == false && permanentAddressForm.isReady && sameAsPermanetAddress && <AddressBox>{`${permanentAddressFormValues.barangay}, ${permanentAddressFormValues.cityOrMunicipality}, ${permanentAddressFormValues.province}, ${permanentAddressFormValues.region}`}</AddressBox> 
                } 
                {
                    outsidePHPermanetAddress && outsidePHPermanentAdressForm.isReady && sameAsPermanetAddress && <AddressBox>{`${outsidePHPermanentAdressFormValues.outsidePHPermanentAddress}`}</AddressBox> 
                } 
            </div>
        </div>
        <strong className="information-category-title">Contact Information</strong>
        <div className="data-category contact-group">
            <span className="data-category-title-container">
                <FontAwesomeIcon icon={["fas", "user"]} />
                <p>Contact (Personal)</p>
            </span>
            <Devider $orientation="vertical" $css="margin: 0 5px" />
            <div className="input-category-group">
                <IconInput disabled={isLoading} value={formValues.email as string} type="email" placeholder="Email Address" error={form.errors.email} onValChange={(e) => formDispatcher({...formValues, email: e})} icon={<FontAwesomeIcon icon={["fas", "at"]} />} />
                <PHCPNumberInput disabled={isLoading} value={formValues.cpNumber as string} placeholder="Mobile Number" error={form.errors.cpNumber} onChange={(e) => formDispatcher({...formValues, cpNumber: e})} icon={<FontAwesomeIcon icon={["fas", "mobile-alt"]} />} />
                <PHTelNumberInput disabled={isLoading} value={formValues.telephoneNumber as string} placeholder="Telephone Number" error={form.errors.telephoneNumber} onChange={(e) => formDispatcher({...formValues, telephoneNumber: e})} icon={<FontAwesomeIcon icon={["fas", "phone-alt"]} />} />
                {/* <IconInput value={form.values.telephoneNumber as number} type="number" placeholder="Telephone" error={form.errors.telephoneNumber} onValChange={(e) => formDispatcher?.telephoneNumber(e)} icon={<FontAwesomeIcon icon={["fas", "phone-alt"]} />} /> */}
            </div>
        </div>
        <div className="data-category contact-group">
            <span className="data-category-title-container">
                <FontAwesomeIcon icon={["fas", "home"]} />
                <p>Contact (Home)</p>
            </span>
            <Devider $orientation="vertical" $css="margin: 0 5px" />
            <div className="input-category-group">
                <IconInput disabled={isLoading} value={homeContactInfoFormValues.email as string} type="email" placeholder="Email Address" error={homeContactInfoForm.errors.email} onValChange={(e) => homeContactInfoFormDispatchers({...homeContactInfoFormValues, email: e})} icon={<FontAwesomeIcon icon={["fas", "at"]} />} />
                <PHCPNumberInput disabled={isLoading} value={homeContactInfoFormValues.cpNumber as string} placeholder="Mobile Number" error={homeContactInfoForm.errors.cpNumber} onChange={(e) => homeContactInfoFormDispatchers({...homeContactInfoFormValues, cpNumber: e})} icon={<FontAwesomeIcon icon={["fas", "mobile-alt"]} />} />
                <PHTelNumberInput disabled={isLoading} value={homeContactInfoFormValues.telephoneNumber as string} placeholder="Telephone Number" error={homeContactInfoForm.errors.telephoneNumber} onChange={(e) => homeContactInfoFormDispatchers({...homeContactInfoFormValues, telephoneNumber: e})} icon={<FontAwesomeIcon icon={["fas", "phone-alt"]} />} />
                {/* <IconInput value={form.values.telephoneNumber as number} type="number" placeholder="Telephone" error={form.errors.telephoneNumber} onValChange={(e) => formDispatcher?.telephoneNumber(e)} icon={<FontAwesomeIcon icon={["fas", "phone-alt"]} />} /> */}
            </div>
        </div>
        <strong className="information-category-title">Baptism Information</strong>
        <div className="data-category date-of-baptism-group">
            <span className="data-category-title-container">
                <FontAwesomeIcon icon={["fas", "place-of-worship"]} />
                <p>Baptism</p>
            </span>
            <Devider $orientation="vertical" $css="margin: 0 5px" />
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
        <Devider $orientation="horizontal"  $css="margin: 0 5px" />
        <div className="picture-upload-area">
            <Alert severity="info" variant="default">
            Uploading a formal display picture for the member's profile is optional but recommended for a professional appearance.
            </Alert>
            <AvatarPicker 
            onChange={(avatar) => {
                errorUploadingDp && setErrorUploadingDp(false);
                isUploadingDp && setIsUploadingDp(false);
                resetDpInputValue && setResetDpInputValue(false)
                setTempDpName(avatar);
            }}
            onErrorUpload={() => setErrorUploadingDp(true)} 
            onUpload={() => setIsUploadingDp(true)} 
            disabledPicker={disablePictureInput} 
            doReset={resetDpInputValue} />
        </div>
        <Devider $orientation="horizontal"  $css="margin: 0 5px" />
        <div className="submit-button-container">
            <Button disabled={isLoading || isUploadingDp} label="Clear Form" variant="standard" color="theme" isLoading={formOnClear} onClick={(e) => {
                setFormOnClear(true)
                setDob(null);
                setDoBap(null);
                permanentAddress.setRegion(null);
                currentAddress.setRegion(null);
                tempDpName && setResetDpInputValue(true);
                form.clear();
                homeContactInfoForm.clear();
                dateOfBaptismForm.clear();
                outsidePHCurrentAdressForm.clear();
                outsidePHPermanentAdressForm.clear();
                setFormOnClear(false);
            }}/>
            <Button disabled={isLoading || !formIsReadyState || errorUploadingDp as boolean || isUploadingDp as boolean} isLoading={isLoading} label="Add Member" icon={<FontAwesomeIcon icon={["fas", "plus"]} />} variant="standard" color="primary"  
            onClick={(e) => {
                setDisablePictureInput(true);
                const currentAddressData = !sameAsPermanetAddress? 
                outsidePHCurrentAddress? {
                    philippines: false,
                    address: (outsidePHCurrentAdressFormValues.outsidePHCurrentAddress as string).trim()
                } : {
                    philippines: true,
                    address: {
                        region: currentAddressFormValues.region,
                        province: currentAddressFormValues.province,
                        cityOrMunicipality: currentAddressFormValues.cityOrMunicipality,
                        barangay: currentAddressFormValues.barangay
                    }
                } : 
                outsidePHPermanetAddress? {
                    philippines: false,
                    address: (outsidePHPermanentAdressFormValues.outsidePHPermanentAddress as string).trim()
                }: {
                    philippines: true,
                    address: {
                        region: permanentAddressFormValues.region,
                        province: permanentAddressFormValues.province,
                        cityOrMunicipality: permanentAddressFormValues.cityOrMunicipality,
                        barangay: permanentAddressFormValues.barangay
                    }
                };

                const permanentAddressData = !sameAsCurrentAddress?
                outsidePHPermanetAddress? {
                    philippines: false,
                    address: (outsidePHPermanentAdressFormValues.outsidePHPermanentAddress as string).trim()
                }: {
                    philippines: true,
                    address: {
                        region: permanentAddressFormValues.region,
                        province: permanentAddressFormValues.province,
                        cityOrMunicipality: permanentAddressFormValues.cityOrMunicipality,
                        barangay: permanentAddressFormValues.barangay
                    }
                } : 
                outsidePHCurrentAddress? {
                    philippines: false,
                    address: (outsidePHCurrentAdressFormValues.outsidePHCurrentAddress as string).trim()
                } : {
                    philippines: true,
                    address: {
                        region: currentAddressFormValues.region,
                        province: currentAddressFormValues.province,
                        cityOrMunicipality: currentAddressFormValues.cityOrMunicipality,
                        barangay: currentAddressFormValues.barangay
                    }
                }

                const record = {
                    personalInformation: {
                        firstName: (formValues.firstName as string).trim(),
                        middleName: (formValues.middleName as string).trim(),
                        surName: (formValues.surName as string).trim(),
                        extName: formValues.extName? formValues.extName : null, 
                        maritalStatus: formValues.maritalStatus,
                        dateOfBirth: formValues.dateOfBirth,
                        gender: formValues.gender,
                        avatar: formValues.avatar,
                    },
                    contactInformation: {
                        email: formValues.email? (formValues.email as string).trim() : null,
                        cpNumber: formValues.cpNumber? formValues.cpNumber : null,
                        telephoneNumber: formValues.telephoneNumber? formValues.telephoneNumber : null,
                    }, 
                    homeContactInformation: {
                        email: homeContactInfoFormValues.email? (homeContactInfoFormValues.email as string).trim() : null,
                        cpNumber: homeContactInfoFormValues.cpNumber? homeContactInfoFormValues.cpNumber : null,
                        telephoneNumber: homeContactInfoFormValues.telephoneNumber? homeContactInfoFormValues.telephoneNumber : null,
                    }, 
                    currentAddress: currentAddressData,
                    permanentAddress: permanentAddressData,
                    baptismInformation: isBaptised? {
                        ...dateOfBaptismFormValues
                    } : null
                }

                if([
                    formValues.firstName,
                    formValues.middleName,
                    formValues.surName,
                    formValues.maritalStatus,
                    formValues.dateOfBirth,
                    formValues.gender,
                ].includes("")) return;
                setAddingMemberLoadingState("loading");
                addMemberRecord(record);
            }}/>
        </div>
    </div>
    )
}

const MembershipFormModalView = styled(FCMembershipFormModalView)`
    display: flex;
    flex-wrap: wrap;
    flex: 0 1 100%;
    padding: 15px;
    height: fit-content;
    background-color:  ${({theme}) => theme.background.primary};
    /* box-shadow: 3px 3px 5px 1px rgb(0 0 0 / 5%); */
    min-width: 0;

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

    & .information-category-title {
        flex: 0 1 100%;
        height: fit-content;
        /* text-align: center; */
        /* border-bottom: 1px solid ${({theme}) => theme.borderColor}; */
        padding-bottom: 5px;
        /* font-size: 20px; */
        font-weight: 600;
        margin-bottom: 15px;
        margin-top: 15px;
        color: ${({theme}) => theme.textColor.strong};
    }

    & .data-category {
        display: flex;
        flex: 0 1 100%;
        /* align-items: center; */
        padding: 10px 0;
        min-width: 0;
    }

    & .data-category .data-category-title-container,
    & .data-category .input-category-group {
        display: flex;
        flex: 0 0 75px;
        height: 55px;
    }
    
    & .data-category .data-category-title-container {
        /* background-color: ${({theme}) => theme.background.light}; */
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    & .data-category .data-category-title-container p {
        font-size: 11px;
        text-align: center;
    }

    & .full-name-group .data-category-title-container {
        /* background-color: #019aff33; */
        color: #4bb2f7;
    }

    & .birth-date-group .data-category-title-container {
        /* background-color: #ffb72f75; */
        color: #ffac1f;
    }

    & .gender-group .data-category-title-container {
        /* background-color: #f696fc52; */
        color: #ee3ff9;
    }

    & .marital-status-group .data-category-title-container {
        /* background-color: #fd151547; */
        color: #f74a4a;
    }

    & .address-group .data-category-title-container,
     & .ministry-group .data-category-title-container {
        /* background-color: #2dff7636; */
        color: #23c703;
    }

    & .current-address-group .data-category-title-container {
        /* background-color: #0beed930; */
        color: #0beed9;
    }

    & .contact-group .data-category-title-container {
        /* background-color: #4706a13d; */
        color: #9245ff;
    }

    & .date-of-baptism-group .data-category-title-container {
        /* background-color: #8b088a59; */
        color: #cd28cc;
    }

    & .organization-group .data-category-title-container {
        /* background-color: #00bcd43d; */
        color: #27e7ff;
    }

    & .data-category .input-category-group {
        display: flex;
        flex-wrap: wrap;
        flex: 0 1 100%;
        height: fit-content;
        min-width: 0;
    }

    /* & .full-name-group .input-category-group ${Input},
    & .full-name-group .input-category-group ${Input} {
        flex: 1;
    } */

    & .data-category .input-category-group ${Input},
    & .data-category .input-category-group ${Select},
    & .address-group .input-category-group ${AddressBox} {
        margin-left: 10px;
    }

    & .data-category .input-category-group ${IconInput},
    & .data-category .input-category-group ${PHCPNumberInput},
    & .data-category .input-category-group ${PHTelNumberInput} {
        margin: 10px 0 10px 10px;
    }

    & .picture-upload-area {
        display: inline-block;
        width: 100%;
        padding: 15px;
        background-color: ${({theme}) => theme.mode == "dark"? "#0f0f0f3d" : "#F9F9F9"};

        ${AvatarPicker} {
            margin: 15px auto 0 auto;
        }
    }
    
    & .address-group .input-category-group ${Revealer},
    & .current-address-group .input-category-group ${Revealer},
    & .date-of-baptism-group .input-category-group ${Revealer} {
        margin: 0 10px; 
    }

    & .address-group .input-category-group ${Revealer} ${Select},
    & .address-group .input-category-group ${Revealer} ${Input},
    & .date-of-baptism-group .input-category-group ${Revealer} ${Input},
    & .current-address-group .input-category-group ${Select},
    & .current-address-group .input-category-group ${Revealer} ${Input},
    & .current-address-group .input-category-group ${Revealer} ${Select} {
        flex: 0 1 100%;
        margin: 10px 0 25px 10px;
    }

    & .address-group .input-category-group ${Revealer} ${Input},
    & .current-address-group .input-category-group ${Revealer} ${Input} {
        margin: 10px 0 0 0;
    }

    & .organization-group .input-category-group .organization-avatar-container,
    & .ministry-group .input-category-group .ministry-avatar-container {
        display: flex;
        flex: 1;
    }

    & .submit-button-container {
        display: flex;
        flex: 0 1 100%;
        gap: 5px;
    }

    & .submit-button-container ${Button}:first-child {
        margin-left: auto;
    }


`
export default MembershipFormModalView;