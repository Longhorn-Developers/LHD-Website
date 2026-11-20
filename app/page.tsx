import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="overflow-hidden font-sans">
      {/* Hero */}
      <section
        className="relative min-h-[90vh] w-full overflow-hidden bg-[#f0eeee] px-4 sm:px-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(51,63,72,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(51,63,72,0.10) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      >
        <div className="relative flex min-h-[90vh] items-center justify-center px-6 py-14 text-center sm:py-16">
          <Image
            src="/lhd-original-sticker.png.png"
            alt=""
            width={300}
            height={90}
            className="hero-sticker-reveal absolute left-[3%] top-[4%] w-[125px] -rotate-6 sm:left-[4%] sm:top-[6%] sm:w-[180px] md:w-[210px] lg:w-[250px] xl:left-[5%] xl:top-[8%] xl:w-[330px]"
          />
          <Image
            src="/ut_tower_icon.png"
            alt=""
            width={180}
            height={180}
            className="hero-sticker-reveal hero-delay-1 absolute bottom-[19%] left-[2%] w-[90px] -rotate-6 sm:bottom-[18%] sm:left-[3%] sm:w-[125px] md:w-[145px] lg:w-[150px] xl:bottom-[25%] xl:left-[4%] xl:w-[215px]"
          />
          <Image
            src="/ut_cowboy_hat.png"
            alt=""
            width={180}
            height={180}
            className="hero-sticker-reveal hero-delay-2 absolute bottom-[5%] left-[12%] w-[100px] sm:bottom-[7%] sm:left-[14%] sm:w-[135px] md:w-[150px] xl:bottom-[8%] xl:w-[175px]"
          />
          <Image
            src="/ut_computer_icon.png"
            alt=""
            width={180}
            height={180}
            className="hero-sticker-reveal hero-delay-3 absolute bottom-[19%] right-[2%] w-[92px] -rotate-6 sm:bottom-[18%] sm:right-[3%] sm:w-[130px] md:w-[145px] lg:w-[150px] xl:bottom-[27%] xl:right-[5%] xl:w-[205px]"
          />
          <Image
            src="/ut_bevo_icon.png"
            alt=""
            width={180}
            height={180}
            className="hero-sticker-reveal hero-delay-4 absolute right-[3%] top-[5%] w-[90px] sm:right-[4%] sm:top-[7%] sm:w-[130px] md:w-[150px] xl:right-[7%] xl:w-[200px]"
          />

          <div className="relative z-10">
          <h1 className="hero-content-reveal font-display text-[44px] uppercase leading-[0.92] tracking-[0.01em] sm:text-[52px] md:text-[62px] lg:text-[66px] xl:text-[74px]">
            Built by Longhorns,
            <br />
            for Longhorns
          </h1>
          <p className="hero-content-reveal hero-delay-1 mx-auto mt-5 max-w-md text-sm leading-snug">
            A student-led open source community
            <br />
            building tools that bring a better campus experience
          </p>
          <a
            href="#projects"
            className="hero-content-reveal hero-delay-2 mt-5 inline-block bg-charcoal px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-burnt-orange"
          >
            See our work
          </a>
          </div>

          <Image
            src="/ut_hello_world.png"
            alt=""
            width={180}
            height={70}
            className="hero-sticker-reveal hero-delay-5 absolute bottom-[5%] right-[8%] w-[115px] sm:bottom-[6%] sm:right-[10%] sm:w-[150px] md:w-[175px] xl:bottom-[6%] xl:right-[12%] xl:w-[220px]"
          />
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="mx-auto grid w-full scroll-mt-4 items-center gap-10 px-4 py-16 sm:px-10 md:grid-cols-[0.95fr_1.05fr] md:px-[8vw] md:py-20"
      >
        <div>
          <h2 className="text-[28px] font-bold tracking-tight">
            For students, by students
          </h2>
          <p className="mt-4 max-w-[430px] text-sm leading-relaxed">
            Longhorn Developers brings together student developers to build open-source projects and tools for students, faculty and staff.
            <br /><br />
            We work with UT departments and Enterprise Technology, and maintain our projects for the long term.
          </p>
          <Link href="/about" className="mt-6 inline-block bg-charcoal px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-burnt-orange">
            About us ↗
          </Link>
        </div>
        <Image
          src="/for_student_by_student.png"
          alt="Longhorn Developers students"
          width={900}
          height={600}
          className="aspect-[16/9] w-full object-cover rounded-lg"
          priority
        />
      </section>

      {/* Selected Works */}
      <section id="projects" className="w-full scroll-mt-4 px-4 py-10 sm:px-10 md:px-[8vw] md:py-14">
        <div className="flex items-center justify-between">
          <h2 className="text-[26px] font-bold tracking-tight">Selected Works</h2>
          <a href="#" className="text-xs text-charcoal">See all projects ↗</a>
        </div>
        <ul className="mt-7 grid grid-cols-1 gap-4 xl:grid-cols-12">
          <li className="relative rounded-xl bg-[#f6f5f2] p-3 xl:col-span-7">
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
                src="/ut_registration_browser.png"
                alt="UT Registration Plus browser schedule"
                width={760}
                height={470}
                className="absolute bottom-0 left-1/2 w-[88%] -translate-x-1/2 rounded-t-[8px] object-contain xl:w-[85%]"
              />
              <Image
                src="/ut_registration_chrome_extension.jpg"
                alt="UT Registration Plus Chrome extension"
                width={1720}
                height={2200}
                className="absolute bottom-[-15%] left-[5%] z-10 w-[38%] rounded-t-[7px] object-contain shadow-[0_8px_18px_rgba(51,63,72,0.22)] sm:bottom-[-20%] sm:w-[34%] xl:bottom-[-25%] xl:w-[32%]"
              />
            </div>
          </li>
          <li className="relative rounded-xl bg-[#f6f5f2] p-3 xl:col-span-5">
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
                    src="/mobilize_ut_icon.png"
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
                    src="/mobilize_ut_phone.png"
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
          </li>
          <li className="relative rounded-xl bg-[#f6f5f2] p-3 xl:col-span-5">
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
                src="/bevo_illustration.png"
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
          </li>
          <li className="relative rounded-xl bg-[#f6f5f2] p-3 xl:col-span-7">
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
                src="/longhorn_loop_icon.png"
                alt=""
                width={406}
                height={512}
                className="absolute bottom-[18%] left-[11%] h-[48%] w-[10%] object-contain"
              />
              <p className="absolute bottom-[8%] left-[9%] text-base font-medium text-burnt-orange">
                Longhorn Loop
              </p>
              <Image
                src="/longhorn_loop_phone.png"
                alt="Longhorn Loop mobile app"
                width={441}
                height={332}
                className="absolute right-[2%] bottom-[-8%] w-[60%] object-contain xl:right-[9%]"
              />
            </div>
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section
        id="contact"
        className="mt-10 mb-0 px-4 py-16 text-center"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(51,63,72,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(51,63,72,0.07) 1px, transparent 1px), linear-gradient(to bottom, #ffffff 0%, #ffffff 55%, #f0eeee 100%)",
          backgroundSize: "70px 70px, 70px 70px, 100% 100%",
        }}
      >
        <h2 className="text-lg font-bold sm:text-xl">Interested in working with us?</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href="#" className="bg-charcoal px-5 py-2.5 text-xs text-white transition-colors hover:bg-burnt-orange">
            Become a Member
          </a>
          <a href="#" className="bg-charcoal px-5 py-2.5 text-xs text-white transition-colors hover:bg-burnt-orange">
            Partner With Us
          </a>
        </div>
      </section>
    </main>
  );
}
