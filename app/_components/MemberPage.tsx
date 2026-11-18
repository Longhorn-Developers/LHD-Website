"use client";

import "./AdminPortalStyles.css";
import ConfirmationModal from "./ConfirmationModal";
import type { Member } from "../_data/workerFunctions";
import { useMemo, useState, type FormEvent } from "react";
import { useTeam } from "../context/TeamContext";
import { useAuth } from "../context/AuthContext";
import {
    canEditTeamMember,
    canRemoveTeamMember,
} from "@/lib/teamPermissions";
import Link from "next/link";
import { FaDiscord, FaGithub } from "react-icons/fa";

interface DirectoryMember extends Member {
    directoryKey: string;
    teams: Member[];
}

interface MembershipDraft {
    membership: Member;
    role: string;
    isLead: boolean;
}

interface MemberEditForm {
    email: string;
    discordID: string;
    githubID: string;
}

const memberIdOf = (member: Member) => member.userID ?? member.memberID ?? "";
const normalize = (value: string | null | undefined) =>
    value?.trim().toLowerCase() ?? "";
const displayLabel = (value: string) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "";

function TeamBadges({ memberships }: { memberships: Member[] }) {
    if (memberships.length === 0) {
        return <span className="member-unassigned">Not assigned</span>;
    }

    const renderBadge = (membership: Member) => (
        <span
            className="member-team-badge"
            key={membership.membershipID ?? membership.teamID ?? membership.team}
        >
            <span>{membership.team}</span>
            <span className="member-team-role">{displayLabel(membership.role)}</span>
            {membership.isLead && <span className="lead-badge">Lead</span>}
        </span>
    );

    return (
        <div className="member-team-badges">
            {memberships.slice(0, 2).map(renderBadge)}
            {memberships.length > 2 && (
                <details className="member-team-more">
                    <summary>+{memberships.length - 2} more</summary>
                    <div className="member-team-popover">
                        {memberships.slice(2).map(renderBadge)}
                    </div>
                </details>
            )}
        </div>
    );
}

