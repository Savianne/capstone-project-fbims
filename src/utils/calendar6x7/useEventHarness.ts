import React from "react";

import { IDateCell } from "./useCalendar42";
import { IEvent, IHoliday, TEventDateDuration } from "../../uicomponents/reusables/Calendar6x7/interfaces";
import { TCalendar6x7Events } from "../../uicomponents/reusables/Calendar6x7/Calendar6x7";
import { ICellEventHarness } from "../../uicomponents/reusables/Calendar6x7/CalendarView";
import { IEventOfTheDate, IOccuringEventOfTheDate } from "./getEventsOfTheDate";

import YMDtoMS from "./YMD-to-ms";
import compareYDMS from "./compareYMD";

type TGrid = {
    1: ICellEventHarness | null;
    2: ICellEventHarness | null;
    3: ICellEventHarness | null;
    4: ICellEventHarness | null;
}

type TCellGrid = Record<string, TGrid>;

type THarness = Record<string, ICellEventHarness[]>;

interface IEventWithDuration extends IEventOfTheDate {
    date: TEventDateDuration
}

function createGrid(dates: IDateCell[]) {
    return dates.reduce((P, C) => {
        const obj = {[`${C.date.getFullYear()}-${C.date.getMonth() + 1}-${C.date.getDate()}`]: {1: null, 2: null, 3: null, 4: null}} as TCellGrid
        return {...P, ...obj }
    }, {}) as TCellGrid;
}

