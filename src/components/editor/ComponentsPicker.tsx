import { useState } from 'react'
import MDEditor from "@uiw/react-md-editor"
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Search, X, Table, Heading1, Heading2, List, ListOrdered, ListChecks, Code, Quote, Image, AlertCircle, Info, AlertTriangle, CheckCircle, Plus, Minus, Edit2, Save } from 'lucide-react'
import remarkGfm from 'remark-gfm'

interface Component {
  name: string
  content: string
  category: string
  description: string
  icon: React.ReactNode
  isEditable?: boolean
  hasPreview?: boolean
}

interface ComponentsPickerProps {
  isOpen: boolean
  onClose: () => void
  onComponentSelect: (component: string) => void
  isDark: boolean
}

const categories = {
  tables: {
    name: "Tables",
    description: "Interactive table components",
    icon: <Table className="w-4 h-4" />,
    components: [
      {
        name: "Basic Table",
        content: "| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |",
        category: "tables",
        description: "A basic table with headers and cells",
        icon: <Table className="w-4 h-4" />,
        isEditable: true,
        hasPreview: true
      },
      {
        name: "Aligned Table",
        content: "| Left | Center | Right |\n|:-----|:------:|------:|\n| Cell | Cell   | Cell  |\n| Cell | Cell   | Cell  |",
        category: "tables",
        description: "A table with different column alignments",
        icon: <Table className="w-4 h-4" />,
        isEditable: true,
        hasPreview: true
      }
    ]
  },
  headings: {
    name: "Headings",
    description: "Document headings and titles",
    icon: <Heading1 className="w-4 h-4" />,
    components: [
      {
        name: "H1 Heading",
        content: "# Main Title",
        category: "headings",
        description: "Primary heading (H1)",
        icon: <Heading1 className="w-4 h-4" />
      },
      {
        name: "H2 Heading",
        content: "## Section Title",
        category: "headings",
        description: "Secondary heading (H2)",
        icon: <Heading2 className="w-4 h-4" />
      },
      {
        name: "H3 Heading",
        content: "### Subsection Title",
        category: "headings",
        description: "Tertiary heading (H3)",
        icon: <Heading2 className="w-4 h-4" />
      }
    ]
  },
  lists: {
    name: "Lists",
    description: "Various list types",
    icon: <List className="w-4 h-4" />,
    components: [
      {
        name: "Bullet List",
        content: "- Item 1\n- Item 2\n- Item 3",
        category: "lists",
        description: "Unordered bullet list",
        icon: <List className="w-4 h-4" />
      },
      {
        name: "Numbered List",
        content: "1. First item\n2. Second item\n3. Third item",
        category: "lists",
        description: "Ordered numbered list",
        icon: <ListOrdered className="w-4 h-4" />
      },
      {
        name: "Task List",
        content: "- [ ] Task 1\n- [x] Task 2\n- [ ] Task 3",
        category: "lists",
        description: "Checkbox task list",
        icon: <ListChecks className="w-4 h-4" />
      }
    ]
  },
  code: {
    name: "Code",
    description: "Code blocks and snippets",
    icon: <Code className="w-4 h-4" />,
    components: [
      {
        name: "Code Block",
        content: "```javascript\nfunction hello() {\n  console.log('Hello, World!');\n}\n```",
        category: "code",
        description: "Syntax-highlighted code block",
        icon: <Code className="w-4 h-4" />
      },
      {
        name: "Inline Code",
        content: "`code`",
        category: "code",
        description: "Inline code snippet",
        icon: <Code className="w-4 h-4" />
      }
    ]
  },
  quotes: {
    name: "Quotes",
    description: "Blockquotes and citations",
    icon: <Quote className="w-4 h-4" />,
    components: [
      {
        name: "Blockquote",
        content: "> This is a blockquote.\n> It can span multiple lines.",
        category: "quotes",
        description: "Blockquote with multiple lines",
        icon: <Quote className="w-4 h-4" />,
        isEditable: true,
        hasPreview: true
      },
      {
        name: "Nested Blockquote",
        content: "> First level\n>> Second level\n>>> Third level",
        category: "quotes",
        description: "Nested blockquotes",
        icon: <Quote className="w-4 h-4" />,
        isEditable: true,
        hasPreview: true
      }
    ]
  },
  media: {
    name: "Media",
    description: "Images and links",
    icon: <Image className="w-4 h-4" />,
    components: [
      {
        name: "Image",
        content: "![Alt text](image.jpg)",
        category: "media",
        description: "Image with alt text",
        icon: <Image className="w-4 h-4" />,
        isEditable: true,
        hasPreview: true
      },
      {
        name: "Image with Link",
        content: "[![Alt text](image.jpg)](https://example.com)",
        category: "media",
        description: "Clickable image with link",
        icon: <Image className="w-4 h-4" />,
        isEditable: true,
        hasPreview: true
      }
    ]
  },
  alerts: {
    name: "Alerts",
    description: "Info boxes and callouts",
    icon: <AlertCircle className="w-4 h-4" />,
    components: [
      {
        name: "Info Alert",
        content: "> [!INFO]\n> This is an info alert.",
        category: "alerts",
        description: "Information alert box",
        icon: <Info className="w-4 h-4" />,
        isEditable: true,
        hasPreview: true
      },
      {
        name: "Warning Alert",
        content: "> [!WARNING]\n> This is a warning alert.",
        category: "alerts",
        description: "Warning alert box",
        icon: <AlertTriangle className="w-4 h-4" />,
        isEditable: true,
        hasPreview: true
      },
      {
        name: "Success Alert",
        content: "> [!SUCCESS]\n> This is a success alert.",
        category: "alerts",
        description: "Success alert box",
        icon: <CheckCircle className="w-4 h-4" />,
        isEditable: true,
        hasPreview: true
      }
    ]
  }
}

