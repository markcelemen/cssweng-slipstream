import { parseGForm, normalizeGForm } from '../utils/attendance/processGForm';
import { GFormEntry, EmployeeInfo } from '../utils/attendance/attendanceTypes';

// Mock `fetch` for normalizeGForm
global.fetch = jest.fn();

const sampleCSV = `Timestamp,Name of Employee,Action,Note,Date,Additional Notes,Date
"2/17/2025 11:13:54","Joestar, Johnathan J.","Clock In","School Convention outside of campus","1/31/2025","",""
"2/17/2025 13:47:20","Brando, Dio D.","Clock In","Biometrics issue (power interruption, fingerprint error)","2/7/2025","",""
"2/19/2025 8:03:39","Joestar, Johnathan J.","Clock Out","Work from Home","2/19/2025","",""
"2/19/2025 17:02:55","Brando, Dio D.","Clock Out","Work From Home. Was sick","2/19/2025","",""`;


describe('parseGForm with real-world sample', () => {
  it('should correctly parse multiple GForm entries', () => {
    const parsed = parseGForm(sampleCSV);

    expect(parsed.length).toBe(4);
    expect(parsed[0].nameofemployee).toBe('Joestar, Johnathan J.');
    expect(parsed[1].action).toBe('Clock In');
    expect(parsed[2].note).toMatch(/Work from Home/i);
  });
});

describe('normalizeGForm with mocked fetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('normalizes parsed entries using mocked employee data', async () => {
    const parsedEntries = parseGForm(sampleCSV);

    const mockEmployeeInfo: EmployeeInfo[] = [
      {
        employeeID: 1,
        firstName: 'Johnathan',
        lastName: 'Joestar',
        middleName: 'J',
        salary: 30000,
      },
      {
        employeeID: 2,
        firstName: 'Dio',
        lastName: 'Brando',
        middleName: 'D',
        salary: 32000,
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEmployeeInfo,
    });

    const normalized = await normalizeGForm(parsedEntries);

    expect(normalized.length).toBe(4);
    expect(normalized[0].employeeName).toBe('Joestar, Johnathan J.');
    expect(normalized[1].employeeID).toBe(2);
    expect(normalized[2].remarks).toMatch(/Work from Home/i);
    expect(typeof normalized[0].lateDeduct).toBe('number');
    expect(normalized[0].datetime).toBeInstanceOf(Date);
  });
});