import React from "react";

import { IDateCell } from "./useCalendar42";
import { IEvents } from "../../uicomponents/reusables/Calendar6x7/IEvents";

type TGrid = {
    1: boolean;
    2: boolean;
    3: boolean;
    4: boolean;
}

export default function useEventHarness(dates: IDateCell[], events: IEvents[]) {
    const [grid, updateGrid] = React.useState(createCellGrid(dates));
    React.useEffect(() => {
        updateGrid(createCellGrid(dates))
    }, [dates, events])

    return grid;
}

function createCellGrid(dates: IDateCell[]) {
    return dates.reduce((P, C) => {
        const obj = {[`${C.date.getFullYear()}-${C.date.getMonth() + 1}-${C.date.getDate()}`]: {1: false, 2: false, 3: false, 4: false}} as {[key:string]: TGrid}
        return {...P, ...obj }
    }, {});
}