import isToday from "../../../utils/calendar6x7/isTodayHelper";
import dateIsCurrentMonth from "../../../utils/calendar6x7/dateIsCurrentMonthHelper";

export default function calendarDateText(date = new Date(), toggle: "month" | "day" ) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return toggle == "month"? (isToday(date) || dateIsCurrentMonth(date))? `${months[date.getMonth()]} ${new Date().getDate()}, ${date.getFullYear()}` : `${months[date.getMonth()]}, ${date.getFullYear()}` : `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}