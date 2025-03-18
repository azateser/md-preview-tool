import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

type AddItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: 'folder' | 'tag';
  onAdd: (name: string, color?: string) => void;
};

export const AddItemModal = ({ isOpen, onClose, type, onAdd }: AddItemModalProps) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const colors = ['red', 'yellow', 'green', 'blue', 'purple', 'pink'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name, type === 'tag' ? selectedColor : undefined);
      setName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`relative w-full max-w-md p-6 rounded-xl shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${
            isDarkMode 
              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
              : 'text-gray-500 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>
          Add New {type.charAt(0).toUpperCase() + type.slice(1)}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="name" 
              className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
              placeholder={`Enter ${type} name...`}
              autoFocus
            />
          </div>

          {type === 'tag' && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full ${
                      selectedColor === color ? 'ring-2 ring-offset-2' : ''
                    } ${isDarkMode ? 'ring-offset-gray-800' : 'ring-offset-white'} ring-${color}-500 bg-${color}-500`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                isDarkMode 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Add {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}; 