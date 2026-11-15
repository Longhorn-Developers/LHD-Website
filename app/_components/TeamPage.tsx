"use client";

import "./AdminPortalStyles.css";
import { teams } from "../_data/workerFunctions";
import { useAuth } from "../context/AuthContext";
import { useTeam } from "../context/TeamContext";
import { useModal } from "../context/ModalContext";
import MemberModal from "./MemberModal";
import { useState } from "react";

export default function TeamSection() {
    const [query, setQuery] = useState("");
    const normalizedQuery = query.toLowerCase();
    const matchingTeams = Object.entries(teams).filter(([, teamName]) =>
        teamName.toLowerCase().includes(normalizedQuery)
    );

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
                {matchingTeams.map(([teamID, teamName]) => (
                    <TeamBlock
                        key={teamID}
                        teamName={teamName}
                        teamID={teamID}
                    />
                ))}
            </div>
        </div>
    );
}

function TeamBlock({ teamName, teamID }: { teamName: string; teamID: string }) {
    const { user } = useAuth();
    const isLeadOrExec = Boolean(
        user?.isExec || (user?.team === teamName && user.isLead)
    );
    const { members, syncTeam } = useTeam();
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
                        {isLeadOrExec && <th scope="col">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {members
                        .filter((member) => member.team === teamName)
                        .map((member) => {
                            const memberId = member.userID ?? member.memberID;
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
                                    {canRemove && memberId && (
                                        <td>
                                            <RemoveButton
                                                memberId={memberId}
                                                teamId={member.team ?? teamName}
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
}: {
    memberId: string;
    teamId: string;
}) {
    const { removeMember } = useTeam();

    return (
        <button
            className="rounded-xl text-white w-fit h-fit px-2 py-1 bg-red-600! hover:bg-red-700! cursor-pointer"
            onClick={() => removeMember(memberId, teamId)}
        >
            Remove
        </button>
    );
}
