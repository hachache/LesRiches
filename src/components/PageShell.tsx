"use client";

import { MotionConfig, motion, useReducedMotion } from "motion/react";

export function PageShell({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
      <motion.div
        id="contenu"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38 }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
