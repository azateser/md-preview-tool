import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, FileText, Package, ArrowRight, Check, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (template: string, projectInfo: ProjectInfo) => Promise<void>;
}

export interface ProjectInfo {
  name: string;
  description: string;
  features: string[];
  techStack: string[];
  installation?: string;
  usage?: string;
  additionalInfo?: string;
  githubUsername?: string;
  socialLinks?: {
    type: string;
    url: string;
  }[];
}

interface Template {
  id?: string;
  name: string;
  content: string;
  category: string;
  description: string;
  icon?: React.ReactNode;
}

const categories = {
  readme: {
    name: "README",
    description: "Project documentation templates",
    icon: FileText
  },
  documentation: {
    name: "Docs",
    description: "API and Component documentation",
    icon: BookOpen
  },
  profile: {
    name: "Profile",
    description: "GitHub profile templates",
    icon: User
  }
};

export function AIModal({ isOpen, onClose, onGenerate }: AIModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [step, setStep] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string>('readme');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedTemplateContent, setSelectedTemplateContent] = useState<string>('');
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [allTemplates, setAllTemplates] = useState<Template[]>([]);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: '',
    description: '',
    features: [''],
    techStack: [''],
    githubUsername: '',
    socialLinks: [],
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedTemplate(null);
      setSelectedTemplateContent('');
      setSelectedTemplateCategory('');
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!isOpen) return;
      
      setLoadingTemplates(true);
      try {
        const response = await fetch('/api/templates');
        if (!response.ok) {
          throw new Error(`API error response: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data || !Array.isArray(data)) {
          console.error("Invalid data format from API:", data);
          return;
        }
        
        
        // Change blog category to profile
        const transformedData = data.map((template: Template) => {
          if (template.category === 'blog') {
            return { ...template, category: 'profile' };
          }
          return template;
        });
        
        
        const templatesWithIds = transformedData.map((template: Template) => ({
          ...template,
          id: `${template.category}-${template.name.toLowerCase().replace(/\s+/g, '-')}`
        }));
        
        const templatesWithIcons = templatesWithIds.map((template: Template) => {
          let icon;
          if (template.category === 'readme') {
            icon = <FileText size={24} />;
          } else if (template.category === 'documentation') {
            icon = <BookOpen size={24} />;
          } else if (template.category === 'profile') {
            icon = <User size={24} />;
          } else {
            icon = <Package size={24} />;
          }
          return { ...template, icon };
        });
        
        
        setAllTemplates(templatesWithIcons);
        filterTemplatesByCategory(templatesWithIcons, activeCategory);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, [isOpen, activeCategory]);
  
  const filterTemplatesByCategory = (templatesArray: Template[], category: string) => {
    if (!templatesArray || !Array.isArray(templatesArray) || templatesArray.length === 0) {
      setTemplates([]);
      return;
    }
    const filtered = templatesArray.filter(t => t.category === category);
    setTemplates(filtered);
  };
  
  useEffect(() => {
    if (allTemplates && Array.isArray(allTemplates) && allTemplates.length > 0) {
      filterTemplatesByCategory(allTemplates, activeCategory);
      setSelectedTemplate(null);
      setSelectedTemplateContent('');
      setSelectedTemplateCategory('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    const selectedTemplate = allTemplates.find(template => template.id === templateId);
    if (selectedTemplate) {
      setSelectedTemplateContent(selectedTemplate.content);
      setSelectedTemplateCategory(selectedTemplate.category);
      setStep(2);
    } else {
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setStep(1);
    setSelectedTemplate(null);
    setSelectedTemplateContent('');
    setSelectedTemplateCategory('');
  };

  const handleAddItem = (field: 'features' | 'techStack') => {
    setProjectInfo({
      ...projectInfo,
      [field]: [...projectInfo[field], '']
    });
  };

  const handleRemoveItem = (field: 'features' | 'techStack', index: number) => {
    const newArray = [...projectInfo[field]];
    newArray.splice(index, 1);
    setProjectInfo({
      ...projectInfo,
      [field]: newArray
    });
  };

  const handleItemChange = (field: 'features' | 'techStack', index: number, value: string) => {
    const newArray = [...projectInfo[field]];
    newArray[index] = value;
    setProjectInfo({
      ...projectInfo,
      [field]: newArray
    });
  };

  const handleAddSocialLink = () => {
    const updatedLinks = [...(projectInfo.socialLinks || [])];
    const suggestedTypes = ['GitHub', 'Twitter', 'LinkedIn', 'Portfolio', 'Instagram', 'YouTube'];
    const suggestedType = updatedLinks.length === 0 ? 'GitHub' : 
      suggestedTypes.find(type => !updatedLinks.some(link => link.type === type)) || 'Other';
    
    updatedLinks.push({ type: suggestedType, url: '' });
    setProjectInfo({
      ...projectInfo,
      socialLinks: updatedLinks
    });
  };

  const handleRemoveSocialLink = (index: number) => {
    const updatedLinks = [...(projectInfo.socialLinks || [])];
    updatedLinks.splice(index, 1);
    setProjectInfo({
      ...projectInfo,
      socialLinks: updatedLinks
    });
  };

  const handleSocialLinkChange = (index: number, field: 'type' | 'url', value: string) => {
    const updatedLinks = [...(projectInfo.socialLinks || [])];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setProjectInfo({
      ...projectInfo,
      socialLinks: updatedLinks
    });
  };

  const handleGenerate = async () => {
    if (!selectedTemplateContent) return;
    
    setLoading(true);
    try {
      
      const response = await fetch('/api/ai-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateContent: selectedTemplateContent,
          templateCategory: selectedTemplateCategory,
          projectInfo
        }),
      });
      
      if (!response.ok) {
        throw new Error(`AI service API returned error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(`AI service error: ${data.error}`);
      }
      
      const markdownContent = data.content;
      
      await onGenerate(markdownContent, projectInfo);
      
      setLoading(false);
      onClose();
      
      setStep(1);
      setSelectedTemplate(null);
      setSelectedTemplateContent('');
      setSelectedTemplateCategory('');
      setProjectInfo({
        name: '',
        description: '',
        features: [''],
        techStack: [''],
        githubUsername: '',
        socialLinks: [],
      });
    } catch (error) {
      console.error("Error in AI generation process:", error);
      setLoading(false);
      
      try {
        await onGenerate(selectedTemplateContent, projectInfo);
        onClose();
      } catch (fallbackError) {
        console.error("Even fallback failed:", fallbackError);
      }
    }
  };

  const isFormValid = () => {
    if (selectedTemplateCategory === 'profile') {
      return (
        projectInfo.name.trim() !== '' &&
        projectInfo.description.trim() !== '' &&
        (projectInfo.githubUsername?.trim() || '') !== ''
      );
    }
    
    return (
      projectInfo.name.trim() !== '' &&
      projectInfo.description.trim() !== '' &&
      projectInfo.features.filter(f => f.trim() !== '').length > 0 &&
      projectInfo.techStack.filter(t => t.trim() !== '').length > 0
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            className={cn(
              "w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-xl shadow-xl",
              isDark ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"
            )}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={cn(
              "flex items-center justify-between px-6 py-4 border-b",
              isDark ? "border-gray-800" : "border-gray-200"
            )}>
              <div className="flex items-center">
                <div className="relative mr-3">
                  <Sparkles className={cn(
                    "h-5 w-5",
                    isDark ? "text-indigo-400" : "text-indigo-600"
                  )} />
                  <motion.span
                    className={cn(
                      "absolute -inset-1 rounded-full blur-sm -z-10",
                      isDark ? "bg-indigo-600/30" : "bg-indigo-500/20"
                    )}
                    animate={{ scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <h2 className={cn(
                  "text-lg font-semibold",
                  isDark ? "text-white" : "text-gray-800"
                )}>
                  {step === 1 ? 'Select Template' : 'Enter Information'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  isDark 
                    ? "text-gray-400 hover:text-white hover:bg-gray-800" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                )}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className={cn(
              "px-6 py-2 flex items-center border-b",
              isDark ? "border-gray-800 bg-gray-950" : "border-gray-200 bg-gray-50"
            )}>
              <div className="flex items-center space-x-2 w-full">
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium",
                  step >= 1 
                    ? isDark 
                      ? "bg-indigo-600 text-white" 
                      : "bg-indigo-600 text-white"
                    : isDark 
                      ? "bg-gray-800 text-gray-400" 
                      : "bg-gray-200 text-gray-600"
                )}>
                  {step > 1 ? <Check className="h-3.5 w-3.5" /> : 1}
                </div>
                <div className={cn(
                  "h-0.5 flex-1",
                  step > 1 
                    ? isDark 
                      ? "bg-indigo-600" 
                      : "bg-indigo-600"
                    : isDark 
                      ? "bg-gray-800" 
                      : "bg-gray-200"
                )} />
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium",
                  step >= 2 
                    ? isDark 
                      ? "bg-indigo-600 text-white" 
                      : "bg-indigo-600 text-white"
                    : isDark 
                      ? "bg-gray-800 text-gray-400" 
                      : "bg-gray-200 text-gray-600"
                )}>
                  {step > 2 ? <Check className="h-3.5 w-3.5" /> : 2}
                </div>
              </div>
            </div>

            <div className={cn(
              "overflow-y-auto",
              isDark ? "text-gray-100" : "text-gray-800"
            )} style={{ maxHeight: "calc(85vh - 120px)" }} onClick={(e) => e.stopPropagation()}>
              
              {step === 1 && (
                <div className="p-6 pb-24">
                  <p className={cn(
                    "text-sm mb-4",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}>
                    Choose a template. AI will customize the selected template based on your information.
                  </p>
                  
                  <div className={cn(
                    "flex border-b mb-5 gap-2",
                    isDark ? "border-gray-800" : "border-gray-200"
                  )}>
                    {Object.entries(categories).map(([key, category]) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={key}
                          className={cn(
                            "flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                            "flex items-center justify-center gap-1.5",
                            activeCategory === key
                              ? isDark 
                                ? "bg-indigo-600/20 text-indigo-400 border-b-2 border-indigo-500" 
                                : "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-500"
                              : isDark
                                ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          )}
                          onClick={() => setActiveCategory(key)}
                        >
                          <Icon size={16} />
                          {category.name}
                        </button>
                      );
                    })}
                  </div>
                  
                  {loadingTemplates ? (
                    <div className="flex justify-center items-center py-12">
                      <motion.div
                        className={cn(
                          "h-8 w-8 border-2 rounded-full border-t-transparent",
                          isDark ? "border-indigo-500" : "border-indigo-600"
                        )}
                        animate={{ rotate: 360 }}
                        transition={{ 
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {templates.map((template) => (
                        <motion.div
                          key={template.id}
                          className={cn(
                            "border rounded-lg p-4 cursor-pointer h-full flex flex-col overflow-x-auto",
                            selectedTemplate === template.id 
                              ? isDark 
                                ? "border-indigo-500 bg-indigo-900/20" 
                                : "border-indigo-500 bg-indigo-50"
                              : isDark 
                                ? "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50" 
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          )}
                          whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleTemplateSelect(template.id || '')}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className={cn(
                              "p-2.5 rounded-lg",
                              isDark ? "bg-gray-800" : "bg-gray-100"
                            )}>
                              {template.icon}
                            </div>
                            
                            <div className={cn(
                              "flex-shrink-0 h-5 w-5 rounded-full border-2",
                              selectedTemplate === template.id 
                                ? isDark 
                                  ? "border-indigo-500 bg-indigo-700" 
                                  : "border-indigo-600 bg-indigo-100"
                                : isDark 
                                  ? "border-gray-600" 
                                  : "border-gray-300"
                            )}/>
                          </div>

                          <h3 className="font-medium text-lg mb-1">{template.name}</h3>
                          <p className={cn(
                            "text-sm mb-3",
                            isDark ? "text-gray-400" : "text-gray-500"
                          )}>
                            {template.description}
                          </p>
                          
                          <div className={cn(
                            "mt-auto p-3 rounded font-mono text-xs w-full",
                            isDark ? "bg-gray-800/80 text-gray-300" : "bg-gray-50 text-gray-700"
                          )}>
                            <div className="max-h-24 overflow-hidden relative">
                              <pre className="whitespace-pre-wrap text-xs break-all">{template.content}</pre>
                              <div className={cn(
                                "absolute bottom-0 left-0 right-0 h-8",
                                isDark 
                                  ? "bg-gradient-to-t from-gray-800/90 to-transparent" 
                                  : "bg-gradient-to-t from-gray-50/90 to-transparent"
                              )} />
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {templates.length === 0 && (
                        <div className={cn(
                          "col-span-2 p-8 rounded-lg text-center border",
                          isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-gray-50"
                        )}>
                          <FileText className={cn(
                            "mx-auto mb-3 h-10 w-10",
                            isDark ? "text-gray-600" : "text-gray-400"
                          )} />
                          <p className="text-lg font-medium mb-1">
                            No templates found in this category
                          </p>
                          <p className={cn(
                            "text-sm",
                            isDark ? "text-gray-400" : "text-gray-500"
                          )}>
                            You can add templates to src/templates/{activeCategory} directory
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {step === 2 && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className={cn(
                      "text-sm",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}>
                      Fill in the {selectedTemplateCategory === 'profile' ? 'profile' : 'project'} information for AI to generate your template. Fields marked with * are required.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedTemplateCategory === 'profile' ? (
                      <>
                        <div>
                          <label className={cn(
                            "block text-sm font-medium mb-1",
                            isDark ? "text-gray-300" : "text-gray-700"
                          )}>
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            className={cn(
                              "w-full px-3 py-2 rounded-md",
                              isDark 
                                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" 
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-400",
                              "border focus:outline-none",
                              isDark ? "focus:border-indigo-500" : "focus:border-indigo-600"
                            )}
                            placeholder="Enter your name"
                            value={projectInfo.name}
                            onChange={(e) => setProjectInfo({...projectInfo, name: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <label className={cn(
                            "block text-sm font-medium mb-1",
                            isDark ? "text-gray-300" : "text-gray-700"
                          )}>
                            GitHub Username <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            className={cn(
                              "w-full px-3 py-2 rounded-md",
                              isDark 
                                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" 
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-400",
                              "border focus:outline-none",
                              isDark ? "focus:border-indigo-500" : "focus:border-indigo-600"
                            )}
                            placeholder="Your GitHub username"
                            value={projectInfo.githubUsername}
                            onChange={(e) => setProjectInfo({...projectInfo, githubUsername: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <label className={cn(
                            "block text-sm font-medium mb-1",
                            isDark ? "text-gray-300" : "text-gray-700"
                          )}>
                            Profile Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            className={cn(
                              "w-full px-3 py-2 rounded-md min-h-[100px]",
                              isDark 
                                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" 
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-400",
                              "border focus:outline-none",
                              isDark ? "focus:border-indigo-500" : "focus:border-indigo-600"
                            )}
                            placeholder="Briefly introduce yourself"
                            value={projectInfo.description}
                            onChange={(e) => setProjectInfo({...projectInfo, description: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className={cn(
                              "block text-sm font-medium",
                              isDark ? "text-gray-300" : "text-gray-700"
                            )}>
                              Social Media Accounts (Optional)
                            </label>
                            
                            <button
                              type="button"
                              className={cn(
                                "flex items-center gap-1 text-sm px-3 py-1 rounded-md",
                                isDark 
                                  ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                                  : "bg-indigo-500 text-white hover:bg-indigo-600",
                                "transition-colors duration-150"
                              )}
                              onClick={handleAddSocialLink}
                            >
                              <span>+</span>
                              <span>Add Account</span>
                            </button>
                          </div>
                          
                          {projectInfo.socialLinks && projectInfo.socialLinks.length > 0 ? (
                            projectInfo.socialLinks.map((link, index) => (
                              <div key={`social-${index}`} className="flex items-center gap-2 mb-2">
                                <select
                                  className={cn(
                                    "px-3 py-2 rounded-md",
                                    isDark 
                                      ? "bg-gray-800 border-gray-700 text-white" 
                                      : "bg-white border-gray-300 text-gray-900",
                                    "border focus:outline-none",
                                    isDark ? "focus:border-indigo-500" : "focus:border-indigo-600"
                                  )}
                                  value={link.type}
                                  onChange={(e) => handleSocialLinkChange(index, 'type', e.target.value)}
                                >
                                  <option value="GitHub">GitHub</option>
                                  <option value="Twitter">Twitter</option>
                                  <option value="LinkedIn">LinkedIn</option>
                                  <option value="Instagram">Instagram</option>
                                  <option value="Facebook">Facebook</option>
                                  <option value="YouTube">YouTube</option>
                                  <option value="Discord">Discord</option>
                                  <option value="Medium">Medium</option>
                                  <option value="Dev.to">Dev.to</option>
                                </select>
                                
                                <input
                                  type="text"
                                  className={cn(
                                    "flex-1 px-3 py-2 rounded-md",
                                    isDark 
                                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" 
                                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400",
                                    "border focus:outline-none",
                                    isDark ? "focus:border-indigo-500" : "focus:border-indigo-600"
                                  )}
                                  placeholder={`Your ${link.type} link`}
                                  value={link.url}
                                  onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                                />
                                
                                <button
                                  type="button"
                                  className={cn(
                                    "p-2 rounded-md",
                                    isDark ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                  )}
                                  onClick={() => handleRemoveSocialLink(index)}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className={cn(
                              "text-sm py-2",
                              isDark ? "text-gray-400" : "text-gray-500"
                            )}>
                              No social media accounts added.
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className={cn(
                            "block text-sm font-medium mb-1",
                            isDark ? "text-gray-300" : "text-gray-700"
                          )}>
                            Project Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            className={cn(
                              "w-full px-3 py-2 rounded-md",
                              isDark 
                                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" 
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-400",
                              "border focus:outline-none",
                              isDark ? "focus:border-indigo-500" : "focus:border-indigo-600"
                            )}
                            placeholder="Enter project name"
                            value={projectInfo.name}
                            onChange={(e) => setProjectInfo({...projectInfo, name: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <label className={cn(
                            "block text-sm font-medium mb-1",
                            isDark ? "text-gray-300" : "text-gray-700"
                          )}>
                            Project Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            className={cn(
                              "w-full px-3 py-2 rounded-md min-h-[100px]",
                              isDark 
                                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" 
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-400",
                              "border focus:outline-none",
                              isDark ? "focus:border-indigo-500" : "focus:border-indigo-600"
                            )}
                            placeholder="Briefly describe what your project does"
                            value={projectInfo.description}
                            onChange={(e) => setProjectInfo({...projectInfo, description: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <label className={cn(
                            "block text-sm font-medium mb-1",
                            isDark ? "text-gray-300" : "text-gray-700"
                          )}>
                            Features <span className="text-red-500">*</span>
                          </label>
                          {projectInfo.features.map((feature, index) => (
                            <div key={`feature-${index}`} className="flex items-center mb-2">
                              <input
                                type="text"
                                className={cn(
                                  "w-full px-3 py-2 rounded-md",
                                  isDark 
                                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" 
                                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400",
                                  "border focus:outline-none",
                                  isDark ? "focus:border-indigo-500" : "focus:border-indigo-600"
                                )}
                                placeholder={`Feature #${index + 1}`}
                                value={feature}
                                onChange={(e) => handleItemChange('features', index, e.target.value)}
                              />
                              <button
                                type="button"
                                className={cn(
                                  "ml-2 p-2 rounded-md",
                                  isDark ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                )}
                                onClick={() => handleRemoveItem('features', index)}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className={cn(
                              "text-sm flex items-center gap-1 px-4 py-2 rounded-md",
                              isDark 
                                ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                            onClick={() => handleAddItem('features')}
                          >
                            <span className="text-lg">+</span>
                            <span>Add Feature</span>
                          </button>
                        </div>
                        
                        <div>
                          <label className={cn(
                            "block text-sm font-medium mb-1",
                            isDark ? "text-gray-300" : "text-gray-700"
                          )}>
                            Tech Stack <span className="text-red-500">*</span>
                          </label>
                          {projectInfo.techStack.map((tech, index) => (
                            <div key={`tech-${index}`} className="flex items-center mb-2">
                              <input
                                type="text"
                                className={cn(
                                  "w-full px-3 py-2 rounded-md",
                                  isDark 
                                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" 
                                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400",
                                  "border focus:outline-none",
                                  isDark ? "focus:border-indigo-500" : "focus:border-indigo-600"
                                )}
                                placeholder={`Technology #${index + 1}`}
                                value={tech}
                                onChange={(e) => handleItemChange('techStack', index, e.target.value)}
                              />
                              <button
                                type="button"
                                className={cn(
                                  "ml-2 p-2 rounded-md",
                                  isDark ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                )}
                                onClick={() => handleRemoveItem('techStack', index)}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className={cn(
                              "text-sm flex items-center gap-1 px-4 py-2 rounded-md",
                              isDark 
                                ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                            onClick={() => handleAddItem('techStack')}
                          >
                            <span className="text-lg">+</span>
                            <span>Add Technology</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className={cn(
              "px-6 py-4 flex items-center justify-between border-t sticky bottom-0",
              isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
            )} onClick={(e) => e.stopPropagation()}>
              {step === 1 ? (
                <div />
              ) : (
                <button
                  className={cn(
                    "flex items-center justify-center rounded-full w-10 h-10",
                    isDark 
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                  onClick={(e) => handleBackClick(e)}
                  type="button"
                >
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
              )}
              
              {step === 1 ? (
                <button
                  className={cn(
                    "flex items-center justify-center rounded-full w-10 h-10",
                    selectedTemplate 
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-700 hover:to-indigo-600" 
                      : "bg-gray-400 cursor-not-allowed text-white",
                  )}
                  onClick={() => {
                    if (selectedTemplate) setStep(2);
                  }}
                  disabled={!selectedTemplate}
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <motion.button
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-lg relative overflow-hidden font-medium shadow-lg",
                    isFormValid() 
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700" 
                      : "bg-gray-400 text-white cursor-not-allowed",
                  )}
                  onClick={handleGenerate}
                  disabled={!isFormValid() || loading}
                  whileHover={{ scale: isFormValid() ? 1.02 : 1 }}
                  whileTap={{ scale: isFormValid() ? 0.98 : 1 }}
                >
                  {loading ? (
                    <>
                      <motion.span
                        className="inline-block h-5 w-5 border-2 border-white/30 border-t-white/90 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="font-bold">Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span className="font-bold">Generate with AI</span>
                    </>
                  )}
                  
                  {isFormValid() && !loading && (
                    <motion.span 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 