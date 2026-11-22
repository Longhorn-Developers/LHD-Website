import { readdirSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Reveal from "../components/Reveal";
import Slideshow from "../components/Slideshow";
import Image from "next/image";
import { ABOUT_IMAGES } from "../images";

// Must stay static: the slideshow reads public/about with fs at build time,
// and the Cloudflare Worker has no real filesystem at runtime.
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About",
};

// Slideshow images are the files named about1.png, about2.png, ... in public/about.
// Other files in that folder (card photos, how_we_work) are not included.
// This runs on the server at build time, so the folder is read once per deploy.
const ABOUT_IMAGE_DIR = path.join(process.cwd(), "public", "about");

function getAboutSlides() {
  return readdirSync(ABOUT_IMAGE_DIR)
    .filter((file) => /^about\d+\.(png|jpe?g|webp|avif|gif)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file) => ({
      src: `/about/${file}`,
      alt: "Longhorn Developers event",
    }));
}

const GRID_BG =
  "linear-gradient(to right, rgba(51,63,72,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(51,63,72,0.07) 1px, transparent 1px)";

const VALUES = [
  {
    title: "Students First",
    body: "We start with real student problems and let their values guide what we build.",
    src: ABOUT_IMAGES.studentsFirst,
  },
  {
    title: "Open-source by default",
    body: "All of our projects are open-source. Anyone at UT or beyond can use them, learn from them and contribute.",
    src: ABOUT_IMAGES.openSource,
  },
  {
    title: "Collaborative effort",
    body: "Developers, designers, and product managers collaborate on projects, guided by mentors. We partner with UT organizations for larger challenges.",
    src: ABOUT_IMAGES.collaborativeEffort,
  },
  {
    title: "Made for Longhorns",
    body: "Created by Longhorns, for Longhorns. We volunteer our time because we want to build tools that improve campus life.",
    src: ABOUT_IMAGES.madeForLonghorns,
  },
];

const STEPS = [
  {
    title: "Apply",
    body: "Membership is selective so our quality is consistent.",
  },
  {
    title: "Meet Your Team",
    body: "Join a project and get grouped with a lead that guides you and helps you grow.",
  },
  {
    title: "Build Together",
    body: "Designers, developers, product managers, and users work side-by-side in the open.",
  },
  {
    title: "Keep It Going",
    body: "Our projects are never “done”. We are always working to address new student needs and fine-tune our tools.",
  },
];

const EXEC_BOARD = [
  { name: "Kamsi Elele", role: "President", photo: "/about/exec_images/president.png" },
  { name: "Kabir Ramzan", role: "Membership Director", photo: "/about/exec_images/membership_director.png" },
  { name: "Miles Fritzmather", role: "SWE Director", photo: "/about/exec_images/swe_director.png" },
  { name: "Margaret Cartee", role: "Product Director", photo: "/about/exec_images/product_director.png" },
  { name: "Tyler Henry", role: "Director of Design", photo: "/about/exec_images/design_director.png" },
  { name: "Claire Liu", role: "Communication Director", photo: "/about/exec_images/communication_director.png" },
];

/* TODO: swap these grey tiles for real event photos. */
function Photo({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`bg-placeholder ${className}`} />;
}

