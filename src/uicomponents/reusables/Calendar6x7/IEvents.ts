interface IRepeatingEvents {
    pattern: "daily" | "weekly" | "monthly" | "annualy";
    endDate?: Date;
    removedAccurances?: Date[];
}

type TEventDateDuration = {
    eventStart: Date;
    eventEnd: Date;
}



export interface IEvents {
    title: string;
    isWholeDay: boolean;
    date: Date | TEventDateDuration;
    reapeat?: IRepeatingEvents
}

export interface IHolidays {
    title: string;
    date: Date;
}