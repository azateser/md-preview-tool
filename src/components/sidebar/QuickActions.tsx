import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

type QuickActionsProps = {
  createDocument: () => void;
};

export const QuickActions = ({ createDocument }: QuickActionsProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className="px-4 pt-2 pb-4">
      <motion.button
        onClick={createDocument}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl mb-4 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-violet-900/30 via-blue-900/30 to-emerald-900/30 text-gray-200 hover:from-violet-800/40 hover:via-blue-800/40 hover:to-emerald-800/40' 
            : 'bg-gradient-to-r from-violet-50 via-blue-50 to-emerald-50 text-gray-800 hover:from-violet-100 hover:via-blue-100 hover:to-emerald-100'
        } transition-all shadow-sm`}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center truncate">
          <Sparkles className={`h-4 w-4 mr-2 flex-shrink-0 ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`} />
          <span className="truncate">Create New Document</span>
        </div>
        <div className={`text-xs py-1 px-2.5 rounded-full flex-shrink-0 ${
          isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-600'
        }`}>
          +
        </div>
      </motion.button>
    </div>
  );
}; 