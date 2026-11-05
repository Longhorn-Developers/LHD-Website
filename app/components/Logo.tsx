import Image from "next/image";

type LogoProps = {
  /** "light" for white backgrounds, "dark" for burnt-orange backgrounds. */
  variant?: "light" | "dark";
  className?: string;
};

export default function Logo({ variant = "light", className = "" }: LogoProps) {
  const color = variant === "light" ? "text-charcoal" : "text-white";

  return (
    <span
      className={`font-display inline-flex items-center gap-1.5 leading-none ${color} ${className}`}
    >
      <span aria-hidden className="text-[2.4em] -mt-[0.1em]">
        {"{"}
      </span>
      {/* Crop the square logo down to the hand mark. */}
      <span
        aria-hidden
        className="relative h-[1.6em] w-[1.3em] overflow-hidden rounded-[3px]"
      >
        <Image
          src="/lhdlogo.png"
          alt=""
          width={512}
          height={512}
          className="absolute left-1/2 top-1/2 h-[3.4em] w-[3.4em] max-w-none -translate-x-1/2 -translate-y-1/2"
        />
      </span>
      <span className="text-[1.25em] tracking-tight">Longhorn Developers</span>
      <span aria-hidden className="text-[2.4em] -mt-[0.1em]">
        {"}"}
      </span>
    </span>
  );
}
