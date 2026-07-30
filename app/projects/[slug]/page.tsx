import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClubBrand } from "../../_components/ClubBrand";
import { getProject, projects } from "../../_data/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: "Project not found | Longhorn Developers" };
  }

  return {
    title: `${project.name} | Longhorn Developers`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <main className={`project-detail theme-${project.accent}`}>
      <header className="site-header detail-header">
        <ClubBrand />
        <nav aria-label="Main navigation">
          <Link href="/projects">All projects</Link>
          <Link href="/teams">Teams</Link>
          <a className="nav-cta" href="mailto:contact@longhorns.dev?subject=Longhorn%20Developers%20Application">
            Apply now <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <section className="detail-hero">
        <div className="detail-title">
          <Link className="back-link" href="/projects">← All projects</Link>
          <div className="detail-badges">
            <span>{project.label}</span>
            <span>{project.status}</span>
          </div>
          <h1>{project.name}</h1>
          <p>{project.summary}</p>
        </div>
        <div className="detail-poster" aria-label={`${project.name} project poster`}>
          <span className="poster-index">{String(currentIndex + 1).padStart(2, "0")}</span>
          <div className="poster-loop" />
          <strong>{project.signal}</strong>
          <span className="poster-code">FORTY / ACRES / OPEN SOURCE</span>
        </div>
      </section>

      <section className="detail-intro">
        <p className="kicker">The project</p>
        <p className="detail-dek">{project.description}</p>
        <a
          className="button button-dark"
          href={`https://github.com/Longhorn-Developers/${project.repo}`}
          target="_blank"
          rel="noreferrer"
        >
          View the repository <span aria-hidden="true">↗</span>
        </a>
      </section>

      <section className="problem-solution">
        <article>
          <span>01 / The problem</span>
          <h2>What needed to work better.</h2>
          <p>{project.problem}</p>
        </article>
        <article>
          <span>02 / The response</span>
          <h2>What students are building.</h2>
          <p>{project.solution}</p>
        </article>
      </section>

      <section className="feature-stack">
        <div>
          <p className="kicker">What it does</p>
          <ol>
            {project.features.map((feature, index) => (
              <li key={feature}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {feature}
              </li>
            ))}
          </ol>
        </div>
        <aside>
          <p className="kicker">Built with</p>
          <div className="tech-list">
            {project.stack.map((item) => <span key={item}>{item}</span>)}
          </div>
          <p className="contribute-note">
            See something you can improve? Open an issue, make a pull request, or bring the idea to the club.
          </p>
        </aside>
      </section>

      <section className="project-team-callout">
        <div>
          <p className="kicker">The people behind the project</p>
          <h2>3 product. 3 design. 4 tech.</h2>
        </div>
        <p>
          A typical project crew is ten students strong. Product keeps the work focused, design makes it clear and usable, and tech turns it into reliable open source software.
        </p>
        <Link href="/teams">
          Explore the three tracks <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <Link className={`next-project ${nextProject.accent}`} href={`/projects/${nextProject.slug}`}>
        <span>Next project</span>
        <strong>{nextProject.name}</strong>
        <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}
