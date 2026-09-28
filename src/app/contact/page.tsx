"use client";
import Image from "next/image";
import React, { useState } from "react";
// import { Mail, Phone } from "lucide-react";


const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    // Validation for name field - only letters and spaces
    if (id === 'name' && !/^[A-Za-z\s]*$/.test(value)) {
      return;
    }

    // Validation for email field
    if (id === 'phone' && value && !/^[0-9]+$/.test(value)) {
      return;
    }

    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Form submitted successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        alert("Failed to submit the form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 text-white">
      <div className="relative bg-white h-32 flex items-center justify-center -mt-8">       
      </div>

    <div className="container mx-auto px-4 py-12">
    <h2 className="text-center text-4xl font-bold text-white mb-8">CONTACT US</h2>
<div className="flex flex-wrap md:flex-nowrap justify-between items-center mb-12 gap-8 bg-blue-900 rounded-2xl shadow-2xl p-6 sm:p-10">
  {/* Left Image */}
  <div className="w-full md:w-1/2 flex justify-center items-center">
    <Image
      src="/R.png"
      alt="Need Assistance Image"
      width={350}
      height={350}
      className="rounded-xl shadow-lg object-cover max-w-full h-auto"
    />
  </div>

  {/* Assistance Text */}
  <div className="w-full md:w-1/2 text-white flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-10">
    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Need Assistance?</h3>
    <p className="text-base sm:text-lg font-medium leading-relaxed">
      We’re here to help! Whether you have a question about our menu,
      need assistance with reservations, or want to place an order,
      feel free to reach out. Call or SMS us anytime—we’d love to hear from you! 😊
    </p>
  </div>
</div>


  {/* Forms Section */}
    <div className="flex flex-wrap md:flex-nowrap justify-center items-stretch gap-8 px-4 py-10 bg-gray-100">
    {/* Contact Form */}
    <div className="w-full md:w-[90%] lg:w-[42%] bg-white text-blue-900 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-300 mx-auto">
      <h3 className="text-xl sm:text-2xl font-bold mb-6 text-center">Contact Form</h3>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block font-semibold mb-2 text-base">Name</label>
          <input
            type="text"
            id="name"
            className="w-full p-3 border border-gray-400 rounded-lg shadow-md text-base focus:outline-none focus:ring-2 focus:ring-blue-700"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="email" className="block font-semibold mb-2 text-base">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-400 rounded-lg shadow-md text-base focus:outline-none focus:ring-2 focus:ring-blue-700"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block font-semibold mb-2 text-base">Phone</label>
            <input
              type="text"
              id="phone"
              className="w-full p-3 border border-gray-400 rounded-lg shadow-md text-base focus:outline-none focus:ring-2 focus:ring-blue-700"
              placeholder="Your Phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Subject */}
        <div className="mb-4">
          <label htmlFor="subject" className="block font-semibold mb-2 text-base">Subject</label>
          <input
            type="text"
            id="subject"
            className="w-full p-3 border border-gray-400 rounded-lg shadow-md text-base focus:outline-none focus:ring-2 focus:ring-blue-700"
            placeholder="Your Subject"
            value={formData.subject}
            onChange={handleChange}
          />
        </div>

        {/* Message */}
        <div className="mb-4">
          <label htmlFor="message" className="block font-semibold mb-2 text-base">Message</label>
          <textarea
            id="message"
            rows={4}
            className="w-full p-3 border border-gray-400 rounded-lg shadow-md text-base focus:outline-none focus:ring-2 focus:ring-blue-700"
            placeholder="Please enter your message..."
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-700 text-white text-base px-5 py-3 mt-2 rounded-lg hover:bg-blue-900 transition duration-200 w-full shadow-lg font-semibold"
        >
          Submit
        </button>
      </form>
    </div>

    {/* Booking Information */}
    <div className="w-full md:w-[90%] lg:w-[42%] bg-white text-blue-900 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-300 mx-auto">
      <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-4">Booking Request</h4>

      <p className="text-yellow-600 flex items-center justify-center gap-3 text-2xl sm:text-3xl font-bold mb-2">
        📞 0422 306 777
      </p>
      <p className="text-yellow-600 text-center text-base sm:text-lg font-semibold mb-6 break-words">
        📧 contact@bluemoonrestaurants.com
      </p>

      {/* Location */}
      <div className="mt-4 text-center">
        <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 mb-2">Location</h4>
        <p className="text-sm sm:text-base lg:text-lg text-yellow-600 font-medium leading-relaxed">
          <span className="text-rose-600 block font-semibold">Bluemoon Restaurant</span>
          4 Station Street, Wentworthville NSW 2145, Sydney, Australia<br />
          32-36 Burlington Rd, Homebush NSW 2140, Sydney, Australia<br />
          114 Pendle Way, Pendle Hill NSW 2145, Sydney, Australia
        </p>
      </div>

      {/* Timings */}
      <div className="mt-6 text-center space-y-6">
        <div>
          <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">Breakfast Time</h4>
          <p className="text-yellow-600 text-sm sm:text-base lg:text-lg font-medium">
            Monday to Sunday<br />7:00 AM to 9:00 AM
          </p>
        </div>

        <div>
          <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">Lunch Time</h4>
          <p className="text-yellow-600 text-sm sm:text-base lg:text-lg font-medium">
            Monday to Sunday<br />11:00 AM to 2:00 PM
          </p>
        </div>

        <div>
          <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">Dinner Time</h4>
          <p className="text-yellow-600 text-sm sm:text-base lg:text-lg font-medium">
            Monday to Sunday<br />6:00 PM to 10:00 PM
          </p>
        </div>
      </div>
    </div>
  </div>

  </div>
</div>   
);
};

export default ContactUs;