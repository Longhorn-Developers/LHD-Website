"use client";

import "./AdminPortalStyles.css";
import { Member } from "../_data/workerFunctions";
import { useState } from "react";
import { useTeam } from "../context/TeamContext";

const sampleMembers: Member[] = [
    {
        name: "Someone",
        email: "123@google.com",
        memberID: "123",
        role: "tech",
        isLead: true,
        githubID: "1",
        discordID: "2",
        status: "active",
    },
    {
        name: "Someone Else",
        email: "1234@google.com",
        memberID: "1234",
        role: "product",
        isLead: false,
        githubID: "1",
        discordID: "2",
        status: "active",
    },
];

export default function MemberSection() {
    const [query, setQuery] = useState("");
    const { members } = useTeam();
    const filteredMembers = sampleMembers.filter((member) =>
        member.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="gap-5 p-10">
            <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="border border-black mb-5 p-2 outline-0 rounded-md"
                placeholder="Search for a member..."
            />
            <table className="data-table text-sm">
                <thead>
                    <tr>
                        <th className="min-w-30">Name</th>
                        <th className="min-w-55">Email</th>
                        <th className="min-w-30">Discord</th>
                        <th className="min-w-20">Status</th>
                        <th>Teams</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMembers.map((member) => (
                        <tr key={member.memberID ?? member.userID ?? member.email}>
                            <th>{member.name}</th>
                            <td>{member.email}</td>
                            <td>{member.discordID ?? "N/A"}</td>
                            <td>{member.status ?? "N/A"}</td>
                            <td>N/A</td>
                        </tr>
                    ))}
                    {members.map((member) => (
                        <tr key={member.memberID ?? member.userID ?? member.email}>
                            <th>{member.name}</th>
                            <td>{member.email}</td>
                            <td>{member.discordID ?? "N/A"}</td>
                            <td>{member.status ?? "N/A"}</td>
                            <td>N/A</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
