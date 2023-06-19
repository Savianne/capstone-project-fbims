import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../../../IStyledFC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Input from "../../../reusables/Inputs/Input";
import Button from "../../../reusables/Buttons/Button";
import useFormControl from "../../../../utils/hooks/useFormControl";
import { AvatarUploaderComponent, useAvatarUploaderContext } from "../../../reusables/AvatarUploader/AvatarUploader";
import addOrganization from "../../../../API/addOrganization";
import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";

interface IAddOrganizationForm extends IStyledFC {
    onLoading: (isLoading: boolean) => void;
}
const FCAddOrganizationForm: React.FC<IAddOrganizationForm> = ({className, onLoading}) => {
    const addSnackBar = useAddSnackBar();
    const [
        disabled, setDisabled,
        imageTmpUploaded, setImageTmpUploaded,
        isDeletingTmpImage, setIsDeletingTmpImage,
        isUploading, setIsUploading,
        uploadProgress, setUploadProgress,
        imageReplace, setImageReplace,
        selectedImage, setSelectedImage,
        errorUpload, setErrorUpload,
        getRootProps, getInputProps, isDragActive,
        reset,
      ] = useAvatarUploaderContext();

    const [isLoading, setIsLoading] = React.useState(false);
    const [addOrganizationForm, addOrganizationFormDispatchers] = useFormControl({
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

    React.useEffect(() => {
        addOrganizationFormDispatchers?.avatar(imageTmpUploaded as string | null);
    }, [imageTmpUploaded]);

    React.useEffect(() => {
        onLoading(isLoading)
    }, [isLoading])
    return(
        <div className={className}>
            <AvatarUploaderArea>
                <AvatarUploaderComponent context={[
                    disabled, setDisabled,
                    imageTmpUploaded, setImageTmpUploaded,
                    isDeletingTmpImage, setIsDeletingTmpImage,
                    isUploading, setIsUploading,
                    uploadProgress, setUploadProgress,
                    imageReplace, setImageReplace,
                    selectedImage, setSelectedImage,
                    errorUpload, setErrorUpload,
                    getRootProps, getInputProps, isDragActive,
                    reset,
                ]} />
            </AvatarUploaderArea>
            <div className="input-group">
                <Input disabled={isLoading} value={addOrganizationForm.values.title as string} error={addOrganizationForm.errors.title} type="text" placeholder="Title" onValChange={(val) => addOrganizationFormDispatchers?.title(val)} />
                <Input disabled={isLoading} value={addOrganizationForm.values.description as string} error={addOrganizationForm.errors.description} type="text" placeholder="Description" onValChange={(val) => addOrganizationFormDispatchers?.description(val)}/>
                <Button isLoading={isLoading} disabled={!addOrganizationForm.isReady || isDeletingTmpImage as boolean || isUploading as boolean} label="Add Organization" icon={<FontAwesomeIcon icon={["fas", "plus"]} />} color="primary" onClick={() => {
                    setIsLoading(true);
                    (setDisabled as React.Dispatch<React.SetStateAction<boolean>>)(true);
                    addOrganization({name: addOrganizationForm.values.title as string, description: addOrganizationForm.values.description as string, avatar: addOrganizationForm.values.avatar as string | null})
                    .then(response => {
                        if(response.success) {
                            setIsLoading(false);
                            (setDisabled as React.Dispatch<React.SetStateAction<boolean>>)(false);
                            selectedImage && !isUploading && (reset as () => void)();
                            addOrganizationForm.clear();
                            addSnackBar("Successfully added new organization", "success", 5);
                        }
                        else throw response
                    })
                    .catch(error => {
                        setIsLoading(false);
                        (setDisabled as React.Dispatch<React.SetStateAction<boolean>>)(false);
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
    margin-top: 30px;
    /* flex-wrap: wrap; */

    .input-group {
        display: flex;
        flex: 0 1 450px;
        height: 400px;
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

`;

const AvatarUploaderArea = styled.div`
    display: flex;
    width: 350px;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;

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

export default AddOrganizationForm;