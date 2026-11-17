import type { Member } from "@/app/_data/workerFunctions";

export function sortMembersForCurrentUser(
    members: Member[],
    currentUser: Member | null
): Member[] {
    const currentUserId = currentUser?.userID ?? currentUser?.memberID;
    const currentUserEmail = currentUser?.email?.toLowerCase();
    const currentUserRole = currentUser?.role.trim().toLowerCase();

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

        const leftMatchesCurrentRole =
            left.role.trim().toLowerCase() === currentUserRole;
        const rightMatchesCurrentRole =
            right.role.trim().toLowerCase() === currentUserRole;
        if (leftMatchesCurrentRole !== rightMatchesCurrentRole) {
            return leftMatchesCurrentRole ? -1 : 1;
        }

        return left.role.localeCompare(right.role, undefined, {
            sensitivity: "base",
        });
    });
}
