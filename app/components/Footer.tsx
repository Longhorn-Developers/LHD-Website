import Logo from "./Logo";
import {
  DiscordIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
} from "./SocialIcons";


// TODO: replace with real links once handles are confirmed.
const SOCIALS = [
  { href: "https://discord.com/invite/S3dFjY8QBt?fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAacJXMmvnWxN-EyZtbBIsOsAvvHeN_E6DUibbWyCSZ8u1KkXyxocceKNWzjr9w_aem_Og9t3DRg0ZcivcxtnoKUAQ", label: "Discord", Icon: DiscordIcon },
  { href: "https://www.instagram.com/longhorndevelopers/", label: "Instagram", Icon: InstagramIcon },
  { href: "https://www.linkedin.com/company/longhorn-developers/", label: "LinkedIn", Icon: LinkedInIcon },
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
                  <a href={href} aria-label={label} className="block rounded-full hover:opacity-80" target="_blank">
                    <Icon className="size-6 font-light" />
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
