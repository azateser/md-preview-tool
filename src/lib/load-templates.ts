import fs from 'fs'
import path from 'path'

interface Template {
  name: string
  content: string
  category: string
  description: string
}

export function loadTemplates(): Template[] {
  const templatesDir = path.join(process.cwd(), 'src/templates')
  const templates: Template[] = []

  const categories = fs.readdirSync(templatesDir)
  
  categories.forEach(category => {
    const categoryPath = path.join(templatesDir, category)
    if (fs.statSync(categoryPath).isDirectory()) {
      const files = fs.readdirSync(categoryPath)
      files.forEach(file => {
        if (file.endsWith('.md')) {
          const filePath = path.join(categoryPath, file)
          const content = fs.readFileSync(filePath, 'utf-8')
          
          const firstLine = content.split('\n')[0]
          const name = firstLine.replace('#', '').trim()
          
          const description = content.split('\n\n')[1]?.replace('#', '').trim() || ''
          
          templates.push({
            name,
            content,
            category,
            description
          })
        }
      })
    }
  })

  return templates
} 