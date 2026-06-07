"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function TopNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link href={href} className="outline-none group block">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-bold transition-colors duration-200 flex items-center justify-center ${
          isActive ? "text-accent" : "text-text-muted group-hover:text-white"
        }`}
      >
        <span className="relative z-10 inline-block whitespace-nowrap">
          {label}
          {isActive && (
            <motion.div
              layoutId="nav-active-zigzag"
              className="absolute inset-0 pointer-events-none overflow-visible"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            >
              {/* Top zigzag */}
              <svg className="absolute -top-2.5 left-0 w-full h-[6px] text-accent overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 10">
                <motion.path
                  d="M 0,8 L 15,2 L 30,8 L 45,2 L 60,8 L 75,2 L 90,8 L 100,2"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }}
                />
              </svg>
              {/* Bottom zigzag */}
              <svg className="absolute -bottom-2.5 left-0 w-full h-[6px] text-accent overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 10">
                <motion.path
                  d="M 0,2 L 15,8 L 30,2 L 45,8 L 60,2 L 75,8 L 90,2 L 100,8"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
                />
              </svg>
            </motion.div>
          )}
        </span>
      </motion.div>
    </Link>
  );
}
