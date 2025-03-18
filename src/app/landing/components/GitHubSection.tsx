"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { Sparkles, FileCode, Github } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

const profileAlternatives = [
  {
    name: "Azat ESER",
    role: "Full Stack Developer",
    bio: "Building innovative solutions with code",
    working: "Next.js & React Applications",
    learning: "Rust & WebAssembly",
    askMe: "React, TypeScript, TailwindCSS",
    email: "azat@example.com",
    github: "azateser",
    projects: [
      {
        name: "Markdown Preview",
        desc: "Modern markdown editor and previewer",
        tech: "Next.js, TailwindCSS, TypeScript"
      },
      {
        name: "DevPortfolio",
        desc: "Beautiful portfolio template for developers",
        tech: "React, Framer Motion, Three.js"
      }
    ]
  },
  {
    name: "John Doe",
    role: "Frontend Engineer",
    bio: "Crafting pixel-perfect user experiences",
    working: "Design Systems & UI Components",
    learning: "WebGL & 3D Animations",
    askMe: "Vue.js, CSS Architecture, Web Performance",
    email: "john@example.com",
    github: "johndoe",
    projects: [
      {
        name: "UI Framework",
        desc: "Modern component library for web apps",
        tech: "Vue.js, Storybook, SCSS"
      },
      {
        name: "Portfolio 3D",
        desc: "Interactive 3D portfolio showcase",
        tech: "React, Three.js, GSAP"
      }
    ]
  },
  {
    name: "Sara Johnson",
    role: "Backend Developer",
    bio: "Solving complex system challenges",
    working: "Microservices Architecture",
    learning: "Blockchain & Smart Contracts",
    askMe: "Node.js, MongoDB, GraphQL",
    email: "sara@example.com",
    github: "saradev",
    projects: [
      {
        name: "API Ecosystem",
        desc: "Robust REST & GraphQL API platform",
        tech: "Node.js, Express, MongoDB"
      },
      {
        name: "Cloud Deployer",
        desc: "One-click deployment solution",
        tech: "Docker, Kubernetes, AWS"
      }
    ]
  },
  {
    name: "Emma Wilson",
    role: "DevOps Engineer",
    bio: "Automating everything in sight",
    working: "Infrastructure as Code",
    learning: "Edge Computing & IoT",
    askMe: "Kubernetes, Terraform, CI/CD",
    email: "emma@example.com",
    github: "emmaops",
    projects: [
      {
        name: "Cloud Guardian",
        desc: "Multi-cloud infrastructure manager",
        tech: "Terraform, AWS, GCP, Azure"
      },
      {
        name: "Monitor Pro",
        desc: "Real-time system monitoring dashboard",
        tech: "Prometheus, Grafana, Go"
      }
    ]
  }
];

interface EditableField {
  value: string;
  isEditing: boolean;
  elementRef: React.RefObject<HTMLSpanElement | null>;
}

