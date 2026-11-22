"use client";

import Image from "next/image";
import { useState } from "react";
import { CiPlay1, CiPause1 } from "react-icons/ci";


type Slide = {
  /** Path under /public, e.g. "/about_images/kickoff.jpg". Leave out for a grey placeholder. */
  src?: string;
  alt: string;
};

/*
 * ADD NEW IMAGES HERE.
 * Drop the file in public/about_images/ and add one line to this list.
 */
const SLIDES: Slide[] = [
  { alt: "Longhorn Developers event", src: "/home_page_images/ut_bevo_icon.png" },
  { alt: "Longhorn Developers event" },
  { alt: "Longhorn Developers event" },
  { alt: "Longhorn Developers event" },
  { alt: "Longhorn Developers event" },
  { alt: "Longhorn Developers event" },
];

/** Seconds each slide spends on screen; the whole loop scales with the list length. */
const SECONDS_PER_SLIDE = 4;

function SlideItems({ slides, hidden = false }: { slides: Slide[]; hidden?: boolean }) {
  return (
    <>
      {slides.map((slide, i) => (
        <li
          key={i}
          aria-hidden={hidden || !slide.src}
          className="relative mr-3 h-[180px] w-[70vw] shrink-0 overflow-hidden bg-placeholder sm:h-[260px] sm:w-[32vw]"
        >
          {slide.src && (
            <Image
              src={slide.src}
              alt={hidden ? "" : slide.alt}
              fill
              sizes="(min-width: 640px) 32vw, 70vw"
              // The strip scrolls on its own, so lazy-loading would make images
              // pop in as they slide into view. Preload the first few and fetch
              // the rest eagerly.
              priority={!hidden && i < 3}
              loading={!hidden && i < 3 ? undefined : "eager"}
              className="object-cover"
            />
          )}
        </li>
      ))}
    </>
  );
}

export default function Slideshow({ slides = SLIDES }: { slides?: Slide[] }) {
  const [playing, setPlaying] = useState(true);

  return (
    <section aria-roledescription="carousel" aria-label="Photos from Longhorn Developers">
      <div className="overflow-hidden">
        <ul
          className="slideshow-track flex w-max"
          style={{
            animationDuration: `${slides.length * SECONDS_PER_SLIDE}s`,
            animationPlayState: playing ? "running" : "paused",
          }}
        >
          {/* Rendered twice so the loop is seamless. */}
          <SlideItems slides={slides} />
          <SlideItems slides={slides} hidden />
        </ul>
      </div>

      <div className="px-4 pt-4 text-right sm:px-10 md:px-[8vw]">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-charcoal/10 cursor-pointer"
        >
          {playing ? (
            <CiPause1 />
          ) : (
            <CiPlay1 />
          )}
        </button>
      </div>
    </section>
  );
}
