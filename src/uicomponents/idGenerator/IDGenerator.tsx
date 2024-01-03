import React, {useState, useEffect, ReactElement} from "react";
import { AVATAR_BASE_URL } from "../../API/BASE_URL";
import { Stage, Layer, Image, Rect, Text } from 'react-konva';
import { IStyledFC } from "../IStyledFC";
import styled from "styled-components";
import QRCode from "qrcode"
import ReactCardFlip from 'react-card-flip';
import Button from "../reusables/Buttons/Button";

interface IIDGeneratorProps extends IStyledFC {
    name: string;
    memberUID: string;
    picture: string | null
}

const IDGeneratorFC: React.FC<IIDGeneratorProps> = ({className, name, memberUID, picture}) => {
    const frontIdRef = React.useRef<any>(null);
    const backIdRef = React.useRef<any>(null);
    const coverPhoto = useBibleImage();
    const bgImage = useBgImage();
    const dp = useDisplayPicture(picture);
    const qrCode = useGenerateQrcode(memberUID);
    const [isFlipped, setIsFlipped] = React.useState(false);
    const [isFlipping, setIsFlipping] = React.useState(false);

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

    
    // const handleExport = () => {
    //     const uri = stageRef.current?.toDataURL({
    //         pixelRatio: 2,
    //         quality: 1,
    //     });
    //     downloadURI(uri, `Front-ID-${name}-${memberUID}`)
    // };

    return (
        <div className={className}>
            <Button label="Flip" onClick={() => setIsFlipped(!isFlipped)}/>
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
                                    qrCode? 
                                    <Image
                                    cornerRadius={5}
                                    x={((standardWidth - (standardWidth - 70)) / 2)}
                                    y={20}
                                    width={standardWidth - 70}
                                    height={standardWidth - 70}  
                                    image={qrCode} /> : ""
                                }
                                <Text
                                x={10}
                                y={160}
                                width={standardWidth - 20}
                                text={memberUID}
                                fontSize={11}
                                lineHeight={1.3}
                                align="center"
                                fill="rgb(27, 27, 27)"
                                />
                                <Text
                                x={10}
                                y={200}
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
                                y={215}
                                width={standardWidth - 20}
                                text={"Brgy. Vira, Roxas Isabela"}
                                fontSize={9}
                                lineHeight={1.3}
                                align="center"
                                fill="rgb(27, 27, 27)"
                                />
                                <Text
                                x={30}
                                y={255}
                                width={standardWidth - 60}
                                text={`This card is the property of Mark Niño Q. Baylon. Please return it if found.`}
                                fontSize={11}
                                lineHeight={1.3}
                                align="center"
                                fill="rgb(27, 27, 27)"
                                />
                            </Layer>
                        </Stage>
                    </div>
                </ReactCardFlip>
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
    width: fit-content;
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
    
`
export default IDGenerator;