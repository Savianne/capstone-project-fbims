import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../reusables/Buttons/Button";
import { IStyledFC } from "../../../IStyledFC";
import Avatar from "../../../reusables/Avatar";
import AvatarPicker from "../../../reusables/AvatarPicker/AvatarPicker";
import Alert from "../../../reusables/Alert";
import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";
import doRequest from "../../../../API/doRequest";

interface IUpdateOrgDp extends IStyledFC {
    onLoading: (isLoading: boolean) => void;
    data: {
        organizationUID: string,
        organizationName: string,
        picture: string | null
    },
    update: (dp: string | null) => void
}


const UpdateOrgDPFC: React.FC<IUpdateOrgDp> = ({className, onLoading, data, update}) => {
    const addSnackBar = useAddSnackBar()
    const [displayPic, setDisplayPic] = React.useState(data.picture);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isUploadingDp, setIsUploadingDp] = React.useState(false);
    const [errorUploadingDp, setErrorUploadingDp] = React.useState(false);
    const [disablePictureInput, setDisablePictureInput] = React.useState(false);
    const [resetDpInputValue, setResetDpInputValue] = React.useState(false);
    const [changePic, setChangePic] = React.useState(false);

    React.useEffect(() => {
        onLoading(isLoading)
    }, [isLoading]);

    React.useEffect(() => {
        setDisplayPic(data.picture);
    }, [data])
    return(
        <div className={className}>
            <div className="edit-picture-area">
                {
                    displayPic && changePic == false? <>
                        <Avatar src={data.picture} alt={data.organizationName} size="150px" />
                        <div  className="row">
                            <Button disabled={isLoading} icon={<FontAwesomeIcon icon={["fas", "times"]} />} label="Remove picture" onClick={() => {
                                setIsLoading(true)
                                doRequest({
                                    url: `/update-organization-dp/remove/${data.organizationUID}/${data.picture}`,
                                    method: "PATCH"
                                })
                                .then(response => {
                                    if(response.success) {
                                        addSnackBar("Display picture removed successfully", "default", 5);
                                        update(null);
                                        setIsLoading(false);
                                    } else throw "Error occured"
                                })
                                .catch(err => {
                                    addSnackBar("Failed to remove picture", "error", 5);
                                    setIsLoading(false);
                                })
                            }} />
                            {/* <Devider $orientation="vertical"/> */}
                            <Button disabled={isLoading} icon={<FontAwesomeIcon icon={["fas", "image"]} />} label="Change picture" color="edit" onClick={() => setChangePic(true)} />
                        </div>
                    </> : <>
                        <Alert severity="info" variant="default">
                            While it is not mandatory, you have the option to upload a display picture or logo for the Organization if you wish to do so.
                        </Alert>
                        <AvatarPicker onChange={(avatar) => {
                            errorUploadingDp && setErrorUploadingDp(false);
                            isUploadingDp && setIsUploadingDp(false);
                            resetDpInputValue && setResetDpInputValue(false);
                            if(avatar) {
                                setIsLoading(true)
                                doRequest({
                                    url: `/update-organization-dp/update/${data.organizationUID}/${avatar}`,
                                    method: "PATCH"
                                })
                                .then(response => {
                                    if(response.success) {
                                        addSnackBar("Successfully changed picture", "success", 5);
                                        update(avatar);
                                        setIsLoading(false);
                                        setChangePic(false)
                                    } else throw "Error occured"
                                })
                                .catch(err => {
                                    console.log(err)
                                    addSnackBar("Failed to change picture", "error", 5);
                                    setIsLoading(false);
                                })
                            }
                        }} 
                        onErrorUpload={() => setErrorUploadingDp(true)} 
                        onUpload={() => setIsUploadingDp(true)} 
                        disabledPicker={disablePictureInput || isLoading} 
                        doReset={resetDpInputValue} />
                    </>
                }
            </div>
        </div>
    )
}

const UpdateOrgDP = styled(UpdateOrgDPFC)`
    display: flex;
    flex: 0 1 100%;
    justify-content: center;
    flex-wrap: wrap;

    .edit-picture-area {
        display: flex;
        flex: 0 1 100%;
        flex-wrap: wrap;
        padding: 20px 10px 5px 10px;
        justify-content: center;
        background-color: ${({theme}) => theme.background.lighter};

        ${AvatarPicker} {
            margin-top: 15px;
        }

        .row {
            display: flex;
            flex: 0 1 100%;
            justify-content: center;
            padding: 15px 0 10px 0;
            gap: 5px;
        }
    }

    .btn-submit-area {
        display: flex;
        flex: 0 1 100%;
        margin-top: 5px;
        justify-content: flex-end;
        border-top: 1px solid ${({theme}) => theme.borderColor};
        padding-top: 20px;
        gap: 10px;
    }

`;

export default UpdateOrgDP;