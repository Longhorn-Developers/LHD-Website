"use client";

import "./AdminPortalStyles.css";
import {Member} from "../_data/workerFunctions"
import {teams} from "../_data/workerFunctions"
import {useState, useEffect, use} from "react";


export default function MemberSection() {

    const [query, setQuery] = useState("");
    const [members, setMembers] = useState<Member[]>([]);

    useEffect(() => {
        setMembers(getMembers());
    }, []);

    function getMembers() {
        // some code to get all members from the database
        // rn just some random guys
        const names: Member[] = [];
        names.push({
            name: "Someone",
            email: "123@google.com",
            memberID: "123",
            role: "tech",
            isLead: true,
            githubID: "1",
            discordID: "2",
            status: "active",
        })
        names.push({
            name: "Someone Else",
            email: "1234@google.com",
            memberID: "1234",
            role: "product",
            isLead: false,
            githubID: "1",
            discordID: "2",
            status: "active",
        })
        return names;
    }

    return (
        <div className="gap-5 p-10">
            <input 
                type="text" 
                onChange={(e) => setQuery(e.target.value)}
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {getMembers()
                .filter((member) => member.name.toLowerCase().includes(query.toLowerCase()))
                .map((member, index) => (
                    <tr key={member.memberID}>
                        <th>{member.name}</th>
                        <td>{member.email}</td>
                        <td>{member.discordID}</td>
                        <td>{member.status}</td>
                        <td>TEAMS PLACEHOLDER</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}