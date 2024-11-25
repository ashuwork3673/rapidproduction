import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import "../app/globals.css";
import "../styles/dashboard.css"
import Sidebar from "@/Component/Sidebar";
import DashboardForm from "@/Component/DashboardForm";

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-300 p-6 rounded-lg shadow-lg w-1/3">
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-red-400 text-black"
          >
            X
          </button>
        </div>
        <DashboardForm />
      </div>
    </div>
  );
};

const FormQuote = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [forms, setForms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedForms, setClickedForms] = useState([]); // Track clicked forms
  const router = useRouter();

  const fetchForms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/form");
      const sortedForms = response.data.sort((a, b) => b.quote_id - a.quote_id);
      setForms(sortedForms);
    } catch (error) {
      console.error("Error fetching form data", error);
    }
  };

  // Retrieve clicked forms from localStorage on component mount
  useEffect(() => {
    const storedClickedForms = localStorage.getItem("clickedForms");
    if (storedClickedForms) {
      setClickedForms(JSON.parse(storedClickedForms));
    }
    fetchForms();
  }, []);

  const handleFormClick = (form) => {
    // Mark form as clicked and persist it in localStorage
    if (!clickedForms.includes(form._id)) {
      const updatedClickedForms = [...clickedForms, form._id];
      setClickedForms(updatedClickedForms);
      localStorage.setItem("clickedForms", JSON.stringify(updatedClickedForms));
    }
    router.push(`/QuoteDetails?id=${form._id}`);
  };

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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6 mt-20">
        <div className="mb-4 flex items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              className="p-2 pl-10 w-full bg-gray-100 border border-gray-300 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={openModal}
            className="ml-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Add Quote
          </button>
        </div>

        <div className="mt-4 overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto border-collapse border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-gray-200">
                  Quote ID
                </th>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-gray-200">
                  Name
                </th>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-gray-200">
                  Pickup Date
                </th>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-gray-200">
                  Pickup Id
                </th>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-gray-200">
                  Time
                </th>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-gray-200">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {currentForms.map((form, index) => (
                <tr
                  key={form._id}
                  onClick={() => handleFormClick(form)}
                  className={`cursor-pointer hover:bg-indigo-50 ${
                    clickedForms.includes(form._id)
                      ? index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-100"
                      : "bg-red-100"
                  }`}
                >
                  <td className="px-6 py-4 border-b border-gray-200">
                    {form.quote_id}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {form.username}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {new Date(form.pickup_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {form.pickup_id}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {form.added_on}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${form.status === "Done"
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
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-center space-x-2">
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
                className={`px-4 py-2 rounded-md ${
                  currentPage === index + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-indigo-600"
                }`}
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

      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default FormQuote;
