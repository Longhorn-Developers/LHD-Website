"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";

const apiKey = process.env.NEXT_PUBLIC_API_KEY; // Replace with your existing API config if different.

interface User {
    id: number;
    name: string;
    userID: string;
    email: string;
    isExec: boolean;
    execRole: string | null;
    team: string | null;
    role: string | null;
    isLead: boolean;
    memberID: string | null;
    githubID: string | null;
    discordID: string | null;
    status: string | null;
    dateJoined: string | null;
    dateLeft: string | null;
}

const Settings = () => {
    const { activeView, setActiveView } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        githubID: "",
        discordID: "",
    });

    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Get current user
    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const res = await axios.get(
                    `${apiKey}/api/auth/me`,
                    { withCredentials: true }
                );

                const currentUser = res.data.user;

                setUser(currentUser);

                setProfile({
                    name: currentUser.name || "",
                    email: currentUser.email || "",
                    githubID: currentUser.githubID || "",
                    discordID: currentUser.discordID || "",
                });
            } catch (error) {
                console.error("Failed to retrieve user:", error);
                setMessage("Unable to load your account information.");
            } finally {
                setLoading(false);
            }
        };

        getCurrentUser();
    }, []);

    // Update personal information and connected accounts
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");

        try {
            await axios.put(
                `${apiKey}/api/auth/profile`,
                {
                    name: profile.name,
                    email: profile.email,
                    githubID: profile.githubID,
                    discordID: profile.discordID
                },
                {
                    withCredentials: true
                }
            );

            setMessage("Your profile has been updated successfully.");
        } catch (error: any) {
            console.error("Profile update failed:", error);
            setMessage(
                error.response?.data?.message || "Failed to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    // Update password
    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        setMessage("");

        if (password.newPassword !== password.confirmPassword) {
            setMessage("Your new passwords do not match.");
            return;
        }

        if (password.newPassword.length < 8) {
            setMessage("Your password must contain at least 8 characters.");
            return;
        }

        setSaving(true);

        try {
            await axios.put(
                `${apiKey}/api/auth/update-password`,
                {
                    currentPassword: password.currentPassword,
                    newPassword: password.newPassword,
                },
                { withCredentials: true }
            );

            setPassword({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            setMessage("Your password has been updated successfully.");
        } catch (error: any) {
            console.error("Password update failed:", error);
            setMessage(
                error.response?.data?.message || "Failed to update password."
            );
        } finally {
            setSaving(false);
        }
    };

    const inputStyle =
        "w-full rounded-lg border border-[#d6d3d1] bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#BF5700] focus:ring-2 focus:ring-[#BF5700]/15";

    const labelStyle =
        "mb-2 block text-sm font-semibold text-gray-700";

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-[#f7f5f2]">
                <div role="status" className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#BF5700]/20 border-t-[#BF5700]" />
                    Loading settings...
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="m-6 rounded-xl border border-[#e7e2dc] bg-white p-10 text-center text-gray-600 shadow-sm">
                Unable to load your account.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f5f2] px-4 py-8 sm:px-6 md:py-10 lg:px-8">
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-8 border-l-4 border-[#BF5700] pl-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#BF5700]">
                        Dashboard / Settings
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Account Settings
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                        Manage your personal information and account preferences.
                    </p>
                </div>

                {/* Feedback */}
                {message && (
                    <div role="status" className="mb-6 rounded-lg border border-[#BF5700]/20 bg-[#fff4e8] px-4 py-3 text-sm font-medium text-[#7a3900]">
                        {message}
                    </div>
                )}

                <div className="space-y-6">

                    {/* Personal Information */}
                    <section className="overflow-hidden rounded-2xl border border-[#e7e2dc] bg-white shadow-sm">
                        <div className="border-b border-[#eee9e3] bg-[#fffdfa] p-6 md:p-8">
                            <h2 className="text-lg font-bold text-gray-900">
                                Personal Information
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Update your name and email address.
                            </p>
                        </div>

                        <form onSubmit={handleProfileUpdate}>
                            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 md:p-8">

                                <div>
                                    <label className={labelStyle}>
                                        Full Name
                                    </label>

                                    <input
                                        className={inputStyle}
                                        value={profile.name}
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelStyle}>
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        className={inputStyle}
                                        value={profile.email}
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                email: e.target.value,
                                            })
                                        }
                                        placeholder="Your email"
                                        required
                                    />
                                </div>

                            </div>

                            <div className="flex justify-end border-t border-[#eee9e3] bg-[#faf8f5] p-5 md:px-8">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="cursor-pointer rounded-lg bg-[#BF5700] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9a4600] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF5700] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Connected Accounts */}
                    <section className="overflow-hidden rounded-2xl border border-[#e7e2dc] bg-white shadow-sm">
                        <div className="border-b border-[#eee9e3] bg-[#fffdfa] p-6 md:p-8">
                            <h2 className="text-lg font-bold text-gray-900">
                                Connected Accounts
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Add your GitHub and Discord usernames.
                            </p>
                        </div>

                        <form onSubmit={handleProfileUpdate}>
                            <div className="space-y-5 p-6 md:p-8">

                                <div>
                                    <label className={labelStyle}>
                                        GitHub Username
                                    </label>

                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fff4e8] text-xl text-[#BF5700]">
                                            <FaGithub aria-hidden="true" />
                                        </span>

                                        <input
                                            className={inputStyle}
                                            value={profile.githubID}
                                            onChange={(e) =>
                                                setProfile({
                                                    ...profile,
                                                    githubID: e.target.value,
                                                })
                                            }
                                            placeholder="e.g. octocat"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelStyle}>
                                        Discord Username
                                    </label>

                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fff4e8] text-xl text-[#BF5700]">
                                            <FaDiscord aria-hidden="true" />
                                        </span>

                                        <input
                                            className={inputStyle}
                                            value={profile.discordID}
                                            onChange={(e) =>
                                                setProfile({
                                                    ...profile,
                                                    discordID: e.target.value,
                                                })
                                            }
                                            placeholder="e.g. username"
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className="flex justify-end border-t border-[#eee9e3] bg-[#faf8f5] p-5 md:px-8">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="cursor-pointer rounded-lg bg-[#BF5700] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9a4600] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF5700] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save Accounts"}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Password */}
                    <section className="overflow-hidden rounded-2xl border border-[#e7e2dc] bg-white shadow-sm">
                        <div className="border-b border-[#eee9e3] bg-[#fffdfa] p-6 md:p-8">
                            <h2 className="text-lg font-bold text-gray-900">
                                Password & Security
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Change your account password.
                            </p>
                        </div>

                        <form onSubmit={handlePasswordUpdate}>
                            <div className="max-w-2xl space-y-5 p-6 md:p-8">

                                <div>
                                    <label className={labelStyle}>
                                        Current Password
                                    </label>

                                    <input
                                        type="password"
                                        className={inputStyle}
                                        value={password.currentPassword}
                                        onChange={(e) =>
                                            setPassword({
                                                ...password,
                                                currentPassword: e.target.value,
                                            })
                                        }
                                        placeholder="Enter current password"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelStyle}>
                                        New Password
                                    </label>

                                    <input
                                        type="password"
                                        className={inputStyle}
                                        value={password.newPassword}
                                        onChange={(e) =>
                                            setPassword({
                                                ...password,
                                                newPassword: e.target.value,
                                            })
                                        }
                                        placeholder="Enter new password"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelStyle}>
                                        Confirm New Password
                                    </label>

                                    <input
                                        type="password"
                                        className={inputStyle}
                                        value={password.confirmPassword}
                                        onChange={(e) =>
                                            setPassword({
                                                ...password,
                                                confirmPassword: e.target.value,
                                            })
                                        }
                                        placeholder="Confirm new password"
                                        required
                                    />
                                </div>

                            </div>

                            <div className="flex justify-end border-t border-[#eee9e3] bg-[#faf8f5] p-5 md:px-8">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="cursor-pointer rounded-lg bg-[#BF5700] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9a4600] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF5700] disabled:cursor-not-allowed disabled:opacity-50"
                                    onClick={handlePasswordUpdate}
                                >
                                    {saving ? "Updating..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Account Information */}
                    {/* <section className="rounded-xl border border-gray-200 bg-white">
                        <div className="border-b border-gray-100 p-6 md:p-8">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Account Information
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Your assigned membership information.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:p-8">

                            <div>
                                <p className="text-xs text-gray-400">User ID</p>
                                <p className="mt-1 text-sm font-medium text-gray-800">
                                    {user.userID}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">Member ID</p>
                                <p className="mt-1 text-sm font-medium text-gray-800">
                                    {user.memberID || "Not assigned"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">Team</p>
                                <p className="mt-1 text-sm font-medium text-gray-800">
                                    {user.team || "Not assigned"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">Role</p>
                                <p className="mt-1 text-sm font-medium text-gray-800">
                                    {user.isExec
                                        ? user.execRole || "Executive"
                                        : user.isLead
                                            ? "Lead"
                                            : user.role || "Member"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">Account Status</p>
                                <p className="mt-1 text-sm font-medium text-gray-800">
                                    {user.status || "Active"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">Date Joined</p>
                                <p className="mt-1 text-sm font-medium text-gray-800">
                                    {user.dateJoined
                                        ? new Date(user.dateJoined).toLocaleDateString()
                                        : "Not available"}
                                </p>
                            </div>

                        </div>
                    </section> */}

                </div>
            </div>
        </div>
    );
};

export default Settings;
