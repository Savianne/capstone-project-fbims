import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../../IStyledFC";

const GenerateReportFormFC: React.FC<IStyledFC> = ({className}) => {

    return (
        <div className={className}>
        
        </div>
    )
}

const GenerateReportForm = styled(GenerateReportFormFC)`
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    padding: 15px;
    height: 300px;
    border-radius: 5px;
    /* border: 1px solid ${({theme}) => theme.borderColor}; */
    background-color: ${({theme}) => theme.background.lighter};
`;

export default GenerateReportForm;