import Image from "next/image";
import Link from "next/link";

export function ClubBrand({
  footer = false,
}: {
  footer?: boolean;
}) {
  return (
    <Link
      className={`brand${footer ? " footer-brand" : ""}`}
      href="/"
      aria-label="Longhorn Developers home"
    >
      <span className="brand-logo">
        <Image
          src="/lhdlogo.png"
          alt=""
          width={512}
          height={512}
          sizes="42px"
          unoptimized
        />
      </span>
      <span>Longhorn Developers</span>
    </Link>
  );
}
