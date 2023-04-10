
export default function compareYMD(date: Date, dateToCompare: Date) {
    date.setHours(0, 0, 0, 0);
    const toCompare = new Date(dateToCompare.getFullYear(), dateToCompare.getMonth(), dateToCompare.getDate())

    return {
        isSame: date.getTime() == toCompare.getTime()
    }
}