
export interface FilterItem {
    label: string; 
    operator?: string; // <= >= : =
    type: "number" | "text";
    withInput?: boolean;
}
export interface DropdownItems {
    filterItems: FilterItem[];
    sortItems: string[];
}



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
    sortItems: ["Row Number", "ID Number", "Total Salary","Basic Salary","Position","Last Name","First Name"],
    },
"/attendanceLog": {
    filterItems: [
        { label: "Date", type: "text", withInput: true },
    ],
    sortItems: ["smtn", "smtn"],
  },
};