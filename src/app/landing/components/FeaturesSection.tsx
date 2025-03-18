"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { Zap, FileCode, Sparkles } from "lucide-react";

const featureCardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  hover: { 
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  tap: { 
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

export const FeaturesSection = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <section id="features" className="py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className={`text-4xl sm:text-5xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Powerful Features
          </h2>
          <p className={`mt-6 text-xl ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Everything you need for a seamless Markdown editing experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="w-7 h-7" />,
              title: "Real-time Preview",
              description: "See your changes instantly as you type with our live preview feature."
            },
            {
              icon: <FileCode className="w-7 h-7" />,
              title: "Syntax Highlighting",
              description: "Beautiful syntax highlighting for code blocks in multiple languages."
            },
            {
              icon: <Sparkles className="w-7 h-7" />,
              title: "Smart Formatting",
              description: "Intelligent formatting tools to make your content look perfect."
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={featureCardVariants}
              initial="initial"
              whileInView="animate"
              whileHover="hover"
              whileTap="tap"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group p-8 rounded-2xl backdrop-blur-lg ${
                isDarkMode
                  ? 'bg-white/5'
                  : 'bg-black/5'
              } transition-all duration-300 relative overflow-hidden`}
            >
              <motion.div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/10'
                    : 'bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-purple-500/5'
                }`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="relative">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  isDarkMode
                    ? 'bg-white/10 text-purple-400'
                    : 'bg-black/10 text-purple-600'
                } group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className={`text-2xl font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-lg ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}; 