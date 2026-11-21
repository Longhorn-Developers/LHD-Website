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

export default function Footer() {
  return (
    <footer className="text-white">
      <div className="bg-burnt-orange py-8">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-4 sm:px-10">
          <Logo variant="dark" className="text-lg" />
          <ul className="flex gap-3">
              {SOCIALS.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href} aria-label={label} className="block rounded-full hover:opacity-80">
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <p className="bg-ut-orange py-1.5 text-center text-[11px] text-black font-bold">
        Made with ❤️, by Longhorn Developers
      </p>
    </footer>
  );
}
