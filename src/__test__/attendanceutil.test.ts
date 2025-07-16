import { parseCSV, GlogEntry } from "../utils/attendanceutil";
import Papa from "papaparse";

jest.mock("papaparse");

it("parses a CSV file and calls onParsed with parsed data", () => {
  const mockCSVData = [
    [
      "id",
      "position",
      "name",
      "username",
      "date",
      "time",
      "late",
      "lateDeduct",
      "irregular",
      "undertime",
      "undertimeDeduct",
      "excused",
      "note"
    ],
    [
      "1", "Manager", "John Doe", "jdoe", "2023-07-15", "08:00",
      "Yes", "50", "No", "10", "20", "Yes", "Note 1"
    ],
    [
      "2", "Manager", "John Doe", "jdoe", "2023-07-15", "08:00",
      "Yes", "50", "No", "10", "20", "Yes", "Note 1"
    ]
  ];

  // Mock Papa.parse
  (Papa.parse as jest.Mock).mockImplementation((file, config) => {
    config.complete({ data: mockCSVData });
  });

  const mockFile = new File(["dummy content"], "test.csv", { type: "text/csv" });
  const onParsed = jest.fn();

  parseCSV(mockFile, onParsed);

  expect(onParsed).toHaveBeenCalledTimes(1);

  const parsedResult = onParsed.mock.calls[0][0] as GlogEntry[];

  const expectedResult: GlogEntry[] = [
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

  expect(parsedResult[0]).toMatchObject(expectedResult[0]);
  expect(parsedResult[1]).toMatchObject(expectedResult[1]);
});
