import React from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";
import Skeleton from 'react-loading-skeleton';
import { IStyledFC } from "../IStyledFC";

interface ISkeleton extends IStyledFC {
    round?: boolean,
    width?: string | number,
    height?: string | number,
}

const FCSkeletonLoading: React.FC<ISkeleton> = ({className, round, width, height}) => {
    const theme = useTheme();

    return (
        <Skeleton containerClassName={className} width={width? width : "100%"} height={height? height : "100%"} circle={round} {...theme.mode == "dark" && {baseColor: "#4a45454d", highlightColor: "#00000000"}} />
    )
}

const SkeletonLoading = styled(FCSkeletonLoading)`
    flex: 1;
`

export default SkeletonLoading;