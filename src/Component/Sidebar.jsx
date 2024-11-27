import React, { useState, useEffect } from "react";
import { FaBars, FaUserAlt } from "react-icons/fa";
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
    popup: {
      position: "absolute",
      top: "50px", // Position the popup just below the username
      right: "0",
      backgroundColor: "white",
      color: "#1a2d43",
      padding: "10px",
      borderRadius: "8px",
      width: "200px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      display: "none", // Hidden by default
      flexDirection: "column",
      alignItems: "center",
    },
    popupShow: {
      display: "flex", // Show popup when triggered
    },
    popupButton: {
      marginTop: "10px",
      padding: "8px 16px",
      backgroundColor: "#1a2d43",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState(""); // State to store username
  const [email, setEmail] = useState(""); // State to store username
  const [full_name, setFull_name] = useState(""); // State to store username
  const [phone, setPhone] = useState(""); // State to store username
  const [role, setRole] = useState(""); // State to store username
  const [isPopupOpen, setPopupOpen] = useState(false); // State to control popup visibility

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user data from localStorage
    localStorage.removeItem("token"); // Optionally remove token from localStorage
    window.location.href = "/Login"; // Redirect to the login page
  };

  // Fetch username from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUsername(parsedUser.username || "Unknown");
      setEmail(parsedUser.email || "Unknown");
      setFull_name(parsedUser.full_name || "Unknown");
      setPhone(parsedUser.phone || "Unknown");
      setRole(parsedUser.role || "Unknown");
    }
  }, []); // Runs only once on component mount

  // Handle hover open and click toggle
  const handleMouseEnter = () => {
    if (!isPopupOpen) setPopupOpen(true); // Open on hover if not already clicked
  };

  const handleMouseLeave = () => {
    if (!isPopupOpen) setPopupOpen(false); // Close on hover out if not already clicked
  };

  const handleClick = () => {
    setPopupOpen(!isPopupOpen); // Toggle popup visibility on click
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Rapid Auto Shipping</h2>

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

        {/* User Profile with Popup Trigger */}
        <li
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
          onClick={handleClick} // Toggle popup on click
          onMouseEnter={handleMouseEnter} // Open popup on hover
          onMouseLeave={handleMouseLeave} // Close popup on hover out
        >
          <FaUserAlt />
          {/* <span>{username || "Loading..."}</span> */}
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

      {/* Popup for user details */}
      <div
  style={{
    ...styles.popup,
    ...(isPopupOpen ? styles.popupShow : {}),
  }}
>
  <div className="relative bg-white p-2 rounded-lg shadow-lg w-80">
    {/* Close button */}
   
    <button
      className=" bg-red-300 hover:bg-red-300 text-gray-800 rounded-full p-1"
      onClick={() => setPopupOpen(false)} // Ensure this function updates the popup state
      aria-label="Close"
    >
      ✕
    </button>
    <h3 className="text-xl font-semibold mb-4">User Profile</h3>

   
    <p className="mb-2">
      <strong>Full Name:</strong> {full_name}
    </p>
    <p className="mb-2">
      <strong>Role:</strong> {role}
    </p>
    <p className="mb-2">
      <strong>Username:</strong> {username || "Unknown"}
    </p>
    <p className="mb-2 truncate max-w-[60%]">
      <strong>Email:</strong> {email}
    </p>
    <p className="mb-4">
      <strong>Phone:</strong> {phone}
    </p>
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>
</div>


      {/* CSS for responsiveness */}
      <style jsx>{`
        @media (min-width: 768px) {
          .menu-large {
            display: flex; /* Show menu items inline */
            gap: 3%;
            width: 50%;
            justify-content: flex-end;
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
