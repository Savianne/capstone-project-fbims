
function isToday(dateToCheck: Date) {
    const today: Date = new Date(); // Today's date

    dateToCheck.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return dateToCheck.getTime() == today.getTime();
}

export default isToday;