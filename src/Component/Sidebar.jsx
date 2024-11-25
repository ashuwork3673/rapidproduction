import React, { useState } from "react";
import { FaHome, FaFileAlt, FaClipboardList, FaBars } from "react-icons/fa";
import Link from "next/link";

function ResponsiveSidebar() {
    const styles = {
        container: {
          display: "flex",
          flexDirection: "row",
          alignItems:"center"

         
        },
        /* Sidebar (large screens) */
        sidebarLarge: {
          display: "none",
          flexDirection: "column",
          width: "250px",
          backgroundColor: "#1a2d43",
          color: "white",
          padding: "20px",
          height: "100vh",
        },
        logo: {
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "20px",
        },
        menu: {
          listStyle: "none",
          padding: 0,
        },
        menuItem: {
          marginBottom: "15px",
        },
        link: {
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          color: "white",
          padding: "10px 15px",
          borderRadius: "5px",
          transition: "background-color 0.3s",
        },
        linkHover: {
          backgroundColor: "#ff007b",
        },
        icon: {
          marginRight: "10px",
          fontSize: "1.2rem",
        },
        text: {
          fontSize: "1rem",
        },
      
        /* Navbar (small screens) */
        navbarSmall: {
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#1a2d43",
          color: "white",
          zIndex: 50,
        },
        navbarHeader: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
        },
        toggleButton: {
          backgroundColor: "#007aff",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
        },
        navbarMenu: {
          listStyle: "none",
          padding: 0,
          backgroundColor: "#1a2d43",
        },
        /* Main Content */
        content: {
          flexGrow: 1,
          backgroundColor: "#f0f0f0",
          padding: "20px",
          marginLeft: "250px", // Matches sidebar width
        },
        heading: {
          color: "#1a2d43",
          fontSize: "2rem",
        },
        paragraph: {
          marginTop: "10px",
          color: "#333",
        },
      };
      
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div style={styles.container}>
      {/* Sidebar for large screens */}
     

      {/* Navbar for small screens */}
      <div style={styles.navbarSmall}>
        <div style={styles.navbarHeader}>
          <h2 style={styles.logo}>Rapid Auto Shipping</h2>
          <button onClick={toggleSidebar} style={styles.toggleButton}>
            <FaBars />
          </button>
        </div>
        {isSidebarOpen && (
          <ul style={styles.navbarMenu}>
            <li style={styles.menuItem}>
              <Link href="/Dashboard" style={styles.link} onClick={toggleSidebar}>
                <FaHome style={styles.icon} />
                <span style={styles.text}>Dashboard</span>
              </Link>
            </li>
            <li style={styles.menuItem}>
              <Link href="/FormQuote" style={styles.link} onClick={toggleSidebar}>
                <FaFileAlt style={styles.icon} />
                <span style={styles.text}>Form Quote</span>
              </Link>
            </li>
          <li style={styles.menuItem}>
              <Link href="/CarriersPage" style={styles.link} onClick={toggleSidebar}>
                <FaClipboardList style={styles.icon} />
                <span style={styles.text}>Carriers List</span>
              </Link>
            </li>
          </ul>
        )}
      </div>

     
    </div>
  );
}

export default ResponsiveSidebar;
