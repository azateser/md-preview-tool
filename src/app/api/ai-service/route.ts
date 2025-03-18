import { NextRequest, NextResponse } from 'next/server';
import { generateReadme } from '@/components/editor/AIService';
import { ProjectInfo } from '@/components/editor/AIModal';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateContent, projectInfo } = body;
    
    if (!templateContent || !projectInfo) {
      return NextResponse.json(
        { error: 'Missing required fields: templateContent or projectInfo' },
        { status: 400 }
      );
    }
    
    const generatedContent = await generateReadme(templateContent, projectInfo as ProjectInfo);
    
    const cleanMarkdown = processAIResponse(generatedContent, projectInfo.name);
    
    return NextResponse.json({ 
      content: cleanMarkdown,
      status: 'success',
      contentType: 'text/markdown'
    });
  } catch (error) {
    console.error('Error in AI service:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate content', message: (error as Error).message },
      { status: 500 }
    );
  }
}

function processAIResponse(content: string, fallbackTitle: string): string {
  let cleanMarkdown = content.trim();
  
  const codeBlockMatch = cleanMarkdown.match(/```(?:markdown|md)?\s*([\s\S]+?)```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    cleanMarkdown = codeBlockMatch[1].trim();
  }
  
  cleanMarkdown = cleanMarkdown
    .replace(/^```(?:markdown|md)?[\s\n]*/gi, '')
    .replace(/```$/gi, '');
  
  const headingMatch = cleanMarkdown.match(/(^|\n)# .+/);
  if (headingMatch) {
    const headingIndex = cleanMarkdown.indexOf(headingMatch[0]);
    if (headingIndex > 0) {
      cleanMarkdown = cleanMarkdown.substring(headingIndex);
    }
  } else if (!cleanMarkdown.includes('#')) {
    cleanMarkdown = `# ${fallbackTitle}\n\n${cleanMarkdown}`;
  }
  
  return cleanMarkdown;
} 