import "./AdminPortalStyles.css";
import {Member} from "../_data/workerFunctions"
import {teams} from "../_data/workerFunctions"
import {useState} from "react";


export default function TeamSection() {
    const [query, setQuery] = useState("");
    function searchTeams(): Record<string, string> {
        const normalizedQuery = query.toLowerCase();

        const matchingEntries = Object.entries(teams).filter(([, value]) => {
            const targetValue = value.toLowerCase();
            return targetValue.includes(normalizedQuery);
        });

        return Object.fromEntries(matchingEntries);
    }

    return (
        <div className="p-10">
            <input 
                type="text" 
                onChange={(e) => setQuery(e.target.value)}
                className="border border-black mb-5 p-2 outline-0 rounded-md"
                placeholder="Search for a team..."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {Object.entries(searchTeams()).map(([teamID, teamName]) => (
                    <TeamBlock 
                    key={teamID}
                    teamName={teamName}
                    teamID={teamID}
                    />
                ))}
            </div>
        </div>
    )
}

function TeamBlock({ teamName, teamID }: { teamName: string; teamID: string }) {

    const getTeamMembers = () => {
        const names: Member[] = [];
        // some code to grab the member list from the database
        // rn, just some temporary guys
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

    function capitalizeFirstLetter(str: string): string {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
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
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                {getTeamMembers().map((member, index) => (
                    <tr key={index}>
                        <th scope="row">{member.name}</th>
                        <td>
                            {capitalizeFirstLetter(member.role)} 
                            {member.isLead && (<LeadBlock/>)}
                        </td>
                        
                        <td><RemoveButton /></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="flex flex-row gap-5 mt-3">
                <button className="action-button">
                    <p>Add/Update Members</p>
                </button>
                <button className="action-button">
                    <p>Sync Team</p>
                </button>
                <button className="action-button text-red-400">
                    <p>Remove Team</p>
                </button>
            </div>
        </div>
    )

}

export function LeadBlock() {
    return (
        <span className= "ml-2 rounded-xl text-white w-fit h-fit px-2 py-1 bg-green-600 text-xs">
            Lead
        </span>
    )
}

function RemoveButton() {
    return (
        <button className= "rounded-xl text-white w-fit h-fit px-2 py-1 bg-red-600! hover:bg-red-700!">
            Remove
        </button>
    )
}