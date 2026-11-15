export type Member = {
    name: string;
    email: string;
    memberID: string;
    githubID: string;
    discordID: string;
    status: string;
    role: Role;
    isLead: boolean;
    execRole?: string;
    dateJoined?: Date;
    dateLeft?: Date;
}

type Role = "product" | "design" | "tech"

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