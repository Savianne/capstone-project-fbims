import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconInput from "../../../reusables/Inputs/IconInput";
import PHCPNumberInput from "../../../reusables/Inputs/PHCPNumberInput";
import PHTelNumberInput from "../../../reusables/Inputs/PHTelNumberInput";
import { IStyledFC } from "../../../IStyledFC";

interface IContactInfoDataDisplay extends IStyledFC {
    cpNumber: string | null,
    telNumber: string | null,
    email: string | null,
    personal: boolean,
}

const FCContactInfoDataDisplay: React.FC<IContactInfoDataDisplay> = ({className, cpNumber, telNumber, email, personal}) => {

    return (
        <div className={className}>
            <span className="category">
                <FontAwesomeIcon icon={["fas", personal? "home" : "user"]} />
                <p className="category-label">{personal? "Personal" : "Home"} <br /> Contact Info</p>
            </span>
            <div className="data-group">
            <IconInput viewOnly value={email as string} type="email" placeholder="Email Address"onValChange={(e) => {}} icon={<FontAwesomeIcon icon={["fas", "at"]} />} />
            <PHCPNumberInput viewOnly value={cpNumber as string} placeholder="Mobile Number"  onChange={(e) => {}} icon={<FontAwesomeIcon icon={["fas", "mobile-alt"]} />} />
            <PHTelNumberInput viewOnly value={telNumber as string} placeholder="Telephone Number" onChange={(e) => {}} icon={<FontAwesomeIcon icon={["fas", "phone-alt"]} />} />
            </div>
        </div>
    )
}

const ContactInfoDataDisplay = styled(FCContactInfoDataDisplay)`
    display: flex;
    flex: 1 0 350px;
    height: 160px;
    background-color: ${({theme}) => theme.background.lighter};
    border-radius: 5px;

    .category {
        display: flex;
        height: 160px;
        width: 160px;
        border-radius: 5px 0 0 5px;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        font-size: 50px;
        align-content: center;
        background-color: #607D8B;
        color: white;

        .category-label {
            flex: 0 1 100%;
            font-size: 25px;
            font-weight: bold;
            text-align: center;
            line-height: 1;
        }
    }

    .data-group {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        /* gap: 5px; */
        padding: 10px;

        ${IconInput}, ${PHCPNumberInput}, ${PHTelNumberInput} {
            flex: 0 1 100%;
            background-color: transparent;
        }
    }
`;

export default ContactInfoDataDisplay;