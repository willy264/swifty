"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GripHorizontal, Folder } from "lucide-react";

interface DesktopSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentNavItem: any;
  sidebarNavItems: any[];
}

export function DesktopSidebar({ sidebarOpen, setSidebarOpen, currentNavItem, sidebarNavItems }: DesktopSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`hidden lg:flex shrink-0 relative flex-col z-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        sidebarOpen ? "w-[350px]" : "w-[80px]"
      }`}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Logo & Toggle */}
        <div className={`flex ${sidebarOpen ? "items-center justify-between" : "flex-col items-center gap-4 justify-center"}`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-2.5">
              <Image src="/guard_logo.png" alt="Logo" width={30} height={30} className="object-contain" />
              <h1 className="font-display font-bold text-xl tracking-tighter text-white">
                SWIFTYGUARD
              </h1>
            </div>
          ) : (
            <Image src="/guard_logo.png" alt="Logo" width={26} height={26} className="object-contain" />
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`relative flex items-center justify-center text-accent outline-none group ${sidebarOpen ? "w-20 h-10" : " w-16 h-8"}`}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
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
            <GripHorizontal size={20} className="relative z-10" />
          </motion.button>
        </div>

        {/* Dynamic Title and Description in Sidebar */}
        <div className="flex-1 flex flex-col justify-start mt-32 mb-4">
          {sidebarOpen && (
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-[42px] leading-[1.1] font-display font-bold uppercase text-white mb-3 tracking-tight">
                  {currentNavItem?.label}
                </h1>
                <div className="flex items-start gap-2 text-white/80">
                  <Folder size={14} className="mt-1 shrink-0" />
                  <span className="text-xs tracking-wide font-medium leading-relaxed">{currentNavItem?.description}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Sidebar Nav - Only items NOT in header, pushed to bottom */}
        <nav className={`mt-auto flex justify-center gap-1.5 pb-8 ${sidebarOpen ? "flex-row w-full" : "flex-col items-center"}`}>
          {sidebarNavItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!sidebarOpen ? item.label : undefined}
                className={`group relative outline-none block ${sidebarOpen ? "flex-1" : "w-12 h-12"}`}
              >
                <motion.div
                  whileHover={{ scale: 1.05, color: "#00D1FF" }}
                  whileTap={{ scale: 0.92 }}
                  className={`relative flex items-center justify-center transition-all duration-300 w-full h-full ${
                    sidebarOpen ? "py-3 px-1" : ""
                  } ${
                    isActive
                      ? "text-accent font-bold"
                      : "text-white/70"
                  }`}
                >
                  {/* Sketchy Cloud for Active State */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-cloud"
                      className="absolute -left-2 -right-2 inset-0 z-0 pointer-events-none"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
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
                    </motion.div>
                  )}
                  <div className="relative z-10 flex items-center justify-center w-full h-full">
                    {sidebarOpen ? (
                      <span className="text-[10px] uppercase tracking-widest font-semibold whitespace-nowrap truncate px-1 text-center">
                        {item.label}
                      </span>
                    ) : (
                      <item.icon size={18} className={isActive ? "text-accent" : "text-white/60 group-hover:text-white"} />
                    )}
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
