import { parseGLog, normalizeGLog } from '../utils/attendance/processGLog';
import { EmployeeInfo, GLogEntry } from '../utils/attendance/attendanceTypes';

global.fetch = jest.fn();

const validGLogCSV = `No,Mchn,EnNo,Name,Mode,IOMd,DateTime
1,1,1001,Speedwagon,1,0,2025-08-01 08:00:00
2,1,1002,Zeppeli,OUT,1,2025-08-01 17:15:00`;

describe('parseGLog', () => {
  it('parses valid GLog CSV correctly', () => {
    const result = parseGLog(validGLogCSV);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      no: '1',
      mchn: '1',
      enno: '1001',
      name: 'Speedwagon',
      mode: '1',
      iomd: '0',
      datetime: '2025-08-01 08:00:00',
    });
  });

  it('throws on malformed CSV', () => {
    const badCSV = `No,Mchn,EnNo,Name,Mode,IO-MD,DateTime\n1,1,1001,Speedwagon,IN,0`;
    expect(() => parseGLog(badCSV)).toThrow(/Error parsing GLog CSV/);
  });
});

describe('normalizeGLog', () => {
  beforeEach(() => jest.clearAllMocks());

  it('normalizes entries using mocked employee info', async () => {
    const parsed: GLogEntry[] = [
      {
        no: '1',
        mchn: '1',
        enno: '1001',
        name: 'Speedwagon',
        mode: 'IN',
        iomd: '0',
        datetime: '2025-08-01 08:00:00',
      },
      {
        no: '2',
        mchn: '1',
        enno: '1002',
        name: 'Zeppeli',
        mode: 'OUT',
        iomd: '1',
        datetime: '2025-08-01 17:15:00',
      },
    ];

    const mockEmployees: EmployeeInfo[] = [
      {
        employeeID: 1001,
        firstName: 'Robert',
        lastName: 'Speedwagon',
        middleName: 'E',
        salary: 25000,
      },
      {
        employeeID: 1002,
        firstName: 'Will',
        lastName: 'Zeppeli',
        middleName: '',
        salary: 30000,
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEmployees,
    });

    const normalized = await normalizeGLog(parsed);

    expect(normalized).toHaveLength(2);
    expect(normalized[0].employeeName).toBe('Speedwagon, Robert E.');
    expect(normalized[1].employeeID).toBe(1002);
    expect(normalized[0].remarks).toBe('');
    expect(typeof normalized[0].lateDeduct).toBe('number');
    expect(normalized[1].datetime).toBeInstanceOf(Date);
  });

    it('handles names with multiple spaces and trims correctly', () => {
        const csv = `No,Mchn,EnNo,Name,Mode,IOMd,DateTime
        1,1,800816,DAVID     ,1,0,6/16/2025 5:26
        2,1,800840,RONALDO,1,0,6/18/2025 8:23`;

        const result = parseGLog(csv);
        expect(result).toHaveLength(2);
        expect(result[0].name.trim()).toBe('DAVID');
        expect(result[1].enno).toBe('800840');
    });
});