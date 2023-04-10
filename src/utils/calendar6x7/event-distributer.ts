import { IEvent, IOccurringEvents, TEventDateDuration } from "../../uicomponents/reusables/Calendar6x7/interfaces";
import YMDtoMS from "./YMD-to-ms";

export default function eventDistributer(date: Date, events: IEvent[]) {
    const monthEnd = YMDtoMS(new Date(date.getFullYear(), date.getMonth() + 1, 0));

    const eventContainer: {
        daily: IOccurringEvents[],
        weekly: IOccurringEvents[]
    } = {
        daily: [],
        weekly: [],
    };

    for(let c = 1; c <= new Date(monthEnd).getDate(); c++) {
        const contextDate = new Date(date.getFullYear(), date.getMonth(), c);
        events.forEach(event => {
            const eventStarted = event.date instanceof Date? YMDtoMS(contextDate) >= YMDtoMS(event.date) : YMDtoMS(contextDate) >= YMDtoMS(event.date.eventStart);
            
            (   
                eventStarted && 
                !(event.reapeat?.endDate && isEndOfTheRecurringEvent(contextDate, event.reapeat.endDate)) && 
                !(event.reapeat?.removedAccurances?.length && isRemovedAccurance(contextDate, event.date, event.reapeat.removedAccurances))) && 
            (
                function() {
                    const event_date: Date | TEventDateDuration  = event.date instanceof Date? contextDate : 
                    (
                        function() {
                            const hourMins = diffHM(event.date.eventStart, event.date.eventEnd).split(":");
                            const eventStart = new Date(contextDate.getFullYear(), contextDate.getMonth(), contextDate.getDate(), event.date.eventStart.getHours(), event.date.eventStart.getMinutes());
                            const eventEnd = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate(), +hourMins[0], +hourMins[1]);
                            return {
                                eventStart,
                                eventEnd
                            }
                        }
                    )()
                    
                    const e: IOccurringEvents = {
                        ...event,
                        occuranceId: new Date().getTime(),
                        date: event_date
                    }

                    switch(event.reapeat?.pattern) {
                        case "daily":
                            eventContainer.daily.push(e);
                        break;
                        case "weekly":
                            (event.date instanceof Date? event.date.getDay() == contextDate.getDay() : event.date.eventStart.getDay() == contextDate.getDay()) && eventContainer.weekly.push(e);
                    }
                }
            )()
        });
    }

    return eventContainer;
}

export function dailyEventsDistributer(date: Date, dailyEvents: IEvent[]) {
    const monthEnd = YMDtoMS(new Date(date.getFullYear(), date.getMonth() + 1, 0));

    const eventContainer: IOccurringEvents[] = [];

    for(let c = 1; c <= new Date(monthEnd).getDate(); c++) {
        const contextDate = new Date(date.getFullYear(), date.getMonth(), c);
        dailyEvents.forEach(event => {
            const eventStarted = event.date instanceof Date? YMDtoMS(contextDate) >= YMDtoMS(event.date) : YMDtoMS(contextDate) >= YMDtoMS(event.date.eventStart);
            
            (   
                eventStarted && 
                !(event.reapeat?.endDate && isEndOfTheRecurringEvent(contextDate, event.reapeat.endDate)) && 
                !(event.reapeat?.removedAccurances?.length && isRemovedAccurance(contextDate, event.date, event.reapeat.removedAccurances))) && 
            (
                function() {
                    const event_date: Date | TEventDateDuration  = event.date instanceof Date? contextDate : 
                    (
                        function() {
                            const hourMins = diffHM(event.date.eventStart, event.date.eventEnd).split(":");
                            const eventStart = new Date(contextDate.getFullYear(), contextDate.getMonth(), contextDate.getDate(), event.date.eventStart.getHours(), event.date.eventStart.getMinutes());
                            const eventEnd = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate(), +hourMins[0], +hourMins[1]);
                            return {
                                eventStart,
                                eventEnd
                            }
                        }
                    )()
                    
                    const e: IOccurringEvents = {
                        ...event,
                        occuranceId: new Date().getTime(),
                        date: event_date
                    }

                    eventContainer.push(e);
                }
            )()
        });
    }

    return eventContainer;
}

