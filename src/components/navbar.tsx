import React, { JSX, useState} from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "./navbar.module.css";
import { useDateTime } from './datetime';
import { useDropdownLogic } from './dropdownlogic'; 
import { dropdownItemsPerRoute } from "./navbarDropDownItems";
const Navbar = (): JSX.Element => {
  
  const dateTime = useDateTime();
  const router = useRouter();
  const { isDropdownOpen, setIsDropdownOpen, dropdownRef,  toggleButtonRef } = useDropdownLogic();
  const [sortAsc, setSortAsc] = useState(true);
  const [filters, setFilters] = useState<Record<string, FilterValue>>({});

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
        .map(([_, data]) => {
          const op = data.operator || "=";
          return `${data.label} ${op} ${data.value}`;
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
            placeholder="Search..."
            />
            {showDropdown && (
            <div className={styles.filterbutton} ref={dropdownRef}>

              
              <button className={styles.img}  ref={toggleButtonRef}
              onClick={() => setIsDropdownOpen(prev => !prev)}
              >
                <img  alt="Vector" src="/Filterdropdown.png "/>
              </button>
              
             <div
                className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.open : ''}`}
                ref={dropdownRef}
              >
              {//DROPDOWN CONTENT IN DIV UNDER HERE
              }
              <div className={styles.dropdownContent}>
                <div className={styles.FilterSide}>
                  <div className={styles.FilterSideHeader}>
                    {
                      //FILTER HERE
                    }
                    Filter
                  </div>
                  {dropdownItems.filterItems.map((item, idx) => (
                    
                      //FILTER MAP HERE
                    
                    <div key={idx} className={styles.dropdownItem}>
                      <label className={styles.dropdownLabel}>
                        {item.label} {item.operator ?? ""}
                      </label>
                      {item.withInput && (
                        <input
            
                          className={styles.dropdownInput}
                          type={item.type === "number" ? "number" : "text"}
                          placeholder={item.type === "number" ? "Enter number" : "Enter text"}
                          value={filters[idx]?.value || ""}
                          onChange={(e) => handleInputChange(idx,item.label, item.type, e.target.value)}
                          onKeyDown={ShowItemAndValue}
                          
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className={styles.SortSide}>
                  <div className={styles.SortSideHeader}>
                    {
                      //SORT HERE
                    }
                    Sort
                    <div className={styles.atoz}>
                    <div>a</div>
                    <div>z</div>
                    </div>
                    <button className={styles.sortbutton}
                    onClick={() => {
                      setSortAsc(prev => {
                        const newState = !prev;
                        setTimeout(() => { 
                  //THE BUTTON FOR SORT ASCENDING AND DESCENDING just change the alert to the actual sort function
                  //strict mode is active alert will happen twice in dev mode acc to gpt
                          alert(newState ? "Ascending" : "Descending");
                        }, 100);
                        return newState;
                      });
                    }}
                    >
                      <Image
                      className={`${styles.sortbtnreal} ${sortAsc ? styles.up : styles.down}`}
                      alt="sort btn" 
                      src="/tabler_arrow-up.png"
                      width={25}
                      height={25}
                       />
                    </button>
                  </div>
                  {
                    //SORT ITEM MAP HERE
                  }
                  {dropdownItems.sortItems.map((item, idx) => (
                    <div key={idx} 
                    className={`${styles.dropdownItem} ${
                      sortState?.field === item ? styles.activeSortItem : ""
                    }`}
                    onClick={() => {
                        const direction = sortAsc ? "asc" : "desc";
                        setSortState({ field: item, direction });
                        //
                        alert("check console for correct SORT")
                        console.log("Sort by:", item, "Order:", direction);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            
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
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.navigationItems}>
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
          <div className={styles.frame}>
            <button
              className={`
                ${styles.navButton}
                ${styles.textWrapper3}
                ${router.pathname === "/edit-history" ? styles.active : ""}
              `}
              onClick={() => router.push("/edit-history")}
            >
              Edit History
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
                ${router.pathname === "/payslip-generator" ? styles.active : ""}
              `}
              onClick={() => router.push("/payslip-generator")}
            >
              Payslip Generator
            </button>
          </div>
          <div className={styles.frame}>
            <button
              className={`
                ${styles.navButton}
                ${styles.textWrapper6}
                ${router.pathname === "/payslip-view" ? styles.active : ""}
              `}
              onClick={() => router.push("/employeeemailer")}
            >
              Payslip View
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
