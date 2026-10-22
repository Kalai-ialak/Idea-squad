"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

const highlights = [
  { label: "Digital", color: "#7C3AED" },
  { label: "Branding", color: "#9d5cf5" },
  { label: "Advertising", color: "#FFA500" },
  { label: "Experiences", color: "#7C3AED" },
];

export default function BrandStatement() {
  const ref = useRef<HTMLDivElement>(null!);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="section-padding"
      style={{ background: "var(--bg-secondary)" }}
      aria-labelledby="brand-statement-heading"
    >
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <span className="eyebrow mb-4 block">One Partner. Every Channel.</span>
              <h2
                id="brand-statement-heading"
                className="font-display text-4xl sm:text-5xl font-800 leading-tight tracking-tight text-white mb-5"
              >
                One Squad.{" "}
                <span className="text-gradient-purple">Every Marketing Move.</span>
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Great marketing is more than a single campaign. It is a connected experience across
                every place your audience discovers, experiences and remembers your brand.
              </p>
            </motion.div>
          </div>

          {/* Visual: horizontal channel progression */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            {highlights.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, x: 60 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                {/* Animated bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${55 + i * 12}%` } : {}}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: "easeOut" }}
                  className="h-[2px] rounded-full"
                  style={{ background: h.color }}
                />
                <span
                  className="text-sm font-600 uppercase tracking-widest flex-shrink-0"
                  style={{ color: h.color }}
                >
                  {h.label}
                </span>
              </motion.div>
            ))}

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="mt-4 text-sm italic"
              style={{ color: "var(--text-muted)" }}
            >
              From the first impression to long-term loyalty — every touchpoint, covered.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
