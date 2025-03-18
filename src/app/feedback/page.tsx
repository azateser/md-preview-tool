"use client";

import { PageLayout } from "@/components/layout/page-layout";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { MessageSquare, Send, CheckCircle, AlertCircle, User, Mail, MessageSquareText, Sparkles, Star, Heart, ThumbsUp } from "lucide-react";

export default function FeedbackPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [isMounted, setIsMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeField, setActiveField] = useState<string | null>(null);
  
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    feedback: "",
    submitted: false,
    error: false,
  });

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
    { width: "250px", height: "250px", x: "10%", y: "20%" },
    { width: "200px", height: "200px", x: "40%", y: "85%" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formState.name && formState.email && formState.feedback) {
      setFormState({
        ...formState,
        submitted: true,
        error: false,
      });
    } else {
      setFormState({
        ...formState,
        error: true,
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const floatingIcons = [
    { icon: <Star className="text-yellow-400" size={16} />, delay: 0 },
    { icon: <Heart className="text-pink-500" size={14} />, delay: 1.5 },
    { icon: <ThumbsUp className="text-blue-400" size={15} />, delay: 0.8 },
    { icon: <MessageSquare className="text-purple-400" size={13} />, delay: 2.2 },
    { icon: <Sparkles className="text-amber-400" size={14} />, delay: 3 },
  ];

  return (
    <PageLayout activePage="feedback">
      <div className={`relative min-h-screen overflow-hidden pt-24 ${isDark ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950' : 'bg-gradient-to-b from-white via-blue-50/30 to-white'}`}>
        {isMounted && (
          <motion.div
            className="fixed w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-[120px] pointer-events-none"
            animate={{
              x: mousePosition.x - 300,
              y: mousePosition.y - 300,
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
                className={`absolute rounded-full ${
                  index % 2 === 0 
                    ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10" 
                    : "bg-gradient-to-r from-purple-500/10 to-pink-500/10"
                } blur-3xl`}
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
                  duration: 8 + index,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
              />
            ))}
          </>
        )}

        {isMounted && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {floatingIcons.map((item, index) => (
              <motion.div
                key={index}
                className="absolute"
                initial={{ 
                  y: "110vh",
                  x: `${10 + (index * 20)}%`,
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{ 
                  y: "-10vh",
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1, 1, 0.8],
                  x: `${10 + (index * 20) + (Math.sin(index) * 5)}%`,
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  delay: item.delay,
                  ease: "linear",
                }}
              >
                {item.icon}
              </motion.div>
            ))}
          </div>
        )}

        <div className="container mx-auto px-4 py-12 max-w-2xl relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="flex items-center justify-center mb-12 relative">
              <motion.div
                initial={{ rotate: -5, scale: 0 }}
                animate={{ rotate: 5, scale: 1 }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, repeatType: "reverse" },
                  scale: { duration: 0.5, type: "spring" }
                }}
                className="mr-4 relative"
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
                <MessageSquare className="h-8 w-8 text-blue-500 relative z-10" />
              </motion.div>
              <div className="relative">
                <motion.h1 
                  className="text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.2, 
                    duration: 0.5 
                  }}
                  whileHover={{
                    scale: 1.02,
                    backgroundImage: "linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
                    backgroundSize: "200% 100%",
                    backgroundPosition: ["0% 0%", "100% 0%"],
                    transition: {
                      backgroundPosition: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }
                    }
                  }}
                >
                  Feedback
                </motion.h1>
                <motion.div 
                  className="h-1 w-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mt-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
          
          <AnimatePresence mode="wait">
        {formState.submitted ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/30 dark:to-emerald-900/20 backdrop-blur-md border border-green-200/50 dark:border-green-800/30 p-10 rounded-2xl shadow-lg mb-8"
              >
                <div className="relative">
                  <motion.div 
                    className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-green-400 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, 10, 0] }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                      className="text-white"
                    >
                      <CheckCircle size={32} />
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    className="pt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.h2 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="text-2xl font-semibold text-green-800 dark:text-green-400 mb-4"
                    >
                      Thank you for your feedback!
                    </motion.h2>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-green-700 dark:text-green-500 mb-8 leading-relaxed max-w-md mx-auto"
                    >
                      We appreciate you taking the time to share your thoughts with us. Your feedback helps us improve MD Preview and create a better experience for everyone.
                    </motion.p>
                    
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1, type: "spring" }}
                      className="inline-block"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-80 group-hover:opacity-100 transition-opacity" />
                        <motion.button
              onClick={() => setFormState({
                name: "",
                email: "",
                feedback: "",
                submitted: false,
                error: false,
              })}
                          className="relative z-10 inline-flex items-center px-6 py-3 rounded-full bg-white dark:bg-gray-900 text-green-600 dark:text-green-400 font-medium shadow-md hover:shadow-lg transition-all"
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          <span>Submit another feedback</span>
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
          </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative"
              >
                <motion.div 
                  className="absolute -top-6 -left-6 -right-6 -bottom-6 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-xl"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                
                <motion.form 
                  onSubmit={handleSubmit} 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl p-10 shadow-xl border border-gray-200/50 dark:border-gray-800/50 space-y-8 relative z-10"
                >
            {formState.error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm border border-red-200/50 dark:border-red-900/30 p-4 rounded-xl flex items-start"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: [0, -10, 0] }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="mr-3 text-red-500 flex-shrink-0 mt-0.5"
                      >
                        <AlertCircle size={20} />
                      </motion.div>
                      <p className="text-red-700 dark:text-red-400">
                  Please fill out all fields before submitting.
                </p>
                    </motion.div>
                  )}
                  
                  <motion.div variants={itemVariants}>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Name</span>
              </label>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileFocus={{ scale: 1.01 }}
                      className="relative"
                    >
                      <AnimatePresence>
                        {activeField === 'name' && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg blur-md"
                          />
                        )}
                      </AnimatePresence>
              <input
                type="text"
                id="name"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        onFocus={() => setActiveField('name')}
                        onBlur={() => setActiveField(null)}
                        className="w-full px-5 py-4 border border-gray-300/50 dark:border-gray-700/50 rounded-xl bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none shadow-sm"
                placeholder="Your name"
              />
                    </motion.div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-purple-500" />
                      <span>Email</span>
              </label>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileFocus={{ scale: 1.01 }}
                      className="relative"
                    >
                      <AnimatePresence>
                        {activeField === 'email' && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg blur-md"
                          />
                        )}
                      </AnimatePresence>
              <input
                type="email"
                id="email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        onFocus={() => setActiveField('email')}
                        onBlur={() => setActiveField(null)}
                        className="w-full px-5 py-4 border border-gray-300/50 dark:border-gray-700/50 rounded-xl bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none shadow-sm"
                placeholder="your.email@example.com"
              />
                    </motion.div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label htmlFor="feedback" className="block text-sm font-medium mb-2 flex items-center">
                      <MessageSquareText className="h-4 w-4 mr-2 text-pink-500" />
                      <span>Feedback</span>
              </label>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileFocus={{ scale: 1.01 }}
                      className="relative"
                    >
                      <AnimatePresence>
                        {activeField === 'feedback' && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-500/10 to-blue-500/10 rounded-lg blur-md"
                          />
                        )}
                      </AnimatePresence>
              <textarea
                id="feedback"
                value={formState.feedback}
                onChange={(e) => setFormState({ ...formState, feedback: e.target.value })}
                        onFocus={() => setActiveField('feedback')}
                        onBlur={() => setActiveField(null)}
                rows={6}
                        className="w-full px-5 py-4 border border-gray-300/50 dark:border-gray-700/50 rounded-xl bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 outline-none shadow-sm"
                placeholder="Share your thoughts, suggestions, or report issues..."
              />
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    variants={itemVariants}
                    className="pt-4 flex justify-center"
                  >
                    <motion.div 
                      className="relative group"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 blur-sm transition-opacity" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                        animate={{
                          backgroundPosition: ["0% 0%", "100% 0%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "linear",
                        }}
                      />
            <button
              type="submit"
                        className="relative flex items-center px-8 py-4 rounded-full bg-white dark:bg-gray-900 hover:bg-opacity-95 dark:hover:bg-opacity-90 transition-all z-10"
            >
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-medium mr-2">
              Submit Feedback
                        </span>
                        <Send className="h-4 w-4 text-pink-500" />
            </button>
                    </motion.div>
                  </motion.div>
                </motion.form>
              </motion.div>
        )}
          </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  );
} 