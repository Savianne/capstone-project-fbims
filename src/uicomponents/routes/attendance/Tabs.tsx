import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../../IStyledFC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UseRipple from "../../reusables/Ripple/UseRipple";

interface ITabs extends IStyledFC {
    tab: string;
    setTab: (val:string) => void;
    pendingEntriesCount: number,
    categoriesCount: number
}

const TabsFC: React.FC<ITabs> = ({className, tab, setTab, pendingEntriesCount, categoriesCount, children}) => {
    return (
        <div className={className}>
            <div className={tab == "pending-entries"? "tab active-tab" : "tab"} onClick={() => setTab("pending-entries")}>
                <UseRipple>
                    <div className="icon">
                        <FontAwesomeIcon icon={['fas', "qrcode"]} />
                    </div>
                    <p className="label">Pending Entries</p>
                    <span className="count">{pendingEntriesCount}</span>
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
            <div className={tab == "categories"? "tab active-tab" : "tab"} onClick={() => setTab("categories")}>
                <UseRipple>
                    <div className="icon">
                        <FontAwesomeIcon icon={['fas', "people-group"]} />
                    </div>
                    <p className="label">Categories</p>
                    <span className="count">{categoriesCount}</span>
                </UseRipple>
            </div>
            <div className={tab == "add-category"? "tab active-tab" : "tab"} onClick={() => setTab("add-category")}>
                <UseRipple>
                    <div className="icon">
                        <FontAwesomeIcon icon={['fas', "plus"]} />
                    </div>
                    <p className="label">Add Category</p>
                </UseRipple>
            </div>
            <div className={tab == "report"? "tab active-tab" : "tab"} onClick={() => setTab("report")}>
                <UseRipple>
                    <div className="icon">
                        <FontAwesomeIcon icon={['fas', "file-csv"]} />
                    </div>
                    <p className="label">Generate Report</p>
                </UseRipple>
            </div>
        </div>
    )
};


const Tabs = styled(TabsFC)`
    display: flex;
    flex: 0 1 fit-content;
    height: fit-content;
    padding: 5px 0;
    gap: 5px;
    
    && > .tab {
        display: flex;
        align-items: center;
        /* min-width: 196px; */
        width: fit-content;
        flex-shrink: 0;
        /* width: fit-content; */
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
        width: fit-content;
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
        flex-shrink: 0;
        text-overflow: none;
    }

    && > .tab > ${UseRipple} > .count {
        color: white;
        padding: 0 5px;
        height: fit-content;
        width: fit-content;
        border-radius: 16px;
        background-color: #ff4400;
        margin-left: 10px;
        font-size: 11px;
        font-weight: bold;
    }
`;

export default Tabs;