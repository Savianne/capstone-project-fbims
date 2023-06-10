import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IStyledFC } from "../../IStyledFC";

interface TimePickerProps extends IStyledFC {
    value?: string;
    onChange: (val: string) => void;
  }
  
const FCTimePicker: React.FC<TimePickerProps> = ({
    className,
    value,
    onChange,
}) => {
    const [selectedValue, setSelectedValue] = React.useState(value? value : "");

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
    };

    React.useEffect(() => {
        onChange(selectedValue)
    }, [selectedValue])
    return (
        <span  className={className}>
            <input type="time" onChange={handleDateChange} value={selectedValue} />
            <i className="icon">
                <FontAwesomeIcon icon={["far", "clock"]} />
            </i>
        </span>
    );
};
  
const TimePicker = styled(FCTimePicker)`
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    border-radius: 5px;
    border: 1px solid ${({theme}) => theme.borderColor};
    background-color: ${({theme}) => theme.background.primary};

    & input, 
    & input:active, 
    & input:hover, 
    & input:focus, 
    & input:focus-visible {
        display: flex;
        flex: 1;
        padding: 5px 10px;
        color: ${({theme}) => theme.textColor.strong};
        font-size: 15px;
        outline: none;
        border: none;
        background-color: transparent;
        font-family: inherit;
        z-index: 1;
    }

    & input::-webkit-calendar-picker-indicator {
        display: none;
    }

    .icon {
        position: absolute;
        right: 5px;
        color: ${({theme}) => theme.textColor.strong};
        font-size: 11px;
        height: fit-content;
    }
`;

export default TimePicker;