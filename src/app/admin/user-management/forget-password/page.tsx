"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [resetData, setResetData] = useState({ email: "", newPassword: "" });
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetData.email.trim() || !resetData.newPassword.trim()) {
      setMessage("⚠️ Email and New Password are required.");
      return;
    }

    try {
      const res = await fetch("/api/auth/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");

      setMessage("✅ Password updated. Redirecting to login...");
      setTimeout(() => router.push("/admin"), 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage("❌ " + err.message);
      } else {
        setMessage("❌ An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            value={resetData.email}
            onChange={(e) =>
              setResetData({ ...resetData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full mt-4 p-3 border border-gray-300 rounded-lg bg-gray-50"
            value={resetData.newPassword}
            onChange={(e) =>
              setResetData({ ...resetData, newPassword: e.target.value })
            }
          />
          <button
            type="submit"
            className="w-full mt-5 bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-900 transition-all"
          >
            Reset Password
          </button>
        </form>

        {message && (
          <p className="text-sm text-center text-red-600 mt-4">{message}</p>
        )}

        <p
          className="text-center text-blue-800 text-sm mt-5 cursor-pointer hover:underline"
          onClick={() => router.push("/admin")}
        >
          Back to Login
        </p>
        <p className="text-center text-gray-400 text-sm mt-3">
          © {new Date().getFullYear()} Admin Panel. All rights reserved.
        </p>
        
      </div>
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
  <button
    onClick={() => (window.location.href = "/adminDashboard")}
    className="bg-blue-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-900 transition-all duration-300"
  >
    ⬅️ Back to Dashboard
  </button>
</div>

    </div>
    
  );
}
