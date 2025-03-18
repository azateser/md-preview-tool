import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Info, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { badgeCategories } from '@/data/shieldCategories';

interface ShieldBadgePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onBadgeSelect: (badge: string) => void;
  isDark?: boolean;
}

export function ShieldBadgePicker({ isOpen, onClose, onBadgeSelect, isDark = false }: ShieldBadgePickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Technologies');
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<{name: string, badge: string} | null>(null);
  const [customLabel, setCustomLabel] = useState('');
  const [customColor, setCustomColor] = useState('');

  const filteredBadges = searchTerm
    ? Object.values(badgeCategories).flat().filter(badge =>
        badge.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : badgeCategories[selectedCategory as keyof typeof badgeCategories];

  const handleBadgeClick = (badge: {name: string, badge: string}) => {
    setSelectedBadge(badge);
    
    const labelMatch = badge.badge.match(/badge\/([^-]*)-(.*?)\?/);
    if (labelMatch && labelMatch[1]) {
      setCustomLabel(labelMatch[1]);
    }
    
    const colorMatch = badge.badge.match(/badge\/[^-]*-(.*?)\?/);
    if (colorMatch && colorMatch[1]) {
      setCustomColor(colorMatch[1]);
    }
  };

  const applyCustomBadge = () => {
    if (!selectedBadge) return;
    
    const originalUrl = selectedBadge.badge;
    
    let newUrl = originalUrl;
    
    if (customLabel) {
      newUrl = newUrl.replace(/badge\/([^-]*)-(.*?)\?/, `badge/${customLabel}-$2?`);
    }
    
    if (customColor) {
      newUrl = newUrl.replace(/badge\/[^-]*-(.*?)\?/, `badge/${customLabel}-${customColor}?`);
    }
    
    onBadgeSelect(newUrl);
    setSelectedBadge(null);
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
              "relative w-[600px] max-h-[600px] rounded-xl overflow-hidden",
              "border shadow-xl",
              isDark
                ? "bg-gray-900 border-gray-700"
                : "bg-white border-gray-200"
            )}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={cn(
              "px-4 py-3 border-b flex items-center justify-between",
              isDark ? "border-gray-700" : "border-gray-200"
            )}>
              <div className="flex items-center">
                <h2 className={cn(
                  "text-lg font-semibold",
                  isDark ? "text-gray-100" : "text-gray-900"
                )}>
                  Shield Badge Picker
                </h2>
                <button 
                  onClick={() => setShowTutorial(!showTutorial)}
                  className={cn(
                    "ml-2 p-1 rounded-full",
                    isDark ? "bg-gray-800 text-blue-400 hover:bg-gray-700" : "bg-gray-100 text-blue-600 hover:bg-gray-200"
                  )}
                >
                  <Info size={16} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href="https://shields.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center text-xs",
                    isDark ? "text-blue-400" : "text-blue-600"
                  )}
                >
                  shields.io <ExternalLink size={12} className="ml-1" />
                </a>
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
            </div>

            <AnimatePresence>
              {showTutorial && (
                <motion.div 
                  className={cn(
                    "p-4 border-b",
                    isDark ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-gray-200"
                  )}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, duration: 0.3 }}
                >
                  <div className={cn(
                    "rounded-lg p-4",
                    isDark ? "bg-gray-900" : "bg-white border border-gray-200"
                  )}>
                    <h3 className={cn(
                      "text-sm font-semibold mb-2 flex items-center",
                      isDark ? "text-blue-400" : "text-blue-600"
                    )}>
                      <Info size={14} className="mr-2" /> Badge URL&apos;sini Nasıl Düzenlersiniz
                    </h3>
                    <p className={cn(
                      "text-xs mb-3",
                      isDark ? "text-gray-300" : "text-gray-700"
                    )}>
                      Shield badge&apos;lerini düzenlemek için URL yapısını anlamalısınız:
                    </p>
                    <div className={cn(
                      "text-xs mb-3 font-mono p-2 rounded",
                      isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-800"
                    )}>
                      <code>![Label](https://img.shields.io/badge/<b>LABEL</b>-<b>COLOR</b>?style=for-the-badge&logo=<b>LOGO</b>&logoColor=<b>LOGO_COLOR</b>)</code>
                    </div>
                    <ul className={cn(
                      "text-xs space-y-2 mb-3",
                      isDark ? "text-gray-300" : "text-gray-700"
                    )}>
                      <li>• <b>LABEL</b>: Badge üzerinde görünen metin. Boşluk yerine tire (-) kullanın.</li>
                      <li>• <b>COLOR</b>: Badge arka plan rengi. Hex kodu (FF5733) veya isim (blue) kullanabilirsiniz.</li>
                      <li>• <b>LOGO</b>: Logonun adı (örn. javascript, react).</li>
                      <li>• <b>LOGO_COLOR</b>: Logo rengi (genellikle white veya black).</li>
                    </ul>
                    <p className={cn(
                      "text-xs",
                      isDark ? "text-gray-300" : "text-gray-700"
                    )}>
                      Bir badge seçtiğinizde, onun etiketini ve rengini düzenleyebilirsiniz. İleri düzey özelleştirmeler için <a href="https://shields.io/" target="_blank" rel="noopener noreferrer" className={isDark ? "text-blue-400" : "text-blue-600"}>shields.io</a>&apos;yu ziyaret edin.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-4">
              <div className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg",
                isDark ? "bg-gray-800" : "bg-gray-100"
              )}>
                <Search size={18} className={isDark ? "text-gray-400" : "text-gray-500"} />
                <input
                  type="text"
                  placeholder="Search badges..."
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
                {Object.keys(badgeCategories).map((category) => (
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

            <AnimatePresence>
              {selectedBadge && (
                <motion.div 
                  className={cn(
                    "p-4 border-b",
                    isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"
                  )}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, duration: 0.3 }}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className={cn(
                        "text-sm font-medium",
                        isDark ? "text-gray-200" : "text-gray-800"
                      )}>
                        Customize Badge
                      </div>
                      <button
                        onClick={() => setSelectedBadge(null)}
                        className={cn(
                          "p-1 rounded-lg transition-colors",
                          isDark
                            ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                            : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="flex justify-center mb-2">
                      {selectedBadge && (
                        <img
                          src={selectedBadge.badge.split('](')[1].slice(0, -1)}
                          alt={`${selectedBadge.name} badge preview`}
                          className="h-5"
                        />
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={cn(
                          "block text-xs font-medium mb-1.5",
                          isDark ? "text-gray-300" : "text-gray-700"
                        )}>
                          Label
                        </label>
                        <input 
                          type="text"
                          value={customLabel}
                          onChange={(e) => setCustomLabel(e.target.value)}
                          placeholder="my-badge"
                          className={cn(
                            "w-full px-3 py-1.5 text-sm rounded-md",
                            isDark 
                              ? "bg-gray-900 border border-gray-700 text-gray-200" 
                              : "bg-white border border-gray-300 text-gray-800"
                          )}
                        />
                      </div>
                      <div>
                        <label className={cn(
                          "block text-xs font-medium mb-1.5",
                          isDark ? "text-gray-300" : "text-gray-700"
                        )}>
                          Color
                        </label>
                        <input 
                          type="text"
                          value={customColor}
                          onChange={(e) => setCustomColor(e.target.value)}
                          placeholder="blue or 4285F4"
                          className={cn(
                            "w-full px-3 py-1.5 text-sm rounded-md",
                            isDark 
                              ? "bg-gray-900 border border-gray-700 text-gray-200" 
                              : "bg-white border border-gray-300 text-gray-800"
                          )}
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={applyCustomBadge}
                      className={cn(
                        "mt-1 w-full py-1.5 rounded-md text-sm font-medium",
                        isDark
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      )}
                    >
                      Apply Changes
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-4 overflow-y-auto max-h-[400px]">
              <div className="grid grid-cols-2 gap-3">
                {filteredBadges.map((badge, index) => (
                  <button
                    key={index}
                    onClick={() => handleBadgeClick(badge)}
                    className={cn(
                      "p-3 rounded-lg text-left",
                      "transition-all hover:scale-[1.02] transform duration-100",
                      isDark
                        ? "bg-gray-800/50 hover:bg-gray-800"
                        : "bg-gray-50 hover:bg-gray-100",
                      "group"
                    )}
                  >
                    <div className="text-sm font-medium mb-2">
                      {badge.name}
                    </div>
                    <img
                      src={badge.badge.split('](')[1].slice(0, -1)}
                      alt={`${badge.name} badge preview`}
                      className="h-5"
                    />
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