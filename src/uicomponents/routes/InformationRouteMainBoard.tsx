import styled, { css } from "styled-components";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IStyledFC } from "../IStyledFC";
import { Interface } from "readline";

import Devider from "../reusables/devider";

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
        ${({theme}) => theme.mode == 'dark'? css`background: linear-gradient(90deg, rgba(34,19,74,1) 23%, rgba(44,14,130,1) 78%, rgba(59,26,155,1) 80%, rgba(255, 255, 255, 0) 94%); opacity: 0.5;` : css`background-color: rgba(34, 19, 74, 0.5);`}
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

    & .board-content .data-total-info .data-title {
        font-family: AssistantExtraLight;
    }

    & .board-content .icon {
        margin-left: 30px;
        color: ${({theme}) => theme.staticColor.primary};
        opacity: 0.70;
        font-size: 120px;
    }

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
    entryFormUrl: string,
    dataFolderTitle:  string,
    dataFolderIcon: string,
    dataFolderTotal: number,
} 

const InformationRouteMainBoard: React.FC<IInformationRouteMainBoard> = (
    {
        bgImage, 
        verseText, 
        entryFormUrl, 
        dataFolderIcon, 
        dataFolderTitle,
        dataFolderTotal,
    }) => {
    
    return (
        <Board bgImage="/assets/images/church.png">
            <span className="bg-image"></span>
            <span className="cover"></span>
            <div className="board-content">
                <span className="icon">
                    <FontAwesomeIcon icon={["fas", "users"]} />
                </span>
                <Devider $orientation="vertical" $css="z-index: 100; height: 83px;margin: 0 10px 0 30px;& .devider { border-color: #fff }" $lineWidth="3px" />
                <div className="bible-verse">
                    <p className="verse-text">{verseText.content}</p>
                    <p className="verse">- {verseText.verse}</p>
                </div>
                <span className="data-total-info">
                    <p className="total">{dataFolderTotal}</p>
                    <p className="data-title">{dataFolderTitle}</p>
                </span>
            </div>
        </Board>
    );
}

export default InformationRouteMainBoard;