import Logo from "./Logo";
import {
  DiscordIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
} from "./SocialIcons";

// TODO: replace with real links once handles are confirmed.
const SOCIALS = [
  { href: "#", label: "Discord", Icon: DiscordIcon },
  { href: "#", label: "Instagram", Icon: InstagramIcon },
  { href: "#", label: "LinkedIn", Icon: LinkedInIcon },
  { href: "https://github.com/Longhorn-Developers", label: "GitHub", Icon: GitHubIcon },
];

// TODO: placeholder columns from the wireframe.
const COLUMNS = Array.from({ length: 3 }, () => ({
  title: "Products",
  links: ["Lorem Ipsum", "Dolor Sit Amet", "Lorem Ipsum"],
}));

export default function Footer() {
  return (
    <footer className="text-white">
      <div className="bg-burnt-orange">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-10 md:flex-row md:justify-between">
          <div className="flex flex-col gap-5">
            <Logo variant="dark" className="text-lg" />
            <ul className="flex gap-3">
              {SOCIALS.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href} aria-label={label} className="block hover:opacity-80">
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-8 md:gap-10">
            {COLUMNS.map((col, i) => (
              <div key={i}>
                <h3 className="mb-3 text-xs font-semibold">{col.title}</h3>
                <ul className="space-y-2.5 text-xs">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="hover:underline">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="bg-ut-orange py-1.5 text-center text-[11px]">
        Made with love, by Longhorn Developers
      </p>
    </footer>
  );
}
