import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../../../IStyledFC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Input from "../../../reusables/Inputs/Input";
import Button from "../../../reusables/Buttons/Button";
import AvatarUploader from "../../../reusables/AvatarUploader/AvatarUploader";
import Devider from "../../../reusables/devider";
import useFormControl from "../../../../utils/hooks/useFormControl";
// import { AvatarUploaderComponent, useAvatarUploaderContext } from "../../../reusables/AvatarUploader/AvatarUploader";
import AvatarPicker from "../../../reusables/AvatarPicker/AvatarPicker";
import addMinistry from "../../../../API/addMinistry";
import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";
import Alert from "../../../reusables/Alert";

interface IAddMinistryForm extends IStyledFC {
    onLoading: (isLoading: boolean) => void;
}
const FCAddMinistryForm: React.FC<IAddMinistryForm> = ({className, onLoading}) => {
    const addSnackBar = useAddSnackBar();
    const [isUploadingDp, setIsUploadingDp] = React.useState(false);
    const [errorUploadingDp, setErrorUploadingDp] = React.useState(false);
    const [tempDpName, setTempDpName] = React.useState<null | string>(null); 
    const [disablePictureInput, setDisablePictureInput] = React.useState(false);
    const [resetDpInputValue, setResetDpInputValue] = React.useState(false);

    const [isLoading, setIsLoading] = React.useState(false);
    const [addMinistryForm, addMinistryFormValues, addMinistryFormDispatchers] = useFormControl({
        title: {
            validateAs: "text",
            minValLen: 5,
            maxValLen: 100,
            required: true,
            errorText: "invalid Input"
        },
        description: {
            validateAs: "text",
            minValLen: 5,
            maxValLen: 100,
            required: true,
            errorText: "invalid Input"
        },
        avatar: {
            validateAs: "text",
            required: false,
            errorText: "invalid Input"
        }
    });

    React.useEffect(() => {
        onLoading(isLoading)
    }, [isLoading])
    return(
        <div className={className}>
            <div className="input-group">
                <Input disabled={isLoading} value={addMinistryFormValues.title as string} error={addMinistryForm.errors.title} type="text" placeholder="Title" onValChange={(val) => addMinistryFormDispatchers({...addMinistryFormValues, title: val})} />
                <Input disabled={isLoading} value={addMinistryFormValues.description as string} error={addMinistryForm.errors.description} type="text" placeholder="Description" onValChange={(val) => addMinistryFormDispatchers({...addMinistryFormValues, description: val})}/>
            </div>
            <Alert severity="info" variant="default">
            While it is not mandatory, you have the option to upload a display picture or logo for the ministry if you wish to do so.
            </Alert>
            <AvatarUploaderArea>
                <AvatarPicker onChange={(avatar) => {
                    addMinistryFormDispatchers({...addMinistryFormValues, avatar: avatar});
                    errorUploadingDp && setErrorUploadingDp(false);
                    isUploadingDp && setIsUploadingDp(false);
                    resetDpInputValue && setResetDpInputValue(false)
                }} 
                onErrorUpload={() => setErrorUploadingDp(true)} 
                onUpload={() => setIsUploadingDp(true)} 
                disabledPicker={disablePictureInput} 
                doReset={resetDpInputValue} />
            </AvatarUploaderArea>
            <Devider $orientation="horizontal"  $css="margin: 0 5px" />
            <div className="btn-submit-area">
                <Button isLoading={isLoading || isUploadingDp} disabled={isLoading || !addMinistryForm.isReady || errorUploadingDp as boolean || isUploadingDp as boolean} label="Add Mnistry" icon={<FontAwesomeIcon icon={["fas", "plus"]} />} color="primary" onClick={() => {
                setIsLoading(true);
                setDisablePictureInput(true);
                addMinistry({name: (addMinistryFormValues.title as string).trim(), description: (addMinistryFormValues.description as string).trim(), avatar: addMinistryFormValues.avatar as string | null})
                .then(response => {
                    if(response.success) {
                        setIsLoading(false);
                        setResetDpInputValue(true);
                        setDisablePictureInput(false);
                        addMinistryForm.clear();
                        addSnackBar("Successfully added a new Ministry", "success", 5)
                    }
                    else throw response
                })
                .catch(error => {
                    setIsLoading(false);
                    setDisablePictureInput(false);
                    addSnackBar("Faild to add a Ministry", "error", 5)
                });
            }} />
            </div>
        </div>
    )
}

const AddMinistryForm = styled(FCAddMinistryForm)`
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
    }

`;

const AvatarUploaderArea = styled.div`
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    margin-top: 15px;

    h1 {
        width: 100%;
        text-align: center;
        padding: 10px 0 0 0;
        font-size: 20px;
        font-weight: 500;
        height: fit-content;
    }
    /* background-color: gray; */

`

export default AddMinistryForm;