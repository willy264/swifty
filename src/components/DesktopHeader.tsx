"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { TopNavLink } from "./TopNavLink";

interface DesktopHeaderProps {
  searchExpanded: boolean;
  setSearchExpanded: (v: boolean) => void;
  searchContainerRef: React.RefObject<HTMLDivElement | null>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  primaryNavItems: any[];
  formattedDate: string;
  user: any;
}

export function DesktopHeader({ 
  searchExpanded, 
  setSearchExpanded, 
  searchContainerRef, 
  searchInputRef, 
  primaryNavItems, 
  formattedDate, 
  user 
}: DesktopHeaderProps) {
  return (
    <header className="hidden lg:flex h-20 shrink-0 border-b-2 border-border items-center justify-between px-10 bg-bg-root/40">
      <div className="flex items-center gap-6 flex-1">
        {/* Animated Search */}
        <div ref={searchContainerRef} className="flex items-center relative">
          <motion.div
            animate={{
              width: searchExpanded ? 360 : 40,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center h-10"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                setSearchExpanded(!searchExpanded);
                if (!searchExpanded) {
                  setTimeout(() => searchInputRef.current?.focus(), 200);
                }
              }}
              className={`absolute -left-2 top-0 w-10 h-10 flex items-center justify-center z-10 transition-colors duration-300 outline-none group ${
                searchExpanded
                  ? "text-accent"
                  : "text-accent hover:text-white"
              }`}
            >
              <div className="absolute -left-1 -right-1 inset-0 z-0 pointer-events-none">
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
              <Search size={15} className="relative z-10" />
            </motion.button>
            <motion.div
              animate={{ opacity: searchExpanded ? 1 : 0 }}
              transition={{ duration: 0.2, delay: searchExpanded ? 0.15 : 0 }}
              className="absolute inset-0"
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search commands... ⌘K"
                className="w-full h-full backdrop-blur-xl border-b-2 border-accent focus:border-accent/50 pl-11 pr-4 text-xs font-medium tracking-wider text-white outline-none transition-all placeholder:text-text-muted/60"
                onBlur={() => {
                  setTimeout(() => {
                    if (!searchContainerRef.current?.contains(document.activeElement)) {
                      setSearchExpanded(false);
                    }
                  }, 100);
                }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Header Nav - primary items only */}
        <nav className="hidden xl:flex items-center gap-1">
          {primaryNavItems.map((item) => (
            <TopNavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em]">{formattedDate}</span>
          <span className="text-[9px] font-mono text-accent/80">SYSTEM: SECURE</span>
        </div>
        
        {/* Profile Section */}
        <div className="flex items-center gap-3 pl-5 border-l border-white/[0.06]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center shrink-0 overflow-hidden">
            <span className="text-xs font-bold text-accent">
              {user?.username?.slice(0, 2).toUpperCase() ?? "GD"}
            </span>
          </div>
          <div className="hidden xl:block min-w-0 pr-1">
            <p className="text-sm font-semibold text-white truncate">@{user?.username ?? "demo"}</p>
            <p className="text-[9px] text-text-muted font-bold uppercase tracking-[0.12em]">Operative</p>
          </div>
        </div>
      </div>
    </header>
  );
}
