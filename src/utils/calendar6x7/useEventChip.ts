
import React from 'react';
import { IEvent, IHoliday, TEventDateDuration } from "../../uicomponents/reusables/Calendar6x7/interfaces";
import { IEventOfTheDate, IOccuringEventOfTheDate } from "./getEventsOfTheDate";
import { ICellEventHarness } from "../../uicomponents/reusables/Calendar6x7/CalendarView";

import YMDtoMS from "./YMD-to-ms";
import compareYDMS from "./compareYMD";
import compareYMD from './compareYMD';
interface IEventWithDuration extends IEventOfTheDate {
    date: TEventDateDuration
}

type TGrid = {
    1: ICellEventHarness | null;
    2: ICellEventHarness | null;
    3: ICellEventHarness | null;
    4: ICellEventHarness | null;
}

type TCellGrid<T> = Record<keyof T, TGrid>;

interface IEventCategory {
    events: (IEventOfTheDate | IOccuringEventOfTheDate)[];
    holidays: IHoliday[];
}
type TEventParam<T> = Record<keyof T, IEventCategory>;

export default function useEventGrid<T>(events: TEventParam<T>) {
    return React.useMemo(() => {
        const harnessGrid = Object.keys(events).reduce((P, C) => {
            const obj = {[C]: {1: null, 2: null, 3: null, 4: null}}
            return {...P, ...obj }
        }, {} as TCellGrid<T>);

        const firstCellOfGrid = Object.keys(harnessGrid)[0];
        const lastCellOfGrid = Object.keys(harnessGrid).slice(-1)[0];

        Object.keys(harnessGrid).forEach(k => {
            const key = k as keyof T;

            const totalEventCount = events[key].events.length + events[key].holidays.length;

            if(totalEventCount) {
                const continuationEvents: (IEventOfTheDate | IOccuringEventOfTheDate)[] = [];
                const eventsToBegin: (IEventOfTheDate | IOccuringEventOfTheDate)[] = [];
                const singleWholedayEventsToBegin: (IEventOfTheDate | IOccuringEventOfTheDate)[] = [];

                events[key].events.forEach(cellEvent => {
                    "isContinuation" in cellEvent && cellEvent.isContinuation? continuationEvents.push(cellEvent) : cellEvent.date instanceof Date? singleWholedayEventsToBegin.push(cellEvent) : eventsToBegin.push(cellEvent);
                });

                const availableRowLen = Object.values(harnessGrid[key]).filter(row => row === null).length - (totalEventCount > 4? 1 : 0);
                
                const eventToShow: (IEventOfTheDate | IOccuringEventOfTheDate | IHoliday)[] = [...(key === firstCellOfGrid? continuationEvents : []), ...sortByEventDuration(eventsToBegin as IEventWithDuration[], "D"), ...singleWholedayEventsToBegin, ...events[key].holidays].slice(0, availableRowLen);
                
                (() => totalEventCount === 4 && eventToShow.length == 4? eventToShow.slice(0 -1) : eventToShow)().forEach(e => {
                    if(e.date instanceof Date) 
                    {
                        const row = findLowestGridAvailabeRow(harnessGrid[key]);
                        harnessGrid[key][row] = {
                            type: 'solid',
                            row,
                            col: 1,
                            event: e,
                            isContinuation: false,
                            forContinuation: false,
                        }
                    } 
                    else 
                    {
                        const eventDatesKeyRows = getFollowingDatesOfEventAsString(new Date(key as string), e.date.eventEnd, new Date(lastCellOfGrid));    

                        const eventStart = e.date.eventStart;
                        const eventEnd = e.date.eventEnd;
                        
                        eventDatesKeyRows.forEach(eventDateKeyRow => {
                            const oe = e as IEventOfTheDate | IOccuringEventOfTheDate;
                            const row = findLowestGridAvailabeRow(harnessGrid[eventDateKeyRow[0] as keyof T]);
                            
                            const isContinuation = !compareYMD(new Date(eventDateKeyRow[0]), eventStart).isSame
                            const forContinuation = !compareYMD(new Date(eventDateKeyRow[eventDateKeyRow.length - 1]), eventEnd).isSame;
                            const harnessType = oe.isWholeDay || eventDateKeyRow.length > 1? "solid" : "transparent";

                            harnessGrid[eventDateKeyRow[0] as keyof T][row] = {
                                type: harnessType,
                                row: row,
                                col: eventDateKeyRow.length,
                                event: e,
                                isContinuation,
                                forContinuation,
                            }

                            eventDateKeyRow.length > 1 && (() => {
                                eventDateKeyRow.slice(1).forEach(dateKey => {
                                    harnessGrid[dateKey as keyof T][row] = {
                                        type: "spacer",
                                        row: row,
                                        col: 1,
                                        event: e,
                                    }
                                })
                            })()

                        })
                    }
                });

                if(totalEventCount === 4 && eventToShow.length == 4) {
                    const e = eventToShow[3];
                    if(e.date instanceof Date) 
                    {
                        const row = findLowestGridAvailabeRow(harnessGrid[key]);
                        harnessGrid[key][row] = {
                            type: 'solid',
                            row,
                            col: 1,
                            event: e,
                            isContinuation: false,
                            forContinuation: false,
                        }
                    } 
                    else
                    {
                        const eventDatesKeyRows = getFollowingDatesOfEventAsString(new Date(key as string), e.date.eventEnd, new Date(lastCellOfGrid));    

                        const eventStart = e.date.eventStart;
                        const eventEnd = e.date.eventEnd;

                        try {
                            eventDatesKeyRows.forEach(eventDateKeyRow => {
                                try {
                                    eventDateKeyRow.forEach(eventKey => {
                                        if((events[eventKey as keyof T].events.length + events[eventKey as keyof T].holidays.length) > 4) throw eventKey;
                                    })
                                }
                                catch(e) 
                                {
                                    throw e;
                                }
                            });

                            eventDatesKeyRows.forEach(eventDateKeyRow => {
                                const row = findLowestGridAvailabeRow(harnessGrid[eventDateKeyRow[0] as keyof T]);
                                
                                const oe = e as IEventOfTheDate | IOccuringEventOfTheDate;

                                const isContinuation = !compareYMD(new Date(eventDateKeyRow[0]), eventStart).isSame
                                const forContinuation = !compareYMD(new Date(eventDateKeyRow[eventDateKeyRow.length - 1]), eventEnd).isSame;
                                const harnessType = oe.isWholeDay || eventDateKeyRow.length > 1? "solid" : "transparent";

                                harnessGrid[eventDateKeyRow[0] as keyof T][row] = {
                                    type: harnessType,
                                    row: row,
                                    col: eventDateKeyRow.length,
                                    event: e,
                                    isContinuation,
                                    forContinuation,
                                }

                                eventDateKeyRow.length > 1 && (() => {
                                    eventDateKeyRow.slice(1).forEach(dateKey => {
                                        harnessGrid[dateKey as keyof T][row] = {
                                            type: "spacer",
                                            row: row,
                                            col: 1,
                                            event: e,
                                        }
                                    })
                                })()

                            })
                        }
                        catch(e) {
                            harnessGrid[key][4] = {
                                type: "more-btn",
                                row: 4,
                                col: 1,
                                isContinuation: false,
                                forContinuation: false,
                                moreBtnText: `${(totalEventCount) - (Object.values(harnessGrid[key]).filter(row => row).length) + eventToShow.length} more`
                            }
                        }
                    } 
                } 

                if(totalEventCount === 4 && eventToShow.length < 4) {
                    harnessGrid[key][4] = {
                        type: "more-btn",
                        row: 4,
                        col: 1,
                        isContinuation: false,
                        forContinuation: false,
                        moreBtnText: `${(totalEventCount) - (Object.values(harnessGrid[key]).filter(row => row).length) + eventToShow.length} more`
                    }
                }

                if(totalEventCount > 4) {
                    harnessGrid[key][4] = {
                        type: "more-btn",
                        row: 4,
                        col: 1,
                        isContinuation: false,
                        forContinuation: false,
                        moreBtnText: `${(totalEventCount) - (Object.values(harnessGrid[key]).filter(row => row).length) + eventToShow.length} more`
                    }
                }
                
            }

            
        });

        return harnessGrid;
    }, [events]);
}


