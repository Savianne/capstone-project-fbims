import React from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IStyledFC } from "../../IStyledFC";

import { DeleteModalContextProvider } from "./DeleteModalContext";
import useAddSnackBar from "../SnackBar/useSnackBar";
import Devider from "../devider";
import Button from "../Buttons/Button";

const FCDeleteModal: React.FC<IStyledFC> = ({className}) => {
    const addSnackBar = useAddSnackBar();
    const deleteModalContext = React.useContext(DeleteModalContextProvider);
    const [showBlinker, updateShowBlinker] = React.useState(false);
    const [isDeleting, updateIsDeleting] = React.useState(false);

    React.useEffect(() => {
        if(showBlinker) {
            setTimeout(() => {
                updateShowBlinker(false);
            }, 600)
        }
    }, [showBlinker]);
    return (
        !(deleteModalContext?.modalState == "inactive")? 
        <div className={className}>
            <Mover state={deleteModalContext?.modalState as string} onClick={() => updateShowBlinker(true)}>
                <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-head">
                        { showBlinker &&  <div className="blinker"></div> } 
                        <div className="close-btn-area">
                            <span className="close-btn-container">
                                <Button 
                                label="close" 
                                icon={<FontAwesomeIcon icon={["fas", "times"]} />} 
                                variant="hidden-bg-btn"
                                onClick={(e) => deleteModalContext?.closeDeleteModal()} 
                                iconButton />
                            </span>
                        </div>
                        <div className="warning-text">
                            <span className="warning-icon">
                                <FontAwesomeIcon icon={["fas", "circle-exclamation"]} />
                            </span>
                            <h1>Are you sure about this Action?</h1>
                        </div>
                    </div>
                    <div className="modal-body">
                        <h1>Warning! This action can not be undone.</h1>
                        <h2>You are about to delete</h2>
                        <h3>{deleteModalContext?.itemName}</h3>
                        <div className="modal-btn-container">
                            <Button 
                            isLoading={isDeleting}
                            icon={<FontAwesomeIcon icon={["fas", "trash"]} />} 
                            variant="hidden-bg-btn"
                            color="delete"
                            onClick={(e) => {
                                updateIsDeleting(true);
                                deleteModalContext?.confirmBtnAction && deleteModalContext?.confirmBtnAction()
                                .then(res => {
                                    console.log(res)
                                    if(res.success) {
                                        updateIsDeleting(false);
                                        deleteModalContext.closeDeleteModal();
                                        addSnackBar(deleteModalContext.successMessage, "default", 5);
                                    } else throw res
                                })
                                .catch(() => {
                                    updateIsDeleting(false);
                                    addSnackBar("Deletion Faild!", "error", 5);
                                })
                            }} 
                            label="Continue Delete" />
                            <Devider $orientation="vertical" />
                            <Button  
                            disabled={isDeleting}
                            color="theme"
                            onClick={(e) => deleteModalContext?.closeDeleteModal()} 
                            label="Cancel" />
                        </div>
                    </div>
                </div>
            </Mover>
        </div>
        : null 
    )
}

const blinkAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const Mover = styled.div<{state: string}>`
    position: absolute;
    top: ${prop => prop.state == "open"? 0 : '-20%'};
    opacity: ${prop => prop.state == "open"? 1 : 0.1};
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    background: transparent;
    transition: top 200ms, opacity 200ms;

`;

const DeleteModal = styled(FCDeleteModal)`
    position: fixed;
    display: flex;
    width: 100%;
    height: 100vh;
    background-color: ${({theme}) => theme.mode == "dark"? "#00000073" : "#1e1e1e38"};
    z-index: 5000;
    left: 0;
    top: 0;
    
    &{Mover} .delete-modal {
        display: flex;
        flex: 0 1 450px;
        /* height: 400px; */
        background-color: ${({theme}) => theme.background.primary};
        box-shadow: 17px 20px 61px 21px rgb(0 0 0 / 25%);
        flex-wrap: wrap;
        border-radius: 3px;
        padding-bottom: 30px;
        /* border: 1px solid ${({theme}) => theme.borderColor}; */
    }    

    &{Mover} .delete-modal .modal-head {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 1 100%;
        height: 200px;
        border-radius: 3px 3px 0 0;
        background-color: ${({theme}) => theme.mode == "dark"? "#e8000017" : "#ff02021f" };
        color: ${({theme}) => theme.textColor.strong};
        justify-items: flex-start;
    }

    &{Mover} .delete-modal .modal-head .close-btn-area {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        width: 100%;
        height: 40px;
    }

    &{Mover} .delete-modal .modal-head .warning-text {
        display: flex;
        justify-content: center;
        width: fit-content;
        height: fit-content;
        flex-wrap: wrap;
        font-size: 18px;
        font-weight: 500;
        color: #fe3535;
    }

    &{Mover} .delete-modal .modal-head .warning-text .warning-icon {
        font-size: 50px;
    }

    &{Mover} .delete-modal .modal-head .warning-text h1 {
        flex: 0 1 100%;
        text-align: center;
    }

    &{Mover} .delete-modal .modal-head .close-btn-area .close-btn-container ${Button} {
        :hover {
            background-color: transparent;
        }
    }

    &{Mover} .delete-modal .modal-head .blinker {
        display: flex;
        width: 100%;
        height: 100%;
        border-radius: 3px 3px 0 0;
        position: absolute;
        top: 0;
        left: 0;
        animation: ${blinkAnimation} 200ms infinite;
        background-color: ${({theme}) => theme.background.light};
    }

    &{Mover} .delete-modal .modal-head .close-btn-area .close-btn-container {
        margin-left: auto;
    }

    &{Mover} .delete-modal .modal-body {
        display: flex;
        flex: 0 1 100%;
        flex-wrap: wrap;
        justify-content: center;
        color:  ${({theme}) => theme.textColor.strong};

        h1, h2, h3 {
            width: 100%;
            text-align: center;
        }

        h1 {
            font-size: 18px;
            padding: 15px 0;
            font-weight: 500;
        }

        h2 {
            font-weight: 100;
        }

        h3 {
            text-decoration: underline;
        }

        .modal-btn-container {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 0 1 100%;
            height: 40px;
            padding: 20px 0;
        }
    }
`;

export default DeleteModal;
