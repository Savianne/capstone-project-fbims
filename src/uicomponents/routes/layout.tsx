import styled from "styled-components";
import React from "react";
import { Outlet } from "react-router-dom";

const SLayout = styled.div`
    display: flex;
    flex: 1;
    padding: 10px;
    height: fit-content;

    @media screen and (max-width: 400px) {
        & {
            padding: 0;
        }
    }
`;

const Layout: React.FC = () => {
    return (
        <SLayout>
            <Outlet />
        </SLayout>
    )
}

export default Layout;