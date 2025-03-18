import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Grid, List, FilePlus } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { ViewMode } from './types';

type SidebarHeaderProps = {
  documentsCount: number;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  setCollapsed: (collapsed: boolean) => void;
  createDocument: () => void;
};

export const SidebarHeader = ({
  documentsCount,
  viewMode,
  setViewMode,
  setCollapsed,
  createDocument
}: SidebarHeaderProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <motion.div 
      className={`p-4 border-b ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200/70'} flex items-center justify-between sticky top-0 z-10 backdrop-blur-lg bg-opacity-80 ${isDarkMode ? 'bg-gray-900/80' : 'bg-white/90'}`}
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 opacity-30">
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-violet-600/20 via-blue-500/20 to-emerald-500/20' 
            : 'bg-gradient-to-r from-violet-200/50 via-blue-200/50 to-emerald-200/50'
        }`} />
      </div>
      
      <div className="relative z-10 flex items-center space-x-3">
        <motion.button
          onClick={() => setCollapsed(true)}
          className={`p-2 rounded-lg ${
            isDarkMode 
              ? 'bg-gray-800/80 text-gray-400 hover:text-blue-400 hover:bg-gray-800' 
              : 'bg-gray-100/90 text-gray-600 hover:text-blue-600 hover:bg-gray-200/90'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>
        
        <div>
          <h2 className="text-lg font-bold tracking-tight">
            <span className={`${
              isDarkMode 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-blue-600 to-emerald-600'
            }`}>
              Markdown
            </span>
          </h2>
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {documentsCount} document{documentsCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <motion.button
          onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          className={`p-2 rounded-lg ${
            isDarkMode 
              ? 'bg-gray-800/80 text-gray-400 hover:text-blue-400 hover:bg-gray-800' 
              : 'bg-gray-100/90 text-gray-600 hover:text-blue-600 hover:bg-gray-200/90'
          } relative z-10`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {viewMode === 'list' ? (
            <Grid className="h-4 w-4" />
          ) : (
            <List className="h-4 w-4" />
          )}
        </motion.button>
        
        <motion.button
          onClick={createDocument}
          className={`p-2 rounded-lg ${
            isDarkMode 
              ? 'bg-gray-800/80 text-gray-400 hover:text-blue-400 hover:bg-gray-800' 
              : 'bg-gray-100/90 text-gray-600 hover:text-blue-600 hover:bg-gray-200/90'
          } relative z-10`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FilePlus className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}; 