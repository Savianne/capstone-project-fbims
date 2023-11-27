import styled from "styled-components";
import { IStyledFC } from "../IStyledFC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IFailedToLoad extends IStyledFC {
    text?: string,
    secondaryText?: string,
    actionBtn?: React.ReactNode
}

const FailedToLoadErrorFC: React.FC<IFailedToLoad> = ({className, text, secondaryText, actionBtn}) => {
    return(
        <div className={className}>
            <span className="error-icon">
                <FontAwesomeIcon icon={['fas', 'exclamation-circle']}/>
            </span>
            <div className="primary-text">{text? text : 'Failed to load!'}</div>
            {
                secondaryText? <p className="secondary-text">{secondaryText}</p> : ""
            }
            {
                actionBtn?  
                <div className="action-btn-area">
                    {actionBtn}
                </div> : ""
            }
           
        </div>
    )
}

const FailedToLoadError = styled(FailedToLoadErrorFC)`
    display: flex;
    flex: 0 1 100%;
    flex-wrap: wrap;
    justify-content: center;
    border-radius: 5px;
    padding: 50px 0;

    /* background-color: ${({theme}) => theme.background.lighter}; */
    
    && .error-icon {
        opacity: 0.5;
        font-size: 100px;
        color: #f71e1e;
    }

    && .primary-text {
        display: flex;
        flex: 0 1 100%;
        text-align: center;
        line-height: 1;
        color: #f71e1e;
        opacity: 0.5;
        justify-content: center;
        font-size: 40px;
        /* font-variant: all-small-caps; */
        font-weight: bolder;
    }
`;

export default FailedToLoadError;