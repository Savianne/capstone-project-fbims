import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../../../IStyledFC";
import Input from "../../../reusables/Inputs/Input";
import Select, {Option} from "../../../reusables/Inputs/Select";
import Button from "../../../reusables/Buttons/Button";
import { ICategory } from "../Categories";
import useFormControl from "../../../../utils/hooks/useFormControl";
import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";
import doRequest from "../../../../API/doRequest";

interface ICreateEntry extends IStyledFC {
    category: string;
}

const AddEntryFormFC: React.FC<ICreateEntry> = ({className, category}) => {
    const addSnackbar = useAddSnackBar();
    const [isLoading, setIsLoading] = React.useState(false);
    const [form, formValues, formDispatchers] = useFormControl({
        decription: {
            validateAs: "text",
            minValLen: 5,
            maxValLen: 100,
            required: true,
            errorText: "invalid Input"
        },
        entryDate: {
            required: true,
            errorText: 'Invalid Date',
            validateAs: 'date',
        }
    });

    const [entryDate, setEntryDate] = React.useState<null | string>(null);

    React.useEffect(() => {
        formDispatchers({...formValues, entryDate});
    }, [entryDate])
    return (
        <div className={className}>
            <Input type="text" placeholder="Entry Description" name="entry-description" value={formValues.decription as string} onValChange={(val) => formDispatchers({...formValues, decription: val})} error={form.errors.decription} />
            <Input type="date" placeholder="Entry Date" name="entry-date" value={entryDate? entryDate : ""} onValChange={(val) => setEntryDate(val as string)} error={form.errors.entryDate}/>
            <Button disabled={!form.isReady} isLoading={isLoading} label="Create Entry" fullWidth color="primary"
            onClick={() => {
                setIsLoading(true);
                doRequest({
                    method: "POST",
                    url: "/attendance/add-attendance-entry",
                    data: {
                        description: formValues.decription,
                        entryDate: entryDate,
                        categoryUID: category
                    }
                })
                .then(response => {
                    if(response.success) {
                        addSnackbar("Added new Attendance Entry", "default", 5);
                        setEntryDate(null);
                        form.clear();
                    }
                })
                .catch(error => {
                    addSnackbar("Failed to add new Attendance Entry", "error", 5);
                })
                .finally(() => {
                    setIsLoading(false);
                })
            }}/>
        </div>
    )
}

const AddEntryForm = styled(AddEntryFormFC)`
    display: flex;
    flex-wrap: wrap;
    flex: 0 1 800px;
    padding: 25px;
    padding-top: 0;
    /* height: 300px; */
    border-radius: 5px;
    margin: 0 auto;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
    /* border: 1px solid ${({theme}) => theme.borderColor}; */
    background-color: ${({theme}) => theme.background.primary};

    && ${Input}, && ${Select} {
        margin: 25px 0;
        flex: 0 1 100%;
    }
`;

export default AddEntryForm;