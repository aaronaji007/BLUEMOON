"use client";
import { useState } from "react";

export default function Pickup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subscribe: false,
  });
  const [successMessage, setSuccessMessage] = useState(""); // For displaying the success message

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/clogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Your order has been placed!"); // Set success message
        console.log(data.message);

        // Clear the form after successful submission
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subscribe: false,
        });
      } else {
        const errorData = await response.json();
        setSuccessMessage(errorData.error || "Failed to place the order."); // Display error message
        console.error(errorData.error || "Error placing order.");
      }
    } catch (error) {
      setSuccessMessage("An unexpected error occurred."); // General error message
      console.error("Error submitting form:", error);
    }

    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

        {successMessage && (
          <div className="mb-4 p-3 text-green-800 bg-green-100 border border-green-300 rounded-lg">
            {successMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* First Name */}
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">👤</span>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Last Name */}
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">👤</span>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">✉️</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">📞</span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Subscribe Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="subscribe"
                id="subscribe"
                checked={formData.subscribe}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600"
              />
              <label htmlFor="subscribe" className="text-gray-700">
                Subscribe to offers and promotions
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Place Pickup Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
