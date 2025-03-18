"use client";

import { useEffect, useState, useCallback } from "react";
import { useScroll } from "framer-motion";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import { PageLayout } from "@/components/layout/page-layout";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { GitHubSection } from "./components/GitHubSection";
import { CTASection } from "./components/CTASection";
import { BackgroundAnimation } from "./components/BackgroundAnimation";
import { AISection } from "./components/AISection";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = useCallback(
    debounce(() => {
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 150);
    }, 10),
    []
  );

  const handleMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      const mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
      const mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
      requestAnimationFrame(() => {
        setMousePosition({ x: mouseX, y: mouseY });
      });
    }, 16),
    []
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      handleMouseMove.cancel();
      handleScroll.cancel();
    };
  }, [handleMouseMove, handleScroll]);

  return (
    <PageLayout>
      <div className="relative min-h-screen overflow-hidden">
        <BackgroundAnimation 
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
          isScrolling={isScrolling} 
        />

        <div className="relative z-10 flex flex-col gap-16 md:gap-32">
          <HeroSection 
            scrollProgress={scrollYProgress}
            mouseX={mousePosition.x}
            mouseY={mousePosition.y}
            isScrolling={isScrolling} 
          />

          <FeaturesSection />

          <AISection />

          <GitHubSection />

          <CTASection />
        </div>
      </div>
    </PageLayout>
  );
} 