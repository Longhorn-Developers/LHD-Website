"use client";

import { useState } from "react";
import { useTeam } from "@/app/context/TeamContext";
import { Member } from "../_data/workerFunctions";
import { useAuth } from "../context/AuthContext";

interface MemberModalProps {
    onClose: () => void;
    teamName: string;
}

export default function MemberModal({ onClose, teamName }: MemberModalProps) {
    const { members, handleAddMember, handleCreateMember } = useTeam();

    const [action, setAction] = useState<"add" | "update">("add");
    const [selectedMember, setSelectedMember] = useState("");

    const [selectedTeam, setSelectedTeam] = useState(teamName);
    const [selectedRole, setSelectedRole] = useState("select-a-role");

    const [isLead, setIsLead] = useState(false);
    const [isExec, setIsExec] = useState(false);
    const [execRole, setExecRole] = useState("");

    const [addMode, setAddMode] = useState<"existing" | "new">("existing");

    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newGithubID, setNewGithubID] = useState("");
    const [newDiscordID, setNewDiscordID] = useState("");
    const [newStatus, setNewStatus] = useState("active");

    const { user } = useAuth();

    const roleToSave = user?.isLead ? user.role : selectedRole;
    const getMemberId = (member: Member) =>
        member.userID ?? member.memberID ?? member.email;
    const availableMembers = members.filter(
        (member) => member.team !== teamName
    );

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-none backdrop-blur-[1px]">
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">

                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Manage Members
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Action Dropdown */}
                <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Action
                    </label>

                    <select
                        value={action}
                        onChange={(e) => {
                            setAction(e.target.value as "add" | "update");
                            setSelectedMember("");
                        }}
                        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 outline-none cursor-pointer"
                    >
                        <option value="add">Add Member</option>
                        <option value="update">Update Member</option>
                    </select>
                </div>

                {/* Add Member */}
                {action === "add" && (
                <div className="flex flex-col gap-4">

                    {/* Select User */}
                    {/* Add Member Type */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
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
                            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm cursor-pointer"
                        >
                            <option value="existing">Select Existing User</option>
                            <option value="new">Create New User</option>
                        </select>
                    </div>
                    {/* New User Information */}
                    {addMode === "existing" ? (
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Select User
                        </label>

                        <select
                            value={selectedMember}
                            onChange={(e) => {
                                const member = availableMembers.find(
                                    (candidate) =>
                                        getMemberId(candidate) === e.target.value
                                );
                                setSelectedMember(e.target.value);
                                setIsLead(member?.isLead ?? false);
                            }}
                            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm cursor-pointer"
                        >
                            <option value="">Choose a user...</option>

                            {availableMembers
                                .filter((member) =>
                                    getMemberId(member) !==
                                        (user?.userID ?? user?.memberID ?? user?.email) &&
                                    (user?.isExec ||
                                        (!member.isExec && !(user?.isLead && member.isLead)))
                                )
                                .map((member) => (
                                    <option
                                        key={getMemberId(member)}
                                        value={getMemberId(member)}
                                    >
                                        {member.name} ({member.email})
                                    </option>
                                ))}
                        </select>
                    </div>
                    ) : (
                        <>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Enter full name"
                                    className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Enter email address"
                                    className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    GitHub ID
                                </label>

                                <input
                                    type="text"
                                    value={newGithubID}
                                    onChange={(e) => setNewGithubID(e.target.value)}
                                    placeholder="Enter GitHub ID"
                                    className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Discord ID
                                </label>

                                <input
                                    type="text"
                                    value={newDiscordID}
                                    onChange={(e) => setNewDiscordID(e.target.value)}
                                    placeholder="Enter Discord ID"
                                    className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Status
                                </label>

                                <input
                                    type="text"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    placeholder="active"
                                    className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
                                />
                            </div>

                            <p className="text-xs text-gray-500">
                                Member ID and user ID are generated automatically.
                                Date joined is set on creation; date left is left blank.
                            </p>
                        </>
                    )}

                   {/* Select Team */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Team
                        </label>

                        <select
                            value={selectedTeam}
                            onChange={(e) => setSelectedTeam(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm cursor-pointer"
                        >
                            <option value={teamName}>{teamName}</option>
                        </select>
                    </div>

                    {/* Select Role */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Role
                        </label>

                        <select
                            value={roleToSave}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm cursor-pointer"
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
                    <div className="rounded-lg border border-gray-200 p-4">
                        <h3 className="mb-3 text-sm font-semibold text-gray-800">
                            Member Permissions
                        </h3>

                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isLead}
                                    onChange={(e) => setIsLead(e.target.checked)}
                                />
                                Team Lead
                            </label>

                            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isExec}
                                    onChange={(e) => {
                                        setIsExec(e.target.checked);
                                        if (!e.target.checked) setExecRole("");
                                    }}
                                />
                                Executive
                            </label>
                        </div>

                        {isExec && (
                            <div className="mt-4">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Executive Role
                                </label>

                                <select
                                    value={execRole}
                                    onChange={(e) => setExecRole(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 p-2.5 text-sm cursor-pointer"
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
            )}

                {/* Update Member */}
                {action === "update" && (
                    <div className="mb-5">
                        <p className="text-sm text-gray-500">
                            Update member functionality will go here.
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-9">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                        Cancel
                    </button>

                    {action === "add" && (
                           <button
                            onClick={() => {
                                if (addMode === "existing") {
                                    handleAddMember(
                                        selectedMember,
                                        selectedTeam,
                                        roleToSave,
                                        isLead,
                                        isExec,
                                        execRole
                                    );
                                } else {
                                    handleCreateMember(
                                        {
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
                                        }
                                    );
                                }
                            }}
                            disabled={
                                (addMode === "new" && (!newName.trim() || !newEmail.trim())) ||
                                (addMode === "existing" && !selectedMember.trim()) ||
                                roleToSave === "select-a-role"
                            }
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {addMode === "new" ? "Create Member" : "Add Member"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}