"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const CTASection = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`relative max-w-4xl mx-auto text-center p-12 rounded-2xl overflow-hidden ${
          isDarkMode
            ? 'bg-white/5'
            : 'bg-black/5'
        }`}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={`absolute inset-0 ${
            isDarkMode
              ? 'bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10'
              : 'bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5'
          }`} />
        </motion.div>

        <div className="relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`text-4xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Ready to Start?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-xl mb-10 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Join thousands of users who have already improved their Markdown workflow.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/editor"
              className={`group relative inline-flex items-center px-8 py-4 rounded-xl text-lg font-medium transition-all ${
                isDarkMode
                  ? 'bg-white text-black hover:bg-opacity-90'
                  : 'bg-black text-white hover:bg-opacity-90'
              } shadow-lg hover:shadow-2xl`}
            >
              <span>Get Started</span>
              <motion.span
                initial={{ x: 0 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.span>
              <motion.div
                className={`absolute inset-0 rounded-xl transition-opacity ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-purple-400/20 to-blue-400/20'
                    : 'bg-gradient-to-r from-purple-600/20 to-blue-600/20'
                }`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}; 