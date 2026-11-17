"use client";

import { useState } from "react";
import { useTeam } from "@/app/context/TeamContext";
import type { Member } from "../_data/workerFunctions";
import { useAuth } from "../context/AuthContext";
import MemberSearchDropdown from "./MemberSearchDropdown";

const fieldClassName =
    "w-full rounded-lg border border-[#d6d3d1] bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#BF5700] focus:ring-2 focus:ring-[#BF5700]/15";
const selectClassName = `${fieldClassName} cursor-pointer`;
const labelClassName = "mb-2 block text-sm font-semibold text-gray-700";

interface MemberModalProps {
    onClose: () => void;
    teamName: string;
    editingMember?: Member | null;
}

export default function MemberModal({
    onClose,
    teamName,
    editingMember = null,
}: MemberModalProps) {
    const {
        members,
        handleAddMember,
        handleCreateMember,
        handleUpdateMember,
        loading,
        error,
    } = useTeam();

    const isEditing = editingMember !== null;
    const [selectedMember, setSelectedMember] = useState(
        editingMember
            ? editingMember.userID ??
                  editingMember.memberID ??
                  editingMember.email
            : ""
    );

    const [selectedTeam, setSelectedTeam] = useState(
        editingMember?.team ?? teamName
    );
    const [selectedRole, setSelectedRole] = useState(
        editingMember?.role ?? "select-a-role"
    );

    const [isLead, setIsLead] = useState(editingMember?.isLead ?? false);
    const [isExec, setIsExec] = useState(editingMember?.isExec ?? false);
    const [execRole, setExecRole] = useState(editingMember?.execRole ?? "");

    const [addMode, setAddMode] = useState<"existing" | "new">("existing");

    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newGithubID, setNewGithubID] = useState("");
    const [newDiscordID, setNewDiscordID] = useState("");
    const [newStatus, setNewStatus] = useState("active");

    const { user } = useAuth();

    const roleToSave =
        user?.isLead && !user.isExec ? user.role : selectedRole;
    const getMemberId = (member: Member) =>
        member.userID ?? member.memberID ?? member.email;
    const availableMembers = members.filter(
        (member) => member.team !== teamName
    );
    const selectableMembers = availableMembers.filter(
        (member) =>
            getMemberId(member) !==
                (user?.userID ?? user?.memberID ?? user?.email) &&
            (user?.isExec || !member.isExec)
    );

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#211a16]/60 p-4 backdrop-blur-sm">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="member-modal-title"
                className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#e7e2dc] bg-white shadow-2xl"
            >

                <div className="flex items-center justify-between bg-[#BF5700] px-6 py-5">
                    <div>
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">
                            Longhorn Developers
                        </p>
                        <h2
                            id="member-modal-title"
                            className="text-xl font-bold tracking-tight text-white"
                        >
                            {isEditing ? "Edit Member" : "Manage Members"}
                        </h2>
                        <p className="mt-1 text-xs text-white/80">
                            Assign people, roles, and team access.
                        </p>
                    </div>

                    <button
                        type="button"
                        aria-label="Close member dialog"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-white/90 transition hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <div className="bg-[#fffdfa] p-6">
                {/* Add Member */}
                <div className="flex flex-col gap-4">

                    {!isEditing && (
                        <div>
                            <label className={labelClassName}>
                                Member Type
                            </label>

                            <select
                                value={addMode}
                                onChange={(e) => {
                                    setAddMode(e.target.value as "existing" | "new");
                                    setSelectedMember("");
                                    setNewName("");
                                    setNewEmail("");
                                    setNewGithubID("");
                                    setNewDiscordID("");
                                    setNewStatus("active");
                                    setIsLead(false);
                                    setIsExec(false);
                                    setExecRole("");
                                }}
                                className={selectClassName}
                            >
                                <option value="existing">Select Existing User</option>
                                <option value="new">Create New User</option>
                            </select>
                        </div>
                    )}
                    {/* New User Information */}
                    {isEditing ? (
                        <div className="rounded-lg border border-[#f0dfd1] bg-[#fff7f0] px-3 py-3 text-sm text-gray-700">
                            Editing <span className="font-semibold text-[#7a3900]">{editingMember?.name}</span>
                            <span className="text-gray-600"> ({editingMember?.email})</span>
                        </div>
                    ) : addMode === "existing" ? (
                        <div>
                            <label className={labelClassName}>
                                Select User
                            </label>

                            <MemberSearchDropdown
                                members={selectableMembers}
                                selectedMember={selectedMember}
                                onSelectMember={(memberId) => {
                                    setSelectedMember(memberId);
                                    setIsLead(false);
                                }}
                            />
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className={labelClassName}>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Enter full name"
                                    className={fieldClassName}
                                />
                            </div>

                            <div>
                                <label className={labelClassName}>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Enter email address"
                                    className={fieldClassName}
                                />
                            </div>

                            <div>
                                <label className={labelClassName}>
                                    GitHub ID
                                </label>

                                <input
                                    type="text"
                                    value={newGithubID}
                                    onChange={(e) => setNewGithubID(e.target.value)}
                                    placeholder="Enter GitHub ID"
                                    className={fieldClassName}
                                />
                            </div>

                            <div>
                                <label className={labelClassName}>
                                    Discord ID
                                </label>

                                <input
                                    type="text"
                                    value={newDiscordID}
                                    onChange={(e) => setNewDiscordID(e.target.value)}
                                    placeholder="Enter Discord ID"
                                    className={fieldClassName}
                                />
                            </div>

                            <div>
                                <label className={labelClassName}>
                                    Status
                                </label>

                                <input
                                    type="text"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    placeholder="active"
                                    className={fieldClassName}
                                />
                            </div>

                            <p className="rounded-lg border border-[#eee5dc] bg-white px-3 py-2 text-xs leading-5 text-gray-600">
                                Member ID and user ID are generated automatically.
                                Date joined is set on creation; date left is left blank.
                            </p>
                        </>
                    )}

                   {/* Select Team */}
                    <div>
                        <label className={labelClassName}>
                            Team
                        </label>

                        <select
                            value={selectedTeam}
                            onChange={(e) => setSelectedTeam(e.target.value)}
                            className={selectClassName}
                        >
                            <option value={teamName}>{teamName}</option>
                        </select>
                    </div>

                    {/* Select Role */}
                    <div>
                        <label className={labelClassName}>
                            Role
                        </label>

                        <select
                            value={roleToSave}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className={selectClassName}
                        >
                            {user?.isLead && !user?.isExec ? (
                                <option value={user?.role}>{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</option>
                            ) : (
                                <>
                                    <option value="select-a-role">Select a Role</option>
                                    <option value="developer">Developer</option>
                                    <option value="designer">Designer</option>
                                    <option value="tech">Tech</option>
                                </>
                            )}
                        </select>
                    </div>

                    {/* Permissions */}
                    <div className="rounded-xl border border-[#eadfd5] bg-white p-4">
                        <h3 className="mb-3 text-sm font-bold text-gray-900">
                            Member Permissions
                        </h3>

                        <div className="flex flex-col gap-3">
                            {user?.isExec && (
                                <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isLead}
                                        onChange={(e) => setIsLead(e.target.checked)}
                                        className="accent-[#BF5700]"
                                    />
                                    Team Lead
                                </label>
                            )}

                            {(!isEditing || user?.isExec) && (
                                <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isExec}
                                        onChange={(e) => {
                                            setIsExec(e.target.checked);
                                            if (!e.target.checked) setExecRole("");
                                        }}
                                        className="accent-[#BF5700]"
                                    />
                                    Executive
                                </label>
                            )}
                        </div>

                        {isExec && (
                            <div className="mt-4">
                                <label className={labelClassName}>
                                    Executive Role
                                </label>

                                <select
                                    value={execRole}
                                    onChange={(e) => setExecRole(e.target.value)}
                                    className={selectClassName}
                                >
                                    <option value="">Select executive role...</option>
                                    <option value="president">President</option>
                                    <option value="vice president">Vice President</option>
                                    <option value="treasurer">Treasurer</option>
                                    <option value="secretary">Secretary</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {isEditing && error && (
                    <p role="alert" className="mt-4 text-sm text-red-600">
                        {error}
                    </p>
                )}

                {/* Footer */}
                <div className="mt-6 flex justify-end gap-3 border-t border-[#eee9e3] pt-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-[#d6d3d1] bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-[#BF5700] hover:bg-[#fff7f0] hover:text-[#9a4600] cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            if (isEditing && editingMember) {
                                const memberId =
                                    editingMember.userID ?? editingMember.memberID;
                                if (memberId) {
                                    handleUpdateMember(
                                        memberId,
                                        selectedTeam,
                                        roleToSave,
                                        isLead,
                                        isExec,
                                        execRole
                                    );
                                }
                            } else if (addMode === "existing") {
                                handleAddMember(
                                    selectedMember,
                                    selectedTeam,
                                    roleToSave,
                                    isLead,
                                    isExec,
                                    execRole
                                );
                            } else {
                                handleCreateMember({
                                    name: newName,
                                    email: newEmail,
                                    team: selectedTeam,
                                    role: roleToSave,
                                    isLead,
                                    isExec,
                                    execRole,
                                    githubID: newGithubID,
                                    discordID: newDiscordID,
                                    status: newStatus,
                                });
                            }
                        }}
                        disabled={
                            loading ||
                            (isEditing
                                ? !editingMember?.userID && !editingMember?.memberID
                                : (addMode === "new" &&
                                      (!newName.trim() || !newEmail.trim())) ||
                                  (addMode === "existing" && !selectedMember.trim())) ||
                            roleToSave === "select-a-role" ||
                            (isExec && !execRole.trim())
                        }
                        className="rounded-lg bg-[#BF5700] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#9a4600] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF5700] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                        {loading
                            ? "Saving..."
                            : isEditing
                              ? "Save Changes"
                              : addMode === "new"
                                ? "Create Member"
                                : "Add Member"}
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
}