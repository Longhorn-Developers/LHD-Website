export type Member = {
    name: string;
    email: string;
    memberID?: string;
    userID?: string;
    githubID?: string | null;
    discordID?: string | null;
    status?: string;
    team?: string | null;
    role: string;
    isLead: boolean;
    isExec?: boolean;
    execRole?: string | null;
    dateJoined?: Date | string;
    dateLeft?: Date | string | null;
}

export type Role = "product" | "design" | "tech";



// likely this will be grabbed from the database, but just as a placeholder for now
export const teams: Record<string, string> = {
    "help-me-bevo": "Help Me Bevo",
    "internal-tooling": "Internal Tooling",
    "lhd-website": "LHD Website",
    "longhorn-lifts": "Longhorn Lifts",
    "longhorn-loop": "Longhorn Loop",
    "longhorn-studies": "Longhorn Studies",
    "mobilize-ut": "Mobilize UT",
    "pet-bevo": "Pet Bevo",
    "ut-dining": "UT Dining",
    "ut-lectures-plus": "UT Lectures Plus",
    "ut-marketplace": "UT Marketplace",
    "ut-registration-plus": "UT Registration Plus"
}