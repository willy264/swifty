"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { primaryNavItems, secondaryNavItems } from "@/data/navigation";
import { setLenisInstance } from "@/lib/scroll";
import { useTelegramSession } from "@/providers";

import { DesktopSidebar } from "./DesktopSidebar";
import { MobileHeader } from "./MobileHeader";
import { DesktopHeader } from "./DesktopHeader";
import { MobileMenu } from "./MobileMenu";
import { SplashScreen } from "./SplashScreen";

gsap.registerPlugin(ScrollTrigger);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useTelegramSession();

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.1,
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.05,
    });

    setLenisInstance(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      setLenisInstance(null);
      ScrollTrigger.getAll().forEach((instance) => instance.kill());
    };
  }, { scope: containerRef });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setSearchExpanded(true);
        setTimeout(() => searchInputRef.current?.focus(), 150);
      }
      if (event.key === "Escape" && searchExpanded) {
        setSearchExpanded(false);
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchExpanded]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchExpanded(false);
      }
    };

    if (searchExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchExpanded]);

  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);

    const timer = setTimeout(() => setIsReady(true), 1500);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [formattedDate, setFormattedDate] = useState("");
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setFormattedDate(
        `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()} • ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`
      );
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  // Only show items in the sidebar that are NOT in the header
  const sidebarNavItems = secondaryNavItems;
  // All items for mobile menu
  const allNavItems = [...primaryNavItems, ...secondaryNavItems];
  const currentNavItem = allNavItems.find(item => item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)) || allNavItems[0];

  return (
    <div
      ref={containerRef}
      className="flex h-screen bg-bg-root font-sans overflow-hidden relative"
    >
      {/* Background Layer - The original Pattern */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Image
          src="/bg_security.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </motion.div>
      <div className="absolute inset-0 bg-bg-root/20 z-0 pointer-events-none" />

      {/* ── Splash Screen ── shown for first 1.5 s */}
      <AnimatePresence>
        {!isReady && <SplashScreen />}
      </AnimatePresence>

      <AnimatePresence>
        {isReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex h-full w-full relative z-10"
          >
            <DesktopSidebar 
              sidebarOpen={sidebarOpen} 
              setSidebarOpen={setSidebarOpen} 
              currentNavItem={currentNavItem} 
              sidebarNavItems={sidebarNavItems} 
            />

            <MobileHeader setMobileMenuOpen={setMobileMenuOpen} />

            {/* Main Content Area - Sliding over Sidebar area */}
            <motion.main
              initial={{ 
                opacity: 0, 
                x: isMobile ? 0 : 400, 
                y: isMobile ? 200 : 0 
              }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="flex-1 h-full flex flex-col relative z-20 min-w-0 pt-24 lg:pt-0"
            >
              <div className="w-full h-full bg-transparent backdrop-blur-md lg:rounded-l-[40px] max-md:rounded-t-[32px] border-l-2 lg:border-y-2 border-t-2 border-white/10 shadow-[20px_0_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative">
                
                <DesktopHeader 
                  searchExpanded={searchExpanded} 
                  setSearchExpanded={setSearchExpanded} 
                  searchContainerRef={searchContainerRef} 
                  searchInputRef={searchInputRef} 
                  primaryNavItems={primaryNavItems} 
                  formattedDate={formattedDate} 
                  user={user} 
                />

                {/* Content Viewport */}
                <div 
                  className="flex-1 overflow-y-auto px-6 lg:px-12 py-12 lg:py-12 no-scrollbar"
                  data-lenis-prevent
                >
                  <div className="max-w-7xl mx-auto flex flex-col w-full h-full">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        {children}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.main>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileMenu 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        user={user} 
        allNavItems={allNavItems} 
      />
    </div>
  );
}
