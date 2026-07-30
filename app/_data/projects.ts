export type ProjectStatus = "flagship" | "active" | "slower" | "sunset";

export type Project = {
  slug: string;
  name: string;
  repo: string;
  status: ProjectStatus;
  label: string;
  summary: string;
  description: string;
  signal: string;
  accent: "orange" | "blue" | "yellow" | "pink" | "green";
  problem: string;
  solution: string;
  features: string[];
  stack: string[];
};

export const projects: Project[] = [
  {
    slug: "degree-audit-plus",
    name: "Degree Audit Plus",
    repo: "Degree-Audit-Plus",
    status: "active",
    label: "Browser extension",
    summary: "A clearer, more useful way to read and plan a UT Austin degree audit.",
    description:
      "Degree Audit Plus turns UT Direct’s dense audit results into an interactive dashboard for understanding degree progress and planning future semesters.",
    signal: "Planning made visual",
    accent: "green",
    problem:
      "Degree audits contain the answers students need, but the existing results are difficult to scan, compare, and turn into an actual semester plan.",
    solution:
      "An enhanced audit experience that surfaces progress, requirements, course history, and future plans in one student-friendly workspace.",
    features: [
      "Degree completion and requirement progress at a glance",
      "Expandable requirement details and course history",
      "Drag-and-drop semester planning",
      "Searchable UT course catalog and Core recommendations",
    ],
    stack: ["React", "TypeScript", "WXT", "IndexedDB", "Tailwind CSS"],
  },
  {
    slug: "ut-registration-plus",
    name: "UT Registration Plus",
    repo: "UT-Registration-Plus",
    status: "flagship",
    label: "Flagship extension",
    summary: "The most popular LHD project—and a calmer way to register for classes.",
    description:
      "UT Registration Plus brings professor links, grade distributions, course details, saved schedules, and conflict detection directly into UT’s course catalog.",
    signal: "60K+ peak users",
    accent: "orange",
    problem:
      "Registering for classes can mean twenty tabs, scattered spreadsheets, and a lot of uncertainty about which schedule will actually work.",
    solution:
      "A browser extension that puts the missing context inside the course schedule, where students are already making decisions.",
    features: [
      "Professor, syllabus, and course evaluation links",
      "Historical grade distribution graphs",
      "Saved courses and multiple schedule options",
      "Automatic time-conflict detection",
    ],
    stack: ["TypeScript", "Vite", "UnoCSS", "Storybook", "Browser APIs"],
  },
  {
    slug: "ut-lectures-plus",
    name: "UT Lectures Plus",
    repo: "UT-Lectures-Plus",
    status: "active",
    label: "Browser extension",
    summary: "Searchable transcripts for Lecture Online and TowerLA.",
    description:
      "UT Lectures Plus adds a transcript panel and search tools to UT Austin lecture videos, making it faster to find the moment a concept was explained.",
    signal: "Study, searchable",
    accent: "yellow",
    problem:
      "Reviewing a long lecture for one concept often means scrubbing through video and hoping to land on the right minute.",
    solution:
      "A lightweight extension that makes lecture transcripts visible and searchable alongside supported UT video players.",
    features: [
      "Transcript panel inside supported lecture pages",
      "Fast keyword search across the transcript",
      "Support for Lecture Online and TowerLA",
      "Fallback flow for blocked transcript pages",
    ],
    stack: ["TypeScript", "WXT", "SolidJS", "Browser APIs"],
  },
  {
    slug: "mobilize",
    name: "Mobilize",
    repo: "Mobilize",
    status: "active",
    label: "Accessibility app",
    summary: "A more accessible way to move around the Forty Acres.",
    description:
      "Mobilize is an interactive campus map designed to help disabled students find accessible routes and navigate UT with more confidence.",
    signal: "Access is infrastructure",
    accent: "pink",
    problem:
      "Campus navigation tools rarely communicate the accessibility information students need before they encounter a barrier.",
    solution:
      "A mobile-first map that makes accessibility knowledge easier to discover, share, and use while moving around campus.",
    features: [
      "Interactive map built for campus navigation",
      "Accessibility-centered location information",
      "Cross-platform mobile experience",
      "Community-informed campus data",
    ],
    stack: ["Expo", "React Native", "Cloudflare Workers", "TypeScript"],
  },
  {
    slug: "longhorn-lifts",
    name: "Longhorn Lifts",
    repo: "Longhorn-Lifts",
    status: "active",
    label: "Safety platform",
    summary: "A smoother student and staff experience for UT Sure Walk.",
    description:
      "Longhorn Lifts pairs a student mobile experience with a dispatcher dashboard to make Sure Walk requests, assignments, and status updates easier to manage.",
    signal: "Safety-first UX",
    accent: "blue",
    problem:
      "Students need clearer arrival information, while staff need a better way to coordinate requests and assign drivers.",
    solution:
      "A connected mobile and web system designed around low-friction requests, live status, and responsible location handling.",
    features: [
      "Guided ride-request experience",
      "Real-time request and ride status",
      "Dispatcher dashboard for Sure Walk staff",
      "Privacy-conscious location design",
    ],
    stack: ["Expo", "React Native", "Next.js", "Drizzle", "Cloudflare"],
  },
  {
    slug: "longhorn-studies",
    name: "Longhorn Studies",
    repo: "Longhorn-Studies",
    status: "active",
    label: "Study finder",
    summary: "Find the right study spot for the way you work.",
    description:
      "Longhorn Studies organizes campus study spaces by practical details like noise, capacity, hours, nearby food, and reservability.",
    signal: "Find your focus",
    accent: "green",
    problem:
      "The best study spot depends on the task, the time, and the student—but that information is scattered or missing.",
    solution:
      "A cross-platform directory that turns study-space details into filters students can actually use.",
    features: [
      "Study spots with hours, capacity, and noise level",
      "Tags for spot type and nearby amenities",
      "Reservation and access information",
      "Mobile, web, and API architecture",
    ],
    stack: ["React Native", "Expo", "Python", "Flask", "SQLAlchemy"],
  },
  {
    slug: "pet-bevo",
    name: "Pet Bevo",
    repo: "Help-Me-Bevo",
    status: "active",
    label: "Campus delight",
    summary: "A little Bevo-powered celebration after every assignment submission.",
    description:
      "Pet Bevo turns the small victory of submitting an assignment into a UT-flavored moment, complete with the beloved third-down animation and semester stats.",
    signal: "Joy is a feature",
    accent: "orange",
    problem:
      "Submitting assignments is usually anticlimactic—especially after hours of work.",
    solution:
      "A playful browser extension that rewards the moment with Bevo, tracks submission habits, and wraps the semester with a personalized recap.",
    features: [
      "Bevo animation after supported submissions",
      "Canvas, Gradescope, and Google Classroom options",
      "Submission statistics and semester Wrapped",
      "Volume, fullscreen, and display controls",
    ],
    stack: ["TypeScript", "Browser Extension", "Canvas", "Analytics"],
  },
  {
    slug: "spark-plus",
    name: "Spark Plus",
    repo: "Spark-Plus",
    status: "slower",
    label: "Slower project",
    summary: "Open tooling for UT’s AI Spark system.",
    description:
      "Spark Plus is a collection of related MCP servers running on Cloudflare Workers, giving UT’s AI Spark environment focused tools and reusable integrations.",
    signal: "In a slower lane",
    accent: "yellow",
    problem:
      "Useful AI tooling becomes difficult to maintain when every integration is built as a one-off.",
    solution:
      "A shared framework for separate, durable MCP servers with consistent routing, tools, and deployment patterns.",
    features: [
      "Multiple MCP servers in one maintained codebase",
      "Durable Object-backed server instances",
      "Streamable HTTP transport",
      "Shared server and tool definitions",
    ],
    stack: ["TypeScript", "MCP", "Cloudflare Workers", "Durable Objects"],
  },
  {
    slug: "ut-marketplace",
    name: "UT Marketplace",
    repo: "UT-Marketplace",
    status: "slower",
    label: "Slower project",
    summary: "A student-to-student marketplace designed for the UT community.",
    description:
      "UT Marketplace explores a campus-specific place to browse, list, message, and exchange items with fellow Longhorns.",
    signal: "In a slower lane",
    accent: "pink",
    problem:
      "General marketplaces do not naturally create the trust, relevance, or campus context of a student community.",
    solution:
      "A UT-centered marketplace with listings, profiles, messaging, notifications, and account tools in one responsive experience.",
    features: [
      "Browse, filter, and save listings",
      "Create and manage item listings",
      "Buyer and seller messaging",
      "Profiles, ratings, and notifications",
    ],
    stack: ["Next.js", "React", "Supabase", "Tailwind CSS"],
  },
  {
    slug: "ut-dining",
    name: "UT Dining",
    repo: "UT-Dining",
    status: "sunset",
    label: "Sunset project",
    summary: "LHD’s second-biggest project: campus dining in one companion app.",
    description:
      "UT Dining brought menus, hours, maps, favorites, allergens, and meal planning into a single mobile app for eating on campus.",
    signal: "Second-biggest · Sunset",
    accent: "blue",
    problem:
      "Finding what is open, what is being served, and what fits a dietary need can involve several disconnected campus resources.",
    solution:
      "An offline-friendly mobile companion that organized campus dining information around the decisions students make every day.",
    features: [
      "Current and upcoming dining hall menus",
      "Campus map, hours, and real-time status",
      "Favorites, allergen filters, and notifications",
      "Meal planning and nutrition tracking",
    ],
    stack: ["Expo", "React Native", "Supabase", "SQLite", "Drizzle"],
  },
];

export const activeProjects = projects.filter(
  (project) => project.status === "active" || project.status === "flagship",
);

export const slowerProjects = projects.filter(
  (project) => project.status === "slower" || project.status === "sunset",
);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

