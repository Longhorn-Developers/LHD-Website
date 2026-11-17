"use client";

import "./AdminPortalStyles.css";
import { teams } from "../_data/workerFunctions";
import { useAuth } from "../context/AuthContext";
import { useTeam } from "../context/TeamContext";
import { useModal } from "../context/ModalContext";
import MemberModal from "./MemberModal";
import { useMemo, useState } from "react";
import Fuse from "fuse.js"; 


export default function TeamSection() {
    const [query, setQuery] = useState("");

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

    console.log(matchingTeams);

    return (
        <div className="p-10">
            <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="border border-black mb-5 p-2 outline-0 rounded-md"
                placeholder="Search for a team..."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {matchingTeams.map(({ id, teamName }) => (
                    <TeamBlock
                        key={id}
                        teamName={teamName}
                        teamID={id}
                    />
                ))}
            </div>

            {matchingTeams.length === 0 && (
                <p className="text-gray-500 flex justify-center items-center">
                    No teams found.
                </p>
            )}
        </div>
    );
}

function TeamBlock({ teamName, teamID }: { teamName: string; teamID: string }) {
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
    const {
        activeModal,
        openModal,
        closeModal,
        setSelectedModalTeam,
        selectedModalTeam,
    } = useModal();

    function capitalizeFirstLetter(value: string): string {
        if (!value) return value;
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    return (
        <div className="team-block">
            <div className="flex flex-row items-center">
                <p className="pr-2 text-xl">{teamName}</p>
                <p>{teamID}</p>
            </div>
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
                    {members
                        .filter((member) => member.team === teamName)
                        .map((member) => {
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
                                        {capitalizeFirstLetter(member.role)}
                                        {member.isLead && <LeadBlock />}
                                    </td>
                                    {memberId && (canRemove || isCurrentUser) && (
                                        <td>
                                            <RemoveButton
                                                memberId={memberId}
                                                teamId={member.team ?? teamName}
                                                label={isCurrentUser ? "Leave Project" : "Remove"}
                                            />
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                </tbody>
            </table>

            <div className="flex flex-col min-h-[50px]">
                <div className="flex flex-row flex-wrap gap-5 mt-auto pt-3">
                    {isLeadOrExec && (
                        <button
                            className="action-button cursor-pointer"
                            onClick={() => {
                                setSelectedModalTeam(teamName);
                                openModal("addMember");
                            }}
                        >
                            <p>Add/Update Members</p>
                        </button>
                    )}

                    <button
                        className="action-button cursor-pointer"
                        onClick={() => syncTeam(teamName)}
                    >
                        <p>Sync Team</p>
                    </button>

                    {isLeadOrExec && (
                        <button className="action-button text-red-400 cursor-pointer">
                            <p>Remove Team</p>
                        </button>
                    )}

                    {activeModal === "addMember" && (
                        <MemberModal
                            onClose={closeModal}
                            teamName={selectedModalTeam}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

function LeadBlock() {
    return (
        <span className="ml-2 rounded-xl text-white w-fit h-fit px-2 py-1 bg-green-600 text-xs">
            Lead
        </span>
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
            className="rounded-xl text-white w-fit h-fit px-2 py-1 bg-red-600! hover:bg-red-700! cursor-pointer"
            onClick={() => removeMember(memberId, teamId)}
        >
            {label}
        </button>
    );
}
