import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="font-sans">
      <section
        className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#f0eeee] px-4 py-16 text-center sm:px-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(51,63,72,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(51,63,72,0.10) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      >
        <Image
          src="/ut_tower_icon.png"
          alt=""
          width={180}
          height={180}
          className="not-found-float absolute right-[5%] top-[8%] w-[90px] -rotate-6 opacity-80 sm:right-[8%] sm:top-[12%] sm:w-[140px] md:w-[180px]"
        />
        <Image
          src="/ut_bevo_icon.png"
          alt=""
          width={180}
          height={180}
          className="not-found-float not-found-float-delay-1 absolute left-[5%] top-[10%] w-[58px] rotate-6 opacity-80 sm:left-[8%] sm:top-[12%] sm:w-[100px] md:w-[140px]"
        />
        <Image
          src="/ut_cowboy_hat.png"
          alt=""
          width={180}
          height={180}
          className="not-found-float not-found-float-delay-2 absolute bottom-[10%] left-[8%] w-[68px] -rotate-6 opacity-80 sm:bottom-[12%] sm:left-[14%] sm:w-[115px] md:w-[150px]"
        />
        <Image
          src="/ut_computer_icon.png"
          alt=""
          width={180}
          height={180}
          className="not-found-float not-found-float-delay-3 absolute bottom-[9%] right-[7%] w-[64px] rotate-6 opacity-80 sm:bottom-[12%] sm:right-[13%] sm:w-[110px] md:w-[145px]"
        />
        <Image
          src="/ut_hello_world.png"
          alt=""
          width={180}
          height={70}
          className="not-found-float not-found-float-delay-1 absolute right-[5%] top-[28%] hidden w-[90px] -rotate-6 opacity-80 sm:block sm:right-[7%] sm:top-[32%] sm:w-[135px] md:w-[180px]"
        />
        <div className="relative z-10 max-w-2xl">
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-burnt-orange">
            404 error
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-[0.95] sm:text-6xl md:text-7xl">
            Page not found.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-charcoal">
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="bg-charcoal px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-burnt-orange"
            >
              Back to home
            </Link>
            <Link
              href="/#projects"
              className="border border-charcoal px-5 py-3 text-sm font-semibold text-charcoal transition-colors hover:bg-charcoal hover:text-white"
            >
              Explore our work ↗
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
