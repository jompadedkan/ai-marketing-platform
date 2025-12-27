'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Icon } from '@iconify/react'
import { toast } from 'sonner'
import { getCurrentUser, saveGeneration } from '@/lib/supabase'

export default function GeneratePage() {
  const t = useTranslations('dashboard.generate')
  const [formData, setFormData] = useState({
    prompt: '',
    contentType: 'post',
    language: 'en',
    tone: 'professional',
  })
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')

  const handleGenerate = async () => {
    if (!formData.prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setGenerating(true)
    setGeneratedContent('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to generate content')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error('No reader available')

      let fullContent = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content || ''
              fullContent += content
              setGeneratedContent(fullContent)
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Failed to generate content. Please check your API key.')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    toast.success('Copied to clipboard!')
  }

  const handleSave = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) {
        toast.error('Please sign in to save')
        return
      }
      await saveGeneration({
        user_id: user.id,
        content_type: formData.contentType as any,
        prompt: formData.prompt,
        generated_content: generatedContent,
        language: formData.language as any,
      })
      toast.success(t('saved'))
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save')
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-gray-400">Describe what you want to create and let AI do the magic</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">{t('contentType')}</label>
              <Select value={formData.contentType} onValueChange={(value) => setFormData({ ...formData, contentType: value })}>
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-950 border-gray-800">
                  <SelectItem value="post">{t('contentTypes.post')}</SelectItem>
                  <SelectItem value="caption">{t('contentTypes.caption')}</SelectItem>
                  <SelectItem value="article">{t('contentTypes.article')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">{t('language')}</label>
              <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-gray-950 border-gray-800">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="th">ไทย</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">{t('tone')}</label>
              <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-gray-950 border-gray-800">
                  <SelectItem value="professional">{t('tones.professional')}</SelectItem>
                  <SelectItem value="casual">{t('tones.casual')}</SelectItem>
                  <SelectItem value="creative">{t('tones.creative')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">{t('prompt')}</label>
              <Textarea
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                placeholder="E.g., Write a social media post about the benefits of AI in marketing..."
                className="min-h-[150px] bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            <Button onClick={handleGenerate} disabled={generating || !formData.prompt.trim()} className="w-full bg-primary hover:bg-primary/90 text-white" size="lg">
              {generating ? (<><Icon icon="mdi:loading" className="mr-2 h-5 w-5 animate-spin" />{t('generating')}</>) : (<><Icon icon="mdi:magic-wand" className="mr-2 h-5 w-5" />{t('generate')}</>)}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Generated Content</CardTitle>
              {generatedContent && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} className="border-gray-700 text-white hover:bg-gray-800">
                    <Icon icon="mdi:content-copy" className="mr-1 h-4 w-4" />{t('copy')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSave} className="border-gray-700 text-white hover:bg-gray-800">
                    <Icon icon="mdi:content-save" className="mr-1 h-4 w-4" />{t('save')}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <div className="prose prose-invert max-w-none">
                <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800 text-white whitespace-pre-wrap">{generatedContent}</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Icon icon={generating ? "mdi:loading" : "mdi:lightbulb-outline"} className={`w-16 h-16 text-gray-700 mb-4 ${generating ? 'animate-spin' : ''}`} />
                <p className="text-gray-400">{generating ? 'Generating your content...' : 'Your generated content will appear here'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
