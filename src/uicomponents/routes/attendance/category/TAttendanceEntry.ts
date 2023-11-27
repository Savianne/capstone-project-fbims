type TAttendanceEntry = {
    attender: "select" | "all",
    categoryTitle: string,
    categoryUID: string,
    date: string,
    description: string,
    entryUID: string,
    type: "basic" | "detailed",
    pending: boolean,
    saved: boolean
};

export default TAttendanceEntry;