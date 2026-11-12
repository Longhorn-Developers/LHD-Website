import "./ComponentStyles.css";
import {Member} from "../_data/workerFunctions"
import {teams} from "../_data/workerFunctions"


export default function TeamSection() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-10">
            {Object.entries(teams).map(([teamID, teamName]) => (
                <TeamBlock 
                key={teamID}
                teamName={teamName}
                teamID={teamID}
                />
            ))}
        </div>
    )
}

function TeamBlock({ teamName, teamID }: { teamName: string; teamID: string }) {

    const getTeamMembers = () => {
        const names: Member[] = [];
        // some code to grab the member list from the database
        // rn, just some temporary guy
        names.push({
            name: "Someone",
            userID: "123",
            team: teamID,
            role: "tech",
            isLead: true,
            isExec: false,
        })
        names.push({
            name: "Someone Else",
            userID: "1234",
            team: teamID,
            role: "product",
            isLead: false,
            isExec: false,
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
            <table className="team-table">
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

function LeadBlock() {
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