"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Building2, GraduationCap, ShoppingBag, UtensilsCrossed,
  Heart, Cpu, Briefcase, Sparkles,
} from "lucide-react";

const industries = [
  { icon: Building2, name: "Real Estate", description: "Property brands, developments and agents." },
  { icon: GraduationCap, name: "Education", description: "Schools, universities and EdTech platforms." },
  { icon: ShoppingBag, name: "Retail & E-commerce", description: "Online and physical retail brands." },
  { icon: UtensilsCrossed, name: "Hospitality", description: "Hotels, restaurants and lifestyle venues." },
  { icon: Heart, name: "Healthcare", description: "Clinics, health brands and wellness services." },
  { icon: Cpu, name: "Startups & Technology", description: "Scale-ups, SaaS and tech product brands." },
  { icon: Briefcase, name: "Professional Services", description: "Law, finance, consulting and B2B firms." },
  { icon: Sparkles, name: "Lifestyle & Consumer", description: "Fashion, beauty, food and consumer brands." },
];

export default function IndustriesSection() {
  const ref = useRef<HTMLDivElement>(null!);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="industries"
      ref={ref}
      className="section-padding"
      style={{ background: "var(--bg-primary)" }}
      aria-labelledby="industries-heading"
    >
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-xl mb-14 text-center mx-auto"
        >
          <span className="eyebrow mb-4 block">Industries We Serve</span>
          <h2
            id="industries-heading"
            className="font-display text-4xl sm:text-5xl font-800 leading-tight text-white"
          >
            Built for{" "}
            <span className="text-gradient-purple">Every Sector.</span>
          </h2>
          <p className="text-base mt-4" style={{ color: "var(--text-secondary)" }}>
            We work across industries, adapting our approach to what makes your market tick.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {industries.map((industry, i) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.07 }}
                className="card-border p-6 flex flex-col gap-3 group text-center items-center"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-1 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: "rgba(124,58,237,0.1)",
                    border: "1px solid rgba(124,58,237,0.2)",
                  }}
                >
                  <Icon size={20} style={{ color: "var(--purple-light)" }} />
                </div>
                <h3 className="font-display text-sm font-700 text-white">{industry.name}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {industry.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
