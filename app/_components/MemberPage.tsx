import "./ComponentStyles.css";
import {Member} from "../_data/workerFunctions"
import {teams} from "../_data/workerFunctions"


export default function MemberSection() {
    return (
        <div className="grid grid-cols-2 gap-5 p-10">
            {Object.entries(teams).map(([teamID, teamName]) => (
                <p>{teamName}</p>
            ))}
        </div>
    )
}