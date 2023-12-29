import { Link, useNavigate } from "react-router-dom";
import React, {useState, useEffect} from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../RouteContentBase";
import Devider from "../../reusables/devider";
import SiteMap from "../SiteMap";
import GoBackBtn from "../../GoBackBtn";

import { Stage, Layer, Image, Rect, Text } from 'react-konva';


const ContentWraper = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    height: fit-content;
    padding: 15px 5px;
    justify-content: center;
`;

const WorshipService: React.FC = () => {
    return (<>
        <RouteContentBase>
            <RouteContentBaseHeader>
                <strong>Worship Service</strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    / <Link to='/worship-service'> worship-service</Link>
                </SiteMap>
                <GoBackBtn />
            </RouteContentBaseHeader>
            <RouteContentBaseBody>
                <ContentWraper>
                    <FrontID />
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
    </>)
};

const FrontID: React.FC = () => {
    const stageRef = React.useRef<any>(null);
    const coverPhoto = useBibleImage();
    // const dp = useDisplayPicture('/assets/images/avatar/apple.png');
    const logo = useLogoImage()
    const millimetersToPixels = (mm: number, ppi = 96) => {
        return mm * (ppi / 25.4);
    };

    const photoSize = millimetersToPixels(25.4);

    const standardWidth = millimetersToPixels(53.98)
    const standardHeight = millimetersToPixels(85.6)

    const stageHeight = millimetersToPixels(85.6) + 8;
    const stageWidth = millimetersToPixels(53.98) + 8;
    
    function downloadURI(uri:string, name:string) {
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

    const handleExport = () => {
        const uri = stageRef.current?.toDataURL({
            pixelRatio: 2,
            quality: 1,
        });
        downloadURI(uri, "Front-id-Apple-Jane")
        // we also can save uri as file
        // but in the demo on Konva website it will not work
        // because of iframe restrictions
        // but feel free to use it in your apps:
        // downloadURI(uri, 'stage.png');
      };
    return (
        <>
            {/* <button onClick={handleExport}>Click here to log stage data URL</button> */}
            <Stage width={stageWidth} height={stageHeight} ref={stageRef}>
                <Layer>
                    <IDBorder w={stageWidth} h={stageHeight}/>
                    <Rect
                    x={4}
                    y={4}
                    width={standardWidth}
                    height={standardHeight}        
                    strokeWidth={2}      
                    fill="white" 
                    />
                    {
                        coverPhoto? <Image image={coverPhoto} width={standardWidth} height={standardHeight / 2} x={4} y={4} /> : ''
                    }
                    <Text
                    x={30}
                    y={25}
                    width={stageWidth - 60}
                    text="Come to me, all you who are weary and burdened, and I will give you rest."
                    fontSize={13}
                    fontFamily="Caveat"
                    align="center"
                    fill="rgb(46, 117,182)"
                    />
                    <Text
                    x={30}
                    y={70}
                    width={stageWidth - 60}
                    text="Matthew 11:28 (NIV)"
                    fontSize={11}
                    fontFamily="Arial, sans-serif"
                    fontWeight="bold"
                    align="center"
                    fill="rgb(46, 117,182)"
                    />
                   <PictureFrame w={photoSize + 4} h={photoSize + 4} x={((stageWidth - (photoSize + 4)) / 2)} y={100}/>
                    <Text
                    x={10}
                    y={stageHeight / 2 + 45}
                    width={stageWidth - 20}
                    text="Apple Jane L. De Guzman"
                    fontSize={15}
                    lineHeight={1.3}
                    fontFamily="AssistantBold"
                    align="center"
                    fill="rgb(27, 27, 27)"
                    />
                    <Text
                    x={10}
                    y={stageHeight / 2 + 75}
                    width={stageWidth - 20}
                    text="FBIMS12356"
                    fontFamily="AssistantBold"
                    fontSize={11}
                    lineHeight={1.3}
                    align="center"
                    textDecoration="underlined"
                    fill="rgb(27, 27, 27)"
                    />
                    <Text
                    x={10}
                    y={stageHeight / 2 + 90}
                    width={stageWidth - 20}
                    text="ID No."
                    fontSize={11}
                    lineHeight={1.3}
                    align="center"
                    fill="rgb(27, 27, 27)"
                    />
                    {
                        logo? <Image image={logo} width={standardWidth - 20} height={25} x={(stageWidth - (standardWidth - 20)) / 2} y={stageHeight - 45} /> : ''
                    }
                </Layer>
            </Stage>
        </>
    )
}

const IDBorder:React.FC<{w: number, h: number}> = ({w, h}) => {
    return(
        <Rect
          x={0}
          y={0}
          width={w}
          height={h}
          stroke="blue"         
          strokeWidth={2}      
        />
    )
}

const PictureFrame: React.FC<{w: number, h: number, x: number, y: number}> = ({w, h, x, y}) => {
    return(
        <Rect
          x={x}
          y={y}
          width={w}
          height={h}
          stroke="white"         
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

function useDisplayPicture(url: string) {
    const img = new window.Image();
    img.src = url;

    const minDimention = Math.min(img.width, img.height);

    const canvas = document.createElement('canvas');

    canvas.width = minDimention;
    canvas.height = minDimention;
    
    const context = canvas.getContext('2d');

    const sy = (img.height - minDimention) / 2;
    const sx = (img.width - minDimention) / 2;

    context?.drawImage(img, sx, sy, minDimention, minDimention, 0, 0, minDimention, minDimention);

    const cropedImgUrl = canvas.toDataURL('image/png');

    const cropedImg = new window.Image();
    cropedImg.src = cropedImgUrl;

    return cropedImg;
    
}

export default WorshipService;