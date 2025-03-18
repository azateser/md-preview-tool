"use client";

import { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme-provider";

interface BackgroundAnimationProps {
  mouseX: number;
  mouseY: number;
  isScrolling: boolean;
}

export const BackgroundAnimation = ({ mouseX, mouseY, isScrolling }: BackgroundAnimationProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const backgroundOrbs = useMemo(() => {
    const initialOrbs = [
      { width: "294px", height: "479px", x: "15%", y: "18%" },
      { width: "376px", height: "336px", x: "12%", y: "44%" },
      { width: "318px", height: "479px", x: "50%", y: "-35%" },
      { width: "307px", height: "459px", x: "-24%", y: "26%" },
      { width: "324px", height: "431px", x: "37%", y: "9%" }
    ];

    return initialOrbs.map((orb, i) => ({
      id: i,
      ...orb
    }));
  }, []);

  const orbVariants = {
    initial: {
      scale: 0,
      opacity: 0
    },
    animate: {
      scale: 1,
      opacity: 0.3,
      transition: {
        duration: 1.5,
        ease: "easeOut"
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        transform: `translate3d(${mouseX}px, ${mouseY}px, 0)`,
        willChange: 'transform'
      }}
      initial={false}
      animate={{ x: mouseX, y: mouseY }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 200,
        mass: 0.5,
        restDelta: 0.001
      }}
    >
      <motion.div 
        className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-b from-black via-gray-900 to-black' 
            : 'bg-gradient-to-b from-white via-gray-50 to-white'
        }`}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      />
      
      <div className="absolute inset-0">
        <AnimatePresence mode="sync" initial={false}>
          {!isScrolling && backgroundOrbs.map((orb) => (
            <motion.div
              key={orb.id}
              variants={orbVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`absolute rounded-full blur-2xl ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20' 
                  : 'bg-gradient-to-r from-purple-200/30 via-blue-200/30 to-purple-200/30'
              }`}
              style={{
                width: orb.width,
                height: orb.height,
                left: orb.x,
                top: orb.y,
                willChange: 'transform, opacity',
                transform: 'translate3d(0,0,0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}; 