import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { emojiCategories } from '@/data/emojiCategories';
import Image from 'next/image';

type EmojiType = {
  code: string;
  emoji: string;
  type?: 'animated' | 'native';
  gif?: string;
}

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string, type?: string, gif?: string) => void;
  isDark?: boolean;
}

export function EmojiPicker({ isOpen, onClose, onEmojiSelect, isDark = false }: EmojiPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('People');

  const filteredEmojis: EmojiType[] = searchTerm
    ? (Object.values(emojiCategories).flat() as EmojiType[]).filter(emoji =>
        emoji.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emoji.emoji.includes(searchTerm.toLowerCase())
      )
    : (emojiCategories[selectedCategory as keyof typeof emojiCategories] as EmojiType[]);

  const handleEmojiSelect = (emoji: EmojiType) => {
    onEmojiSelect(emoji.emoji, emoji.type, emoji.gif);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className={cn(
              "relative w-[480px] max-h-[600px] rounded-xl overflow-hidden",
              "border shadow-xl",
              isDark
                ? "bg-gray-900 border-gray-700"
                : "bg-white border-gray-200"
            )}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            <div className={cn(
              "px-4 py-3 border-b flex items-center justify-between",
              isDark ? "border-gray-700" : "border-gray-200"
            )}>
              <h2 className={cn(
                "text-lg font-semibold",
                isDark ? "text-gray-100" : "text-gray-900"
              )}>
                Emoji Picker
              </h2>
              <button
                onClick={onClose}
                className={cn(
                  "p-1 rounded-lg transition-colors",
                  isDark
                    ? "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                )}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <div className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg",
                isDark ? "bg-gray-800" : "bg-gray-100"
              )}>
                <Search size={18} className={isDark ? "text-gray-400" : "text-gray-500"} />
                <input
                  type="text"
                  placeholder="Search emojis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(
                    "bg-transparent w-full outline-none text-sm",
                    isDark ? "text-gray-100" : "text-gray-900",
                    "placeholder:text-gray-500"
                  )}
                />
              </div>
            </div>

            {!searchTerm && (
              <div className={cn(
                "px-4 border-b flex gap-2 overflow-x-auto",
                isDark ? "border-gray-700" : "border-gray-200"
              )}>
                {Object.keys(emojiCategories).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-3 py-2 text-sm font-medium whitespace-nowrap",
                      "border-b-2 transition-colors",
                      selectedCategory === category
                        ? isDark
                          ? "border-blue-500 text-blue-500"
                          : "border-blue-600 text-blue-600"
                        : isDark
                          ? "border-transparent text-gray-400 hover:text-gray-200"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            <div className="p-4 overflow-y-auto max-h-[400px]">
              <div className="grid grid-cols-8 gap-2">
                {filteredEmojis.map((emoji: EmojiType, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmojiSelect(emoji)}
                    className={cn(
                      "p-2 rounded-lg text-2xl flex items-center justify-center",
                      "transition-colors hover:scale-110 transform duration-100",
                      isDark
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-100"
                    )}
                    title={emoji.code}
                  >
                    {emoji.type === 'animated' ? (
                      <Image
                        src={emoji.gif || ''}
                        alt={emoji.code}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-cover rounded"
                      />
                    ) : (
                      <span className="text-2xl">{emoji.emoji}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 