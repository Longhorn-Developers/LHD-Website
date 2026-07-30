import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
        <Link className="brand" href="/" aria-label="Longhorn Developers home">
          <span className="brand-mark">LHD</span>
          <span>Longhorn Developers</span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/projects">All projects</Link>
          <Link href="/#join">Get involved</Link>
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
          <span className="poster-code">OPEN / SOURCE</span>
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

      <Link className={`next-project ${nextProject.accent}`} href={`/projects/${nextProject.slug}`}>
        <span>Next project</span>
        <strong>{nextProject.name}</strong>
        <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}

