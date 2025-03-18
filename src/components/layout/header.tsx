"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu as MenuIcon, X, Github } from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";
import { useTheme } from "../theme-provider";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Editor", href: "/" },
  { name: "Features", href: "/landing#features" },
  { name: "Docs", href: "/docs" },
  { name: "Changelog", href: "/changelog" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-500 ${
      isScrolled ? 'top-2' : 'top-4'
    }`}>
      <nav className={`relative px-6 py-3 rounded-2xl backdrop-blur-xl transition-all duration-300 ${
        isDarkMode 
          ? isScrolled 
            ? 'bg-black/40 shadow-lg shadow-purple-500/10' 
            : 'bg-black/20'
          : isScrolled
            ? 'bg-white/60 shadow-lg shadow-purple-500/5'
            : 'bg-white/40'
      }`}>
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className={`absolute inset-0 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10' 
              : 'bg-gradient-to-r from-purple-200/20 via-transparent to-blue-200/20'
          }`} />
        </div>

        <div className="relative flex items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`relative w-10 h-10 rounded-xl overflow-hidden ${
                isDarkMode ? 'bg-white/10' : 'bg-black/5'
              }`}>
                <div className={`absolute inset-0 ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20'
                    : 'bg-gradient-to-br from-purple-500/10 to-blue-500/10'
                }`} />
                <div className="relative h-full flex items-center justify-center">
                  <span className={`text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>M</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`text-lg font-bold tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Markdown
                </span>
                <span className={`text-xs font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Preview Tool
                </span>
                </div>
            </motion.div>
          </Link>
            
            {!isMobile && (
            <div className="hidden md:flex md:items-center md:space-x-1">
              <div className={`p-1 rounded-xl ${
                isDarkMode ? 'bg-white/5' : 'bg-black/5'
              }`}>
                {navigation.map((item) => {
                  const isActive = item.href === "/" 
                        ? pathname === "/" 
                        : pathname.startsWith(item.href.split("#")[0]);
                    
                    return (
                    <motion.div
                        key={item.name}
                      className="relative inline-block"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          href={item.href}
                        className={`relative px-4 py-2 text-sm font-medium rounded-lg inline-block transition-colors ${
                            isActive
                              ? isDarkMode 
                              ? 'text-white bg-white/10' 
                              : 'text-gray-900 bg-black/10'
                              : isDarkMode 
                              ? 'text-gray-300 hover:text-white hover:bg-white/5'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                        }`}
                      >
                            {item.name}
                        </Link>
                    </motion.div>
                    );
                  })}
              </div>
            </div>
            )}
          
          <div className="flex items-center space-x-4">
          {!isMobile && (
              <>
              <motion.a
                href="https://github.com/azateser/md-preview-tool"
                target="_blank"
                rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                  <Github className="w-5 h-5" />
                </motion.a>
              
              <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/"
                    className={`px-5 py-2 text-sm font-medium rounded-lg inline-flex items-center transition-all ${
                      isDarkMode
                        ? 'bg-white text-black hover:bg-opacity-90'
                        : 'bg-black text-white hover:bg-opacity-80'
                    }`}
                  >
                    <span>Editor</span>
                    <motion.span 
                      className="ml-2 text-xs px-2 py-0.5 rounded-md bg-opacity-20"
                      animate={{ 
                        backgroundColor: ['rgba(147, 51, 234, 0.2)', 'rgba(59, 130, 246, 0.2)'],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      Beta
                    </motion.span>
                              </Link>
                </motion.div>
                  </>
                )}

            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
              <ThemeToggle />
            </div>
          
          {isMobile && (
              <motion.button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: 45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -45, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: -45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 45, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MenuIcon className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden mt-4"
            >
              <div className={`p-1 rounded-xl space-y-1 ${
                isDarkMode ? 'bg-white/5' : 'bg-black/5'
              }`}>
                {navigation.map((item) => {
                  const isActive = item.href === "/" 
                    ? pathname === "/" 
                    : pathname.startsWith(item.href.split("#")[0]);
                
                return (
                  <motion.div
                    key={item.name}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={item.href}
                        className={`block px-4 py-2.5 text-base font-medium rounded-lg transition-colors ${
                        isActive
                          ? isDarkMode 
                              ? 'bg-white/10 text-white'
                              : 'bg-black/10 text-gray-900'
                          : isDarkMode 
                              ? 'text-gray-400 hover:text-white hover:bg-white/5'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
              
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/editor"
                    className={`block w-full px-4 py-3 text-center text-base font-medium rounded-lg transition-all ${
                      isDarkMode
                        ? 'bg-white text-black hover:bg-opacity-90'
                        : 'bg-black text-white hover:bg-opacity-80'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Open Editor
                  </Link>
                </motion.div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
    </header>
  );
} 