export function weeklyEventsDistributers(date: Date, weeklyEvents: IEvent[]) {
    const monthEnd = YMDtoMS(new Date(date.getFullYear(), date.getMonth() + 1, 0));

    const eventContainer: IOccurringEvents[] = [];

    for(let c = 1; c <= new Date(monthEnd).getDate(); c++) {
        const contextDate = new Date(date.getFullYear(), date.getMonth(), c);
        weeklyEvents.forEach(event => {
            const eventStarted = event.date instanceof Date? YMDtoMS(contextDate) >= YMDtoMS(event.date) : YMDtoMS(contextDate) >= YMDtoMS(event.date.eventStart);
            const eventOfTheWeek = event.date instanceof Date? event.date.getDay() == contextDate.getDay() : event.date.eventStart.getDay() == contextDate.getDay();
            (   
                eventOfTheWeek &&
                eventStarted && 
                !(event.reapeat?.endDate && isEndOfTheRecurringEvent(contextDate, event.reapeat.endDate)) && 
                !(event.reapeat?.removedAccurances?.length && isRemovedAccurance(contextDate, event.date, event.reapeat.removedAccurances))) && 
            (
                function() {
                    const event_date: Date | TEventDateDuration  = event.date instanceof Date? contextDate : 
                    (
                        function() {
                            const hourMins = diffHM(event.date.eventStart, event.date.eventEnd).split(":");
                            const eventStart = new Date(contextDate.getFullYear(), contextDate.getMonth(), contextDate.getDate(), event.date.eventStart.getHours(), event.date.eventStart.getMinutes());
                            const eventEnd = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate(), +hourMins[0], +hourMins[1]);
                            return {
                                eventStart,
                                eventEnd
                            }
                        }
                    )()
                    
                    const e: IOccurringEvents = {
                        ...event,
                        occuranceId: new Date().getTime(),
                        date: event_date
                    }

                    eventContainer.push(e);
                }
            )()
        });
    }

    return eventContainer;
}

function isEndOfTheRecurringEvent(date: Date, endDate: Date) {
    return YMDtoMS(date) >= YMDtoMS(endDate);
}

function isRemovedAccurance(date: Date, eventDate: Date | { eventStart: Date, eventEnd: Date }, removedAccurances: Date[]) {
    return (removedAccurances.filter(removedAccurance => (
        (YMDtoMS(date) == YMDtoMS(removedAccurance)) || 
        (eventDate instanceof Date && eventDate.getMonth() == removedAccurance.getMonth() && eventDate.getDate() == removedAccurance.getDate()) ||
        (!(eventDate instanceof Date) && eventDate.eventStart.getMonth() == removedAccurance.getMonth() && eventDate.eventStart.getDate() == removedAccurance.getDate())
    )).length > 0)? true : false;
}

function diffHM(date1: Date, date2: Date) {
    const diffMilliseconds = date2.getTime() - date1.getTime();
    const diffHours = Math.floor(diffMilliseconds / 3600000);
    const diffMinutes = Math.floor((diffMilliseconds % 3600000) / 60000);

    return `${diffHours}:${diffMinutes}`;
}

function getWeekDaysInMonth(date: Date) {
    const monthEnd = YMDtoMS(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    const weekDaysOfMonth: { 
        "sunday": Date[],
        "monday": Date[],
        "tuesday": Date[],
        "wednesday":  Date[],
        "thursday": Date[],
        "friday": Date[],
        "saturday": Date[],
    } = {
        "sunday": [],
        "monday": [],
        "tuesday": [],
        "wednesday": [],
        "thursday": [],
        "friday": [],
        "saturday": []
    };

    for(let c = 1; c <= new Date(monthEnd).getDate(); c++) {
        const contextDate = new Date(date.getFullYear(), date.getMonth(), c);
        switch(contextDate.getDay()) {
            case 0:
                weekDaysOfMonth.sunday.push(contextDate);
            break;
            case 1:
                weekDaysOfMonth.monday.push(contextDate);
            break;
            case 2:
                weekDaysOfMonth.tuesday.push(contextDate);
            break;
            case 3:
                weekDaysOfMonth.wednesday.push(contextDate);
            break;
            case 4:
                weekDaysOfMonth.thursday.push(contextDate);
            break;
            case 5:
                weekDaysOfMonth.friday.push(contextDate);
            break;
            case 6:
                weekDaysOfMonth.saturday.push(contextDate);
            break;
        }
    }

    return weekDaysOfMonth;
}