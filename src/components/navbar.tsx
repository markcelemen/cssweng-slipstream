import React, { JSX, useState} from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "./navbar.module.css";
import { useDateTime } from './datetime';
import { useDropdownLogic } from './dropdownlogic'; 
import { dropdownItemsPerRoute } from "./navbarDropDownItems";
import { Box } from "@chakra-ui/react";

const Navbar = (): JSX.Element => {
  
  const dateTime = useDateTime();
  const router = useRouter();
  const { isDropdownOpen, setIsDropdownOpen, dropdownRef,  toggleButtonRef } = useDropdownLogic();
  const [sortAsc, setSortAsc] = useState(true);
  const [filters, setFilters] = useState<Record<string, FilterValue>>({});
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const [sortState, setSortState] = useState<{
    field: string;
    direction: "asc" | "desc";
  } | null>(null);
  

  type FilterValue = {
    label: string;
    operator?: string;
    type: string;
    value: string;
  };

  // SHOWS AN ALERT ON ENTER PRESS TO SHOW VALUE OF FILTER ITEM AND THE FILTER ITEM.LABEL
  //filters is the object
  const ShowItemAndValue = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const message = Object.entries(filters)
        .map(([idx, data]) => {
          const op = data.operator || "=";
          return `${idx}${data.label} ${op} ${data.value}`;
        })
        .join("\n");

      console.log("Filters object on enter", filters);
      alert(message || "No filters applied.");
    }
  };






  //removes special characters and numbers from text
  // also saves input of filters 
  const handleInputChange = (idx: number, label: string, type: string, value: string) => {
    let filteredValue = value;
    const operator = dropdownItems.filterItems[idx]?.operator;
    if (type === "text") {
      filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
    }
    if (type === "text2") {
      filteredValue = value;
    }

    setFilters((prev) => ({
      ...prev,
      [idx]: {
        label,
        type,
        operator,
        value: filteredValue,
      },
    }));
  };

  const fetchResults = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch("/api/employees/search?q=" + encodeURIComponent(query));
      const data = await res.json();
      setSearchResults(data || []);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    }
  };

  
  //filter and sort button items
  const { pathname } = useRouter();
  const dropdownItems = dropdownItemsPerRoute[pathname];
  const showDropdown = !!dropdownItems;
 
 
 
  //THE RENDERR
  //THE RENDER!!! >>>>>
  return (
    <div className={styles.navbarFrame}>
      <div className={styles.top}>
        <div className={styles.logoAndName}>
          <div className={styles.picframe}>
            <Image
              className={styles.bloomfieldPic}
              alt="Bloomfield pic"
              src="/bloomfieldlogo2.png"
              width={118}
              height={118}
            />
          </div>
          <div className={styles.slipstream}>SLIPSTREAM</div>
        </div>
        <div className={styles.searchrapper}>
          
          <div className={styles.inputrea}>
            
               <Image
              className={styles.vectorz}
              alt="searchbtn"
              src="/Vector.png"
              width={25}
              height={25}
            />
  {
    /////////SEARCH BAR INPUT////////////
  }
            <input
              id="SearchInput"
              className={styles.inputareatextbox}
              type="text"
              placeholder="Search by name or ID..."
              value={searchValue}
              onChange={(e) => {
                const val = e.target.value;
                setSearchValue(val);
                fetchResults(val);
              }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 150)} // delay for click
            />
            {showResults && searchResults.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "48px",
                  left: "0",
                  right: "0",
                  backgroundColor: "#FFFCD9",
                  border: "1px solid #A4B465",
                  zIndex: 999,
                  maxHeight: "240px",
                  overflowY: "auto",
                  borderRadius: "4px",
                  marginTop: "4px",
                }}
              >
                {searchResults.map((emp, i) => (
                  <div
                    key={i}
                    onMouseDown={() => {
                      router.push(`/employeeprofile/${emp.employeeID}`);
                      setSearchValue("");
                      setSearchResults([]);
                    }}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      borderBottom: i !== searchResults.length - 1 ? "1px solid #E0E0B0" : "none",
                      backgroundColor: "#FFFCD9",
                      color: "#3C5E12",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#F6F4CF")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#FFFCD9")}
                  >
                    {emp.lastName}, {emp.firstName} — ID: {emp.employeeID}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
         
        <div className={styles.logoutAndHelp}>
          <button
            className={styles.logoutBtn}
            onClick={async () => {
              await fetch('/api/auth/logout');
              window.location.href = '/login';
            }}
          >  

            <div className={styles.textWrapper}>Logout</div>
          </button>
{/*


<button
            className={styles.helpBtn}
            onClick={() => alert("Help is pressed")}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
          <Image
            className={styles.vector}
            alt="Vector"
            src="/Help.png"
            width={25}
            height={25}
          />
          </button>




*/ }
           
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.navigationItems}>
          {
              /*
          }
          <div className={styles.frame}>
            <button
              className={`
                ${styles.navButton}
                ${styles.textWrapper2}
                ${router.pathname === "/deductions" ? styles.active : ""}
              `}
              onClick={() => router.push("/deductions")}
            >
              Deductions
            </button>
          </div>
          {
            */
          }
          <div className={styles.frame}>
            <button
              className={`
                ${styles.navButton}
                ${styles.textWrapper3}
                ${router.pathname === "/merging" ? styles.active : ""}
              `}
              onClick={() => router.push("/merging")}
            >
              Merge Attendance Data
            </button>
          </div>
          <div className={styles.frame}>
            <button
              className={`
                ${styles.navButton}
                ${styles.textWrapper4}
                ${router.pathname === "/employeetable" ? styles.active : ""}
              `}
              onClick={() => router.push("//employeetable")}
            >
              Employee Overview
            </button>
          </div>
          <div className={styles.frame}>
            <button
              className={`
                ${styles.navButton}
                ${styles.textWrapper5}
                ${router.pathname === "/attendancelogtable" ? styles.active : ""}
              `}
              onClick={() => router.push("/attendancelogtable")}
            >
              Attendance Log
            </button>
          </div>
          <div className={styles.frame}>
            <button
              className={`
                ${styles.navButton}
                ${styles.textWrapper6}
                ${router.pathname === "/employeeemailer" ? styles.active : ""}
              `}
              onClick={() => router.push("/employeeemailer")}
            >
              Mass Emailer
            </button>
          </div>
        </div>

        <div className={styles.dateTime}>
          <div className={styles.textWrapper7}>{dateTime}</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
