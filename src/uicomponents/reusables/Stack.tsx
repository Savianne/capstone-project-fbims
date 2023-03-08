import React from "react";
import styled from "styled-components";

export const StackItem = styled.div`
    flex: 0 1 100%;
`

const Stack = styled.div`
    display: flex;
    flex: 0 1 100%;
    height: fit-content;
    flex-wrap: wrap;
`;

export default Stack;

