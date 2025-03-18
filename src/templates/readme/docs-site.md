# 📚 [Docs Site Name]

> A modern documentation site built with [Next.js](https://nextjs.org/), [Nextra](https://nextra.site/), [MDX](https://mdxjs.com/), and [Tailwind CSS](https://tailwindcss.com/)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/username/docs-site)
[![License](https://img.shields.io/github/license/username/docs-site)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/username/docs-site)](https://github.com/username/docs-site/commits/main)

![Demo](demo.png)

## ✨ Features

- 📝 MDX for content authoring
- 🔍 Full-text search
- 🌙 Dark mode support
- 📱 Responsive design
- 🚀 Fast page loads
- 🔄 Live code examples
- 📊 API documentation
- 🌍 i18n support
- 🎨 Customizable theme
- 🔗 Automatic sidebar navigation

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) - React Framework
- [Nextra](https://nextra.site/) - Documentation Framework
- [MDX](https://mdxjs.com/) - Markdown + JSX
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Algolia](https://www.algolia.com/) - Search
- [Vercel](https://vercel.com/) - Deployment

## 📖 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Environment Variables

Create a \`.env.local\` file:

```bash
# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Search
NEXT_PUBLIC_ALGOLIA_APP_ID=your-app-id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your-search-key
ALGOLIA_ADMIN_KEY=your-admin-key

# Analytics
NEXT_PUBLIC_GA_ID=your-ga-id
```

### Installation

```bash
# Clone the repository
git clone https://github.com/username/docs-site.git

# Navigate to the project
cd docs-site

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
.
├── components/
│   ├── ui/
│   └── shared/
├── content/
│   ├── docs/
│   │   ├── getting-started/
│   │   ├── guides/
│   │   └── api/
│   └── blog/
├── pages/
│   ├── _app.tsx
│   └── [[...slug]].tsx
├── public/
│   └── images/
├── styles/
│   └── globals.css
└── theme.config.js
```

## 📝 Content Authoring

### Creating a New Page

1. Create a new MDX file in the `content/docs` directory:

```mdx
---
title: Getting Started
description: Learn how to get started with our product
---

# Getting Started

Welcome to our documentation! This guide will help you get started with our product.

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

```bash
npm install your-package
```

## Usage

```jsx
import { Component } from 'your-package'

function App() {
  return <Component />
}
```
```

### Adding Code Examples

```mdx
```jsx live
function Button() {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded">
      Click me
    </button>
  )
}
```
```

## 🎨 Customization

### Theme Configuration

Edit `theme.config.js`:

```js
export default {
  logo: <span>Your Logo</span>,
  project: {
    link: 'https://github.com/username/project'
  },
  docsRepositoryBase: 'https://github.com/username/docs-site/tree/main',
  footer: {
    text: 'MIT 2024 © Your Name'
  },
  // ... other options
}
```

### Styling

Edit `styles/globals.css`:

```css
:root {
  --primary: #0070f3;
  --secondary: #6b7280;
  --accent: #f59e0b;
}

.dark {
  --primary: #3b82f6;
  --secondary: #9ca3af;
  --accent: #fbbf24;
}
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your project to Vercel
3. Add environment variables
4. Deploy!

### Build for Production

```bash
# Build the site
pnpm build

# Start production server
pnpm start
```

## 📊 Analytics

- Page views
- Time on page
- Search queries
- Navigation patterns
- Popular content

## 🔍 Search

### Algolia Configuration

1. Create an Algolia account
2. Create a new index
3. Configure searchable attributes
4. Update environment variables

### Custom Search UI

```jsx
import { useSearch } from '@/hooks/useSearch'

function SearchBar() {
  const { search, results } = useSearch()
  
  return (
    <div>
      <input
        type="text"
        onChange={(e) => search(e.target.value)}
        placeholder="Search docs..."
      />
      {results.map((result) => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  )
}
```

## 🌍 Internationalization

### Adding a New Language

1. Create language files in `content/i18n/`
2. Update `next.config.js`:

```js
module.exports = {
  i18n: {
    locales: ['en', 'es', 'fr'],
    defaultLocale: 'en'
  }
}
```

### Translating Content

```mdx
---
title: Getting Started
translations:
  es: Empezando
  fr: Commencer
---
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run e2e tests
pnpm test:e2e

# Check links
pnpm check-links
```

## 🎯 Roadmap

- [ ] API reference generator
- [ ] Interactive tutorials
- [ ] Version selector
- [ ] Community forum integration
- [ ] Code playground

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Submit a pull request

Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📝 Changelog

### Version 1.1.0 (2024-03-21)

#### Added
- Search functionality
- Dark mode
- API documentation

#### Changed
- Improved navigation
- Updated styling

[View full changelog →](CHANGELOG.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team
- [Nextra](https://nextra.site/) contributors
- [Vercel](https://vercel.com/) for hosting

## 📞 Support

- 📧 Email: support@docs-site.com
- 💬 Discord: [Join our community](https://discord.gg/docs-site)
- 🐛 [Report a bug](https://github.com/username/docs-site/issues)
- 💡 [Request a feature](https://github.com/username/docs-site/issues)

## 📊 Stats

- 📚 100+ documentation pages
- 🌍 5+ languages
- ⭐️ 1,000+ GitHub stars
- 👥 50+ contributors

---

Made with ❤️ by [Your Name](https://github.com/username) 