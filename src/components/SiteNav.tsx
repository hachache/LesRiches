"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

const navItems: ReadonlyArray<{ label: string; href: string; mobileHidden?: boolean }> = [
  { label: "Comparer", href: "/comparateur" },
  { label: "Fortunes", href: "/milliardaires" },
  { label: "Méthodologie", href: "/methodologie", mobileHidden: true },
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, { stiffness: 180, damping: 36, mass: 0.25 });

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(8,8,7,0.94)] text-white backdrop-blur-xl">
      <nav aria-label="Navigation principale" className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="L'Écart, accueil"
          className="group inline-flex items-center gap-2.5 font-mono text-sm font-semibold tracking-[0.08em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
        >
          <motion.span
            aria-hidden="true"
            className="h-6 w-1 bg-[var(--accent)]"
            animate={reduce ? undefined : { scaleY: pathname === "/" ? 1 : 0.72 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
          />
          L'ÉCART
        </Link>

        <div className="flex items-center gap-1 text-xs font-semibold sm:text-sm">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`${item.mobileHidden ? "hidden sm:inline-flex" : "inline-flex"} relative h-10 items-center rounded-full px-3 text-white/68 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
              >
                {active ? (
                  <motion.span
                    layoutId="active-navigation"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      {reduce ? null : (
        <motion.span
          aria-hidden="true"
          style={{ scaleX: smoothScrollProgress }}
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-[var(--accent)]"
        />
      )}
    </header>
  );
}
