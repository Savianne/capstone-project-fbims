import React from 'react'
import { IStyledFC } from '../../IStyledFC';

import { TGetEventsFNRetVal } from '../../../utils/calendar6x7/getEventsOfTheDate';

interface IListViewCalendar extends IStyledFC {
    events: TGetEventsFNRetVal
}
const FCDayView: React.FC<IListViewCalendar> = ({className, events}) => {

    return (
        <div></div>
    )
}

export default FCDayView;