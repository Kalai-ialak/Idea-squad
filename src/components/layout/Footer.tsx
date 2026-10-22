import Image from "next/image";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/config";

// Custom SVG Icons for social networks
function InstagramIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function FacebookIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

function LinkedinIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function TwitterIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function YoutubeIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
      <polygon points="10 15 15 12 10 9 10 15"/>
    </svg>
  );
}

const serviceLinks = [
  "Digital Marketing",
  "Social Media Management",
  "SEO & Search Marketing",
  "Branding & Visual Identity",
  "Website Design & Development",
  "Photography & Video Production",
  "Outdoor Advertising",
  "Integrated Marketing Strategy",
];

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0812] border-t border-white/5">
      {/* Main footer grid */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <Image
              src="/images/idea-squad-logo.svg"
              alt="Idea Squad Agency"
              width={140}
              height={50}
              className="h-10 w-auto object-contain"
            />
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              <span className="text-[var(--purple-light)] font-medium italic">Ideas in Action.</span>{" "}
              From digital campaigns to real-world experiences — one partner for every marketing move.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3 mt-1">
              {[
                { Icon: InstagramIcon, href: siteConfig.social.instagram, label: "Instagram" },
                { Icon: FacebookIcon, href: siteConfig.social.facebook, label: "Facebook" },
                { Icon: LinkedinIcon, href: siteConfig.social.linkedin, label: "LinkedIn" },
                { Icon: TwitterIcon, href: siteConfig.social.twitter, label: "X / Twitter" },
                { Icon: YoutubeIcon, href: siteConfig.social.youtube, label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-md flex items-center justify-center border border-white/10 text-[var(--text-secondary)] hover:border-[var(--purple-accent)] hover:text-white transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-600 text-white mb-4 tracking-wide uppercase">Navigation</h3>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-600 text-white mb-4 tracking-wide uppercase">Services</h3>
            <ul className="flex flex-col gap-2.5">
              {serviceLinks.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-600 text-white mb-4 tracking-wide uppercase">Get In Touch</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-start gap-3 text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                >
                  <Mail size={15} className="mt-0.5 text-[var(--purple-light)] flex-shrink-0" />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="flex items-start gap-3 text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                >
                  <Phone size={15} className="mt-0.5 text-[var(--purple-light)] flex-shrink-0" />
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <span className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                  <MapPin size={15} className="mt-0.5 text-[var(--purple-light)] flex-shrink-0" />
                  {siteConfig.contact.address}
                </span>
              </li>
            </ul>
            <a
              href={`#contact`}
              className="btn-primary mt-6 text-sm px-4 py-2.5"
            >
              Start a Project <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Built with purpose · <span className="text-[var(--purple-light)]">Ideas in Action</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