function sortByEventDuration(eventsToSort: IEventWithDuration[], order: "A" | "D") {
    return eventsToSort.sort((a, b) => {
        const A = a.date.eventEnd.getTime();
        const B = b.date.eventEnd.getTime();

        return order == "A"? A - B : B - A;
    }) as (IEventOfTheDate | IOccuringEventOfTheDate)[];
}

function findLowestGridAvailabeRow(grid: TGrid) {
    const rows: number[] = [];
    for(let [key, val] of Object.entries(grid)) {
        val == null && rows.push(+key);
    }
    
    return Math.min(...rows) as keyof typeof grid
}

function getFollowingDatesOfEventAsString(eventStart: Date, eventEnd: Date, lastDateOfCalendar42: Date) {
    const dateContainer: (string | false)[] = [];
    let rowContainer: (string | false)[][] = [];
    const firstSunday = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate() - eventStart.getDay());
    const lastSaturday = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate() + (6 - eventEnd.getDay()));

    let i: number | null = 0;

    while(i != null) {
        const d = new Date(firstSunday.getFullYear(), firstSunday.getMonth(), firstSunday.getDate() + i);
        dateContainer.push( YMDtoMS(d) >= YMDtoMS(eventStart) && YMDtoMS(d) <= YMDtoMS(eventEnd)? `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` : false);
        compareYDMS(d, lastSaturday).isSame || compareYDMS(d, lastDateOfCalendar42).isSame? i = null : i++;
    }

    const totalRow = dateContainer.length / 7;

    for(let c = 0; c < totalRow; c++) {
        rowContainer.push([...dateContainer.slice(7 * c, 7 * (c + 1))]);
    }

    rowContainer[0] = [...rowContainer[0].filter(item => item)];
    rowContainer[rowContainer.length - 1] = [...rowContainer[rowContainer.length - 1].filter(item => item)];

    return rowContainer as string[][];
}
