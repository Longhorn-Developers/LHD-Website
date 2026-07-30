export type TeamTrack = {
  slug: "product" | "design" | "tech";
  name: string;
  count: number;
  shorthand: string;
  accent: "yellow" | "pink" | "blue";
  headline: string;
  description: string;
  responsibilities: string[];
  outcomes: string[];
};

export const teamTracks: TeamTrack[] = [
  {
    slug: "product",
    name: "Product",
    count: 3,
    shorthand: "The why + what",
    accent: "yellow",
    headline: "Turn real student problems into a focused plan.",
    description:
      "Product keeps the team pointed at the right problem. They talk to students, clarify what success looks like, shape priorities, and help everyone decide what to build next.",
    responsibilities: [
      "Understand the student and the problem",
      "Define scope, priorities, and success",
      "Keep design and tech aligned",
      "Turn feedback into the next decision",
    ],
    outcomes: ["Research notes", "Project briefs", "Roadmaps", "Launch plans"],
  },
  {
    slug: "design",
    name: "Design",
    count: 3,
    shorthand: "The how it feels",
    accent: "pink",
    headline: "Make complicated campus tasks feel clear and human.",
    description:
      "Design translates student needs into flows, interfaces, and interactions. They prototype early, test assumptions, protect accessibility, and give each project its visual voice.",
    responsibilities: [
      "Map journeys and user flows",
      "Prototype and test ideas early",
      "Design accessible interfaces",
      "Partner with tech through implementation",
    ],
    outcomes: ["User flows", "Prototypes", "UI systems", "Usability findings"],
  },
  {
    slug: "tech",
    name: "Tech",
    count: 4,
    shorthand: "The how it works",
    accent: "blue",
    headline: "Build, test, release, and maintain the thing.",
    description:
      "Tech turns the shared plan into reliable open source software. They choose the architecture, write and review code, connect services, test the experience, and keep it running.",
    responsibilities: [
      "Plan the technical approach",
      "Build frontend, backend, and infrastructure",
      "Review code and test releases",
      "Maintain the project in the open",
    ],
    outcomes: ["Working software", "Pull requests", "Tests", "Releases"],
  },
];

