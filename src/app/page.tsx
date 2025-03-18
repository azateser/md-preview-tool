"use client";

import { MarkdownEditor } from "@/components/editor/markdown-editor";
import { Sidebar } from "@/components/layout/sidebar";
import { useEffect, useState, useCallback } from "react";
import { useDocumentStore } from "@/store/document-store";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";

export default function Home() {
  const { documents, createDocument, hasHydrated } = useDocumentStore();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isMounted, setIsMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newX = (e.clientX - window.innerWidth / 2) * 0.1;
    const newY = (e.clientY - window.innerHeight / 2) * 0.1;
    setMousePosition({ x: newX, y: newY });
  }, []);

  useEffect(() => {
    if (hasHydrated && documents.length === 0 && !isMounted) {
      createDocument();
    }
    
    setIsMounted(true);
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasHydrated, documents.length, createDocument, isMounted, handleMouseMove]);

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  return (
    <div className={`flex h-screen relative overflow-hidden ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className={`
            absolute w-[800px] h-[800px] rounded-full
            ${isDark 
              ? 'bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-purple-500/10' 
              : 'bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-purple-500/5'
            }
            blur-[100px]
          `}
          style={{
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
          }}
          animate={{
            x: `calc(-50% + ${mousePosition.x}px)`,
            y: `calc(-50% + ${mousePosition.y}px)`,
          }}
          transition={{
            type: "spring",
            damping: 50,
            stiffness: 100,
            mass: 1,
          }}
        />
        
        <motion.div
          className={`
            absolute w-[600px] h-[600px] rounded-full
            ${isDark 
              ? 'bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10' 
              : 'bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-rose-500/5'
            }
            blur-[100px]
          `}
          style={{
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
          }}
          animate={{
            x: `calc(-50% - ${mousePosition.x}px)`,
            y: `calc(-50% - ${mousePosition.y}px)`,
          }}
          transition={{
            type: "spring",
            damping: 50,
            stiffness: 100,
            mass: 1.2,
          }}
        />
      </div>
      
      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={handleSidebarToggle} />
        <motion.div 
          className="flex-1 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <MarkdownEditor onMenuToggle={handleSidebarToggle} />
        </motion.div>
      </div>
    </div>
  );
}
