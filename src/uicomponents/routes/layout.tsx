import styled from "styled-components";
import React from "react";
import { Outlet } from "react-router-dom";

const SLayout = styled.div`
    display: flex;
    flex: 1;
    padding: 20px;
    height: fit-content;
`;

const Layout: React.FC = () => {
    return (
        <SLayout>
            <Outlet />
        </SLayout>
    )
}

export default Layout;