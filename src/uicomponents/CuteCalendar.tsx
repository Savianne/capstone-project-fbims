import React from "react";
import styled from "styled-components";
import { IStyledFC } from "./IStyledFC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FCCuteCalendar: React.FC<IStyledFC> = ({className}) => {

    return (
        <div className={className}>
            {/* <div className="calendar">

            </div> */}
        </div>
    )
}

const CuteCalendar = styled(FCCuteCalendar)`
    position: relative;
    display: flex;
    width: 300px;
    height: 110px;
    background-image: url(/assets/images/calendar-wallpaper.jpg);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 5px;
    justify-content: center;

    .calendar {
        position: absolute;
        bottom: 0;
        display: flex;
        width: 100%;
        height: 280px;
        /* background-color: gray; */
        /* From https://css.glass */
        /* From https://css.glass */
       /* From https://css.glass */
        background: rgba(101, 114, 255, 0.08);
        border-radius: 5px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(2.4px);
        -webkit-backdrop-filter: blur(2.4px);
    }
`;

export default CuteCalendar;