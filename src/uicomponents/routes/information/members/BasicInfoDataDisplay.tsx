import React from "react";
import styled from "styled-components";
import Input from "../../../reusables/Inputs/Input";
import Select, {Option} from "../../../reusables/Inputs/Select";
import { IStyledFC } from "../../../IStyledFC";
import transformDateToYYYYMMDD from "../../../../utils/helpers/transformDateToYYYY-MM-DD";

interface IBasicInfoDataDisplay extends IStyledFC {
    data: {
        firstName: string,
        middleName: string,
        surname: string,
        extName: string | null,
        gender: string,
        dateOfBirth: string,
        maritalStatus: string,
    }
}

const FCBasicInfoDataDisplay: React.FC<IBasicInfoDataDisplay> = ({className, data}) => {

    return (
        <div className={className}>
            <Input viewOnly value={data.firstName} label="First Name" type="text" name="first-name"  placeholder="First Name" onValChange={(e) => {}}/>
            <Input viewOnly value={data.middleName} label="Middle Name" type="text" name="middle-name"  placeholder="Middle Name" onValChange={(e) => {}}/>
            <Input viewOnly value={data.surname} label="Surname" type="text" name="surname"  placeholder="Surname" onValChange={(e) => {}}/>
            <Select viewOnly value={data.extName as string} placeholder="Ex. Name" onValChange={(val) => {}}>
                <Option value="">Please select</Option>
                <Option value="jr">JR</Option>
                <Option value="sr">SR</Option>
            </Select>
            <Input viewOnly value={transformDateToYYYYMMDD(data.dateOfBirth)} name="date-of-birth" type="date" placeholder="Date of Birth" onValChange={() => {}} />
            <Select viewOnly value={data.gender} placeholder="Gender" onValChange={() => {}}>
                <Option value="">Please select</Option>
                <Option selected={data.gender == 'male'} value="male">Male</Option>
                <Option selected={data.gender == 'female'} value="female">Female</Option>
            </Select>
            <Select viewOnly value={data.maritalStatus} placeholder="Marital Status" onValChange={() => {}}>
                <Option value="">Please select</Option>
                <Option value="single">Single</Option>
                <Option value="married">Married</Option>
                <Option value="widowed">Widowed</Option>
                <Option value="divorced">Divorced</Option>
                <Option value="separated">Separated</Option>
            </Select>
        </div>
    )
};

const BasicInfoDataDisplay = styled(FCBasicInfoDataDisplay)`
    && {
        display: flex;
        flex: 0 1 100%;
        min-width: 200px;
        padding: 30px 20px 0 30px;
        flex-wrap: wrap;
        background-color: ${({theme}) => theme.background.lighter};
        border-radius: 5px;
        align-content: flex-start;
    
        ${Input}, ${Select} {
            flex: 1 0 250px;
            margin: 0 10px 30px 0;
        }
    }

`;

export default BasicInfoDataDisplay;