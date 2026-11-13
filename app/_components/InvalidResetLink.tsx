"use client";

import React from 'react'
import { useRouter } from 'next/navigation';

const InvalidResetLink = () => {

    const router = useRouter();

  return (
    <div className="text-center">

        <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    />
                </svg>
            </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
            Invalid Reset Link
        </h1>

        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            This password reset link is invalid, missing, or has expired.
            Please request a new password reset link to continue.
        </p>

        <button
            type="button"
            onClick={() => router.push("/admin/forgot-password")}
            className="w-full h-12 mt-7 bg-[#BF5700] hover:bg-[#9a4600] text-white font-semibold rounded-md transition cursor-pointer"
        >
            Request New Reset Link
        </button>

        <button
            type="button"
            onClick={() => router.push("/admin-login")}
            className="mt-5 text-sm font-medium text-[#BF5700] hover:text-[#9a4600] transition cursor-pointer"
        >
            Back to Login
        </button>
    </div>
  )
}

export default InvalidResetLink