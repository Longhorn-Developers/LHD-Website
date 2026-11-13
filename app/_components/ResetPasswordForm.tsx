"use client";

import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const ResetPasswordForm = ({ isValidToken }: any) => {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { loading } = useAuth();

    const { handleResetPassword, error, success } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        await handleResetPassword(e, password, confirmPassword);
    };
  return (
    <>
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
                Reset Password
            </h1>

            <p className="text-sm text-gray-500 mt-2">
                Create a new password for your account.
            </p>
        </div>

        <form
            onSubmit={(e) =>
                handleSubmit(e)
            }
            className="space-y-5"
        >

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
                disabled={loading || !isValidToken}
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
    </>
  )
}

export default ResetPasswordForm