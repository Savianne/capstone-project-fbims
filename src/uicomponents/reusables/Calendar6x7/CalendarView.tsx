import React from "react";
import styled from "styled-components";

import { IStyledFC } from "../../IStyledFC";
import { IDateCell } from "../../../utils/calendar6x7/useCalendar42";

import Devider from "../devider";

interface ICellEventHarness {
    row: number;
    title: string;
    isWholeDay?: boolean;
    isLongEvent?: boolean; 
    start?: Date;
    end?: Date;
    isContinuation?: boolean;
    forContinuation?: boolean
}

interface ICellEventGrid extends IStyledFC {
    eventHarness: ICellEventHarness[];
}

const FCCellEventGrid: React.FC<ICellEventGrid> = ({className, eventHarness}) => {

    return (
        <div className={className}>
            {
                eventHarness.map(item => (
                    <div className="cell-event-harness ">
                        Whole day event
                    </div>
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

    .cell-event-harness {
        display: flex;
        flex: 0 1 100%;
        align-items: center;
        height: 24%;
        margin: 0 3% 3% 3%;
        margin-bottom: 1%;
        background-color: #3788d8;
        border-radius: 4px;
        color: white;
        padding-left: 3px;
        font-size: 10px;
    }

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
    cell: IDateCell
}

const FCCalendarCell: React.FC<ICalendarCell> = ({className, cell}) => {
    const elemRef = React.useRef<HTMLSpanElement | null>(null);

    React.useEffect(() => {
        elemRef.current?.setAttribute("istoday", cell.isToday? "true" : "false")
        elemRef.current?.setAttribute("isweekstart", cell.isWeekStart? "true" : "false")
    }, [cell])
    return (
        <span className={className} ref={elemRef}>
            <span className={cell.isPadding? "date-ispadding" : "date"}>{cell.date.getDate()}</span>
            <div className="bottom-right-corner" />
            <CellEventGrid 
            eventHarness={[
                {
                    row: 4,
                    title: "Whole Day Event"
                },
                {
                    row: 4,
                    title: "Whole Day Event"
                },
                // {
                //     row: 4,
                //     title: "Whole Day Event"
                // },
                // {
                //     row: 4,
                //     title: "Whole Day Event"
                // }
            ]} />
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
    overflow: hidden;
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
        font-weight: bold;
        color: ${({theme}) => theme.textColor.strong};
        font-size: 13px;
    }
`

interface ICalendarView extends IStyledFC {
    cellSize: number,
    dates: IDateCell[]
}

const FCCalendarView: React.FC<ICalendarView> = ({className, cellSize, dates}) => {
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
    return (
        <div className={className}>
            <CalendarHead cellSize={cellSize}/>
            {
                rows && rows.map((item, index) => {
                    return (
                        <div className="calendar-row">
                            {
                                item.map(item => {
                                    return (
                                        <CalendarCell cellSize={cellSize} cell={item} />
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