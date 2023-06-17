import React from "react";
import styled, { css, keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IStyledFC } from "../IStyledFC";
import { Scrollbars } from 'react-custom-scrollbars-2';
import ScaleLoader from "react-spinners/ScaleLoader";

//Reusable imports
import Button from "./Buttons/Button";

interface IModal extends IStyledFC {
    title: string,
    maxWidth?: string,
    onClose: () => void,
    state: "close" | "ondisplay" | "open" | "remove",
    isLoading?: boolean,
}

const FCModal: React.FC<IModal> = ({className, children, title, onClose, state, maxWidth,isLoading }) => {
    const [formState, updateModalState] = React.useState<"close" | "ondisplay" | "open" | "remove" | "inactive">(state);
    const [showBlinker, updateShowBlinker] = React.useState(false);

    React.useEffect(() => {
        if(formState == 'close') {
            setTimeout(() => {
                updateModalState("remove");
                onClose();
            }, 200);
        }
        if(formState == 'ondisplay') {
            setTimeout(() => {
                updateModalState("open")
            }, 10)
        }
    }, [formState]);

    React.useEffect(() => {
        if(showBlinker) {
            setTimeout(() => {
                updateShowBlinker(false);
            }, 600)
        }
    }, [showBlinker]);
    
    React.useEffect(() => {
        updateModalState(state);
    }, [state]);
    return ( 
        <div className={className} 
        onClick={(e) => {
            updateShowBlinker(true);
        }}>
            <Mover state={formState}>
                <ModalContent 
                maxWidth={maxWidth}
                onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        { showBlinker && <span className="blinker-warning"></span> }
                        {/* { formState == "isloading" && <ScaleLoader color="#36d7b7" height={"20px"} style={{marginLeft: "20px"}}/>} */}
                        <Button 
                        label="close" 
                        icon={<FontAwesomeIcon icon={["fas", "times"]} />} 
                        variant="hidden-bg-btn"
                        onClick={(e) => updateModalState("close")} 
                        iconButton />
                    </div>
                    <span className="title">
                        <h1>{ title }</h1>
                        { isLoading && <ScaleLoader color="#36d7b7" height={"20px"}/>}
                    </span>
                    <Scrollbars 
                    autoHide 
                    autoHeight
                    autoHeightMin={0}
                    autoHeightMax={"80vh"}>
                        <div className="modal-body">
                        { children }
                        </div>
                    </Scrollbars>
                </ModalContent>
            </Mover>
        </div>
    )
}


const blinkAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const Mover = styled.div<{state: string}>`
    position: absolute;
    top: ${prop => prop.state == "open" || prop.state == "isloading" || prop.state == "iserror"? 0 : '-20%'};
    opacity: ${prop => prop.state == "open" || prop.state == "isloading" || prop.state == "iserror"? 1 : 0.1};
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    background: transparent;
    transition: top 200ms, opacity 200ms;

`;

const Modal = styled(FCModal)`
    position: fixed;
    display: flex;
    width: 100%;
    height: 100vh;
    background-color: ${({theme}) => theme.mode == "dark"? "#00000073" : "#1e1e1e38"};
    z-index: 5000;
    left: 0;
    top: 0;
`;

const ModalContent = styled.div<{ maxWidth?: string }>`
    position: relative;
    flex-wrap: wrap;
    width: ${(props) => props.maxWidth? props.maxWidth : "800px"};
    min-width: 300px;
    max-height: 0;
    max-height: 100vh;
    border-radius: 5px;
    border: 1px solid ${({theme}) => theme.borderColor};
    background-color: ${({theme}) => theme.background.primary};
    box-shadow: 17px 20px 61px 21px rgb(0 0 0 / 25%);
    overflow: hidden;
    padding-bottom: 10px;

    .title {
        display: flex;
        padding: 0 25px;
        flex: 0 1 100%;
        z-index: 1;
        align-items: center;
    }

    .title h1 {
        font-size: 30px;
        font-weight: 600;
        color: ${({theme}) => theme.textColor.strong};
        margin-right: 10px;
    }

    .modal-header {
        position: relative;
        display: flex;
        flex: 0 1 100%;
        height: fit-content;
        padding: 5px;
        /* border-bottom: 0.5px solid ${({theme}) => theme.borderColor}; */
        background-color: ${({theme}) => theme.background.lighter};
        z-index: 1;
    }

    .modal-header ${Button} {
        margin-left: auto;
    }

    .modal-header .blinker-warning {
        display: flex;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        animation: ${blinkAnimation} 200ms infinite;
        background-color: ${({theme}) => theme.background.light};
    }

    .modal-body {
        display: flex;
        flex-wrap: wrap;
        width: fit-content
        height: fit-content;
        padding: 10px 25px;
    }

    
`
export default Modal;