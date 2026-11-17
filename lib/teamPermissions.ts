import type { Member } from "@/app/_data/workerFunctions";

export function canEditTeamMember(
    actor: Member | null,
    target: Member
): boolean {
    const actorId = actor?.userID ?? actor?.memberID;
    const targetId = target.userID ?? target.memberID;

    if (!actor || !targetId || !target.team || targetId === actorId) {
        return false;
    }

    return (
        actor.isExec === true ||
        (actor.isLead === true &&
            actor.team === target.team &&
            actor.role === target.role &&
            target.isExec !== true &&
            target.isLead !== true)
    );
}
