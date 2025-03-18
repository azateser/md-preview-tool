import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';
import { Copy, Check, Eye, Edit, Users, Globe, Lock, Share2, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId?: string;
}

type AccessLevel = 'private' | 'restricted' | 'public';

export function ShareModal({ isOpen, onClose, documentId }: ShareModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('restricted');

  const shareLink = `${window.location.origin}/share/${documentId}?mode=${mode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={cn(
                "w-full max-w-lg transform overflow-hidden rounded-2xl",
                "text-left align-middle shadow-xl transition-all",
                isDark ? "bg-gray-900 border border-gray-800" : "bg-white"
              )}>
                <div className={cn(
                  "px-8 py-6 relative overflow-hidden",
                  isDark ? "bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20" : "bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50"
                )}>
                  <div className="absolute inset-0 bg-grid-white/10" />
                  <div className="relative">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={cn(
                        "p-2.5 rounded-xl",
                        isDark ? "bg-blue-500/20" : "bg-blue-100"
                      )}>
                        <Share2 className={cn(
                          "w-6 h-6",
                          isDark ? "text-blue-400" : "text-blue-600"
                        )} />
                      </div>
                      <Dialog.Title className={cn(
                        "text-xl font-semibold",
                        isDark ? "text-white" : "text-gray-900"
                      )}>
                        Share Document
                      </Dialog.Title>
                    </div>
                    
                    <div className={cn(
                      "flex items-center space-x-2 p-3 rounded-xl",
                      isDark ? "bg-gray-900/50 border border-gray-800" : "bg-white shadow-sm border border-gray-200"
                    )}>
                      <input
                        type="text"
                        readOnly
                        value={shareLink}
                        className={cn(
                          "flex-1 bg-transparent border-none focus:outline-none text-sm font-medium",
                          isDark ? "text-gray-300" : "text-gray-700"
                        )}
                      />
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={handleCopy}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            isDark 
                              ? "hover:bg-gray-800 text-gray-400 hover:text-gray-300" 
                              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                          )}
                        >
                          {copied ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            isDark 
                              ? "bg-blue-600 text-white hover:bg-blue-700" 
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          )}
                        >
                          <ExternalLink className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-3">
                    <label className={cn(
                      "text-sm font-medium",
                      isDark ? "text-gray-300" : "text-gray-700"
                    )}>
                      Who can access
                    </label>
                    <div className={cn(
                      "grid grid-cols-3 gap-2 p-1 rounded-xl",
                      isDark ? "bg-gray-800" : "bg-gray-100"
                    )}>
                      {[
                        { id: 'private', icon: Lock, label: 'Private' },
                        { id: 'restricted', icon: Users, label: 'Restricted' },
                        { id: 'public', icon: Globe, label: 'Public' }
                      ].map(({ id, icon: Icon, label }) => (
                        <motion.button
                          key={id}
                          onClick={() => setAccessLevel(id as AccessLevel)}
                          className={cn(
                            "flex flex-col items-center py-3 px-4 rounded-lg transition-all",
                            accessLevel === id ? (
                              isDark 
                                ? "bg-gray-900 text-blue-400 shadow-sm" 
                                : "bg-white text-blue-600 shadow-sm"
                            ) : (
                              "hover:bg-gray-700/50 text-gray-400"
                            )
                          )}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="w-5 h-5 mb-1" />
                          <span className="text-xs font-medium">{label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {accessLevel !== 'private' && (
                    <div className="space-y-3">
                      <label className={cn(
                        "text-sm font-medium",
                        isDark ? "text-gray-300" : "text-gray-700"
                      )}>
                        Permission level
                      </label>
                      <div className={cn(
                        "grid grid-cols-2 gap-2 p-1 rounded-xl",
                        isDark ? "bg-gray-800" : "bg-gray-100"
                      )}>
                        {[
                          { id: 'view', icon: Eye, label: 'Can view' },
                          { id: 'edit', icon: Edit, label: 'Can edit' }
                        ].map(({ id, icon: Icon, label }) => (
                          <motion.button
                            key={id}
                            onClick={() => setMode(id as 'view' | 'edit')}
                            className={cn(
                              "flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all",
                              mode === id ? (
                                isDark 
                                  ? "bg-gray-900 text-blue-400 shadow-sm" 
                                  : "bg-white text-blue-600 shadow-sm"
                              ) : (
                                "hover:bg-gray-700/50 text-gray-400"
                              )
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className={cn(
                  "px-8 py-4 border-t flex items-center justify-between",
                  isDark ? "border-gray-800" : "border-gray-200"
                )}>
                  <div className={cn(
                    "text-sm",
                    isDark ? "text-gray-400" : "text-gray-600"
                  )}>
                    {accessLevel === 'private' 
                      ? 'Only you can access this document'
                      : accessLevel === 'restricted'
                        ? 'Anyone with the link can access'
                        : 'Anyone can find and access'}
                  </div>
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={onClose}
                      className={cn(
                        "px-4 py-2 text-sm font-medium rounded-lg",
                        isDark 
                          ? "text-gray-300 hover:bg-gray-800" 
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={onClose}
                      className={cn(
                        "px-4 py-2 text-sm font-medium rounded-lg",
                        "bg-blue-600 text-white hover:bg-blue-700"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Done
                    </motion.button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 