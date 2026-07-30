import type { Metadata } from "next";
import { ClubBrand } from "../_components/ClubBrand";
import { SiteHeader } from "../_components/SiteHeader";

export const metadata: Metadata = {
  title: "Community | Longhorn Developers",
  description:
    "Meet the 200+ students and alumni who make Longhorn Developers more than a professional organization.",
};

const eventTypes = [
  {
    number: "01",
    title: "Build nights",
    copy: "The laptops-open, snacks-out nights where half-finished ideas become pull requests—and someone is always around to help.",
    accent: "orange",
  },
  {
    number: "02",
    title: "Workshops",
    copy: "Practical sessions led by members and alumni, from shipping your first feature to learning a new design or product tool.",
    accent: "blue",
  },
  {
    number: "03",
    title: "Demo days",
    copy: "A room full of teammates showing what changed, what broke, what they learned, and what students can use next.",
    accent: "yellow",
  },
  {
    number: "04",
    title: "Alumni nights",
    copy: "Honest conversations with former members about the paths they took after UT—and the paths they did not expect.",
    accent: "pink",
  },
  {
    number: "05",
    title: "Socials",
    copy: "No decks. No deliverables. Just food, games, campus traditions, and time with the people behind the GitHub handles.",
    accent: "green",
  },
  {
    number: "06",
    title: "Talks + panels",
    copy: "A chance to hear how people across tech, design, product, and open source actually do the work.",
    accent: "orange",
  },
];

export default function CommunityPage() {
  return (
    <main>
      <SiteHeader />

      <section className="community-hero">
        <div className="community-hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> 200+ Longhorns and counting
          </p>
          <h1>
            Come for the projects.
            <em>Stay for the people.</em>
          </h1>
          <p>
            Longhorn Developers is a network of students, builders, friends,
            mentors, and alumni. The software brings us together. The community
            is what lasts.
          </p>
        </div>
        <div className="community-count" aria-label="A network of more than 200 people">
          <span className="community-orbit orbit-a" />
          <span className="community-orbit orbit-b" />
          <span className="community-orbit orbit-c" />
          <strong>200+</strong>
          <span>PEOPLE IN THE HERD</span>
          <i className="people-dot dot-one" />
          <i className="people-dot dot-two" />
          <i className="people-dot dot-three" />
          <i className="people-dot dot-four" />
        </div>
      </section>

      <section className="beyond-resume">
        <p className="kicker">More than a professional org</p>
        <h2>
          You can build your future
          <span>without making every moment about it.</span>
        </h2>
        <div className="culture-grid">
          <article>
            <span>BUILD TOGETHER</span>
            <h3>Learn in public.</h3>
            <p>
              Ask the question. Share the messy draft. Pair with someone from a
              different track. Nobody arrives knowing everything.
            </p>
          </article>
          <article>
            <span>BE TOGETHER</span>
            <h3>Make actual friends.</h3>
            <p>
              Some nights are for shipping. Some are for food, games, and
              laughing with people you would never have met in class.
            </p>
          </article>
          <article>
            <span>GROW TOGETHER</span>
            <h3>Bring people with you.</h3>
            <p>
              Members become leads, leads become alumni, and alumni keep
              showing up with advice, introductions, and encouragement.
            </p>
          </article>
        </div>
      </section>

      <section className="alumni-network">
        <div className="alumni-copy">
          <p className="kicker">The network keeps going</p>
          <h2>Graduation is not an exit.</h2>
          <p>
            Our alumni carry the LHD spirit into new teams, cities, and
            communities. They come back to share what they have learned, mentor
            current members, open doors, and remind us that careers rarely move
            in a straight line.
          </p>
          <p>
            The result is a community that stretches beyond one semester, one
            project, or one role.
          </p>
        </div>
        <div className="network-path" aria-label="Members become leads, alumni, and mentors">
          <div><span>01</span><strong>Members</strong></div>
          <b>→</b>
          <div><span>02</span><strong>Leads</strong></div>
          <b>→</b>
          <div><span>03</span><strong>Alumni</strong></div>
          <b>↺</b>
          <div><span>04</span><strong>Mentors</strong></div>
        </div>
      </section>

      <section className="events-section">
        <div className="events-heading">
          <div>
            <p className="kicker">What brings us together</p>
            <h2>There is always something happening.</h2>
          </div>
          <p>
            We create room to learn, celebrate, meet people, and have a life
            outside the issue tracker.
          </p>
        </div>
        <div className="events-grid">
          {eventTypes.map((event) => (
            <article className={`event-card ${event.accent}`} key={event.title}>
              <span>{event.number}</span>
              <h3>{event.title}</h3>
              <p>{event.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="community-manifesto">
        <span>CODE IS THE EXCUSE</span>
        <h2>People are the point.</h2>
        <p>
          Join a project. Find your people. Leave the community stronger than
          you found it.
        </p>
        <div>
          <a
            className="button button-light"
            href="mailto:contact@longhorns.dev?subject=Longhorn%20Developers%20Application"
          >
            Apply to join <span aria-hidden="true">↗</span>
          </a>
          <a
            className="community-discord"
            href="https://discord.gg/7pQDBGdmb7"
            target="_blank"
            rel="noreferrer"
          >
            Meet us on Discord ↗
          </a>
        </div>
      </section>

      <footer>
        <ClubBrand footer />
        <p>Built with burnt-orange energy in Austin, Texas. Hook ’em.</p>
        <div className="footer-links">
          <a href="https://github.com/longhorn-developers" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.instagram.com/longhorndevelopers" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.linkedin.com/company/longhorn-developers" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </footer>
    </main>
  );
}
