import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../_components/SiteHeader";
import { activeProjects, slowerProjects } from "../_data/projects";

export const metadata: Metadata = {
  title: "Projects | Longhorn Developers",
  description:
    "Explore active, slower, and sunset open source projects built by Longhorn Developers at UT Austin.",
};

function ProjectRow({
  project,
  index,
}: {
  project: (typeof activeProjects)[number];
  index: number;
}) {
  return (
    <Link className={`library-row ${project.accent}`} href={`/projects/${project.slug}`}>
      <span className="library-number">{String(index + 1).padStart(2, "0")}</span>
      <div>
        <span className="project-label">{project.label}</span>
        <h2>{project.name}</h2>
        <p>{project.summary}</p>
      </div>
      <span className="library-signal">{project.signal}</span>
      <span className="library-arrow" aria-hidden="true">↗</span>
    </Link>
  );
}

export default function ProjectsPage() {
  return (
    <main>
      <SiteHeader />

      <section className="library-hero">
        <p className="eyebrow"><span className="status-dot" /> Built for the Forty Acres / all projects</p>
        <h1>Built in the open.<br /><em>Used in the wild.</em></h1>
        <p>Every project starts with a student problem. These are the tools we’re actively building, thoughtfully slowing down, or preserving after their run.</p>
      </section>

      <section className="project-library">
        <div className="library-heading">
          <p className="kicker">Active projects</p>
          <span>{activeProjects.length} projects</span>
        </div>
        <div className="library-list">
          {activeProjects.map((project, index) => (
            <ProjectRow key={project.slug} project={project} index={index} />
          ))}
        </div>

        <div className="library-heading archive-heading">
          <p className="kicker">Slower / sunset</p>
          <span>{slowerProjects.length} projects</span>
        </div>
        <div className="library-list archive-list">
          {slowerProjects.map((project, index) => (
            <ProjectRow
              key={project.slug}
              project={project}
              index={activeProjects.length + index}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
