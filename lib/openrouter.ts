export function buildSystemPrompt(contentType: string, language: string, tone: string): string {
  const langText = language === 'th' ? 'Thai' : 'English'
  
  const basePrompt = `You are an expert marketing content writer. Create high-quality, engaging content in ${langText}.`
  
  const toneGuides: Record<string, string> = {
    professional: 'Use a professional, business-appropriate tone.',
    casual: 'Use a friendly, conversational tone.',
    creative: 'Use a creative, attention-grabbing tone with unique angles.',
  }
  
  const toneGuide = toneGuides[tone] || toneGuides.professional
  
  const contentGuides = {
    post: `Create a social media post (100-200 words). Include:\n    - Attention-grabbing opening\n    - Key message or value proposition\n    - Call to action\n    - Relevant hashtags (3-5)`,
    caption: `Create a short, impactful caption (20-50 words). Include:\n    - Hook or question\n    - Brief message\n    - 2-3 relevant hashtags`,
    article: `Create a blog article (500-1000 words). Include:\n    - Compelling headline\n    - Introduction with hook\n    - 3-5 main points with subheadings\n    - Conclusion with call to action\n    - SEO-friendly structure`,
  }
  
  const contentGuide = contentGuides[contentType as keyof typeof contentGuides] || contentGuides.post
  
  return `${basePrompt}\n\n${toneGuide}\n\n${contentGuide}\n\nWrite in ${langText} language. Be creative, engaging, and professional.`
}
