"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { ArrowRight, ChevronRight } from "lucide-react";

// Lazy-load 3D scene — client only
const LightbulbScene = dynamic(() => import("@/components/three/LightbulbScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
      <div className="w-20 h-20 rounded-full border border-[#7C3AED]/30 animate-pulse" />
    </div>
  ),
});

const serviceLine = ["DIGITAL", "BRANDING", "ADVERTISING", "EXPERIENCES"];

export default function HeroSection() {
  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Background gradient blobs */}
      <div className="parallax-bg" aria-hidden="true">
        <div
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #4B0AA8 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #FFA500 0%, transparent 70%)" }}
        />
      </div>

      <div className="container-wide relative z-10 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">
          {/* ── Left: Text ── */}
          <div className="flex flex-col gap-6 max-w-xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="eyebrow">
                Idea Squad Agency · Creative Thinking. Real Execution.
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-900 leading-[1.05] tracking-tight"
            >
              <span className="text-white">Big Ideas.</span>
              <br />
              <span className="text-gradient-hero">Bold Execution.</span>
            </motion.h1>

            {/* Sub copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              From digital campaigns to real-world experiences, we turn ambitious ideas into marketing that moves businesses forward.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <button
                onClick={() => handleScroll("contact")}
                className="btn-primary"
              >
                Let&apos;s Build Something
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => handleScroll("services")}
                className="btn-secondary"
              >
                Explore Our Services
                <ChevronRight size={16} />
              </button>
            </motion.div>

            {/* Service line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center gap-3 mt-2"
            >
              {serviceLine.map((s, i) => (
                <span key={s} className="flex items-center gap-3">
                  <span
                    className="text-xs font-600 tracking-widest uppercase"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s}
                  </span>
                  {i < serviceLine.length - 1 && (
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ background: "var(--purple-accent)" }}
                    />
                  )}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── Right: 3D Scene ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[380px] sm:h-[460px] lg:h-[560px]"
          >
            {/* Glow halo behind scene */}
            <div
              className="absolute inset-0 rounded-full opacity-30 blur-3xl"
              style={{
                background: "radial-gradient(circle, #7C3AED 0%, transparent 65%)",
                transform: "scale(0.7)",
              }}
              aria-hidden="true"
            />
            <LightbulbScene />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--bg-primary), transparent)" }}
        aria-hidden="true"
      />
    </section>
  );
}
