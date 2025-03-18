import React from 'react';
import { List, Star, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from "framer-motion";
import { useTheme } from '@/components/theme-provider';

interface TabNavigationProps {
  selectedTab: number;
  setSelectedTab: (index: number) => void;
  isCollapsed?: boolean;
}

const tabs = [
  { name: 'All', icon: List },
  { name: 'Favorites', icon: Star },
  { name: 'Recent', icon: Clock },
];

export function TabNavigation({ selectedTab, setSelectedTab, isCollapsed = false }: TabNavigationProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <nav className="px-2.5 py-2">
      <div 
        className={cn(
          "flex rounded-lg p-0.5",
          isDarkMode 
            ? "bg-gray-900/50 border border-white/[0.03]"
            : "bg-gray-100/70 border border-gray-200/50",
          isCollapsed ? "flex-col gap-0.5" : "items-stretch"
        )}
      >
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isSelected = selectedTab === index;

          return (
            <motion.button
              key={tab.name}
              onClick={() => setSelectedTab(index)}
              className={cn(
                "flex items-center relative",
                isCollapsed 
                  ? "p-1.5 justify-center rounded-md" 
                  : "flex-1 px-2.5 py-1.5 justify-center rounded-md",
                "transition-all duration-200",
                isSelected
                  ? isDarkMode 
                    ? "text-white bg-gradient-to-b from-gray-700/80 to-gray-800/80"
                    : "text-gray-800 bg-gradient-to-b from-white to-gray-50"
                  : isDarkMode
                    ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/60"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <Icon className={cn(
                  "w-3.5 h-3.5 transition-transform",
                  isSelected && (isDarkMode ? "text-blue-400" : "text-blue-500")
                )} />
                {!isCollapsed && (
                  <span className={cn(
                    "text-xs font-medium tracking-wide",
                    isSelected 
                      ? isDarkMode ? "text-gray-200" : "text-gray-800" 
                      : isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    {tab.name}
                  </span>
                )}
              </div>
              {isSelected && (
                <motion.div
                  layoutId="activeTab"
                  className={cn(
                    "absolute inset-0 rounded-md",
                    isDarkMode
                      ? "ring-1 ring-white/[0.03] shadow-sm bg-gradient-to-b from-white/[0.02] to-transparent"
                      : "ring-1 ring-black/[0.03] shadow-sm bg-gradient-to-b from-black/[0.01] to-transparent"
                  )}
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
} 