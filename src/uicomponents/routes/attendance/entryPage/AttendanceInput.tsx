import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../../../IStyledFC";
import DataDisplayChip from "../../../reusables/DataDisplayChip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchAttenderByName from "./SearchByNameEntry";
import Input from "../../../reusables/Inputs/Input";
import CameraQrCodeScanner from "./CameraQrCodeScanner";
import QRCodeScannerInput from "./QRCodeScannerInput";

const Mover = styled.div<{state: string}>`
    position: fixed;
    top: ${prop => prop.state == "open" || prop.state == "isloading" || prop.state == "iserror"? 0 : '-20%'};
    opacity: ${prop => prop.state == "open" || prop.state == "isloading" || prop.state == "iserror"? 1 : 0.1};
    left: 0;
    display: flex;
    width: 100%;
    height: 100vh;
    /* align-items: center; */
    justify-content: center;
    background: transparent;
    transition: top 300ms, opacity 200ms;
    overflow: auto;
`;

interface IAttendanceInput extends IStyledFC {
    attendanceType: "basic" | "detailed";
    attender: "all" | "select";
    presents?: string[];
    attenders?: ({ name: string, picture: string | null, memberUID: string})[],
    entryUID: string;
    session: number;
    categoryUID: string;
    onClose: () => void,
    state: "close" | "ondisplay" | "open" | "remove",
}

const FCModal: React.FC<IAttendanceInput> = ({className, onClose, state, attendanceType, entryUID, categoryUID, attender, attenders, session, presents}) => {
    const [formState, updateModalState] = React.useState<"close" | "ondisplay" | "open" | "remove" | "inactive">(state);
    const [inputType, setInputType] = React.useState<"camera" | "search" | "scanner">("search");
    const [entryType, setEntryType] = React.useState<'time-in' | "time-out">('time-in');
    
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
        updateModalState(state);
    }, [state]);
    return ( 
        <div className={className} 
        onClick={(e) => {
            updateModalState("close");
        }}>
            <Mover state={formState}>
                <ModalContent onClick={(e) => e.stopPropagation()}>
                    <div className="input-type-selector-container">
                        <DataDisplayChip clickable action={() => setInputType("search")} variant={inputType == "search"? "filled" : "outlined"} icon={<FontAwesomeIcon icon={["fas", "search"]} />}>Search by name</DataDisplayChip>
                        <DataDisplayChip clickable action={() => setInputType("camera")} variant={inputType == "camera"? "filled" : "outlined"} icon={<FontAwesomeIcon icon={["fas", "qrcode"]} />}>Scan w/ camera</DataDisplayChip>
                        <DataDisplayChip clickable action={() => setInputType("scanner")} variant={inputType == "scanner"? "filled" : "outlined"} icon={<FontAwesomeIcon icon={["fas", "qrcode"]} />}>Scan w/ usb qrcode scanner</DataDisplayChip>
                    </div>
                    {
                        attendanceType == "detailed" && 
                        <div className="entry-type-input-group">
                            <div className="time-in">
                                <Input type="checkbox" checked={entryType == "time-in"} name="time-in" placeholder="Time-in" label="Time-in" onValChange={(val) => {
                                    const v = val as boolean;
                                    if(v) setEntryType('time-in');
                                }}/>
                            </div>
                            <div className="time-out">
                                <Input type="checkbox" checked={entryType == "time-out"} name="time-out" placeholder="Time-out" label="Time-out" onValChange={(val) => {
                                    const v = val as boolean;
                                    if(v) setEntryType('time-out')
                                }}/>
                            </div>
                        </div>
                    }
                    <div className="input-container">
                        {
                           inputType == "search"? <SearchAttenderByName categoryUID={categoryUID} presents={presents? presents : []} attendanceType={attendanceType} entryUID={entryUID} attender={attender} attenders={attenders} session={session} entryType={entryType} /> :
                           inputType == "camera"? <CameraQrCodeScanner categoryUID={categoryUID} attendanceType={attendanceType} entryUID={entryUID} attender={attender} session={session} entryType={entryType} /> :
                           inputType == "scanner"? <QRCodeScannerInput categoryUID={categoryUID} attendanceType={attendanceType} entryUID={entryUID} attender={attender} session={session} entryType={entryType} /> : ""
                        }
                    </div>
                </ModalContent>
            </Mover>
        </div>
    )
}

const ModalContent = styled.div`
    display: flex;
    flex: 0 1 700px;
    height: fit-content;
    padding: 30px;
    margin: 20px 0;
    flex-wrap: wrap;
    background-color: ${({theme}) => theme.background.primary};
    border-radius: 5px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

    && .entry-type-input-group {
        display: flex;
        flex: 0 1 100%;
        flex-wrap: wrap;
        gap: 5px;
        margin: 15px 0 10px 0;

        .time-in, .time-out {
            display: flex;
            flex: 1;
            min-width: 200px;
            border-radius: 5px;
            /* justify-content: center; */
            align-items: center;
            background-color: #3f51b559;
            color: white;
        }

        .time-out {
            background-color: #00968869;
        }

    }


    && > .input-type-selector-container {
        display: flex;
        flex: 0 1 100%;
        flex-wrap: wrap;
        height: fit-content;
        gap: 10px;
        justify-content: center;
        align-items: center;

        ${DataDisplayChip} {
            cursor: pointer;
        }
    }

    && > .input-container {
        display: flex;
        flex: 0 1 100%;
        padding: 20px 0;
    }

    @media screen and (max-width: 600px) {
        /* height: 100vh; */
    }
`;

const AttendanceInput = styled(FCModal)`
    position: fixed;
    display: flex;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 29, 57, 0.09);
    backdrop-filter: blur(1px);     
    z-index: 5000;
    left: 0;
    top: 0;
    overflow: auto;
`;

export default AttendanceInput;

