"use client";
import { useState, useEffect } from "react";
import CustomerUserSidebar from "@/app/components/customersidebar";

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

export default function RolesPermissions() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState<Role>({
    id: "",
    name: "",
    description: "",
    permissions: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRoleId, setEditRoleId] = useState<string | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/customerrole");
      const data: Role[] = await res.json();
      setRoles(data);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const handleSaveRole = async () => {
    if (!newRole.name) return;

    const method = isEditMode ? "PUT" : "POST";
    const body = isEditMode
      ? { ...newRole, id: editRoleId, user_type: "Customer" }
      : { ...newRole, user_type: "Customer" };

    try {
      const res = await fetch("/api/customerrole", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchRoles();
        closeModal();
      }
    } catch (error) {
      console.error("Failed to save role:", error);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      const res = await fetch("/api/customerrole", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchRoles();
      }
    } catch (error) {
      console.error("Failed to delete role:", error);
    }
  };

  const openModal = () => {
    setNewRole({ id: "", name: "", description: "", permissions: [] });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditRoleId(null);
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      <CustomerUserSidebar />
      <div className="flex-1 p-4 sm:p-8 mt-5">
        <h1 className="text-2xl sm:text-4xl font-bold text-blue-900 text-center mb-6 mt-24">
          🔐 Customer Roles & Permissions
        </h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={openModal}
            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition"
          >
            + Create Role
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 shadow-lg">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th className="p-3 text-center">Role Name</th>
                <th className="p-3 text-center">Description</th>
                <th className="p-3 text-center">Permissions</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id} className="border-t">
                  <td className="p-3 text-center">{role.name}</td>
                  <td className="p-3 text-center">{role.description}</td>
                  <td className="p-3 text-center">{role.permissions.join(", ")}</td>
                  <td className="p-3 text-center flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => {
                        setNewRole(role);
                        setEditRoleId(role.id);
                        setIsEditMode(true);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600"
                    >
                      ✏ Edit
                    </button>
                    {role.name !== "Admin" && (
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-600"
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

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full sm:w-96">
              <h2 className="text-xl font-bold mb-4">{isEditMode ? "Edit Role" : "Create Role"}</h2>
              <input
                type="text"
                placeholder="Role Name"
                className="w-full mb-2 p-2 border border-gray-300 rounded"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="w-full mb-2 p-2 border border-gray-300 rounded"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Enter permissions (comma-separated)"
                className="w-full mb-2 p-2 border border-gray-300 rounded"
                value={newRole.permissions.join(", ")}
                onChange={(e) =>
                  setNewRole({
                    ...newRole,
                    permissions: e.target.value.split(",").map((p) => p.trim()),
                  })
                }
              />

              <div className="flex justify-end mt-4 gap-2">
                <button onClick={closeModal} className="px-4 py-2 bg-gray-400 rounded">
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