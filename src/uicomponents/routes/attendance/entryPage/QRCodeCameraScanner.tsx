import React from "react";
import { BrowserQRCodeReader } from '@zxing/browser';
import styled from "styled-components";
import { IStyledFC } from "../../../IStyledFC";
import Select, { Option } from "../../../reusables/Inputs/Select";

interface IQRCodeCameraScanner extends IStyledFC {

}

const QRCodeCameraScannerFC: React.FC<IQRCodeCameraScanner> = ({className}) => {
    const elementRef = React.useRef<HTMLDivElement | null>(null);
    const imgRef = React.useRef<null | HTMLImageElement>(null);
    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const [videoSize, updateVideoSize] = React.useState<{width: number, height: number}>({width: 0, height: 0});
    const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
    const [imageUrl, setImageUrl] = React.useState("");
    const [selectedDeviceId, setSelectedDeviceId] = React.useState<string | undefined>(undefined);
    const [videostream, setVideoStream] = React.useState<null | MediaStream>(null);

    React.useEffect(() => {
        (async () => {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((device) => device.kind === 'videoinput');
            setDevices(videoDevices)
        })();
    }, []);

    React.useEffect(() => {
        if(devices.length) {
            setSelectedDeviceId(devices[0].deviceId);
        }
    }, [devices])

    React.useEffect(() => {
        if(selectedDeviceId) {
            (async () => {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: selectedDeviceId } },
                });
                setVideoStream((prev) => {
                    if(prev) prev.getTracks().forEach(track => track.stop());
                    return stream
                });
            })()
        } else {
            setVideoStream((prev) => {
                if(prev) prev.getTracks().forEach(track => track.stop());
                return null
            });
        }
    }, [selectedDeviceId]);

    React.useEffect(() => {
        if(videostream && videoRef.current) {
            videoRef.current.srcObject = videostream;
        }

        // Create a new ResizeObserver
        const observer = new ResizeObserver(entries => {
            // Loop through the ResizeObserverEntry objects
            for (let entry of entries) {
            // Log the new dimensions of the observed element
                updateVideoSize({width: entry.contentRect.width, height: entry.contentRect.height});
            }
        });

        // Start observing the element
        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        // Clean up function to stop observing the element
        return () => {
            observer.disconnect();
            if(videostream) videostream.getTracks().forEach(track => track.stop());
        };

    }, [videostream])

    React.useEffect(() => {
        
            if (canvasRef.current) {
                const context = canvasRef.current.getContext('2d');
        
                setInterval(() => {
                    if(videoRef.current && canvasRef.current && videoSize.height && videoSize.width) {
                            const codeReader = new BrowserQRCodeReader();
                        
                            context?.clearRect(0, 0, videoSize.width, videoSize.height);
                            context?.drawImage(videoRef.current, (videoSize.width - 300) / 2, (videoSize.height - 300) / 2, 360, 360, (videoSize.width - 360) / 2, (videoSize.height - 360) / 2, 360, 360);

                            const dataUrl = canvasRef.current.toDataURL('image/png');
                            
                            codeReader.decodeFromImageUrl(dataUrl)
                            .then(res => {
                                console.log(res)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                }, 500)
                
            }
        
    }, [videoSize.height, videoSize.width, videoRef.current, canvasRef.current, videostream]);

    const handleScan = () => {
       
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            context?.drawImage(videoRef.current, (videoSize.width - 300) / 2, (videoSize.height - 300) / 2, 360, 360, 0, 0, 360, 360);
    
        //   const imageData = context?.getImageData((videoSize.width - 300) / 2, (videoSize.height - 300) / 2, 300, 300);
            const dataUrl = canvasRef.current.toDataURL('image/png');

            imgRef.current?.setAttribute('src', dataUrl);
    
        }
    };

    return (
        <div className={className}>
            {/* <div className="width-observer" ref={elementRef}></div> */}
            <Select value={selectedDeviceId || ""} onValChange={(v) => setSelectedDeviceId(v)} placeholder="Camera">
                <Option value="">Please Select Camera device</Option>
                {
                    devices.map(device => (
                        <Option key={device.deviceId} value={device.deviceId}>{device.label}</Option>
                    ))
                }
            </Select>
            <div className="scanner-container">
                {
                    videostream? 
                    <div className="video-container" ref={elementRef}>
                        <video ref={videoRef} width={"100%"} autoPlay playsInline/>  
                        <ScannerMiddleBox  width={videoSize.width} height={videoSize.height}>
                            <img src="/assets/images/scanner-border-box.png" alt="" />
                        </ScannerMiddleBox>
                    </div> : 
                    <div className="no-video-stream"></div>
                }
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} width={videoSize.width} height={videoSize.height} />  
            <img src={imageUrl} />
            {/* <video ref={videoRef} width={640} height={480} autoPlay playsInline/>
            <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={480} />
            <button onClick={handleScan}>Scan QR Code</button> */}
        </div>
    )
}

const ScannerMiddleBox = styled.div<{
    width: number;
    height: number;
}>`
    position: absolute;
    display: inline-block;
    width: 301px;
    height: 300px;
    border-top: ${(p) => `${(p.height - 300) / 2}px solid #02030dfa`};
    border-bottom: ${(p) => `${(p.height - 300) / 2}px solid #02030dfa`};
    border-left: ${(p) => `${(p.width - 300) / 2}px solid #02030dfa`};
    border-right: ${(p) => `${(p.width - 300) / 2}px solid #02030dfa`};
    opacity: 0.7;

    && > img {
        width: 100%;
        height: 100%;
        opacity: 1;
    }
`

const QRCodeCameraScanner = styled(QRCodeCameraScannerFC)`
    display: flex;
    flex: 0 1 100%;
    width: fit-content;
    flex-wrap: wrap;
    justify-content: center;

    && > ${Select} {
        flex: 0 1 100%;
    }

    && > .scanner-container {
        display: flex;
        flex: 0 1 80%;
        margin-top: 15px;
        height: fit-content;
        background-color: ${({theme}) => theme.background.lighter};
    }

    && > .scanner-container > .video-container {
        position: relative;
        display: flex;
        flex: 0 1 100%;
        height: fit-content;
    }

    && > .scanner-container > .video-container > video {
        height: fit-content;
    }

    && > .scanner-container > .no-video-stream {
        display: flex;
        width: 100%;
        aspect-ratio: 4/3;
    }
`;

export default QRCodeCameraScanner;