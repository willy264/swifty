"use client";

import { motion } from "framer-motion";

export function SplashScreen() {
  return (
    <motion.div
      key="splash"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 40%, #1A1030 0%, #0A0515 70%)" }}
    >
      {/* ── Background hex grid ── */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hexgrid" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
            <path
              d="M28 66L0 50V16L28 0L56 16V50L28 66ZM28 100L0 84V50L28 34L56 50V84L28 100Z"
              fill="none"
              stroke="#7B3FBF"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <motion.rect
          width="100%"
          height="100%"
          fill="url(#hexgrid)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
      </svg>

      {/* ── Floating particles ── */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute w-1 h-1 rounded-full bg-accent/40"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      {/* ── Central SVG composition ── */}
      <div className="relative flex items-center justify-center w-[280px] h-[280px] sm:w-[340px] sm:h-[340px]">
        
        {/* Outer orbital ring 1 */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 340">
          <motion.circle
            cx="170" cy="170" r="160"
            fill="none"
            stroke="url(#ringGrad1)"
            strokeWidth="0.8"
            strokeDasharray="8 12"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "170px 170px" }}
          />
          <defs>
            <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7B3FBF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#2EECC7" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Outer orbital ring 2 (counter-rotating) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 340">
          <motion.circle
            cx="170" cy="170" r="145"
            fill="none"
            stroke="url(#ringGrad2)"
            strokeWidth="0.6"
            strokeDasharray="4 18"
            initial={{ rotate: 0 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "170px 170px" }}
          />
          <defs>
            <linearGradient id="ringGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2EECC7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#9B5FE0" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Orbiting dot */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 340">
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "170px 170px" }}
          >
            <circle cx="170" cy="10" r="3" fill="#2EECC7" opacity="0.9" />
            <circle cx="170" cy="10" r="8" fill="#2EECC7" opacity="0.15" />
          </motion.g>
        </svg>

        {/* ── Shield SVG ── */}
        <svg
          viewBox="0 0 200 240"
          className="relative z-10 w-[120px] h-[144px] sm:w-[140px] sm:h-[168px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Shield gradient */}
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9B5FE0" />
              <stop offset="50%" stopColor="#7B3FBF" />
              <stop offset="100%" stopColor="#5A2D8E" />
            </linearGradient>
            <linearGradient id="shieldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2EECC7" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#7B3FBF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#2EECC7" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2EECC7" />
              <stop offset="100%" stopColor="#1CC4A0" />
            </linearGradient>
            {/* Inner glow filter */}
            <filter id="innerGlow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur" />
              <feFlood floodColor="#2EECC7" floodOpacity="0.15" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Outer glow */}
            <filter id="outerGlow">
              <feGaussianBlur stdDeviation="6" />
              <feFlood floodColor="#7B3FBF" floodOpacity="0.4" />
              <feComposite in2="SourceAlpha" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Clip for scan line */}
            <clipPath id="shieldClip">
              <path d="M100 10 L185 50 L185 140 Q185 190 100 230 Q15 190 15 140 L15 50 Z" />
            </clipPath>
          </defs>

          {/* Shield background fill */}
          <motion.path
            d="M100 10 L185 50 L185 140 Q185 190 100 230 Q15 190 15 140 L15 50 Z"
            fill="url(#shieldGrad)"
            fillOpacity="0.15"
            filter="url(#outerGlow)"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "100px 120px" }}
          />

          {/* Shield outline (draw-on) */}
          <motion.path
            d="M100 10 L185 50 L185 140 Q185 190 100 230 Q15 190 15 140 L15 50 Z"
            fill="none"
            stroke="url(#shieldStroke)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
          />

          {/* Inner shield detail lines */}
          <motion.path
            d="M100 30 L170 62 L170 138 Q170 180 100 214 Q30 180 30 138 L30 62 Z"
            fill="none"
            stroke="#2EECC7"
            strokeWidth="0.5"
            strokeOpacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.0, ease: "easeInOut", delay: 0.6 }}
          />

          {/* Center horizontal divider */}
          <motion.line
            x1="30" y1="120" x2="170" y2="120"
            stroke="#2EECC7"
            strokeWidth="0.5"
            strokeOpacity="0.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          />

          {/* Checkmark */}
          <motion.path
            d="M65 120 L90 148 L140 88"
            fill="none"
            stroke="url(#checkGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#innerGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.9 }}
          />

          {/* Scanning line */}
          <motion.rect
            x="15"
            width="170"
            height="3"
            fill="#2EECC7"
            opacity="0.2"
            clipPath="url(#shieldClip)"
            initial={{ y: 10 }}
            animate={{ y: 230 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
          />
        </svg>

        {/* Pulsing glow behind shield */}
        <motion.div
          className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(123,63,191,0.25) 0%, rgba(46,236,199,0.05) 60%, transparent 80%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ── Text ── */}
      <div className="relative z-10 mt-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="font-display font-bold text-3xl sm:text-4xl tracking-tighter text-white"
        >
          SWIFTY
          <span className="bg-gradient-to-r from-purple-bright to-accent bg-clip-text text-transparent">
            GUARD
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-accent/70 font-bold mt-2"
        >
          Airdrop Security Protocol
        </motion.p>
      </div>

      {/* ── Loading bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="relative z-10 mt-8 flex flex-col items-center gap-3"
      >
        <div className="w-48 h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #7B3FBF, #2EECC7)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.3, ease: "easeInOut", delay: 0.2 }}
          />
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0.5, 1] }}
          transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
          className="text-[9px] font-mono uppercase tracking-[0.2em] text-text-muted"
        >
          Initializing secure channel...
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
