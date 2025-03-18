import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className="p-4 sticky top-0 z-10 backdrop-blur-lg bg-opacity-80">
      <div className="relative">
        <motion.input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full py-2.5 pl-10 pr-4 text-sm ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 text-gray-200 focus:ring-blue-500/30 placeholder-gray-500' 
              : 'bg-gray-50/80 border-gray-200/50 text-gray-700 focus:ring-blue-500/30 placeholder-gray-400'
          } border rounded-xl focus:outline-none focus:ring-2 transition-all`}
          initial={{ opacity: 0.8 }}
          whileFocus={{ opacity: 1 }}
        />
        <Search className={`absolute left-3.5 top-3 h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>
    </div>
  );
}; 