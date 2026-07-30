import Link from "next/link";
import { activeProjects, slowerProjects } from "./_data/projects";

const steps = [
  {
    number: "1",
    title: "Find your problem",
    copy: "Pitch an idea or jump into a project solving a real frustration for students at UT.",
  },
  {
    number: "2",
    title: "Find your people",
    copy: "Work alongside developers, designers, product thinkers, and first-time contributors.",
  },
  {
    number: "3",
    title: "Ship it together",
    copy: "Turn a pull request into something thousands of Longhorns can actually use.",
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function LoopMark() {
  return (
    <span className="loop-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Longhorn Developers home">
          <span className="brand-mark">LHD</span>
          <span>Longhorn Developers</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#projects">Projects</a>
          <a href="#join">Get involved</a>
          <a
            className="nav-cta"
            href="mailto:contact@longhorns.dev?subject=Longhorn%20Developers%20Application"
          >
            Apply now <Arrow />
          </a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> UT Austin’s open source community
          </p>
          <h1>
            Build what
            <span className="hero-line">
              campus <em>needs.</em>
            </span>
          </h1>
          <p className="hero-intro">
            We’re a student-run club making open source tools for Longhorns, by
            Longhorns. Learn in public. Ship work that matters.
          </p>
          <div className="hero-actions">
            <a
              className="button button-dark"
              href="mailto:contact@longhorns.dev?subject=Longhorn%20Developers%20Application"
            >
              Apply to join <Arrow />
            </a>
            <a
              className="text-link"
              href="https://github.com/longhorn-developers"
              target="_blank"
              rel="noreferrer"
            >
              Explore our GitHub <Arrow />
            </a>
          </div>
        </div>
        <div className="hero-art" aria-label="Code made by students, for students">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <LoopMark />
          <div className="art-note note-top">OPEN SOURCE!</div>
          <div className="art-note note-bottom">MADE @ UT</div>
          <div className="code-card">
            <div className="code-dots">
              <span />
              <span />
              <span />
            </div>
            <code>
              <span>const</span> idea = <b>&quot;better campus&quot;</b>;
              <br />
              <span>ship</span>(idea, together);
            </code>
          </div>
        </div>
      </section>

      <div className="ticker" aria-label="Club values">
        <div>
          <span>OPEN SOURCE</span><b>✦</b>
          <span>STUDENT BUILT</span><b>✦</b>
          <span>REAL IMPACT</span><b>✦</b>
          <span>OPEN SOURCE</span><b>✦</b>
          <span>STUDENT BUILT</span><b>✦</b>
          <span>REAL IMPACT</span><b>✦</b>
        </div>
      </div>

      <section className="projects section" id="projects">
        <div className="section-heading">
          <div>
            <p className="kicker">Selected work / 2026</p>
            <h2>Projects with a pulse.</h2>
          </div>
          <p>
            Not portfolio pieces. Not class assignments. Living tools made in
            the open for the students around us.
          </p>
        </div>

        <div className="project-grid">
          {activeProjects.map((project, index) => (
            <Link
              key={project.name}
              href={`/projects/${project.slug}`}
              className={`project-card ${project.accent}`}
            >
              <div className="project-top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span className="project-label">{project.label}</span>
                <Arrow />
              </div>
              <div>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
              </div>
              <div className="project-stat">
                <span className="mini-dot" />
                {project.signal}
              </div>
            </Link>
          ))}
        </div>

        <Link
          className="all-projects"
          href="/projects"
        >
          Explore every project <Arrow />
        </Link>

        <div className="sunset-strip">
          <div>
            <p className="kicker">Slower / sunset</p>
            <p>Good ideas have seasons. These projects are moving more slowly or have completed their run.</p>
          </div>
          <div className="sunset-links">
            {slowerProjects.map((project) => (
              <Link key={project.slug} href={`/projects/${project.slug}`}>
                <span>{project.name}</span>
                <small>{project.status}</small>
                <Arrow />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="manifesto">
        <div className="manifesto-stamp">
          <span>EST.</span>
          <strong>UT</strong>
          <span>AUSTIN</span>
        </div>
        <blockquote>
          “The best way to learn how software gets built is to{" "}
          <em>build something people use.</em>”
        </blockquote>
        <p>
          No gatekeeping. No experience-shaped boxes. Just curiosity, care, and
          the willingness to make something better than you found it.
        </p>
      </section>

      <section className="join section" id="join">
        <div className="join-intro">
          <p className="kicker">How to get involved</p>
          <h2>There’s a seat at the table.</h2>
          <p>
            Whether you write code, design interfaces, organize people, or
            simply notice what could work better—there’s useful work here for
            you.
          </p>
        </div>

        <div className="steps">
          {steps.map((step) => (
            <article key={step.number}>
              <span className="step-number">{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="community">
        <p className="kicker">The repo is only the beginning</p>
        <div className="community-grid">
          <div>
            <strong>60K+</strong>
            <span>peak users on our flagship project</span>
          </div>
          <div>
            <strong>25</strong>
            <span>public repositories and counting</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>student-led, open source energy</span>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="cta-loop" aria-hidden="true" />
        <p>Applications open</p>
        <h2>
          Your next pull request
          <span>starts here.</span>
        </h2>
        <div className="final-actions">
          <a
            className="button button-light"
            href="mailto:contact@longhorns.dev?subject=Longhorn%20Developers%20Application"
          >
            Apply to Longhorn Developers <Arrow />
          </a>
          <a
            className="discord-link"
            href="https://discord.gg/7pQDBGdmb7"
            target="_blank"
            rel="noreferrer"
          >
            Join the Discord
          </a>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark">LHD</span>
          <span>Longhorn Developers</span>
        </a>
        <p>Projects for students, by students.</p>
        <div className="footer-links">
          <a href="https://github.com/longhorn-developers" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.instagram.com/longhorndevelopers" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.linkedin.com/company/longhorn-developers" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </footer>
    </main>
  );
}
