export type Member = {
    name: string;
    email: string;
    memberID?: string;
    userID?: string;
    githubID?: string | null;
    discordID?: string | null;
    status?: string;
    team?: string | null;
    teamID?: string | null;
    membershipID?: string | null;
    role: string;
    isLead: boolean;
    isExec?: boolean;
    execRole?: string | null;
    accountStatus?: string | null;
    dateJoined?: Date | string;
    dateLeft?: Date | string | null;
}

export type Role = "product" | "design" | "tech";

export type Team = {
    id: string;
    name: string;
    description: string | null;
    slug: string;
};