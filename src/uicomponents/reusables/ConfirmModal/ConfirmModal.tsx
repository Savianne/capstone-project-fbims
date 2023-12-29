import { useState, useEffect } from "react";
import useConfirmModal from "./useConfirmModal";
import styled from "styled-components";
import { IStyledFC } from "../../IStyledFC";
import Button from "../Buttons/Button";
import Devider from "../devider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type TModalContext = {
    closeModal: () => void;
    confirmText: string;
    confirmTitle: string;
    confirmedCB: (() => void) | null;
    cancelledCB: (() => void) | null;
    modalState: "close" | "active" | "open" | "remove" | "inactive"
}

interface IConfirmModal extends IStyledFC {
    context: TModalContext;
    variant: "warning" | "delete" | "error" | "info" | "default"
}
const ConfirmModalFC: React.FC<IConfirmModal> = ({context, variant, className}) => {
    return (
        !(context.modalState == "inactive")? <div className={className}>
            <Mover state={context.modalState}>
                <Modal variant={variant}>
                    <div className="modal-content">
                        <div className="icon">
                            {
                                variant == "warning"? <FontAwesomeIcon icon={["fas", "exclamation-triangle"]} />:
                                variant == "error"? <FontAwesomeIcon icon={["fas", "exclamation-circle"]} />:
                                variant == "delete"? <FontAwesomeIcon icon={["fas", "trash"]} />:
                                variant == "info"? <FontAwesomeIcon icon={["fas", "info-circle"]} />:
                                <FontAwesomeIcon icon={["fas", "question-circle"]} />
                            }
                            
                        </div>
                        <div className="text">
                            <h2 className="title-text">{context.confirmTitle}</h2>
                            <p className="info-text">{context.confirmText}</p>
                        </div>
                    </div>
                    <Devider $orientation="horizontal" />
                    <div className="btn-group-area">
                        {
                            context.confirmedCB? 
                            <Button 
                            color="primary"
                            onClick={() => {
                                context.confirmedCB && context.confirmedCB();
                                context.closeModal();
                            }} 
                            label="Continue" /> : ""
                        }
                        {/* <Devider $orientation="vertical" $variant="middle"/> */}
                        <Button 
                        // variant="bordered-btn"
                        color="theme"
                        onClick={() => {
                            context.cancelledCB && context.cancelledCB()
                            context.closeModal();
                        }} label="Cancel"/>
                        
                    </div>
                </Modal>
            </Mover>
        </div> : null
    )
}

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

const Modal = styled.div<{variant: "warning" | "delete" | "error" | "info" | "default"}>`
    display: flex;
    flex: 0 1 350px;
    flex-wrap: wrap;
    height: fit-content;
    background-color: ${({theme}) => theme.background.primary};
    box-shadow: 17px 20px 61px 21px rgb(0 0 0 / 25%);
    border-radius: 3px;
    border-top: 5px solid ${(props) => props.variant == "default"? '#979797' : props.variant == "delete" || props.variant == "error"? props.theme.staticColor.delete : props.variant == "info"? props.theme.staticColor.primary : props.theme.staticColor.warning};
    
    .modal-content {
        display: flex;
        flex: 0 1 100%;
        align-items: center;
        padding: 10px 25px;

        .icon {
            width: fit-content;
            height: fit-content;
            font-size: 40px;
            margin-right: 25px;
            color: ${(props) => props.variant == "default"? '#979797' : props.variant == "delete" || props.variant == "error"? props.theme.staticColor.delete : props.variant == "info"? props.theme.staticColor.primary : props.theme.staticColor.warning};
        }

        .text {
            color: ${({theme}) => theme.textColor.strong};

            .title-text {
                font-weight: 600;
            }

            .info-text {
                font-size: 11px;
            }
        }
    }

    .btn-group-area {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 5px;
        padding: 0 10px 10px 10px;
        flex: 0 1 100%;

        ${Button} {
            margin: 0; 
        }
    }
`

const ConfirmModal = styled(ConfirmModalFC)`
    position: fixed;
    display: flex;
    width: 100%;
    height: 100vh;
    background-color: ${({theme}) => theme.mode == "dark"? "#00000073" : "#1e1e1e38"};
    z-index: 5000;
    left: 0;
    top: 0;
`;

export default ConfirmModal;

