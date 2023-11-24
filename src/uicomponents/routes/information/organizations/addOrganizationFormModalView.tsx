import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../../../IStyledFC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Input from "../../../reusables/Inputs/Input";
import Button from "../../../reusables/Buttons/Button";
import Alert from "../../../reusables/Alert";
import Devider from "../../../reusables/devider";
import AvatarPicker from "../../../reusables/AvatarPicker/AvatarPicker";
import useFormControl from "../../../../utils/hooks/useFormControl";
import { AvatarUploaderComponent, useAvatarUploaderContext } from "../../../reusables/AvatarUploader/AvatarUploader";
import addOrganization from "../../../../API/addOrganization";
import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";

interface IAddOrganizationForm extends IStyledFC {
    onLoading: (isLoading: boolean) => void;
}
const FCAddOrganizationForm: React.FC<IAddOrganizationForm> = ({className, onLoading}) => {
    const addSnackBar = useAddSnackBar();
    const [isUploadingDp, setIsUploadingDp] = React.useState(false);
    const [errorUploadingDp, setErrorUploadingDp] = React.useState(false);
    const [tempDpName, setTempDpName] = React.useState<null | string>(null); 
    const [disablePictureInput, setDisablePictureInput] = React.useState(false);
    const [resetDpInputValue, setResetDpInputValue] = React.useState(false);

    const [isLoading, setIsLoading] = React.useState(false);
    const [addOrganizationForm, addOrganizationFormValues, addOrganizationFormDispatchers] = useFormControl({
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
            minValLen: 4,
            maxValLen: 100,
            required: false,
            errorText: "invalid Input"
        }
    });

    // React.useEffect(() => {
    //     addOrganizationFormDispatchers?.avatar(imageTmpUploaded as string | null);
    // }, [imageTmpUploaded]);

    React.useEffect(() => {
        onLoading(isLoading)
    }, [isLoading])
    return(
        <div className={className}>
            <div className="input-group">
                <Input disabled={isLoading} value={addOrganizationFormValues.title as string} error={addOrganizationForm.errors.title} type="text" placeholder="Title" onValChange={(val) => addOrganizationFormDispatchers({...addOrganizationFormValues, title: val})} />
                <Input disabled={isLoading} value={addOrganizationFormValues.description as string} error={addOrganizationForm.errors.description} type="text" placeholder="Description" onValChange={(val) => addOrganizationFormDispatchers({...addOrganizationFormValues, description: val})}/>
            </div>
            <Alert severity="info" variant="default">
            While it is not mandatory, you have the option to upload a display picture or logo for the ministry if you wish to do so.
            </Alert>
            <AvatarUploaderArea>
                <AvatarPicker onChange={(avatar) => {
                    addOrganizationFormDispatchers({...addOrganizationFormValues, avatar});
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
                <Button 
                isLoading={isLoading || isUploadingDp} 
                disabled={isLoading || !addOrganizationForm.isReady || errorUploadingDp as boolean || isUploadingDp as boolean} 
                label="Add Organization" 
                icon={<FontAwesomeIcon icon={["fas", "plus"]} />} 
                color="primary" 
                onClick={() => {
                    setIsLoading(true);
                    setDisablePictureInput(true);
                    addOrganization({name: (addOrganizationFormValues.title as string).trim(), description: (addOrganizationFormValues.description as string).trim(), avatar: addOrganizationFormValues.avatar as string | null})
                    .then(response => {
                        if(response.success) {
                            setIsLoading(false);
                            setResetDpInputValue(true);
                            setDisablePictureInput(false);
                            addOrganizationForm.clear();
                            addSnackBar("Successfully added new organization", "success", 5);
                        }
                        else throw response
                    })
                    .catch(error => {
                        setIsLoading(false);
                        setDisablePictureInput(false);
                        addSnackBar("Error Adding Organization", "error", 5);
                    });

                }} />
            </div>
        </div>
    )
}

const AddOrganizationForm = styled(FCAddOrganizationForm)`
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
`

export default AddOrganizationForm;