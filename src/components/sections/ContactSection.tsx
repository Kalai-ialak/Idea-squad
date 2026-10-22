"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { services } from "@/data/services";

interface FormData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  details: string;
}

interface FormErrors {
  [key: string]: string;
}

const budgets = [
  "Under $1,000",
  "$1,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000+",
  "Not sure yet",
];

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null!);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<FormData>({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    details: "",
  });

  // Auto-select service if arriving from service card click
  useEffect(() => {
    const saved = sessionStorage.getItem("enquiry-service");
    if (saved) {
      setForm((f) => ({ ...f, service: saved }));
      sessionStorage.removeItem("enquiry-service");
    }
  }, []);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.trim()) e.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.service) e.service = "Please select a service.";
    if (!form.details.trim()) e.details = "Tell us a bit about your project.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");

    // ── DEMO MODE ──────────────────────────────────────────────────────────
    // No backend is configured. Replace this timeout with a real API call
    // (e.g., Formspree, Resend, Next.js API route, or your own endpoint).
    await new Promise((r) => setTimeout(r, 1800));
    setStatus("success");
    // ──────────────────────────────────────────────────────────────────────
  };

  const resetForm = () => {
    setForm({ fullName: "", company: "", email: "", phone: "", service: "", budget: "", details: "" });
    setStatus("idle");
    setErrors({});
  };

  const inputClass = (field: string) =>
    `form-input${errors[field] ? " error" : ""}`;

  return (
    <section
      id="contact"
      ref={ref}
      className="section-padding"
      style={{ background: "var(--bg-primary)" }}
      aria-labelledby="contact-heading"
    >
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-xl mb-14"
        >
          <span className="eyebrow mb-4 block">Get In Touch</span>
          <h2
            id="contact-heading"
            className="font-display text-4xl sm:text-5xl font-800 leading-tight text-white mb-4"
          >
            Start Your{" "}
            <span className="text-gradient-purple">Next Project.</span>
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Fill in the form and we&apos;ll get back to you within one business day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-5">
              {[
                { Icon: Mail, label: "Email", value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
                { Icon: Phone, label: "Phone", value: siteConfig.contact.phone, href: `tel:${siteConfig.contact.phone}` },
                { Icon: MapPin, label: "Location", value: siteConfig.contact.address, href: undefined },
              ].map(({ Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
                  >
                    <Icon size={16} style={{ color: "var(--purple-light)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-600 uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                      {label}
                    </p>
                    {href ? (
                      <a href={href} className="text-sm text-white hover:text-[var(--purple-light)] transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm text-white">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Demo mode notice */}
            <div
              className="rounded-xl p-4 text-sm leading-relaxed"
              style={{
                background: "rgba(255,165,0,0.06)",
                border: "1px solid rgba(255,165,0,0.2)",
                color: "var(--orange-accent)",
              }}
            >
              <p className="font-600 mb-1">📋 Demo Mode</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.8125rem" }}>
                The form is currently in demonstration mode. No data is submitted to a server. Connect a backend (e.g. Formspree, Resend or a Next.js API route) before launch.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-2"
          >
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center gap-5 p-12 rounded-2xl border border-[var(--border-card)] h-full"
                style={{ background: "var(--bg-secondary)" }}
              >
                <CheckCircle size={48} style={{ color: "var(--purple-accent)" }} />
                <h3 className="font-display text-2xl font-700 text-white">
                  Message Received (Demo)
                </h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  Your form was validated successfully. In production this would send to your configured endpoint. Connect a real backend to enable submissions.
                </p>
                <button onClick={resetForm} className="btn-secondary mt-2">
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Project enquiry form"
                className="p-8 rounded-2xl border border-[var(--border-card)]"
                style={{ background: "var(--bg-secondary)" }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="form-label">
                      Full Name <span aria-hidden="true" style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      id="fullName" name="fullName" type="text" autoComplete="name"
                      className={inputClass("fullName")} value={form.fullName}
                      onChange={handleChange} placeholder="Jane Smith"
                      aria-required="true" aria-describedby={errors.fullName ? "fullName-err" : undefined}
                    />
                    {errors.fullName && (
                      <p id="fullName-err" role="alert" className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#ef4444" }}>
                        <AlertCircle size={12} /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="form-label">Company Name</label>
                    <input
                      id="company" name="company" type="text" autoComplete="organization"
                      className={inputClass("company")} value={form.company}
                      onChange={handleChange} placeholder="Acme Corp"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="form-label">
                      Email Address <span aria-hidden="true" style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      id="email" name="email" type="email" autoComplete="email"
                      className={inputClass("email")} value={form.email}
                      onChange={handleChange} placeholder="jane@company.com"
                      aria-required="true" aria-describedby={errors.email ? "email-err" : undefined}
                    />
                    {errors.email && (
                      <p id="email-err" role="alert" className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#ef4444" }}>
                        <AlertCircle size={12} /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      id="phone" name="phone" type="tel" autoComplete="tel"
                      className={inputClass("phone")} value={form.phone}
                      onChange={handleChange} placeholder="+1 000 000 0000"
                    />
                  </div>

                  {/* Service */}
                  <div>
                    <label htmlFor="service" className="form-label">
                      Service Required <span aria-hidden="true" style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select
                      id="service" name="service"
                      className={inputClass("service")} value={form.service}
                      onChange={handleChange}
                      aria-required="true" aria-describedby={errors.service ? "service-err" : undefined}
                    >
                      <option value="">Select a service…</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                    {errors.service && (
                      <p id="service-err" role="alert" className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#ef4444" }}>
                        <AlertCircle size={12} /> {errors.service}
                      </p>
                    )}
                  </div>

                  {/* Budget */}
                  <div>
                    <label htmlFor="budget" className="form-label">Estimated Budget</label>
                    <select
                      id="budget" name="budget"
                      className={inputClass("budget")} value={form.budget}
                      onChange={handleChange}
                    >
                      <option value="">Select a range…</option>
                      {budgets.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Details */}
                  <div className="sm:col-span-2">
                    <label htmlFor="details" className="form-label">
                      Project Details <span aria-hidden="true" style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <textarea
                      id="details" name="details" rows={4}
                      className={inputClass("details")} value={form.details}
                      onChange={handleChange}
                      placeholder="Tell us about your project, goals and timeline…"
                      aria-required="true" aria-describedby={errors.details ? "details-err" : undefined}
                    />
                    {errors.details && (
                      <p id="details-err" role="alert" className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#ef4444" }}>
                        <AlertCircle size={12} /> {errors.details}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Fields marked <span style={{ color: "#ef4444" }}>*</span> are required.
                  </p>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn-primary"
                    aria-busy={status === "loading"}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Enquiry <Send size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
