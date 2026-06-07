"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GripHorizontal } from "lucide-react";

export function MobileHeader({ setMobileMenuOpen }: { setMobileMenuOpen: (v: boolean) => void }) {
  return (
    <div className="lg:hidden fixed inset-x-0 top-4 z-[50] px-4 sm:px-6">
      <div className="mx-auto max-w-[800px]">
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-bg-surface/80 backdrop-blur-xl border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
              <Image src="/guard_logo.png" alt="Logo" width={28} height={28} className="object-contain" />
            </div>
            <span>
              <span className="block text-lg font-bold tracking-tighter text-white">SWIFTYGUARD</span>
              <span className="block text-[0.55rem] uppercase tracking-[0.2em] text-text-muted font-bold">Airdrop Security</span>
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileMenuOpen(true)}
            className="relative flex h-11 w-11 items-center justify-center text-accent transition duration-300 group outline-none"
          >
            <div className="absolute inset-0 z-0 pointer-events-none">
              <svg
                className="w-full h-full text-accent overflow-visible"
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M 10,20 Q 5,10 20,5 Q 35,0 50,5 Q 65,0 80,5 Q 95,10 90,20 Q 95,30 80,35 Q 65,40 50,35 Q 35,40 20,35 Q 5,30 10,20 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </svg>
            </div>
            <GripHorizontal size={18} className="relative z-10" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
