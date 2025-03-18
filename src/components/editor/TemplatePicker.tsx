import { useState, useEffect } from 'react'
import MDEditor from "@uiw/react-md-editor"
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Search, X, FileText, BookOpen, User } from 'lucide-react'

interface Template {
  name: string
  content: string
  category: string
  description: string
}

interface TemplatePickerProps {
  isOpen: boolean
  onClose: () => void
  onTemplateSelect: (template: string) => void
  isDark: boolean
}

const categories = {
  readme: {
    name: "README",
    description: "Project documentation templates",
    icon: FileText
  },
  documentation: {
    name: "Docs",
    description: "API & Component docs",
    icon: BookOpen
  },
  profile: {
    name: "Profile",
    description: "GitHub Profile templates",
    icon: User
  }
}

export function TemplatePicker({
  isOpen,
  onClose,
  onTemplateSelect,
  isDark
}: TemplatePickerProps) {
  const [activeTab, setActiveTab] = useState('readme')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadTemplates = async () => {
      const response = await fetch('/api/templates')
      const data = await response.json()
      setTemplates(data)
    }
    if (isOpen) {
      loadTemplates()
    }
  }, [isOpen])

  if (!isOpen) return null

  const filteredTemplates = templates
    .filter(t => t.category === activeTab)
    .filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm p-4" 
        onClick={onClose}
      >
        <motion.div 
          className={cn(
            "w-full max-w-7xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl",
            isDark ? 'bg-zinc-900' : 'bg-white',
            "flex"
          )}
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <div className={cn(
            "w-[420px] flex flex-col border-r",
            isDark ? "border-zinc-800" : "border-gray-200"
          )}>
            <div className={cn(
              "p-6 border-b",
              isDark ? "border-zinc-800" : "border-gray-200"
            )}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={cn(
                  "text-2xl font-bold",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  Templates
                </h2>
                <button
                  onClick={onClose}
                  className={cn(
                    "p-2 rounded-lg hover:bg-gray-500/10 transition-colors",
                    isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="relative">
                <Search className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
                  isDark ? "text-gray-500" : "text-gray-400"
                )} />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full py-2.5 pl-9 pr-4 rounded-xl text-sm",
                    "transition-colors outline-none",
                    isDark 
                      ? "bg-zinc-800 text-white placeholder:text-gray-500 focus:bg-zinc-700"
                      : "bg-gray-100 text-gray-900 placeholder:text-gray-500 focus:bg-gray-50"
                  )}
                />
              </div>
            </div>

            <div className={cn(
              "flex border-b p-2 gap-2",
              isDark ? "border-zinc-800" : "border-gray-200"
            )}>
              {Object.entries(categories).map(([key, category]) => {
                const Icon = category.icon
                return (
                  <button
                    key={key}
                    className={cn(
                      "flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                      "flex items-center justify-center gap-2",
                      activeTab === key
                        ? isDark 
                          ? "bg-zinc-800 text-white" 
                          : "bg-gray-200 text-gray-900"
                        : isDark
                          ? "text-gray-400 hover:text-gray-300 hover:bg-zinc-800/50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                    onClick={() => setActiveTab(key)}
                  >
                    <Icon size={16} />
                    {category.name}
                  </button>
                )
              })}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {filteredTemplates.map((template, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "w-full text-left p-4 rounded-xl transition-all",
                      "hover:shadow-md",
                      isDark 
                        ? "hover:bg-zinc-800" 
                        : "hover:bg-gray-100",
                      selectedTemplate === template.content && (
                        isDark 
                          ? "bg-zinc-800 ring-2 ring-blue-500" 
                          : "bg-gray-100 ring-2 ring-blue-500"
                      )
                    )}
                    onClick={() => setSelectedTemplate(template.content)}
                  >
                    <h3 className={cn(
                      "font-semibold mb-2",
                      isDark ? "text-white" : "text-gray-900"
                    )}>
                      {template.name}
                    </h3>
                    <p className={cn(
                      "text-sm leading-relaxed",
                      isDark ? "text-gray-400" : "text-gray-600"
                    )}>
                      {template.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className={cn(
              "p-4 border-t",
              isDark ? "border-zinc-800" : "border-gray-200"
            )}>
              <button
                className={cn(
                  "w-full py-3 px-4 rounded-xl text-sm font-medium transition-all",
                  "bg-blue-500 text-white",
                  "hover:bg-blue-600",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "flex items-center justify-center gap-2",
                  "shadow-lg shadow-blue-500/20"
                )}
                disabled={!selectedTemplate}
                onClick={() => {
                  if (selectedTemplate) {
                    onTemplateSelect(selectedTemplate)
                    onClose()
                  }
                }}
              >
                Use Template
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col h-full w-full">
            <div className={cn(
              "p-6 border-b flex items-center justify-between",
              isDark ? "border-zinc-800" : "border-gray-200"
            )}>
              <h3 className={cn(
                "text-lg font-semibold",
                isDark ? "text-white" : "text-gray-900"
              )}>
                Preview
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto w-full">
              {selectedTemplate ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "prose max-w-none h-full w-full",
                    isDark ? "prose-invert" : ""
                  )}
                >
                  <MDEditor
                    value={selectedTemplate}
                    preview="preview"
                    hideToolbar={true}
                    height="100%"
                    className={cn(
                      "w-full h-full border-none bg-transparent",
                      isDark ? "text-white" : "text-gray-900",
                      "[&_.w-md-editor]:h-full [&_.w-md-editor]:w-full",
                      "[&_.w-md-editor-preview]:h-full [&_.w-md-editor-preview]:w-full",
                      "[&_.w-md-editor-preview-wrapper]:h-full [&_.w-md-editor-preview-wrapper]:w-full"
                    )}
                  />
                </motion.div>
              ) : (
                <div className={cn(
                  "h-full w-full flex items-center justify-center text-center p-6",
                  isDark ? "text-gray-500" : "text-gray-400"
                )}>
                  <p>Select a template to preview</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
} 