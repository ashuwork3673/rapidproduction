import { useState, useEffect } from "react";
import { FaHome, FaFileAlt, FaClipboardList, FaBars, FaSearch  } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import "../app/globals.css";
import "../styles/dashboard.css"
import Sidebar from "@/Component/Sidebar";
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
/>

const FormQuote = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [forms, setForms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [emailStatus, setEmailStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const router = useRouter();

  // Fetch and sort form data by quote_id in descending order
  const fetchForms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/form");
      const sortedForms = response.data.sort((a, b) => b.quote_id - a.quote_id);
      setForms(sortedForms);
    } catch (error) {
      console.error("Error fetching form data", error);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // Filter forms based on search query
  const filteredForms = forms.filter((form) => {
    const query = searchQuery.toLowerCase();
    return (
      form.quote_id.toString().toLowerCase().includes(query) ||
      form.phone.toLowerCase().includes(query) ||
      form.email.toLowerCase().includes(query) ||
      form.username.toLowerCase().includes(query) || 
      (form.note && form.note.toLowerCase().includes(query)) || 
      (form.pickup_id && form.pickup_id.toLowerCase().includes(query))
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentForms = filteredForms.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredForms.length / itemsPerPage);

  const handleFormClick = (form) => {
    // Store form's quote_id in localStorage when clicked
    let clickedForms = JSON.parse(localStorage.getItem("clickedForms")) || [];
    if (!clickedForms.includes(form.quote_id)) {
      clickedForms.push(form.quote_id);
      localStorage.setItem("clickedForms", JSON.stringify(clickedForms));
    }

    // Redirect to the details page
    router.push(`/QuoteDetails?id=${form._id}`);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Determine if the form is new (for example, created within the last 24 hours)
  const isNewForm = (createdAt) => {
    const currentDate = new Date();
    const formDate = new Date(createdAt);
    const timeDifference = currentDate - formDate;
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    return timeDifference < oneDayInMilliseconds;
  };

  // Check if a form's quote_id exists in localStorage (indicating it's been clicked)
  const isClicked = (quoteId) => {
    const clickedForms = JSON.parse(localStorage.getItem("clickedForms")) || [];
    return clickedForms.includes(quoteId);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 mt-14">
        {/* Search Bar */}
  <div className="mb-4 w-full mt-2  center-space flex">
      {/* Search Bar with Icon inside */}
      <div className="relative w-6/12">
        <input
          type="text"
          className="p-2 pl-10 w-full  border border-gray-300 rounded-md"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* Search Icon inside input */}
        <FaSearch className="absolute left-3 top-1/2 transform-translate-y-1/2 text-gray-600" />
      </div>

      {/* Add Quotes Button */}
      <button
        className=" px-4 py-2 button-color text-white rounded-md hover:bg-blue-700"
        onClick={() => console.log("Add Quotes clicked")}
      >
        Add Quotes
      </button>
    </div>


        {/* Display email status */}
        {emailStatus && <div className="mt-4 text-green-500 font-semibold">{emailStatus}</div>}

        {/* Table to display form quotes */}
        <div className="mt-4 overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto border-collapse border border-gray-300 rounded-lg">
            <thead>
              <tr className="accent-bg ttext-white">
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-gray-200">Quote ID</th>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-gray-200">Name</th>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-gray-200">Email</th>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-gray-200">Status</th>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-gray-200">Details</th>
              </tr>
            </thead>
            <tbody>
              {currentForms.map((form, index) => (
                <tr
                  key={form.id}
                  onClick={() => handleFormClick(form)}
                  className={`cursor-pointer hover:bg-indigo-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-100"
                  } ${isNewForm(form.createdAt) ? "bg-yellow-100" : ""} ${
                    !isClicked(form.quote_id) ? "bg-red-100" : ""
                  }`} // Apply red background to the entire row if not clicked
                >
                  <td className="px-6 py-4 border-b border-gray-200">{form.quote_id}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{form.username}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{form.email}</td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        form.status === "Done"
                          ? "bg-green-100 text-green-700"
                          : form.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : form.status === "waiting"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      } `}
                    >
                      {form.status}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 text-indigo-600 font-bold underline ${
                      isClicked(form.quote_id) ? "" : "bg-red-100"
                    }`}
                  >
                    Details
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-4 flex p-4 justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 button-color text-white rounded-md disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? "button-color text-white" : "bg-white text-indigo-600"}`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 button-color text-white rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormQuote;
