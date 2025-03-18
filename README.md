![Demo](./readme-assets/banner-image.png)

# 📝 MD-Prew

> A modern and user-friendly Markdown preview application

[![Next.js](https://img.shields.io/badge/Next.js-15.2.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)


## ✨ Features

- 📱 Modern and responsive design
- 🌙 Dark/Light theme support
- ⚡️ Real-time preview
- 🎨 Syntax highlighting
- 📋 Drag & Drop file support
- 💾 Auto-save functionality
- 🤖 AI supported markdown generator
- 📤 Export Markdown files
- 🔍 Emoji and GFM (GitHub Flavored Markdown) support
- 🎯 Customizable editor
- 🚀 Fast and performant

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org/) - React Framework
- [React 19](https://react.dev/) - UI Library
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Zustand](https://zustand-demo.pmnd.rs/) - State Management
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [React MD Editor](https://uiwjs.github.io/react-md-editor/) - Markdown Editor
- [React Markdown Preview](https://uiwjs.github.io/react-markdown-preview/) - Markdown Preview

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/azateser/md-preview-tool.git

# Navigate to the project directory
cd md-prew

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
.
├── src/
│   ├── app/              # Page components
│   ├── components/       # UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Helper functions
│   ├── store/           # Zustand store
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── public/              # Static files
└── styles/             # Global styles
```

## 💻 Usage

1. Write Markdown text in the left panel
2. See real-time preview in the right panel
3. Your files are automatically saved
4. Export whenever you want

### Markdown Features

- **Headers** (`# H1`, `## H2`, etc.)
- **Lists** (ordered and unordered)
- **Links** and **Images**
- **Code blocks** (with syntax highlighting)
- **Tables**
- **Emoji** support
- **GitHub Flavored Markdown**

## 🔧 Configuration

You can customize theme colors by editing `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#...',
        secondary: '#...',
      }
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📝 Roadmap

- [ ] Multi-file support
- [ ] Cloud synchronization
- [ ] Sharing capabilities
- [ ] More customization options
- [ ] Plugin system

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team
- [React MD Editor](https://uiwjs.github.io/react-md-editor/) contributors
- [Tailwind CSS](https://tailwindcss.com/) team

## 📞 Contact

- 🐛 [Report a bug](https://github.com/yourusername/md-preview-tool/issues)
- 💡 [Request a feature](https://github.com/yourusername/md-preview-tool/issues)
- 📧 Email: azatesser@gmail.com

---

Made with ❤️ by Azat ESER
