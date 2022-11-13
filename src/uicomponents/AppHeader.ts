import styled from 'styled-components';

const AppHeader = styled.header`
    display: flex;
    align-items: center;
    background-color: ${({theme}) => theme.background.primary};
    border-bottom: 0.5px solid ${({theme}) => theme.borderColor};

`;

export default AppHeader;