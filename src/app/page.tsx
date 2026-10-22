import HeroSection from "@/components/sections/HeroSection";
import BrandStatement from "@/components/sections/BrandStatement";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ProcessSection from "@/components/sections/ProcessSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import IndustriesSection from "@/components/sections/IndustriesSection";
import CtaSection from "@/components/sections/CtaSection";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="section-divider" />
      <BrandStatement />
      <div className="section-divider" />
      <AboutSection />
      <div className="section-divider" />
      <ServicesSection />
      <div className="section-divider" />
      <ProcessSection />
      <div className="section-divider" />
      <PortfolioSection />
      <div className="section-divider" />
      <IndustriesSection />
      <div className="section-divider" />
      <CtaSection />
      <div className="section-divider" />
      <ContactSection />
    </>
  );
}
