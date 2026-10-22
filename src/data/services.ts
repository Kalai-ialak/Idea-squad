import {
  Globe, Share2, Search, Target, Palette, PenTool,
  Monitor, Camera, MapPin, Printer, Star, BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Service {
  id: string;
  icon: LucideIcon;
  name: string;
  description: string;
  category: string;
}

export const services: Service[] = [
  {
    id: "digital-marketing",
    icon: Globe,
    name: "Digital Marketing",
    description:
      "Data-driven strategies across every digital channel — from content marketing to performance media that generates real pipeline.",
    category: "Digital",
  },
  {
    id: "social-media",
    icon: Share2,
    name: "Social Media Management",
    description:
      "Consistent brand voice, scroll-stopping creative and community management that builds audiences who actually care.",
    category: "Digital",
  },
  {
    id: "seo",
    icon: Search,
    name: "SEO & Search Marketing",
    description:
      "Technical SEO, content strategy and local search optimisation that puts your brand at the top when customers are looking.",
    category: "Digital",
  },
  {
    id: "paid-ads",
    icon: Target,
    name: "Paid Advertising & Lead Generation",
    description:
      "Precision-targeted paid campaigns across Google, Meta and programmatic channels with clear ROI accountability.",
    category: "Digital",
  },
  {
    id: "branding",
    icon: Palette,
    name: "Branding & Visual Identity",
    description:
      "Strategy-led brand development — from naming and positioning to comprehensive visual systems that stand out.",
    category: "Branding",
  },
  {
    id: "graphic-design",
    icon: PenTool,
    name: "Graphic Design & Creative Campaigns",
    description:
      "Campaign-led creative that works across formats — from key visuals and print to digital banners and social content.",
    category: "Creative",
  },
  {
    id: "web-design",
    icon: Monitor,
    name: "Website Design & Development",
    description:
      "Fast, accessible, beautifully designed websites and landing pages engineered to convert visitors into customers.",
    category: "Digital",
  },
  {
    id: "photo-video",
    icon: Camera,
    name: "Photography & Video Production",
    description:
      "Professional photography and video — from brand films and product shoots to social reels and event coverage.",
    category: "Creative",
  },
  {
    id: "outdoor",
    icon: MapPin,
    name: "Outdoor Advertising & Billboards",
    description:
      "High-impact outdoor placements planned and produced for maximum visibility in the locations that matter most.",
    category: "Advertising",
  },
  {
    id: "print",
    icon: Printer,
    name: "Print Marketing & Promotional Materials",
    description:
      "Brochures, signage, packaging, merchandise and point-of-sale materials that carry your brand into the physical world.",
    category: "Advertising",
  },
  {
    id: "events",
    icon: Star,
    name: "Events, Activations & Promotions",
    description:
      "Experiential marketing, brand activations and promotional campaigns that create memorable real-world connections.",
    category: "Experiences",
  },
  {
    id: "strategy",
    icon: BarChart3,
    name: "Integrated Marketing Strategy",
    description:
      "Holistic marketing plans that unite every channel into a single, coherent strategy built around your growth objectives.",
    category: "Strategy",
  },
];