export function ComponentsPicker({
  isOpen,
  onClose,
  onComponentSelect,
  isDark
}: ComponentsPickerProps) {
  const [activeTab, setActiveTab] = useState('tables')
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingContent, setEditingContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [tableRows, setTableRows] = useState(3)
  const [tableCols, setTableCols] = useState(3)

  if (!isOpen) return null

  const filteredComponents = Object.entries(categories)
    .filter(([key]) => key === activeTab)
    .flatMap(([, category]) =>
      category.components.filter(component =>
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )

  const handleComponentClick = (component: Component) => {
    setSelectedComponent(component)
    setEditingContent(component.content)
    setIsEditing(false)
  }

  const handleSave = () => {
    if (selectedComponent) {
      onComponentSelect(editingContent)
      onClose()
    }
  }

  const handleTableUpdate = (rows: number, cols: number) => {
    const headers = Array(cols).fill("Header").map((h, i) => `${h} ${i + 1}`)
    const headerRow = `| ${headers.join(" | ")} |`
    const separatorRow = `| ${Array(cols).fill("----------").join(" | ")} |`
    const dataRows = Array(rows - 2)
      .fill(null)
      .map((_, i) => `| ${Array(cols).fill(`Cell ${i + 1}`).join(" | ")} |`)
    
    const newContent = [headerRow, separatorRow, ...dataRows].join("\n")
    setEditingContent(newContent)
    setSelectedComponent(prev => prev ? { ...prev, content: newContent } : null)
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm p-4" 
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
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
                  Components
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
                  placeholder="Search components..."
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
              "flex overflow-x-auto border-b p-2 gap-2 scrollbar-hide",
              isDark ? "border-zinc-800" : "border-gray-200"
            )}>
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  className={cn(
                    "flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all",
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
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {filteredComponents.map((component, index) => (
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
                      selectedComponent === component && (
                        isDark 
                          ? "bg-zinc-800 ring-2 ring-blue-500" 
                          : "bg-gray-100 ring-2 ring-blue-500"
                      )
                    )}
                    onClick={() => handleComponentClick(component)}
                  >
                    <h3 className={cn(
                      "font-semibold mb-2",
                      isDark ? "text-white" : "text-gray-900"
                    )}>
                      {component.name}
                    </h3>
                    <p className={cn(
                      "text-sm leading-relaxed",
                      isDark ? "text-gray-400" : "text-gray-600"
                    )}>
                      {component.description}
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
                disabled={!selectedComponent}
                onClick={handleSave}
              >
                Insert Component
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
            <div className="flex-1 overflow-hidden w-full">
              {selectedComponent ? (
                <div className="h-full flex flex-col">
                  <div className={cn(
                    "p-4 border-b flex items-center justify-between",
                    isDark ? "border-gray-800" : "border-gray-200"
                  )}>
                    <div className="flex items-center space-x-2">
                      {selectedComponent.icon}
                      <h3 className="text-lg font-semibold">{selectedComponent.name}</h3>
                    </div>
                    {selectedComponent.isEditable && (
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={cn(
                          "p-2 rounded-lg",
                          isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                        )}
                      >
                        {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-hidden">
                    {selectedComponent?.category === "tables" && (
                      <div className="p-4 border-b">
                        <div className="flex items-center space-x-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Rows</label>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  const newRows = Math.max(3, tableRows - 1)
                                  setTableRows(newRows)
                                  handleTableUpdate(newRows, tableCols)
                                }}
                                className="p-1 rounded hover:bg-gray-100"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center">{tableRows}</span>
                              <button
                                onClick={() => {
                                  const newRows = tableRows + 1
                                  setTableRows(newRows)
                                  handleTableUpdate(newRows, tableCols)
                                }}
                                className="p-1 rounded hover:bg-gray-100"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Columns</label>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  const newCols = Math.max(2, tableCols - 1)
                                  setTableCols(newCols)
                                  handleTableUpdate(tableRows, newCols)
                                }}
                                className="p-1 rounded hover:bg-gray-100"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center">{tableCols}</span>
                              <button
                                onClick={() => {
                                  const newCols = tableCols + 1
                                  setTableCols(newCols)
                                  handleTableUpdate(tableRows, newCols)
                                }}
                                className="p-1 rounded hover:bg-gray-100"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex-1 h-full overflow-hidden">
                      {isEditing ? (
                        <textarea
                          value={editingContent}
                          onChange={(e) => {
                            setEditingContent(e.target.value)
                            setSelectedComponent(prev => prev ? { ...prev, content: e.target.value } : null)
                          }}
                          className={cn(
                            "w-full h-full p-4 resize-none",
                            isDark 
                              ? "bg-gray-800 text-white" 
                              : "bg-white text-gray-900"
                          )}
                        />
                      ) : (
                        <div className={cn(
                          "h-full w-full overflow-auto",
                          isDark ? "bg-gray-800" : "bg-white"
                        )}>
                          <MDEditor
                            value={editingContent}
                            onChange={() => {}}
                            preview="preview"
                            hideToolbar={true}
                            height="100%"
                            className={cn(
                              "!w-full !h-full !border-none",
                              isDark ? "text-white" : "text-gray-900",
                              "[&_.w-md-editor]:!h-full [&_.w-md-editor]:!w-full [&_.w-md-editor]:!border-none [&_.w-md-editor]:!bg-transparent",
                              "[&_.w-md-editor-content]:!h-full",
                              "[&_.w-md-editor-preview]:!h-full [&_.w-md-editor-preview]:!w-full [&_.w-md-editor-preview]:!p-4 [&_.w-md-editor-preview]:!overflow-auto",
                              "[&_.w-md-editor-preview-wrapper]:!h-full [&_.w-md-editor-preview-wrapper]:!w-full",
                              "[&_.w-md-editor-preview]:prose [&_.w-md-editor-preview]:max-w-full",
                              isDark ? "[&_.w-md-editor-preview]:prose-invert" : "",
                              "[&_.w-md-editor-preview]:prose-headings:mt-0 [&_.w-md-editor-preview]:prose-headings:mb-3",
                              "[&_.w-md-editor-preview]:prose-p:my-2 [&_.w-md-editor-preview]:prose-p:leading-normal",
                              "[&_.w-md-editor-preview]:prose-blockquote:my-2 [&_.w-md-editor-preview]:prose-blockquote:px-4",
                              "[&_.w-md-editor-preview_blockquote]:border-l-4",
                              isDark 
                                ? "[&_.w-md-editor-preview_blockquote]:border-gray-700 [&_.w-md-editor-preview_blockquote]:bg-gray-900/50" 
                                : "[&_.w-md-editor-preview_blockquote]:border-gray-200 [&_.w-md-editor-preview_blockquote]:bg-gray-50",
                              "[&_.w-md-editor-preview_table]:w-full [&_.w-md-editor-preview_table]:my-2",
                              "[&_.w-md-editor-preview_th]:border [&_.w-md-editor-preview_th]:px-4 [&_.w-md-editor-preview_th]:py-2",
                              "[&_.w-md-editor-preview_td]:border [&_.w-md-editor-preview_td]:px-4 [&_.w-md-editor-preview_td]:py-2",
                              isDark 
                                ? "[&_.w-md-editor-preview_th]:border-gray-700 [&_.w-md-editor-preview_td]:border-gray-700" 
                                : "[&_.w-md-editor-preview_th]:border-gray-200 [&_.w-md-editor-preview_td]:border-gray-200",
                              "[&_.w-md-editor-preview_img]:inline-block [&_.w-md-editor-preview_img]:max-w-full [&_.w-md-editor-preview_img]:h-auto"
                            )}
                            previewOptions={{
                              remarkPlugins: [remarkGfm]
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={cn(
                  "h-full w-full flex items-center justify-center text-center p-6",
                  isDark ? "text-gray-500" : "text-gray-400"
                )}>
                  <p>Select a component to preview</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 