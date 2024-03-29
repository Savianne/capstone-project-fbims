import styled, { css } from 'styled-components';

import AppHeader from './AppHeader';
import AppNavBar from './AppNavBar';
import ScrollingContent from './ScrollingContent';
import SideBar from './SideBar';

const AppLayout = styled.div`
    body, html {
        overflow: hidden;
    }

    & {
        position: fixed;
        top: 0;
        overflow-y: scroll;
        overflow-x: hidden;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 100vh;
        background-color: ${({theme}) => theme.background.primary};
        /* font-family: "Roboto","Helvetica","Arial", sans-serif; */
        font-family: AssistantVariableFontwght;
        line-height: 1.5;
        letter-spacing: 0.00938em;
        align-content: flex-start;
    }

    & > ${AppHeader} {
        position: sticky;
        top: 0;
        flex: 0 1 100%;
        height: 65px;
        z-index: 1000;

        ${({theme}) => theme.mode == 'light'? css`
            /* From https://css.glass */
            background: rgba(255, 255, 255, 0.43);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10.2px);
            -webkit-backdrop-filter: blur(10.2px);
        ` : css`
            /* From https://css.glass */
            background: rgba(52, 53, 65, 0.43);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10.2px);
            -webkit-backdrop-filter: blur(10.2px);
        `}
    }

    & > ${AppNavBar},
    & > ${SideBar} {
        position: sticky;
        top: 66px;
        height: calc(100vh - 66px);
    }

    & > ${SideBar} {
        /* top: 75px;
        height: calc(100vh - 75px);
        margin-right: 10px; */
        /* flex: 0 1 350px; */
        /* flex: 0 1 65px; */
    }

    & > ${ScrollingContent} {
        flex: 1;
        min-width: 320px;
        height: fit-content;
        margin-bottom: 50px;
    }
`;

export default AppLayout;