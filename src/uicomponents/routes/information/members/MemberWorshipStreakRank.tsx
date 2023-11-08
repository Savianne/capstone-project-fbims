import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../../../IStyledFC";
import Devider from "../../../reusables/devider";

interface IMemberWSR extends IStyledFC {
    memberUID: string
}

const FCMemberWorshipStreakRank: React.FC<IMemberWSR> = ({className, memberUID}) => {

    return (
        <div className={className}>
            <h1 className="title">Highest Worship Streak</h1>
            <div className="worship-streak">
                <h1 className="number">
                    0
                </h1>
                <p>Worship streak</p>
            </div>
            <Devider $flexItem $orientation="horizontal" $css="flex: 0 1 100%"/>
            <div className="rank">
                <h1 className="rank-text">
                    Rank
                </h1>
            </div>
        </div>
    )
}

const MemberWorshipStreakRank = styled(FCMemberWorshipStreakRank)`
    display: flex;
    flex: 1 0 280px;
    flex-wrap: wrap;
    min-height: 230px;
    background-color: ${({theme}) => theme.background.lighter};
    border-radius: 5px;
    /* align-items: center; */
    /* justify-content: center; */
    padding: 10px 30px;
    color: ${({theme}) => theme.textColor.strong};
    align-content: flex-start;

    .title {
        width: 100%;
        height: fit-content;
        font-weight: 600;
        font-size: 15px;
        margin-bottom: 10px;
    }

    .worship-streak {
        display: flex;
        width: 100%;
        height: fit-content;
        /* flex-wrap: wrap; */
        align-items: center;
        /* justify-content: center; */

        .number {
            font-size: 100px;
            font-weight: bold;
            color: pink;
            line-height: 0.8;
        }
         
        p {
            font-size: 35px;
            font-weight: 600;
            line-height: 1;
            margin-left: 10px;
        }
    }

    .rank {
        display: flex;
        width: 100%;
        height: fit-content;
        align-items: center;

        .rank-text {
            font-size: 70px;
            font-weight: bold;
            color: yellow;
            line-height: 0.8;
        }
    }
`;

export default MemberWorshipStreakRank;