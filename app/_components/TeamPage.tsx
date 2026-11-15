import "./ComponentStyles.css";
import {teams} from "../_data/workerFunctions"
import { useAuth } from "../context/AuthContext";
import { useTeam } from "../context/TeamContext";
import { useModal } from "../context/ModalContext";
import MemberModal from "./MemberModal";


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

    const { user } = useAuth();
    const isLeadOrExec = user?.team == teamName && user?.isLead || user?.isExec
    const { members, syncTeam } = useTeam();
    const { activeModal, openModal, closeModal, setSelectedModalTeam, selectedModalTeam } = useModal();

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
                        {isLeadOrExec && <th scope="col">Actions</th>}
                    </tr>
                </thead>

                <tbody>
                    {members.map((member) =>
                        member.team === teamName && (
                            <tr key={member.userID}>
                                <th scope="row">{member.name}</th>

                                <td>
                                    {capitalizeFirstLetter(member.role)}
                                    {member.isLead && <LeadBlock />}
                                </td>

                                {(
                                    (user?.isLead && user.team == member.team && user.role == member.role &&
                                        !member.isExec &&
                                        !member.isLead) ||
                                    user?.isExec
                                ) && (
                                    <td>
                                        <RemoveButton
                                            memberId={member.userID}
                                            teamId={member.team}
                                        />
                                    </td>
                                )}
                            </tr>
                            
                        )
                    )}
                </tbody>
            </table>
            <div className="flex flex-col min-h-[50px]">

                <div className="flex flex-row flex-wrap gap-5 mt-auto pt-3">
                    {isLeadOrExec && (
                        <button className="action-button cursor-pointer" onClick={() => {setSelectedModalTeam(teamName); openModal("addMember")}}>
                            <p>Add/Update Members</p>
                        </button>
                    )}

                    <button className="action-button cursor-pointer" onClick={() => {syncTeam(teamName)}}>
                        <p>Sync Team</p>
                    </button>

                    {isLeadOrExec && (
                        <button className="action-button text-red-400 cursor-pointer">
                            <p>Remove Team</p>
                        </button>
                    )}

                    {activeModal === "addMember" && (
                        <MemberModal onClose={closeModal} teamName={selectedModalTeam}/>
                    )}
                </div>
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

interface RemoveButtonProps {
    memberId: string;
    teamId: string;
}

function RemoveButton({memberId, teamId}: RemoveButtonProps) {

    const { removeMember } = useTeam();

    return (
        <button className= "rounded-xl text-white w-fit h-fit px-2 py-1 bg-red-600! hover:bg-red-700! cursor-pointer" onClick={(e) => removeMember(memberId, teamId)}>
            Remove
        </button>
    )
}