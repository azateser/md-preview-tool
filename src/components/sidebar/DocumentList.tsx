import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { File, Star, MoreHorizontal, Edit, Download, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Fragment } from 'react';
import { Draggable } from '@hello-pangea/dnd';

type Document = {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
};

type DocumentListProps = {
  documents: Document[];
  viewMode: 'grid' | 'list';
  activeDocumentId: string | null;
  favorites: string[];
  isDraggingOver: boolean;
  isDarkMode: boolean;
  formatDate: (date: Date) => string;
  toggleFavorite: (id: string, e: React.MouseEvent) => void;
  setActiveDocumentId: (id: string) => void;
  deleteDocument: (id: string) => void;
  renameDocument: (id: string, newTitle: string) => void;
  exportMarkdown: (id: string, filename?: string) => void;
};

export const DocumentList = ({
  documents,
  viewMode,
  activeDocumentId,
  favorites,
  isDraggingOver,
  isDarkMode,
  formatDate,
  toggleFavorite,
  setActiveDocumentId,
  deleteDocument,
  renameDocument,
  exportMarkdown
}: DocumentListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRenameClick = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditingTitle(currentTitle);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleRenameSubmit = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editingTitle.trim()) {
      renameDocument(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleExportMarkdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    exportMarkdown(id, "README.md");
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            className="grid grid-cols-2 gap-3 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            key="grid-view"
          >
            {documents.map((doc) => {
              return (
                <motion.div
                  key={`grid-${doc.id}`}
                  onClick={() => setActiveDocumentId(doc.id)}
                  className={cn(
                    "p-4 rounded-xl cursor-pointer border transition-all",
                    activeDocumentId === doc.id
                      ? isDarkMode 
                        ? 'bg-gradient-to-br from-blue-900/20 to-emerald-900/20 border-blue-800/30 shadow-lg shadow-blue-900/10' 
                      : 'bg-gradient-to-br from-blue-100 to-emerald-100 border-blue-200/70 shadow-lg shadow-blue-100/50'
                      : isDarkMode
                        ? 'bg-gray-800/40 border-gray-700/30 hover:bg-gray-800/60'
                        : 'bg-white/80 border-gray-200/50 hover:bg-gray-100/80'
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col h-24">
                    <div className="flex justify-between items-start mb-2">
                      <File className={cn(
                        "h-4 w-4",
                        activeDocumentId === doc.id
                          ? isDarkMode ? 'text-blue-400' : 'text-blue-500'
                          : isDarkMode ? 'text-gray-500' : 'text-gray-500'
                      )} />
                      <div className="flex space-x-1">
                        {favorites.includes(doc.id) && (
                          <Star className={`h-3.5 w-3.5 ${
                            isDarkMode ? 'text-yellow-400' : 'text-yellow-500'
                          } fill-current`} />
                        )}
                      </div>
                    </div>
                    <h3 className={`text-sm font-medium truncate ${
                      activeDocumentId === doc.id
                        ? isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {doc.title}
                    </h3>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {formatDate(doc.updatedAt)}
                    </p>
                    <div className="flex-1 flex items-end">
                      <p className="text-xs truncate text-gray-500 italic">
                        {doc.content.split('\n')[0].replace(/[#*`]/g, '').slice(0, 40)}...
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            key="list-view"
            className="px-2"
          >
            <ul className={cn(
              "space-y-1.5 list-none",
              isDraggingOver && (isDarkMode ? 'bg-blue-900/10' : 'bg-blue-50/50')
            )}>
              {documents.map((document, index) => (
                <Draggable key={document.id} draggableId={document.id} index={index}>
                  {(dragProvided, dragSnapshot) => (
                    <li
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      className={cn(
                        "list-none transition-all",
                        dragSnapshot.isDragging && "transform-gpu"
                      )}
                      style={{
                        ...dragProvided.draggableProps.style,
                        listStyle: 'none',
                        position: dragSnapshot.isDragging ? 'relative' : 'static',
                        zIndex: dragSnapshot.isDragging ? 50 : 'auto',
                        transform: dragSnapshot.isDragging 
                          ? dragProvided.draggableProps.style?.transform
                          : "none",
                        cursor: dragSnapshot.isDragging ? 'grabbing' : 'grab',
                        touchAction: "none",
                        backgroundColor: dragSnapshot.isDragging 
                          ? isDarkMode 
                            ? 'rgba(30, 58, 138, 0.3)' 
                            : 'rgba(219, 234, 254, 0.9)'
                          : 'transparent',
                        backdropFilter: dragSnapshot.isDragging ? 'blur(8px)' : 'none',
                        boxShadow: dragSnapshot.isDragging 
                          ? '0 10px 25px -5px rgba(0, 0, 0, 0.2)' 
                          : 'none',
                        border: dragSnapshot.isDragging 
                          ? isDarkMode 
                            ? '1px solid rgba(59, 130, 246, 0.2)'
                            : '1px solid rgba(59, 130, 246, 0.1)'
                          : 'none'
                      }}
                    >
                      <div
                        onClick={() => editingId !== document.id && setActiveDocumentId(document.id)}
                        className={cn(
                          "relative group w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center",
                          dragSnapshot.isDragging
                            ? isDarkMode 
                              ? 'bg-blue-900/30 shadow-xl border border-blue-500/20 backdrop-blur-sm'
                              : 'bg-blue-100/90 shadow-xl border border-blue-200/20 backdrop-blur-sm'
                            : activeDocumentId === document.id
                              ? isDarkMode 
                                ? 'bg-gradient-to-r from-blue-900/30 to-emerald-900/30 text-blue-400 border border-blue-800/30'
                              : 'bg-gradient-to-r from-blue-50 to-emerald-50 text-blue-600 border border-blue-200/50'
                              : isDarkMode
                                ? 'text-gray-300 hover:bg-gray-800/40 border border-transparent'
                                : 'text-gray-700 hover:bg-gray-100/40 border border-transparent'
                        )}
                        style={{
                          transform: dragSnapshot.isDragging ? 'scale(1.02)' : 'none',
                          transition: dragSnapshot.isDragging ? 'none' : 'all 0.2s ease',
                          cursor: dragSnapshot.isDragging ? 'grabbing' : 'pointer',
                          willChange: dragSnapshot.isDragging ? 'transform' : 'auto'
                        }}
                      >
                        <div className="flex-1 flex items-center min-w-0">
                          <File className={cn(
                            "h-4 w-4 flex-shrink-0 mr-3",
                            activeDocumentId === document.id
                              ? isDarkMode ? 'text-blue-400' : 'text-blue-500'
                              : isDarkMode ? 'text-gray-500' : 'text-gray-500'
                          )} />
                          <div className="flex flex-col min-w-0">
                            {editingId === document.id ? (
                              <form onSubmit={(e) => handleRenameSubmit(document.id, e)} className="pr-2">
                                <input
                                  ref={inputRef}
                                  type="text"
                                  value={editingTitle}
                                  onChange={(e) => setEditingTitle(e.target.value)}
                                  onBlur={() => setEditingId(null)}
                                  className={`w-full py-0.5 px-1 text-sm rounded-md ${
                                    isDarkMode 
                                      ? 'bg-gray-800 text-white border border-gray-700 focus:border-blue-600' 
                                      : 'bg-white text-gray-900 border border-gray-300 focus:border-blue-500'
                                  } focus:outline-none focus:ring-1 ${
                                    isDarkMode ? 'focus:ring-blue-600' : 'focus:ring-blue-500'
                                  }`}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </form>
                            ) : (
                              <span className="truncate font-medium">{document.title}</span>
                            )}
                            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              {formatDate(document.updatedAt)}
                            </span>
                          </div>
                        </div>
                        
                        <Menu as="div" className="relative">
                          {({ open }) => (
                            <>
                              <div className="relative w-8 h-8 flex items-center justify-center">
                                {favorites.includes(document.id) && (
                                  <Star 
                                    className={cn(
                                      "h-3.5 w-3.5 absolute",
                                      isDarkMode ? 'text-yellow-400' : 'text-yellow-500',
                                      'fill-current transition-opacity',
                                      open || dragSnapshot.isDragging ? 'opacity-0' : 'group-hover:opacity-0'
                                    )}
                                  />
                                )}

                                <Menu.Button 
                                  className={cn(
                                    "p-2 rounded-lg absolute transition-opacity",
                                    isDarkMode ? 'hover:bg-gray-700/80' : 'hover:bg-gray-200/80',
                                    open ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                  )}
                                >
                                  <MoreHorizontal className={`h-3.5 w-3.5 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                  }`} />
                                </Menu.Button>
                              </div>
                              
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items 
                                  className={cn(
                                    "absolute z-[9999] mt-1 w-48 origin-top-right rounded-xl p-1.5",
                                    isDarkMode 
                                      ? 'bg-gray-800/95 text-gray-300 border border-gray-700/50 backdrop-blur-lg' 
                                      : 'bg-white/95 text-gray-700 border border-gray-200/50 shadow-lg backdrop-blur-lg'
                                  )}
                                  style={{
                                    right: 0,
                                    top: '100%'
                                  }}
                                >
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={(e) => toggleFavorite(document.id, e)}
                                        className={`${
                                          active 
                                            ? isDarkMode ? 'bg-gray-700/60' : 'bg-gray-200/80' 
                                            : ''
                                        } flex w-full items-center px-3 py-2 text-sm rounded-lg`}
                                      >
                                        <Star className={`h-4 w-4 mr-2.5 ${
                                          favorites.includes(document.id)
                                            ? 'text-yellow-500 fill-current'
                                            : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`} />
                                        {favorites.includes(document.id) ? 'Unfavorite' : 'Add to favorites'}
                                      </button>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={(e) => handleRenameClick(document.id, document.title, e)}
                                        className={`${
                                          active 
                                            ? isDarkMode ? 'bg-gray-700/60' : 'bg-gray-200/80' 
                                            : ''
                                        } flex w-full items-center px-3 py-2 text-sm rounded-lg`}
                                      >
                                        <Edit className={`h-4 w-4 mr-2.5 ${
                                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`} />
                                        Rename
                                      </button>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={(e) => handleExportMarkdown(document.id, e)}
                                        className={`${
                                          active 
                                            ? isDarkMode ? 'bg-gray-700/60' : 'bg-gray-200/80' 
                                            : ''
                                        } flex w-full items-center px-3 py-2 text-sm rounded-lg`}
                                      >
                                        <Download className={`h-4 w-4 mr-2.5 ${
                                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`} />
                                        Export Markdown
                                      </button>
                                    )}
                                  </Menu.Item>
                                  <div className={`my-1 h-px ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'}`}></div>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => deleteDocument(document.id)}
                                        className={`${
                                          active 
                                            ? isDarkMode ? 'bg-red-900/20' : 'bg-red-50/60' 
                                            : ''
                                        } flex w-full items-center px-3 py-2 text-sm rounded-lg ${
                                          isDarkMode ? 'text-red-400' : 'text-red-500'
                                        }`}
                                      >
                                        <Trash2 className="h-4 w-4 mr-2.5" />
                                        Delete
                                      </button>
                                    )}
                                  </Menu.Item>
                                </Menu.Items>
                              </Transition>
                            </>
                          )}
                        </Menu>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 