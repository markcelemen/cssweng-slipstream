import React, { JSX, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "./navbar.module.css";

const Navbar = (): JSX.Element => {
  const [dateTime, setDateTime] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const date = now.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const time = now.toLocaleTimeString([], {
        hour12: true,
      });
      const formatted = `${date} ${time}`;
      setDateTime(formatted);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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

        <div className={styles.searchWrapper}>
          <div className={styles.searchbar}>
            <div className={styles.overlapGroup}>
              <div className={styles.rectangle} />

              <div className={styles.inputField}>
                <div className={styles.div} />
              </div>

              <Image
                className={styles.searchbtn}
                alt="Searchbtn"
                src="/Vector.png"
                width={45}
                height={45}
              />

              <Image
                className={styles.filterdropdown}
                alt="Filterdropdown"
                src="/Filterdropdown.png"
                width={45}
                height={45}
              />
            </div>
          </div>
        </div>

        <div className={styles.logoutAndHelp}>
          <button className={styles.logoutBtn} onClick={() => alert("Logout pressed")}>
             

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
