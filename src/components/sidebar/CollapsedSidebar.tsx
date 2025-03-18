import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, FilePlus, List, Star, Clock, Settings } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

type CollapsedSidebarProps = {
  setCollapsed: (collapsed: boolean) => void;
  createDocument: () => void;
  selectedTab: number;
  setSelectedTab: (index: number) => void;
};

export const CollapsedSidebar = ({
  setCollapsed,
  createDocument,
  selectedTab,
  setSelectedTab,
}: CollapsedSidebarProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const tabs = [
    { name: 'All', icon: List },
    { name: 'Favorites', icon: Star },
    { name: 'Recent', icon: Clock },
  ];

  return (
    <div className={`h-full border-r ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-white'} w-16 transition-all duration-300 relative`}>
      <div className={`p-2 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} flex flex-col items-center sticky top-0 bg-inherit z-10`}>
        <motion.button
          onClick={() => setCollapsed(false)}
          className={`p-2 rounded-lg mb-2 ${
            isDarkMode 
              ? 'bg-gray-800 text-gray-400 hover:text-blue-400' 
              : 'bg-gray-100 text-gray-600 hover:text-blue-600'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>
        
        <motion.button
          onClick={createDocument}
          className={`p-2 rounded-lg ${
            isDarkMode 
              ? 'bg-gray-800 text-gray-400 hover:text-blue-400' 
              : 'bg-gray-100 text-gray-600 hover:text-blue-600'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FilePlus className="h-4 w-4" />
        </motion.button>
      </div>
      
      <div className="flex-1 flex flex-col items-center py-2 space-y-2 overflow-y-auto scrollbar-hide">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.name}
            onClick={() => {
              setSelectedTab(index);
              setCollapsed(false);
            }}
            className={`p-2 rounded-lg w-12 h-12 flex items-center justify-center ${
              index === selectedTab 
                ? isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                : isDarkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {React.createElement(tab.icon, { className: "h-4 w-4" })}
          </motion.button>
        ))}
      </div>
      
      <div className={`p-2 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} flex flex-col items-center sticky bottom-0 bg-inherit z-10`}>
        <motion.button
          className={`p-2 rounded-lg ${
            isDarkMode 
              ? 'text-gray-400 hover:bg-gray-800' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Settings className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}; 