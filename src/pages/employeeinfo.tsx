"use client";
import { useState, useEffect } from "react";

export default function EmployeeInfoPage() {
  const [profileImage, setProfileImage] = useState("/transparent-background.jpg");
  const [showModal, setShowModal] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [infoSection, setInfoSection] = useState<"personal" | "main">("personal");

  useEffect(() => {
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

    newInput.addEventListener("blur", () => {
      if (newInput.value.trim() === "") {
        citizenshipGroup?.removeChild(newInput);
      }
    });

    newInput.focus();
  }

  function saveNewInfo() {
    if (!newLabel.trim() || !newValue.trim()) {
      alert("Please enter both label and value.");
      return;
    }

    const newDiv = document.createElement("div");
    newDiv.className =
      infoSection === "personal" ? "Personal-Info-Format" : "Main-Info-Format";

    const labelSpan = document.createElement("span");
    labelSpan.className = "Info-Label";
    labelSpan.innerText = newLabel;

    const valueDiv = document.createElement("div");
    valueDiv.className = "Info-Textbox";
    valueDiv.innerText = newValue;

    newDiv.appendChild(labelSpan);
    newDiv.appendChild(valueDiv);

    if (infoSection === "personal") {
      document.querySelector(".Personal-Information-Body .Info-Name")?.appendChild(newDiv);
    } else {
      document.querySelector(".Main-Information-Body .Info-Name")?.appendChild(newDiv);
    }

    closeAddInfoModal();
  }

  function openAddInfoModal() {
    setShowModal(true);
    setNewLabel("");
    setNewValue("");
    setInfoSection("personal");
  }

  function closeAddInfoModal() {
    setShowModal(false);
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
          <button className="Arrow-Left-Button">
            <img src="/arrow-picture.svg" alt="Arrow-Left" width="24" height="24" />
          </button>
          <span className="Current-Row-Title">Current Row</span>
          <span className="Row-Number">[1]</span>
          <button className="Arrow-Right-Button">
            <img src="/arrow-picture.svg" alt="Arrow-Right" width="24" height="24" />
          </button>
        </div>
      </div>

      <div className="Background-Body">
        <div className="Background-Header">
          <span className="Employee-Title">Employee Details</span>
          <button className="Add-Info-Button" onClick={openAddInfoModal}>
            Add Info
          </button>
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
                  <div className="Info-Textbox">Not Set</div>
                </div>

                <div className="Personal-Info-Format">
                  <span className="Info-Label">Mobile Number</span>
                  <div className="Info-Textbox">Not Set</div>
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
                  <div className="Info-Textbox">Not Set</div>
                  <div className="Citizenship-Input-Group"></div>
                </div>

                <div className="Personal-Info-Format">
                  <span className="Info-Label">PhilHealth No.</span>
                  <div className="Info-Textbox">Not Set</div>
                </div>

                <div className="Personal-Info-Format">
                  <span className="Info-Label">Pag-IBIG No.</span>
                  <div className="Info-Textbox">Not Set</div>
                </div>

                <div className="Personal-Info-Format">
                  <span className="Info-Label">Emergency No.</span>
                  <div className="Info-Textbox">Not Set</div>
                </div>

                <div className="Personal-Info-Format">
                  <span className="Info-Label">BPI Account No.</span>
                  <div className="Info-Textbox">Not Set</div>
                </div>

                <div className="Personal-Info-Format">
                  <span className="Info-Label">SSS No.</span>
                  <div className="Info-Textbox">Not Set</div>
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
                  <div className="Info-Textbox">Not Set</div>
                </div>
                <div className="Main-Info-Format">
                  <span className="Info-Label">Department</span>
                  <div className="Info-Textbox">Not Set</div>
                </div>
                <div className="Main-Info-Format">
                  <span className="Info-Label">Status</span>
                  <div className="Info-Textbox">Not Set</div>
                </div>
                <div className="Main-Info-Format">
                  <span className="Info-Label">Begin Date</span>
                  <div className="Info-Textbox">Not Set</div>
                </div>
                <div className="Main-Info-Format">
                  <span className="Info-Label">End Date</span>
                  <div className="Info-Textbox">Not Set</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div id="add-info-modal" className="Add-Info-Modal">
          <div className="Add-Info-Modal-Content">
            <div className="Add-Info-Modal-Header">
              <h2>Add New Info</h2>
              <span className="Add-Info-Modal-Close" onClick={closeAddInfoModal}>
                &times;
              </span>
            </div>
            <label htmlFor="new-info-label">Label:</label>
            <input
              id="new-info-label"
              type="text"
              placeholder="Label"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
            <label htmlFor="new-info-value">Value:</label>
            <input
              id="new-info-value"
              type="text"
              placeholder="Value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
            <label htmlFor="info-section">Section:</label>
            <select
              id="info-section"
              value={infoSection}
              onChange={(e) => setInfoSection(e.target.value as "personal" | "main")}
            >
              <option value="personal">Personal Information</option>
              <option value="main">Main Information</option>
            </select>
            <div className="Add-Info-Modal-Buttons">
              <button onClick={saveNewInfo}>Save</button>
              <button onClick={closeAddInfoModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
