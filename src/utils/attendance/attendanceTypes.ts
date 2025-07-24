export interface AttendanceEntry {
    datetime: Date;
    employeeID: number;
    employeeName: string;
    lateDeduct: number;
    earlyDeduct: number;
    remarks: string;
}

export interface GFormEntry {
    timestamp: string;
    nameofemployee: string;
    action: string;
    note: string;
    date: string;
    additionalnotes: string;
    date1: string;
}

export interface GLogEntry {
    no: string;
    mchn: string;
    enno: string;
    name: string;
    mode: string;
    iomd: string;
    datetime: string;
}

export interface EmployeeInfo {
    lastName: string;
    firstName: string;
    middleName?: string;
    employeeID: number;
    salary: number;
}