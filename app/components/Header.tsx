import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/#projects", label: "Our projects" },
  { href: "/#contact", label: "Contact Us" },
];

export default function Header() {
  return (
    <header>
      <Link
        href="/#contact"
        className="block bg-ut-orange py-2.5 text-center text-sm font-semibold sm:text-base text-black hover:underline"
      >
        NOW RECRUITING FELLOWS! Apply by May 09th - July 21st
      </Link>
      <div className="mx-auto flex min-h-[100px] w-full bg-[#EDEBE3] items-center justify-between px-5 sm:px-10 md:px-[8vw]">
        <Link href="/" aria-label="Longhorn Developers home">
          <Image
            src="/lhdlogo.png"
            alt="Longhorn Developers"
            width={64}
            height={64}
            className="h-16 w-16 object-contain rounded-sm"
          />
        </Link>
        <nav>
          <ul className="flex gap-5 text-base font-medium text-charcoal sm:gap-8 sm:text-lg">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-burnt-orange">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
