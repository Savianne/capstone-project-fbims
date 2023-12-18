import React from "react";
import QrScanner from 'qr-scanner';
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IStyledFC } from "../../../IStyledFC";
import Select, { Option } from "../../../reusables/Inputs/Select";
import doRequest from "../../../../API/doRequest";
import useConfirmModal from "../../../reusables/ConfirmModal/useConfirmModal";
import ConfirmModal from "../../../reusables/ConfirmModal/ConfirmModal";
import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";
import getCurrentTime from "../../../../utils/helpers/getCurrentTime";
import { ClipLoader, FadeLoader } from "react-spinners";

interface IQRCodeCameraScanner extends IStyledFC {
    attendanceType: "basic" | "detailed",
    entryUID: string,
    attender: "all" | "select",
    session: number,
    categoryUID: string,
    entryType?: 'time-in' | "time-out"
}

const CameraQrCodeScannerFC: React.FC<IQRCodeCameraScanner> = ({className, attendanceType, entryUID, entryType, session, attender, categoryUID}) => {
    const addSnackBar = useAddSnackBar();
    const {modal, confirm} = useConfirmModal();
    const {modal: warningModal, confirm: confirmWarningModal} = useConfirmModal();
    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const [cameraDevices, setCameraDevices] = React.useState<QrScanner.Camera[] | null>(null);
    const [selectedCameraDevice, setSelectedCameraDevice] = React.useState<null | string>(null);
    const [hasCamera, setHasCamera] = React.useState(false);
    const [scannedQRValue, setScannedQRValue] = React.useState("");
    const [allowScan, setAllowScan] = React.useState(true);
    const [sucessScan, setSuccessScan] = React.useState(false);
    const qrScanner = React.useMemo(() => {
        if(videoRef.current) {
            return new QrScanner(
                videoRef.current,
                result => {
                    if(allowScan) setScannedQRValue(result.data);
                },
                { 
                    highlightScanRegion: true,
                    highlightCodeOutline: true
                 },
            )
        }
    }, [videoRef.current, allowScan]);

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
                        setSuccessScan(false);
                    }, 3500);
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
                            setSuccessScan(false);
                        }, 3500);
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
                            setSuccessScan(false);
                        }, 3500);
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
    
    const getCameraDevices = () => {
        QrScanner.listCameras(true)
        .then(res => {
            setCameraDevices(res)
        })
        .catch(err => {
            console.log(err);
            setCameraDevices(null);
        })
    }

    React.useEffect(() => {
        QrScanner.hasCamera()
        .then(res => {
            if(res) {
                setHasCamera(true)
                setTimeout(() => {
                    getCameraDevices();
                }, 1000)
            } else {
                setHasCamera(false)
                setCameraDevices(null);
            }
        })
    }, []);

    React.useEffect(() => {
        if(cameraDevices) {
            setSelectedCameraDevice(cameraDevices[0].id)
        }
    }, [cameraDevices]);

    React.useEffect(() => {
        if(selectedCameraDevice) {
            qrScanner?.setCamera(selectedCameraDevice);
            qrScanner?.start()
        } else qrScanner?.stop()

        return(() => {
            qrScanner?.destroy();
        })
    }, [selectedCameraDevice]);

    React.useEffect(() => {
        if(scannedQRValue) {
            submitScannedValue(scannedQRValue)
        }
    }, [scannedQRValue])
    
    return (
        <div className={className}>
            {
                cameraDevices == null? <>
                <div className="loading-camera-devices">
                    <FadeLoader color="#36d7b7" />
                    <p>Loading camera devices...</p>
                </div>
                </> : <>
                    {
                        hasCamera?
                            cameraDevices && 
                            <>
                                <Select value={selectedCameraDevice || ""} onValChange={(deviceId) => setSelectedCameraDevice(deviceId)} placeholder="Camera">
                                    {
                                        cameraDevices.map(device => (
                                            <Option key={device.id} value={device.id}>{device.label}</Option>
                                        ))
                                    }
                                </Select>
                                <div className="video-container">
                                    <video ref={videoRef} />
                                </div>
                            </> 
                        : 
                        <div className="no-camera">
                            <span className="fa-stack">
                                <FontAwesomeIcon icon={['fas', 'camera']} className="fa-stack-1x" />
                                <FontAwesomeIcon icon={["fas", "ban"]} className="fa-stack-2x" style={{opacity: '0.2', color: 'red'}} />
                            </span>
                            <h1>No Camera available</h1>
                        </div>
                    }
                </>
            }
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



const CameraQrCodeScanner = styled(CameraQrCodeScannerFC)`
    position: relative;
    display: flex;
    flex: 0 1 100%;
    width: fit-content;
    flex-wrap: wrap;
    justify-content: center;

    && > ${Select} {
        flex: 0 1 100%;
    }

    && .loading-camera-devices {
        display: flex;
        flex: 0 1 100%;
        flex-wrap: wrap;
        height: 200px;
        align-content: center;
        justify-content: center;

        > p {
            flex: 0 1 100%;
            text-align: center;
            margin-top: 10px;
            font-size: 18px;
            color: ${({theme}) => theme.textColor.light}
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

    && > .video-container {
        display: flex;
        flex: 0 1 100%;
        justify-content: center;
        padding: 15px 0;
        height: fit-content;
        background-color: ${({theme}) => theme.background.lighter};
    }

    && > .video-container > video {
        width: 80%;
    }

    && > .no-camera {
        display: flex;
        flex: 0 1 100%;
        height: 300px;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        color: ${({theme}) => theme.textColor.disabled};
        align-content: center;
        
        span {
            font-size: 50px;
        }

        h1 {
            flex: 0 1 100%;
            text-align: center;
            height: fit-content;
            font-size: 20px;
            margin-top: 10px;
        }
    }
    
`;

export default CameraQrCodeScanner;