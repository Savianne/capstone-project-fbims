import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IStyledFC } from "../../IStyledFC";
import IPendingEntry from "./IPendingEntry";
import Button from "../../reusables/Buttons/Button";

interface IPendingEntriesFC extends IStyledFC {
    pendingEntries: IPendingEntry[]
}

const PendingEntriesFC: React.FC<IPendingEntriesFC> = ({className, pendingEntries}) => {

    return(
        <div className={className}>
            {
                pendingEntries.map(entry => (
                    <div className="entry">
                        <h5 className="entry-description">{entry.description}</h5>
                        <div className="lower-container">
                            <div className="extra-detailes-group">
                                <p className="data">{new Date(entry.date).toDateString()}</p>
                                <span className="dot-devider"></span>
                                <p className="data">{entry.categoryTitle}</p>
                                <span className="dot-devider"></span>
                                <p className="data">{entry.type == "basic"? "Basic (Present/Absent)" : "Detailed (Time-in/Time-out)"}</p>
                            </div>
                            <Button iconButton icon={<FontAwesomeIcon icon={["fas", "angle-right"]} />} label="View entry" color="theme" variant="hidden-bg-btn" />
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

const PendingEntries = styled(PendingEntriesFC)`
    display: flex;
    flex: 0 1 800px;
    margin: 0 auto;
    flex-wrap: wrap;
    gap: 5px;

    && > .entry {
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

            ${Button} {
                margin-left: auto;
            }
        }
    }

`;

export default PendingEntries;