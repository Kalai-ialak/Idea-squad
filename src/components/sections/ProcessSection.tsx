"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";

const steps = [
  {
    num: "01",
    title: "Discover",
    description:
      "We immerse ourselves in your brand, audience and market. Research, listening and honest conversations build the foundation everything else stands on.",
  },
  {
    num: "02",
    title: "Strategise",
    description:
      "Goals become plans. We define the right channels, messages, timing and KPIs so every action is purposeful and measurable.",
  },
  {
    num: "03",
    title: "Create",
    description:
      "Ideas become assets. Our creative team develops the visual language, content and campaign materials that bring the strategy to life.",
  },
  {
    num: "04",
    title: "Execute",
    description:
      "We launch, place and manage. From digital campaigns and print production to events and outdoor placements — we own the delivery.",
  },
  {
    num: "05",
    title: "Optimise",
    description:
      "Real data, honest analysis. We measure what works, fix what doesn't and continuously improve results over time.",
  },
];

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null!);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [active, setActive] = useState(0);

  return (
    <section
      id="process"
      ref={ref}
      className="section-padding"
      style={{ background: "var(--bg-primary)" }}
      aria-labelledby="process-heading"
    >
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-xl mb-14"
        >
          <span className="eyebrow mb-4 block">How We Work</span>
          <h2
            id="process-heading"
            className="font-display text-4xl sm:text-5xl font-800 leading-tight tracking-tight text-white"
          >
            From Idea to{" "}
            <span className="text-gradient-gold">Impact.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Step list */}
          <div className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <motion.button
                key={step.num}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                onClick={() => setActive(i)}
                className={`text-left p-5 rounded-xl border transition-all duration-300 cursor-pointer w-full ${
                  active === i
                    ? "border-[var(--purple-accent)] bg-[rgba(124,58,237,0.08)]"
                    : "border-[var(--border-card)] bg-transparent hover:border-[rgba(124,58,237,0.3)]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`process-node ${active === i ? "active" : ""}`}>
                    {step.num}
                  </div>
                  <span
                    className={`font-display text-lg font-700 transition-colors duration-300 ${
                      active === i ? "text-white" : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Active step detail */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:sticky lg:top-28 p-8 rounded-2xl border border-[var(--border-subtle)]"
            style={{ background: "var(--bg-secondary)" }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span
                className="font-display text-5xl font-900"
                style={{ color: "rgba(124,58,237,0.25)" }}
              >
                {steps[active].num}
              </span>
              <h3 className="font-display text-3xl font-800 text-white">
                {steps[active].title}
              </h3>
            </div>
            <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {steps[active].description}
            </p>

            {/* Progress indicators */}
            <div className="flex items-center gap-2 mt-8">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Step ${i + 1}`}
                  className={`h-1 rounded-full transition-all duration-300 cursor-pointer border-none ${
                    i === active ? "w-8 bg-[var(--purple-accent)]" : "w-3 bg-[var(--border-card)]"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
