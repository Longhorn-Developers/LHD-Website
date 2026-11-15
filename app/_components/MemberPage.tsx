import "./ComponentStyles.css";
import {Member} from "../_data/workerFunctions"
import {teams} from "../_data/workerFunctions"
import { useTeam } from "../context/TeamContext";


export default function MemberSection() {
    const { members } = useTeam();

    return (
        <div className="min-h-screen bg-[#F5F5F5] p-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#191919]">
                        Team Directory
                    </h1>
                    <p className="mt-1 text-xs font-semibold tracking-widest text-gray-500">
                        LONGHORN DEVELOPERS · MEMBERS
                    </p>
                </div>

                <div className="rounded-lg bg-[#BF5700] px-4 py-2 text-lg font-bold text-white">
                    UT
                </div>
            </div>

            {/* Teams */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Object.entries(teams).map(([teamID, teamName]) => {
                    const teamMembers = members.filter(
                        (member) => member.team === teamName
                    );

                    return (
                        <div
                            key={teamID}
                            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            {/* Burnt orange accent */}
                            <div className="h-1.5 bg-[#BF5700]" />

                            <div className="p-5">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-[#191919]">
                                        {teamName}
                                    </h2>

                                    <span className="rounded-full bg-[#FCE9DD] px-3 py-1 text-xs font-semibold text-[#BF5700]">
                                        {teamMembers.length} Members
                                    </span>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {teamMembers.map((member) => (
                                        <div
                                            key={member.userID}
                                            className="flex items-center gap-3 py-3"
                                        >
                                            {/* Initial avatar */}
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FCE9DD] font-bold text-[#BF5700]">
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>

                                            {/* Member details */}
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-[#191919]">
                                                    {member.name}
                                                </p>

                                                <p className="truncate text-xs text-gray-500">
                                                    {member.email}
                                                </p>
                                            </div>

                                            {/* Leadership labels */}
                                            <div className="flex flex-wrap justify-end gap-1">
                                                {member.isLead && (
                                                    <span className="rounded-md bg-[#FCE9DD] px-2 py-1 text-xs font-semibold text-[#BF5700]">
                                                        Lead
                                                    </span>
                                                )}

                                                {member.isExec && (
                                                    <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                                                        Executive
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {teamMembers.length === 0 && (
                                        <p className="py-6 text-center text-sm text-gray-400">
                                            No members assigned.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}