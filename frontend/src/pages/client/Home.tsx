import { Layers } from "lucide-react";
import HeroSection from "../../components/HeroSection";
import FeaturesSection from "../../components/FeaturesSection";
import PlatformSection from "../../components/PlatformSection";
import ValueSection from "../../components/ValueSection";
import CtaSection from "../../components/CtaSection";

export default function Home() {
  return (
    <div className="bg-white min-h-screen font-sans antialiased overflow-hidden">

      <main>
        <HeroSection />
        <FeaturesSection />
        <PlatformSection />
        <ValueSection />
        <CtaSection />
      </main>
      
    </div>
  );
}