import React from "react";
import styled from "styled-components";
import GoBackBtn from "../GoBackBtn";

const RouteContentBase = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    height: fit-content;
    border-radius: 2px;
    background-color: ${({theme}) => theme.background.primary};
`;

const RouteContentBaseHeader = styled.div`
    display: flex;
    flex: 0 1 100%;
    padding: 0 10px;
    align-items:  center;
    height: 35px;
    border-bottom: 0.5px solid ${({theme}) => theme.borderColor};

    & strong {
        font-size: 16px;
        color: ${({theme}) => theme.textColor.strong};
    }

    & ${GoBackBtn} {
        margin-left: auto;
    }
`;

const RouteContentBaseBody = styled.div`
    display: flex;
    flex: 1;
    padding: 0 10px;
    height: fit-content;
`;

export { RouteContentBaseHeader, RouteContentBaseBody }

export default RouteContentBase;