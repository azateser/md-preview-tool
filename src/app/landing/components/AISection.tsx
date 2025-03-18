"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { Bot, FileText, Clock, Sparkles } from "lucide-react";

const featureCardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  hover: { 
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export const AISection = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const aiFeatures = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI Template Generation",
      description: "Generate professional README templates with a single click using AI assistance."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Project Context",
      description: "AI analyzes your project structure to create relevant and customized templates."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Time Saving",
      description: "Create comprehensive documentation in minutes instead of hours."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Best Practices",
      description: "Templates follow industry standards and documentation best practices."
    }
  ];

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-30"
        initial={{ backgroundSize: "100% 100%" }}
        animate={{ backgroundSize: "120% 120%" }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        style={{
          background: isDarkMode
            ? "radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.1) 0%, rgba(99, 102, 241, 0.1) 25%, rgba(79, 70, 229, 0) 50%)"
            : "radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.08) 0%, rgba(99, 102, 241, 0.08) 25%, rgba(79, 70, 229, 0) 50%)"
        }}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-6"
          >
            <div className={`p-3 rounded-2xl ${
              isDarkMode ? 'bg-white/10' : 'bg-black/5'
            }`}>
              <Bot className={`w-8 h-8 ${
                isDarkMode ? 'text-purple-400' : 'text-purple-600'
              }`} />
            </div>
          </motion.div>

          <h2 className={`text-4xl sm:text-5xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Smart{' '}
            <span className={`${
              isDarkMode 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600'
            }`}>
              Template Generation
            </span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Create professional README documentation quickly and easily with our AI-powered template generator.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={featureCardVariants}
              initial="initial"
              whileInView="animate"
              whileHover="hover"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group p-8 rounded-2xl backdrop-blur-sm ${
                isDarkMode
                  ? 'bg-white/5 hover:bg-white/10'
                  : 'bg-black/5 hover:bg-black/10'
              } transition-all duration-300`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}; 