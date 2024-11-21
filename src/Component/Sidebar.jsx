import React from 'react'
import Link from "next/link";
import { FaHome, FaFileAlt, FaClipboardList, FaBars } from "react-icons/fa";
import {  useState } from "react";

function Sidebar() {
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div
    className={`transition-all duration-300 ${
      sidebarOpen ? "w-64" : "w-16"
    } bg-indigo-700 text-white p-4 relative h-full`}
  >
    <button
      onClick={toggleSidebar}
      className="absolute top-5 right-5 bg-gray-800 text-white p-2 rounded-lg"
    >
      <FaBars />
    </button>
    <div className="mt-10 space-y-4">
      <ul>
        <li>
          <Link
            href="/Dashboard"
            className="flex items-center py-3 px-4 hover:bg-indigo-700 rounded-md transition"
          >
            <FaHome className="mr-4 text-xl" />
            {sidebarOpen && (
              <span className="text-xl font-medium">Dashboard</span>
            )}
          </Link>
        </li>
        <li>
          <Link
            href="/FormQuote"
            className="flex items-center py-3 px-4 hover:bg-indigo-700 rounded-md transition"
          >
            <FaFileAlt className="mr-4 text-xl" />
            {sidebarOpen && (
              <span className="text-xl font-medium">Form Quote</span>
            )}
          </Link>
        </li>
        <li>
          <Link
            href="/BlogList"
            className="flex items-center py-3 px-4 hover:bg-indigo-700 rounded-md transition"
          >
            <FaClipboardList className="mr-4 text-xl" />
            {sidebarOpen && (
              <span className="text-xl font-medium">Blogs</span>
            )}
          </Link>
        </li>
        <li>
          <Link
            href="/CarriersPage"
            className="flex items-center py-3 px-4 hover:bg-indigo-700 rounded-md transition"
          >
            <FaClipboardList className="mr-4 text-xl" />
            {sidebarOpen && (
              <span className="text-xl font-medium">Carriers</span>
            )}
          </Link>
        </li>
      </ul>
    </div>
  </div>
  )
}

export default Sidebar