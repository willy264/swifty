"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";

interface MobileMenuProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  user: any;
  allNavItems: any[];
}

export function MobileMenu({ mobileMenuOpen, setMobileMenuOpen, user, allNavItems }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[98] bg-black/40 backdrop-blur-md lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <motion.div
            initial={{
              opacity: 0,
              clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)",
            }}
            animate={{
              opacity: 1,
              clipPath: "circle(160% at calc(100% - 2.5rem) 2.5rem)",
            }}
            exit={{
              opacity: 0,
              clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)",
            }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[99] bg-bg-root flex flex-col lg:hidden"
          >
            <div className="p-6 border-b border-white/[0.06] flex items-center justify-between bg-bg-surface/50 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Image src="/swifty_logo.png" alt="Logo" width={28} height={28} className="object-contain" />
                <span className="font-display font-bold text-lg text-white tracking-tighter">SWIFTYGUARD</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile Profile Section */}
            <div className="p-6 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-accent">
                    {user?.username?.slice(0, 2).toUpperCase() ?? "GD"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-white truncate">@{user?.username ?? "demo"}</p>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Authorized operative</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
              {allNavItems.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block outline-none"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      className={`relative flex items-center justify-between p-4 transition-all duration-200 group ${
                        isActive
                          ? "text-accent"
                          : "text-white/80"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 z-0 pointer-events-none">
                          <svg
                            className="w-full h-full text-accent overflow-visible opacity-70"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                          >
                            <motion.path
                              d="M 2,10 Q 50,0 98,5 Q 100,50 97,95 Q 50,100 5,95 Q 0,50 2,10 Z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              vectorEffect="non-scaling-stroke"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          </svg>
                        </div>
                      )}
                      <div className="relative z-10 flex items-center gap-4">
                        <item.icon size={20} className={`${isActive ? "text-accent" : "text-white/40 group-hover:text-white"}`} />
                        <div>
                          <span className={`text-sm font-bold uppercase tracking-widest block ${isActive ? "text-accent" : "text-white group-hover:text-white"}`}>{item.label}</span>
                          <span className={`text-[10px] font-medium mt-0.5 block ${isActive ? "text-accent/70" : "text-text-muted"}`}>{item.description}</span>
                        </div>
                      </div>
                      <ArrowRight size={16} className={`relative z-10 shrink-0 ${isActive ? "text-accent" : "text-text-muted group-hover:text-white"}`} />
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
