interface IPendingEntry {
    attender: "select" | "all";
    categoryTitle: string;
    categoryUID: string;
    date: string;
    description: string;
    entryUID: string;
    type: "basic" | "detailed";
}

export default IPendingEntry;