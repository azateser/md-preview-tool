"use client";

import { motion, MotionValue } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  scrollProgress: MotionValue<number>;
  mouseX: number;
  mouseY: number;
  isScrolling: boolean;
}

export function HeroSection({ scrollProgress, mouseX, mouseY, isScrolling }: HeroSectionProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      <motion.div
        className="max-w-5xl mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          x: isScrolling ? 0 : mouseX * 0.1,
          scale: scrollProgress.get() > 0.1 ? 0.95 : 1
        }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ 
          filter: `blur(${isScrolling ? '1px' : '0px'})`,
          transform: `translate3d(${mouseX * 0.02}px, ${mouseY * 0.02}px, 0px)`,
          WebkitFontSmoothing: "antialiased",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          willChange: "transform"
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          style={{
            willChange: "transform",
            transform: "translate3d(0,0,0)"
          }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Transform Your{' '}
            <span className="relative inline-block">
              <span className={`relative inline-block ${
                isDarkMode 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600'
              }`}>
                Markdown
                <motion.span
                  className={`absolute -bottom-2 left-0 w-full h-1 rounded-full ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400'
                      : 'bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600'
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                />
              </span>
            </span>
            {' '}Experience
          </h1>
          <motion.p 
            className="mt-8 text-lg sm:text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            A powerful, modern Markdown editor with real-time preview, syntax highlighting,
            and advanced formatting features.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link 
              href="/" 
              className={`group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium inline-flex items-center gap-2 transition-all ${
                isDarkMode
                  ? 'bg-white text-black hover:bg-opacity-90'
                  : 'bg-black text-white hover:bg-opacity-90'
              } shadow-lg hover:shadow-2xl`}
            >
              <span>Try Editor Now</span>
              <motion.span
                initial={{ x: 0 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  repeatDelay: 1
                }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: 1, 
          y: 0 
        }}
        transition={{ 
          duration: 0.6,
          delay: 1
        }}
      >
        <motion.div
          animate={{ 
            y: [0, 10, 0],
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`p-2 rounded-full ${
            isDarkMode 
              ? 'bg-white/10 text-white hover:bg-white/20' 
              : 'bg-black/10 text-black hover:bg-black/20'
          } transition-colors`}
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            });
          }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
} 