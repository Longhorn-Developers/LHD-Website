"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";

const VIEWPORT = { once: true, amount: 0.2 } as const;

/** Central headline block: fades in and moves up first. */
export function HeroHeadline({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

type PopStickerProps = {
  src: string;
  width: number;
  height: number;
  /** Position/size/rotation classes, applied to the wrapper. */
  className?: string;
  /** Position in the stagger sequence (0 = first sticker). */
  order: number;
};

/** Sticker that springs into place, one after another, once the headline is in. */
export function PopSticker({
  src,
  width,
  height,
  className,
  order,
}: PopStickerProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.4 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 16,
        mass: 0.8,
        delay: 0.45 + order * 0.14,
      }}
    >
      <Image src={src} alt="" width={width} height={height} className="h-auto w-full" />
    </motion.div>
  );
}
