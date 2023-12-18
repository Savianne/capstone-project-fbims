import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../../../IStyledFC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UseRipple from "../../../reusables/Ripple/UseRipple";

interface ITabs extends IStyledFC {
    tab: string;
    setTab: (val:string) => void;
}

const TabsFC: React.FC<ITabs> = ({className, tab, setTab, children}) => {
    return (
        <div className={className}>
            <div className={tab == "entries"? "tab active-tab" : "tab"} onClick={() => setTab("entries")}>
                <UseRipple>
                    <div className="icon">
                        <FontAwesomeIcon icon={['fas', "qrcode"]} />
                    </div>
                    <p className="label">Entries</p>
                </UseRipple>
            </div>
            <div className={tab == "add-entry"? "tab active-tab" : "tab"} onClick={() => setTab("add-entry")}>
                <UseRipple>
                    <div className="icon">
                        <FontAwesomeIcon icon={['fas', "plus"]} />
                    </div>
                    <p className="label">Add Entry</p>
                </UseRipple>
            </div>
            <div className={tab == "attenders"? "tab active-tab" : "tab"} onClick={() => setTab("attenders")}>
                <UseRipple>
                    <div className="icon">
                        <FontAwesomeIcon icon={['fas', "people-group"]} />
                    </div>
                    <p className="label">Attenders</p>
                </UseRipple>
            </div>
            <div className={tab == "report"? "tab active-tab" : "tab"} onClick={() => setTab("report")}>
                <UseRipple>
                    <div className="icon">
                        <FontAwesomeIcon icon={['fas', "file-csv"]} />
                    </div>
                    <p className="label">Report</p>
                </UseRipple>
            </div>
        </div>
    )
};


const Tabs = styled(TabsFC)`
    display: flex;
    flex: 0 1 100%;
    height: fit-content;
    padding: 5px 0;
    gap: 5px;
    
    && > .tab {
        display: flex;
        align-items: center;
        /* width: 170px; */
        width: fit-content;
        flex-shrink: 0;
        height: fit-content;
        border-radius: 5px;
        border: 1px solid ${({theme}) => theme.borderColor};
        color: ${({theme}) => theme.textColor.strong};
        cursor: pointer;
    }

    && .active-tab {
        transition: background-color 500ms linear;
        background-color: ${({theme}) => theme.background.lighter};
    }

    && > .tab > ${UseRipple} {
        display: flex;
        align-items: center;
        width: 100%;
        height: 40px;
        padding: 5px 20px;
        border-radius: 5px;
        color: ${({theme}) => theme.textColor.strong};
    }

    && > .tab > ${UseRipple} > .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        flex-grow: 0;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-color: ${({theme}) => theme.background.light};
    }

    && > .tab > ${UseRipple} > .label {
        /* font-size: 13px; */
        margin-left: 10px;
    }
`;

export default Tabs;