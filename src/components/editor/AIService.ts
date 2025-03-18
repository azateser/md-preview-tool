import { ProjectInfo } from './AIModal';

export interface AIResponse {
  content: string;
  error?: string;
}

export class AIService {
  static createPrompt(projectInfo: ProjectInfo): string {
    const isProfile = !!projectInfo.githubUsername;
    
    let prompt = `TASK: Create a professional ${isProfile ? 'GitHub Profile README' : 'Project README'} in Markdown.\n\n`;
    
    if (isProfile) {
      prompt += `INSTRUCTIONS:\n`;
      prompt += `- Create a complete GitHub profile README for ${projectInfo.name} (GitHub username: ${projectInfo.githubUsername})\n`;
      prompt += `- Use ONLY this description: "${projectInfo.description}"\n`;
      
      if (projectInfo.socialLinks && projectInfo.socialLinks.length > 0) {
        const validLinks = projectInfo.socialLinks.filter(link => link.url.trim() !== '');
        if (validLinks.length > 0) {
          prompt += `- Include ONLY these social links:\n`;
          validLinks.forEach(link => {
            prompt += `  * ${link.type}: ${link.url}\n`;
          });
        }
      }
      
      if (projectInfo.githubUsername) {
        prompt += `\nIMPORTANT: Check this GitHub Profile and include REAL repositories:\n`;
        prompt += `GitHub Profile URL: https://github.com/${projectInfo.githubUsername}?tab=repositories\n\n`;
        prompt += `- Visit this URL and look at the actual public repositories\n`;
        prompt += `- Include ONLY real repositories that exist on this profile, not generic placeholders\n`;
        prompt += `- Mention only programming languages actually used in these repositories\n`;
        prompt += `- Use these exact URLs for GitHub stats:\n`;
        prompt += `  * Stats: https://github-readme-stats.vercel.app/api?username=${projectInfo.githubUsername}&show_icons=true&theme=radical\n`;
        prompt += `  * Top languages: https://github-readme-stats.vercel.app/api/top-langs/?username=${projectInfo.githubUsername}&layout=compact&theme=radical\n`;
      }
      
      prompt += `\nRESTRICTIONS - DO NOT:\n`;
      prompt += `- DO NOT add country information (like "from Argentina 🇦🇷")\n`;
      prompt += `- DO NOT add personal details that are not explicitly provided\n`;
      prompt += `- DO NOT make up any information that is not provided or visible in the GitHub profile\n`;
      prompt += `- DO NOT include education, age, location, or any other biographical details unless explicitly stated\n`;
      prompt += `- STICK ONLY to the information provided and visible repositories\n`;
    } else {
      prompt += `INSTRUCTIONS:\n`;
      prompt += `- Create a complete project README for "${projectInfo.name}"\n`;
      prompt += `- Use ONLY this description: "${projectInfo.description}"\n`;
      
      const validFeatures = projectInfo.features.filter(f => f.trim() !== '');
      if (validFeatures.length > 0) {
        prompt += `- Include ONLY these features:\n`;
        validFeatures.forEach(feature => {
          prompt += `  * ${feature}\n`;
        });
      }
      
      const validTechStack = projectInfo.techStack.filter(t => t.trim() !== '');
      if (validTechStack.length > 0) {
        prompt += `- Include ONLY this tech stack:\n`;
        validTechStack.forEach(tech => {
          prompt += `  * ${tech}\n`;
        });
      }
      
      prompt += `\nRESTRICTIONS - DO NOT:\n`;
      prompt += `- DO NOT add any information not explicitly provided above\n`;
      prompt += `- DO NOT make up features, technologies, or details\n`;
      prompt += `- STICK ONLY to the information provided\n`;
    }
    
    prompt += `\nFORMATTING REQUIREMENTS:\n`;
    prompt += `1. Output a well-formatted Markdown file\n`;
    prompt += `2. Use appropriate emojis to enhance readability\n`;
    prompt += `3. Include a clear header, sections with proper hierarchy\n`;
    prompt += `4. For GitHub profiles, include stats and top languages images\n`;
    prompt += `5. DO NOT include any made-up biographical information\n`;
    
    return prompt;
  }
  
  static async callGemmaAPI(prompt: string): Promise<AIResponse> {
    try {
      const systemMessage = "You are a README generator that outputs only clean Markdown content based STRICTLY on the provided information. Do not make up additional details.";
      
      const messages = [
        {
          "role": "system",
          "content": [{"type": "text", "text": systemMessage}]
        },
        {
          "role": "user",
          "content": [{"type": "text", "text": prompt}]
        }
      ];
      
      const response = await fetch('https://api-inference.huggingface.co/models/google/gemma-3-27b-it', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          inputs: messages,
          parameters: {
            max_new_tokens: 2048,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true,
            return_full_text: false
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Gemma API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      let content = '';
      if (typeof data === 'string') {
        content = data;
      } else if (data.generated_text) {
        content = data.generated_text;
      } else if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
        content = data[0].generated_text;
      } else {
        throw new Error('Unexpected response format from Gemma API');
      }
      
      return { content };
    } catch (error) {
      return { 
        content: '', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  static async callMistralAPI(prompt: string): Promise<AIResponse> {
    try {
      const systemMessage = "You are a README generator that outputs only clean Markdown content based STRICTLY on the provided information. Do not make up additional details.";
      const fullPrompt = `${systemMessage}\n\n${prompt}`;
      
      const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 2048,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true,
            return_full_text: false
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      let content = '';
      if (typeof data === 'string') {
        content = data;
      } else if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
        content = data[0].generated_text;
      } else if (data.generated_text) {
        content = data.generated_text;
      } else {
        throw new Error('Unexpected response format from Mistral API');
      }
      
      return { content };
    } catch (error) {
      return { 
        content: '', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

export const generateReadme = async (template: string, projectInfo: ProjectInfo): Promise<string> => {
  const prompt = AIService.createPrompt(projectInfo);
  
  let result = await AIService.callGemmaAPI(prompt);
  
  if (result.error || !result.content || result.content.length < 100 || result.content.includes('-'.repeat(50))) {
    result = await AIService.callMistralAPI(prompt);
  }
  
  if (result.error) {
    return `Error generating README: ${result.error}`;
  }
  
  if (result.content.length < 100 || result.content.includes('-'.repeat(50))) {
    return "Error: Generated content appears to be invalid. Please try again.";
  }
  
  return result.content;
}; 