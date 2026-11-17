"use client";

import "./AdminPortalStyles.css";
import ConfirmationModal from "./ConfirmationModal";
import type { Member } from "../_data/workerFunctions";
import { useState, type FormEvent } from "react";
import { useTeam } from "../context/TeamContext";
import { useAuth } from "../context/AuthContext";
import { canEditTeamMember } from "@/lib/teamPermissions";

interface MemberEditForm {
    email: string;
    discordID: string;
    githubID: string;
    role: string;
    isLead: boolean;
    isExec: boolean;
    execRole: string;
}

export default function MemberSection() {
    const [query, setQuery] = useState("");
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [deleteConfirmationMember, setDeleteConfirmationMember] =
        useState<Member | null>(null);
    const [editForm, setEditForm] = useState<MemberEditForm | null>(null);
    const {
        members,
        setError,
        error,
        loading,
        handleUpdateMember,
        deleteMember,
    } = useTeam();
    const { user } = useAuth();
    const canManageMembers = Boolean(user?.isExec || user?.isLead);

    const normalizedQuery = query.trim().toLowerCase();
    const hasValidEditEmail =
        editForm !== null &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email.trim());
    const filteredMembers = members.filter((member) =>
        [
            member.name,
            member.email,
            member.discordID,
            member.githubID,
            member.team,
            member.role,
        ].some((value) => value?.toLowerCase().includes(normalizedQuery))
    );

    const openEditMemberModal = (member: Member) => {
        setEditingMember(member);
        setEditForm({
            email: member.email,
            discordID: member.discordID ?? "",
            githubID: member.githubID ?? "",
            role: member.role,
            isLead: member.isLead,
            isExec: member.isExec ?? false,
            execRole: member.execRole ?? "",
        });
        setError("");
    };

    const closeEditMember = () => {
        setEditingMember(null);
        setEditForm(null);
    };

    const updateEditForm = (changes: Partial<MemberEditForm>) => {
        setEditForm((current) =>
            current ? { ...current, ...changes } : current
        );
    };

    const handleSaveEdit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!editingMember || !editForm || !editingMember.team) {
            return;
        }

        const memberId = editingMember.userID ?? editingMember.memberID;
        if (!memberId) {
            return;
        }

        const saved = await handleUpdateMember(
            memberId,
            editingMember.team,
            editForm.role,
            editForm.isLead,
            editForm.isExec,
            editForm.execRole,
            {
                email: editForm.email,
                discordID: editForm.discordID,
                githubID: editForm.githubID,
            },
            false
        );

        if (saved) {
            closeEditMember();
        }
    };

    const openDeleteConfirmation = (member: Member) => {
        setError("");
        setDeleteConfirmationMember(member);
    };

    const handleDeleteMember = async () => {
        if (!deleteConfirmationMember) {
            return;
        }

        const memberId =
            deleteConfirmationMember.userID ??
            deleteConfirmationMember.memberID;
        if (!memberId) {
            setError("Unable to delete this member: member ID is missing.");
            return;
        }

        const deleted = await deleteMember(memberId);
        if (deleted) {
            setDeleteConfirmationMember(null);
        }
    };

    return (
        <main className="team-page">
            <div className="team-page-content">
                <header className="team-page-header">
                    <div>
                        <p className="team-page-eyebrow">LONGHORN DEVELOPERS</p>
                        <h1 className="team-page-title">Member Directory</h1>
                        <p className="team-page-description">
                            Browse member profiles and team assignments.
                        </p>
                    </div>

                    <div className="team-search">
                        <label className="sr-only" htmlFor="member-search-input">
                            Search members
                        </label>
                        <svg
                            aria-hidden="true"
                            className="team-search-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                cx="11"
                                cy="11"
                                r="7"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />
                            <path
                                d="m16 16 4 4"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>
                        <input
                            id="member-search-input"
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            className="team-search-input"
                            placeholder="Search members..."
                        />
                    </div>
                </header>

                <div className="team-results-count" aria-live="polite">
                    {filteredMembers.length}{" "}
                    {filteredMembers.length === 1 ? "member" : "members"}
                </div>

                {error && !editingMember && !deleteConfirmationMember && (
                    <p role="alert" className="my-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <section className="team-block">
                    <div className="team-table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Discord</th>
                                    <th scope="col">GitHub</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Team</th>
                                    <th scope="col">Role</th>
                                    {canManageMembers && (
                                        <th scope="col">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => {
                                        const canEdit = canEditTeamMember(
                                            user,
                                            member
                                        );

                                        return (
                                            <tr
                                                key={
                                                    member.userID ??
                                                    member.memberID ??
                                                    member.email
                                                }
                                            >
                                                <th scope="row">{member.name}</th>
                                                <td>{member.email}</td>
                                                <td>{member.discordID || "N/A"}</td>
                                                <td>{member.githubID || "N/A"}</td>
                                                <td>{member.status || "N/A"}</td>
                                                <td>{member.team || "Not assigned"}</td>
                                                <td>
                                                    {member.role.charAt(0).toUpperCase() + member.role.slice(1).toLowerCase()}
                                                    {member.isLead && (
                                                        <span className="lead-badge ml-2">
                                                            Lead
                                                        </span>
                                                    )}
                                                </td>
                                                {canManageMembers && (
                                                    <td>
                                                        {canEdit && (
                                                            <div className="flex flex-wrap gap-2">
                                                                <button
                                                                    type="button"
                                                                    className="row-action-button edit-button cursor-pointer"
                                                                    onClick={() =>
                                                                        openEditMemberModal(
                                                                            member
                                                                        )
                                                                    }
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="row-action-button remove-button cursor-pointer"
                                                                    disabled={loading}
                                                                    onClick={() =>
                                                                        openDeleteConfirmation(
                                                                            member
                                                                        )
                                                                    }
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={canManageMembers ? 8 : 7}
                                            className="team-empty-members"
                                        >
                                            No members match your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {editingMember && editForm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#211a16]/60 p-4 backdrop-blur-sm">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="member-directory-edit-title"
                        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#e7e2dc] bg-white shadow-2xl"
                    >
                        <div className="flex items-center justify-between bg-[#BF5700] px-6 py-5">
                            <div>
                                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">
                                    Longhorn Developers
                                </p>
                                <h2
                                    id="member-directory-edit-title"
                                    className="text-xl font-bold text-white"
                                >
                                    Edit Member
                                </h2>
                                <p className="mt-1 text-xs text-white/80">
                                    Update {editingMember.name}&apos;s contact and team details.
                                </p>
                            </div>
                            <button
                                type="button"
                                aria-label="Close member editor"
                                onClick={closeEditMember}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-white/90 transition hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form
                            onSubmit={handleSaveEdit}
                            className="space-y-5 bg-[#fffdfa] p-6"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Email
                                    <input
                                        type="email"
                                        required
                                        value={editForm.email}
                                        onChange={(event) =>
                                            updateEditForm({
                                                email: event.target.value,
                                            })
                                        }
                                        className="mt-2 w-full rounded-lg border border-[#d6d3d1] bg-white px-3 py-2.5 text-sm font-normal text-gray-800 outline-none transition focus:border-[#BF5700] focus:ring-2 focus:ring-[#BF5700]/15"
                                    />
                                </label>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Discord ID
                                    <input
                                        type="text"
                                        value={editForm.discordID}
                                        onChange={(event) =>
                                            updateEditForm({
                                                discordID: event.target.value,
                                            })
                                        }
                                        className="mt-2 w-full rounded-lg border border-[#d6d3d1] bg-white px-3 py-2.5 text-sm font-normal text-gray-800 outline-none transition focus:border-[#BF5700] focus:ring-2 focus:ring-[#BF5700]/15"
                                    />
                                </label>
                                <label className="block text-sm font-semibold text-gray-700 sm:col-span-2">
                                    GitHub ID
                                    <input
                                        type="text"
                                        value={editForm.githubID}
                                        onChange={(event) =>
                                            updateEditForm({
                                                githubID: event.target.value,
                                            })
                                        }
                                        className="mt-2 w-full rounded-lg border border-[#d6d3d1] bg-white px-3 py-2.5 text-sm font-normal text-gray-800 outline-none transition focus:border-[#BF5700] focus:ring-2 focus:ring-[#BF5700]/15"
                                    />
                                </label>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="mb-2 text-sm font-semibold text-gray-700">
                                        Team
                                    </p>
                                    <div className="rounded-lg border border-[#eee5dc] bg-[#f7f5f2] px-3 py-2.5 text-sm text-gray-700">
                                        {editingMember.team || "Not assigned"}
                                    </div>
                                </div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Role
                                    <select
                                        value={editForm.role}
                                        disabled={!user?.isExec}
                                        onChange={(event) =>
                                            updateEditForm({
                                                role: event.target.value,
                                            })
                                        }
                                        className="mt-2 w-full rounded-lg border border-[#d6d3d1] bg-white px-3 py-2.5 text-sm font-normal text-gray-800 outline-none transition focus:border-[#BF5700] focus:ring-2 focus:ring-[#BF5700]/15 disabled:bg-[#f7f5f2] disabled:text-gray-600"
                                    >
                                        <option value={editForm.role}>
                                            {editForm.role.charAt(0).toUpperCase() + editForm.role.slice(1).toLowerCase()}
                                        </option>

                                        {["developer", "designer", "tech"]
                                            .filter((role) => role !== editForm.role)
                                            .map((role) => (
                                                <option key={role} value={role}>
                                                    {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                                                </option>
                                            ))}
                                    </select>
                                </label>
                            </div>

                            {user?.isExec && (
                                <section className="rounded-xl border border-[#eadfd5] bg-white p-4">
                                    <h3 className="mb-3 text-sm font-bold text-gray-900">
                                        Member Permissions
                                    </h3>
                                    <div className="flex flex-col gap-3">
                                        <label className="flex items-center gap-3 text-sm text-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={editForm.isLead}
                                                onChange={(event) =>
                                                    updateEditForm({
                                                        isLead: event.target.checked,
                                                    })
                                                }
                                                className="accent-[#BF5700]"
                                            />
                                            Team Lead
                                        </label>
                                        <label className="flex items-center gap-3 text-sm text-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={editForm.isExec}
                                                onChange={(event) =>
                                                    updateEditForm({
                                                        isExec: event.target.checked,
                                                        execRole: event.target.checked
                                                            ? editForm.execRole
                                                            : "",
                                                    })
                                                }
                                                className="accent-[#BF5700]"
                                            />
                                            Executive
                                        </label>
                                    </div>
                                    {editForm.isExec && (
                                        <label className="mt-4 block text-sm font-semibold text-gray-700">
                                            Executive Role
                                            <select
                                                value={editForm.execRole}
                                                onChange={(event) =>
                                                    updateEditForm({
                                                        execRole: event.target.value,
                                                    })
                                                }
                                                className="mt-2 w-full rounded-lg border border-[#d6d3d1] bg-white px-3 py-2.5 text-sm font-normal text-gray-800 outline-none transition focus:border-[#BF5700] focus:ring-2 focus:ring-[#BF5700]/15"
                                            >
                                                <option value="">
                                                    Select executive role...
                                                </option>
                                                <option value="president">
                                                    President
                                                </option>
                                                <option value="vice president">
                                                    Vice President
                                                </option>
                                                <option value="treasurer">
                                                    Treasurer
                                                </option>
                                                <option value="secretary">
                                                    Secretary
                                                </option>
                                            </select>
                                        </label>
                                    )}
                                </section>
                            )}

                            {error && (
                                <p role="alert" className="text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            <div className="flex justify-end gap-3 border-t border-[#eee9e3] pt-5">
                                <button
                                    type="button"
                                    onClick={closeEditMember}
                                    className="rounded-lg border border-[#d6d3d1] bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-[#BF5700] hover:bg-[#fff7f0] hover:text-[#9a4600] cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        loading ||
                                        !hasValidEditEmail ||
                                        (editForm.isExec &&
                                            !editForm.execRole.trim())
                                    }
                                    className="rounded-lg bg-[#BF5700] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#9a4600] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF5700] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {deleteConfirmationMember && (
                <ConfirmationModal
                    title="Permanently delete member?"
                    message={`This will permanently remove ${deleteConfirmationMember.name} and their account information from the database. This action cannot be undone.`}
                    confirmLabel="Delete Member"
                    isLoading={loading}
                    errorMessage={error}
                    onConfirm={handleDeleteMember}
                    onCancel={() => {
                        if (!loading) {
                            setDeleteConfirmationMember(null);
                            setError("");
                        }
                    }}
                />
            )}
        </main>
    );
}
