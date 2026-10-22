"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { portfolioItems, portfolioCategories, type PortfolioCategory } from "@/data/portfolio";
import { ArrowUpRight } from "lucide-react";

export default function PortfolioSection() {
  const ref = useRef<HTMLDivElement>(null!);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [activeFilter, setActiveFilter] = useState<PortfolioCategory>("All");

  const filtered = activeFilter === "All"
    ? portfolioItems
    : portfolioItems.filter((p) => p.category === activeFilter);

  return (
    <section
      id="work"
      ref={ref}
      className="section-padding"
      style={{ background: "var(--bg-secondary)" }}
      aria-labelledby="work-heading"
    >
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
        >
          <div>
            <span className="eyebrow mb-4 block">Selected Work</span>
            <h2
              id="work-heading"
              className="font-display text-4xl sm:text-5xl font-800 leading-tight text-white"
            >
              Projects That{" "}
              <span className="text-gradient-purple">Move the Needle.</span>
            </h2>
          </div>
          <p className="text-sm max-w-xs" style={{ color: "var(--text-muted)" }}>
            Concept projects shown for illustration. Real client work added on request.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-10"
          role="tablist"
          aria-label="Portfolio filter"
        >
          {portfolioCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              role="tab"
              aria-selected={activeFilter === cat}
              className={`px-4 py-2 rounded-full text-sm font-500 border transition-all duration-200 cursor-pointer ${
                activeFilter === cat
                  ? "border-[var(--purple-accent)] bg-[rgba(124,58,237,0.12)] text-white"
                  : "border-[var(--border-card)] text-[var(--text-secondary)] hover:border-[rgba(124,58,237,0.3)] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Portfolio grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35 }}
                className="group rounded-2xl overflow-hidden border border-[var(--border-card)] hover:border-[var(--border-subtle)] transition-all duration-300 cursor-pointer relative"
                style={{ background: "var(--bg-card)" }}
              >
                {/* Visual */}
                <div
                  className="relative h-48 overflow-hidden"
                  style={{ background: item.gradient }}
                >
                  {/* Concept badge */}
                  {item.isConceptProject && (
                    <div
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-700 uppercase tracking-wider z-10"
                      style={{
                        background: "rgba(0,0,0,0.5)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "rgba(255,255,255,0.7)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      Concept Project
                    </div>
                  )}

                  {/* Category chip */}
                  <div
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-700 uppercase tracking-wider z-10"
                    style={{
                      background: "rgba(124,58,237,0.3)",
                      border: "1px solid rgba(124,58,237,0.4)",
                      color: "#c4b5fd",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {item.category}
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#09090D]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                      <ArrowUpRight size={18} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-3">
                  <h3 className="font-display text-lg font-700 text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded"
                        style={{
                          background: "rgba(124,58,237,0.08)",
                          color: "var(--purple-light)",
                          border: "1px solid rgba(124,58,237,0.15)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
