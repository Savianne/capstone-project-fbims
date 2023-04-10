
export type TEventDateDuration = {
    eventStart: Date;
    eventEnd: Date;
}

interface IRepeatingEvents {
    pattern: "daily" | "weekly" | "monthly" | "annualy";
    endDate?: Date;
    removedAccurances?: Date[];
}

export interface IEvent {
    eventUID: string | number;
    title: string;
    isWholeDay: boolean;
    date: Date | TEventDateDuration;
    reapeat?: IRepeatingEvents
}

export interface IHoliday {
    holidayUID: string | number;
    title: string;
    date: Date;
}

export interface IOccurringEvents extends IEvent {
    occuranceId: string | number;
}
