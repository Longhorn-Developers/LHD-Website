import Link from "next/link";
import { projects } from "../_data/projects";
import { teamTracks } from "../_data/teams";
import { ClubBrand } from "./ClubBrand";
import { ThemeToggle } from "./ThemeToggle";

const projectGroups = [
  {
    label: "Active projects",
    projects: projects.filter(
      (project) => project.status === "active" || project.status === "flagship",
    ),
  },
  {
    label: "Slower / sunset",
    projects: projects.filter(
      (project) => project.status === "slower" || project.status === "sunset",
    ),
  },
];

export function SiteHeader({ detail = false }: { detail?: boolean }) {
  return (
    <header className={`site-header${detail ? " detail-header" : ""}`}>
      <ClubBrand />
      <nav aria-label="Main navigation">
        <div className="nav-menu nav-projects">
          <Link className="nav-menu-trigger" href="/projects">
            Projects <span aria-hidden="true">⌄</span>
          </Link>
          <div className="nav-dropdown projects-dropdown">
            <div className="dropdown-heading">
              <span>Explore the work</span>
              <Link href="/projects">View all ↗</Link>
            </div>
            <div className="project-menu-groups">
              {projectGroups.map((group) => (
                <div className="project-menu-group" key={group.label}>
                  <p>{group.label}</p>
                  {group.projects.map((project) => (
                    <Link href={`/projects/${project.slug}`} key={project.slug}>
                      <span>{project.name}</span>
                      <small>{project.status === "flagship" ? "Popular" : project.status}</small>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="nav-menu nav-teams">
          <Link className="nav-menu-trigger" href="/teams">
            Teams <span aria-hidden="true">⌄</span>
          </Link>
          <div className="nav-dropdown teams-dropdown">
            <div className="dropdown-heading">
              <span>Choose your track</span>
              <Link href="/teams">Meet the teams ↗</Link>
            </div>
            <div className="team-menu-list">
              {teamTracks.map((track) => (
                <Link href={`/teams#${track.slug}`} key={track.slug}>
                  <strong>{track.name}</strong>
                  <span>{track.shorthand}</span>
                  <small>{track.count} per project</small>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Link className="nav-community-link" href="/community">
          Community
        </Link>

        <ThemeToggle />

        <a
          className="nav-cta"
          href="mailto:contact@longhorns.dev?subject=Longhorn%20Developers%20Application"
        >
          Apply now <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  );
}
