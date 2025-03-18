import React, { useState, useRef, useEffect } from 'react';
import { Menu, ChevronDown, Clock, Search, Save, Share, MoreVertical, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';

interface EditorHeaderProps {
  title: string;
  updatedAt: string;
  onTitleChange: (newTitle: string) => void;
  onSave: () => void;
  onShare: () => void;
  onSearch: () => void;
  onMenuToggle: () => void;
}

export function EditorHeader({
  title,
  updatedAt,
  onTitleChange,
  onSave,
  onShare,
  onSearch,
  onMenuToggle,
}: EditorHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isSaving, setIsSaving] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && 
          moreButtonRef.current && !moreButtonRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleSubmit = () => {
    if (editedTitle.trim()) {
      onTitleChange(editedTitle);
    } else {
      setEditedTitle(title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    onSave();
    
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleShare = () => {
    onShare();
  };

  const handleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      onSearch();
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        <div className="flex flex-col py-3">
          <div 
            className="group cursor-pointer"
            onClick={handleTitleClick}
          >
            {isEditing ? (
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={editedTitle}
                  onChange={handleTitleChange}
                  onBlur={handleTitleSubmit}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "w-[300px] px-3 py-1.5 rounded-lg text-base font-medium",
                    "transition-all duration-200",
                    "focus:outline-none ring-1",
                    isDark 
                      ? "bg-gray-900 text-gray-100 ring-gray-700 focus:ring-blue-500/50" 
                      : "bg-white text-gray-800 ring-gray-200 focus:ring-blue-500/30",
                    "placeholder-gray-500"
                  )}
                  placeholder="Document title..."
                />
              </motion.div>
            ) : (
              <div className="flex items-center group">
                <motion.h2 
                  className={cn(
                    "text-base font-medium truncate max-w-[300px]",
                    isDark 
                      ? "text-gray-100 group-hover:text-white" 
                      : "text-gray-700 group-hover:text-gray-900"
                  )}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {title}
                </motion.h2>
                <ChevronDown className={cn(
                  "h-4 w-4 ml-1.5 opacity-0 group-hover:opacity-100",
                  "transition-all duration-200",
                  isDark ? "text-gray-400" : "text-gray-500"
                )} />
              </div>
            )}
          </div>
          <div className={cn(
            "flex items-center text-xs",
            isDark ? "text-gray-500" : "text-gray-500"
          )}>
            <Clock className="h-3 w-3 mr-1.5" />
            <span className="truncate">{new Date(updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            className={cn(
              "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2",
              "w-1/3 min-w-[300px] z-20"
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <div className={cn(
              "flex items-center rounded-lg px-3 py-1.5 ring-1",
              isDark 
                ? "bg-gray-900 ring-gray-700" 
                : "bg-white ring-gray-200",
              "shadow-lg"
            )}>
              <Search size={16} className={cn(
                "flex-shrink-0 mr-2",
                isDark ? "text-gray-400" : "text-gray-500"
              )} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search in document..."
                className={cn(
                  "w-full bg-transparent border-none focus:outline-none text-sm",
                  isDark ? "text-gray-100 placeholder-gray-500" : "text-gray-800 placeholder-gray-400"
                )}
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className={cn(
                  "flex-shrink-0 ml-2 rounded-full p-1",
                  "hover:bg-gray-500/10",
                  "transition-colors duration-150",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center space-x-1 px-3 py-2 relative">
        <motion.button
          className={cn(
            "p-2.5 rounded-lg",
            "transition-colors duration-200",
            "hover:bg-gray-500/10 active:bg-gray-500/20",
            isSearchOpen ? (isDark ? "text-blue-400" : "text-blue-500") : (isDark ? "text-gray-300" : "text-gray-600")
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSearch}
          title="Search in document"
        >
          <Search size={18} />
        </motion.button>

        <motion.button
          className={cn(
            "p-2.5 rounded-lg relative",
            "transition-colors duration-200",
            "hover:bg-gray-500/10 active:bg-gray-500/20",
            isDark ? "text-gray-300" : "text-gray-600"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          title="Save document"
          disabled={isSaving}
        >
          <AnimatePresence>
            {isSaving ? (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className={cn(
                    "h-4 w-4 rounded-full border-2 border-t-transparent",
                    isDark ? "border-blue-400" : "border-blue-500"
                  )}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                />
              </motion.div>
            ) : (
              <Save size={18} />
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          className={cn(
            "p-2.5 rounded-lg",
            "transition-colors duration-200",
            "hover:bg-gray-500/10 active:bg-gray-500/20",
            isDark ? "text-gray-300" : "text-gray-600"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          title="Share document"
        >
          <Share size={18} />
        </motion.button>

        <div className={cn(
          "w-px h-5 mx-2",
          isDark ? "bg-gray-800" : "bg-gray-200"
        )} />

        <motion.button
          ref={moreButtonRef}
          className={cn(
            "p-2.5 rounded-lg",
            "transition-colors duration-200",
            "hover:bg-gray-500/10 active:bg-gray-500/20",
            isDropdownOpen ? (isDark ? "bg-gray-800" : "bg-gray-100") : "",
            isDark ? "text-gray-300" : "text-gray-600"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          title="More options"
        >
          <MoreVertical size={18} />
        </motion.button>
      </div>
    </header>
  );
} 