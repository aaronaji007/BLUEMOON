"use client";

import ReservationForm from "../components/ResevationForm";
import { useEffect } from "react";

import Link from "next/link";

export default function TablePage() {


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/sec1.jpg')",
      }}
    >
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/60"></div>

      {/* Content Wrapper to Ensure Proper Layering */}
      <div className="relative z-10 flex flex-col items-center mt-36 ">
       


        <div className="bg-gradient-to-b from-gray-200 to-blue-100 bg-opacity-90 
                        p-8 rounded-lg shadow-lg w-full max-w-xl mt-8">
          <ReservationForm />
        </div>

        {/* Back Button */}
        <div className="w-full flex justify-center mt-6">
          <Link
            href="/"
            className="px-6 py-3 mb-6 bg-blue-900 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-[#253b9c] hover:scale-105 transition-all duration-300 z-10"
          >
            ⬅️ Back to Home
          </Link>
        </div>
       
      </div>
      
    </div>
    
  );
}
