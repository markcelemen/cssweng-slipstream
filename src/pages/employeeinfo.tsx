"use client";
import { useState } from "react";
import { useEffect } from "react";

export default function EmployeeInfoPage() {
  const [profileImage, setProfileImage] = useState("/transparent-background.jpg");

  useEffect(() => {
    // Equivalent to your DOMContentLoaded
    const imageInput = document.getElementById("profileImageInput") as HTMLInputElement;
    const profileImageEl = document.getElementById("profileImage") as HTMLImageElement;

    if (imageInput && profileImageEl) {
      imageInput.addEventListener("change", (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setProfileImage(e.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }, []);

  function addCitizenshipInput() {
    const citizenshipGroup = document.querySelector(".Citizenship-Input-Group");
    const newInput = document.createElement("input");
    newInput.type = "text";
    newInput.className = "Info-Textbox";
    newInput.placeholder = "Enter citizenship";
    citizenshipGroup?.appendChild(newInput);
  }

  return (
    <div className="Employee-Box-Format">
      <div className="Profile-Format-Box">
        <div className="Name-Image-Box">
          <label htmlFor="profileImageInput" className="Profile-Image-Circle">
            <img
              id="profileImage"
              className="Transparent-Background-Icon"
              src={profileImage}
              alt="Profile"
            />
          </label>
          <input
            type="file"
            id="profileImageInput"
            accept="image/*"
            style={{ display: "none" }}
          />

          <span className="Full-Name">Dave Smith</span>
          <span className="Email">davesmith@gmail.com</span>
        </div>

        <div className="ID-Box">
          <span className="ID-Title">ID</span>
          <span className="ID-Number">123456789</span>
        </div>

        <div className="Notes-Box">
          <span className="Notes-Title">Notes</span>
          <textarea className="Notes-Text-Area" placeholder="write notes here"></textarea>
        </div>

        <div className="Current-Row-Box">
          <button className="Arrow-Button">Arrow</button>
          <span className="Current-Row-Title">Current Row</span>
          <span className="Row-Number">[1]</span>
          <button>Arrow</button>
        </div>
      </div>

      <div className="Background-Body">
        <div className="Background-Header">
          <span className="Employee-Title">Employee Details</span>
          <button className="Add-Info-Button">Add Info</button>
        </div>

        <div className="Information-Body">
          <div className="Personal-Information-Box">
            <div className="Personal-Info-Header">
              <span className="Personal-Information-Title">Personal Information</span>
            </div>

            <div className="Personal-Information-Body">
              <div className="Info-Name">
                <div className="Personal-Info-Format">
                  <span className="Info-Label">Date of Birth</span>
                  <div className="Info-Textbox" data-field="dob">
                    Not Set
                  </div>
                </div>

                <div className="Personal-Info-Format">
                  <span className="Info-Label">Mobile Number</span>
                  <div className="Info-Textbox" data-field="mobile">
                    Not Set
                  </div>
                </div>

                <div className="Personal-Info-Format">
                  <span className="Info-Label">Citizenship</span>
                  <button
                    type="button"
                    className="Add-Input-Button"
                    onClick={addCitizenshipInput}
                  >
                    +
                  </button>

                  <div className="Citizenship-Input-Group">
                    <div className="Info-Textbox" data-field="citizenship">
                      Not Set
                    </div>
                  </div>
                </div>

                <div className="Personal-Info-Format">
                  <span className="Info-Label">PhilHealth Number</span>
                  <div className="Info-Textbox" data-field="philhealth">
                    Not Set
                  </div>
                </div>

                <div className="Personal-Info-Format">
                  <span className="Info-Label">Pag-IBIG Number</span>
                  <div className="Info-Textbox" data-field="pagibig">
                    Not Set
                  </div>
                </div>

                <div className="Personal-Info-Format">
                  <span className="Info-Label">Emergency Number</span>
                  <div className="Info-Textbox" data-field="emergency">
                    Not Set
                  </div>
                </div>

                <div className="Personal-Info-Format">
                  <span className="Info-Label">BPI Account Number</span>
                  <div className="Info-Textbox" data-field="bpi">
                    Not Set
                  </div>
                </div>

                <div className="Personal-Info-Format">
                  <span className="Info-Label">SSS Number</span>
                  <div className="Info-Textbox" data-field="sss">
                    Not Set
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="Main-Information-Box">
            <div className="Main-Information-Header">
              <span className="Main-Information-Title">Main Information</span>
            </div>

            <div className="Main-Information-Body">
              <div className="Info-Name">
                <div className="Main-Info-Format">
                  <span className="Info-Label">Position</span>
                  <div className="Info-Textbox" data-field="position">
                    Not Set
                  </div>
                </div>

                <div className="Main-Info-Format">
                  <span className="Info-Label">Department</span>
                  <div className="Info-Textbox" data-field="department">
                    Not Set
                  </div>
                </div>

                <div className="Main-Info-Format">
                  <span className="Info-Label">Status</span>
                  <div className="Info-Textbox" data-field="status">
                    Not Set
                  </div>
                </div>

                <div className="Main-Info-Format">
                  <span className="Info-Label">Begin Date</span>
                  <div className="Info-Textbox" data-field="begin-date">
                    Not Set
                  </div>
                </div>

                <div className="Main-Info-Format">
                  <span className="Info-Label">End Date</span>
                  <div className="Info-Textbox" data-field="end-date">
                    Not Set
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


