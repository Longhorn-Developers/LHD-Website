"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/app/context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { handleForgotPassword, success, error, loading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md animate-up">

        {/* Logo and Heading */}
        <div className="text-center mb-8">
          <Image
            src="/lhdlogo.png"
            alt="Longhorn Developers Logo"
            width={55}
            height={55}
            className="mx-auto mb-5"
          />

          <h1 className="text-2xl font-bold text-gray-900">
            Reset Your Password
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            LHD Membership Portal
          </p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">

          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Forgot your password?
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Enter the email address associated with your account.
            We'll send you instructions to reset your password.
          </p>

          <form onSubmit={(e) => handleForgotPassword(e, email)} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-[#BF5700] focus:border-[#BF5700] transition-all"
              />
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3 mb-5">
                    {error}
                </div>
            )}

            {/* Success */}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-md p-3 mb-5">
                    {success}
                </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#BF5700] hover:bg-[#9a4600] text-white font-semibold rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center disabled:opacity-40"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Send Reset Instructions"
              )}
            </button>

          </form>

          <div className="mt-6 text-center">
            <a
              href="/admin-login"
              className="text-sm font-medium text-orange-700 hover:text-orange-800 transition-colors"
            >
              ← Back to Sign In
            </a>
          </div>

        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Longhorn Developers · Membership Portal
        </p>

      </div>
    </div>
  )
}

export default ForgotPassword