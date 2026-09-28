"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [searchText, setSearchText] = useState("");

  const locations = [
    {
      title: "Wentworthville",
      areas: [
        { name: "South-Side", services: "Uber Eats | Menulog" },
        { name: "North-Side", services: "Uber Eats | Doordash" },
      ],
    },
    {
      title: "Homebush",
      areas: [
        { name: "East-Side", services: "Uber Eats | Doordash" },
        { name: "West-Side", services: "Uber Eats | Menulog" },
      ],
    },
    {
      title: "Pendle Hills",
      areas: [
        { name: "North-Side", services: "Uber Eats | Menulog" },
        { name: "South-Side", services: "Uber Eats | Doordash" },
      ],
    },
  ];

  const filteredLocations = locations.filter((location) =>
    location.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center relative overflow-hidden bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/sec1.jpg')" }}
    >
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/50"></div>

      {/* White Top Section */}
      <div className="w-full h-[100px] bg-white"></div>

      {/* Search Bar */}
      <div className="relative z-10 w-full max-w-md mt-16">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a location..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full p-4 pl-12 bg-white rounded-full shadow-xl outline-none text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-[#314ec4] transition-all duration-300"
          />
          <Search className="absolute left-4 top-4 text-gray-500" size={22} />
        </div>
      </div>

      {/* Location Cards */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 mt-10 max-w-2xl w-full z-10">
        <div className="space-y-6 text-[#314ec4]">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location, index) => (
              <div
                key={index}
                className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <h2 className="text-3xl md:text-4xl font-bold">{location.title}</h2>
                {location.areas.map((area, i) => (
                  <div key={i} className="mt-4">
                    <p className="text-lg md:text-xl font-semibold">{area.name}</p>
                    <p className="text-gray-600 text-base md:text-lg">{area.services}</p>
                    {i !== location.areas.length - 1 && <hr className="my-3 border-gray-300" />}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-lg">No locations found</p>
          )}
        </div>
      </div>

      {/* Back to Home Button */}
      <Link
        href="/"
        className="px-6 py-3 mt-8 mb-8 bg-blue-800 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-[#253b9c] hover:scale-105 transition-all duration-300 z-10"
      >
        ⬅️ Back to Home
      </Link>
    </div>
  );
}
