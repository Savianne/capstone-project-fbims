import React from "react";
import * as Yup from 'yup';
import { debounce, update } from 'lodash';
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../../../reusables/Inputs/Input";
import Button from "../../../reusables/Buttons/Button";
import { IStyledFC } from "../../../IStyledFC";
import doRequest from "../../../../API/doRequest";
import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";
import areObjectsMatching from "../../../../utils/helpers/areObjectMatching";

interface IEditMinistryForm extends IStyledFC {
    onLoading: (isLoading: boolean) => void;
    data: {
        ministryUID: string,
        ministryName: string,
        description: string,
    },
    update: (data: { ministryName: string, description: string }) => void
}

const validationSchema = Yup.object().shape({
    ministryName: Yup.string().trim().required(),
    description: Yup.string().trim().required(),
});

const EditMinistryFC: React.FC<IEditMinistryForm> = ({className, onLoading, data, update}) => {
    const addSnackbar = useAddSnackBar();
    const [baseData, setBaseData] = React.useState<null | {
        ministryName: string,
        description: string,
    }>(null);
    const [editData, setEditData] = React.useState<null | {
        ministryName: string,
        description: string,
    }>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [hasChange, setHasChange] = React.useState(false);
    const [errors, setErrors] = React.useState<{ ministryName?: string, description?: string }>({});

    React.useEffect(() => {
        onLoading(isLoading)
    }, [isLoading]);

    React.useEffect(() => {
        setBaseData({
            ministryName: data.ministryName,
            description: data.description,
        });
        setEditData({
            ministryName: data.ministryName,
            description: data.description,
        });
    }, [data]);

    React.useEffect(() => {
        editData && baseData && setHasChange(!areObjectsMatching(baseData, editData))
    }, [editData, baseData]);
    
    React.useEffect(() => {
        editData && debounce(async () => {
            try {
                await validationSchema.validate(editData, { abortEarly: false });
                setErrors({});
            } catch (error: any) {
                if (error instanceof Yup.ValidationError) {
                    const validationErrors: { [K in keyof typeof editData]?: string } = {}; // Define the type of validationErrors
                    error.inner.forEach((err) => {
                        if (err.path) {
                            validationErrors[err.path as keyof typeof editData] = err.message;
                        }
                    });
    
                    setErrors(validationErrors);
                }
            }
        }, 300)();
    }, [editData]);

    return(
        <div className={className}>
            <div className="input-group">
                <Input disabled={isLoading} value={editData?.ministryName} error={errors.ministryName} type="text" placeholder="Title" onValChange={(val) => setEditData({...editData, ministryName: val as string} as typeof editData)} />
                <Input disabled={isLoading} value={editData?.description} error={errors.description} type="text" placeholder="Description" onValChange={(val) => setEditData({...editData, description: val as string} as typeof editData)}/>
            </div>
            <div className="btn-submit-area">
                <Button disabled={!(hasChange)} label="Revert changes" onClick={() => {
                    setEditData({...baseData} as typeof editData)
                }}/>
                <Button disabled={!(hasChange) || (hasChange && Object.values(errors).length > 0)} label="Submit changes" color="edit" 
                onClick={() => {
                    setIsLoading(true);
                    doRequest({
                        url: `/update-ministry-info/${data.ministryUID}`,
                        method: "PATCH",
                        data: {ministryName: editData?.ministryName, description: editData?.description}
                    })
                    .then(response => {
                        addSnackbar("Update success", 'default', 5);
                        setBaseData({...editData} as typeof baseData)
                        setIsLoading(false);
                        update(editData as { ministryName: string, description: string })
                    })
                    .catch(err => {
                        addSnackbar("Update error", 'error', 5);
                        setIsLoading(false);
                    })
                }}/>
            </div>
        </div>
    )
}

const EditMinistryForm = styled(EditMinistryFC)`
    display: flex;
    flex: 0 1 100%;
    justify-content: center;
    flex-wrap: wrap;

    .input-group {
        display: flex;
        flex: 0 1 100%;
        height: fit-content;
        align-content: flex-start;
        flex-wrap: wrap;

        ${Input} {
            flex: 0 1 100%;
            margin: 25px 0;
        }

        ${Button} {
            margin-left: auto;
        }
    }


    .btn-submit-area {
        display: flex;
        flex: 0 1 100%;
        margin-top: 5px;
        justify-content: flex-end;
        /* border-top: 1px solid ${({theme}) => theme.borderColor}; */
        padding-top: 20px;
        gap: 10px;
    }

`;

export default EditMinistryForm;