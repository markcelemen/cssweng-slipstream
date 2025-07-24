
export interface FilterItem {
    label: string; 
    operator?: string; // <= >= : =
    type: "number" | "text" | "text2"; //text 2 allows special characters
    withInput?: boolean;
}
export interface DropdownItems {
    filterItems: FilterItem[];
    sortItems: string[];
}

//change the filter and sort here

export const dropdownItemsPerRoute: Record<string, DropdownItems> = {
"/employeetable": {
    filterItems: [
        { label: "Department", type: "text", withInput: true, operator: ":" },
        { label: "Position", type: "text", withInput: true, operator: ":" },
        { label: "Coordinator", type: "text", withInput: true, operator: ":" },
        { label: "Total Salary", type: "number", withInput: true, operator: "<=" },
        { label: "Total Salary", type: "number", withInput: true, operator: ">=" },
        { label: "Basic Salary", type: "number", withInput: true, operator: "<=" },
        { label: "Basic Salary", type: "number", withInput: true, operator: ">=" },
    ],
    sortItems: ["Row Number", "ID Number", "Total Salary","Basic Salary","Position","Last Name","First Name","Email"],
    },
"/attendancelogtable": {
    filterItems: [ //text 2 for the dates to include special characters
        { label: "Date before", type: "text2", withInput: true, operator: ":" },
        { label: "Date after", type: "text2", withInput: true, operator: ":" },
        { label: "Date during", type: "text2", withInput: true, operator: ":" },
        { label: "Position", type: "text", withInput: true, operator: ":" },
        { label: "Last Name", type: "text", withInput: true, operator: ":" },
        { label: "First Name", type: "text", withInput: true, operator: ":" },
        { label: "Middle Name", type: "text", withInput: true, operator: ":" },
        { label: "Email", type: "text2", withInput: true, operator: ":" },
       
    ],
    sortItems: ["Row Number", "Date", "Time","ID Number","Position","Last Name","First Name","Email"],
    },
};