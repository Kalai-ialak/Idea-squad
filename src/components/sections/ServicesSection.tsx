"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null!);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const handleEnquiry = (serviceName: string) => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      // Pre-select service in form (via URL hash or state — handled in contact form)
      sessionStorage.setItem("enquiry-service", serviceName);
    }
  };

  return (
    <section
      id="services"
      ref={ref}
      className="section-padding"
      style={{ background: "var(--bg-secondary)" }}
      aria-labelledby="services-heading"
    >
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-14"
        >
          <span className="eyebrow mb-4 block">What We Do</span>
          <h2
            id="services-heading"
            className="font-display text-4xl sm:text-5xl font-800 leading-tight tracking-tight text-white mb-4"
          >
            Every Marketing Move,{" "}
            <span className="text-gradient-purple">Covered.</span>
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            From digital to physical, from brand to campaign — twelve disciplines, one cohesive team.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.055 }}
                className="card-border service-card p-6 flex flex-col gap-4 group cursor-pointer"
                onClick={() => handleEnquiry(service.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleEnquiry(service.name)}
                aria-label={`Enquire about ${service.name}`}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 group-hover:bg-[rgba(124,58,237,0.2)]"
                  style={{ background: "rgba(124, 58, 237, 0.08)", border: "1px solid rgba(124, 58, 237, 0.2)" }}
                >
                  <Icon
                    size={18}
                    className="transition-colors duration-300"
                    style={{ color: "var(--purple-light)" }}
                  />
                </div>

                {/* Category pill */}
                <span
                  className="text-[10px] font-700 uppercase tracking-widest px-2 py-0.5 rounded self-start"
                  style={{
                    background: "rgba(255,165,0,0.08)",
                    color: "var(--orange-accent)",
                    border: "1px solid rgba(255,165,0,0.15)",
                  }}
                >
                  {service.category}
                </span>

                {/* Name */}
                <h3 className="font-display text-base font-700 text-white leading-tight">
                  {service.name}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>
                  {service.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-1 text-xs font-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: "var(--purple-light)" }}
                >
                  Enquire
                  <ArrowUpRight size={12} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
