const mongoose = require('mongoose');
const Papa = require('papaparse');

/*
    * Placeholder for attendance data model.
    * TODO: Define the fields. (prolly files in glogRaw, csvRaw, glogProcessed, csvProcessed, combinedProcessed)
    * or separate glog from csv
 */

const attendanceTrackerSchema = new mongoose.Schema(
    {}
);

attendanceTrackerSchema.methods.parseCSV = function(csvData) {
    const parsedData = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true
    });
    return parsedData.data;
};

// from jan 1
// to jan 15
attendanceTrackerSchema.methods.generateAttendanceSlip = function(employeeId, from, to, 
    lateThreshold, overtimeThreshold) {
    // Placeholder for attendance checking logic
    // This should check if the employee with employeeName has attendance recorded for the given date
    return false; // Default to false for now
}

// schema has fields for late, overtime, etc.

