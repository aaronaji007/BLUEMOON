"use client";

import { useState, useEffect } from "react";
import CustomerUserSidebar from "@/app/components/customersidebar";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
  role?: string; // Add role field
};

export default function CustomerList() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customeredit");
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data: Customer[] = await response.json();
        setCustomers(data);
      } catch (err) {
        setError("Error fetching customers");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const toggleStatus = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch("/api/customeredit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !isActive }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setCustomers((prev) =>
        prev.map((customer: Customer) =>
          customer.id === id ? { ...customer, is_active: !isActive } : customer
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
  };

  const handleSaveEdit = async () => {
    if (!editingCustomer) return;
  
    try {
      const response = await fetch("/api/customeredit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCustomer.id,
          name: editingCustomer.name,
          email: editingCustomer.email,
          phone: editingCustomer.phone,
          role: editingCustomer.role,
        }),
      });
  
      if (!response.ok) throw new Error("Failed to update customer");
  
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === editingCustomer.id ? editingCustomer : customer
        )
      );
  
      setEditingCustomer(null);
    } catch (err) {
      console.error("Error updating customer:", err);
    }
  };
  
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.toString().includes(search)
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen"> 
      <CustomerUserSidebar />
      <div className="flex-1 p-4">
        <div className="flex flex-col items-center mt-5">
          <h1 className="mt-12 md:mt-28 text-2xl md:text-4xl font-bold text-blue-900">
            🔍 Customer Creation and Editing
          </h1>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="mt-4 p-2 border rounded w-full md:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-6 w-full overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-500 p-4">Loading customers...</p>
          ) : error ? (
            <p className="text-center text-red-500 p-4">{error}</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="p-2 md:p-4">Customer Name</th>
                  <th className="p-2 md:p-4">Email</th>
                  <th className="p-2 md:p-4">Phone</th>
                  <th className="p-2 md:p-4">Status</th>
                  <th className="p-2 md:p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b">
                      <td className="p-2 md:p-4">{customer.name}</td>
                      <td className="p-2 md:p-4">{customer.email}</td>
                      <td className="p-2 md:p-4">{customer.phone}</td>
                      <td className="p-2 md:p-4">
                        {customer.is_active ? "Active" : "Inactive"}
                      </td>
                      <td className="p-2 md:p-4 flex flex-wrap gap-2">
                        <button
                          className={`px-3 py-1 md:px-4 md:py-2 text-white rounded ${
                            customer.is_active ? "bg-red-500" : "bg-green-500"
                          }`}
                          onClick={() => toggleStatus(customer.id, customer.is_active)}
                        >
                          {customer.is_active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          className="px-3 py-1 md:px-4 md:py-2 text-white bg-yellow-500 rounded"
                          onClick={() => handleEditClick(customer)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {editingCustomer && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
      <h2 className="text-xl font-bold mb-4">Edit Customer</h2>
      <label className="block">Name</label>
      <input
        type="text"
        className="border p-2 w-full mb-3"
        value={editingCustomer.name}
        onChange={(e) =>
          setEditingCustomer({ ...editingCustomer, name: e.target.value })
        }
      />
      <label className="block">Email</label>
      <input
        type="email"
        className="border p-2 w-full mb-3"
        value={editingCustomer.email}
        onChange={(e) =>
          setEditingCustomer({ ...editingCustomer, email: e.target.value })
        }
      />
      <label className="block">Phone</label>
      <input
        type="text"
        className="border p-2 w-full mb-3"
        value={editingCustomer.phone}
        onChange={(e) =>
          setEditingCustomer({ ...editingCustomer, phone: e.target.value })
        }
      />
      {/* Add role select field */}
      <label className="block">Role</label>
      <select
        className="border p-2 w-full mb-3"
        value={editingCustomer.role || ""}
        onChange={(e) =>
          setEditingCustomer({ ...editingCustomer, role: e.target.value })
        }
      >
        <option value="">Select Role</option>
        <option value="Privileged Customer">Privileged Customer</option>
        <option value="Regular Customer">Regular Customer</option>
        <option value="Normal Customer">Normal Customer</option>
      </select>
      <div className="flex justify-end space-x-2">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => setEditingCustomer(null)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSaveEdit}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}