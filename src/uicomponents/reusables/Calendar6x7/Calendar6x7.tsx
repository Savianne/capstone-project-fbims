import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IStyledFC } from "../../IStyledFC";
import { IEvent } from "./interfaces";

//Reusables
import Button from "../Buttons/Button"
import Devider from "../devider";
import Revealer from "../Revealer";

import DateRangePicker from "../DateRangePicker/DateRangePicker";

//Calendar Views COmponent
import CalendarView from "./CalendarView";

//Hooks 
import useCalendar42 from "../../../utils/calendar6x7/useCalendar42";
import useDateToggle from "../../../utils/calendar6x7/useDateToggle";

//Helpers
import calendarDateText from "./calendar-date-text-utilts";
import getEventsOfTheDate, { TGetEventsFNRetVal } from "../../../utils/calendar6x7/getEventsOfTheDate";

import AddEventForm from "../../routes/calendar/AddEventForm";

//Global state imports
import { useAppDispatch, useAppSelector } from "../../../global-state/hooks";
import { displayForm, closeForm } from "../../../global-state/action-creators/createEventFormSlice";

const NEweventForm = styled.div`
    display: flex;
    flex: 0 1 100%;
    height: 450px;
    /* background-color: pink; */
`
const sampleEvents: IEvent[] = [
    {
        eventUID: new Date().getTime(),
        title: "Sunday Worship Service",
        isWholeDay: true,
        date: { eventStart: new Date(2023, 2, 26, 5, 30), eventEnd: new Date(2023, 2, 26, 7)},
        reapeat: {
            pattern: 'weekly'
        }
    },
    {
        eventUID: new Date().getTime(),
        title: "Whole Day Event",
        isWholeDay: true,
        date: new Date(2023, 2, 24),
    },
    {
        eventUID: new Date().getTime(),
        title: "Whole Day Event",
        isWholeDay: true,
        date: { eventStart: new Date(2023, 2, 24), eventEnd: new Date(2023, 2, 26)},
    },
    {
        eventUID: new Date().getTime(),
        title: "Meeting",
        isWholeDay: false,
        date: new Date(2023, 2, 22),
    },
    {
        eventUID: new Date().getTime(),
        title: "Wholeday Daily Event",
        isWholeDay: true,
        date: new Date(2023, 1, 20), 
        reapeat: {
            pattern: "daily",
            // endDate: new Date(2023, 2, 20),
            // removedAccurances: [new Date(2023, 2, 17)]
        }
    },
    {
        eventUID: new Date().getTime(),
        title: "Daily Event",
        isWholeDay: false,
        date: { eventStart: new Date(2023, 1, 20, 1), eventEnd: new Date(2023, 1, 20, 1, 30)}, 
        // reapeat: {
        //     pattern: "daily",
        //     endDate: new Date(2023, 2, 20),
        //     // removedAccurances: [new Date(2023, 2, 17)]
        // }
    },
    {
        eventUID: new Date().getTime(),
        title: "Sunday Worship Service",
        isWholeDay: false,
        date: { eventStart: new Date(2023, 2, 5, 18), eventEnd: new Date(2023, 2, 5, 19)}, 
        reapeat: {
            pattern: "weekly",
            // endDate: new Date(2023, 2, 20),
            // removedAccurances: [new Date(2023, 2, 17)]
        }
    },
    {
        eventUID: new Date().getTime(),
        title: "Daily Event 2",
        isWholeDay: true,
        date: { eventStart: new Date(2023, 2, 9), eventEnd: new Date(2023, 2, 11)},
        reapeat: {
            pattern: "daily",
        }
    },
    {
        eventUID: new Date().getTime(),
        title: "Long Event",
        isWholeDay: true, 
        date: { eventStart: new Date(2023, 3, 9, 13, 30), eventEnd: new Date(2023, 3, 11, 14)},
    },
    
]

export type TCalendar6x7Events = Record<string, TGetEventsFNRetVal>;

const FC6x7Calendar: React.FC<IStyledFC> = ({className}) => {
    const elementRef = React.useRef<HTMLDivElement | null>(null);
    const [cellSize, updateCellSize] = React.useState<number | null>(null);
    const [view, switchView] = React.useState<"calendar" | "list">("calendar");
    const [onViewDate, dateToggles] = useDateToggle();
    const [toggleType, updateToggleType] = React.useState<'month' | "day">('month')
    const [calendarDates, updateCalendarDate] = useCalendar42(onViewDate);
    const [eventList, updateEventList] = React.useState<null | IEvent[]>(sampleEvents);
    const [calendar6x7Events, updateCalendar6x7Events] = React.useState<null | TCalendar6x7Events>(null)

    const addEventFormState = useAppSelector(state => state.addEventFormReducer.state);
    const dispatch = useAppDispatch();

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
        // calendarDates && console.log(calendarDates);
        eventList && calendarDates && 
        (function() {
            let events_container: TCalendar6x7Events = {};
            calendarDates?.forEach(item => {
                const key = `${item.date.getFullYear()}-${item.date.getMonth() + 1}-${item.date.getDate()}`;
                const eventOfTheDate = getEventsOfTheDate(item.date, {repeating:[...eventList.filter(item => item.reapeat !== undefined)], nonRepeating: [...eventList.filter(item => item.reapeat === undefined)], holidays: [], birthdays: []})
                events_container = {...events_container, [key]: eventOfTheDate}
            });
    
            updateCalendar6x7Events(events_container);
        })()
       
    }, [calendarDates, eventList]);

    React.useEffect(() => {
        updateCalendarDate(onViewDate);
    }, [onViewDate]);

    React.useEffect(() => {
        console.log(calendar6x7Events)
    }, [calendar6x7Events])
    
    return (
        <div className={className} ref={elementRef}>
            <div className="calendar-toolbar">
                <div className="date-toggle-area">
                    <Button 
                    label="Create Event" 
                    variant="standard" 
                    color="primary" 
                    icon={<FontAwesomeIcon icon={["fas", "calendar-plus"]} />}
                    onClick={(e) => dispatch(displayForm())} 
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
            {/* {
                calendarDates && <Revealer reveal={newEventFormState} maxHeight="450px">
                    <NEweventForm>
                        <DateRangePicker initDate={onViewDate}/>
                    </NEweventForm>
                </Revealer>
            } */}
            {
                cellSize && view == "calendar"  && calendarDates && calendar6x7Events && <CalendarView cellSize={cellSize} dates={calendarDates} events={calendar6x7Events}  />
                    
            }
            {
                cellSize && view == "list" && <h1>List of Events</h1>
            }
            { (addEventFormState == "open" || addEventFormState == "ondisplay" || addEventFormState == "close") && <AddEventForm /> }
            {/* <AddEventForm /> */}
        </div>
    )
}

const Calendar6x7 = styled(FC6x7Calendar)`
    display: flex;
    flex: 0 1 100%;
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
        margin-right: 10px;
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