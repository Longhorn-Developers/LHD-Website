"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const ResetPassword = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { setError, setSuccess, loading } = useAuth();

    const { handleResetPassword, error, success } = useAuth();

    useEffect(() => {
        return () => {
            setError('');
            setSuccess('');
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">

            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img
                        src="/lhdlogo.png"
                        alt="Longhorn Developers"
                        className="h-20 w-auto object-contain"
                    />
                </div>

                {/* Reset Password Card */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Reset Password
                        </h1>

                        <p className="text-sm text-gray-500 mt-2">
                            Create a new password for your account.
                        </p>
                    </div>

                    <form onSubmit={(e) => handleResetPassword(e, password, confirmPassword)} className="space-y-5">

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>

                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your new password"
                                required
                                minLength={8}
                                className="w-full h-12 px-4 border border-gray-300 rounded-md text-sm outline-none transition focus:border-[#BF5700] focus:ring-2 focus:ring-[#BF5700]/20"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>

                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your new password"
                                required
                                minLength={8}
                                className="w-full h-12 px-4 border border-gray-300 rounded-md text-sm outline-none transition focus:border-[#BF5700] focus:ring-2 focus:ring-[#BF5700]/20"
                            />
                        </div>

                        {/* Show Password */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={(e) => setShowPassword(e.target.checked)}
                                className="accent-[#BF5700] cursor-pointer"
                            />

                            <label
                                htmlFor="showPassword"
                                className="text-sm text-gray-600 cursor-pointer"
                            >
                                Show passwords
                            </label>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md p-3">
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-md p-3">
                                {success}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || !token}
                            className="w-full h-12 flex items-center justify-center bg-[#BF5700] hover:bg-[#9a4600] text-white font-semibold rounded-md transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Reset Password"
                            )}
                        </button>

                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => router.push("/admin-login")}
                            className="text-sm font-medium text-[#BF5700] hover:text-[#9a4600] transition cursor-pointer"
                        >
                            Back to Login
                        </button>
                    </div>

                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    © {new Date().getFullYear()} Longhorn Developers
                </p>

            </div>
        </div>
    );
};

export default ResetPassword;