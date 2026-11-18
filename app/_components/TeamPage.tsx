"use client";

import "./AdminPortalStyles.css";
import type { Member } from "../_data/workerFunctions";
import { useAuth } from "../context/AuthContext";
import { useTeam } from "../context/TeamContext";
import { useModal } from "../context/ModalContext";
import MemberModal from "./MemberModal";
import {
    canEditTeamMember,
    canRemoveTeamMember,
} from "@/lib/teamPermissions";
import { sortMembersForCurrentUser } from "@/lib/sortMembersForCurrentUser";
import { useMemo, useState, type FormEvent } from "react";
import Fuse from "fuse.js"; 


export default function TeamSection() {
    const [query, setQuery] = useState("");
    const [selectedModalTeam, setSelectedModalTeam] = useState("");
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
    const [newTeamName, setNewTeamName] = useState("");
    const [newTeamDescription, setNewTeamDescription] = useState("");
    const { activeModal, openModal, closeModal } = useModal();
    const {
        setError,
        teams,
        createTeam,
        loading,
        error,
        databaseAvailable,
    } = useTeam();
    const { user } = useAuth();

    // Convert teams into searchable objects
    const teamList = useMemo(() => {
        return teams.map((team) => ({
            id: team.id,
            slug: team.slug,
            teamName: team.name,
        }));
    }, [teams]);

    // Initialize Fuse
    const fuse = useMemo(() => {
        return new Fuse(teamList, {
            keys: ["teamName"],
            threshold: 0.4,
            ignoreLocation: true,
            minMatchCharLength: 1,
            includeScore: true
        });
    }, [teamList]);

    // Search teams
    const matchingTeams = useMemo(() => {
        if (!query.trim()) {
            return teamList;
        }

        return fuse
            .search(query.trim())
            .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
            .map(result => result.item);
    }, [query, fuse, teamList]);

    const openAddMemberModal = (teamName: string) => {
        setSelectedModalTeam(teamName);
        setEditingMember(null);
        setError("");
        openModal("addMember");
    };

    const openEditMemberModal = (teamName: string, member: Member) => {
        setSelectedModalTeam(teamName);
        setEditingMember(member);
        setError("");
        openModal("addMember");
    };

    const closeMemberModal = () => {
        setEditingMember(null);
        closeModal();
    };

    const submitNewTeam = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!newTeamName.trim()) {
            return;
        }

        const created = await createTeam(
            newTeamName.trim(),
            newTeamDescription.trim()
        );
        if (created) {
            setIsCreateTeamOpen(false);
            setNewTeamName("");
            setNewTeamDescription("");
        }
    };

    return (
        <main className="team-page">
            <div className="team-page-content">
                <header className="team-page-header">
                    <div>
                        <p className="team-page-eyebrow">LONGHORN DEVELOPERS</p>
                        <h1 className="team-page-title">Teams &amp; Members</h1>
                        <p className="team-page-description">
                            Find a team and see the people building with us.
                        </p>
                    </div>

                    <div className="team-search">
                        <label className="sr-only" htmlFor="team-search-input">
                            Search teams
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
                            id="team-search-input"
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            className="team-search-input"
                            placeholder="Search teams..."
                        />
                    </div>
                </header>

                {!databaseAvailable && teams.length > 0 && (
                    <p
                        role="status"
                        className="mt-4 rounded-lg border border-[#f0dfd1] bg-[#fff7f0] px-4 py-3 text-sm text-[#7a3900]"
                    >
                        Database unavailable. Showing development defaults;
                        team and member changes are disabled.
                    </p>
                )}

                <div className="flex items-center justify-between gap-4">
                    <div className="team-results-count" aria-live="polite">
                        {matchingTeams.length}{" "}
                        {matchingTeams.length === 1 ? "team" : "teams"}
                    </div>
                    {user?.isExec && databaseAvailable && (
                        <button
                            type="button"
                            className="action-button action-button-primary cursor-pointer"
                            onClick={() => {
                                setError("");
                                setIsCreateTeamOpen(true);
                            }}
                        >
                            Add Team
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {matchingTeams.map(({ id, slug, teamName }) => (
                        <TeamBlock
                            key={id}
                            teamName={teamName}
                            teamID={id}
                            teamSlug={slug}
                            databaseAvailable={databaseAvailable}
                            onAddMember={openAddMemberModal}
                            onEditMember={openEditMemberModal}
                        />
                    ))}
                </div>

                {matchingTeams.length === 0 && (
                    <div className="team-empty-state">
                        <p className="team-empty-title">No teams found</p>
                        <p>Try a different search or check the spelling.</p>
                    </div>
                )}
            </div>

            {activeModal === "addMember" && selectedModalTeam && (
                <MemberModal
                    onClose={closeMemberModal}
                    teamName={selectedModalTeam}
                    editingMember={editingMember}
                />
            )}

            {isCreateTeamOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#211a16]/60 p-4 backdrop-blur-sm">
                    <form
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="create-team-title"
                        onSubmit={submitNewTeam}
                        className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#e7e2dc] bg-white shadow-2xl"
                    >
                        <div className="flex items-center justify-between bg-[#BF5700] px-6 py-5">
                            <div>
                                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">
                                    Longhorn Developers
                                </p>
                                <h2
                                    id="create-team-title"
                                    className="text-xl font-bold text-white"
                                >
                                    Add a team
                                </h2>
                            </div>
                            <button
                                type="button"
                                aria-label="Close add team dialog"
                                onClick={() => {
                                    setIsCreateTeamOpen(false);
                                    setError("");
                                }}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-white/90 transition hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4 p-6">
                            <div>
                                <label
                                    htmlFor="new-team-name"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Team name
                                </label>
                                <input
                                    id="new-team-name"
                                    type="text"
                                    required
                                    autoFocus
                                    maxLength={120}
                                    value={newTeamName}
                                    onChange={(event) =>
                                        setNewTeamName(event.target.value)
                                    }
                                    className="w-full rounded-lg border border-[#d6d3d1] bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#BF5700] focus:ring-2 focus:ring-[#BF5700]/15"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="new-team-description"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Description <span className="font-normal">(optional)</span>
                                </label>
                                <textarea
                                    id="new-team-description"
                                    rows={3}
                                    value={newTeamDescription}
                                    onChange={(event) =>
                                        setNewTeamDescription(event.target.value)
                                    }
                                    className="w-full resize-y rounded-lg border border-[#d6d3d1] bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#BF5700] focus:ring-2 focus:ring-[#BF5700]/15"
                                />
                            </div>
                            {error && (
                                <p role="alert" className="text-sm text-red-600">
                                    {error}
                                </p>
                            )}
                            <div className="flex justify-end gap-3 border-t border-[#eee9e3] pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreateTeamOpen(false);
                                        setError("");
                                    }}
                                    className="rounded-lg border border-[#d6d3d1] bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-[#BF5700] hover:bg-[#fff7f0] hover:text-[#9a4600]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !newTeamName.trim()}
                                    className="rounded-lg bg-[#BF5700] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#9a4600] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? "Creating..." : "Create Team"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
}

function TeamBlock({
    teamName,
    teamID,
    teamSlug,
    databaseAvailable,
    onAddMember,
    onEditMember,
}: {
    teamName: string;
    teamID: string;
    teamSlug: string;
    databaseAvailable: boolean;
    onAddMember: (teamName: string) => void;
    onEditMember: (teamName: string, member: Member) => void;
}) {
    const { user } = useAuth();
    const currentUserId = user?.userID ?? user?.memberID;
    const { members, syncTeam } = useTeam();
    const currentTeamMembership = members.find(
        (member) =>
            currentUserId &&
            (member.userID ?? member.memberID) === currentUserId &&
            (member.teamID === teamID ||
                (!member.teamID &&
                    member.team?.toLowerCase() === teamName.toLowerCase()))
    );
    const isLeadOrExec = Boolean(
        user?.isExec || currentTeamMembership?.isLead
    );
    const hasCurrentUserInTeam = Boolean(
        currentUserId &&
            currentTeamMembership
    );
    const teamMembers = sortMembersForCurrentUser(
        members.filter(
            (member) =>
                member.teamID === teamID ||
                (!member.teamID &&
                    member.team?.toLowerCase() === teamName.toLowerCase())
        ),
        user
    );
    const actor = user?.isExec ? user : currentTeamMembership ?? user;

    function capitalizeFirstLetter(value: string): string {
        if (!value) return value;
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    return (
        <section className="team-block">
            <div className="team-block-header">
                <h2 className="team-block-title">{teamName}</h2>
                <span className="team-id-badge">{teamSlug}</span>
            </div>
            <div className="team-table-wrap">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Role</th>
                            {(isLeadOrExec || hasCurrentUserInTeam) && (
                                <th scope="col">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {teamMembers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={
                                        isLeadOrExec || hasCurrentUserInTeam ? 3 : 2
                                    }
                                    className="team-empty-members"
                                >
                                    No members assigned yet.
                                </td>
                            </tr>
                        ) : (
                            teamMembers.map((member) => {
                                const memberId = member.userID ?? member.memberID;
                                const isCurrentUser = Boolean(
                                    memberId && memberId === currentUserId
                                );
                                const canEdit = canEditTeamMember(actor, member);
                                const canRemove = canRemoveTeamMember(
                                    actor,
                                    member
                                );

                                return (
                                    <tr key={memberId ?? member.email}>
                                        <th scope="row">{member.name}</th>
                                        <td>
                                            {capitalizeFirstLetter(member.role)} <span> </span>
                                            {member.isLead && <LeadBlock />}
                                        </td>
                                        {memberId &&
                                            (canEdit ||
                                                canRemove ||
                                                isCurrentUser) && (
                                            <td>
                                                <div className="flex flex-wrap gap-2">
                                                    {canEdit && !isCurrentUser && (
                                                        <EditButton
                                                            onClick={() =>
                                                                onEditMember(teamName, member)
                                                            }
                                                        />
                                                    )}
                                                    {(canRemove || isCurrentUser) && (
                                                        <RemoveButton
                                                            memberId={memberId}
                                                            teamId={member.team ?? teamName}
                                                            label={isCurrentUser ? "Leave Project" : "Remove"}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="team-card-footer">
                <div className="flex flex-row flex-wrap gap-3">
                    {databaseAvailable && isLeadOrExec && (
                        <button
                            className="action-button action-button-primary cursor-pointer"
                            onClick={() => onAddMember(teamName)}
                        >
                            <p>Add/Update Members</p>
                        </button>
                    )}

                    {databaseAvailable && (
                        <button
                            className="action-button action-button-secondary cursor-pointer"
                            onClick={() => syncTeam(teamID)}
                        >
                            <p>Sync Team</p>
                        </button>
                    )}

                    {databaseAvailable && isLeadOrExec && (
                        <button className="action-button action-button-danger cursor-pointer">
                            <p>Remove Team</p>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}

function LeadBlock() {
    return (
        <span className="lead-badge">
            Lead
        </span>
    );
}

function EditButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            className="row-action-button edit-button cursor-pointer"
            onClick={onClick}
        >
            Edit
        </button>
    );
}

function RemoveButton({
    memberId,
    teamId,
    label,
}: {
    memberId: string;
    teamId: string;
    label: string;
}) {
    const { removeMember } = useTeam();

    return (
        <button
            className="row-action-button remove-button cursor-pointer"
            onClick={() => removeMember(memberId, teamId)}
        >
            {label}
        </button>
    );
}
