"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
}

export const AnimatedSection = ({
  children,
  className,
  delay = 0,
  immediate = false,
}: AnimatedSectionProps) => {
  if (immediate) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.section>
  );
};
