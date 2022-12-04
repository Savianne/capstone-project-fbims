import styled from "styled-components";

const SideBar = styled.aside`
    background-color: ${({theme}) => theme.background.primary};
    border-left: 1px solid ${({theme}) => theme.borderColor};

    @media screen and (max-width: 1170px) {
        & {
            display: none;
        }
    }
`;

export default SideBar;