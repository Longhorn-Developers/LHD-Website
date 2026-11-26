export type Question = {
    // the ID of the question
    ID: number;

    // the description of the question
    description: string;
    
    // the word limit of this question; can be null if there is no word limit
    wordLimit?: number;

    // whether this question is unique to a certain role
    role: Role;

    // whether this question is required or not
    required: boolean;
}

// A type of all possible roles.
export type Role = "product" | "design" | "tech" | "general";

// Stores the titles and IDs of each menu.
export const menus: Record<string, string> = {
    "general": "General Questions",
    "product": "Product Application",
    "design": "Designer Application",
    "tech": "Developer Application",
}

// All of the teams currently existing. This will most likely be grabbed from the database
// instead of being hardcoded like such.
export const teamOptions: Record<string, string> = {
    "ut-registration-plus": "UT Registration Plus",
    "ut-marketplace": "UT Marketplace",
    "ut-dining": "UT Dining",
    "ut-lectures-plus": "UT Lectures Plus",
    "pet-bevo": "Pet Bevo",
}

// A list of all questions. Again, this will probably be grabbed from the database.
export const questions: Question[]  = [
    {
        ID: 1,
        description: "Question 1",
        wordLimit: 10,
        role: "general",
        required: true,
    },
    {
        ID: 2,
        description: "Product Question 1",
        wordLimit: 100,
        role: "product",
        required: true,
    },
    {
        ID: 3,
        description: "Design Question 1",
        wordLimit: 200,
        role: "design",
        required: true,
    },
    {
        ID: 4,
        description: "Tech Question 1",
        wordLimit: 10,
        role: "tech",
        required: true,
    },
    {
        ID: 5,
        description: "Question 2",
        wordLimit: 100,
        role: "general",
        required: true,
    },
];


// The accent colors associated with each of the menus.
export const menuColors: Record<string, string> = {
    "general": "ut-burntorange",
    "tech": "ut-orange",
    "design": "ut-blue",
    "product": "ut-green",
}