"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, error, loading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F5F2] px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden border-t-8 border-[#BF5700] animate-up">
        <div className="p-8">
          <div className="text-center mb-8">
            <Image
                src="/lhdlogo.png"
                alt="Longhorn Developers Logo"
                width={50}
                height={50}
                className="mx-auto mb-9"
            />
            <h1 className="text-3xl font-bold text-[#333F48] font-serif tracking-tight">
              Admin Login
            </h1>
            <div className="mx-auto mt-3 mb-3 h-1 w-12 bg-[#BF5700] rounded-full" />
            <p className="text-[#5f6a72]">
              Sign in to access the admin dashboard
            </p>
          </div>

          <form onSubmit={(e) => handleLogin(e, email, password)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#333F48] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@utexas.edu"
                required
                className="w-full px-4 py-3 border border-[#d6d2ca] rounded-md text-[#333F48] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BF5700] focus:border-[#BF5700]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#333F48] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 border border-[#d6d2ca] rounded-md text-[#333F48] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BF5700] focus:border-[#BF5700]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#BF5700] hover:text-[#8c4000] cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end text-orange-700">
                <span onClick={() => router.push("/admin/forgot-password")} className="cursor-pointer">Forgot Password?</span>
            </div>

            {error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

           <button
            type="submit"
            className="w-full h-12 bg-[#BF5700] hover:bg-[#9a4600] text-white font-semibold rounded-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BF5700] disabled:cursor-not-allowed flex items-center justify-center disabled:opacity-60"
            disabled={loading}
            >
                {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    "Sign In"
                )}
            </button>
          </form>
        </div>

        <div className="bg-[#333F48] text-center text-xs text-gray-300 py-3">
          Authorized personnel only
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;