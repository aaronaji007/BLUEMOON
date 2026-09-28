"use client";

import { useState } from "react";
import AdminUserSidebar from "@/app/components/AdminUserSidebar";

// Define User Type
type User = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

export default function UserAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [userData, setUserData] = useState<User>({ name: "", email: "", password: "",role: "" });
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [message, setMessage] = useState(""); // ✅ Added state for messages

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (isLogin) {
      setCredentials({ ...credentials, [name]: value });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  // Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Registration successful! You can now log in.");
        setIsLogin(true);
        setUserData({ name: "", email: "", password: "",role:"" });
        setMessage("");
      } else {
        setMessage(result.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setMessage("❌ An error occurred. Please try again.");
    }
  };

  // Handle Login
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

      // ✅ On successful login, clear message or redirect as needed
      setMessage("🎉 Welcome back! You’ve logged in successfully.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage("❌ " + err.message);
      } else {
        setMessage("❌ An unexpected error occurred.");
      }
    }
    
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <AdminUserSidebar />
      <div className="flex-1 flex items-center justify-center text-center p-4">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full md:w-96">
          <h1 className="text-2xl font-bold text-blue-900">
            {isLogin ? "🔑 Login" : "🏷️ Register"}
          </h1>

          <form className="mt-6 space-y-4" onSubmit={isLogin ? handleLogin : handleRegister}>
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full p-2 border rounded"
                value={userData.name}
                onChange={handleChange}
                required
              />
            )}

          <input
            type="email"
            name={isLogin ? "username" : "email"} // dynamically set name
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={isLogin ? credentials.username : userData.email}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <select
            name="role"
            className="w-full p-2 border rounded"
            value={userData.role}
            onChange={(e) => setUserData({ ...userData, role: e.target.value })}
            required
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Cashier</option>
            <option value="Customer">Chef</option>
            <option value="Customer">Waiter</option>
          </select>
          
          )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
              value={isLogin ? credentials.password : userData.password}
              onChange={handleChange}
              required
            />

            <button className="w-full bg-blue-800 text-white py-2 rounded hover:opacity-80">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          {message && (
            <div className="mt-4 text-red-600 text-sm">
              {message}
            </div>
          )}

          <p className="mt-4 text-gray-600">
            {isLogin ? "New user?" : "Already have an account?"}{" "}
            <span className="text-blue-600 cursor-pointer" onClick={() => {
              setIsLogin(!isLogin);
              setMessage(""); // Clear message on toggle
            }}>
              {isLogin ? "Register" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
