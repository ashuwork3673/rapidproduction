import Link from "next/link";
import { useState, useEffect } from "react";
import "../app/globals.css";
import {
  FaHome,
  FaFileAlt,
  FaClipboardList,
  FaBars,
  FaPlus,
  FaEdit,
  FaEye,
} from "react-icons/fa";
import Sidebar from "@/Component/Sidebar";

const BlogList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to handle errors

  // Fetch blogs from the API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/blogs"); // API URL to fetch blogs
        if (!response.ok) {
          throw new Error(
            `Failed to fetch blogs: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        setBlogs(data); // Update state with fetched blog data
      } catch (err) {
        setError(`Error: ${err.message}`); // Set error message on failure
      } finally {
        setLoading(false); // Set loading to false when request is done
      }
    };

    fetchBlogs(); // Run fetch function when component mounts
  }, []); // Empty dependency array means this runs once on component mount

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
     <Sidebar/>
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Blogs</h1>
          <Link
            href="/AddBlogs"
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            <FaPlus className="mr-2" />
            Add Blog
          </Link>
        </div>

        {/* Blog List */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {loading ? (
            <p className="text-gray-500">Loading blogs...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : blogs.length > 0 ? (
            <ul className="space-y-4">
              {blogs.map((blog) => (
                <li
                  key={blog._id}
                  className="border-b pb-2 flex justify-between items-center"
                >
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="text-lg font-medium text-indigo-700 hover:underline"
                  >
                    {blog.title}
                  </Link>
                  <div className="flex items-center space-x-4">
                    {/* View Button */}
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="flex items-center bg-green-500 text-white px-3 py-1 rounded-md"
                    >
                      <FaEye className="mr-2" />
                      <span>View</span>
                    </Link>
                    {/* Edit Button */}
                    <Link
                      href={`/EditBlog/${blog.slug}`}
                      className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded-md"
                    >
                      <FaEdit className="mr-2" />
                      <span>Edit</span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No blogs available. Click "Add Blog" to create a new blog post.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
