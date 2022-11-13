import styled from 'styled-components';

import AppHeader from './AppHeader';
import AppNavBar from './AppNavBar';
import ScrollingContent from './ScrollingContent';
import SideBar from './SideBar';

const AppLayout = styled.div`

    @font-face {
        font-family: IndieFlowerRegular;
        src: url(http://localhost:3001/assets/fonts/IndieFlower-Regular.ttf);
    }

    @font-face {
        font-family: LexendVariableFontwght;
        src: url(http://localhost:3001/assets/fonts/Lexend-VariableFont_wght.ttf);
    }

    @font-face {
        font-family: Sen-Regular;
        src: url(http://localhost:3001/assets/fonts/Sen-Regular.ttf);
    }

    & {
        position: fixed;
        top: 0;
        overflow: auto ;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 100vh;
        background-color: ${({theme}) => theme.mainBackground};
        font-family: "Roboto","Helvetica","Arial", sans-serif;
        line-height: 1.5;
        letter-spacing: 0.00938em;
    }

    & > ${AppHeader} {
        position: sticky;
        top: 0;
        flex: 0 1 100%;
        height: 65px;
    }

    & > ${AppNavBar},
    & > ${SideBar} {
        position: sticky;
        top: 66px;
        height: calc(100vh - 66px);
    }

    & > ${SideBar} {
        flex: 0 1 350px;
        /* flex: 0 1 65px; */
    }

    & > ${ScrollingContent} {
        flex: 1;
        height: fit-content;
        margin-bottom: 50px;
    }
`;

export default AppLayout;