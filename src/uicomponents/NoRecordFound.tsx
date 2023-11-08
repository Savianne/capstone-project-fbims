import styled from "styled-components";
import { IStyledFC } from "./IStyledFC";

const NoRecordFoundFC: React.FC<IStyledFC> = ({className}) => {
    return(
        <div className={className}>
            <img src="/assets/images/no-record.png" alt="no-record" />
            <div className="primary-text">No Record Found!</div>
        </div>
    )
}

const NoRecordFound = styled(NoRecordFoundFC)`
    display: flex;
    flex: 0 1 100%;
    flex-wrap: wrap;
    justify-content: center;
    border-radius: 5px;
    padding: 50px 0;
    background-color: ${({theme}) => theme.background.lighter};

    && img {
        opacity: 0.7;
        width: 50%;
        max-width: 290px;
    }

    && .primary-text {
        display: flex;
        flex: 0 1 100%;
        text-align: center;
        line-height: 1;
        color: #f71e1e;
        justify-content: center;
        font-size: 40px;
        /* font-variant: all-small-caps; */
        font-weight: bolder;
    }
`;

export default NoRecordFound;