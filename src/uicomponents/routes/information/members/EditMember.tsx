import { Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { debounce } from 'lodash';
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

import { IStyledFC } from "../../../IStyledFC";
import { strict } from "assert";

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

    .tab-toggle {
        display: flex;
        flex: 0 1 100%;
        align-items: center;
        padding: 20px 0;
    }

    .members-info-data-container {
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
        text-align: center;
        border-bottom: 1px solid ${({theme}) => theme.borderColor};
        padding-bottom: 5px;
        /* font-size: 20px; */
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

    & .data-category .input-category-group ${Input},
    & .data-category .input-category-group ${Select} {
        margin-left: 10px;
    }

    & .data-category .input-category-group ${IconInput},
    & .data-category .input-category-group ${PHCPNumberInput},
    & .data-category .input-category-group ${PHTelNumberInput} {
        margin: 10px 0 10px 10px;
    }
    
    & .address-group .input-category-group ${Revealer},
    & .current-address-group .input-category-group ${Revealer},
    & .date-of-baptism-group .input-category-group ${Revealer} {
        margin: 0 10px; 
    }

    & .address-group .input-category-group ${Revealer} ${Select},
    & .address-group .input-category-group ${Revealer} ${Input},
    & .full-name-group .input-category-group ${Input},
    & .full-name-group .input-category-group ${Select},
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
    }
`;

const validatePHNumber: Yup.TestFunction<Yup.Maybe<string | undefined>, Yup.AnyObject> = function (
    value: Yup.Maybe<string | undefined>,
    context: Yup.TestContext<Yup.AnyObject>
  ) {
    const { path, createError } = context;
  
    // Your custom validation logic goes here
    if (!value) {
      return true; // Allow empty string or null
    }
  
    const cleanedPhoneNumber = value.replace(/-/g, "");
    const phoneNumberRegex = /^(09)\d{9}$/;

    const isValid = phoneNumberRegex.test(cleanedPhoneNumber);
    if (isValid) {
      return true;
    } else {
      return createError({ path, message: 'Validation failed.' });
    }
};

const isValidPHAreaCode = (areaCode: string): boolean => {
    const validAreaCodes = [
      "02", "032", "033", "034", "035", "036", "038", "042", "043", "044", 
      "045", "046", "047", "048", "049", "052", "053", "054", "055", "056", 
      "062", "063", "064", "072", "075", "076", "077", "078", "082", "083", 
      "084", "085", "086", "088", "089", "092", "094", "095", "096", "097", 
      "098", "099"
    ];
    return validAreaCodes.includes(areaCode);
};

const validatePHTelNumber: Yup.TestFunction<Yup.Maybe<string | undefined>, Yup.AnyObject> = function (
    value: Yup.Maybe<string | undefined>,
    context: Yup.TestContext<Yup.AnyObject>
) {
    const { path, createError } = context;

    // Your custom validation logic goes here
    if (!value) {
        return true; // Allow empty string or null
    }


    const cleanedTelephoneNumber = value.replace(/\D/g, "");
    const caption =
        "Telephone Number must be in a valid format e.g: XXXX-XXXX or (XX) XXXX-XXXX or (XXX) XXXX-XXXX";

    if (cleanedTelephoneNumber.length === 8) {
        return true;
    }

    if (cleanedTelephoneNumber.length === 10 || cleanedTelephoneNumber.length === 11) {
        const areaCodeLength = cleanedTelephoneNumber.length === 10 ? 2 : 3;
        const areaCode = cleanedTelephoneNumber.substring(0, areaCodeLength);
        const localExchangeCode = cleanedTelephoneNumber.substring(areaCodeLength, areaCodeLength + 4);

        const isValidAreaCode = isValidPHAreaCode(areaCode);
        const isValidLocalExchangeCode = /^[0-9]{4}$/.test(localExchangeCode);

        const isValid = isValidAreaCode && isValidLocalExchangeCode;
        if (isValid) {
            return true;
        } else {
            return createError({ path, message: isValidLocalExchangeCode? "Invalid Area Code. " : "Invalid Local Exchange Code. " });
        }
    }
};


const validationSchema = Yup.object().shape({
    firstName: Yup.string().required(),
    middleName: Yup.string().required(),
    surname: Yup.string().required(),
    extName: Yup.string().nullable().notRequired(),
    dateOfBirth: Yup.date()
    .min(new Date('1903-01-01'), 'Date must be after or equal to 1903-01-01')
    .max(new Date(), 'Date must be before or equal to today'),
    dateOfBaptism: Yup.date()
    .min(new Date('1903-01-01'), 'Date must be after or equal to 1903-01-01')
    .max(new Date(), 'Date must be before or equal to today'),
    gender: Yup.string().oneOf(["male", "female"]).required(),
    maritalStatus: Yup.string().oneOf([ "single", "married", "widowed", "divorced", "separated"]).required(),
    personalEmail: Yup.string().nullable().notRequired().email('Invalid email'),
    personalCpNumber: Yup.string().nullable().notRequired().test('personalPHCPNumber', 'Invalid Philippine phone number', validatePHNumber),
    personalTelNumber: Yup.string().nullable().notRequired().test('personalPHTelNumber', 'Invalid Philippine Tel number', validatePHTelNumber),
    homeEmail: Yup.string().nullable().notRequired().email('Invalid email'),
    homeCpNumber: Yup.string().nullable().notRequired().test('homePHCPNumber', 'Invalid Philippine phone number', validatePHNumber),
    homeTelNumber: Yup.string().nullable().notRequired().test('homePHTelNumber', 'Invalid Philippine Tel number', validatePHTelNumber),
});

const EditMember: React.FC = () => {
    const { memberUID } = useParams();
    const {getMemberRecord, data: memberInformation} = useGetMemberInfoByUID();
    const [editReady, setEditReady] = React.useState(false);
    
    const [currenAddressOutPh, setCurrentAddressOutPh] = React.useState(false);
    const [permanentAddressOutPh, setPermanentAddressOutPh] = React.useState(false);
    
    const [errors, setErrors] = React.useState<null | Record<string, string>>(null);
    
    const [editAddress, setEditAddress] = React.useState({
        currentAddressOutPH: "",
        permanenAddressOutPH: "",
        currentAddresPHRegion: "",
        currentAddresPHProvince: "",
        currentAddresPHCityMun: "",
        currentAddresPHBarangay: "",
        permanentAddresPHRegion: "",
        permanentAddresPHProvince: "",
        permanentAddresPHCityMun: "",
        permanentAddresPHBarangay: "",
    })

    const [editForm, setEditForm] = React.useState({
        firstName: "",
        middleName: "",
        surname: "",
        extName: "",
        dateOfBirth: "",
        maritalStatus: "",
        gender: "",
        personalCpNumber: "",
        personalEmail: "",
        personalTelNumber: "",
        homeTelNumber: "",
        homeEmail: "",
        homeCpNumber: "",
        dateOfBaptism: "",
    });

    const validateForm = debounce(async () => {
        try {
            await validationSchema.validate(editForm, { abortEarly: false });
            setErrors(null);
        } catch (error: any) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors: { [key: string]: string } = {}; // Define the type of validationErrors
                error.inner.forEach((err) => {
                    if (err.path) {
                        validationErrors[err.path] = err.message;
                    }
                });

                setErrors(validationErrors);
            }
        }
    }, 300);

    React.useEffect(() => {
        if(memberUID) {
            getMemberRecord(memberUID);
        }
    }, [memberUID]);

    React.useEffect(() => {
        if(memberInformation) {
            const formVal = {} as typeof editForm;

            formVal.firstName = memberInformation.first_name;
            formVal.middleName = memberInformation.middle_name;
            formVal.surname = memberInformation.surname;
            formVal.extName = memberInformation.ext_name || "";
            formVal.gender = memberInformation.gender;
            formVal.maritalStatus = memberInformation.marital_status;
            formVal.dateOfBirth = new Date(`${new Date(memberInformation.date_of_birth).getFullYear()}-${new Date(memberInformation.date_of_birth).getMonth()}-${new Date(memberInformation.date_of_birth).getDate()}`).toLocaleDateString();
            formVal.dateOfBaptism = memberInformation.date_of_baptism || "";
            // formVal.permanenAddressOutPH = memberInformation.outsidePHpermanentAddress || "";
            // formVal.currentAddressOutPH = memberInformation.outsidePHCurrentAddress || "";
            // formVal.currentAddresPHRegion = memberInformation.localCurrentAddressRegion || "";
            // formVal.currentAddresPHProvince = memberInformation.localCurrentAddressProvince || "";
            // formVal.currentAddresPHCityMun = memberInformation.localCurrentAddressMunCity || "";
            // formVal.currentAddresPHBarangay = memberInformation.localCurrentAddressBarangay || "";
            // formVal.permanentAddresPHRegion = memberInformation.localPermanentAddressRegion || "";
            // formVal.permanentAddresPHProvince = memberInformation.localPermanentAddressProvince || "";
            // formVal.permanentAddresPHCityMun = memberInformation.localPermanentAddressMunCity || "";
            // formVal.permanentAddresPHBarangay = memberInformation.localPermanentAddressBarangay || "";

            // if(memberInformation.outsidePHpermanentAddress) setPermanentAddressOutPh(true);
            // if(memberInformation.outsidePHpermanentAddress) setCurrentAddressOutPh(true);

            setEditForm(formVal);
            setEditReady(true);
        }

        console.log(memberInformation)
    }, [memberInformation]);

    React.useEffect(() => {
        if(editReady) {
            validateForm();
        }
        console.log(editForm)
    }, [editForm, editReady]);

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
                    <header>
                        <div className="avatar-area">
                            <Avatar size="140px " src={`${AVATAR_BASE_URL}/${memberInformation?.avatar}`} alt="A" />
                        </div>
                        <div className="group-info">
                            <h1>{`${memberInformation?.first_name} ${memberInformation?.middle_name[0]} ${memberInformation?.surname} ${memberInformation?.ext_name || ""}`}</h1>
                            <p>{memberInformation?.member_uid}</p>
                        </div>
                        <div className="button-group">
                            <Button icon={<FontAwesomeIcon icon={["fas", "trash"]} />} label="Delete" color="delete" />
                            <Button icon={<FontAwesomeIcon icon={["fas", "edit"]} />} label="Edit" color="edit" />
                        </div>
                    </header>
                    <div className="members-info-data-container">
                    {
                        editReady && <>
                        <Devider $orientation="horizontal"  $css="margin: 0 5px" />
                            <div className="data-category full-name-group">
                                <div className="input-category-group">
                                    <Input error={(errors && errors['firstName'])? {errorText: "Invalid Entry", validationResult: [{caption: errors['firstName'], passed: false}]} : null} disabled={false} value={editForm.firstName} name="first-name" placeholder="First Name"  type="text" onValChange={(val) => setEditForm({...editForm, firstName: val? val as string : ""})} />
                                    <Input error={(errors && errors['middleName'])? {errorText: "Invalid Entry", validationResult: [{caption: errors['middleName'], passed: false}]} : null} disabled={false} value={editForm.middleName} name="middle-name" placeholder="Middle Name"  type="text"  onValChange={(val) => setEditForm({...editForm, middleName: val? val as string : ""})}  />
                                    <Input error={(errors && errors['surname'])? {errorText: "Invalid Entry", validationResult: [{caption: errors['surname'], passed: false}]} : null} disabled={false} value={editForm.surname} name="sur-name" placeholder="Sur Name"  type="text" onValChange={(val) => setEditForm({...editForm, surname: val? val as string : ""})}  />
                                    <Select error={(errors && errors['extName'])? {errorText: "Invalid Entry", validationResult: [{caption: errors['extName'], passed: false}]} : null} disabled={false} value={editForm.extName} placeholder="Ex. Name" onValChange={(val) => setEditForm({...editForm, extName: val? val as string : ""})}>
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
                                    <Input error={(errors && errors['dateOfBirth'])? {errorText: "Invalid Entry", validationResult: [{caption: errors['dateOfBirth'], passed: false}]} : null} disabled={false} value={editForm.dateOfBirth} name="date-of-birth" type="date" placeholder="Date of Birth" onValChange={(val) => setEditForm({...editForm, dateOfBirth: val? val as string : ""})} />
                                </div>
                            </div>
                            <div className="data-category gender-group">
                                <span className="data-category-title-container">
                                    <FontAwesomeIcon icon={["fas", "venus-mars"]} />
                                    <p>Gender</p>
                                </span>
                                <Devider $orientation="vertical" $css="margin: 0 5px" />
                                <div className="input-category-group">
                                    <Select error={(errors && errors['gender'])? {errorText: "Invalid Entry", validationResult: [{caption: errors['gender'], passed: false}]} : null} disabled={false} value={editForm.gender} placeholder="Gender" onValChange={(val) => setEditForm({...editForm, gender: val? val as string : ""})}>
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
                                    <Select error={(errors && errors['maritalStatus'])? {errorText: "Invalid Entry", validationResult: [{caption: errors['maritalStatus'], passed: false}]} : null} disabled={false} value={editForm.maritalStatus} placeholder="Marital Status" onValChange={(val) => setEditForm({...editForm, maritalStatus: val? val as string : ""})}>
                                        <Option value="">Please select</Option>
                                        <Option value="single">Single</Option>
                                        <Option value="married">Married</Option>
                                        <Option value="widowed">Widowed</Option>
                                        <Option value="divorced">Divorced</Option>
                                        <Option value="separated">Separated</Option>
                                    </Select>
                                </div>
                            </div>
                            <Devider $orientation="horizontal"  $css="margin: 0 5px" />
                            <div className="data-category contact-group">
                                <span className="data-category-title-container">
                                    <FontAwesomeIcon icon={["fas", "user"]} />
                                    <p>Contact (Personal)</p>
                                </span>
                                <Devider $orientation="vertical" $css="margin: 0 5px" />
                                <div className="input-category-group">
                                    <IconInput disabled={false} value={editForm.personalEmail} type="email" placeholder="Email Address"onValChange={(e) => setEditForm({...editForm, personalEmail: e? e as string : ""})} icon={<FontAwesomeIcon icon={["fas", "at"]} />} />
                                    <PHCPNumberInput disabled={false} value={editForm.personalCpNumber} placeholder="Mobile Number"  onChange={(e) => setEditForm({...editForm, personalCpNumber: e? e as string : ""})} icon={<FontAwesomeIcon icon={["fas", "mobile-alt"]} />} />
                                    <PHTelNumberInput disabled={false} value={editForm.personalTelNumber} placeholder="Telephone Number" onChange={(e) => setEditForm({...editForm, personalTelNumber: e? e as string : ""})} icon={<FontAwesomeIcon icon={["fas", "phone-alt"]} />} />
                                </div>
                            </div>
                            <div className="data-category contact-group">
                                <span className="data-category-title-container">
                                    <FontAwesomeIcon icon={["fas", "home"]} />
                                    <p>Contact (Home)</p>
                                </span>
                                <Devider $orientation="vertical" $css="margin: 0 5px" />
                                <div className="input-category-group">
                                    <IconInput disabled={false} value={editForm.homeEmail} type="email" placeholder="Email Address" onValChange={(e) => setEditForm({...editForm, homeEmail: e? e as string : ""})} icon={<FontAwesomeIcon icon={["fas", "at"]} />} />
                                    <PHCPNumberInput disabled={false} value={editForm.homeCpNumber} placeholder="Mobile Number"   onChange={(e) => setEditForm({...editForm, homeCpNumber: e? e as string : ""})} icon={<FontAwesomeIcon icon={["fas", "mobile-alt"]} />} />
                                    <PHTelNumberInput disabled={false} value={editForm.homeTelNumber} placeholder="Telephone Number"   onChange={(e) => setEditForm({...editForm, homeTelNumber: e? e as string : ""})} icon={<FontAwesomeIcon icon={["fas", "phone-alt"]} />} />
                                </div>
                            </div>
                            <div className="data-category date-of-baptism-group">
                                <span className="data-category-title-container">
                                    <FontAwesomeIcon icon={["fas", "place-of-worship"]} />
                                    <p>Baptism</p>
                                </span>
                                <Devider $orientation="vertical" $css="margin: 0 5px" />
                                <div className="input-category-group">
                                    <Input disabled value={editForm.dateOfBaptism} name="date-of-baptism" type="date" placeholder="Date of Baptism" onValChange={(e) => setEditForm({...editForm, dateOfBaptism: e? e as string : ""})} />
                                </div>
                            </div>
                        </>
                    }
                    </div>
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
    )
}



export default EditMember;