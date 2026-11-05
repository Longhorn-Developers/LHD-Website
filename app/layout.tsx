import type { Metadata } from "next";
import "./globals.css";

import { IBM_Plex_Mono, IBM_Plex_Sans, Staatliches } from "next/font/google";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const staatliches = Staatliches({
  variable: "--font-staatliches",
  subsets: ["latin"],
  weight: "400",
});

// Static export has no request headers, so the public URL comes from the
// build environment (set NEXT_PUBLIC_SITE_URL in Cloudflare Pages settings).
// CF_PAGES_URL is provided automatically on Pages builds as a fallback.
const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.CF_PAGES_URL ??
  "http://localhost:3000"
).replace(/\/$/, "");

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(baseUrl),
    // TODO: implement
    title: {
      default: "Longhorn Developers",
      template: "%s",
    },
    description:
      "A student-led open source community at UT Austin, building tools that bring a better campus experience.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plexSans.variable} ${plexMono.variable} ${staatliches.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
