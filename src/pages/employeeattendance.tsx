import React, { JSX } from "react";

//ATTENDANCE ROWS SAMPLE OBJECTS
const attendanceRows = [
  {
    id: 1,
    date: "Wednesday, 16 April 2025",
    inTime: "7:45AM",
    outTime: "4:45PM",
    remark: "Arrived early for department meeting.",
  },
  {
    id: 2,
    date: "Thursday, 17 April 2025",
    inTime: "11:00AM",
    outTime: "5:00PM",
    remark: "Late due to LRT Maintenance.",
  },
];
//PTO SAMPLE OBJECTS
const ptoData = [
  { date: "Wednesday, 16 April 2025", credited: "0.5" },
  { date: "Friday, 18 April 2025", credited: "1" },
];




export const EmployeeAttendance = (): JSX.Element => {
  const [tooltipIdx, setTooltipIdx] = React.useState(-1);
  const [activeRemark, setActiveRemark] = React.useState("");

  return (
    <div className="outerwrapper">
      

{
  /*
  <div className="PTO-s-remaining">
              <div className="text-wrapper-4">PTO’s Remaining:</div>

              <div className="text-wrapper-5">5</div>
            </div>
          </div>
        </div>

  */
}
        
        <div className="RIGHT-SIDE-FIELDS">
          

          <div className="headers">
            <div className="date">
              
              

              <div className="text-wrapper-5">Date</div>
            </div>

            <div className="div-wrapper">
              <div className="text-wrapper-5">In Time</div>
            </div>

            <div className="div-wrapper">
              <div className="text-wrapper-5">Out Time</div>
            </div>

            <div className="div-wrapper">
              <div className="text-wrapper-5">PTO Date</div>
            </div>

            <div className="credited">
              <div className="text-wrapper-5">Credited</div>
            </div>
          </div>

          <div className="shadowgap">
            <div className="values-box">
              <div className="left-value-box">
                <div className="rows-wrapper">
                  
                    {attendanceRows.map((row, idx) => (
                        <div
                        key={row.id}
                        className={`attendance-row${idx % 2 === 0 ? " even-row" : " odd-row"}`}
                        >
                        <div className="attendance-cell attendancerownumber">{idx + 1}</div>
                        <div className="attendance-cell attendancedatevalue">{row.date}</div>
                        <div className="attendance-cell attendancerowIN">{row.inTime}</div>
                        <div className="attendance-cell attendancerowOUT">{row.outTime}</div>
                        <div className="attendance-cell remark-cell" style={{ position: "relative" }}>
                            <span
                            className="remark-icon"
                            tabIndex={0}
                            onMouseEnter={() => setTooltipIdx(idx)}
                            onMouseLeave={() => setTooltipIdx(-1)}
                            onClick={() => setActiveRemark(row.remark)}
                            style={{ cursor: "pointer", display: "inline-block" }}
                            >
                            <img
                                src="/mdi_notebook.png"
                                alt="View Remark"
                                style={{ width: 20, height: 20, verticalAlign: "middle" }}
                            />
                            </span>
                            {tooltipIdx === idx && (
                            <span className="remark-tooltip">View Remark</span>
                            )}
                        </div>
                        </div>
                    ))}

                </div>

                <div className="total-deductions">
                  <div className="div-wrapper-2">
                    <div className="text-wrapper-7">Total Deductions</div>
                  </div>

                  <div className="div-wrapper-2">
                    <div className="text-wrapper-8">0.00 PHP</div>
                  </div>
                  <div className="ptos-remainingwrapper">
                    <div className="text-wrapper-4">PTO’s Remaining:</div>

                  <div className="text-wrapper-5">5</div>
                </div>
                  
                </div>
              </div>

            
                
                <div className="pto-wrapper">
                {ptoData.map((pto, idx) => (
                    <div key={idx} className={`pto-row${idx % 2 === 0 ? " even-row" : " odd-row"}`}>
                    <div className="pto-cel pto-index">{idx + 1}</div>
                    <div className="pto-cell pto-date-cell">{pto.date}</div>
                    <div className="pto-cell pto-credit">{pto.credited}</div>
                    
                    </div>
                ))}
                
                 
               
                </div>
                  
                
            </div>
            
          </div>
        </div>
      </div>
    
  );








};

export default EmployeeAttendance;