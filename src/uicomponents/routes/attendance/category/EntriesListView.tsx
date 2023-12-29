import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IStyledFC } from "../../../IStyledFC";
import TAttendanceEntry from "./TAttendanceEntry";
import Button from "../../../reusables/Buttons/Button";
import SkeletonLoading from "../../../reusables/SkeletonLoading";
import EntryPage from "../entryPage/EntryPage";
import DataDisplayChip from "../../../reusables/DataDisplayChip";

interface IAttendanceEntriesListViewFC extends IStyledFC {
    entries: TAttendanceEntry[],
    editEntryTitleUpdate: (uid: string, title: string) => void
}

const AttendanceEntriesFC: React.FC<IAttendanceEntriesListViewFC> = ({className, entries, editEntryTitleUpdate}) => {
    return(
        <div className={className}>
            {
                entries.map(entry => <Entry editEntryTitleUpdate={(uid, title) => editEntryTitleUpdate(uid, title)} key={entry.entryUID} entry={entry}/>)
            }
        </div>
    )
}

interface IEntry extends IStyledFC {
    entry: TAttendanceEntry,
    editEntryTitleUpdate: (uid: string, title: string) => void
}

const EntryFC:React.FC<IEntry> = ({className, entry, editEntryTitleUpdate}) => {
    const [entryPage, setEntryPage] = React.useState(false);
    return(
        <div className={className}>
            <h5 className="entry-description">{entry.description}</h5>
            <div className="lower-container">
                <div className="extra-detailes-group">
                    {/* <p className="data">{new Date(entry.date).toDateString()}</p> */}
                    <DataDisplayChip icon={<FontAwesomeIcon icon={['fas', 'calendar-day']} />}>{new Date(entry.date).toDateString()}</DataDisplayChip>
                    <span className="dot-devider"></span>
                    {/* <p className="data">{entry.categoryTitle}</p>
                    <span className="dot-devider"></span>
                    <p className="data">{entry.type == "basic"? "Basic (Present/Absent)" : "Detailed (Time-in/Time-out)"}</p>
                    <span className="dot-devider"></span> */}
                    {
                        entry.pending? 
                        <DataDisplayChip severity="info">Pending</DataDisplayChip> : 
                        <DataDisplayChip icon={<FontAwesomeIcon icon={['fas', 'check']} />} severity="success">Saved</DataDisplayChip>} 
                </div>
                <Button iconButton icon={<FontAwesomeIcon icon={["fas", "angle-right"]} />} label="View entry" color="theme" variant="hidden-bg-btn"  onClick={() => setEntryPage(true)} />
                {
                    entryPage? <EntryPage editEntryTitleUpdate={(uid, title) => editEntryTitleUpdate(uid, title)} entryInfo={entry} onClose={() => setEntryPage(false)}/> : null
                }
            </div>
        </div>
    )
};

const Entry = styled(EntryFC)`
    && {
        display: flex;
        flex-wrap: wrap;
        flex: 0 1 100%;
        padding: 10px;
        background-color: ${({theme}) => theme.background.primary};
        border-radius: 5px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);

        .entry-description {
            color: ${({theme}) => theme.textColor.strong};
            font-weight: 600;
            font-size: 18px;
        }

        .lower-container {
            display: flex;
            flex: 0 1 100%;
            height: fit-content;
            align-items: center;

            .extra-detailes-group {
                display: flex;
                flex: 0 1 fit-content;
                height: fit-content;
                align-items: center;
                color: ${({theme}) => theme.textColor.light};
                font-size: 13px;

                .dot-devider {
                    display: inline;
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    margin: 0 10px;
                    background-color: ${({theme}) => theme.textColor.light};
                }
            }

            > ${Button} {
                margin-left: auto;
            }
        }
    }
`


const AttendanceEntriesFCSkeleton: React.FC<IStyledFC> = ({className}) => {
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

export const AttendanceEntriesSkeleton = styled(AttendanceEntriesFCSkeleton)`
    display: flex;
    flex: 0 1 800px;
    margin: 0 auto;
    flex-wrap: wrap;
    gap: 5px;
`

const AttendanceEntriesListView = styled(AttendanceEntriesFC)`
    display: flex;
    flex: 0 1 800px;
    margin: 0 auto;
    flex-wrap: wrap;
    gap: 5px;
`;

export default AttendanceEntriesListView;