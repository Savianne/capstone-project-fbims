import styled, { css } from "styled-components";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

import Devider from "../reusables/devider";
import UseRipple from "../reusables/Ripple/UseRipple";
import Modal from "../reusables/Modal";
import { IStyledFC } from "../IStyledFC";
import ScaleLoader from "react-spinners/ScaleLoader";

const AddRecordBtn = styled(UseRipple)`
    display: flex;
    width: 23px;
    height: 23px;
    border: 1.5px solid white;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 13px;
    cursor: pointer;

    & #ripple {
        background-color: whitesmoke;
    }

`

const Board = styled.div<{ bgImage?: string}>`
    position: relative;
    display: flex;
    flex: 0 1 100%;
    /* min-width: 320px; */
    height: 175px;
    border-radius: 5px;
    overflow: hidden;
    
    & .cover,  & .bg-image, & .board-content {
        position: absolute;
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
    }
    
    & .cover {
        ${({theme}) => theme.mode == 'dark'? css`background: linear-gradient(90deg, rgba(34,19,74,1) 23%, rgba(44,14,130,1) 78%, rgba(59,26,155,1) 80%, rgba(255, 255, 255, 0) 94%); opacity: 0.5;` : css`background-color: rgb(0 0 0 / 50%);`}
    }

    & .board-content .bible-verse {
        display: flex;
        flex-direction: column;
        flex: 0 1 500px;
        min-width: 250px;
        margin-right: 100px;
        overflow-x: hidden;
        row-gap: 10px;
        font-size: 12px;
        color: #fff;
        font-weight: 200;
    }
    
    & .board-content .bible-verse .verse-text {
        font-style: italic;
        font-family: AssistantExtraLight;
        z-index: 10;
    }

    & .board-content .data-total-info {
        display: flex;
        flex-direction: column;
        position: absolute;
        right: 20px;
        bottom: 10px;
        text-align: right;
        font-size: 16px;
        line-height: 23px;
        color: #fff;
        font-weight: 100;
    }

    & .board-content .data-total-info .total {
        font-size: 24px;
        font-weight: 600;
    }

    & .board-content ${AddRecordBtn} {
        position: absolute;
        right: 20px;
        top: 20px;
    }

    & .board-content .data-total-info .data-title {
        font-family: AssistantExtraLight;
    }

    & .board-content .icon {
        margin-left: 30px;
        color: ${({theme}) => theme.staticColor.primary};
        opacity: 0.70;
        font-size: 120px;
    }

    /* & .board-content .icon {
        position: absolute;
        left: 0;
        color: ${({theme}) => theme.staticColor.primary};
        opacity: 0.55;
        font-size: 160px;
    } */

    & .bg-image {
        ${
            (prop) => {
                return prop.bgImage? css`
                    background-image: url(${prop.bgImage});
                    background-position: top 27% center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    opacity: 0.60;
                ` : css`background-color: gray`;
            }
        }
    }
`;


interface IInformationRouteMainBoard {
    bgImage: string,
    verseText: {
        verse: string,
        content: string
    },
    addRecordFormUrl?: string,
    addRecordFN?: () => void,
    dataFolderTitle:  string,
    dataFolderIcon: JSX.Element,
    dataFolderTotal: "isLoading" | "isLoadError" | number,
} 

const InformationRouteMainBoard: React.FC<IInformationRouteMainBoard> = (
    {
        bgImage, 
        verseText, 
        addRecordFormUrl, 
        addRecordFN,
        dataFolderIcon, 
        dataFolderTitle,
        dataFolderTotal,
    }) => {
    
    const navigate = useNavigate();

    return (<>
        <Board bgImage={bgImage}>
            <span className="bg-image"></span>
            <span className="cover"></span>
            <div className="board-content">
                
                <Devider $orientation="vertical" $css="z-index: 100; height: 83px;margin: 0 10px 0 30px;& .devider { border-color: #fff }" $lineWidth="3px" />
                <div className="bible-verse">
                    <p className="verse-text"><FontAwesomeIcon icon={["fas", "quote-left"]} pull="left" size="lg" />{verseText.content}</p>
                    <p className="verse">- {verseText.verse}</p>
                </div>
                <span className="data-total-info">
                    {
                        dataFolderTotal == "isLoading"? <p className="total"><ScaleLoader color="white" height={"20px"}/></p> : dataFolderTotal == "isLoadError"? <p className="total"><FontAwesomeIcon icon={["fas", "exclamation-circle"]} size="lg" /></p> : <p className="total">{dataFolderTotal}</p>
                    }
                    <p className="data-title">{dataFolderTitle}</p>
                </span>
                <AddRecordBtn onClick={(e) => setTimeout(() => addRecordFN? addRecordFN() : navigate(addRecordFormUrl? addRecordFormUrl : "/"), 100)}><FontAwesomeIcon icon={["fas", "plus"]} /></AddRecordBtn>
            </div>
        </Board>
    </>);
}



export default InformationRouteMainBoard;