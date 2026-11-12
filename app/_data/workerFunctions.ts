// placeholder, obviously we don't know what this will look like yet
export type NeededChanges = {
    details: string;
}

export type WorkerFunction = {
    // human-readable name of the function
    name: string; 

    // human-readable description of the function
    explanation: string; 

    // whether we should have a warning/confirmation or not
    critical: boolean; 

    // the parameters that are needed for this function, should be the same order as the function itself takes
    parameters: FunctionParameter[];

    // we'll also need some functional parameter for the worker function itself
    // this will also be used for parsing/cleaning input data, like making "true" and "false" into true and false
    // workerFunction: (...args: string[]) => NeededChanges[] | void;
}

export type FunctionParameter = {
    // short name/description of the parameter
    description: string;

    // list of options (empty if none, defaults to text entry)
    options: { label: string; value: string }[];
}


// just a placeholder right now, probably we'll need some way to retrieve this from the database
const teamOptions: { label: string; value: string }[] = [
    {label: "UT Registration Plus", value: "0"},
    {label: "LHD Website", value: "1"}
]

export const adminFunctions: WorkerFunction[] = [
    {
        name: "Add a user to a team",
        explanation: "Add some user to a specific team. Handles adding roles, adding to GitHub teams, etc.",
        critical: false,
        parameters: [
            {
                description: "User ID",
                options: [],
            },
            {
                description: "Assigned Team",
                options: teamOptions,
            },
            {
                description: "Vertical",
                options: [],
            },
            {
                description: "Lead Status",
                options: [{label: "Is Lead", value: "true"}, {label: "Not a Lead", value: "false"}],
            }
        ]
    },
    {
        name: "Remove a user from a team",
        explanation: "Remove some user from a specific team. Handles removing roles, GitHub permissions, etc.",
        critical: true,
        parameters: [
            {
                description: "User ID",
                options: [],
            },
            {
                description: "Team Name",
                options: teamOptions,
            },
        ],
    },
]