export default function useEventHarness(dates: IDateCell[], events: TCalendar6x7Events) {
    // let harnessGrid: TCellGrid = React.useMemo(() => {
    //     return dates.reduce((P, C) => {
    //         const obj = {[`${C.date.getFullYear()}-${C.date.getMonth() + 1}-${C.date.getDate()}`]: {1: null, 2: null, 3: null, 4: null}} as TCellGrid
    //         return {...P, ...obj }
    //     }, {});
    // }, [dates, events]);
    
    const [harnessContainer, updateHarnessContainer] = React.useState<THarness | null>(null);
    const [grid , updateGrid] = React.useState(createGrid(dates));
    const [harnessGrid, updateHarnessGrid] = React.useState(createGrid(dates));

    React.useEffect(() => {
        updateGrid(createGrid(dates));
        updateHarnessGrid(createGrid(dates))
    }, [dates]);

    React.useEffect(() => {
        const firstDateOfCalendar42 = Object.keys(events)[0];
        const lastDateOfCalendar42 = Object.keys(events).slice(-1)[0];

        for(let [key, val] of Object.entries(events)) {
            const continuationEvents: (IEventOfTheDate | IOccuringEventOfTheDate)[] = [];
            const eventsToBegin: (IEventOfTheDate | IOccuringEventOfTheDate)[] = [];
            const singleWholedayEventsToBegin: IEventOfTheDate[] = [];

            [...events[key].others, ...events[key].wholedays].forEach(event => event.isContinuation? continuationEvents.push(event) : event.date instanceof Date? singleWholedayEventsToBegin.push(event) : eventsToBegin.push(event));

            // const sortedContinuationEvents = sortByEventDuration(continuationEvents as IEventWithDuration[] , "D");
            const sortedEventsToBegin = sortByEventDuration(eventsToBegin as IEventWithDuration[] , "D");

            const allEventsOfTheDate: (IEventOfTheDate | IOccuringEventOfTheDate | IHoliday)[] = [...continuationEvents, ...sortedEventsToBegin, ...singleWholedayEventsToBegin, ...events[key].holidays, ...events[key].birthdays];

            if(key === firstDateOfCalendar42) {
                const eventToShow = allEventsOfTheDate.length > 4? allEventsOfTheDate.slice(0, 3) : allEventsOfTheDate;

                eventToShow.forEach((event, index) => {
                    // fillGrid(event, index, grid, events, lastDateOfCalendar42);
                    const e = event as IEventOfTheDate;
                    const occuringEvent = event as IOccuringEventOfTheDate;
                    const euid = "occuranceId" in event? occuringEvent.occuranceId : "eventUID"? e.eventUID : null;

                    e.date instanceof Date? (() => {
                        // grid[`${e.date.getFullYear()}-${e.date.getMonth()}-${e.date.getDate()}`][index + 1 as keyof TGrid] = {
                        //     type: 'solid',
                        //     row: index + 1,
                        //     col: 1,
                        //     event: e,
                        //     isContinuation: false,
                        //     forContinuation: false,
                        // }

                        updateHarnessGrid(
                            {
                                ...harnessGrid, 
                                [`${e.date.getFullYear()}-${e.date.getMonth()}-${e.date.getDate()}`]: {
                                    ...harnessGrid[`${e.date.getFullYear()}-${e.date.getMonth()}-${e.date.getDate()}`], 
                                    [index + 1 as keyof TGrid]: {
                                        type: 'solid',
                                        row: index + 1,
                                        col: 1,
                                        event: e,
                                        isContinuation: false,
                                        forContinuation: false,
                                    }
                                }
                            }
                        );
                        
                    })() : (() => {
                        const eventDatesKeyRows = getFollowingDatesOfEventAsString(new Date(key), e.date.eventEnd, new Date(lastDateOfCalendar42));
                        
                        const firstRowDateKeys = eventDatesKeyRows[0];

                        eventDatesKeyRows.forEach(eventDateKeyRow => {
                            console.log(grid)
                            console.log(eventDateKeyRow[0]);
                            const rowPos = findLowestGridAvailabeRow(grid[eventDateKeyRow[0]]);

                            if(rowPos) {
                                const isContinuation = [...events[eventDateKeyRow[0]].others, ...events[eventDateKeyRow[0]].wholedays].find(item => {
                                    const occuranceId = "occuranceId" in item? occuringEvent.occuranceId : e.eventUID;
                                    return euid == occuranceId
                                })?.isContinuation;
                    
                                const forContinuation = [...events[eventDateKeyRow[eventDateKeyRow.length]].others, ...events[eventDateKeyRow[eventDateKeyRow.length]].wholedays].find(item => {
                                    const occuranceId = "occuranceId" in item? occuringEvent.occuranceId : e.eventUID;
                                    return euid == occuranceId
                                })?.forContinuation;
                    
                                const harnessType = [...events[eventDateKeyRow[0]].others, ...events[eventDateKeyRow[0]].wholedays].find(item => {
                                    const occuranceId = "occuranceId" in item? occuringEvent.occuranceId : e.eventUID;
                                    return euid == occuranceId
                                })?.isWholeDay || eventDateKeyRow.length > 1? "solid" : "transparent";
                    
                                const harness: ICellEventHarness = {
                                    type: harnessType,
                                    row: firstRowDateKeys.includes(eventDateKeyRow[0])? index + 1 : rowPos,
                                    col: eventDateKeyRow.length,
                                    event: e,
                                    isContinuation,
                                    forContinuation,
                                }
                    
                                // grid[eventDateKeyRow[0]][rowPos as keyof TGrid] = harness
                    
                                updateHarnessGrid(
                                    {
                                        ...harnessGrid, 
                                        [eventDateKeyRow[0]]: {
                                            ...harnessGrid[eventDateKeyRow[0]], 
                                            [rowPos as keyof TGrid]: harness
                                        }
                                    }
                                );

                                eventDateKeyRow.length > 1 && (() => {
                                    eventDatesKeyRows[0].forEach(datesKey => {
                                        // grid[datesKey][index + 1 as keyof TGrid] =  {
                                        //     type: "spacer",
                                        //     row: firstRowDateKeys.includes(datesKey)? index + 1 : rowPos,
                                        //     col: 1,
                                        //     event: e,
                                        // }

                                        updateHarnessGrid(
                                            {
                                                ...harnessGrid, 
                                                [datesKey]: {
                                                    ...harnessGrid[datesKey], 
                                                    [index + 1 as keyof TGrid]: {
                                                        type: "spacer",
                                                        row: firstRowDateKeys.includes(datesKey)? index + 1 : rowPos,
                                                        col: 1,
                                                        event: e,
                                                    }
                                                }
                                            }
                                        );
                                    })
                                })();
                            }
                                    
                        }) 
                    })()
                });

                allEventsOfTheDate.length > 4 && (() => {
                    // grid[key]['4'] = {
                    //     type: "more-btn",
                    //     row: 4,
                    //     col: 1,
                    //     moreBtnText: `${allEventsOfTheDate.length - 3} more`
                    // };

                    updateHarnessGrid(
                        {
                            ...harnessGrid, 
                            [key]: {
                                ...harnessGrid[key], 
                                4: {
                                    type: "more-btn",
                                    row: 4,
                                    col: 1,
                                    moreBtnText: `${allEventsOfTheDate.length - 3} more`
                                }
                            }
                        }
                    );
                })();

                allEventsOfTheDate.length == 4 && (() => {
                    const e = allEventsOfTheDate[3] as IEventOfTheDate;
                    const occuringEvent = allEventsOfTheDate[3] as IOccuringEventOfTheDate;
                    const euid = "occuranceId" in allEventsOfTheDate[3]? occuringEvent.occuranceId : "eventUID"? e.eventUID : null;
                    e.date instanceof Date? (() => {
                        // grid[key]['4'] = {
                        //     type: 'solid',
                        //     row: 4,
                        //     col: 1,
                        //     event: e as IEvent,
                        //     isContinuation: false,
                        //     forContinuation: false,
                        // }
                        // updateHarnessGrid(
                        //     {
                        //         ...harnessGrid, 
                        //         [key]: {
                        //             ...harnessGrid[key], 
                        //             4: {
                        //                 type: 'solid',
                        //                 row: 4,
                        //                 col: 1,
                        //                 event: e as IEvent,
                        //                 isContinuation: false,
                        //                 forContinuation: false,
                        //             }
                        //         }
                        //     }
                        // );
                    })() : (() => {
                        const eventDatesKeyRows = getFollowingDatesOfEventAsString(new Date(key), e.date.eventEnd, new Date(lastDateOfCalendar42));
                        const firstRowDateKeys = eventDatesKeyRows[0];
                        eventDatesKeyRows.forEach((eventDateKeyRow) => {
                            try {
                                eventDateKeyRow.forEach(eventDateKey => {
                                    if([...events[eventDateKey].birthdays, ...events[eventDateKey].holidays, ...events[eventDateKey].others, ...events[eventDateKey].wholedays].length > 4) throw eventDateKey;
                                });
    
                                const rowPos = findLowestGridAvailabeRow(grid[eventDateKeyRow[0]]);
    
                                const isContinuation = [...events[eventDateKeyRow[0]].others, ...events[eventDateKeyRow[0]].wholedays].find(item => {
                                    const occuranceId = "occuranceId" in item? occuringEvent.occuranceId : e.eventUID;
                                    return euid == occuranceId
                                })?.isContinuation;
    
                                const forContinuation = [...events[eventDateKeyRow[eventDateKeyRow.length]].others, ...events[eventDateKeyRow[eventDateKeyRow.length]].wholedays].find(item => {
                                    const occuranceId = "occuranceId" in item? occuringEvent.occuranceId : e.eventUID;
                                    return euid == occuranceId
                                })?.forContinuation;
    
                                const harnessType = [...events[eventDateKeyRow[0]].others, ...events[eventDateKeyRow[0]].wholedays].find(item => {
                                    const occuranceId = "occuranceId" in item? occuringEvent.occuranceId : e.eventUID;
                                    return euid == occuranceId
                                })?.isWholeDay || eventDateKeyRow.length > 1? "solid" : "transparent";
    
                                const harness: ICellEventHarness = {
                                    type: harnessType,
                                    row: firstRowDateKeys.includes(eventDateKeyRow[0])? 4 : rowPos,
                                    col: eventDateKeyRow.length,
                                    event: e,
                                    isContinuation,
                                    forContinuation,
                                }
    
                                // grid[eventDateKeyRow[0]][rowPos as keyof TGrid] = harness
    
                                updateHarnessGrid(
                                    {
                                        ...harnessGrid, 
                                        [eventDateKeyRow[0]]: {
                                            ...harnessGrid[eventDateKeyRow[0]], 
                                            [rowPos as keyof TGrid]: harness
                                        }
                                    }
                                );

                                eventDateKeyRow.length > 1 && (() => {
                                    eventDatesKeyRows[0].forEach(datesKey => {
                                        // grid[datesKey][4 as keyof TGrid] =  {
                                        //     type: "spacer",
                                        //     row: firstRowDateKeys.includes(datesKey)? 4 : rowPos,
                                        //     col: 1,
                                        //     event: e,
                                        // }
                                        
                                        updateHarnessGrid(
                                            {
                                                ...harnessGrid, 
                                                [datesKey]: {
                                                    ...harnessGrid[datesKey], 
                                                    [4 as keyof TGrid]: {
                                                        type: "spacer",
                                                        row: firstRowDateKeys.includes(datesKey)? 4 : rowPos,
                                                        col: 1,
                                                        event: e,
                                                    }
                                                }
                                            }
                                        );
                                    })
                                })();
                            }
                            catch(harnessEnd) {
                                const eventDatesKeyRows = getFollowingDatesOfEventAsString(new Date(eventDateKeyRow[0]), new Date(harnessEnd as string), new Date(lastDateOfCalendar42));
                                const rowPos = findLowestGridAvailabeRow(grid[eventDateKeyRow[0]]);
    
                                const isContinuation = [...events[eventDateKeyRow[0]].others, ...events[eventDateKeyRow[0]].wholedays].find(item => {
                                    const occuranceId = "occuranceId" in item? occuringEvent.occuranceId : e.eventUID;
                                    return euid == occuranceId
                                })?.isContinuation;
    
                                const forContinuation = [...events[eventDateKeyRow[eventDateKeyRow.length]].others, ...events[eventDateKeyRow[eventDateKeyRow.length]].wholedays].find(item => {
                                    const occuranceId = "occuranceId" in item? occuringEvent.occuranceId : e.eventUID;
                                    return euid == occuranceId
                                })?.forContinuation;
    
                                const harnessType = [...events[eventDateKeyRow[0]].others, ...events[eventDateKeyRow[0]].wholedays].find(item => {
                                    const occuranceId = "occuranceId" in item? occuringEvent.occuranceId : e.eventUID;
                                    return euid == occuranceId
                                })?.isWholeDay || eventDateKeyRow.length > 1? "solid" : "transparent";
    
                                const harness: ICellEventHarness = {
                                    type: harnessType,
                                    row: firstRowDateKeys.includes(eventDateKeyRow[0])? 4 : rowPos,
                                    col: eventDateKeyRow.length,
                                    event: e,
                                    isContinuation,
                                    forContinuation,
                                }
    
                                // grid[eventDateKeyRow[0]][rowPos as keyof TGrid] = harness
    
                                updateHarnessGrid(
                                    {
                                        ...harnessGrid, 
                                        [eventDateKeyRow[0]]: {
                                            ...harnessGrid[eventDateKeyRow[0]], 
                                            [rowPos as keyof TGrid]: harness
                                        }
                                    }
                                );

                                eventDateKeyRow.length > 1 && (() => {
                                    eventDatesKeyRows[0].forEach(datesKey => {
                                        // grid[datesKey][4 as keyof TGrid] =  {
                                        //     type: "spacer",
                                        //     row: firstRowDateKeys.includes(datesKey)? 4 : rowPos,
                                        //     col: 1,
                                        //     event: e,
                                        // }

                                        updateHarnessGrid(
                                            {
                                                ...harnessGrid, 
                                                [datesKey]: {
                                                    ...harnessGrid[datesKey], 
                                                    [4 as keyof TGrid]: {
                                                        type: "spacer",
                                                        row: firstRowDateKeys.includes(datesKey)? 4 : rowPos,
                                                        col: 1,
                                                        event: e,
                                                    }
                                                }
                                            }
                                        );
                                    })
                                })();
                            }
                        })
                    })()
                })() 
            }

            //logic

        }  

        // const harnessContainerMutable: THarness = {};
        
        // for(let [key, val] of Object.entries(grid)) {
        //     harnessContainerMutable[key] = Object.values(val).filter(harness => harness) as ICellEventHarness[]
        // }

        // updateHarnessContainer({...harnessContainerMutable});
    }, [grid]);

    return grid;
}