export default function MemberSection() {
    const [query, setQuery] = useState("");
    const [teamFilter, setTeamFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editingMember, setEditingMember] = useState<DirectoryMember | null>(
        null
    );
    const [deleteConfirmationMember, setDeleteConfirmationMember] =
        useState<DirectoryMember | null>(null);
    const [editForm, setEditForm] = useState<MemberEditForm | null>(null);
    const [membershipDrafts, setMembershipDrafts] = useState<
        MembershipDraft[]
    >([]);
    const [newTeamId, setNewTeamId] = useState("");
    const [newTeamRole, setNewTeamRole] = useState("developer");
    const [newTeamLead, setNewTeamLead] = useState(false);
    const {
        members,
        teams,
        setError,
        error,
        loading,
        databaseAvailable,
        handleUpdateMember,
        updateMemberAccount,
        addMemberToTeam,
        removeMember,
        deleteMember,
    } = useTeam();
    const { user } = useAuth();
    const canManageMembers = Boolean(user?.isExec || user?.isLead);

    const directoryMembers = useMemo(() => {
        const grouped = new Map<string, DirectoryMember>();

        members.forEach((member, index) => {
            const id = memberIdOf(member);
            const directoryKey = id ? `user:${id}` : `row:${index}`;
            let directoryMember = grouped.get(directoryKey);
            if (!directoryMember) {
                directoryMember = {
                    ...member,
                    directoryKey,
                    teams: [],
                };
                grouped.set(directoryKey, directoryMember);
            }

            if (member.team && member.teamID) {
                const membershipKey =
                    member.membershipID ?? `team:${member.teamID}`;
                if (
                    !directoryMember.teams.some(
                        (existing) =>
                            (existing.membershipID ??
                                `team:${existing.teamID}`) === membershipKey
                    )
                ) {
                    directoryMember.teams.push(member);
                }
            }
        });

        return [...grouped.values()];
    }, [members]);

    const normalizedQuery = normalize(query);
    const roleOptions = useMemo(
        () =>
            [...new Set(directoryMembers.flatMap((member) =>
                member.teams.map((membership) => normalize(membership.role))
            ))]
                .filter(Boolean)
                .sort(),
        [directoryMembers]
    );
    const statusOptions = useMemo(
        () =>
            [...new Set(directoryMembers.map((member) =>
                normalize(member.accountStatus ?? member.status)
            ))]
                .filter(Boolean)
                .sort(),
        [directoryMembers]
    );

    const filteredMembers = useMemo(() => {
        const filtered = directoryMembers.filter((member) => {
            const membershipText = member.teams
                .flatMap((membership) => [membership.team, membership.role])
                .join(" ");
            const matchesQuery = [
                member.name,
                member.email,
                member.githubID,
                member.discordID,
                membershipText,
            ].some((value) => normalize(value).includes(normalizedQuery));
            const matchesTeam =
                teamFilter === "all" ||
                member.teams.some(
                    (membership) => membership.teamID === teamFilter
                );
            const matchesRole =
                roleFilter === "all" ||
                member.teams.some(
                    (membership) => normalize(membership.role) === roleFilter
                );
            const matchesStatus =
                statusFilter === "all" ||
                normalize(member.accountStatus ?? member.status) ===
                    statusFilter;
            return matchesQuery && matchesTeam && matchesRole && matchesStatus;
        });

        const currentUserId = user?.userID ?? user?.memberID;
        return filtered.sort((left, right) => {
            const currentUserOrder =
                Number(memberIdOf(right) === currentUserId) -
                Number(memberIdOf(left) === currentUserId);
            return currentUserOrder || left.name.localeCompare(right.name);
        });
    }, [
        directoryMembers,
        normalizedQuery,
        roleFilter,
        statusFilter,
        teamFilter,
        user,
    ]);

    const getActorForMembership = (membership: Member) => {
        if (user?.isExec) {
            return user;
        }
        const actorId = user?.userID ?? user?.memberID;
        return (
            members.find(
                (member) =>
                    memberIdOf(member) === actorId &&
                    member.teamID === membership.teamID
            ) ?? user
        );
    };

    const canEditMembership = (membership: Member) =>
        user?.isExec === true ||
        canEditTeamMember(getActorForMembership(membership), membership);

    const canEditMember = (member: DirectoryMember) =>
        user?.isExec === true ||
        member.teams.some(canEditMembership);

    const openEditMemberModal = (member: DirectoryMember) => {
        setEditingMember(member);
        setEditForm({
            email: member.email,
            discordID: member.discordID ?? "",
            githubID: member.githubID ?? "",
        });
        setMembershipDrafts(
            member.teams.map((membership) => ({
                membership,
                role: membership.role,
                isLead: membership.isLead,
            }))
        );
        setNewTeamId("");
        setNewTeamRole("developer");
        setNewTeamLead(false);
        setError("");
    };

    const closeEditMember = () => {
        setEditingMember(null);
        setEditForm(null);
        setMembershipDrafts([]);
    };

    const updateEditForm = (changes: Partial<MemberEditForm>) => {
        setEditForm((current) =>
            current ? { ...current, ...changes } : current
        );
    };

    const handleAddMembership = async () => {
        if (!editingMember || !newTeamId) {
            return;
        }
        const memberId = memberIdOf(editingMember);
        if (!memberId) {
            setError("Unable to add this membership: member ID is missing.");
            return;
        }
        const leadMembership = members.find(
            (membership) =>
                memberIdOf(membership) ===
                    (user?.userID ?? user?.memberID) &&
                membership.teamID === newTeamId &&
                membership.isLead
        );
        const membership = await addMemberToTeam(
            memberId,
            newTeamId,
            user?.isExec === true
                ? newTeamRole
                : leadMembership?.role ?? newTeamRole,
            user?.isExec === true && newTeamLead,
            editingMember.isExec ?? false,
            editingMember.execRole ?? ""
        );
        if (membership) {
            setMembershipDrafts((previous) => [
                ...previous,
                {
                    membership,
                    role: membership.role,
                    isLead: membership.isLead,
                },
            ]);
            setNewTeamId("");
            setNewTeamLead(false);
        }
    };

    const handleRemoveMembership = async (membership: Member) => {
        if (!editingMember || !membership.teamID) {
            return;
        }
        const removed = await removeMember(
            memberIdOf(editingMember),
            membership.teamID
        );
        if (removed) {
            setMembershipDrafts((previous) =>
                previous.filter(
                    (draft) =>
                        draft.membership.membershipID !==
                        membership.membershipID
                )
            );
        }
    };

    const handleSaveEdit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!editingMember || !editForm) {
            return;
        }
        const memberId = memberIdOf(editingMember);
        if (!memberId) {
            setError("Unable to update this member: member ID is missing.");
            return;
        }

        const accountChanged =
            editForm.email.trim() !== editingMember.email ||
            editForm.discordID !== (editingMember.discordID ?? "") ||
            editForm.githubID !== (editingMember.githubID ?? "");
        const contactInfo = {
            email: editForm.email,
            discordID: editForm.discordID,
            githubID: editForm.githubID,
        };
        const changedMemberships = membershipDrafts.filter(
            (draft) =>
                canEditMembership(draft.membership) &&
                (draft.role !== draft.membership.role ||
                    draft.isLead !== draft.membership.isLead)
        );

        if (user?.isExec && accountChanged) {
            if (!(await updateMemberAccount(memberId, contactInfo))) {
                return;
            }
        }

        if (!user?.isExec && accountChanged) {
            const editableMembership = membershipDrafts.find((draft) =>
                canEditMembership(draft.membership)
            );
            if (!editableMembership) {
                setError(
                    "You are not authorized to update this member's account details."
                );
                return;
            }
            const saved = await handleUpdateMember(
                memberId,
                editableMembership.membership.teamID ??
                    editableMembership.membership.team ??
                    "",
                editableMembership.role,
                editableMembership.isLead,
                editingMember.isExec ?? false,
                editingMember.execRole ?? "",
                contactInfo,
                false
            );
            if (!saved) {
                return;
            }
        }

        for (const draft of changedMemberships) {
            const saved = await handleUpdateMember(
                memberId,
                draft.membership.teamID ?? draft.membership.team ?? "",
                draft.role,
                draft.isLead,
                editingMember.isExec ?? false,
                editingMember.execRole ?? "",
                undefined,
                false
            );
            if (!saved) {
                return;
            }
        }

        closeEditMember();
    };

    const openDeleteConfirmation = (member: DirectoryMember) => {
        setError("");
        setDeleteConfirmationMember(member);
    };

    const handleDeleteMember = async () => {
        if (!deleteConfirmationMember) {
            return;
        }
        const memberId = memberIdOf(deleteConfirmationMember);
        if (!memberId) {
            setError("Unable to delete this member: member ID is missing.");
            return;
        }
        if (await deleteMember(memberId)) {
            setDeleteConfirmationMember(null);
        }
    };

    const renderActions = (member: DirectoryMember) => {
        const memberId = memberIdOf(member);
        const canDelete =
            user?.isExec === true &&
            memberId !== (user.userID ?? user.memberID);

        return (
            <div className="member-directory-actions">
                {canEditMember(member) && (
                    <button
                        type="button"
                        className="row-action-button edit-button cursor-pointer"
                        onClick={() => openEditMemberModal(member)}
                    >
                        Edit
                    </button>
                )}
                {canDelete && (
                    <button
                        type="button"
                        className="row-action-button remove-button cursor-pointer"
                        disabled={loading}
                        onClick={() => openDeleteConfirmation(member)}
                    >
                        Delete
                    </button>
                )}
                {!canEditMember(member) && !canDelete && (
                    <span className="member-no-actions">—</span>
                )}
            </div>
        );
    };

    const availableTeams = teams.filter(
        (team) =>
            !membershipDrafts.some(
                (draft) => draft.membership.teamID === team.id
            ) &&
            (user?.isExec === true ||
                (editingMember?.isExec !== true &&
                    members.some(
                        (membership) =>
                            memberIdOf(membership) ===
                                (user?.userID ?? user?.memberID) &&
                            membership.teamID === team.id &&
                            membership.isLead
                    )))
    );
    const selectedLeadMembership = members.find(
        (membership) =>
            memberIdOf(membership) === (user?.userID ?? user?.memberID) &&
            membership.teamID === newTeamId &&
            membership.isLead
    );
    const selectedNewMembershipRole =
        user?.isExec === true
            ? newTeamRole
            : selectedLeadMembership?.role ?? newTeamRole;
    const hasValidEditEmail =
        editForm !== null &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email.trim());

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
                            placeholder="Search name, email, GitHub, Discord..."
                        />
                    </div>
                </header>

                <div className="member-directory-filters">
                    <label>
                        <span>Team</span>
                        <select
                            value={teamFilter}
                            onChange={(event) => setTeamFilter(event.target.value)}
                        >
                            <option value="all">All teams</option>
                            {teams.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <span>Role</span>
                        <select
                            value={roleFilter}
                            onChange={(event) => setRoleFilter(event.target.value)}
                        >
                            <option value="all">All roles</option>
                            {roleOptions.map((role) => (
                                <option key={role} value={role}>
                                    {displayLabel(role)}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <span>Status</span>
                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                        >
                            <option value="all">All statuses</option>
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {displayLabel(status)}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="team-results-count" aria-live="polite">
                    {filteredMembers.length}{" "}
                    {filteredMembers.length === 1 ? "member" : "members"}
                </div>

                {error && !editingMember && !deleteConfirmationMember && (
                    <p role="alert" className="my-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <section className="team-block member-directory-block">
                    <div className="team-table-wrap">
                        <table
                            className={`data-table member-directory-table${canManageMembers ? "" : " member-directory-table-readonly"}`}
                        >
                            <thead>
                                <tr>
                                    <th scope="col">Name / Email</th>
                                    <th scope="col">GitHub / Discord</th>
                                    <th scope="col">Teams</th>
                                    <th scope="col">Status</th>
                                    {canManageMembers && (
                                        <th scope="col">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map((member) => (
                                    <tr key={member.directoryKey}>
                                        <td>
                                            <div className="member-directory-name">
                                                {member.name}
                                            </div>
                                            <div className="member-directory-secondary">
                                                {member.email}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="member-directory-social">
                                                <span>
                                                    <strong className="member-social-icon">
                                                        <FaGithub aria-hidden="true" />
                                                        <span className="sr-only">
                                                            GitHub
                                                        </span>
                                                    </strong>{" "}
                                                    <Link href={`https://github.com/${member.githubID}`} target="_blank">
                                                        {member.githubID}
                                                    </Link>
                                                </span>
                                                <span>
                                                    <strong className="member-social-icon">
                                                        <FaDiscord aria-hidden="true" />
                                                        <span className="sr-only">
                                                            Discord
                                                        </span>
                                                    </strong>{" "}
                                                    {member.discordID || "—"}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <TeamBadges
                                                memberships={member.teams}
                                            />
                                        </td>
                                        <td>
                                            <span className="member-status">
                                                {displayLabel(
                                                    member.accountStatus ??
                                                        member.status ??
                                                        "N/A"
                                                )}
                                            </span>
                                        </td>
                                        {canManageMembers && (
                                            <td>{renderActions(member)}</td>
                                        )}
                                    </tr>
                                ))}
                                {filteredMembers.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={canManageMembers ? 5 : 4}
                                            className="team-empty-members"
                                        >
                                            No members match these filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="member-directory-cards">
                        {filteredMembers.map((member) => (
                            <article
                                className="member-directory-card"
                                key={member.directoryKey}
                            >
                                <div className="member-card-heading">
                                    <div>
                                        <h2>{member.name}</h2>
                                        <p>{member.email}</p>
                                    </div>
                                    <span className="member-status">
                                        {displayLabel(
                                            member.accountStatus ??
                                                member.status ??
                                                "N/A"
                                        )}
                                    </span>
                                </div>
                                <TeamBadges memberships={member.teams} />
                                {canManageMembers && renderActions(member)}
                            </article>
                        ))}
                        {filteredMembers.length === 0 && (
                            <p className="team-empty-members">
                                No members match these filters.
                            </p>
                        )}
                    </div>
                </section>
            </div>

            {editingMember && editForm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#211a16]/60 p-4 backdrop-blur-sm">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="member-directory-edit-title"
                        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#e7e2dc] bg-white shadow-2xl"
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
                                    Update account details and team memberships.
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
                            <section className="rounded-xl border border-[#eadfd5] bg-white p-4">
                                <h3 className="mb-3 text-sm font-bold text-gray-900">
                                    Account Information
                                </h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="text-sm">
                                        <span className="font-semibold text-gray-700">
                                            Name
                                        </span>
                                        <p className="mt-2 rounded-lg border border-[#eee5dc] bg-[#f7f5f2] px-3 py-2.5 text-gray-700">
                                            {editingMember.name}
                                        </p>
                                    </div>
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
                                        GitHub username
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
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Discord username
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
                                </div>
                            </section>

                            <section className="rounded-xl border border-[#eadfd5] bg-white p-4">
                                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">
                                            Team Memberships
                                        </h3>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Each role and lead status applies only to its team.
                                        </p>
                                    </div>
                                </div>

                                {membershipDrafts.length === 0 ? (
                                    <p className="rounded-lg border border-[#eee5dc] bg-[#f7f5f2] px-3 py-3 text-sm text-gray-600">
                                        Not assigned to a team.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {membershipDrafts.map((draft) => {
                                            const membership =
                                                draft.membership;
                                            const editable =
                                                canEditMembership(membership);
                                            const removable =
                                                user?.isExec === true ||
                                                canRemoveTeamMember(
                                                    getActorForMembership(
                                                        membership
                                                    ),
                                                    membership
                                                );
                                            return (
                                                <div
                                                    className="grid gap-3 rounded-lg border border-[#eee5dc] bg-[#fffdfa] p-3 sm:grid-cols-[minmax(0,1fr)_160px_auto]"
                                                    key={
                                                        membership.membershipID ??
                                                        membership.teamID
                                                    }
                                                >
                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            {membership.team}
                                                        </p>
                                                        <label className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                                            <input
                                                                type="checkbox"
                                                                checked={draft.isLead}
                                                                disabled={
                                                                    !user?.isExec
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    setMembershipDrafts(
                                                                        (
                                                                            previous
                                                                        ) =>
                                                                            previous.map(
                                                                                (
                                                                                    item
                                                                                ) =>
                                                                                    item.membership.membershipID ===
                                                                                    membership.membershipID
                                                                                        ? {
                                                                                              ...item,
                                                                                              isLead: event
                                                                                                  .target
                                                                                                  .checked,
                                                                                          }
                                                                                        : item
                                                                            )
                                                                    )
                                                                }
                                                                className="accent-[#BF5700]"
                                                            />
                                                            Team Lead
                                                        </label>
                                                    </div>
                                                    <label className="text-sm font-semibold text-gray-700">
                                                        Role
                                                        <select
                                                            value={draft.role}
                                                            disabled={!editable}
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                setMembershipDrafts(
                                                                    (
                                                                        previous
                                                                    ) =>
                                                                        previous.map(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item.membership.membershipID ===
                                                                                membership.membershipID
                                                                                    ? {
                                                                                          ...item,
                                                                                          role: event
                                                                                              .target
                                                                                              .value,
                                                                                      }
                                                                                    : item
                                                                        )
                                                                )
                                                            }
                                                            className="mt-1 w-full rounded-lg border border-[#d6d3d1] bg-white px-3 py-2 text-sm font-normal text-gray-800 disabled:bg-[#f7f5f2]"
                                                        >
                                                            {[
                                                                ...new Set([
                                                                    draft.role,
                                                                    "developer",
                                                                    "designer",
                                                                    "tech",
                                                                ]),
                                                            ].map((role) => (
                                                                <option
                                                                    key={role}
                                                                    value={role}
                                                                >
                                                                    {displayLabel(
                                                                        role
                                                                    )}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </label>
                                                    {removable && (
                                                        <button
                                                            type="button"
                                                            disabled={loading}
                                                            onClick={() =>
                                                                handleRemoveMembership(
                                                                    membership
                                                                )
                                                            }
                                                            className="row-action-button remove-button cursor-pointer self-end"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {(user?.isExec || user?.isLead) && (
                                    <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-[#eee9e3] pt-4">
                                        <label className="min-w-[180px] flex-1 text-sm font-semibold text-gray-700">
                                            Add team
                                            <select
                                                value={newTeamId}
                                                onChange={(event) =>
                                                    setNewTeamId(
                                                        event.target.value
                                                    )
                                                }
                                                disabled={
                                                    !databaseAvailable ||
                                                    availableTeams.length === 0
                                                }
                                                className="mt-1 w-full rounded-lg border border-[#d6d3d1] bg-white px-3 py-2 text-sm font-normal text-gray-800"
                                            >
                                                <option value="">
                                                    {availableTeams.length
                                                        ? "Select a team..."
                                                        : "No available teams"}
                                                </option>
                                                {availableTeams.map((team) => (
                                                    <option
                                                        key={team.id}
                                                        value={team.id}
                                                    >
                                                        {team.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <label className="min-w-[140px] text-sm font-semibold text-gray-700">
                                            Role
                                            <select
                                                value={selectedNewMembershipRole}
                                                disabled={!user?.isExec}
                                                onChange={(event) =>
                                                    setNewTeamRole(
                                                        event.target.value
                                                    )
                                                }
                                                className="mt-1 w-full rounded-lg border border-[#d6d3d1] bg-white px-3 py-2 text-sm font-normal text-gray-800"
                                            >
                                                <option value="developer">
                                                    Developer
                                                </option>
                                                <option value="designer">
                                                    Designer
                                                </option>
                                                <option value="tech">Tech</option>
                                            </select>
                                        </label>
                                        {user?.isExec && (
                                            <label className="flex items-center gap-2 pb-2 text-sm text-gray-600">
                                                <input
                                                    type="checkbox"
                                                    checked={newTeamLead}
                                                    onChange={(event) =>
                                                        setNewTeamLead(
                                                            event.target.checked
                                                        )
                                                    }
                                                    className="accent-[#BF5700]"
                                                />
                                                Lead
                                            </label>
                                        )}
                                        <button
                                            type="button"
                                            disabled={
                                                loading ||
                                                !databaseAvailable ||
                                                !newTeamId
                                            }
                                            onClick={handleAddMembership}
                                            className="row-action-button edit-button cursor-pointer"
                                        >
                                            Add Membership
                                        </button>
                                    </div>
                                )}
                            </section>

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
                                        membershipDrafts.some(
                                            (draft) =>
                                                canEditMembership(
                                                    draft.membership
                                                ) &&
                                                draft.isLead !==
                                                    draft.membership.isLead &&
                                                !user?.isExec
                                        )
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
                    message={`This will permanently remove ${deleteConfirmationMember.name} and all of their team memberships and account information. This action cannot be undone.`}
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
