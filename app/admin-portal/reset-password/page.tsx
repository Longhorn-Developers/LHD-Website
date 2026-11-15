"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import InvalidResetLink from "@/app/_components/InvalidResetLink";
import ResetPasswordForm from "@/app/_components/ResetPasswordForm";

const apiKey = process.env.NEXT_PUBLIC_APP_URL;

const ResetPassword = () => {
    const searchParams = useSearchParams();
    const resetToken = searchParams.get("token");
    const { setError, setSuccess } = useAuth();
    const [isValidToken, setIsValidToken] = useState(false);
    const [isValidatingToken, setIsValidatingToken] = useState(Boolean(resetToken));

    useEffect(() => {
        const getResetValidation = async () => {
            setIsValidatingToken(true);

            try {
                const res = await axios.get(
                    `${apiKey}/api/auth/reset-password`,
                    {
                        params: { resetToken }
                    }
                );

                console.log(res.data);
                setIsValidToken(true);

            } catch (error) {
                console.log(error);
                if (axios.isAxiosError(error)) {
                    setError(
                        error.response?.data?.msg ||
                        "Invalid or expired reset token."
                    );

                    setIsValidToken(false);
                }
            } finally {
                setIsValidatingToken(false);
            }
        };

        if (resetToken) {
            getResetValidation();
        }

        return () => {
            setError('');
            setSuccess('');
        };
    }, [resetToken, setError, setSuccess]);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
            <div className="w-full max-w-md">

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <img
                            src="/lhdlogo.png"
                            alt="Longhorn Developers"
                            className="h-20 w-auto object-contain"
                        />
                    </div>

                    {!resetToken ? (
                        /* Invalid Reset Link */
                        <InvalidResetLink />

                    ) : isValidatingToken ? (
                        /* Validating Token */
                        <div className="text-center py-8">
                            <div className="flex justify-center mb-5">
                                <span className="w-8 h-8 border-4 border-gray-200 border-t-[#BF5700] rounded-full animate-spin" />
                            </div>

                            <h1 className="text-xl font-bold text-gray-900">
                                Validating Reset Link
                            </h1>

                            <p className="text-sm text-gray-500 mt-2">
                                Please wait while we verify your reset link.
                            </p>
                        </div>

                    ) : !isValidToken ? (
                        /* Invalid Reset Link */
                        <InvalidResetLink />

                    ) : (
                        /* Valid Reset Link */
                        <>
                           <ResetPasswordForm isValidToken={isValidToken} />
                        </>
                    )}
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    © {new Date().getFullYear()} Longhorn Developers
                </p>
            </div>
        </div>
    );

};

export default ResetPassword;