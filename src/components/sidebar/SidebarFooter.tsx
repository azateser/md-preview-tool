import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Info, Trash, Download, Moon, Sun, ChevronUp, ChevronDown, X, AlertCircle } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useDocumentStore } from '@/store/document-store';
import Link from 'next/link';
import JSZip from 'jszip';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmType?: 'danger' | 'primary' | 'warning';
}

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm",
  confirmType = "danger"
}: ConfirmModalProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[10000]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`${
                isDarkMode 
                  ? 'bg-gray-900 border border-gray-800' 
                  : 'bg-white border border-gray-200'
              } p-6 rounded-xl shadow-2xl max-w-md w-[90vw] sm:w-full mx-auto`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {confirmType === "danger" && <AlertCircle className="w-5 h-5 mr-2 text-red-500" />}
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {title}
                  </h3>
                </div>
                <button 
                  onClick={onClose}
                  className={`p-1 rounded-lg ${
                    isDarkMode 
                      ? 'hover:bg-gray-800 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {message}
              </div>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={onClose}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    confirmType === "danger"
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                >
                  {confirmText}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

const InfoModal = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = "OK"
}: InfoModalProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[10000]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`${
                isDarkMode 
                  ? 'bg-gray-900 border border-gray-800' 
                  : 'bg-white border border-gray-200'
              } p-6 rounded-xl shadow-2xl max-w-md w-[90vw] sm:w-full mx-auto`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-500" />
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {title}
                  </h3>
                </div>
                <button 
                  onClick={onClose}
                  className={`p-1 rounded-lg ${
                    isDarkMode 
                      ? 'hover:bg-gray-800 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {message}
              </div>
              
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    isDarkMode 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={onClose}
                >
                  {buttonText}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export const SidebarFooter = () => {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { documents } = useDocumentStore();
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportModalMessage, setExportModalMessage] = useState('');

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  const deleteAllDocuments = () => {
    const documentStore = JSON.parse(localStorage.getItem('md-preview-documents') || '{}');
    if (documentStore.state) {
      documentStore.state.documents = [];
      localStorage.setItem('md-preview-documents', JSON.stringify(documentStore));
      window.location.reload();
    }
  };

  const exportAllDocuments = () => {
    if (documents.length === 0) {
      setExportModalMessage('No documents to export.');
      setExportModalOpen(true);
      return;
    }

    if (documents.length === 1) {
      const doc = documents[0];
      const content = doc.content;
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'README.md';
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportModalMessage('Successfully exported as README.md');
      setExportModalOpen(true);
      return;
    }

    const zip = new JSZip();
    
    zip.file('README.md', documents[0].content);
    
    documents.slice(1).forEach((doc) => {
      const fileName = `docs/${doc.title.replace(/[^\w\s]/gi, '')}.md`;
      zip.file(fileName, doc.content);
    });

    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'markdown-documents.zip';
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setExportModalMessage(`Successfully exported ${documents.length} documents. The first document was exported as README.md, and all other documents were included in a docs folder.`);
        setExportModalOpen(true);
      });
  };

  return (
    <>
      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200/70'} sticky bottom-0 z-10 backdrop-blur-lg bg-opacity-80 ${isDarkMode ? 'bg-gray-900/80' : 'bg-white/90'}`}>
        <motion.button 
          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium ${
            isDarkMode 
              ? 'text-gray-300 hover:bg-gray-800/40' 
              : 'text-gray-700 hover:bg-gray-200/60'
          } rounded-xl transition-colors ${isSettingsOpen ? (isDarkMode ? 'bg-gray-800/40' : 'bg-gray-200/60') : ''}`}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        >
          <div className="flex items-center">
            <Settings className={`h-4 w-4 mr-2.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span>Settings</span>
          </div>
          <div>
            {isSettingsOpen ? 
              <ChevronUp className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} /> : 
              <ChevronDown className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            }
          </div>
        </motion.button>
        
        {isSettingsOpen && (
          <div className={`mt-2 rounded-xl overflow-hidden ${
            isDarkMode 
              ? 'bg-gray-800/40 border border-gray-700/30' 
              : 'bg-gray-100/60 border border-gray-200/50'
          }`}>
            <motion.button 
              className={`w-full flex items-center px-4 py-2.5 text-sm ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700/40' 
                  : 'text-gray-700 hover:bg-gray-200/60'
              } transition-colors`}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleTheme}
            >
              <div className="flex items-center">
                {isDarkMode ? 
                  <Sun className={`h-4 w-4 mr-2.5 text-yellow-400`} /> : 
                  <Moon className={`h-4 w-4 mr-2.5 text-blue-500`} />
                }
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
            </motion.button>
            
            <motion.button 
              className={`w-full flex items-center px-4 py-2.5 text-sm ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700/40' 
                  : 'text-gray-700 hover:bg-gray-200/60'
              } transition-colors`}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportAllDocuments}
            >
              <div className="flex items-center">
                <Download className={`h-4 w-4 mr-2.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span>Export Documents</span>
              </div>
            </motion.button>
            
            <motion.button 
              className={`w-full flex items-center px-4 py-2.5 text-sm ${
                isDarkMode 
                  ? 'text-red-400 hover:bg-gray-700/40' 
                  : 'text-red-500 hover:bg-gray-200/60'
              } transition-colors`}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDeleteModalOpen(true)}
            >
              <div className="flex items-center">
                <Trash className={`h-4 w-4 mr-2.5`} />
                <span>Delete All Documents</span>
              </div>
            </motion.button>
          </div>
        )}
        
        <Link href="/landing">
          <motion.button 
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium ${
              isDarkMode 
                ? 'text-gray-300 hover:bg-gray-800/40' 
                : 'text-gray-700 hover:bg-gray-100/40'
            } rounded-xl transition-colors mt-2`}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <Info className={`h-4 w-4 mr-2.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span>About</span>
            </div>
          </motion.button>
        </Link>
      </div>
      
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={deleteAllDocuments}
        title="Delete All Documents"
        message="Are you sure you want to delete all documents? This action cannot be undone."
        confirmText="Delete All"
        confirmType="danger"
      />
      
      <InfoModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Export Documents"
        message={exportModalMessage}
        buttonText="OK"
      />
    </>
  );
}; 