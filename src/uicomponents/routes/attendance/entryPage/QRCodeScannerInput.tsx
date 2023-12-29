import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PuffLoader, BounceLoader, ClipLoader } from "react-spinners";
import { IStyledFC } from "../../../IStyledFC";
import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";
import useConfirmModal from "../../../reusables/ConfirmModal/useConfirmModal";
import ConfirmModal from "../../../reusables/ConfirmModal/ConfirmModal";
import doRequest from "../../../../API/doRequest";
import getCurrentTime from "../../../../utils/helpers/getCurrentTime";

interface IQRCodeScannerInputProps extends IStyledFC {
    attendanceType: "basic" | "detailed",
    entryUID: string,
    attender: "all" | "select",
    session: number,
    categoryUID: string,
    entryType?: 'time-in' | "time-out"
}

const QRCodeScannerInputFC: React.FC<IQRCodeScannerInputProps> = ({className, attendanceType, entryUID, entryType, session, attender, categoryUID}) => {
    const inputRef = React.useRef<null | HTMLInputElement>(null)
    const addSnackBar = useAddSnackBar();
    const {modal, confirm} = useConfirmModal();
    const {modal: warningModal, confirm: confirmWarningModal} = useConfirmModal();
    const [isFocust, setIsFocust] = React.useState(false);
    const [scannedQRValue, setScannedQRValue] = React.useState("");
    const [allowScan, setAllowScan] = React.useState(true);
    const [sucessScan, setSuccessScan] = React.useState(false);
    const handleScan = React.useCallback((val: string) => {
        if(allowScan) setScannedQRValue(val)
    }, [allowScan]);
    const handleSubmit = React.useCallback(() => {
        if(allowScan) submitScannedValue(scannedQRValue);
    }, [scannedQRValue, allowScan])

    const submitScannedValue = (value: string) => {
        if(value) {
            setAllowScan(false);
            if(attendanceType == "basic") {
                doRequest({
                    method: "POST",
                    url: "/attendance/add-present",
                    data: {
                        attender,
                        entryUID,
                        memberUID: value,
                        session,
                        categoryUID
                    }
                })
                .then(() => {
                    setSuccessScan(true);
                    setTimeout(() => {
                        setScannedQRValue("");
                        setAllowScan(true);
                        setSuccessScan(false);
                    }, 2000);
                })
                .catch(err => {
                    if(typeof err == "string") {
                        switch(err.toUpperCase()) {
                            case "UNKOWN ID": 
                                confirm("Invalid Code", "Oops! The scanned barcode is invalid. Please check and try again.", () => {
                                    setAllowScan(true);
                                    setScannedQRValue("");
                                }, () => {
                                    setAllowScan(true);
                                    setScannedQRValue("");
                                });
                                break;
                            case "ALREADY PRESENT": 
                                confirmWarningModal("Already Present", "The scanned QR code corresponds to an attendee already on the preset list. ", 
                                () => {
                                    setAllowScan(true);
                                    setScannedQRValue("");
                                } , () => {
                                    setAllowScan(true);
                                    setScannedQRValue("");
                                });
                                break;
                            default:
                                addSnackBar('Error occured, please try again!', "error", 5);
                                setScannedQRValue("");
                        } 
                    } else {
                        addSnackBar('Error occured, please try again!', "error", 5);
                        setScannedQRValue("");
                    }
                })
            } else {
                if(entryType == "time-in") {
                    doRequest({
                        method: "POST",
                        url: "/attendance/add-time-in",
                        data: {
                            attender,
                            entryUID,
                            memberUID: value,
                            session,
                            categoryUID,
                            timeIn: getCurrentTime()
                        }
                    })
                    .then(() => {
                        setSuccessScan(true);
                        setTimeout(() => {
                            setScannedQRValue("");
                            setAllowScan(true);
                            setSuccessScan(false);
                        }, 2000);
                    })
                    .catch(err => {
                        if(typeof err == "string") {
                            switch(err.toUpperCase()) {
                                case "UNKOWN ID": 
                                    confirm("Invalid Code", "Oops! The scanned barcode is invalid. Please check and try again.", 
                                    () => {
                                        setAllowScan(true);
                                        setScannedQRValue("");
                                    }, 
                                    () => {
                                        setAllowScan(true);
                                        setScannedQRValue("");
                                    });
                                    break;
                                case "HAS PENDING TIME-OUT": 
                                    confirmWarningModal("Pending Time-Out", "The attendee has a pending time-out. Please wait for the previous action to complete before attempting to time in again.", 
                                    () => {
                                        setAllowScan(true);
                                        setScannedQRValue("");
                                    } , () => {
                                        setAllowScan(true);
                                        setScannedQRValue("");
                                    });
                                    break;
                                default:
                                    addSnackBar('Error occured, please try again!', "error", 5);
                                    setScannedQRValue("");
                            } 
                        } else {
                            addSnackBar('Error occured, please try again!', "error", 5);
                            setScannedQRValue("");
                        }
                    }) 
                } else {
                    doRequest({
                        method: "POST",
                        url: "/attendance/add-time-out",
                        data: {
                            attender,
                            entryUID,
                            memberUID: value,
                            session,
                            categoryUID,
                            timeOut: getCurrentTime()
                        }
                    })
                    .then(() => {
                        setSuccessScan(true);
                        setTimeout(() => {
                            setScannedQRValue("");
                            setAllowScan(true);
                            setSuccessScan(false);
                        }, 2000);
                    })
                    .catch(err => {
                        if(typeof err == "string") {
                            switch(err.toUpperCase()) {
                                case "UNKOWN ID": 
                                    confirm("Invalid Code", "Oops! The scanned barcode is invalid. Please check and try again.", () => setAllowScan(true), () => setAllowScan(true));
                                    break;
                                case "NO PENDING TIME-OUT": 
                                    confirmWarningModal("No Time-in", "The attendee has no pending time-out to complete. Please Time-in firt.", 
                                    () => {
                                        setAllowScan(true);
                                        setScannedQRValue("");
                                    } , () => {
                                        setAllowScan(true);
                                        setScannedQRValue("");
                                    });
                                    break;
                                default:
                                    addSnackBar('Error occured, please try again!', "error", 5);
                                    setScannedQRValue("");
                            } 
                        } else {
                            addSnackBar('Error occured, please try again!', "error", 5);
                            setScannedQRValue("");
                        }
                    }) 
                }
            }
        }
    }
    
    return(
        <div className={className}>
            {
                isFocust && <>
                <span className="scanner-indicator">
                    <BounceLoader size={50} color="#36d7b7" />
                </span>
                <span className="scanner-indicator">
                    <PuffLoader size={300} color="#36d7b7" />
                </span>
                </>
            }
            <span className="fa-stack qricon" onClick={() => {
                inputRef.current?.focus();
            }}>
                <FontAwesomeIcon icon={['fas', 'expand']} className="fa-stack-2x" style={{opacity: '0.2'}} />
                <FontAwesomeIcon icon={["fas", "qrcode"]} className="fa-stack-1x" style={{opacity: '0.5'}} />
            </span>
            <form 
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                <input 
                autoFocus 
                type="text" 
                ref={inputRef}
                value={scannedQRValue}
                onChange={(e) => handleScan(e.target.value)}
                onFocus={() => setIsFocust(true)}
                onBlur={(e) => {
                    e.preventDefault();
                    setIsFocust(false)
                    e.target.focus();
                }} />
            </form>
            {
                sucessScan && <div className="scan-success">
                    <FontAwesomeIcon icon={['fas', 'check']} />
                    <p><ClipLoader color="inherit" size={15} cssOverride={{marginRight: '5px'}}/>{attendanceType == "basic"? "Success" : entryType == "time-in"? "Time-in Success" : "Time-out Success"}, Please wait...</p>
                </div>
            }
            <ConfirmModal context={modal} variant={"error"} />
            <ConfirmModal context={warningModal} variant={"warning"} />
        </div>
    )
}

const QRCodeScannerInput = styled(QRCodeScannerInputFC)`
    position: relative;
    display: flex;
    flex: 0 1 400px;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    aspect-ratio: 1/1;
    color: ${({theme}) => theme.textColor.light};

    && > .qricon {
        font-size: 100px;
    }

    && > .scanner-indicator {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.3;
    }

    && form {
        position: absolute;
        top: 0;
        left: 0;

        > input {
            width: 0;
            height: 0;
            opacity: 0;
            cursor: default;
        }
    }

    && .scan-success {
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 29, 57, 0.09);
        backdrop-filter: blur(5px);    
        font-size: 100px;
        color: ${({theme}) => theme.staticColor.edit};

        > p {
            display: flex;
            flex: 0 1 100%;
            justify-content: center;
            align-items: center;
            margin-top: 10px;
            font-size: 18px;
            /* color: ${({theme}) => theme.textColor.strong} */
        }
    }
`;

export default QRCodeScannerInput;