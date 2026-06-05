"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  GripHorizontal,
  Search,
  ArrowRight,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { primaryNavItems, secondaryNavItems } from "@/data/navigation";
import { setLenisInstance } from "@/lib/scroll";
import { useTelegramSession } from "@/providers";

gsap.registerPlugin(ScrollTrigger);

function TopNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`relative px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-bold transition-colors duration-200 group ${
        isActive ? "text-accent" : "text-text-muted hover:text-white"
      }`}
    >
      <span className="relative z-10">{label}</span>
      {isActive && (
        <motion.div
          layoutId="nav-underline"
          className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent z-0"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);
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
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
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

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

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
          src="/squad_dark_bg.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </motion.div>
      <div className="absolute inset-0 bg-bg-root/50 z-0 pointer-events-none" />

      <AnimatePresence>
        {isReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex h-full w-full relative z-10"
          >
            {/* Transparent Sidebar area (Desktop) */}
            <aside
              className={`hidden lg:flex shrink-0 relative flex-col z-10 transition-all duration-500 ease-[0.16, 1, 0.3, 1] ${
                sidebarOpen ? "w-[340px]" : "w-[100px]"
              }`}
            >
              <div className="p-8 flex flex-col h-full">
                <div className={`flex items-center ${sidebarOpen ? "justify-between" : "justify-center"}`}>
                  {sidebarOpen ? (
                    <h1 className="font-display font-bold text-2xl tracking-tighter text-white flex items-center gap-2">
                      <Shield size={22} className="text-accent" />
                      <span>GUARD</span>
                    </h1>
                  ) : (
                    <Shield size={24} className="text-accent" />
                  )}
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-white transition-colors"
                  >
                    <GripHorizontal size={18} />
                  </button>
                </div>

                <nav className="mt-20 flex flex-col gap-2">
                  <p className={`text-[10px] font-bold text-text-muted uppercase tracking-[0.25em] mb-4 ${!sidebarOpen && "text-center"}`}>
                    {sidebarOpen ? "Navigation" : "•"}
                  </p>
                  {allNavItems.map((item) => {
                    const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center gap-4 p-3.5 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? "bg-accent text-black font-bold shadow-[0_0_20px_rgba(0,209,255,0.2)]" 
                            : "text-text-sub hover:bg-white/[0.08] hover:text-white"
                        } ${!sidebarOpen && "justify-center"}`}
                      >
                        <item.icon size={18} className={isActive ? "text-black" : "text-text-muted group-hover:text-accent transition-colors"} />
                        {sidebarOpen && (
                          <span className="text-[11px] uppercase tracking-widest font-bold">
                            {item.label}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-auto">
                  <div className={`flex items-center gap-4 ${!sidebarOpen && "flex-col"}`}>
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-white">
                        {user?.username?.slice(0, 2).toUpperCase() ?? "GD"}
                      </span>
                    </div>
                    {sidebarOpen && (
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">@{user?.username ?? "demo"}</p>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Authorized operative</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            {/* Mobile Header (Floating) */}
            <div className="lg:hidden fixed inset-x-0 top-4 z-[50] px-4 sm:px-6">
              <div className="mx-auto max-w-[800px]">
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-bg-surface border-2 border-border flex items-center justify-center shrink-0">
                      <Shield size={20} className="text-accent" />
                    </div>
                    <span>
                      <span className="block text-xl font-bold tracking-tighter text-white">GUARD</span>
                      <span className="block text-[0.6rem] uppercase tracking-[0.2em] text-text-muted font-bold">SWIFTYDROP</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-border bg-bg-surface text-white transition duration-300"
                  >
                    <Menu size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area - Sliding over Sidebar area */}
            <motion.main
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="flex-1 h-full flex flex-col relative z-20 min-w-0 pt-24 lg:pt-0"
            >
              <div className="w-full h-full bg-bg-root/80 backdrop-blur-[40px] lg:rounded-l-[40px] rounded-t-[32px] border-l-2 lg:border-y-2 border-t-2 border-border shadow-[20px_0_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative">
                
                {/* Desktop Panel Header */}
                <header className="hidden lg:flex h-20 shrink-0 border-b-2 border-border items-center justify-between px-10 bg-bg-root/40">
                  <div className="flex items-center gap-8 flex-1">
                    <div className="flex items-center flex-1 max-w-md relative group">
                      <Search size={16} className="absolute left-4 text-text-muted group-focus-within:text-accent transition-colors" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="SEARCH_COMMANDS..."
                        className="w-full bg-bg-surface border-2 border-border focus:border-accent pl-12 pr-4 py-2.5 rounded-lg text-xs font-bold tracking-widest text-white outline-none transition-all placeholder:text-text-muted"
                      />
                    </div>

                    <nav className="hidden xl:flex items-center gap-2">
                      {primaryNavItems.slice(0, 4).map((item) => (
                        <TopNavLink key={item.href} href={item.href} label={item.label} />
                      ))}
                    </nav>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em]">{formattedDate}</span>
                      <span className="text-[9px] font-mono text-accent">SYSTEM: SECURE</span>
                    </div>
                  </div>
                </header>

                {/* Content Viewport */}
                <div 
                  className="flex-1 overflow-y-auto px-6 lg:px-12 py-12 lg:py-12 no-scrollbar"
                  data-lenis-prevent
                >
                  <div className="max-w-7xl mx-auto">
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

      {/* Mobile Menu Overlay - Circular clip expansion */}
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
              <div className="p-6 border-b-2 border-border flex items-center justify-between bg-bg-surface">
                <div className="flex items-center gap-3">
                  <Shield size={24} className="text-accent" />
                  <span className="font-display font-bold text-xl text-white tracking-tighter">GUARD</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-bg-surface border-2 border-border rounded-xl text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
                {allNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-5 bg-bg-surface border-2 border-border rounded-xl text-white group active:bg-accent active:text-black transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <item.icon size={22} className="text-accent group-active:text-black" />
                      <span className="text-lg font-bold uppercase tracking-widest">{item.label}</span>
                    </div>
                    <ArrowRight size={20} className="text-text-muted group-active:text-black" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
