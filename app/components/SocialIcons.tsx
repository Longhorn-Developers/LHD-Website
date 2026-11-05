type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export function DiscordIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8.5 7.5a13 13 0 0 1 7 0M8.5 16.5a13 13 0 0 0 7 0" />
      <path d="M15.5 17.5 17 20c3-.9 5-2.5 5-2.5.3-4.3-.7-8.3-2.5-11.5A14 14 0 0 0 15.5 4.5l-.8 1.5M8.5 17.5 7 20c-3-.9-5-2.5-5-2.5-.3-4.3.7-8.3 2.5-11.5A14 14 0 0 1 8.5 4.5l.8 1.5" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M8 11v5M8 8v.01M12 16v-5M16 16v-3a2 2 0 0 0-4 0" />
    </svg>
  );
}

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
