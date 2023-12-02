import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../IStyledFC";
import { ClockLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Buttons/Button";
import bibleVerses from "../../bibleVersesArray";

interface IFullScreenSpinner extends IStyledFC {
    state: "loading" | "done" | "close" | "error",
    onClose: () => void
}


const FullScreenSpinnesFC: React.FC<IFullScreenSpinner> = ({className, state, onClose}) => {
    const [randomVerse, setRandomVerse] = React.useState(["", ""]);
    
    React.useEffect(() => {
        if(state == "loading") {
            const randomVerseIndex = Math.floor(Math.random() * bibleVerses.length);
            const randomVerse = bibleVerses[randomVerseIndex];
            setRandomVerse(randomVerse);
        }
    }, [state])
    return(
    state !== "close"? 
    <div className={className}>
        <div className="box">
            {
                state == "loading"? <>
                <ClockLoader color="#36d7b7" size={50}/>
                <h1>Loading, Please wait...</h1>
                </> : 
                state == "error"? <span className="error-icon">
                    <FontAwesomeIcon icon={["fas", "exclamation-circle"]}/>
                    <h1>Error</h1>
                </span> : 
                state == "done"?
                <span className="done-icon">
                    <FontAwesomeIcon icon={["fas", "circle-check"]}/>
                    <h1>Done</h1>
                </span> : ""
            }
            <p className="verse-text">{randomVerse[1]}</p>
            <p className="verse">{randomVerse[0]}</p>
            {
                state !== "loading"? <Button label="Close" icon={<FontAwesomeIcon icon={["fas", "times"]}/>} variant="hidden-bg-btn" color="theme" onClick={() => onClose()}/> : ""
            }
        </div>
    </div> : null
    )
}

const FullScreenSpinner = styled(FullScreenSpinnesFC)`
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    background-color: ${({theme}) => theme.mode == "dark"? "#00000073" : "#1e1e1e38"};
    z-index: 5000;

    && > .box {
        display: flex;
        flex-wrap: wrap;
        flex: 0 1 400px;
        height: fit-content;
        padding: 30px;
        justify-content: center;
        border-radius: 5px;
        background-color: ${({theme}) => theme.background.primary};
        box-shadow: 17px 20px 61px 21px rgb(0 0 0 / 25%);

        h1 {
            font-size: 20px;
            margin-top: 10px;
            flex: 0 1 100%;
            text-align: center;
            font-weight: 600;
        }

        .verse-text, .verse {
            flex: 0 1 100%;
            text-align: center;
        }
        
        .verse-text {
            margin-top: 10px;
            font-style: italic;
            font-family: AssistantExtraLight;
            /* font-size: 13px; */
        }

        ${Button} {
            margin-top: 15px;
        }
    }

    && > .box > .done-icon,
    && > .box > .error-icon {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        font-size: 50px;
        width: fit-content;
        height: fit-content;
        color: ${({theme}) => theme.staticColor.edit};

        h1 {
            font-size: 30px;
            font-weight: bold;
            text-align: center;
            margin-top: 0;
        }
    }

    && > .box > .error-icon {
        color: ${({theme}) => theme.staticColor.delete};
    }
`;

export default FullScreenSpinner;
