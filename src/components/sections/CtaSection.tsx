"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";

export default function CtaSection() {
  const ref = useRef<HTMLDivElement>(null!);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const handleStartProject = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    "Hi! I have a project I'd like to discuss with Idea Squad Agency."
  )}`;

  return (
    <section
      ref={ref}
      className="section-padding relative overflow-hidden"
      style={{ background: "var(--bg-secondary)" }}
      aria-labelledby="cta-heading"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(ellipse, #4B0AA8 0%, transparent 70%)" }}
        />
        <div
          className="absolute right-0 bottom-0 w-[300px] h-[300px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #FFA500 0%, transparent 70%)" }}
        />
      </div>

      <div className="container-wide relative z-10 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="eyebrow mb-6 block">Ready When You Are</span>
          <h2
            id="cta-heading"
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-900 leading-tight tracking-tight text-white mb-5"
          >
            Got an Idea?{" "}
            <span className="text-gradient-gold">Let&apos;s Put It Into Action.</span>
          </h2>
          <p className="text-lg leading-relaxed mb-10" style={{ color: "var(--text-secondary)" }}>
            Tell us what you&apos;re building. Let&apos;s create the right marketing plan to move it forward.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleStartProject} className="btn-primary text-base px-7 py-3.5">
              Start a Project <ArrowRight size={17} />
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orange text-base px-7 py-3.5"
            >
              <MessageCircle size={17} />
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
