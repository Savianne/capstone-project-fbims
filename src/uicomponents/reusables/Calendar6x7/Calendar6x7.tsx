import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IStyledFC } from "../../IStyledFC";
import { IEvents } from "./IEvents";

//Reusables
import Button from "../Buttons/Button"

//Calendar Views COmponent
import CalendarView from "./CalendarView";

//Hooks 
import useCalendar42 from "../../../utils/calendar6x7/useCalendar42";
import useDateToggle from "../../../utils/calendar6x7/useDateToggle";

//Helpers
import calendarDateText from "./calendar-date-text-utilts";
import Devider from "../devider";

const sampleEvents: IEvents[] = [
    {
        title: "Whole Day Event",
        isWholeDay: true,
        date: new Date(),
    },
    {
        title: "Meeting",
        isWholeDay: false,
        date: { eventStart: new Date(2023, 3, 9, 8, 30), eventEnd: new Date(2023, 3, 11, 9)},
    },
    {
        title: "Daily Event",
        isWholeDay: true,
        date: new Date(), 
        reapeat: {
            pattern: "daily",
        }
    },
    {
        title: "Long Whole day Event ",
        isWholeDay: true,
        date: { eventStart: new Date(2023, 3, 9), eventEnd: new Date(2023, 3, 11)},
        reapeat: {
            pattern: "weekly",
        }
    },
    {
        title: "Long Event",
        isWholeDay: true, 
        date: { eventStart: new Date(2023, 3, 9, 13, 30), eventEnd: new Date(2023, 3, 11, 14)},
    },
    
]

const FC6x7Calendar: React.FC<IStyledFC> = ({className}) => {
    const elementRef = React.useRef<HTMLDivElement | null>(null);
    const [cellSize, updateCellSize] = React.useState<number | null>(null);
    const [view, switchView] = React.useState<"calendar" | "list">("calendar");
    const [onViewDate, dateToggles] = useDateToggle();
    const [toggleType, updateToggleType] = React.useState<'month' | "day">('month')
    const [calendarDates, updateCalendarDate] = useCalendar42(onViewDate);

    React.useEffect(() => {
        // Create a new ResizeObserver
        const observer = new ResizeObserver(entries => {
          // Loop through the ResizeObserverEntry objects
          for (let entry of entries) {
            // Log the new dimensions of the observed element
            updateCellSize((entry.contentRect.width / 7) - 1);
          }
        });
    
        // Start observing the element
        if (elementRef.current) {
          observer.observe(elementRef.current);
        }
    
        // Clean up function to stop observing the element
        return () => {
          observer.disconnect();
        };
      }, []);

    React.useEffect(() => {
        calendarDates && console.log(calendarDates);
    }, [calendarDates]);

    React.useEffect(() => {
        updateCalendarDate(onViewDate);
    }, [onViewDate]);

    return (
        <div className={className} ref={elementRef}>
            <div className="calendar-toolbar">
                <div className="date-toggle-area">
                    <Button 
                    label="Create Event" 
                    variant="standard" 
                    color="primary" 
                    icon={<FontAwesomeIcon icon={["fas", "calendar-plus"]} />}
                    onClick={(e) => alert("create event")} 
                    iconButton={!(cellSize && cellSize > 130)} />
                    <Button 
                    icon={<FontAwesomeIcon icon={["fas", "angle-left"]} />} 
                    label="Toggle Prev Date" 
                    variant="hidden-bg-btn" 
                    color="theme" 
                    iconButton 
                    onClick={(e) => toggleType == "month"? dateToggles.togglePrevMonth() : dateToggles.togglePrevDate()}/>
                    <Button 
                    icon={<FontAwesomeIcon 
                    icon={["fas", "angle-right"]} />} 
                    label="Toggle Next Date" 
                    variant="hidden-bg-btn" 
                    color="theme" 
                    iconButton 
                    onClick={(e) => toggleType == "month"? dateToggles.toggleNextMonth() : dateToggles.toggleNextDate()} />
                    <Button 
                    label="TODAY" 
                    variant="hidden-bg-btn" 
                    color="theme" 
                    onClick={(e) => dateToggles.today()} />
                </div>
                {
                    cellSize && cellSize >= 84.66 && <span className="date-text-area">
                        <h1 className="date-text">{calendarDateText(onViewDate, toggleType)}</h1>
                    </span>
                }
                <span className="view-toggle-area">
                    <Button 
                    label="Calendar View" 
                    variant={view == "calendar"? "standard" : "hidden-bg-btn"} 
                    color={view == "calendar"? "primary" : "theme"}
                    icon={<FontAwesomeIcon icon={["fas", "calendar-alt"]} />}
                    iconButton 
                    onClick={(e) => switchView("calendar")} />
                    <Devider $variant="center" $orientation="vertical" $css="margin-left: 2px; margin-right: 2px; height: 80%"/>
                    <Button 
                    label="List View" 
                    variant={view == "list"? "standard" : "hidden-bg-btn"} 
                    color={view == "list"? "primary" : "theme"}
                    icon={<FontAwesomeIcon icon={["fas", "list"]} />} 
                    iconButton
                    onClick={(e) => switchView("list")} />
                </span>
            </div>
            {
                cellSize && cellSize < 84.66 && <span className="date-text-area-sm-screen">
                    <h1 className="date-text">{calendarDateText(onViewDate, toggleType)}</h1>
                </span>
            }
            
            {
                cellSize && view == "calendar"  && calendarDates && <CalendarView cellSize={cellSize} dates={calendarDates} events={sampleEvents} />
                    
            }
            {
                cellSize && view == "list" && <h1>List of Events</h1>
            }
        </div>
    )
}

const Calendar6x7 = styled(FC6x7Calendar)`
    display: flex;
    flex: 0 1 1000px;
    flex-wrap: wrap;

    .calendar-toolbar {
        display: flex;
        flex: 0 1 100%;
        height: 50px;
        margin-bottom: 15px;
    }

    .calendar-toolbar .date-toggle-area,
    .calendar-toolbar .date-text-area,
    .calendar-toolbar .view-toggle-area  {
        display: flex;
        align-items: center;
        flex: 1;
        height: 100%;
    }

    .calendar-toolbar .date-toggle-area ${Button} {
        margin-left: 10px;
    }

    .calendar-toolbar .date-toggle-area ${Button}:first-child {
        margin-left: 0;
    }

    .calendar-toolbar .date-text-area,
    .date-text-area-sm-screen {
        justify-content: center;
        color: ${({theme}) => theme.textColor.strong}
    }
    

    .calendar-toolbar .view-toggle-area {
        justify-content: flex-end;
    }

    /* .calendar-toolbar .view-toggle-area .toggle-group {
        display: flex;
        flex: 0;
        width: fit-content;
        height: 90%;
    } */

    .date-text-area-sm-screen {
        display: flex;
        flex: 0 1 100%;
        padding: 0 0 5px 0;
    }
`

export default Calendar6x7;