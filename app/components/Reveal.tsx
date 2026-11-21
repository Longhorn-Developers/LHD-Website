"use client";

import { motion } from "motion/react";
import type { ComponentProps } from "react";

type Tag = "div" | "li" | "section" | "h2" | "p";

type RevealProps = ComponentProps<typeof motion.div> & {
  as?: Tag;
  delay?: number;
};

/** Fades and slides its children upwards once they scroll into view. */
export default function Reveal({
  as = "div",
  delay = 0,
  children,
  ...rest
}: RevealProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}
