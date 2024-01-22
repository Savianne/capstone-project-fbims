import React, {useState, useEffect, ReactElement} from "react";
import { AVATAR_BASE_URL } from "../../API/BASE_URL";
import { Stage, Layer, Image, Rect, Text } from 'react-konva';
import { IStyledFC } from "../IStyledFC";
import styled from "styled-components";
import QRCode from "qrcode"
import ReactCardFlip from 'react-card-flip';
import Button from "../reusables/Buttons/Button";
import doRequest from "../../API/doRequest";
import useAddSnackBar from "../reusables/SnackBar/useSnackBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type TCongregationInfo = {
    congregation_uid: string;
    congregation_name: string;
    date_founded: string;
    mission: string;
    vision: string;
    avatar: string | null;
    country: string;
    region: string;
    province: string;
    mun_city: string;
    barangay: string;
    zone: number | null
}

interface IIDGeneratorProps extends IStyledFC {
    name: string;
    memberUID: string;
    picture: string | null
}

const IDGeneratorFC: React.FC<IIDGeneratorProps> = ({className, name, memberUID, picture}) => {
    const addSnackBar = useAddSnackBar();
    const frontIdRef = React.useRef<any>(null);
    const backIdRef = React.useRef<any>(null);
    const coverPhoto = useBibleImage();
    const bgImage = useBgImage();
    const dp = useDisplayPicture(picture);
    const qrCode = useGenerateQrcode(memberUID);
    const [isFlipped, setIsFlipped] = React.useState(false);
    const [congregationInfo, setCongregationInfo] = React.useState<null | TCongregationInfo>(null);
    const [isLoadingCongregationInfo, setIsLoadingCongregationInfo] = React.useState(false);
    const logo = useLogoImage()
    const millimetersToPixels = (mm: number, ppi = 96) => {
        return mm * (ppi / 25.4);
    };

    const photoSize = millimetersToPixels(25.4);

    const standardWidth = millimetersToPixels(53.98)
    const standardHeight = millimetersToPixels(85.6)
    
    function downloadURI(uri:string, name:string) {
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    
    const handleFrontIdExport = () => {
        const uri = frontIdRef.current?.toDataURL({
            pixelRatio: 2,
            quality: 1,
        });
        downloadURI(uri, `Front-ID-${name}-${memberUID}.png`)
    };

    const handleBackIdExport = () => {
        const uri = backIdRef.current?.toDataURL({
            pixelRatio: 2,
            quality: 1,
        });
        downloadURI(uri, `Back-ID-${name}-${memberUID}.png`)
    };

    React.useEffect(() => {
        setIsLoadingCongregationInfo(true);
        doRequest<TCongregationInfo>({
            url: "/get-congregation-info"
        })
        .then(res => {
            if(res.data) {
                setCongregationInfo(res.data);
            }
        })
        .catch(err => {
            addSnackBar("Error Fetching Congregation Info", "error", 5)
        })
        .finally(() => setIsLoadingCongregationInfo(false))
    }, [])

    React.useEffect(() => {
        console.log(congregationInfo)
    }, [congregationInfo]);

    return (
        <div className={className}>
            <div className="btn-flip-container">
                <Button icon={<FontAwesomeIcon icon={['fas', "rotate"]} />} fullWidth label={isFlipped? "Flip to front" : "Flip to back"} variant="bordered-btn" color="primary" onClick={() => setIsFlipped(!isFlipped)}/>
            </div>
            <div className="id-card">
                <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                    <div className="front-id">
                        <Stage width={standardWidth} height={standardHeight} ref={frontIdRef}>
                            <Layer>
                                {
                                    bgImage? 
                                    <Image
                                    cornerRadius={5}
                                    x={0}
                                    y={0}
                                    width={standardWidth}
                                    height={standardHeight}  
                                    image={bgImage} /> : ""
                                }
                                {
                                    coverPhoto? <Image opacity={0.5} cornerRadius={5} image={coverPhoto} width={standardWidth} height={standardHeight / 2} x={0} y={0} /> : ''
                                }
                                <Text
                                x={0}
                                y={-10}
                                width={standardWidth}
                                padding={30}
                                text="Come to me, all you who are weary and burdened, and I will give you rest."
                                fontSize={13}
                                fontFamily="Caveat"
                                align="center"
                                fill="rgb(46, 117,182)"
                                />
                                <Text
                                x={30}
                                y={70}
                                width={standardWidth - 60}
                                text="Matthew 11:28 (NIV)"
                                fontSize={9}
                                fontFamily="AssistantBold"
                                fontWeight="bold"
                                align="center"
                                fill="rgb(46, 117,182)"
                                />
                                <PictureFrame picture={dp} w={photoSize + 4} h={photoSize + 4} x={((standardWidth - (photoSize + 4)) / 2)} y={100}/>
                                <Text
                                x={0}
                                y={standardHeight / 2 + 35}
                                width={standardWidth}
                                text={name}
                                padding={10}
                                fontSize={15}
                                lineHeight={1.3}
                                fontFamily="AssistantBold"
                                align="center"
                                fill="rgb(27, 27, 27)"
                                />
                                <Text
                                x={10}
                                y={standardHeight / 2 + 95}
                                width={standardWidth - 20}
                                text={memberUID}
                                fontFamily="AssistantBold"
                                fontSize={11}
                                lineHeight={1.3}
                                align="center"
                                textDecoration="underlined"
                                fill="rgb(27, 27, 27)"
                                />
                                <Text
                                x={10}
                                y={standardHeight / 2 + 110}
                                width={standardWidth - 20}
                                text="ID No."
                                fontSize={11}
                                lineHeight={1.3}
                                align="center"
                                fill="rgb(27, 27, 27)"
                                />
                                {
                                    logo? <Image image={logo} width={standardWidth - 20} height={25} x={(standardWidth - (standardWidth - 20)) / 2} y={standardHeight - 30} /> : ''
                                }
                            </Layer>
                        </Stage>
                    </div>
                    <div className="back-id">
                        <Stage width={standardWidth} height={standardHeight} ref={backIdRef}>
                            <Layer>
                                {
                                    bgImage? 
                                    <Image
                                    cornerRadius={5}
                                    x={0}
                                    y={0}
                                    width={standardWidth}
                                    height={standardHeight}  
                                    image={bgImage} /> : ""
                                }
                                {
                                    qrCode? 
                                    <Image
                                    cornerRadius={5}
                                    x={((standardWidth - (standardWidth - 80)) / 2)}
                                    y={20}
                                    width={standardWidth - 80}
                                    height={standardWidth - 80}  
                                    image={qrCode} /> : ""
                                }
                                <Text
                                x={10}
                                y={150}
                                width={standardWidth - 20}
                                text={memberUID}
                                fontSize={11}
                                lineHeight={1.3}
                                align="center"
                                fill="rgb(27, 27, 27)"
                                />
                                <Text
                                x={10}
                                y={180}
                                width={standardWidth - 20}
                                text="Congregation"
                                fontSize={10}
                                lineHeight={1.3}
                                align="center"
                                fontFamily="AssistantBold"
                                fill="rgb(27, 27, 27)"
                                />
                                <Text
                                x={10}
                                y={195}
                                width={standardWidth - 20}
                                text={"Roxas Church of Christ"}
                                fontSize={9}
                                lineHeight={1.3}
                                align="center"
                                fill="rgb(27, 27, 27)"
                                />
                                <Text
                                x={10}
                                y={230}
                                width={standardWidth - 20}
                                text="Church Address"
                                fontSize={10}
                                lineHeight={1.3}
                                align="center"
                                fontFamily="AssistantBold"
                                fill="rgb(27, 27, 27)"
                                />
                                <Text
                                x={10}
                                y={245}
                                width={standardWidth - 20}
                                text={"Brgy. Vira, Roxas Isabela"}
                                fontSize={9}
                                lineHeight={1.3}
                                align="center"
                                fill="rgb(27, 27, 27)"
                                />
                                <Text
                                x={30}
                                y={280}
                                width={standardWidth - 60}
                                text={`This ID card is property of Mark Niño Q. Baylon. Please return it if found.`}
                                fontSize={9}
                                lineHeight={1.3}
                                align="center"
                                fill="rgb(27, 27, 27)"
                                />
                            </Layer>
                        </Stage>
                    </div>
                </ReactCardFlip>
            </div>
            <div className="btn-flip-container">
                <Button icon={<FontAwesomeIcon icon={['fas', "rotate"]} />} fullWidth label="Download" variant="hidden-bg-btn" color="primary" onClick={() => {
                    handleFrontIdExport();
                    handleBackIdExport();
                }}/>
            </div>
        </div>
    )
}

const PictureFrame: React.FC<{w: number, h: number, x: number, y: number, picture: HTMLImageElement | null}> = ({w, h, x, y, picture}) => {
    return(
        picture? 
        <Image
        x={x}
        y={y}
        width={w}
        height={h}
        stroke="#0088ff"         
        strokeWidth={2}  
        image={picture} /> :
        <Rect
          x={x}
          y={y}
          width={w}
          height={h}
          stroke="#0088ff"         
          strokeWidth={2}
          fill="rgb(222, 235, 247)" 
        />
    )
}

function useBibleImage() {
    const [image, setImage] = useState<null | HTMLImageElement>(null);

    useEffect(() => {
        const img = new window.Image();
        img.src = '/assets/images/bible.jpg';

        img.onload = () => {
            setImage(img);
        };
    }, []);

    return image;
}

function useBgImage() {
    const [image, setImage] = useState<null | HTMLImageElement>(null);

    useEffect(() => {
        const img = new window.Image();
        img.src = '/assets/images/id-bg.png';

        img.onload = () => {
            setImage(img);
        };
    }, []);

    return image;
}

function useLogoImage() {
    const [image, setImage] = useState<null | HTMLImageElement>(null);

    useEffect(() => {
        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.src = '/faith-buddy.png';

        img.onload = () => {
            setImage(img);
        };
    }, []);

    return image;
}

function useDisplayPicture(url: string | null) {
    const [image, setImage] = useState<null | HTMLImageElement>(null);

    useEffect(() => {
        if(url) {
            const img = new window.Image();
            img.crossOrigin = 'Anonymous';
            img.src = `${AVATAR_BASE_URL}/${url}`;
            img.onload = () => {
                setImage(img);
            };
        } else setImage(null);
    }, [url]);

    return image;
}

function useGenerateQrcode(memberUID: string) {
    const [image, setImage] = useState<null | HTMLImageElement>(null);

    useEffect(() => {
        QRCode.toDataURL(memberUID, { errorCorrectionLevel: 'H', margin: 1 })
        .then(url => {
            const img = new window.Image();
            img.src = url;
    
            img.onload = () => {
                setImage(img);
            };
        })
        .catch(err => {
            console.error(err)
        })
    }, []);

    return image;
}

const IDGenerator = styled(IDGeneratorFC)`
    display: flex;
    flex: 0 0 fit-content;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 15px 0;
    gap: 10px;

    && > .id-card {
        width: fit-content;
        height: fit-content;
        
        .front-id, .back-id {
            border-radius: 10px;
            width: fit-content;
            height: fit-content;
        }

        .front-id {
            box-shadow: 2px 3px 0px 1px rgba(233,233,233,1), 
                        6px 8px 0px 0px rgba(210,210,210,1);
        }

        .back-id {
            box-shadow: 2px 3px 0px 1px rgba(233,233,233,1), 
                        6px 8px 0px 0px rgba(210,210,210,1);
        }
    }

    && > .btn-flip-container {
        display: flex;
        justify-content: center;
    }
    
`
export default IDGenerator;