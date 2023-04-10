export default function YMDtoMS(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}