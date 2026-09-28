
"use client";

import { useRouter } from "next/navigation"; // Use this for Next.js 13 App Router

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear auth token or session
    router.push("/"); // Redirect to homepage or login page
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
    >
      🚪 Logout
    </button>
  );
};

export default LogoutButton;