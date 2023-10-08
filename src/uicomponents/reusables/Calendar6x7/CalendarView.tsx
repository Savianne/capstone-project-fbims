import React from "react";
import styled from "styled-components";

import { IStyledFC } from "../../IStyledFC";
import { IDateCell } from "../../../utils/calendar6x7/useCalendar42";
import { IHoliday } from "./interfaces";
import { IEventOfTheDate, IOccuringEventOfTheDate } from "../../../utils/calendar6x7/getEventsOfTheDate";
import { TCalendar6x7Events } from "../Calendar6x7/Calendar6x7";
import useEventGrid from "../../../utils/calendar6x7/useEventChip";

export interface ICellEventHarness {
    type: 'solid' | 'transparent' | 'spacer' | 'more-btn';
    row: number;
    col: number;
    event?: IEventOfTheDate | IOccuringEventOfTheDate | IHoliday;
    moreBtnText?: string;
    isContinuation?: boolean;
    forContinuation?: boolean
}

interface ICellEventHarnessAction extends ICellEventHarness {
    action: () => void
}

interface IEventHarness extends IStyledFC {
    harness: ICellEventHarnessAction;
}

const FCEventHarness: React.FC<IEventHarness> = ({className, harness}) => {

    return (
        <div className={className}>
            <div className="harness">
                {
                    harness.isContinuation && <span className="continuation-indicator">
                        <img src="/assets/images/square.png" />
                        <span className="arrow"></span>
                    </span>
                }
                <span className="event-text">
                    {
                        harness.event?.title
                    }
                    {
                        harness.moreBtnText
                    }
                </span>
                {
                    harness.forContinuation && <span className="for-continuation-indicator">
                        <img src="/assets/images/square.png" />
                        <span className="arrow"></span>
                    </span>
                }
            </div>
        </div>
    )
}

const EventHarness = styled(FCEventHarness)`
    position: absolute;
    display: flex;
    width: calc((${(props) => 100 * props.harness.col}%) + ${(props) => 1.5 * (props.harness.col)}px);
    align-items: center;
    height: 25%;
    top: ${(props) => 25 * (props.harness.row - 1)}%;
    
    .harness {
        display: ${(props) => props.harness.type === "spacer"? 'none' : 'flex'};
        flex: 0 1 100%;
        height: 90%;
        margin: 0 2px;
        background-color: ${(props) => props.harness.type === "more-btn" || props.harness.type === "transparent"? 'transparent' : 'rgb(3, 155, 229)'};
        border-radius: ${(props) => {
            return props.harness.isContinuation === false && props.harness.forContinuation === false? "4px" : 
            props.harness.isContinuation && props.harness.forContinuation === false? "0 4px 4px 0" : 
            props.harness.isContinuation === false && props.harness.forContinuation? "4px 0 0 4px" : 0
        }};
        color: ${(props) => props.harness.type === "more-btn" || props.harness.type === "transparent"? props.theme.textColor.strong : "white"};
        font-size: 10px;
        align-items: center;
        overflow: hidden;
        cursor: pointer;
        z-index: 200;
    }
    
    .harness:hover {
        transition: box-shadow 300ms, background-color 300ms;
        box-shadow: rgb(0 0 0 / 20%) 0px 5px 5px -3px;
        background-color: ${(props) => props.harness.type === "more-btn" || props.harness.type === "transparent"? '#0b719f33' : 'rgb(8 132 193)'}; 
    }

    .harness .event-text {
        margin-left: 10px;
    }

    .harness .continuation-indicator,
    .harness .for-continuation-indicator {
        position: relative;
        display: flex;
        height: 100%;
        width: fit-content;
        background-color: rgb(3, 155, 229);
        overflow: hidden;
    }

    .harness .continuation-indicator .arrow,
    .harness .for-continuation-indicator .arrow {
        position: absolute;
        display: inline-block;
        width: 100%;
        height: 100%;
        background-color: ${({theme}) => theme.background.primary};
        transform: rotate(45deg);
        right: 70%;
    }
    
    .harness .for-continuation-indicator {
        margin-left: auto;
        background-color: ${({theme}) => theme.background.primary};
        /* width: 11px;
        box-sizing: border-box;
        top: 0;
        bottom: 2px;
        border-style: solid;
        border-top-width: 11px;
        border-bottom-width: 11px;
        border-color: ${({theme}) => theme.background.primary}; */
    }

    .harness .for-continuation-indicator .arrow {
        background-color: rgb(3, 155, 229);
        right: 30%;
    }

    .harness .for-continuation-indicator img,
    .harness .continuation-indicator img {
        height: 100%;
    }

`

