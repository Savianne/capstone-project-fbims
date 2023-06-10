import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../IStyledFC";


interface IFCTimePicker extends IStyledFC {
    onChange: (value: string) => void
}

const FCTimePicker: React.FC<IFCTimePicker> = ({className}) => {
    const [inputState, updateInputState] = React.useState<"active" | "inactive">("inactive");
    const [onClickArea, setOnClickArea] = React.useState(false);
    const [hours, updateHours] = React.useState("00");
    const [mins, updateMins] = React.useState("00");
    const [ampmm, updateAMPM] = React.useState("AM");
    const [selector, updateSelector] = React.useState<"h" | "m" | "ampm" | "none">("none");
    
    React.useEffect(() => {
        
    }, [hours, mins, ampmm]);

    React.useEffect(() => {
        if(inputState == "inactive") updateSelector("none");
    }, [inputState]);

    React.useEffect(() => {
        function clickAway() {
            if(inputState == 'active' && !(onClickArea)) {
                updateInputState('inactive');
            }
        }

        window.addEventListener('click', clickAway);

        return function cleanUp() {
            window.removeEventListener('click', clickAway);
        }
        
    });
    return (
        <div className={className} 
        onClick={(e) => updateInputState("active")}
        onMouseEnter={() => {
            setOnClickArea(true);
        }}
        onMouseLeave={() => {
            setOnClickArea(false);
        }}>
            <span 
            className={selector == "h"? "h active-selector" : "h"}
            onClick={(e) => updateSelector("h")}>{ hours }</span>:
            <span className={selector == "m"? "m active-selector" : "m"}
            onClick={(e) => updateSelector("m")}>{ mins }</span> 
            <span className={selector == "ampm"? "ampm active-selector" : "ampm"}
            onClick={(e) => updateSelector("ampm")}>{ ampmm }</span>
        </div>
    )
}

const TimePicker = styled(FCTimePicker)`
    display: flex;
    flex: 0 1 100%;
    padding: 5px 10px;
    border-radius: 5px;
    border: 1px solid ${({theme}) => theme.borderColor};
    color: ${({theme}) => theme.textColor.strong};
    font-size: 15px;

    .h, .m, .ampm {
        width: fit-content;
        height: fit-fit-content;
    }

    .ampm {
        margin-left: 5px;
    }
    
    .active-selector {
        background-color: #008eff;
        color: white;
    }
`;


export default TimePicker;