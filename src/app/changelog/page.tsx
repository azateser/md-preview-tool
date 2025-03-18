"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { 
  Star, 
  Sparkles, 
  Rocket, 
  Save, 
  PenTool, 
  Palette, 
  Layout,
  Bot,
  Split,
  Keyboard
} from "lucide-react";

export default function ChangelogPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [isMounted, setIsMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    setIsMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const backgroundOrbs = [
    { width: "294px", height: "479px", x: "85%", y: "18%" },
    { width: "376px", height: "336px", x: "-20%", y: "60%" },
    { width: "318px", height: "479px", x: "70%", y: "75%" },
  ];

  return (
    <PageLayout activePage="changelog">
      <div className={`relative min-h-screen overflow-hidden pt-24 ${isDark ? 'bg-gradient-to-b from-gray-950 to-gray-900' : ''}`}>
        {isMounted && (
          <motion.div
            className="fixed w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-[100px] pointer-events-none"
            animate={{
              x: mousePosition.x - 250,
              y: mousePosition.y - 250,
            }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 200,
            }}
          />
        )}

        {isMounted && (
          <>
            {backgroundOrbs.map((orb, index) => (
              <motion.div
                key={index}
                className="absolute rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"
                initial={{ 
                  width: orb.width, 
                  height: orb.height, 
                  x: orb.x, 
                  y: orb.y,
                  opacity: 0.2,
                }}
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                  scale: [1, 1.05, 1],
                  x: `calc(${orb.x} + ${Math.sin(index) * 4}px)`,
                  y: `calc(${orb.y} + ${Math.cos(index) * 4}px)`,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
              />
            ))}
          </>
        )}

        <div className="container mx-auto px-4 py-12 max-w-3xl relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="flex items-center mb-8 relative">
              <motion.div
                initial={{ rotate: -5 }}
                animate={{ rotate: 5 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className="mr-3 relative"
              >
                <motion.div
                  className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <Sparkles className="h-7 w-7 text-blue-500 relative z-10" />
              </motion.div>
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
                whileHover={{
                  scale: 1.02,
                  backgroundImage: "linear-gradient(to right, #3b82f6, #8b5cf6, #3b82f6)",
                  backgroundSize: "200% 100%",
                  backgroundPosition: ["0% 0%", "100% 0%"],
                }}
                transition={{
                  backgroundPosition: {
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }
                }}
              >
                Changelog
              </motion.h1>
            </div>
          </motion.div>
          
          <div className="space-y-24">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="flex items-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className="mr-3"
                >
                  <Rocket className="h-6 w-6 text-blue-500" />
                </motion.div>
                <motion.h2 
                  className="text-2xl font-semibold"
                  whileHover={{ scale: 1.02 }}
                >
                  Version 0.2.0
                </motion.h2>
                <motion.span 
                  className="ml-4 text-sm px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  March 18, 2024
                </motion.span>
              </div>
              <div className="pl-6 border-l-2 border-blue-200 dark:border-blue-800/50 space-y-6 relative">
                <motion.div 
                  className="absolute left-[-8px] top-[-8px] w-4 h-4 rounded-full bg-blue-400 dark:bg-blue-600"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
                    <h3 className="font-medium mb-4 flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">New Features & Improvements</span>
                    </h3>
                    <ul className="space-y-4">
                      <motion.li 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">AI-Powered Template Generation</h4>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Intelligent README generation based on project context and structure.
                          </p>
                        </div>
                      </motion.li>

                      <motion.li 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                          <Split className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">Enhanced Editor Layout</h4>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            New split-view mode for side-by-side editing and preview.
                          </p>
                        </div>
                      </motion.li>

                      <motion.li 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                          <Layout className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">Improved UI/UX</h4>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Redesigned interface with better mobile responsiveness and dark mode enhancements.
                          </p>
                        </div>
                      </motion.li>

                      <motion.li 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                          <Keyboard className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">Keyboard Shortcuts</h4>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Added keyboard shortcuts for common actions and Markdown formatting.
                          </p>
                        </div>
                      </motion.li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="flex items-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className="mr-3"
                >
                  <Rocket className="h-6 w-6 text-blue-500" />
                </motion.div>
                <motion.h2 
                  className="text-2xl font-semibold"
                  whileHover={{ scale: 1.02 }}
                >
                  Version 0.1.0
                </motion.h2>
                <motion.span 
                  className="ml-4 text-sm px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  March 17, 2024
                </motion.span>
              </div>
              <div className="pl-6 border-l-2 border-blue-200 dark:border-blue-800/50 space-y-6 relative">
                <motion.div 
                  className="absolute left-[-8px] top-[-8px] w-4 h-4 rounded-full bg-blue-400 dark:bg-blue-600"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
                    <h3 className="font-medium mb-4 flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Initial Release</span>
                    </h3>
                    <ul className="space-y-4">
                      <motion.li 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                          <PenTool className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">Basic Markdown Editor</h4>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Core markdown editing functionality with preview support.
                          </p>
                        </div>
                      </motion.li>

                      <motion.li 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                          <Save className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">Local Storage</h4>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Document saving and management in local storage.
                          </p>
                        </div>
                      </motion.li>

                      <motion.li 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                          <Palette className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">Dark Mode</h4>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Light and dark theme support for comfortable editing.
                          </p>
                        </div>
                      </motion.li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.div 
              className="inline-block p-px rounded-full bg-gradient-to-r from-blue-500 to-purple-500 overflow-hidden relative group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
                animate={{
                  x: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <a 
                href="./" 
                className="block px-8 py-3 rounded-full bg-white dark:bg-gray-950 hover:bg-opacity-80 dark:hover:bg-opacity-80 transition-all relative z-10"
              >
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-medium">
                  Try the Editor Now
                </span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
} 