interface ICellEventGrid extends IStyledFC {
    eventHarness: ICellEventHarness[];
}

const FCCellEventGrid: React.FC<ICellEventGrid> = ({className, eventHarness}) => {

    return (
        <div className={className}>
            {
                eventHarness.map(item => (
                    item &&
                    <EventHarness harness={{...item, action() {
                        console.log(item.event?.title)
                    },}} />
                ))
            }
        </div>
    )
}

const CellEventGrid = styled(FCCellEventGrid)`
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 60%;
    /* background-color: gray; */
    bottom: 0;
    overflow: visible;
    /* z-index: 100; */

    .cell-is-continuation {
        margin-left: 0;
        border-radius: 0 4px 4px 0;
    }

    .cell-for-continuation {
        margin-right: 0;
        border-radius: 4px 0 0 4px;
    }
`

interface ICalendarCell extends IStyledFC {
    cellSize: number;
    cell: IDateCell,
    eventHarness: ICellEventHarness[]
}

const FCCalendarCell: React.FC<ICalendarCell> = ({className, cell, eventHarness}) => {
    const elemRef = React.useRef<HTMLSpanElement | null>(null);

    React.useEffect(() => {
        elemRef.current?.setAttribute("istoday", cell.isToday? "true" : "false")
        elemRef.current?.setAttribute("isweekstart", cell.isWeekStart? "true" : "false")
    }, [cell])
    return (
        <span className={className} ref={elemRef}>
            <span className={cell.isPadding? "date-ispadding" : "date"}>{cell.date.getDate()}</span>
            {/* <div className="bottom-right-corner" /> */}
            {
                <CellEventGrid 
                eventHarness={eventHarness} />
            }
        </span>
    )
}

const CalendarCell = styled(FCCalendarCell)`
    position: relative;
    display: flex;
    border: 0.1px solid transparent;
    flex: 1;
    height: ${(props) => `${(0.8 * props.cellSize)}px`};
    justify-content: center;
    overflow: visible;
    /* overflow-x: visible; */
    border-bottom-color: ${({theme}) => theme.borderColor};
    border-left-color: ${({theme}) => theme.borderColor};
    

    :last-child {
        border-right-color: ${({theme}) => theme.borderColor};
    }

    :hover, &[istoday="true"] {
        -webkit-box-shadow: 6px 6px 7px -3px rgba(10,10,10,0.08);
        -moz-box-shadow: 6px 6px 7px -3px rgba(10,10,10,0.08);
        box-shadow: 6px 6px 7px -3px rgba(10,10,10,0.08);
    }

    :hover .bottom-right-corner {
        position: absolute;
        display: inline-block;
        width: 100%;
        height: 100%;
        background-color: ${({theme}) => theme.staticColor.secondary};
        transform: rotate(-45deg);
        opacity: 0.7;
        left: 75%;
        bottom: -75%;
    }

    &[isweekstart="true"]:hover .bottom-right-corner {
        position: absolute;
        display: inline-block;
        width: 100%;
        height: 100%;
        background-color: ${({theme}) => theme.staticColor.delete};
        transform: rotate(-45deg);
        opacity: 0.7;
        left: 75%;
        bottom: -75%;
    }

    &[isweekstart="true"] .date {
        color: ${({theme}) => theme.staticColor.delete};
    }

    &[isweekstart="true"] .date-ispadding {
        color: #f900006e;
        
    }

    &[istoday="true"] .bottom-right-corner , &[istoday="true"]:hover .bottom-right-corner  {
        position: absolute;
        display: inline-block;
        width: 100%;
        height: 100%;
        background-color: ${({theme}) => theme.staticColor.primary};
        transform: rotate(-45deg);
        left: 75%;
        opacity: 0.7;
        bottom: -75%;
    }

    .date, .date-ispadding  {
        color: ${({theme}) => theme.textColor.strong};
        margin-top: 10%;
        font-weight: 600;
        font-size: ${(props) => props.cellSize > 50? "15px" : '11px'};
    }

    .date-ispadding {
        color: ${({theme}) => theme.textColor.disabled};
    }

    
`;

interface ICalendarHead extends IStyledFC {
    cellSize: number
}

