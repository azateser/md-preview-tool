"use client";

import { useDocumentStore } from "@/store/document-store";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Tab } from "@headlessui/react";
import { cn } from "@/lib/utils";
import { 
  Edit, 
  Eye, 
  FileText, 
  Plus, 
  Bold, 
  Italic, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  ListChecks,
  Link as LinkIcon, 
  Image, 
  Code, 
  Quote, 
  Table, 
  HelpCircle,
  Smile,
  Shield,
  Layout,
  Sun,
  Moon,
  Columns,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { EditorHeader } from './EditorHeader';
import { EmojiPicker } from './EmojiPicker';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { ShieldBadgePicker } from './ShieldBadgePicker';
import { TemplatePicker } from './TemplatePicker';
import { ComponentsPicker } from './ComponentsPicker'
import { AIModal } from './AIModal';

const isMac = () => {
  if (typeof window !== 'undefined') {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }
  return false;
};

interface MarkdownEditorProps {
  onMenuToggle: () => void;
}

export function MarkdownEditor({ onMenuToggle }: MarkdownEditorProps) {
  const { documents, activeDocumentId, updateDocument } = useDocumentStore();
  const [value, setValue] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [previewTheme, setPreviewTheme] = useState('light');
  const [wordCount, setWordCount] = useState({ words: 0, chars: 0 });
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isShieldBadgePickerOpen, setIsShieldBadgePickerOpen] = useState(false);
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);
  const [isComponentsPickerOpen, setIsComponentsPickerOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const activeDocument = documents.find((doc) => doc.id === activeDocumentId);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const modKey = isMac() ? '⌘' : 'Ctrl';

  useEffect(() => {
    if (activeDocument) {
      setValue(activeDocument.content || "");
      updateWordCount(activeDocument.content || "");
    }
  }, [activeDocument]);

  const updateWordCount = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    setWordCount({ words, chars });
  };

  const handleChange = (newValue: string = "") => {
    setValue(newValue);
    updateWordCount(newValue);
    
    if (activeDocumentId) {
      const titleMatch = newValue.match(/^# (.+)$/m);
      const title = titleMatch
        ? titleMatch[1]
        : newValue.split("\n")[0].replace(/^#+\s*/, "").substring(0, 50) || "Untitled Document";
      
      updateDocument(activeDocumentId, newValue, title);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    if (activeDocumentId) {
      updateDocument(activeDocumentId, value, newTitle);
    }
  };

  const handleSave = () => {
  };

  const handleShare = () => {
  };

  const handleSearch = () => {
  };

  const handleTemplateSelect = (template: string) => {
    setValue(template);
  };

  const handleComponentSelect = (component: string) => {
    const currentValue = value || "";
    const newValue = currentValue ? currentValue + '\n' + component : component;
    handleChange(newValue);
    setIsComponentsPickerOpen(false);
  };

  const insertMarkdown = (markdownTemplate: string) => {
    const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let newText;
    
    if (selectedText) {
      newText = textarea.value.substring(0, start) + 
                markdownTemplate.replace('$1', selectedText) + 
                textarea.value.substring(end);
    } else {
      newText = textarea.value.substring(0, start) + 
                markdownTemplate.replace('$1', '') + 
                textarea.value.substring(end);
    }
    
    handleChange(newText);
    
    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  const handleEmojiSelect = (emojiCode: string, type?: string, gif?: string) => {
    if (type === 'animated' && gif) {
      insertMarkdown(`![${emojiCode}](${gif})`);
    } else {
      insertMarkdown(emojiCode + ' ');
    }
    setIsEmojiPickerOpen(false);
  };

  const handleBadgeSelect = (badge: string) => {
    insertMarkdown(badge + '\n');
    setIsShieldBadgePickerOpen(false);
  };

  const toolbarButtons = [
    { 
      icon: <Bold size={16} />, 
      title: "Bold", 
      shortcut: `${modKey}+B`,
      action: () => insertMarkdown('**$1**') 
    },
    { 
      icon: <Italic size={16} />, 
      title: "Italic", 
      shortcut: `${modKey}+I`,
      action: () => insertMarkdown('*$1*') 
    },
    { 
      icon: <Strikethrough size={16} />, 
      title: "Strikethrough", 
      shortcut: "Alt+S",
      action: () => insertMarkdown('~~$1~~') 
    },
    { type: 'divider' },
    { 
      icon: <Heading1 size={16} />, 
      title: "Heading 1", 
      shortcut: `${modKey}+1`,
      action: () => insertMarkdown('# $1') 
    },
    { 
      icon: <Heading2 size={16} />, 
      title: "Heading 2", 
      shortcut: `${modKey}+2`,
      action: () => insertMarkdown('## $1') 
    },
    { type: 'divider' },
    { 
      icon: <List size={16} />, 
      title: "Bullet List", 
      shortcut: `${modKey}+U`,
      action: () => insertMarkdown('- $1') 
    },
    { 
      icon: <ListOrdered size={16} />, 
      title: "Numbered List", 
      shortcut: `${modKey}+O`,
      action: () => insertMarkdown('1. $1') 
    },
    { 
      icon: <ListChecks size={16} />, 
      title: "Task List", 
      shortcut: `${modKey}+T`,
      action: () => insertMarkdown('- [ ] $1') 
    },
    { type: 'divider' },
    { 
      icon: <LinkIcon size={16} />, 
      title: "Link", 
      shortcut: `${modKey}+K`,
      action: () => insertMarkdown('[$1](url)') 
    },
    { 
      icon: <Image size={16} />, 
      title: "Image", 
      shortcut: `${modKey}+Shift+I`,
      action: () => insertMarkdown('![$1](url)') 
    },
    { type: 'divider' },
    { 
      icon: <Code size={16} />, 
      title: "Code", 
      shortcut: `${modKey}+\``,
      action: () => insertMarkdown('`$1`') 
    },
    { 
      icon: <Quote size={16} />, 
      title: "Quote", 
      shortcut: `${modKey}+Q`,
      action: () => insertMarkdown('> $1') 
    },
    { 
      icon: <Table size={16} />, 
      title: "Table", 
      shortcut: `${modKey}+Shift+T`,
      action: () => insertMarkdown('| Header | Header |\n| ------ | ------ |\n| Cell   | Cell   |\n| $1     |        |') 
    },
    { type: 'divider' },
    { 
      icon: <Smile size={16} />, 
      title: "Emoji", 
      shortcut: `${modKey}+E`,
      action: () => setIsEmojiPickerOpen(true)
    },
    { 
      icon: <Shield size={16} />, 
      title: "Shield Badge", 
      shortcut: `${modKey}+Shift+B`,
      action: () => setIsShieldBadgePickerOpen(true)
    },
    { 
      icon: <HelpCircle size={16} />, 
      title: "Markdown Help", 
      shortcut: "F1",
      action: () => window.open('https://www.markdownguide.org/cheat-sheet/', '_blank') 
    }
  ];

  const specialButtons = [
    { 
      icon: <FileText size={16} />, 
      title: "Templates", 
      shortcut: `${modKey}+Shift+P`,
      action: () => setIsTemplatePickerOpen(true)
    },
    { 
      icon: <Layout size={16} />,
      title: "Components",
      shortcut: `${modKey}+Shift+C`,
      action: () => {
        setIsComponentsPickerOpen(true)
      }
    },
  ];

  const handleAIClick = () => {
    setIsAIModalOpen(true);
  };

  const handleGenerateReadme = async (template: string) => {
    try {
      document.body.style.cursor = 'wait';
      
      handleChange(template);
      
      document.body.style.cursor = 'default';
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error generating README:", error);
      
      document.body.style.cursor = 'default';
      
      console.error("Failed to generate Markdown");
      
      return Promise.reject(error);
    }
  };

  const WelcomeScreen = useCallback(({ title, description }: { title: string, description: string }) => (
    <motion.div 
      className={`flex-1 flex items-center justify-center h-full ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
    >
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <motion.div 
          className={cn(
            "absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-20",
            isDark 
              ? "bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900" 
              : "bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100"
          )}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div
          className={cn(
            "absolute w-[300px] h-[600px] blur-[80px]",
            isDark 
              ? "bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent" 
              : "bg-gradient-to-r from-blue-200/20 via-indigo-200/20 to-transparent"
          )}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            transformOrigin: 'center'
          }}
          animate={{
            rotate: ['-45deg', '45deg', '-45deg'],
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className={cn(
            "absolute w-[400px] h-[400px] blur-[100px]",
            isDark 
              ? "bg-gradient-to-tr from-purple-500/10 via-indigo-500/10 to-transparent" 
              : "bg-gradient-to-tr from-purple-200/20 via-indigo-200/20 to-transparent"
          )}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 360, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full"
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(147, 197, 253, 0.3) 0%, transparent 70%)' 
              : 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            scale: [1, 3, 1],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
        />

        {[...Array(5)].map((_, i) => {
          const initialPositions = [
            { top: "5.286489542168238%", left: "67.6312650318025%" },
            { top: "66.65773438560248%", left: "80.71665508404564%" },
            { top: "93.83029435740198%", left: "29.71674737161518%" },
            { top: "61.00031286746452%", left: "54.787389770193414%" },
            { top: "13.70219231967733%", left: "33.91237228682977%" }
          ];

          return (
            <motion.div
              key={i}
              className={cn(
                "absolute w-1 h-1 rounded-full",
                isDark ? "bg-blue-300/30" : "bg-blue-400/20"
              )}
              style={{
                top: initialPositions[i].top,
                left: initialPositions[i].left,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </motion.div>
      
      <motion.div 
        className={cn(
          "text-center max-w-md p-12 relative z-10",
          isDark 
            ? "bg-gradient-to-b from-gray-800/95 to-gray-900/95 backdrop-blur-lg border-gray-700/50" 
            : "bg-gradient-to-b from-white/95 to-gray-50/95 backdrop-blur-lg border-gray-200/70",
          "rounded-xl border",
          "transition-all duration-300"
        )}
        style={{
          boxShadow: isDark 
            ? '0 20px 30px -10px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset' 
            : '0 20px 30px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.7) inset'
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
      >
        <motion.div 
          className="relative mx-auto mb-8 w-20 h-20"
            initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
          >
            <motion.div
            className={cn(
              "absolute -inset-3 rounded-xl opacity-50 blur-lg",
              isDark ? "bg-blue-900/20" : "bg-blue-500/10"
            )}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className={cn(
              "absolute inset-0 rounded-lg p-4 border relative z-10",
              isDark 
                ? "bg-gradient-to-br from-blue-800/20 to-indigo-900/20 border-blue-700/40" 
                : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/70",
              "transition-all duration-300",
              "shadow-lg"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText className={cn(
              "h-full w-full transition-colors duration-300",
              isDark ? "text-blue-300" : "text-blue-500"
            )} />
          </motion.div>
          </motion.div>
          
          <motion.h2 
          className={cn(
            "text-3xl font-bold mb-4",
            isDark 
              ? "bg-gradient-to-r from-blue-200 via-indigo-300 to-blue-200 bg-clip-text text-transparent" 
              : "bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-700 bg-clip-text text-transparent",
            "transition-colors duration-300"
          )}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {title}
          </motion.h2>
          
          <motion.p 
          className={cn(
            "text-base mb-10 leading-relaxed mx-auto max-w-sm",
            isDark ? "text-gray-300/90" : "text-gray-600/90",
            "transition-colors duration-300"
          )}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {description}
          </motion.p>
          
        <motion.button
                onClick={() => {
                  const { createDocument } = useDocumentStore.getState();
                  createDocument();
                }}
          className={cn(
            "group relative inline-flex items-center px-6 py-3.5 rounded-lg overflow-hidden",
            "transform hover:translate-y-[-2px] active:translate-y-[0px]",
            "transition-all duration-200",
            isDark
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" 
              : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
          )}
          style={{
            boxShadow: isDark 
              ? '0 10px 20px -5px rgba(37, 99, 235, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset' 
              : '0 10px 20px -5px rgba(37, 99, 235, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span 
            className={cn(
              "absolute inset-0 w-full h-full",
              "bg-gradient-to-r from-transparent via-white/10 to-transparent",
              "translate-x-[-100%] group-hover:translate-x-[100%]",
              "transition-transform duration-1000"
            )}
          />
          
          <motion.div
            className="flex items-center"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <Plus className={cn(
              "h-5 w-5 mr-2 transition-transform duration-200",
              "group-hover:rotate-90",
              isDark ? "text-blue-200" : "text-white"
            )} />
            <span className="font-medium relative">
                  Create New Document
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-white/30"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
                </span>
          </motion.div>
        </motion.button>
      </motion.div>
    </motion.div>
  ), [isDark]);

  const welcomeToMDPreview = useMemo(() => (
    <WelcomeScreen 
      title="Welcome to MD Preview"
      description="Start typing in the editor to create your markdown document. You'll see the preview update in real-time."
    />
  ), [WelcomeScreen]);

  const noDocumentSelected = useMemo(() => (
    <WelcomeScreen 
      title="No document selected"
      description="Select a document from the sidebar or create a new one to get started with your markdown editing journey."
    />
  ), [WelcomeScreen]);

  const previewClassName = useMemo(() => {
    return cn(
      "prose max-w-none p-8",
      previewTheme === 'dark' ? "prose-invert" : "",
      "prose-headings:font-semibold prose-headings:tracking-tight",
      "prose-h1:text-3xl prose-h1:mb-6 prose-h1:pb-2",
      previewTheme === 'dark' ? "prose-h1:border-b prose-h1:border-gray-800" : "prose-h1:border-b prose-h1:border-gray-200",
      "prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4",
      "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3",
      "prose-p:leading-7 prose-p:my-5",
      "prose-blockquote:border-l-4",
      previewTheme === 'dark' 
        ? "prose-blockquote:border-gray-700 prose-blockquote:bg-gray-800/50" 
        : "prose-blockquote:border-gray-300 prose-blockquote:bg-gray-50",
      "prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-md",
      "prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm",
      previewTheme === 'dark' 
        ? "prose-code:bg-gray-800 prose-code:text-gray-200" 
        : "prose-code:bg-gray-100 prose-code:text-gray-800",
      "prose-pre:bg-gray-950 prose-pre:border prose-pre:rounded-lg",
      previewTheme === 'dark' ? "prose-pre:border-gray-800" : "prose-pre:border-gray-200",
      "prose-img:rounded-lg prose-img:shadow-md",
      "prose-a:font-medium",
      previewTheme === 'dark' ? "prose-a:text-blue-400" : "prose-a:text-blue-600",
      "prose-li:my-2",
      "prose-table:border prose-table:rounded-lg prose-table:overflow-hidden",
      previewTheme === 'dark' ? "prose-table:border-gray-800" : "prose-table:border-gray-200",
      "prose-th:bg-gray-100 prose-th:text-left prose-th:p-3",
      previewTheme === 'dark' ? "prose-th:bg-gray-800 prose-th:text-gray-200" : "prose-th:bg-gray-100 prose-th:text-gray-800",
      "prose-td:p-3",
      previewTheme === 'dark' ? "prose-td:border-t prose-td:border-gray-800" : "prose-td:border-t prose-td:border-gray-200",
    );
  }, [previewTheme]);

  if (documents.length === 0) {
    return welcomeToMDPreview;
  }

  if (!activeDocument) {
    return noDocumentSelected;
  }

  return (
    <motion.div 
      className={`flex-1 flex flex-col h-full ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <EmojiPicker
        isOpen={isEmojiPickerOpen}
        onClose={() => setIsEmojiPickerOpen(false)}
        onEmojiSelect={handleEmojiSelect}
        isDark={isDark}
      />
      
      <ShieldBadgePicker
        isOpen={isShieldBadgePickerOpen}
        onClose={() => setIsShieldBadgePickerOpen(false)}
        onBadgeSelect={handleBadgeSelect}
        isDark={isDark}
      />
      
      <TemplatePicker
        isOpen={isTemplatePickerOpen}
        onClose={() => setIsTemplatePickerOpen(false)}
        onTemplateSelect={handleTemplateSelect}
        isDark={isDark}
      />
      
      <ComponentsPicker
        isOpen={isComponentsPickerOpen}
        onClose={() => setIsComponentsPickerOpen(false)}
        onComponentSelect={handleComponentSelect}
        isDark={isDark}
      />
      
      <AIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerate={handleGenerateReadme}
      />
      
      <EditorHeader
        title={activeDocument.title}
        updatedAt={activeDocument.updatedAt.toString()}
        onTitleChange={handleTitleChange}
        onSave={handleSave}
        onShare={handleShare}
        onSearch={handleSearch}
        onMenuToggle={onMenuToggle}
      />
      
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <div className={cn(
          "border-b",
          isDark ? "border-gray-800" : "border-gray-200"
        )}>
          <Tab.List className="flex items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <Tab
                className={({ selected }) =>
                  cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    "focus:outline-none relative",
                    selected
                      ? isDark 
                        ? "text-blue-400" 
                        : "text-blue-600"
                      : isDark 
                        ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50" 
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/80"
                  )
                }
              >
                <Edit className="h-4 w-4 mr-2" />
                Write
                {selectedTab === 0 && (
                  <motion.div 
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-0.5 rounded-full",
                      isDark ? "bg-blue-500" : "bg-blue-600"
                    )}
                    layoutId="activeTabIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Tab>
              <Tab
                className={({ selected }) =>
                  cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    "focus:outline-none relative",
                    selected
                      ? isDark 
                        ? "text-blue-400" 
                        : "text-blue-600"
                      : isDark 
                        ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50" 
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/80"
                  )
                }
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
                {selectedTab === 1 && (
                  <motion.div 
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-0.5 rounded-full",
                      isDark ? "bg-blue-500" : "bg-blue-600"
                    )}
                    layoutId="activeTabIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Tab>
              <Tab
                className={({ selected }) =>
                  cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    "focus:outline-none relative",
                    selected
                      ? isDark 
                        ? "text-blue-400" 
                        : "text-blue-600"
                      : isDark 
                        ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50" 
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/80"
                  )
                }
              >
                <Columns className="h-4 w-4 mr-2" />
                Split
                {selectedTab === 2 && (
                  <motion.div 
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-0.5 rounded-full",
                      isDark ? "bg-blue-500" : "bg-blue-600"
                    )}
                    layoutId="activeTabIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Tab>
            </div>
            {(selectedTab === 1 || selectedTab === 2) && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewTheme(previewTheme === 'dark' ? 'light' : 'dark')}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    previewTheme === 'dark' 
                      ? "bg-gray-800 text-gray-200 hover:bg-gray-700" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {previewTheme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}
          </Tab.List>
        </div>
      </Tab.Group>
      
      {(selectedTab === 0 || selectedTab === 2) && (
        <motion.div 
          className={cn(
            "border-b px-4 py-1.5 flex items-center justify-between overflow-visible",
            isDark ? "border-gray-800 bg-gray-900/30" : "border-gray-200 bg-gray-50/30"
          )}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center space-x-1 overflow-visible">
            {toolbarButtons.map((button, index) => 
              button.type === 'divider' ? (
                <div 
                  key={`divider-${index}`} 
                  className={cn(
                    "w-px h-5 mx-1",
                    isDark ? "bg-gray-700" : "bg-gray-300"
                  )} 
                />
              ) : (
                <div 
                  key={button.title} 
                  className={cn(
                    "relative",
                    isDark ? "dark" : "light"
                  )}
                >
                  <motion.button
                    className={cn(
                      "p-1.5 rounded",
                      "transition-colors duration-150",
                      "hover:bg-gray-500/10 active:bg-gray-500/20",
                      isDark ? "text-gray-300" : "text-gray-600",
                      "tooltip-trigger"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={button.action}
                    aria-label={button.title}
                  >
                    {button.icon}
                    <span className="sr-only">{button.title}</span>
                  </motion.button>
                </div>
              )
            )}
          </div>

          <div className="flex items-center space-x-2">
            {specialButtons.map((button) => (
              <div
                key={button.title}
                className={cn(
                  "relative",
                  isDark ? "dark" : "light"
                )}
              >
                <motion.button
                  className={cn(
                    "px-3 py-1.5 rounded-md flex items-center",
                    "transition-colors duration-150",
                    isDark 
                      ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30" 
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  )}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={button.action}
                  aria-label={button.title}
                >
                  {button.icon}
                  <span className="ml-1.5 text-xs font-medium">{button.title}</span>
                </motion.button>
              </div>
            ))}
            
            <div className="relative">
              <motion.button
                onClick={handleAIClick}
                className={cn(
                  "px-3 py-1.5 rounded-md flex items-center",
                  "relative overflow-hidden",
                  isDark 
                    ? "bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 text-white" 
                    : "bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 text-indigo-700",
                  "border",
                  isDark ? "border-indigo-500/20" : "border-indigo-300/30"
                )}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: isDark 
                    ? "0 0 12px 2px rgba(129, 140, 248, 0.3)" 
                    : "0 0 12px 2px rgba(129, 140, 248, 0.2)"
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: ["-100%", "100%", "-100%"] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    ease: "linear"
                  }}
                />
                
                <motion.span 
                  className="absolute inset-0 opacity-0"
                  style={{
                    background: isDark 
                      ? "radial-gradient(circle, rgba(129, 140, 248, 0.3) 0%, transparent 70%)" 
                      : "radial-gradient(circle, rgba(129, 140, 248, 0.2) 0%, transparent 70%)",
                  }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    ease: "easeInOut"
                  }}
                />
                
                <motion.div
                  className="mr-1.5 relative"
                  animate={{ 
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 5,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles 
                    size={16} 
                    className={cn(
                      "relative z-10",
                      isDark ? "text-indigo-300" : "text-indigo-500"
                    )}
                  />
                  <motion.span 
                    className={cn(
                      "absolute -inset-1 rounded-full blur-sm z-0",
                      isDark ? "bg-indigo-500/30" : "bg-indigo-300/40"
                    )}
                    animate={{ scale: [0.8, 1.2, 0.8] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
                
                <span className={cn(
                  "text-xs font-bold relative z-10",
                  isDark 
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300" 
                    : "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
                )}>
                  AI
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
      
      <motion.div 
        className="flex-1 overflow-hidden relative flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex-1 overflow-auto">
          <style jsx global>{`
            .wmde-markdown {
              background-color: ${previewTheme === 'dark' ? '#0d1117' : '#ffffff'} !important;
              color: ${previewTheme === 'dark' ? '#c9d1d9' : '#24292f'} !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" !important;
              font-size: 16px !important;
              line-height: 1.5 !important;
              word-wrap: break-word !important;
              padding: 32px !important;
              border-radius: 6px !important;
            }
            
            .wmde-markdown h1, .wmde-markdown h2 {
              padding-bottom: 0.3em !important;
              border-bottom: 1px solid ${previewTheme === 'dark' ? '#21262d' : '#eaecef'} !important;
            }
            
            .wmde-markdown code {
              background-color: ${previewTheme === 'dark' ? '#161b22' : '#f6f8fa'} !important;
              border-radius: 3px !important;
              padding: 0.2em 0.4em !important;
              font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace !important;
            }
            
            .wmde-markdown pre {
              background-color: ${previewTheme === 'dark' ? '#161b22' : '#f6f8fa'} !important;
              border-radius: 6px !important;
              padding: 16px !important;
              overflow: auto !important;
            }
            
            .wmde-markdown blockquote {
              padding: 0 1em !important;
              color: ${previewTheme === 'dark' ? '#8b949e' : '#6a737d'} !important;
              border-left: 0.25em solid ${previewTheme === 'dark' ? '#30363d' : '#dfe2e5'} !important;
            }
            
            .wmde-markdown table {
              border-collapse: collapse !important;
              width: 100% !important;
              overflow: auto !important;
            }
            
            .wmde-markdown table th, .wmde-markdown table td {
              padding: 6px 13px !important;
              border: 1px solid ${previewTheme === 'dark' ? '#30363d' : '#dfe2e5'} !important;
            }
            
            .wmde-markdown table tr {
              background-color: ${previewTheme === 'dark' ? '#0d1117' : '#ffffff'} !important;
              border-top: 1px solid ${previewTheme === 'dark' ? '#30363d' : '#c6cbd1'} !important;
            }
            
            .wmde-markdown table tr:nth-child(2n) {
              background-color: ${previewTheme === 'dark' ? '#161b22' : '#f6f8fa'} !important;
            }
            
            .wmde-markdown img {
              max-width: 100% !important;
              box-sizing: content-box !important;
              background-color: ${previewTheme === 'dark' ? '#0d1117' : '#ffffff'} !important;
            }
            
            .wmde-markdown a {
              color: ${previewTheme === 'dark' ? '#58a6ff' : '#0366d6'} !important;
              text-decoration: none !important;
            }
            
            .wmde-markdown a:hover {
              text-decoration: underline !important;
            }
            
            .wmde-markdown hr {
              height: 0.25em !important;
              padding: 0 !important;
              margin: 24px 0 !important;
              background-color: ${previewTheme === 'dark' ? '#30363d' : '#e1e4e8'} !important;
              border: 0 !important;
            }
            
            /* List styles */
            .wmde-markdown ul, .wmde-markdown ol {
              padding-left: 2em !important;
              margin-top: 0 !important;
              margin-bottom: 16px !important;
            }
            
            .wmde-markdown ul {
              list-style-type: disc !important;
            }
            
            .wmde-markdown ul ul {
              list-style-type: circle !important;
            }
            
            .wmde-markdown ul ul ul {
              list-style-type: square !important;
            }
            
            .wmde-markdown li {
              margin-top: 0.25em !important;
              word-wrap: break-all !important;
            }
            
            .wmde-markdown li::marker {
              color: ${previewTheme === 'dark' ? '#8b949e' : '#6a737d'} !important;
            }
            
            .wmde-markdown li+li {
              margin-top: 0.25em !important;
            }
            
            .wmde-markdown li > p {
              margin-top: 16px !important;
            }
            
            .wmde-markdown li > ul, .wmde-markdown li > ol {
              margin-top: 0 !important;
              margin-bottom: 0 !important;
            }
            .w-md-editor-content{
              display: flex;
            }
            .w-md-editor-preview{
              position: sticky;
              top: 0;
              width: 50%;
            }
            
            .w-md-editor-preview{
              box-shadow: ${isDark ? '0 0 10px rgba(0, 0, 0, 0.5)' : '0 0 10px rgba(255, 255, 255, 0.5)'};
            }

            .w-md-editor-area{
              width: ${selectedTab === 2 ? '50%' : '100%'} !important;
            }
            
            /* Task lists */
            .wmde-markdown input[type="checkbox"] {
              margin-right: 0.5em !important;
              margin-top: 0 !important;
              vertical-align: middle !important;
            }
          `}</style>
          <MDEditor
            value={value}
            onChange={handleChange}
            preview={selectedTab === 0 ? "edit" : selectedTab === 1 ? "preview" : "live"}
            height="100%"
            visibleDragbar={false}
            hideToolbar={true}
            className={cn(
              "w-full h-full border-none bg-transparent",
              "md-editor-custom",
              selectedTab === 2 && "split-mode"
            )}
            style={{ 
              backgroundColor: isDark ? '#111827' : '#f9fafb',
              color: isDark ? '#e0e0e0' : '#333333'
            }}
            previewOptions={{
              className: cn(
                previewClassName,
                selectedTab === 2 && "split-mode-preview"
              ),
              remarkPlugins: [
                remarkGfm,
                [remarkEmoji, { emoticon: true }]
              ]
            }}
            textareaProps={{
              placeholder: "# A Christmas Carol\n\nBy Charles Dickens\n\nChapter 1: Marley's Ghost\n\nMarley was dead, to begin with. There is no doubt whatever about that...",
              style: {
                backgroundColor: isDark ? '#111827' : '#f9fafb',
                color: isDark ? '#e0e0e0' : '#333333',
                fontSize: '16px',
                lineHeight: '1.8',
                padding: '2rem',
                height: '100%',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                letterSpacing: '0.01em',
                caretColor: '#3b82f6'
              },
              className: cn(
                "editor-textarea",
                selectedTab === 2 && "split-mode-textarea"
              )
            }}
          />
        </div>
        
        <div 
          className={cn(
            "px-6 py-2 text-xs flex justify-between items-center border-t",
            isDark 
              ? "bg-gray-900/80 text-gray-400 border-gray-800" 
              : "bg-gray-50/80 text-gray-500 border-gray-200",
            "backdrop-blur-sm"
          )}
        >
          <div className="flex items-center space-x-2">
            <div className={cn(
              "h-1.5 w-1.5 rounded-full",
              activeDocument ? "bg-green-400" : "bg-gray-400"
            )}></div>
            <span className="text-xs font-medium">
              {activeDocument ? "Saved" : "Not saved"}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <span className="font-semibold mr-1">{wordCount.words}</span> words
            </span>
            <span className="flex items-center">
              <span className="font-semibold mr-1">{wordCount.chars}</span> characters
            </span>
            {activeDocument && (
              <span className="flex items-center">
                Last updated: <span className="font-semibold ml-1">{new Date(activeDocument.updatedAt).toLocaleString()}</span>
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 