import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../../../IStyledFC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Input from "../../../reusables/Inputs/Input";
import Button from "../../../reusables/Buttons/Button";
import AvatarUploader from "../../../reusables/AvatarUploader/AvatarUploader";
import useFormControl from "../../../../utils/hooks/useFormControl";
import { AvatarUploaderComponent, useAvatarUploaderContext } from "../../../reusables/AvatarUploader/AvatarUploader";
import addMinistry from "../../../../API/addMinistry";

const FCAddMinistryForm: React.FC<IStyledFC> = ({className}) => {
    const [
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

    const [isLoading, setIsLoading] = React.useState(false)
    const [addMinistryForm, addMinistryFormDispatchers] = useFormControl({
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
        addMinistryFormDispatchers?.avatar(imageTmpUploaded as string | null);
    }, [imageTmpUploaded])
    return(
        <div className={className}>
            <AvatarUploaderArea>
                <AvatarUploaderComponent context={[
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
                <Input disabled={isLoading} value={addMinistryForm.values.title as string} error={addMinistryForm.errors.title} type="text" placeholder="Title" onValChange={(val) => addMinistryFormDispatchers?.title(val)} />
                <Input disabled={isLoading} value={addMinistryForm.values.description as string} error={addMinistryForm.errors.description} type="text" placeholder="Description" onValChange={(val) => addMinistryFormDispatchers?.description(val)}/>
                <Button isLoading={isLoading} disabled={!addMinistryForm.isReady || isDeletingTmpImage as boolean || isUploading as boolean} label="Add Mnistry" icon={<FontAwesomeIcon icon={["fas", "plus"]} />} color="primary" onClick={() => {
                    setIsLoading(true)
                    addMinistry({name: addMinistryForm.values.title as string, description: addMinistryForm.values.description as string, avatar: addMinistryForm.values.avatar as string | null})
                    .then(response => {
                        if(response.success) {
                            setIsLoading(false);
                            selectedImage && !isUploading && (reset as () => void)();
                            addMinistryForm.clear();
                        }
                        else throw response
                    })
                    .catch(error => {
                        setIsLoading(false);
                        addMinistryForm.clear()
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

export default AddMinistryForm;