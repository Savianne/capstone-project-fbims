import { IEvent, IOccurringEvents, IHoliday, TEventDateDuration } from "../../uicomponents/reusables/Calendar6x7/interfaces";

import compareYMD from "./compareYMD";
import YMDtoMS from "./YMD-to-ms";

//Repeating Events Distributers 
import eventDistributer from "./event-distributer";

interface IGetEventsOfTheDateFNDateParam {
    repeating: IEvent[];
    nonRepeating: IEvent[];
    holidays: IHoliday[];
    birthdays: IHoliday[];
}

export interface IEventOfTheDate extends IEvent {
    isContinuation: boolean,
    forContinuation: boolean,
}

export interface IOccuringEventOfTheDate extends IEventOfTheDate {
    occuranceId: string | number;
}

export type TGetEventsFNRetVal = {
    holidays: IHoliday[];
    birthdays: IHoliday[];
    wholedays: (IEventOfTheDate | IOccuringEventOfTheDate)[];
    others: (IEventOfTheDate | IOccuringEventOfTheDate)[];
} 

export default function getEventsOfTheDate(date: Date, events: IGetEventsOfTheDateFNDateParam): TGetEventsFNRetVal {
    const {daily, weekly} = eventDistributer(date, events.repeating);

    const holidaysEvents = events.holidays.filter(item => {
        return item.date.getMonth() == date.getMonth() && item.date.getDate() == date.getDate();
    });

    const birthdateEvents = events.birthdays.filter(item => {
        return date.getFullYear() >= item.date.getFullYear() && item.date.getMonth() == date.getMonth() && item.date.getDate() == date.getDate() ;
    });

    const nonRepeatingEvents = events.nonRepeating.filter(item => {
        return (item.date instanceof Date)? compareYMD(date, item.date).isSame : YMDtoMS(date) >= YMDtoMS(item.date.eventStart) && YMDtoMS(date) <= YMDtoMS(item.date.eventEnd);
    });

    const dailyEvents = daily.filter(event => {
        // console.log(event)
        return (event.date instanceof Date)? compareYMD(date, event.date).isSame : YMDtoMS(date) >= YMDtoMS(event.date.eventStart) && YMDtoMS(date) <= YMDtoMS(event.date.eventEnd);
    });

    const weeklyEvents = weekly.filter(event => {
        return (event.date instanceof Date)? compareYMD(date, event.date).isSame : YMDtoMS(date) >= YMDtoMS(event.date.eventStart) && YMDtoMS(date) <= YMDtoMS(event.date.eventEnd);
    });

    const mappedEvents: (IEventOfTheDate | IOccuringEventOfTheDate)[] = [...nonRepeatingEvents, ...dailyEvents, ...weeklyEvents].map(event => {
        const isContinuation = event.date instanceof Date? false : YMDtoMS(date) > YMDtoMS(event.date.eventStart);
        const forContinuation = event.date instanceof Date? false : YMDtoMS(date) < YMDtoMS(event.date.eventEnd);
        return "occuranceId" in event? {
            ...event,
            isContinuation,
            forContinuation
        } as IOccuringEventOfTheDate : {
            ...event,
            isContinuation,
            forContinuation
        } as IEventOfTheDate
    });

    const wholedays: typeof mappedEvents = [];
    const others: typeof mappedEvents = [];

    mappedEvents.forEach(event => (event.isWholeDay || (event.isContinuation && event.forContinuation))? wholedays.push(event) : others.push(event));

    const sortedDates = others.sort((a, b) => {
        const A = a.date instanceof Date? YMDtoMS(a.date) : YMDtoMS(a.date.eventStart);
        const B = b.date instanceof Date? YMDtoMS(b.date) : YMDtoMS(b.date.eventStart);

        return A - B
    });

    return {
        holidays: [...holidaysEvents],
        birthdays: [...birthdateEvents],
        wholedays,
        others: sortedDates,
    }
}