const FCCalendarHead: React.FC<ICalendarHead> = ({className, cellSize}) => {

    return (
        <div className={className}>
            {/* <Devider $orientation="vertical" $variant="center" /> */}
            <span className="collumn-head">{cellSize >= 85? "SUNDAY" : "SUN"}</span>
            {/* <Devider $orientation="vertical" $variant="center" /> */}
            <span className="collumn-head">{cellSize >= 85? "MONDAY" : "MON"}</span>
            {/* <Devider $orientation="vertical" $variant="center" /> */}
            <span className="collumn-head">{cellSize >= 85? "TUESDAY" : "TUE"}</span>
            {/* <Devider $orientation="vertical" $variant="center" /> */}
            <span className="collumn-head">{cellSize >= 85? "WEDNESDAY" : "WED"}</span>
            {/* <Devider $orientation="vertical" $variant="center" /> */}
            <span className="collumn-head">{cellSize >= 85? "THURSDAY" : "THU"}</span>
            {/* <Devider $orientation="vertical" $variant="center" /> */}
            <span className="collumn-head">{cellSize >= 85? "FRIDAY" : "FRI"}</span>
            {/* <Devider $orientation="vertical" $variant="center" /> */}
            <span className="collumn-head">{cellSize >= 85? "SATURDAY" : "SAT"}</span>
            {/* <Devider $orientation="vertical" $variant="center" /> */}
        </div>
    )
}

const CalendarHead = styled(FCCalendarHead)`
    display: flex;
    flex: 0 1 100%;
    height: 45px;
    border-radius: 4px 4px 0 0;
    border: 1px solid ${({theme}) => theme.borderColor};
    border-top-width: 3px;
    border-top-color: ${({theme}) => theme.staticColor.primary};
    /* background-color: ${({theme}) => theme.background.lighter}; */

    .collumn-head {
        display: flex;
        flex: 1;
        height: 100%;
        align-items: center;
        justify-content: center;
        /* font-weight: bold; */
        color: ${({theme}) => theme.textColor.strong};
        font-size: 13px;
    }
`


interface ICalendarView extends IStyledFC {
    cellSize: number;
    dates: IDateCell[];
    events: TCalendar6x7Events;
}

const FCCalendarView: React.FC<ICalendarView> = ({className, cellSize, dates, events}) => {

    type TH = Record<string, ICellEventHarness[]>;

    const eventGrid = useEventGrid(React.useMemo(() => {
        return Object.keys(events).reduce((P, C) => {
            const obj = {[C]: {
                events: [...events[C].wholedays, ...events[C].others],
                holidays: [...events[C].holidays, ...events[C].birthdays],
            }}
            return {...P, ...obj }
        }, {});
    }, [events]));

    const [rows, updateRows] = React.useState<[
        typeof dates, 
        typeof dates, 
        typeof dates, 
        typeof dates, 
        typeof dates, 
        typeof dates
    ] | null>(null);

    React.useEffect(() => {
        if(dates) {
            const newRows: [
                typeof dates, 
                typeof dates, 
                typeof dates, 
                typeof dates, 
                typeof dates, 
                typeof dates
            ] = [[], [], [], [], [], []];
    
            dates.forEach((item, index) => {
                index >= 0 && index <= 6 ? newRows[0].push(item) : 
                index >= 7 && index <= 13? newRows[1].push(item) :
                index >= 14 && index <= 20? newRows[2].push(item) :
                index >= 21 && index <= 27? newRows[3].push(item) : 
                index >= 28 && index <= 34? newRows[4].push(item) : 
                newRows[5].push(item);
            });
    
            updateRows(newRows);
        }

    }, [dates]);

    // React.useEffect(() => {
    //     const gridEvents = Object.keys(events).reduce((P, C) => {
    //         const obj = {[C]: {
    //             events: [...events[C].wholedays, ...events[C].others],
    //             holidays: [...events[C].holidays, ...events[C].birthdays],
    //         }}
    //         return {...P, ...obj }
    //     }, {});


    // }, [events])
    React.useEffect(() => {
        console.log(eventGrid)
    },[eventGrid])
    return (
        <div className={className}>
            <CalendarHead cellSize={cellSize}/>
            {
                rows && rows.map((item, index) => {
                    return (
                        <div className="calendar-row">
                            {
                                item.map(item => {
                                    // const h = harness[`${item.date.getFullYear()}-${item.date.getMonth()}-${item.date.getDate()}`]
                                    return (
                                        <CalendarCell cellSize={cellSize} cell={item} 
                                        eventHarness={
                                            Object.values(eventGrid[`${item.date.getFullYear()}-${item.date.getMonth() + 1}-${item.date.getDate()}` as keyof typeof eventGrid])
                                        } />
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

const CalendarView = styled(FCCalendarView)`
    display: flex;
    flex: 0 1 100%;
    height: fit-content;
    flex-wrap: wrap;

    .calendar-row {
        display: flex;
        flex: 0 1 100%;
        height: fit-content;
    }
`;

export default CalendarView;