import Link from "next/link";

const buttonClass =
  "inline-block bg-button px-4 py-2.5 text-ink transition-colors hover:bg-placeholder";

// TODO: replace placeholders with real projects.
const PROJECTS = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  name: "Project Name",
  description: "Course details and schedules, right where you register.",
}));

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-10">
        <div className="bg-surface px-6 py-14 text-center sm:py-16">
          <h1 className="text-4xl font-medium leading-tight tracking-tight sm:text-6xl">
            Built by Longhorns,
            <br />
            for all of UT and beyond.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base">
            A student-led open source community, building tools that bring a
            better campus experience
          </p>
          <a href="#projects" className={`${buttonClass} mt-8`}>
            See our work
          </a>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="mx-auto grid max-w-6xl scroll-mt-4 items-center gap-12 px-4 py-20 sm:px-10 md:grid-cols-2 md:py-24"
      >
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">
            For students, by students
          </h2>
          <p className="mt-4 text-base leading-relaxed">
            Longhorn Developers brings together student developers, designers
            and product managers to build open-source tools for students,
            faculty and staff.
            <br />
            We work with UT departments and Enterprise Technology, and we
            maintain our projects for the long term.
          </p>
          <Link href="/about" className={`${buttonClass} mt-8`}>
            About us →
          </Link>
        </div>
        {/* TODO: replace with team photo */}
        <div className="flex aspect-[10/9] items-center justify-center bg-placeholder text-2xl">
          photo / Image
        </div>
      </section>

      {/* Selected Works */}
      <section id="projects" className="scroll-mt-4 py-12">
        <h2 className="mx-auto max-w-6xl px-4 text-3xl sm:px-10">
          Selected Works
        </h2>
        <ul className="mx-auto mt-6 flex max-w-6xl snap-x scroll-px-4 gap-7 overflow-x-auto px-4 pb-4 sm:scroll-px-10 sm:px-10">
          {PROJECTS.map((p) => (
            <li key={p.id} className="w-60 shrink-0 snap-start">
              <div className="aspect-[230/212] bg-placeholder" />
              <h3 className="mt-5 text-lg">{p.name}</h3>
              <p className="mt-1 text-sm">{p.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section id="contact" className="mt-16 bg-surface px-4 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl">Interested in working with us?</h2>
        <div className="mt-12 flex flex-wrap justify-center gap-5">
          {/* TODO: point at membership / partnership forms */}
          <a href="#" className={buttonClass}>
            Become a Member
          </a>
          <a href="#" className={buttonClass}>
            Partner With Us
          </a>
        </div>
      </section>
    </main>
  );
}
