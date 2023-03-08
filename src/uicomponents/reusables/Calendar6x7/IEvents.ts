interface IRepeatingEvents {
    pattern: "daily" | "weekly" | "monthly" | "annualy";
    endDate?: Date;
    removedAccurances?: Date[];
}

export interface IEvents {
    title: string;
    date: Date;
    isWholeDay: boolean;
    startTime?: Date;
    endTime?: Date;
    reapeat?: IRepeatingEvents
}