export const GitHubSection = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [markdownContent, setMarkdownContent] = useState('');
  const [profileIndex, setProfileIndex] = useState(0);
  const [isChangingFields, setIsChangingFields] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animatingFieldRef = useRef('');
  const fieldChangeQueue = useRef<Array<{ fieldId: keyof typeof editableFields, newValue: string }>>([]);

  const [editableFields, setEditableFields] = useState<{
    name: EditableField;
    role: EditableField;
    bio: EditableField;
    working: EditableField;
    learning: EditableField;
    askMe: EditableField;
    email: EditableField;
    project1Name: EditableField;
    project1Desc: EditableField; 
    project1Tech: EditableField;
    project2Name: EditableField;
    project2Desc: EditableField;
    project2Tech: EditableField;
    github: EditableField;
  }>({
    name: { 
      value: profileAlternatives[0].name, 
      isEditing: false,
      elementRef: useRef<HTMLSpanElement>(null)
    },
    role: { 
      value: profileAlternatives[0].role, 
      isEditing: false,
      elementRef: useRef<HTMLSpanElement>(null)
    },
    bio: { 
      value: profileAlternatives[0].bio, 
      isEditing: false,
      elementRef: useRef<HTMLSpanElement>(null)
    },
    working: { 
      value: profileAlternatives[0].working, 
      isEditing: false,
      elementRef: useRef<HTMLSpanElement>(null)
    },
    learning: { 
      value: profileAlternatives[0].learning, 
      isEditing: false,
      elementRef: useRef<HTMLSpanElement>(null)
    },
    askMe: { 
      value: profileAlternatives[0].askMe, 
      isEditing: false,
      elementRef: useRef<HTMLSpanElement>(null)
    },
    email: { 
      value: profileAlternatives[0].email, 
      isEditing: false,
      elementRef: useRef<HTMLSpanElement>(null)
    },
    project1Name: { 
      value: profileAlternatives[0].projects[0].name, 
      isEditing: false,
      elementRef: useRef<HTMLSpanElement>(null)
    },
    project1Desc: { 
      value: profileAlternatives[0].projects[0].desc, 
      isEditing: false,
      elementRef: useRef<HTMLSpanElement>(null)
    },
    project1Tech: { 
      value: profileAlternatives[0].projects[0].tech, 
      isEditing: false,
      elementRef: useRef<HTMLSpanElement>(null)
    },
    project2Name: { 
      value: profileAlternatives[0].projects[1].name, 
      isEditing: false,
      elementRef: useRef<HTMLSpanElement>(null)
    },
    project2Desc: { 
      value: profileAlternatives[0].projects[1].desc, 
      isEditing: false,
      elementRef: useRef<HTMLSpanElement>(null)
    },
    project2Tech: { 
      value: profileAlternatives[0].projects[1].tech, 
      isEditing: false,
      elementRef: useRef<HTMLSpanElement>(null)
    },
    github: { 
      value: profileAlternatives[0].github, 
      isEditing: false,
      elementRef: useRef<HTMLSpanElement>(null)
    }
  });

  const generateMarkdownContent = useCallback(() => {
    return `<div align="center">
       
       # 👋 Hello World, I'm <span id="name" class="editable-field">${editableFields.name.value}</span>

       [![GitHub followers](https://img.shields.io/github/followers/${editableFields.github.value}?style=social)](https://github.com/${editableFields.github.value})

       <p><span id="role" class="editable-field">${editableFields.role.value}</span> <span id="bio" class="editable-field">${editableFields.bio.value}</span></p>

       </div>

       ## About Me

       - 🔭 I'm currently working on **<span id="working" class="editable-field">${editableFields.working.value}</span>**
       - 🌱 I'm currently learning **<span id="learning" class="editable-field">${editableFields.learning.value}</span>**
       - 💬 Ask me about **<span id="askMe" class="editable-field">${editableFields.askMe.value}</span>**
       - 📫 How to reach me: **<span id="email" class="editable-field">${editableFields.email.value}</span>**

       ## 💻 Tech Stack

       \`\`\`json
       {
         "languages": ["JavaScript", "TypeScript", "Python", "Go"],
         "frontend": ["React", "Next.js", "TailwindCSS", "Framer Motion"],
         "backend": ["Node.js", "Express", "Django", "FastAPI"],
         "databases": ["MongoDB", "PostgreSQL", "Redis"],
         "devOps": ["Docker", "Kubernetes", "AWS", "CI/CD"],
         "tools": ["Git", "VS Code", "Figma", "Postman"]
       }
       \`\`\`

       ## 📊 GitHub Stats

       <div align="center">
         <img src="https://github-readme-stats.vercel.app/api?username=${editableFields.github.value}&show_icons=true&theme=tokyonight" alt="GitHub Stats" />
         <img src="https://github-readme-streak-stats.herokuapp.com/?user=${editableFields.github.value}&theme=tokyonight" alt="GitHub Streak" />
       </div>

       ## 🌟 Featured Projects

       ### 1. <span id="project1Name" class="editable-field">${editableFields.project1Name.value}</span>

       - **Description**: <span id="project1Desc" class="editable-field">${editableFields.project1Desc.value}</span>
       - **Tech Stack**: <span id="project1Tech" class="editable-field">${editableFields.project1Tech.value}</span>
       - **Links**: [GitHub](https://github.com/${editableFields.github.value}/project-1) · [Demo](https://project-1.demo.com)

       ### 2. <span id="project2Name" class="editable-field">${editableFields.project2Name.value}</span>

       - **Description**: <span id="project2Desc" class="editable-field">${editableFields.project2Desc.value}</span>
       - **Tech Stack**: <span id="project2Tech" class="editable-field">${editableFields.project2Tech.value}</span>
       - **Links**: [GitHub](https://github.com/${editableFields.github.value}/project-2) · [Demo](https://project-2.demo.com)

       ## 📫 Connect with Me

       <div align="center">
         
       [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/${editableFields.github.value})
       [![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${editableFields.github.value})
       [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${editableFields.github.value})
         
       </div>

       ---

       <div align="center">
         
         <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer" width="100%" />
         
         <i>Happy coding!</i> 🚀
         
       </div>`;
  }, [editableFields]);

  // Markdown önizlemesi için düzenlenmiş içerik oluştur (HTML etiketleri olmadan)
  const generatePreviewMarkdownContent = () => {
    return `# 👋 Hello World, I'm ${editableFields.name.value}

[![GitHub followers](https://img.shields.io/github/followers/${editableFields.github.value}?style=social)](https://github.com/${editableFields.github.value})

${editableFields.role.value} ${editableFields.bio.value}

## About Me

- 🔭 I'm currently working on **${editableFields.working.value}**
- 🌱 I'm currently learning **${editableFields.learning.value}**
- 💬 Ask me about **${editableFields.askMe.value}**
- 📫 How to reach me: **${editableFields.email.value}**

## 💻 Tech Stack

\`\`\`json
{
  "languages": ["JavaScript", "TypeScript", "Python", "Go"],
  "frontend": ["React", "Next.js", "TailwindCSS", "Framer Motion"],
  "backend": ["Node.js", "Express", "Django", "FastAPI"],
  "databases": ["MongoDB", "PostgreSQL", "Redis"],
  "devOps": ["Docker", "Kubernetes", "AWS", "CI/CD"],
  "tools": ["Git", "VS Code", "Figma", "Postman"]
}
\`\`\`

## 📊 GitHub Stats

<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=${editableFields.github.value}&show_icons=true&theme=tokyonight" alt="GitHub Stats" />
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${editableFields.github.value}&theme=tokyonight" alt="GitHub Streak" />
</div>

## 🌟 Featured Projects

### 1. ${editableFields.project1Name.value}

- **Description**: ${editableFields.project1Desc.value}
- **Tech Stack**: ${editableFields.project1Tech.value}
- **Links**: [GitHub](https://github.com/${editableFields.github.value}/project-1) · [Demo](https://project-1.demo.com)

### 2. ${editableFields.project2Name.value}

- **Description**: ${editableFields.project2Desc.value}
- **Tech Stack**: ${editableFields.project2Tech.value}
- **Links**: [GitHub](https://github.com/${editableFields.github.value}/project-2) · [Demo](https://project-2.demo.com)

## 📫 Connect with Me

<div align="center">
  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/${editableFields.github.value})
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${editableFields.github.value})
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${editableFields.github.value})
  
</div>

---

<div align="center">
  
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer" width="100%" />
  
  <i>Happy coding!</i> 🚀
  
</div>`;
  };

  // Başlangıç içeriğini ve alanlarını ayarla
  useEffect(() => {
    const initialContent = generateMarkdownContent();
    setMarkdownContent(initialContent);
  }, [editableFields, generateMarkdownContent]);

  // Belirli bir alanı değiştir
  const changeField = useCallback((fieldId: keyof typeof editableFields, newValue: string) => {
    animatingFieldRef.current = fieldId;
    
    setEditableFields(prev => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        isEditing: true
      }
    }));

    const eraseField = (currentText: string, index: number) => {
      if (index >= 0) {
        setTimeout(() => {
          setEditableFields(prev => ({
            ...prev,
            [fieldId]: {
              ...prev[fieldId],
              value: currentText.slice(0, index)
            }
          }));
          eraseField(currentText, index - 1);
        }, 40);
      } else {
        typeNewValue(newValue, 0);
      }
    };

    const typeNewValue = (newVal: string, index: number) => {
      if (index <= newVal.length) {
        setTimeout(() => {
          setEditableFields(prev => ({
            ...prev,
            [fieldId]: {
              ...prev[fieldId],
              value: newVal.slice(0, index)
            }
          }));
          
          if (index === newVal.length) {
            setEditableFields(prev => ({
              ...prev,
              [fieldId]: {
                ...prev[fieldId],
                isEditing: false
              }
            }));
            
            animatingFieldRef.current = '';
            
            if (fieldChangeQueue.current.length === 0) {
              setIsChangingFields(false);
            } else {
              const nextField = fieldChangeQueue.current.shift();
              if (nextField) {
                const { fieldId: nextFieldId, newValue: nextValue } = nextField;
                changeField(nextFieldId, nextValue);
              }
            }
          } else {
            typeNewValue(newVal, index + 1);
          }
        }, 60);
      }
    };

    eraseField(editableFields[fieldId].value, editableFields[fieldId].value.length);
  }, []);

  // Profili değiştir
  const changeProfile = useCallback(() => {
    if (isChangingFields) return;
    
    setIsChangingFields(true);
    
    const nextProfileIndex = (profileIndex + 1) % profileAlternatives.length;
    setProfileIndex(nextProfileIndex);
    
    fieldChangeQueue.current = [
      { fieldId: 'name', newValue: profileAlternatives[nextProfileIndex].name },
      { fieldId: 'role', newValue: profileAlternatives[nextProfileIndex].role },
      { fieldId: 'bio', newValue: profileAlternatives[nextProfileIndex].bio },
      { fieldId: 'working', newValue: profileAlternatives[nextProfileIndex].working },
      { fieldId: 'learning', newValue: profileAlternatives[nextProfileIndex].learning },
      { fieldId: 'askMe', newValue: profileAlternatives[nextProfileIndex].askMe },
      { fieldId: 'email', newValue: profileAlternatives[nextProfileIndex].email },
      { fieldId: 'project1Name', newValue: profileAlternatives[nextProfileIndex].projects[0].name },
      { fieldId: 'project1Desc', newValue: profileAlternatives[nextProfileIndex].projects[0].desc },
      { fieldId: 'project1Tech', newValue: profileAlternatives[nextProfileIndex].projects[0].tech },
      { fieldId: 'project2Name', newValue: profileAlternatives[nextProfileIndex].projects[1].name },
      { fieldId: 'project2Desc', newValue: profileAlternatives[nextProfileIndex].projects[1].desc },
      { fieldId: 'project2Tech', newValue: profileAlternatives[nextProfileIndex].projects[1].tech },
      { fieldId: 'github', newValue: profileAlternatives[nextProfileIndex].github }
    ];
    
    const firstField = fieldChangeQueue.current.shift();
    if (firstField) {
      const { fieldId, newValue } = firstField;
      changeField(fieldId, newValue);
    }
  }, [profileIndex, isChangingFields, changeField]);

  // Otomatik profil değişimi
  useEffect(() => {
    // İlk değişimi 5 saniye sonra başlat
    timeoutRef.current = setTimeout(() => {
      changeProfile();
    }, 5000);
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [changeProfile]);

  // Profil değişimini otomatikleştir
  useEffect(() => {
    if (!isChangingFields) {
      // Her 10 saniyede bir profili değiştir
      timeoutRef.current = setTimeout(() => {
        changeProfile();
      }, 15000);
    }
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isChangingFields, changeProfile]);

  // Markdown içeriğini kendi React bileşenimizle render et
  const CustomMarkdown = () => {
    return (
      <div 
        className={`font-mono text-sm leading-relaxed ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        } whitespace-pre-wrap`}
        dangerouslySetInnerHTML={{ __html: markdownContent }} 
      />
    );
  };

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <motion.div 
        className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-b from-purple-500/5 via-transparent to-transparent'
            : 'bg-gradient-to-b from-purple-100/50 via-transparent to-transparent'
        }`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 ${
            isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
          }`}>
            Introducing GitHub Profile Templates
          </span>
          <h2 className={`text-4xl sm:text-5xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Make Your GitHub be{' '}
            <span className={`${
              isDarkMode 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600'
            }`}>
              Stand Out
            </span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Create an impressive GitHub profile in minutes with our interactive editor and pre-designed templates
          </p>
        </motion.div>

        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className={`absolute inset-0 rounded-2xl ${
              isDarkMode ? 'bg-white/5' : 'bg-black/5'
            } transform -rotate-1`} />
            <div className={`absolute inset-0 rounded-2xl ${
              isDarkMode ? 'bg-white/5' : 'bg-black/5'
            } transform rotate-1`} />
            <div className={`relative rounded-2xl overflow-hidden ${
              isDarkMode ? 'bg-gray-900' : 'bg-white'
            } shadow-2xl`}>
              <div className={`p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"/>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                    <div className="w-3 h-3 rounded-full bg-green-500"/>
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    profile/README.md
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-0 h-[700px]">
                <div className={`border-r ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                  <div className={`h-full flex flex-col`}>
                    <div className={`p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between`}>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        README.md
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                        }`}>
                          Markdown
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto">
                      <div className={`p-6`}>
                        <style jsx global>{`
                          .editable-field {
                            position: relative;
                          }
                          .editable-field::after {
                            content: '';
                            position: absolute;
                            right: -2px;
                            top: 0;
                            height: 100%;
                            width: 2px;
                            background-color: transparent;
                          }
                          .editing::after {
                            background-color: #3B82F6;
                            animation: blink 1s infinite;
                          }
                          @keyframes blink {
                            0%, 100% { opacity: 0; }
                            50% { opacity: 1; }
                          }
                          #${animatingFieldRef.current} {
                            background-color: ${isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'};
                            position: relative;
                          }
                          #${animatingFieldRef.current}::before {
                            content: '|';
                            position: absolute;
                            right: -1px;
                            top: 0;
                            height: 100%;
                            color: #3B82F6;
                            animation: blink 0.8s infinite;
                            opacity: ${editableFields[animatingFieldRef.current as keyof typeof editableFields]?.isEditing ? 1 : 0};
                          }
                        `}</style>
                        <CustomMarkdown />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`bg-gradient-to-br ${
                  isDarkMode 
                    ? 'from-gray-900 to-gray-800' 
                    : 'from-white to-gray-50'
                }`}>
                  <div className={`h-full flex flex-col`}>
                    <div className={`p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between`}>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Live Preview
                      </span>
                      <div className="flex items-center gap-2">
                        <motion.span 
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
                          }`}
                        >
                          Live
                        </motion.span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto">
                      <div className="p-6">
                        <div className={`prose prose-sm sm:prose ${isDarkMode ? 'prose-invert' : ''} max-w-none mx-auto`}>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              code: ({ className, children, ...props }: any) => {
                                const match = /language-(\w+)/.exec(className || '');
                                return match ? (
                                  <SyntaxHighlighter
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    style={isDarkMode ? oneDark : oneLight as any}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                              h1: (props) => <h1 className="text-center font-bold text-3xl mt-2 mb-4" {...props} />,
                              p: (props: { children?: React.ReactNode }) => {
                                // İlk paragrafı ortalayalım (profil bilgileri için)
                                const firstChild = Array.isArray(props.children) ? props.children[0] : props.children;
                                if (firstChild && typeof firstChild === 'string' && 
                                    (firstChild.includes(editableFields.role.value) || firstChild.includes(editableFields.bio.value))) {
                                  return <p className="text-center" {...props} />;
                                }
                                return <p {...props} />;
                              },
                              img: (props) => <img className="mx-auto my-2" {...props} />,
                              div: ({className, ...props}) => {
                                if (className && className.includes('align-center')) {
                                  return <div className="text-center" {...props} />;
                                }
                                return <div {...props} />;
                              }
                            }}
                          >
                            {generatePreviewMarkdownContent()}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: "Interactive Editor",
              description: "Edit your profile README with our real-time preview editor"
            },
            {
              icon: <FileCode className="w-6 h-6" />,
              title: "Smart Templates",
              description: "Choose from professionally designed templates and customize them easily"
            },
            {
              icon: <Github className="w-6 h-6" />,
              title: "Direct GitHub Integration",
              description: "Update your profile README directly from our editor"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group p-6 rounded-xl backdrop-blur-sm ${
                isDarkMode 
                  ? 'bg-white/5 hover:bg-white/10' 
                  : 'bg-black/5 hover:bg-black/10'
              } transition-all duration-300`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                } group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }>
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Image
        src="/images/wave.svg"
        alt="Footer wave decoration"
        width={1920}
        height={200}
        className="w-full h-auto absolute bottom-0 left-0"
      />
    </section>
  );
}; 