export default function AboutPage() {
  return (
    <main className="overflow-hidden font-sans">
      {/* Hero */}
      <section
        className="relative px-4 pt-16 pb-24 sm:px-10 md:px-[8vw] md:pt-20 md:pb-28"
        style={{ backgroundImage: GRID_BG, backgroundSize: "70px 70px" }}
      >
        <Reveal className="max-w-xl">
          <h1 className="font-display text-[44px] uppercase leading-none tracking-[0.01em] sm:text-[56px]">
            About
          </h1>
          <p className="mt-6 text-lg leading-snug sm:text-xl">
            We&apos;re students from all over UT who like building things that
            makes campus life easier for the students.
          </p>
          <a
            href="#team"
            className="mt-5 inline-block rounded-md bg-charcoal px-5 py-2.5 text-sm font-light text-white transition-colors hover:bg-burnt-orange"
          >
            Meet our team
          </a>
        </Reveal>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-white"
        />
      </section>

      <Slideshow slides={getAboutSlides()} />

      {/* Mission */}
      <section className="px-4 py-16 sm:px-10 md:px-[8vw] md:py-24">
        <Reveal>
          <h2 className="text-[28px] font-medium tracking-tight sm:text-[32px]">
            Mission
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-snug sm:text-xl">
            We&apos;re creating a home for UT&apos;s most talented developers,
            designers, product managers, and leaders to build high-quality,
            lasting applications that improve student life.
          </p>
        </Reveal>
      </section>

      {/* What we're about */}
      <section className="px-4 py-12 sm:px-10 md:px-[8vw]">
        <Reveal>
          <h2 className="text-[28px] font-medium tracking-tight sm:text-[32px]">
            What we&apos;re about
          </h2>
        </Reveal>
        <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal as="li" key={v.title} delay={i * 0.1}>
              <Image
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/6]"
                src={v.src}
                alt={v.body}
                width={3840}
                height={2160}
              />
              <h3 className="mt-3 text-sm font-semibold">{v.title}</h3>
              <p className="mt-1 text-xs leading-snug text-charcoal/80">
                {v.body}
              </p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* How we work */}
      <section className="grid items-center gap-10 px-4 py-20 sm:px-10 md:grid-cols-[1.8fr_1fr] md:gap-[4vw] md:px-[4vw] md:py-28">
        <Reveal>
          <Image
                className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]"
                src={ABOUT_IMAGES.howWeWork}
                alt={"How we work image"}
                width={3840}
                height={2160}
              />
        </Reveal>
        <Reveal delay={0.15}>
          <h2 className="text-[28px] font-medium tracking-tight sm:text-[32px]">
            How we work
          </h2>
          <ol className="mt-6 space-y-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="text-sm leading-snug">
                <p className="font-semibold">
                  {i + 1}. {s.title}
                </p>
                <p className="mt-1 max-w-sm text-charcoal/80">{s.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* Executive board */}
      <section id="team" className="scroll-mt-4 px-4 py-12 sm:px-10 md:px-[8vw]">
        <Reveal>
          <h2 className="text-[28px] font-medium tracking-tight sm:text-[32px]">
            Meet our executive board
          </h2>
        </Reveal>
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXEC_BOARD.map((m, i) => (
            <Reveal
              as="li"
              key={m.name}
              delay={(i % 3) * 0.1}
              className="rounded-xl bg-[#f6f5f2] p-3"
            >
              {m.photo ? (
                <Image
                  src={m.photo}
                  alt={m.name}
                  width={3840}
                  height={2160}
                  className="aspect-[4/4.4] w-full rounded-lg object-cover"
                />
              ) : (
                <Photo className="aspect-[4/4.4] w-full rounded-lg" />
              )}
              <h3 className="mt-5 text-lg font-medium">{m.name}</h3>
              <p className="mt-1 mb-2 text-sm font-medium text-burnt-orange">
                {m.role}
              </p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section
        className="relative isolate mt-16 px-4 py-20 text-center"
        style={{
          backgroundImage: `${GRID_BG}, linear-gradient(to bottom, #ffffff 0%, #ffffff 55%, #f0eeee 100%)`,
          backgroundSize: "70px 70px, 70px 70px, 100% 100%",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-linear-to-b from-white to-transparent"
        />
        <Reveal
          as="h2"
          className="text-2xl font-medium tracking-tight sm:text-[28px]"
        >
          Interested in working with us?
        </Reveal>
        <Reveal
          delay={0.15}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <a
            href="/#contact"
            className="rounded-md bg-charcoal px-6 py-3 text-sm text-white transition-colors hover:bg-burnt-orange"
          >
            Become a Member
          </a>
          <a
            href="/#contact"
            className="rounded-md bg-charcoal px-6 py-3 text-sm text-white transition-colors hover:bg-burnt-orange"
          >
            Partner With Us
          </a>
        </Reveal>
      </section>
    </main>
  );
}
