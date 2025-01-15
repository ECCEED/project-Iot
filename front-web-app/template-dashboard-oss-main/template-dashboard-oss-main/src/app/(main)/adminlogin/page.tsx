"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInAdmin } from "./auth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/overview"); // Redirect to overview page if logged in
    }
  }, [isLoggedIn, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous error

    try {
      const { user, idToken } = await signInAdmin(email, password);
      console.log("Admin logged in:", user);
      console.log("ID Token:", idToken);
      console.log("email:", email);


      localStorage.setItem("user-email", email);
      localStorage.setItem("admin-auth-token", idToken);

      setIsLoggedIn(true);
      router.push("/overview");

    } catch (err: any) {
      console.error("Error during admin login:", err.message);
      setError("Login failed. Please check your email and password.");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100">Admin Login</h2>
        <form onSubmit={handleLogin} className="mt-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-sm border rounded-md dark:bg-gray-700 dark:text-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-sm border rounded-md dark:bg-gray-700 dark:text-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
