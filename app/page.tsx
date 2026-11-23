import Link from "next/link";
import Image from "next/image";
import { HeroHeadline, PopSticker } from "./components/HeroReveal";
import Reveal from "./components/Reveal";
import { HOME_IMAGES } from "./images";


export default function Home() {
  return (
    <main className="overflow-hidden font-sans">
      {/* Hero */}
      <section
        className="relative min-h-[90vh] w-full overflow-hidden bg-[#EDEBE3] px-4 sm:px-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(51,63,72,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(51,63,72,0.10) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      >
        <div className="relative flex min-h-[90vh] items-center justify-center px-6 py-14 text-center sm:py-16">
          <PopSticker
            src={HOME_IMAGES.heroSticker}
            width={300}
            height={90}
            order={0}
            className="absolute left-[3%] top-[12%] w-[190px] -rotate-6 sm:left-[4%] sm:top-[6%] sm:w-[180px] md:w-[210px] lg:w-[250px] xl:left-[5%] xl:top-[8%] xl:w-[330px]"
          />
          <PopSticker
            src={HOME_IMAGES.utTower}
            width={180}
            height={180}
            order={1}
            className="absolute bottom-[19%] left-[2%] w-[110px] -rotate-6 sm:bottom-[18%] sm:left-[3%] sm:w-[125px] md:w-[145px] lg:w-[200px] lg:bottom-[37%] xl:bottom-[35%] xl:left-[4%] xl:w-[215px]"
          />
          <PopSticker
            src={HOME_IMAGES.cowboyHat}
            width={180}
            height={180}
            order={2}
            className="absolute bottom-[5%] left-[12%] w-[120px] sm:bottom-[7%] sm:left-[14%] sm:w-[135px] md:w-[145px] xl:bottom-[8%] xl:w-[175px]"
          />
          <PopSticker
            src={HOME_IMAGES.computerIcon}
            width={180}
            height={180}
            order={3}
            className="absolute bottom-[19%] right-[2%] w-[110px] -rotate-6 sm:bottom-[18%] sm:right-[3%] sm:w-[130px] md:w-[145px] lg:w-[150px] lg:bottom-[47%] xl:bottom-[40%] xl:right-[5%] xl:w-[205px]"
          />
          <PopSticker
            src={HOME_IMAGES.bevoIcon}
            width={180}
            height={180}
            order={4}
            className="absolute right-[3%] top-[12%] w-[140px] sm:right-[4%] sm:top-[7%] sm:w-[130px] md:w-[150px] xl:right-[7%] xl:w-[200px]"
          />

          <HeroHeadline className="relative z-10">
          <h1 className="font-display text-[44px] uppercase leading-[0.92] tracking-[0.01em] sm:text-[52px] md:text-[62px] lg:text-[66px] xl:text-[74px]">
            Built by Longhorns,
            <br />
            for Longhorns
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-snug">
            A student-led open source community
            <br />
            building tools that bring a better campus experience
          </p>
          <a
            href="#projects"
            className="mt-5 inline-block bg-charcoal px-5 py-2.5 text-sm font-light rounded-md text-white transition-colors hover:bg-burnt-orange"
          >
            See our work
          </a>
          </HeroHeadline>

          <PopSticker
            src={HOME_IMAGES.helloWorld}
            width={180}
            height={70}
            order={5}
            className="absolute bottom-[8%] right-[8%] w-[140px] sm:bottom-[6%] sm:right-[10%] sm:w-[150px] md:w-[175px] xl:bottom-[6%] xl:right-[12%] xl:w-[220px]"
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-b from-transparent to-white"
        />
      </section>

      {/* About */}
      <section
        id="about"
        className="mx-auto grid w-full scroll-mt-4 items-center gap-10 px-4 py-24 sm:px-10 md:grid-cols-[0.95fr_1.05fr] md:px-[8vw] md:py-32"
      >
        <Reveal>
          <h2 className="text-[36px] font-medium tracking-tight">
            For students, by students
          </h2>
          <p className="mt-4 max-w-[360px] text-base leading-relaxed">
            Longhorn Developers brings together student developers to build open-source projects and tools for students, faculty and staff.
            <br /><br />
            We work with UT departments and Enterprise Technology, and maintain our projects for the long term.
          </p>
          <Link href="/about" className="mt-6 inline-block bg-charcoal px-6 py-2.5 text-sm font-light rounded-md text-white transition-colors hover:bg-burnt-orange">
            About us ↗
          </Link>
        </Reveal>
        <Reveal delay={0.15}>
          <Image
            src={HOME_IMAGES.forStudents}
            alt="Longhorn Developers students"
            width={900}
            height={600}
            className="aspect-[16/9] w-full rounded-lg object-cover"
            priority
          />
        </Reveal>
      </section>

      {/* Selected Works */}
      <section id="projects" className="w-full scroll-mt-4 px-4 py-10 sm:px-10 md:px-[8vw] md:py-14">
        <Reveal className="flex items-center justify-between">
          <h2 className="text-[36px] font-medium tracking-tight">Selected Works</h2>
          <a href="#" className="text-xs text-charcoal hover:text-burnt-orange  transition-all duration-300">See all projects ↗</a>
        </Reveal>
        <ul className="mt-7 grid grid-cols-1 gap-4 xl:grid-cols-12">
          <Reveal as="li" className="relative rounded-xl bg-[#f6f5f2] p-3 xl:col-span-7 cursor-pointer hover:-translate-y-3 [transition-property:translate] duration-300 [backface-visibility:hidden]">
            <div className="mb-3 pr-12">
              <h3 className="text-xl font-semibold leading-tight tracking-tight">UT Registration Plus</h3>
              <p className="mt-1 text-base leading-tight text-charcoal/80">Stay on top of registration</p>
            </div>
            <a
              href="#"
              aria-label="View UT Registration Plus"
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-[4px] bg-charcoal text-base text-white"
            >
              ↗
            </a>
            <div
              className="relative aspect-[1.82/1] overflow-hidden rounded-lg bg-[#e5e4dc]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #c9c8c0 1px, transparent 1px), linear-gradient(to bottom, #c9c8c0 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            >
              <Image
                loading="eager"
                src={HOME_IMAGES.registrationBrowser}
                alt="UT Registration Plus browser schedule"
                width={760}
                height={470}
                className="absolute bottom-0 left-1/2 w-[88%] -translate-x-1/2 rounded-t-[8px] object-contain xl:w-[85%]"
              />
              <Image
                loading="eager"
                src={HOME_IMAGES.registrationExtension}
                alt="UT Registration Plus Chrome extension"
                width={1720}
                height={2200}
                className="absolute bottom-[-33%] sm:bottom-[-24%] md:bottom-[-24%] left-[5%] z-10 w-[38%] rounded-t-[7px] object-contain shadow-[0_8px_18px_rgba(51,63,72,0.22)] sm:w-[34%] xl:bottom-[-21%] xl:w-[32%]"
              />
            </div>
          </Reveal>
          <Reveal as="li" delay={0.08} className="relative rounded-xl bg-[#f6f5f2] p-3 xl:col-span-5 cursor-pointer hover:-translate-y-3 [transition-property:translate] duration-300 [backface-visibility:hidden]">
            <div className="mb-3 pr-12">
              <h3 className="text-xl font-semibold leading-tight">Mobilize UT</h3>
              <p className="mt-1 text-base text-charcoal/80">Accessibility, made easy</p>
            </div>
            <a href="#" aria-label="View Mobilize UT" className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-[4px] bg-charcoal text-base text-white">↗</a>
            <div
              className="relative h-[380px] overflow-hidden rounded-lg bg-[#f8971f] xl:h-[420px]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #d98010 1px, transparent 1px), linear-gradient(to bottom, #d98010 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            >
              <div className="absolute inset-0 grid grid-cols-2 items-center gap-4 pl-[5%]">
                <div className="flex translate-y-[0%] sm:translate-y-[-20%] flex-col items-end text-center text-white">
                  <Image
                    loading="eager"
                    src={HOME_IMAGES.mobilizeIcon}
                    alt=""
                    width={142}
                    height={142}
                    className="mb-2 w-[86%] max-w-[180px]"
                  />
                  <span className="w-[86%] max-w-[180px] whitespace-nowrap text-sm font-semibold sm:text-base translate-y-[-20px]">
                    Mobilize UT
                  </span>
                </div>
                <div className="flex h-full justify-end pt-[8%]">
                  <Image
                    loading="eager"
                    src={HOME_IMAGES.mobilizePhone}
                    alt="Mobilize UT mobile app preview"
                    width={141}
                    height={327}
                    className="w-[90%] max-w-[210px] object-contain"
                  />
                </div>
              </div>
              <span className="absolute bottom-[8%] right-[4%] z-20 flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-charcoal shadow">
                <span aria-hidden className="size-2 rounded-full bg-[#579d43]" />
                New Release
              </span>
            </div>
          </Reveal>
          <Reveal as="li" delay={0.16} className="relative rounded-xl bg-[#f6f5f2] p-3 xl:col-span-5 cursor-pointer hover:-translate-y-3 [transition-property:translate] duration-300 [backface-visibility:hidden]">
            <div className="mb-3 pr-12">
              <h3 className="text-xl font-semibold leading-tight">Pet Bevo</h3>
              <p className="mt-1 text-base text-charcoal/80">Lock in with Bevo</p>
            </div>
            <a href="#" aria-label="View Pet Bevo" className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-[4px] bg-charcoal text-base text-white">↗</a>
            <div
              className="relative h-[230px] overflow-hidden rounded-lg bg-[#579d43]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #488a37 1px, transparent 1px), linear-gradient(to bottom, #488a37 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            >
              <Image
                loading="eager"
                src={HOME_IMAGES.bevoIllustration}
                alt="Bevo illustration"
                width={354}
                height={122}
                className="absolute bottom-0 left-1/2 w-[55%] -translate-x-1/2 flex justify-center"
              />
              <span className="absolute bottom-2 right-3 flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs shadow">
                <span aria-hidden className="size-2 rounded-full bg-ut-orange" />
                In Beta
              </span>
            </div>
          </Reveal>
          <Reveal as="li" delay={0.24} className="relative rounded-xl bg-[#f6f5f2] p-3 xl:col-span-7 cursor-pointer hover:-translate-y-3 [transition-property:translate] duration-300 [backface-visibility:hidden]">
            <div className="mb-3 pr-12">
              <h3 className="text-xl font-semibold leading-tight">Longhorn Loop</h3>
              <p className="mt-1 text-base text-charcoal/80">Stay in the loop</p>
            </div>
            <a href="#" aria-label="View Longhorn Loop" className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-[4px] bg-charcoal text-base text-white">↗</a>
            <div
              className="relative h-[230px] overflow-hidden rounded-lg bg-[#ffd600]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #d6b800 1px, transparent 1px), linear-gradient(to bottom, #d6b800 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            >
              <Image
                loading="eager"
                src={HOME_IMAGES.longhornLoopIcon}
                alt=""
                width={406}
                height={512}
                className="absolute bottom-[18%] left-[11%] h-[48%] w-[10%] object-contain"
              />
              <p className="absolute bottom-[8%] left-[9%] text-base font-medium text-burnt-orange">
                Longhorn Loop
              </p>
              <Image
                loading="eager"
                src={HOME_IMAGES.longhornLoopPhone}
                alt="Longhorn Loop mobile app"
                width={441}
                height={332}
                className="absolute right-[2%] bottom-[-10%] w-[55%] object-contain xl:right-[9%]"
              />
            </div>
          </Reveal>
        </ul>
      </section>

      {/* CTA */}
      <section
        id="contact"
        className="relative isolate mt-10 mb-0 px-4 py-16 text-center"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(51,63,72,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(51,63,72,0.07) 1px, transparent 1px), linear-gradient(to bottom, #ffffff 0%, #ffffff 55%, #f0eeee 100%)",
          backgroundSize: "70px 70px, 70px 70px, 100% 100%",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-linear-to-b from-white to-transparent"
        />
        <Reveal as="h2" className="text-2xl font-medium tracking-tight sm:text-[28px]">
          Interested in working with us?
        </Reveal>
        <Reveal delay={0.15} className="mt-8 flex flex-wrap justify-center gap-4">
          <a href="#" className="bg-charcoal px-6 py-3 text-sm text-white transition-colors hover:bg-burnt-orange rounded-md">
            Become a Member
          </a>
          <a href="#" className="bg-charcoal px-6 py-3 text-sm text-white transition-colors hover:bg-burnt-orange rounded-md">
            Partner With Us
          </a>
        </Reveal>
      </section>
    </main>
  );
}
