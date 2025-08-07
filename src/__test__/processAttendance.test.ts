import { parseCSV } from '../utils/attendance/processAttendance';
import { AttendanceEntry } from '../utils/attendance/attendanceTypes';
import * as processGLog from '../utils/attendance/processGLog';
import * as processGForm from '../utils/attendance/processGForm';
import Papa from 'papaparse';
import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';

jest.mock('papaparse');
jest.mock('../utils/attendance/processGLog');
jest.mock('../utils/attendance/processGForm');
class MockFileReader {
    result: string | null = null;
    onload: ((ev: ProgressEvent<FileReader>) => void) | null = null;

    readAsText(_file: Blob) {
    this.result = `No,Mchn,EnNo,Name,Mode,IOMd,DateTime
    1,1,1001,Speedwagon,1,0,2025-08-01 08:00:00`;
    if (this.onload) {
        const event = {
        target: { result: this.result }
        } as unknown as ProgressEvent<FileReader>;
        this.onload(event);
    }
    }
}

// Assign global mock
global.FileReader = MockFileReader as unknown as typeof FileReader;



describe('parseCSV', () => {
  it('parses GLog CSV and merges normalized data correctly', async () => {
    // Sample CSV text (GLog)
    const sampleCSV = `No,Mchn,EnNo,Name,Mode,IOMd,DateTime
    1,1,1001,Speedwagon,1,0,2025-08-01 08:00:00`;

    // Create a mock File object
    const mockFile = new File([sampleCSV], "sample.csv", { type: "text/csv" });

    // Set up mock implementations
    (Papa.parse as jest.Mock).mockReturnValue({
      data: [{}], // not actually used here
      meta: {
        fields: ["No", "Mchn", "EnNo", "Name", "Mode", "IOMd", "DateTime"]
      }
    });

    const mockParsed = [{
      no: '1',
      mchn: '1',
      enno: '1001',
      name: 'Speedwagon',
      mode: 'IN',
      iomd: '0',
      datetime: '2025-08-01 08:00:00'
    }];

    const mockNormalized: AttendanceEntry[] = [{
        employeeID: 1001,
        employeeName: 'Speedwagon',
        lastName: 'Speedwagon',
        firstName: '',
        datetime: new Date('2025-08-01T08:00:00'),
        remarks: 'IN',
        lateDeduct: 0,
        earlyDeduct: 0,
    }];

    (processGLog.parseGLog as jest.Mock).mockReturnValue(mockParsed);
    (processGLog.normalizeGLog as jest.Mock).mockResolvedValue(mockNormalized);

    // Existing entries
    const existing: AttendanceEntry[] = [];

    // Spy on the onMerged callback
    const onMerged = jest.fn();

    // Run the parseCSV function
    await new Promise<void>((resolve) => {
      parseCSV(mockFile, existing, (merged) => {
        onMerged(merged);
        resolve();
      });
    });

    // Expectations
    expect(Papa.parse).toHaveBeenCalled();
    expect(processGLog.parseGLog).toHaveBeenCalledWith(sampleCSV);
    expect(processGLog.normalizeGLog).toHaveBeenCalledWith(mockParsed);
    expect(onMerged).toHaveBeenCalledWith(mockNormalized);
  });
  
describe('parseCSV (GForm)', () => {
    it('parses GForm CSV and merges normalized data correctly', async () => {
      const sampleCSV = `Timestamp,NAME OF EMPLOYEE,ACTION
  2025-08-01 08:01:00,Jonathan Joestar,IN`;

    const mockFile = new File([sampleCSV], "sample_gform.csv", { type: "text/csv" });

    (Papa.parse as jest.Mock).mockReturnValue({
      data: [{}],
      meta: {
        fields: ["Timestamp", "NAME OF EMPLOYEE", "ACTION"]
      }
    });

    const mockParsed = [{
      timestamp: '2025-08-01 08:01:00',
      employee: 'Jonathan Joestar',
      action: 'IN'
    }];

    const mockNormalized: AttendanceEntry[] = [{
      employeeID: 1002,
      employeeName: 'Jonathan Joestar',
      lastName: 'Joestar',
      firstName: 'Jonathan',
      remarks: 'IN',
      datetime: new Date('2025-08-01 08:01:00'),
      lateDeduct: 0,
      earlyDeduct: 0,
    }];

    (processGForm.parseGForm as jest.Mock).mockReturnValue(mockParsed);
    (processGForm.normalizeGForm as jest.Mock).mockResolvedValue(mockNormalized);

    const existing: AttendanceEntry[] = [];
    const onMerged = jest.fn();

    await new Promise<void>((resolve) => {
      parseCSV(mockFile, existing, (merged) => {
        onMerged(merged);
        resolve();
      });
    });

    expect(onMerged).toHaveBeenCalledWith(mockNormalized);
  });
});

});

