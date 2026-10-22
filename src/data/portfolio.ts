export type PortfolioCategory = "All" | "Digital" | "Branding" | "Advertising" | "Web";

export interface PortfolioItem {
  id: string;
  title: string;
  category: Exclude<PortfolioCategory, "All">;
  description: string;
  tags: string[];
  gradient: string; // CSS gradient for placeholder card
  isConceptProject: boolean; // Always true until real projects are added
}

// ─── CONCEPT PROJECTS ────────────────────────────────────────────────────────
// These are illustrative concept projects only. Replace with real client work,
// actual imagery and accurate details before launch.
export const portfolioItems: PortfolioItem[] = [
  {
    id: "urban-launch",
    title: "Urban Brand Launch",
    category: "Branding",
    description:
      "End-to-end brand identity for a premium urban lifestyle concept — from strategy and naming through to full visual system.",
    tags: ["Brand Strategy", "Identity Design", "Brand Guidelines"],
    gradient: "linear-gradient(135deg, #4B0AA8 0%, #7C3AED 100%)",
    isConceptProject: true,
  },
  {
    id: "digital-performance",
    title: "Digital Performance Campaign",
    category: "Digital",
    description:
      "Integrated paid and organic digital campaign across Google and Meta for a retail growth client.",
    tags: ["Paid Media", "Social", "SEO", "Analytics"],
    gradient: "linear-gradient(135deg, #1a0533 0%, #4B0AA8 100%)",
    isConceptProject: true,
  },
  {
    id: "outdoor-impact",
    title: "Outdoor Impact Campaign",
    category: "Advertising",
    description:
      "City-wide outdoor advertising campaign combining billboard placements with coordinated digital out-of-home.",
    tags: ["OOH", "Print", "Campaign Production"],
    gradient: "linear-gradient(135deg, #7C3AED 0%, #FFA500 100%)",
    isConceptProject: true,
  },
  {
    id: "ecommerce-site",
    title: "E-Commerce Experience",
    category: "Web",
    description:
      "High-converting e-commerce platform with custom UX/UI design, performance optimisation and brand-consistent creative.",
    tags: ["UX Design", "Web Dev", "CRO"],
    gradient: "linear-gradient(135deg, #09090D 0%, #7C3AED 50%, #FFA500 100%)",
    isConceptProject: true,
  },
  {
    id: "hospitality-brand",
    title: "Hospitality Brand System",
    category: "Branding",
    description:
      "Comprehensive brand system for a hospitality group — identity, print collateral, signage and digital templates.",
    tags: ["Brand Identity", "Print", "Signage"],
    gradient: "linear-gradient(135deg, #2d0080 0%, #9f4fe3 100%)",
    isConceptProject: true,
  },
  {
    id: "social-strategy",
    title: "Social Media Growth Strategy",
    category: "Digital",
    description:
      "Content strategy and community management framework that grew an audience and drove measurable engagement.",
    tags: ["Social Media", "Content", "Community"],
    gradient: "linear-gradient(135deg, #4B0AA8 0%, #ff8c00 100%)",
    isConceptProject: true,
  },
];

export const portfolioCategories: PortfolioCategory[] = [
  "All", "Digital", "Branding", "Advertising", "Web",
];
