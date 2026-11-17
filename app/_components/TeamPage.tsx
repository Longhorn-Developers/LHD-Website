"use client";

import "./AdminPortalStyles.css";
import { teams, type Member } from "../_data/workerFunctions";
import { useAuth } from "../context/AuthContext";
import { useTeam } from "../context/TeamContext";
import { useModal } from "../context/ModalContext";
import MemberModal from "./MemberModal";
import { useMemo, useState } from "react";
import Fuse from "fuse.js"; 


export default function TeamSection() {
    const [query, setQuery] = useState("");
    const [selectedModalTeam, setSelectedModalTeam] = useState("");
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const { activeModal, openModal, closeModal } = useModal();
    const { setError } = useTeam();

    // Convert teams into searchable objects
    const teamList = useMemo(() => {
        return Object.entries(teams).map(([id, teamName]) => ({
            id,
            teamName
        }));
    }, []);

    console.log(teamList);

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

    console.log(matchingTeams);

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

                <div className="team-results-count" aria-live="polite">
                    {matchingTeams.length}{" "}
                    {matchingTeams.length === 1 ? "team" : "teams"}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {matchingTeams.map(({ id, teamName }) => (
                        <TeamBlock
                            key={id}
                            teamName={teamName}
                            teamID={id}
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
        </main>
    );
}

function TeamBlock({
    teamName,
    teamID,
    onAddMember,
    onEditMember,
}: {
    teamName: string;
    teamID: string;
    onAddMember: (teamName: string) => void;
    onEditMember: (teamName: string, member: Member) => void;
}) {
    const { user } = useAuth();
    const currentUserId = user?.userID ?? user?.memberID;
    const isLeadOrExec = Boolean(
        user?.isExec || (user?.team === teamName && user.isLead)
    );
    const { members, syncTeam } = useTeam();
    const hasCurrentUserInTeam = Boolean(
        currentUserId &&
            members.some(
                (member) =>
                    member.team === teamName &&
                    (member.userID ?? member.memberID) === currentUserId
            )
    );
    const teamMembers = members.filter((member) => member.team === teamName);

    function capitalizeFirstLetter(value: string): string {
        if (!value) return value;
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    return (
        <section className="team-block">
            <div className="team-block-header">
                <h2 className="team-block-title">{teamName}</h2>
                <span className="team-id-badge">{teamID}</span>
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
                                const canRemove =
                                    Boolean(memberId) &&
                                    ((user?.isLead &&
                                        user.team === member.team &&
                                        user.role === member.role &&
                                        member.isExec !== true &&
                                        !member.isLead) ||
                                        user?.isExec === true);

                                return (
                                    <tr key={memberId ?? member.email}>
                                        <th scope="row">{member.name}</th>
                                        <td>
                                            {capitalizeFirstLetter(member.role)} <span> </span>
                                            {member.isLead && <LeadBlock />}
                                        </td>
                                        {memberId && (canRemove || isCurrentUser) && (
                                            <td>
                                                <div className="flex flex-wrap gap-2">
                                                    {canRemove && !isCurrentUser && (
                                                        <EditButton
                                                            onClick={() =>
                                                                onEditMember(teamName, member)
                                                            }
                                                        />
                                                    )}
                                                    <RemoveButton
                                                        memberId={memberId}
                                                        teamId={member.team ?? teamName}
                                                        label={isCurrentUser ? "Leave Project" : "Remove"}
                                                    />
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
                    {isLeadOrExec && (
                        <button
                            className="action-button action-button-primary cursor-pointer"
                            onClick={() => onAddMember(teamName)}
                        >
                            <p>Add/Update Members</p>
                        </button>
                    )}

                    <button
                        className="action-button action-button-secondary cursor-pointer"
                        onClick={() => syncTeam(teamName)}
                    >
                        <p>Sync Team</p>
                    </button>

                    {isLeadOrExec && (
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
