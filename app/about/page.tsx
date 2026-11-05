import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Who We Are",
};

const pillClass =
  "inline-flex items-center gap-2 rounded-full bg-placeholder px-5 py-1.5 text-2xl transition-colors hover:bg-[#c4c4c4] sm:text-3xl";

/*
 * Photo collage, described as columns of tiles (heights in px).
 * A nested array is a row of equal-width tiles sharing one height.
 * TODO: swap grey tiles for real event photos.
 */
type Tile = number | [number, number];
const COLLAGE: { width: number; tiles: Tile[] }[] = [
  { width: 66, tiles: [84, 68, 46] },
  { width: 66, tiles: [62, 62, 62] },
  { width: 90, tiles: [94, 84] },
  { width: 136, tiles: [70, [110, 110]] },
  { width: 182, tiles: [136] },
  { width: 66, tiles: [40, 60] },
  { width: 66, tiles: [62, 62, 62] },
  { width: 142, tiles: [[110, 110], 70] },
  { width: 136, tiles: [70, [110, 110]] },
];

// TODO: replace with real values.
const VALUES = Array.from({ length: 4 }, () => "value - description");

const STEPS = ["Apply", "Meet", "Build"];

// TODO: replace with real exec board members.
const EXEC_BOARD = Array.from({ length: 3 }, (_, i) => ({
  id: i,
  role: "Role/team/title",
  name: "Name",
  bio: "bio bio bio bio bio bio bio bio bio bio bio bio bio",
}));

function PhotoPlaceholder({ label = "photo" }: { label?: string }) {
  return (
    <div className="flex aspect-[6/5] w-full items-center justify-center bg-placeholder text-xl sm:text-2xl">
      {label}
    </div>
  );
}

function Collage() {
  return (
    <div
      aria-hidden
      className="flex items-center justify-center gap-1.5 overflow-hidden"
    >
      {COLLAGE.map((col, i) => (
        <div
          key={i}
          className="flex shrink-0 flex-col gap-1.5"
          style={{ width: col.width }}
        >
          {col.tiles.map((tile, j) =>
            Array.isArray(tile) ? (
              <div key={j} className="flex gap-1.5">
                {tile.map((h, k) => (
                  <div
                    key={k}
                    className="flex-1 bg-placeholder"
                    style={{ height: h }}
                  />
                ))}
              </div>
            ) : (
              <div key={j} className="bg-placeholder" style={{ height: tile }} />
            ),
          )}
        </div>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <main>
      {/* Mission */}
      <section className="px-4 pt-16 pb-20 text-center sm:pt-20 sm:pb-24">
        {/* TODO: write mission statement */}
        <h1 className="text-3xl sm:text-4xl">Mission Statement</h1>
      </section>

      <Collage />

      {/* Values */}
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 pt-24 sm:px-10 md:grid-cols-2">
        <div className="flex flex-col items-center">
          <div>
            <h2 className="text-center text-2xl underline underline-offset-4">
              Our Values
            </h2>
            <ol className="mt-6 list-decimal space-y-2 pl-6 text-lg">
              {VALUES.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ol>
          </div>
        </div>
        <PhotoPlaceholder />
      </section>

      {/* How We Work */}
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 pt-24 sm:px-10 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <PhotoPlaceholder />
        </div>
        <div className="order-1 flex flex-col items-center md:order-2">
          <div>
            <h2 className="text-center text-2xl underline underline-offset-4">
              How We Work
            </h2>
            <ol className="mt-6 list-decimal space-y-2 pl-6 text-lg">
              {STEPS.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Exec Board */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-10">
        <h2 className="text-center text-2xl">Meet Our Exec Board</h2>
        <ul className="mt-6 grid gap-8 md:grid-cols-3">
          {EXEC_BOARD.map((m) => (
            <li key={m.id} className="flex gap-2">
              {/* TODO: headshot */}
              <div className="aspect-[3/4] w-32 shrink-0 bg-placeholder" />
              <div className="pt-2">
                <p className="text-xs">{m.role}</p>
                <h3 className="mt-1 text-lg underline underline-offset-4">
                  {m.name}
                </h3>
                <p className="mt-1 text-base leading-snug">{m.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Alumni + projects */}
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 pt-20 sm:px-10 md:grid-cols-[3fr_2fr]">
        {/* TODO: alumni work highlights */}
        <div className="flex aspect-[7/5] items-center justify-center bg-placeholder text-xl">
          alumni work bubble
        </div>
        <div className="text-center">
          <Link href="/#projects" className={pillClass}>
            projects <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 text-center">
        <p className="text-xl">Interested?</p>
        <Link href="/#contact" className={`${pillClass} mt-3`}>
          contact us
        </Link>
      </section>
    </main>
  );
}
