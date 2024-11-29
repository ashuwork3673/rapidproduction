import { useEffect, useState } from "react";
import "../app/globals.css";
import ResponsiveNavbar from "@/Component/Sidebar";
import withAuthAdmin from "@/Component/withAuthAdmin";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    full_name: "",
    phone: "",
    role: "",
    department: "",
  });

  useEffect(() => {
    // Fetch the users from the API
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/users");
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      id: user._id,
      username: user.username,
      password: user.password,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role,
      department: user.department,
    });
    setIsEditUserModalOpen(true);
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setUsers([...users, data.user]);
        setIsAddUserModalOpen(false);
        setFormData({
          username: "",
          password: "",
          email: "",
          full_name: "",
          phone: "",
          role: "",
          department: "",
        });
        window.location.reload();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to add user");
    }
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/users/${formData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUsers(
          users.map((user) =>
            user._id === formData.id ? { ...user, ...formData } : user
          )
        );
        setIsEditUserModalOpen(false);
        setSelectedUser(null);
      } else {
        setError(data.message || "Failed to update user");
      }
    } catch (err) {
      setError("Failed to update user");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/users/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUsers(users.filter((user) => user._id !== id));
      } else {
        setError(data.message || "Failed to delete user");
      }
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex  overflow-auto">
      {/* Sidebar */}
      <ResponsiveNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Users List</h1>

        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add User
        </button>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-600  text-white">
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Full Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.full_name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.phone}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">{user.department}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add User Modal */}
        {isAddUserModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-1/2">
              <h2 className="text-xl font-bold mb-4">Add New User</h2>
              <form>
                <input
                  type="text"
                  name="username"
                  onChange={handleFormChange}
                  placeholder="Username"
                  className="mb-4 p-2 border w-full"
                />
                <input
                  type="text"
                  name="full_name"
                  onChange={handleFormChange}
                  placeholder="Full Name"
                  className="mb-4 p-2 border w-full"
                />
                <input
                  type="email"
                  name="email"
                  onChange={handleFormChange}
                  placeholder="Email"
                  className="mb-4 p-2 border w-full"
                />
                <input
                  type="password"
                  name="password"
                  onChange={handleFormChange}
                  placeholder="Password"
                  className="mb-4 p-2 border w-full"
                />
                <input
                  type="text"
                  name="phone"
                  onChange={handleFormChange}
                  placeholder="Phone"
                  className="mb-4 p-2 border w-full"
                />
                <select
                  name="role"
                  onChange={handleFormChange}
                  className="mb-4 p-2 border w-full"
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="developer">Developer</option>
                </select>

                <select
                  name="department"
                  onChange={handleFormChange}
                  className="mb-4 p-2 border w-full"
                >
                  <option value="">Select Department</option>
                  <option value="administrators">Administrators</option>
                  <option value="development">Development</option>
                  <option value="development">User</option>
                </select>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddUser}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {isEditUserModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-1/2">
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              <form>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  placeholder="Username"
                  className="mb-4 p-2 border w-full"
                />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleFormChange}
                  placeholder="Full Name"
                  className="mb-4 p-2 border w-full"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Email"
                  className="mb-4 p-2 border w-full"
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  placeholder="Password"
                  className="mb-4 p-2 border w-full"
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="Phone"
                  className="mb-4 p-2 border w-full"
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="mb-4 p-2 border w-full"
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="developer">Developer</option>
                </select>

                <select
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                  className="mb-4 p-2 border w-full"
                >
                  <option value="">Select Department</option>
                  <option value="administrators">Administrators</option>
                  <option value="development">Development</option>
                </select>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditUserModalOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateUser}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuthAdmin(UsersPage);
