"use client";

import { Layers } from "lucide-react";
import HeroSection from "../../components/HeroSection";
// import FeaturesSection from "../../components/QuickAccessGrid";
import QuickAccessGrid from "../../components/QuickAccessGrid";
// import PlatformSection from "../../components/PlatformSection";
import BudgetTransparency from "../../components/Budgettranparency";
import HowItWorks from "../../components/HowItWork";
import NewsAnnouncements from "../../components/Newannouncement";
// import ValueSection from "../../components/ValueSection";
// import CtaSection from "../../components/CtaSection";

export default function Home() {
  return (
    <div className="bg-white min-h-screen font-sans antialiased overflow-hidden">

      <main>
        <HeroSection />
        <QuickAccessGrid />
        {/* <BudgetTransparency /> */}
        <NewsAnnouncements />
        <HowItWorks />
        {/* <FeaturesSection /> */}
        {/* <PlatformSection /> */}
        {/* <ValueSection /> */}
        {/* <CtaSection /> */}
      </main>
      
    </div>
  );
}