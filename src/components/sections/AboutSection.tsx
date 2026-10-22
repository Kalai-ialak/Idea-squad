"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Lightbulb, Target, Rocket } from "lucide-react";

const pillars = [
  {
    icon: Lightbulb,
    title: "Strategy First",
    desc: "We start every engagement by understanding your audience, your goals and your competitive landscape. Strategy drives everything we create.",
  },
  {
    icon: Target,
    title: "Creative That Works",
    desc: "We don't make things that just look good. We make things that connect, convert and build lasting relationships between brands and their people.",
  },
  {
    icon: Rocket,
    title: "Built for Execution",
    desc: "Ideas mean nothing without action. Our team handles everything from planning through production, so your campaigns actually ship.",
  },
];

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null!);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      ref={ref}
      className="section-padding"
      style={{ background: "var(--bg-primary)" }}
      aria-labelledby="about-heading"
    >
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-14"
        >
          <span className="eyebrow mb-4 block">About Idea Squad</span>
          <h2
            id="about-heading"
            className="font-display text-4xl sm:text-5xl font-800 leading-tight tracking-tight text-white mb-5"
          >
            We Don&apos;t Just Think It.{" "}
            <span className="text-gradient-gold">We Make It Happen.</span>
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Idea Squad is a full-service marketing agency built around one belief: that the best ideas
            are only as good as their execution. We bring together strategy, creative and delivery
            under one roof — giving you the clarity of a single partner and the depth of a full team.
          </p>
          <p className="text-base leading-relaxed mt-4" style={{ color: "var(--text-muted)" }}>
            Whether you need to launch a brand, grow your digital presence, run an outdoor campaign
            or create an experience people remember — we plan it, make it and measure it.
          </p>
        </motion.div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
                className="card-border p-7 flex flex-col gap-4"
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(124, 58, 237, 0.12)", border: "1px solid rgba(124, 58, 237, 0.25)" }}
                >
                  <Icon size={20} style={{ color: "var(--purple-light)" }} />
                </div>
                <h3 className="font-display text-lg font-700 text-white">{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {p.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
