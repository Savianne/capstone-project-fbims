import styled from "styled-components";

const SideBar = styled.aside`
    background-color: ${({theme}) => theme.background.primary};
    border-left: 1px solid ${({theme}) => theme.borderColor};
`;

export default SideBar;