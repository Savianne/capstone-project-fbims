import React from "react";
import styled from "styled-components";
import SkeletonLoading from "../reusables/SkeletonLoading";

import { IStyledFC } from "../IStyledFC";

const FCSkeletonRouteLayou: React.FC<IStyledFC> = ({className}) => {

    return (
        <div className={className}>
            <div className="head">
                <SkeletonLoading height="60px" />
            </div>
            <div className="body">
                <SkeletonLoading height="400px" />
            </div>
        </div>
    )
}

const SkeletonRouteLayout = styled(FCSkeletonRouteLayou)`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    height: fit-content;
    border-radius: 5px;
    background-color: ${({theme}) => theme.background.primary};
    min-width: 0;
    opacity: 0.5;
    /* padding: 0 10px; */

    .head, .body {
        display: flex;
        flex: 0 1 100%;
        margin-bottom: 10px;
        height: 60px;
    }

    .body {
        height: 400px;
    }
`;

export default SkeletonRouteLayout;