import { parseCSV, GlogEntry } from "../utils/attendanceutil";
import Papa from "papaparse";

jest.mock("papaparse");

it("parses a real CSV file and calls onParsed with parsed data", () => {
  const mockData = [
    [
      "id", "position", "name", "username", "date", "time", "late", "lateDeduct", "irregular", "undertime", "undertimeDeduct", "excused", "note"
    ],
    [
      "1", "Manager", "John Doe", "jdoe", "2023-07-15", "08:00", "Yes", "50", "No", "10", "20", "Yes", "Note 1"
    ],
    [
      "2", "Manager", "John Doe", "jdoe", "2023-07-15", "08:00", "Yes", "50", "No", "10", "20", "Yes", "Note 1"
    ]
  ];

  const expected: GlogEntry[] = [
    {
      id: "1",
      position: "Manager",
      name: "John Doe",
      username: "jdoe",
      date: new Date("2023-07-15 08:00"),
      time: "08:00",
      late: "Yes",
      lateDeduct: "50",
      irregular: "No",
      undertime: "10",
      undertimeDeduct: "20",
      excused: "Yes",
      note: "Note 1"
    },
    {
      id: "2",
      position: "Manager",
      name: "John Doe",
      username: "jdoe",
      date: new Date("2023-07-15 08:00"),
      time: "08:00",
      late: "Yes",
      lateDeduct: "50",
      irregular: "No",
      undertime: "10",
      undertimeDeduct: "20",
      excused: "Yes",
      note: "Note 1"
    }
  ];

  // @ts-ignore: Mocking Papa.parse
  Papa.parse.mockImplementation((file, config) => {
    config.complete({ data: mockData });
  });

  const dummyFile = new File(["dummy content"], "dummy.csv", { type: "text/csv" });

  const onParsed = (data: GlogEntry[]) => {
    expect(data[0]).toMatchObject(expected[0]);
    expect(data[1]).toMatchObject(expected[1]);
  };

  parseCSV(dummyFile, onParsed);
});
