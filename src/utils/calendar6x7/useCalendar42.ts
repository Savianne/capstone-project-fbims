import React from "react";

import isToday from "./isTodayHelper";

export interface IDateCell {
    date: Date, 
    isPadding: boolean,
    isToday: boolean,
    isWeekStart: boolean
}

function useCalendar42(initialDate: Date = new Date()) {
    const [onViewDate, updateOnViewDate] = React.useState(initialDate);
    const [date42, updateDate42] = React.useState<IDateCell[] | null>(null);

    React.useEffect(() => {
        //Get the day of the First date of the month
        const firstDayOfTheMonth = new Date(onViewDate.getFullYear(), onViewDate.getMonth(), 1).getDay();
        const dateContainer:IDateCell[] = [];

        for(let date:number = 1; date <= 42; date++) {
            const cellDate = new Date(onViewDate.getFullYear(), onViewDate.getMonth(), -firstDayOfTheMonth + date);
            const isPadding = onViewDate.getMonth() != cellDate.getMonth();

            const dateIsToday = isToday(cellDate)
            const isWeekStart = cellDate.getDay() == 0;
            dateContainer.push({date: cellDate, isPadding, isToday: dateIsToday, isWeekStart});
        }

        updateDate42(dateContainer);
    }, [onViewDate])

    return [
        date42,
        updateOnViewDate
    ] as [typeof date42, typeof updateOnViewDate]

}

export default useCalendar42;