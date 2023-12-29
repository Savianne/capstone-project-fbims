import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IStyledFC } from "../../IStyledFC";
import IPendingEntry from "./IPendingEntry";
import Button from "../../reusables/Buttons/Button";
import SkeletonLoading from "../../reusables/SkeletonLoading";
import EntryPage from "./entryPage/EntryPage";
import DataDisplayChip from "../../reusables/DataDisplayChip";

interface IPendingEntriesFC extends IStyledFC {
    pendingEntries: IPendingEntry[];
    editEntryTitleUpdate: (uid: string, title: string) => void;
}

const PendingEntriesFC: React.FC<IPendingEntriesFC> = ({className, pendingEntries, editEntryTitleUpdate}) => {
    
    return(
        <div className={className}>
            {
                pendingEntries.map(entry => <PendingEntry editEntryTitleUpdate={(uid, title) => editEntryTitleUpdate(uid, title)} entry={entry} />)
            }
        </div>
    )
}

interface IPendingEntryProps extends IStyledFC {
    entry: IPendingEntry;
    editEntryTitleUpdate: (uid: string, title: string) => void
}

const PendingEntryFC: React.FC<IPendingEntryProps> = ({className, entry, editEntryTitleUpdate}) => {
    const [entryPage, setEntryPage] = React.useState(false);
    return (
        <div className={className}>
            <h5 className="entry-description">{entry.description}</h5>
            <div className="lower-container">
                <div className="extra-detailes-group">
                    <DataDisplayChip icon={<FontAwesomeIcon icon={['fas', 'calendar-day']} />}>{new Date(entry.date).toDateString()}</DataDisplayChip>
                    {/* <p className="data">{new Date(entry.date).toDateString()}</p> */}
                    <span className="dot-devider"></span>
                    {/* <p className="data">{entry.categoryTitle}</p> */}
                    <DataDisplayChip icon={<FontAwesomeIcon icon={['fas', 'people-group']} />}>{entry.categoryTitle}</DataDisplayChip>
                    <span className="dot-devider"></span>
                    <DataDisplayChip icon={<FontAwesomeIcon icon={['fas', 'qrcode']} />}>{entry.type == "basic"? "Basic (Present/Absent)" : "Detailed (Time-in/Time-out)"}</DataDisplayChip>
                    {/* <p className="data">{entry.type == "basic"? "Basic (Present/Absent)" : "Detailed (Time-in/Time-out)"}</p> */}
                </div>
                <Button iconButton icon={<FontAwesomeIcon icon={["fas", "angle-right"]} />} label="View entry" color="theme" variant="hidden-bg-btn" onClick={() => setEntryPage(true)}  />
                {
                    entryPage? <EntryPage editEntryTitleUpdate={(uid, title) => editEntryTitleUpdate(uid, title)} entryInfo={{...entry, pending: true, saved: false}} onClose={() => setEntryPage(false)}/> : null
                }
            </div>
        </div>
    )
}

const PendingEntry = styled(PendingEntryFC)`
    display: flex;
    flex-wrap: wrap;
    flex: 0 1 100%;
    min-width: 0;
    padding: 10px;
    background-color: ${({theme}) => theme.background.primary};
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);

    && > .entry-description {
        color: ${({theme}) => theme.textColor.strong};
        font-weight: 600;
        font-size: 18px;
        min-width: 0;
    }

    && > .lower-container {
        display: flex;
        flex: 0 1 100%;
        min-width: 0;
        height: fit-content;
        align-items: center;

        .extra-detailes-group {
            display: flex;
            flex: 0 1 fit-content;
            flex-wrap: wrap;
            gap: 5px;
            min-width: 0;
            height: fit-content;
            align-items: center;
            color: ${({theme}) => theme.textColor.light};
            font-size: 13px;

            .dot-devider {
                display: inline-block;
                max-width: 5px;
                max-height: 5px;
                min-width: 5px;
                min-height: 5px;
                border-radius: 50%;
                /* margin: 0 10px; */
                background-color: ${({theme}) => theme.textColor.light};
            }
        }

        > ${Button} {
            margin-left: auto;
        }
    }
    
`

const PendingEntriesFCSkeleton: React.FC<IStyledFC> = ({className}) => {
    return(
        <div className={className}>
            <SkeletonLoading height={77}/>
            <SkeletonLoading height={77}/>
            <SkeletonLoading height={77}/>
            <SkeletonLoading height={77}/>
            <SkeletonLoading height={77}/>
        </div>
    )
}

export const PendingEntriesSkeleton = styled(PendingEntriesFCSkeleton)`
    display: flex;
    flex: 0 1 800px;
    margin: 0 auto;
    flex-wrap: wrap;
    gap: 5px;
`

const PendingEntries = styled(PendingEntriesFC)`
    display: flex;
    flex: 0 1 800px;
    margin: 0 auto;
    flex-wrap: wrap;
    gap: 5px;
`;

export default PendingEntries;