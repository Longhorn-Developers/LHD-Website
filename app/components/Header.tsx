import Link from "next/link";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "/about", label: "Who We Are" },
  { href: "/#projects", label: "Our Projects" },
  { href: "/#contact", label: "Contact Us" },
];

export default function Header() {
  return (
    <header>
      <Link
        href="/#contact"
        className="block bg-ut-orange py-1.5 text-center text-sm font-semibold text-white hover:underline"
      >
        Now Recruiting Fellows!
      </Link>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-10">
        <Link href="/" aria-label="Longhorn Developers home">
          <Logo className="text-base sm:text-lg" />
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
