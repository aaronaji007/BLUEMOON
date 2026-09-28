"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const [showResetForm, setShowResetForm] = useState(false);
  const [resetData, setResetData] = useState({ email: "", newPassword: "" });
  const [message, setMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);  // State to toggle password visibility

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setMessage("⚠️ Please fill all fields.");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usernameOrEmail: credentials.username,
          password: credentials.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      router.push("/adminDashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage("❌ " + err.message);
      } else {
        setMessage("❌ An unexpected error occurred.");
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetData.email.trim() || !resetData.newPassword.trim()) {
      setMessage("⚠️ Email and New Password are required.");
      return;
    }

    try {
      const res = await fetch("/api/auth/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetData.email,
          newPassword: resetData.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");

      setMessage("✅ Password updated. You can now login.");
      setShowResetForm(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage("❌ " + err.message);
      } else {
        setMessage("❌ An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 mt-10">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-blue-800">
          {showResetForm ? "Reset Password" : "Admin Login"}
        </h2>

        {!showResetForm ? (
          <form onSubmit={handleLogin} className="mt-6">
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg bg-gray-50"
                placeholder=" Email"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
              />
            </div>
            <div className="relative mt-4">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"} // Toggle input type based on state
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg bg-gray-50"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle the password visibility
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Show eye icon based on visibility state */}
              </button>
            </div>
            <div className="flex justify-between items-center mt-3">
              <button
                type="button"
                className="text-blue-800 hover:underline text-sm"
                onClick={() => setShowResetForm(true)}
              >
                Forgot Password?
              </button>
            </div>
            <button
              type="submit"
              className="w-full mt-5 bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-900 transition-all"
            >
              Login
            </button>

            {message && (
              <p className="text-sm text-center text-red-600 mt-4">{message}</p>
            )}
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="mt-6">
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
            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                className="text-sm text-gray-500 hover:underline"
                onClick={() => setShowResetForm(false)}
              >
                Back to Login
              </button>
              <button
                type="submit"
                className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-all"
              >
                Reset Password
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-gray-400 text-sm mt-5">
          © {new Date().getFullYear()} Admin Panel. All rights reserved.
        </p>
      </div>
    </div>
  );
}
