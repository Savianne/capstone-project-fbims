import styled from "styled-components";

const SideBar = styled.aside`
    /* background-color: ${({theme}) => theme.background.primary}; */
    /* background-image: url(/assets/images/mt-sample-background.jpg); */
    /* background-position: center;
    background-repeat: no-repeat; */
    /* background: rgba(0, 0, 0, 1) url(/assets/images/mt-sample-background.jpg) no-repeat center center fixed; */
    /* background-size: cover; */
    /* border: 1px solid ${({theme}) => theme.borderColor};
    border-radius: 5px; */

    /* & > * {
        mix-blend-mode: multiply;
        background-color: rgba(0, 0, 0, 0.5);
    } */

    @media screen and (max-width: 1170px) {
        & {
            display: none;
        }
    }
`;

export default SideBar;