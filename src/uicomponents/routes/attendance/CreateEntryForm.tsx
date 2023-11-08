import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../../IStyledFC";
import Input from "../../reusables/Inputs/Input";
import Select, {Option} from "../../reusables/Inputs/Select";
import Button from "../../reusables/Buttons/Button";
import { ICategory } from "./Categories";

interface ICreateEntry extends IStyledFC {
    categories: ICategory[];
}

const CreateEntryFormFC: React.FC<ICreateEntry> = ({className, categories}) => {

    return (
        <div className={className}>
            <Input type="text" placeholder="Entry Description" name="entry-description" onValChange={(val) => {}}/>
            <Input type="date" placeholder="Entry Date" name="entry-date" onValChange={(val) => {}}/>
            <Select placeholder="Category" value="" onValChange={(e) => {}}>
                <Option value="">Select category</Option>
                {
                    categories.map(category => {
                        return <Option key={category.uid} value={category.uid}>{category.title}</Option>
                    })
                }
            </Select>
            <Button disabled={false} isLoading={false} label="Create Entry" fullWidth color="primary" />
        </div>
    )
}

const CreateEntryForm = styled(CreateEntryFormFC)`
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    padding: 15px;
    padding-top: 0;
    /* height: 300px; */
    border-radius: 5px;
    /* border: 1px solid ${({theme}) => theme.borderColor}; */
    background-color: ${({theme}) => theme.background.lighter};

    && ${Input}, && ${Select} {
        margin: 25px 0;
        flex: 0 1 100%;
    }
`;

export default CreateEntryForm;