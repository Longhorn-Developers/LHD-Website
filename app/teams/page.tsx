import type { Metadata } from "next";
import { SiteHeader } from "../_components/SiteHeader";
import { teamTracks } from "../_data/teams";

export const metadata: Metadata = {
  title: "Teams | Longhorn Developers",
  description:
    "Meet the product, design, and tech tracks that build every Longhorn Developers project together.",
};

export default function TeamsPage() {
  return (
    <main>
      <SiteHeader />

      <section className="teams-hero">
        <div>
          <p className="eyebrow"><span className="status-dot" /> Built on the Forty Acres / three tracks</p>
          <h1>Different crafts.<br /><em>One herd.</em></h1>
        </div>
        <div className="team-equation" aria-label="Three product plus three design plus four tech equals one project team">
          <div className="equation-block yellow"><strong>3</strong><span>Product</span></div>
          <span>+</span>
          <div className="equation-block pink"><strong>3</strong><span>Design</span></div>
          <span>+</span>
          <div className="equation-block blue"><strong>4</strong><span>Tech</span></div>
          <span>=</span>
          <div className="equation-total"><strong>10</strong><span>One team</span></div>
        </div>
        <p className="teams-hero-copy">
          A typical Longhorn Developers project has three product members, three designers, and four technologists. These are your main people—the crew you learn with, make decisions with, and ship alongside.
        </p>
      </section>

      <section className="track-deep-dives">
        {teamTracks.map((track, index) => (
          <article className={`track-deep-dive ${track.accent}`} key={track.slug} id={track.slug}>
            <div className="track-identity">
              <span>{String(index + 1).padStart(2, "0")} / 03</span>
              <strong>{track.count}</strong>
              <h2>{track.name}</h2>
              <p>{track.shorthand}</p>
            </div>
            <div className="track-story">
              <h3>{track.headline}</h3>
              <p>{track.description}</p>
              <div className="track-lists">
                <div>
                  <span>What you’ll do</span>
                  <ul>
                    {track.responsibilities.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <span>What you’ll make</span>
                  <ul>
                    {track.outcomes.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="handoff-section">
        <p className="kicker">How the work moves</p>
        <h2>No throwing work over the wall.</h2>
        <div className="handoff-flow">
          <span>Find the problem</span><b>→</b>
          <span>Shape the idea</span><b>→</b>
          <span>Prototype it</span><b>→</b>
          <span>Build + test</span><b>→</b>
          <span>Ship + learn</span>
        </div>
        <p>
          Product, design, and tech stay in the same conversation from the first student interview to the latest release. Roles are clear; ownership is shared.
        </p>
      </section>

      <section className="team-apply">
        <p>Pick a craft. Join the crew.</p>
        <h2>Which track feels like you?</h2>
        <a className="button button-light" href="mailto:contact@longhorns.dev?subject=Longhorn%20Developers%20Application">
          Apply to Longhorn Developers <span aria-hidden="true">↗</span>
        </a>
      </section>
    </main>
  );
}
