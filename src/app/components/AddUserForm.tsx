"use client";

import { useState } from "react";

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    email: "",
    password: "",
    reset_password: "",
    role: "Admin",
    status: "Active",
    is_signed_up: false,
    is_signed_in: false,
    login_time: "",
    logout_time: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      alert("User added successfully!");
      setFormData({
        user_id: "",
        name: "",
        email: "",
        password: "",
        reset_password: "",
        role: "Admin",
        status: "Active",
        is_signed_up: false,
        is_signed_in: false,
        login_time: "",
        logout_time: "",
      });
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="number" name="user_id" value={formData.user_id} onChange={handleChange} placeholder="User ID" required className="w-full p-2 border rounded" />
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="w-full p-2 border rounded" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded" />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full p-2 border rounded" />
        <input type="text" name="reset_password" value={formData.reset_password} onChange={handleChange} placeholder="Reset Password" className="w-full p-2 border rounded" />

        <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Chef">Chef</option>
          <option value="Waiter">Waiter</option>
          <option value="Cashier">Cashier</option>
        </select>

        <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <label className="flex items-center">
          <input type="checkbox" name="is_signed_up" checked={formData.is_signed_up} onChange={handleChange} className="mr-2" />
          Signed Up?
        </label>

        <label className="flex items-center">
          <input type="checkbox" name="is_signed_in" checked={formData.is_signed_in} onChange={handleChange} className="mr-2" />
          Signed In?
        </label>

        <input type="time" name="login_time" value={formData.login_time} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="time" name="logout_time" value={formData.logout_time} onChange={handleChange} className="w-full p-2 border rounded" />

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Add User</button>
      </form>
    </div>
  );
};

export default AddUserForm;
