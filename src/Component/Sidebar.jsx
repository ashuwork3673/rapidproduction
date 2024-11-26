import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import Link from "next/link";

function ResponsiveNavbar() {
  const styles = {
    navbar: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      backgroundColor: "#1a2d43",
      color: "white",
      zIndex: 1000,
      padding: "10px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    logo: {
      fontSize: "1.2rem",
      fontWeight: "bold",
    },
    menu: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      gap: "20px",
    },
    menuItem: {
      textDecoration: "none",
      color: "white",
      fontSize: "1.2rem",
    },
    dropdownMenu: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      backgroundColor: "#1a2d43",
      position: "absolute",
      top: "60px",
      left: "0",
      width: "100%",
      textAlign: "center",
      display: "none", // Hidden by default
      flexDirection: "column",
      gap: "10px",
    },
    dropdownItem: {
      textDecoration: "none",
      color: "white",
      padding: "10px",
      display: "block",
    },
  };

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Rapid Auto Shipping</h2>

      {/* Inline menu for larger screens */}
      <ul
        className={`menu-large ${isDropdownOpen ? "show-mobile-menu" : ""}`}
        style={{
          ...styles.menu,
          display: isDropdownOpen ? "flex" : "",
          flexDirection: isDropdownOpen ? "column" : "",
          gap: isDropdownOpen ? "10px" : "",
        }}
      >
        <li>
          <Link href="/Dashboard" style={styles.menuItem}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/FormQuote" style={styles.menuItem}>
            Form Quote
          </Link>
        </li>
        <li>
          <Link href="/CarriersPage" style={styles.menuItem}>
            Carriers List
          </Link>
        </li>
      </ul>

      {/* Toggle button for smaller screens */}
      <button
        onClick={toggleDropdown}
        className="toggle-btn"
        style={styles.toggleButton}
      >
        <FaBars />
      </button>

      {/* CSS for responsiveness */}
      <style jsx>{`
        
        @media (min-width: 768px) {
          .menu-large {
            display: flex; /* Show menu items inline */
            gap:3%;
            width:50%;
            justify-content:flex-end;
            
          }
          .toggle-btn {
            display: none; /* Hide toggle button */
          }
        }
        @media (max-width: 767px) {
          .menu-large {
            display: none; /* Hide menu by default */
          }
          .toggle-btn {
            display: block; /* Show toggle button */
          }
          .show-mobile-menu {
            display: flex; /* Show menu in mobile view */
          }
        }
      `}</style>
    </nav>
  );
}

export default ResponsiveNavbar;
