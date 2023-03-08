export default function isCurrentMonth(d: Date) {
    return d.getFullYear() === new Date().getFullYear() && d.getMonth() === new Date().getMonth()? true : false
}