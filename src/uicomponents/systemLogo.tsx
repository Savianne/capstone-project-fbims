import styled from "styled-components";

const SystemLogo = styled.span`
    & {
        position: relative;
        display: flex;
        align-items: center;
        height: 65px;
        width: fit-content;
        padding: 0 30px;
        border-left: 1px solid ${({theme}) => theme.borderColor};
        /* border-right: 1px solid ${({theme}) => theme.borderColor}; */
    }

    & img {
        height: 70%;
    }

    & .cover {
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
    }



`;

export default SystemLogo;
