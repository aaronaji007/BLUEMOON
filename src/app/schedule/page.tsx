"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from "react-icons/fi";
import Link from "next/link";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [service, setService] = useState("PICKUP");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const times = [
    "07:00 PM", "07:15 PM", "07:30 PM", "07:45 PM",
    "08:00 PM", "08:15 PM", "08:30 PM", "08:45 PM",
    "09:00 PM", "09:15 PM", "09:30 PM"
  ];
    // ✅ Disable the button if any required field is missing
    const isConfirmDisabled = !selectedDate || !service || !selectedTime;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 mt-24">
      <div className="backdrop-blur-lg bg-white/50 border border-white/30 shadow-xl p-6 rounded-2xl w-full max-w-md">
        
        <div className="w-[112%] bg-blue-700 py-4 px-3 rounded-t-2xl mb-5 -ml-6">
          <h2 className="text-xl font-semibold text-white text-center">
            Schedule Order
          </h2>
        </div>

        {/* Date Picker */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Select a Date</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              dateFormat="MMMM d, yyyy"
            />
          </div>
        </div>

        {/* Service Selection */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Service</label>
          <div className="flex gap-2">
            <button
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                service === "PICKUP" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => setService("PICKUP")}
            >
              PICKUP
            </button>
            
          </div>
        </div>

        {/* Time Selection */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Pick a Time</label>
          <div className="grid grid-cols-3 gap-2">
            {times.map((time) => (
              <button
                key={time}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTime === time ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Confirm Button (Disabled if any field is missing) */}
        <Link href={isConfirmDisabled ? "#" : `/viewScheduleMenu?service=${service}&date=${selectedDate?.toLocaleDateString()}&time=${selectedTime}`}>
          <button
            className={`w-full py-3 rounded-lg font-medium transition-all shadow-md ${
              isConfirmDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={isConfirmDisabled}
          >
            CONFIRM
          </button>
        </Link>
      </div>
    </div>
  );
}
