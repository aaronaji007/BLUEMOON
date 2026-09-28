"use client";

import { useState, useEffect } from "react";
import AdminUserSidebar from "@/app/components/AdminUserSidebar";

// ✅ Define User Type
type User = {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  role: string;
};


export default function UserList() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // ✅ Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/useredit");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data: User[] = await response.json();
        setUsers(data);
      } catch (err) {
        setError("Error fetching users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Toggle User Active/Inactive
  const toggleStatus = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch("/api/useredit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !isActive }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setUsers((prev) =>
        prev.map((user: User) =>
          user.id === id ? { ...user, is_active: !isActive } : user
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // ✅ Handle Edit Button Click
  const handleEditClick = (user: User) => {
    setEditingUser(user);
  };

  // ✅ Handle Save Edited User
  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      const response = await fetch("/api/useredit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingUser.id,
          name: editingUser.name,
          email: editingUser.email,
        }),
      });

      if (!response.ok) throw new Error("Failed to update user");

      setUsers((prev) =>
        prev.map((user) => (user.id === editingUser.id ? editingUser : user))
      );
      setEditingUser(null);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  // ✅ Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <AdminUserSidebar />
      <div className="mt-16 md:mt-20 flex-1 flex flex-col items-center p-4">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mt-10">👥 User Management</h1>
        <input
          type="text"
          placeholder="Search by name or email..."
          className="mt-4 p-2 border rounded w-full md:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mt-6 w-full md:w-3/4 bg-white shadow-lg rounded-lg overflow-hidden">
          {loading ? (
            <p className="text-center text-gray-500 p-4">Loading users...</p>
          ) : error ? (
            <p className="text-center text-red-500 p-4">{error}</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="p-3 md:p-4">Name</th>
                  <th className="p-3 md:p-4">Email</th>
                  <th className="p-3 md:p-4">Status</th>
                  <th className="p-3 md:p-4">Role</th>
                  <th className="p-3 md:p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-3 md:p-4">{user.name}</td>
                      <td className="p-3 md:p-4">{user.email}</td>
                      <td className="p-3 md:p-4">
                        {user.is_active ? "Active" : "Inactive"}
                      </td>
                      <td className="p-3 md:p-4">{user.role}</td>
                      <td className="p-3 md:p-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full">
                        <button
                          className={`px-4 py-2 text-white rounded ${
                            user.is_active ? "bg-red-500" : "bg-green-500"
                          }`}
                          onClick={() => toggleStatus(user.id, user.is_active)}
                        >
                          {user.is_active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          className="px-4 py-2 text-white bg-yellow-500 rounded w-full md:w-auto"
                          onClick={() => handleEditClick(user)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* ✅ Edit User Form */}
        {editingUser && (
          <div className="mt-6 w-full md:w-3/4 bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-blue-800">Edit User</h2>
            <div className="mt-4">
              <label className="block text-gray-700">Name:</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser((prev) => prev && { ...prev, name: e.target.value })
                }
              />
            </div>
            <div className="mt-2">
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser((prev) => prev && { ...prev, email: e.target.value })
                }
              />
            </div>
            <div className="mt-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleSaveEdit}>
                Save
              </button>
              <button className="px-4 py-2 bg-gray-400 text-white rounded" onClick={() => setEditingUser(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}