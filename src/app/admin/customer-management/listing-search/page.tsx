"use client";

import { useState, useEffect } from "react";
import CustomerUserSidebar from "@/app/components/customersidebar";

type Customer = {
  name: string;
  email: string;
  phone: number;
  join_date: string;
  role?: string;
};

export default function CustomerList() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customer");
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
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

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.toString().includes(search)
  );

  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      <CustomerUserSidebar />
      <div className="flex-1 p-4 sm:p-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-blue-900 text-center mb-4 mt-28">
          🔍 Customer Listing & Search
        </h1>
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 border rounded mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-500 p-4">Loading customers...</p>
          ) : error ? (
            <p className="text-center text-red-500 p-4">{error}</p>
          ) : (
            <table className="min-w-full text-left border-collapse">
  <thead className="bg-blue-800 text-white">
    <tr>
      <th className="p-4">Customer Name</th>
      <th className="p-4">Email</th>
      <th className="p-4">Phone</th>
      <th className="p-4">Join Date</th>
      <th className="p-4">Role</th>
    </tr>
  </thead>
  <tbody>
    {filteredCustomers.length > 0 ? (
      filteredCustomers.map((customer, index) => (
        <tr key={index} className="border-b">
          <td className="p-4">{customer.name}</td>
          <td className="p-4">{customer.email}</td>
          <td className="p-4">{customer.phone}</td>
          <td className="p-4">
  {new Date(customer.join_date).toLocaleDateString("en-GB")}
</td>
          <td className="p-4">{customer.role || "N/A"}</td>
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
    </div>
  );
}