function sortByEventDuration(eventsToSort: IEventWithDuration[], order: "A" | "D") {
    return eventsToSort.sort((a, b) => {
        const A = a.date.eventEnd.getTime();
        const B = b.date.eventEnd.getTime();

        return order == "A"? A - B : B - A;
    }) as (IEventOfTheDate | IOccuringEventOfTheDate)[];
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



function findLowestGridAvailabeRow(grid: TGrid) {
    const rows: number[] = [];
    for(let [key, val] of Object.entries(grid)) {
        val && rows.push(+key);
    }

    return rows.length? Math.min(...rows) : 0;
}

function fillGrid(event: IEventOfTheDate | IOccuringEventOfTheDate | IHoliday, index: number, grid: TCellGrid, events: TCalendar6x7Events, lastDateOfCalendar42: string) {
    const e = event as IEventOfTheDate;
    const occuringEvent = event as IOccuringEventOfTheDate;
    const euid = "occuranceId" in event? occuringEvent.occuranceId : "eventUID"? e.eventUID : null;

    e.date instanceof Date? (() => {
        grid[`${e.date.getFullYear()}-${e.date.getMonth()}-${e.date.getDate()}`][index + 1 as keyof TGrid] = {
            type: 'solid',
            row: index + 1,
            col: 1,
            event: e,
            isContinuation: false,
            forContinuation: false,
        }
        
    })() : (() => {
        const eventDatesKeyRows = getFollowingDatesOfEventAsString(e.date.eventStart, e.date.eventEnd, new Date(lastDateOfCalendar42));
        
        const firstRowDateKeys = eventDatesKeyRows[0];

        eventDatesKeyRows.forEach(eventDateKeyRow => {

            const rowPos = findLowestGridAvailabeRow(grid[eventDateKeyRow[0]]);

            if(rowPos) {
                const isContinuation = [...events[eventDateKeyRow[0]].others, ...events[eventDateKeyRow[0]].wholedays].find(item => {
                    const occuranceId = "occuranceId" in item? occuringEvent.occuranceId : e.eventUID;
                    return euid == occuranceId
                })?.isContinuation;
    
                const forContinuation = [...events[eventDateKeyRow[eventDateKeyRow.length]].others, ...events[eventDateKeyRow[eventDateKeyRow.length]].wholedays].find(item => {
                    const occuranceId = "occuranceId" in item? occuringEvent.occuranceId : e.eventUID;
                    return euid == occuranceId
                })?.forContinuation;
    
                const harnessType = [...events[eventDateKeyRow[0]].others, ...events[eventDateKeyRow[0]].wholedays].find(item => {
                    const occuranceId = "occuranceId" in item? occuringEvent.occuranceId : e.eventUID;
                    return euid == occuranceId
                })?.isWholeDay || eventDateKeyRow.length > 1? "solid" : "transparent";
    
                const harness: ICellEventHarness = {
                    type: harnessType,
                    row: firstRowDateKeys.includes(eventDateKeyRow[0])? index + 1 : rowPos,
                    col: eventDateKeyRow.length,
                    event: e,
                    isContinuation,
                    forContinuation,
                }
    
                grid[eventDateKeyRow[0]][rowPos as keyof TGrid] = harness
    
                eventDateKeyRow.length > 1 && (() => {
                    eventDatesKeyRows[0].forEach(datesKey => {
                        grid[datesKey][index + 1 as keyof TGrid] =  {
                            type: "spacer",
                            row: firstRowDateKeys.includes(datesKey)? index + 1 : rowPos,
                            col: 1,
                            event: e,
                        }
                    })
                })();
            }
                    
        }) 
    })()
}