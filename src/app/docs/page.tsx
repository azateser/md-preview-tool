"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { Book, FileText, Terminal, Blocks } from "lucide-react";

export default function DocsPage() {
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

  const docSections = [
    {
      title: "Getting Started",
      icon: <Book size={24} />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Introduction</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome to our Markdown editor! This tool helps you create beautiful README files and documentation with ease.
              With our editor, you can write Markdown with real-time preview and AI-powered assistance.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Quick Start</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Get started with these simple steps:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Click the &quot;Try Editor&quot; button on the homepage</li>
              <li>Choose a template or start from scratch</li>
              <li>Write your content in Markdown format</li>
              <li>Use the live preview to see your changes</li>
              <li>Save or export your document when finished</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      title: "Features",
      icon: <Blocks size={24} />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Markdown Syntax</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our editor supports standard Markdown syntax plus additional features:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-700 dark:text-gray-300">
{`# Heading 1
## Heading 2
**Bold Text**
*Italic Text*
- List Item
1. Numbered List
\`\`\`code block\`\`\`
[Link](url)`}
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Live Preview</h3>
            <p className="text-gray-600 dark:text-gray-300">
              See your changes in real-time with our side-by-side preview feature. The preview updates automatically as you type,
              helping you catch formatting issues immediately.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">AI Templates</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Use our AI-powered templates to quickly generate professional README files. The AI analyzes your project
              and creates a customized template that you can easily modify.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Advanced Usage",
      icon: <Terminal size={24} />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Custom Templates</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create and save your own templates for future use. Custom templates help maintain consistency across your projects
              and save time when creating new documentation.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <code className="text-sm">
                  Ctrl/⌘ + B: Bold<br/>
                  Ctrl/⌘ + I: Italic<br/>
                  Ctrl/⌘ + K: Link<br/>
                  Ctrl/⌘ + S: Save
                </code>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Theme Customization</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Switch between light and dark themes, and customize the preview appearance to match your preferences.
              The editor automatically saves your theme preference for future sessions.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <PageLayout activePage="docs">
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

        <div className="container mx-auto px-4 py-12 max-w-4xl relative z-20">
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
                <FileText className="h-7 w-7 text-blue-500 relative z-10" />
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
                Documentation
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-12"
            >
              Everything you need to know about using the Markdown editor and its features.
            </motion.p>

            <div className="space-y-12">
              {docSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="relative"
                >
                  <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4">
                        {section.icon}
                      </div>
                      <h2 className="text-2xl font-semibold">{section.title}</h2>
                    </div>
                    {section.content}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
} 