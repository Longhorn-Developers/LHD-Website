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
        className="block bg-ut-orange py-2 text-center text-xs font-semibold text-black hover:underline"
      >
        NOW RECRUITING FELLOWS! Apply by May 09th - July 21st
      </Link>
      <div className="mx-auto flex min-h-[82px] w-full items-center justify-between px-5 sm:px-10 md:px-[8vw]">
        <Link href="/" aria-label="Longhorn Developers home">
          <Image
            src="/lhdlogo.png"
            alt="Longhorn Developers"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
        </Link>
        <nav>
          <ul className="flex gap-4 text-sm text-charcoal sm:gap-6">
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
