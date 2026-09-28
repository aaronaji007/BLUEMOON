"use client";
import { useState, useEffect } from "react";
import AdminUserSidebar from "@/app/components/AdminUserSidebar";

export default function RolesPermissions() {
  const [roles, setRoles] = useState<{
    id: number; // Add ID
    name: string;
    description: string;
    permissions: string[];
  }[]>([]);

  const [newRole, setNewRole] = useState<{
    id?: number; // Add ID
    name: string;
    description: string;
    permissions: string[];
  }>({
    name: "",
    description: "",
    permissions: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("/api/roles");
        const data = await res.json();
        setRoles(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const openModal = () => {
    setNewRole({ name: "", description: "", permissions: [] });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditIndex(null);
  };



const handleSaveRole = async () => {
  if (!newRole.name) return;

  try {
    let res;
    const permissionsString = JSON.stringify(newRole.permissions); // Stringify permissions

    if (isEditMode && editIndex !== null) {
      res = await fetch("/api/roles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newRole, id: roles[editIndex].id, permissions: permissionsString }), // Send stringified permissions
      });
      if (!res.ok) throw new Error("Failed to update role");
      const updatedRole = await res.json();
      setRoles(roles.map((role) => (role.id === updatedRole.id ? updatedRole : role)));
    } else {
      res = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newRole, permissions: permissionsString }), // Send stringified permissions
      });
      if (!res.ok) throw new Error("Failed to create role");
      const createdRole = await res.json();
      setRoles([...roles, createdRole]);
    }
    closeModal();
  } catch (error) {
    console.error("Error saving role:", error);
  }
};

  const handleEditRole = (index: number) => {
    setNewRole(roles[index]);
    setEditIndex(index);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteRole = async (index: number) => {
    try {
      const res = await fetch("/api/roles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: roles[index].id }),
      });
      if (!res.ok) throw new Error("Failed to delete role");
      setRoles(roles.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };



  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <AdminUserSidebar />
      <div className="mt-16 md:mt-32 flex-1 p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 text-center">
          🔐 User Roles & Permissions
        </h1>
        <p className="mt-2 md:mt-4 text-lg text-gray-700 text-center">
          Manage role-based access control for Admin, Manager, Staff, and
          Customers.
        </p>

        {/* Create Role Button */}
        <div className="flex justify-center mt-4 md:mt-6">
          <button
            onClick={openModal}
            className="bg-blue-800 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-blue-900 transition"
          >
            + Create Role
          </button>
        </div>

        {/* Roles Table */}
        <div className="mt-4 md:mt-6 overflow-x-auto">
          <table className="w-full border border-gray-300 shadow-lg">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th className="p-2 md:p-3">Role Name</th>
                <th className="p-2 md:p-3">Description</th>
                <th className="p-2 md:p-3">Permissions Assigned</th>
                <th className="p-2 md:p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2 md:p-3 text-center">{role.name}</td>
                  <td className="p-2 md:p-3 text-center">{role.description}</td>
                  <td className="p-2 md:p-3 text-center">
                    {role.permissions.join(", ")}
                  </td>
                  <td className="p-2 md:p-3 text-center">
                    <button onClick={() => handleEditRole(index)} className="text-blue-600">
                      ✏ Edit
                    </button>
                    {role.name !== "Admin" && (
                      <button
                        onClick={() => handleDeleteRole(index)}
                        className="text-red-600 ml-2 md:ml-4"
                      >
                        ❌ Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create/Edit Role Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl w-full md:w-96">
              <h2 className="text-xl md:text-2xl font-bold">
                {isEditMode ? "Edit Role" : "Create Role"}
              </h2>
              <input
                type="text"
                placeholder="Role Name"
                className="w-full mt-2 md:mt-4 p-2 border border-gray-300 rounded"
                value={newRole.name}
                onChange={(e) =>
                  setNewRole({ ...newRole, name: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                value={newRole.description}
                onChange={(e) =>
                  setNewRole({ ...newRole, description: e.target.value })
                }
              ></textarea>

              {/* Permissions Input */}
              <input
                type="text"
                placeholder="Enter permissions (comma-separated)"
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                value={newRole.permissions.join(", ")}
                onChange={(e) =>
                  setNewRole({
                    ...newRole,
                    permissions: e.target.value.split(",").map((p) => p.trim()),
                  })
                }
              />

              <div className="flex justify-end mt-4">
                <button onClick={closeModal} className="mr-2 px-4 py-2 bg-gray-400 rounded">
                  Cancel
                </button>
                <button onClick={handleSaveRole} className="px-4 py-2 bg-blue-800 text-white rounded">
                  {isEditMode ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}