import type { Member } from "@/app/_data/workerFunctions";

const normalizeRole = (role: string | null | undefined) =>
    typeof role === "string" ? role.trim().toLowerCase() : "";

export function sortMembersForCurrentUser(
    members: Member[],
    currentUser: Member | null
): Member[] {
    const currentUserId = currentUser?.userID ?? currentUser?.memberID;
    const currentUserEmail = currentUser?.email?.toLowerCase();
    const currentUserRole = normalizeRole(currentUser?.role);

    const isCurrentUser = (member: Member) => {
        const memberId = member.userID ?? member.memberID;
        if (currentUserId && memberId) {
            return memberId === currentUserId;
        }

        return Boolean(
            currentUserEmail &&
                member.email.toLowerCase() === currentUserEmail
        );
    };

    return [...members].sort((left, right) => {
        const currentUserOrder =
            Number(isCurrentUser(right)) - Number(isCurrentUser(left));
        if (currentUserOrder !== 0) {
            return currentUserOrder;
        }

        const leftRole = normalizeRole(left.role);
        const rightRole = normalizeRole(right.role);
        const leftMatchesCurrentRole =
            currentUserRole !== "" && leftRole === currentUserRole;
        const rightMatchesCurrentRole =
            currentUserRole !== "" && rightRole === currentUserRole;
        if (leftMatchesCurrentRole !== rightMatchesCurrentRole) {
            return leftMatchesCurrentRole ? -1 : 1;
        }

        if (!leftRole || !rightRole) {
            return leftRole ? -1 : rightRole ? 1 : 0;
        }

        return leftRole.localeCompare(rightRole, undefined, {
            sensitivity: "base",
        });
    });
}
