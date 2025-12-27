'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Icon } from '@iconify/react'
import { toast } from 'sonner'
import { getCurrentUser, saveBannerGeneration, getBannerGenerations, deleteBannerGeneration, type BannerGeneration } from '@/lib/supabase'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const aspectRatios = [
  { value: '16:9', label: 'Landscape (16:9)', icon: 'mdi:crop-landscape' },
  { value: '1:1', label: 'Square (1:1)', icon: 'mdi:crop-square' },
  { value: '9:16', label: 'Portrait (9:16)', icon: 'mdi:crop-portrait' },
  { value: '4:3', label: 'Standard (4:3)', icon: 'mdi:crop-free' },
  { value: '21:9', label: 'Ultra Wide (21:9)', icon: 'mdi:panorama-wide-angle' },
]

const styles = [
  { value: 'modern', label: 'Modern', icon: 'mdi:lightning-bolt' },
  { value: 'minimal', label: 'Minimal', icon: 'mdi:minus' },
  { value: 'bold', label: 'Bold', icon: 'mdi:format-bold' },
  { value: 'creative', label: 'Creative', icon: 'mdi:palette' },
  { value: 'corporate', label: 'Corporate', icon: 'mdi:briefcase' },
  { value: 'playful', label: 'Playful', icon: 'mdi:party-popper' },
  { value: 'elegant', label: 'Elegant', icon: 'mdi:diamond-stone' },
  { value: 'vintage', label: 'Vintage', icon: 'mdi:camera-retro' },
]

export default function BannerPage() {
  const t = useTranslations('dashboard.banner')
  const [formData, setFormData] = useState({ prompt: '', aspectRatio: '16:9', style: 'modern' })
  const [generating, setGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [bannerHistory, setBannerHistory] = useState<BannerGeneration[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null })

  useEffect(() => { loadBannerHistory() }, [])

  const loadBannerHistory = async () => {
    try {
      const user = await getCurrentUser()
      if (user) {
        const history = await getBannerGenerations(user.id, 20)
        setBannerHistory(history)
      }
    } catch (error) {
      console.error('Error loading banner history:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleDeleteBanner = async (id: string) => {
    try {
      await deleteBannerGeneration(id)
      setBannerHistory(bannerHistory.filter((b) => b.id !== id))
      toast.success(t('deleteSuccess') || 'Deleted successfully')
      setDeleteDialog({ open: false, id: null })
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(t('deleteError') || 'Failed to delete')
    }
  }

  const pollPrediction = async (id: string) => {
    const maxAttempts = 60
    let attempts = 0
    const poll = async (): Promise<string | null> => {
      attempts++
      if (attempts > maxAttempts) throw new Error('Generation timeout')
      const response = await fetch(`/api/generate-banner?id=${id}`)
      const data = await response.json()
      if (data.status === 'succeeded' && data.imageUrl) return data.imageUrl
      else if (data.status === 'failed') throw new Error(data.error || 'Generation failed')
      else { await new Promise(resolve => setTimeout(resolve, 2000)); return poll() }
    }
    return poll()
  }

  const handleGenerate = async () => {
    if (!formData.prompt.trim()) { toast.error(t('errorEmptyPrompt')); return }
    setGenerating(true)
    setGeneratedImage(null)
    try {
      const response = await fetch('/api/generate-banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to generate banner')
      let finalImageUrl: string | null = null
      if (data.imageUrl) finalImageUrl = Array.isArray(data.imageUrl) ? data.imageUrl[0] : data.imageUrl
      else if (data.id) { const imageUrl = await pollPrediction(data.id); if (imageUrl) finalImageUrl = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl }
      if (finalImageUrl) {
        setGeneratedImage(finalImageUrl)
        toast.success(t('successGenerated'))
        try {
          const user = await getCurrentUser()
          if (user) {
            const saved = await saveBannerGeneration({ user_id: user.id, prompt: formData.prompt, image_url: finalImageUrl, aspect_ratio: formData.aspectRatio, style: formData.style })
            setBannerHistory((prev) => [saved, ...prev])
          }
        } catch (saveError) { console.error('Error saving to history:', saveError) }
      }
    } catch (error) {
      console.error('Generation error:', error)
      toast.error(error instanceof Error ? error.message : t('errorGeneration'))
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedImage) return
    try {
      const response = await fetch(generatedImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `banner-${Date.now()}.png`
      document.body.appendChild(a); a.click()
      window.URL.revokeObjectURL(url); document.body.removeChild(a)
      toast.success(t('downloadSuccess'))
    } catch (error) { toast.error(t('downloadError')) }
  }

  const handleCopyUrl = () => { if (!generatedImage) return; navigator.clipboard.writeText(generatedImage); toast.success(t('copiedUrl')) }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-yellow-500/20 blur-3xl -z-10" />
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25">
            <Icon icon="mdi:image-plus" className="w-8 h-8 text-white" />
          </div>
          <div><h1 className="text-3xl font-bold text-white mb-1">{t('title')}</h1><p className="text-gray-400">{t('subtitle')}</p></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-gray-900/90 to-black border-gray-800/50 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-800/50">
            <CardTitle className="text-white flex items-center gap-2"><Icon icon="mdi:tune" className="w-5 h-5 text-amber-500" />{t('configuration')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Icon icon="mdi:text" className="w-4 h-4 text-amber-500" />{t('promptLabel')}</label>
              <Textarea value={formData.prompt} onChange={(e) => setFormData({ ...formData, prompt: e.target.value })} placeholder={t('promptPlaceholder')} className="min-h-[120px] bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Icon icon="mdi:aspect-ratio" className="w-4 h-4 text-amber-500" />{t('aspectRatioLabel')}</label>
              <Select value={formData.aspectRatio} onValueChange={(value) => setFormData({ ...formData, aspectRatio: value })}>
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white focus:border-amber-500/50"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-gray-950 border-gray-800">{aspectRatios.map((ratio) => (<SelectItem key={ratio.value} value={ratio.value}><div className="flex items-center gap-2"><Icon icon={ratio.icon} className="w-4 h-4" />{ratio.label}</div></SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Icon icon="mdi:brush" className="w-4 h-4 text-amber-500" />{t('styleLabel')}</label>
              <div className="grid grid-cols-4 gap-2">
                {styles.map((style) => (<button key={style.value} onClick={() => setFormData({ ...formData, style: style.value })} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${formData.style === style.value ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-gray-900/30 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-300'}`}><Icon icon={style.icon} className="w-5 h-5" /><span className="text-xs font-medium">{style.label}</span></button>))}
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={generating || !formData.prompt.trim()} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-6 text-lg shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50" size="lg">
              {generating ? (<><Icon icon="mdi:loading" className="mr-2 h-5 w-5 animate-spin" />{t('generating')}</>) : (<><Icon icon="mdi:auto-fix" className="mr-2 h-5 w-5" />{t('generateButton')}</>)}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/90 to-black border-gray-800/50 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-800/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2"><Icon icon="mdi:image" className="w-5 h-5 text-amber-500" />{t('outputTitle')}</CardTitle>
              {generatedImage && (<div className="flex gap-2"><Button variant="outline" size="sm" onClick={handleCopyUrl} className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"><Icon icon="mdi:link" className="mr-1 h-4 w-4" />{t('copyUrl')}</Button><Button variant="outline" size="sm" onClick={handleDownload} className="border-amber-500/50 text-amber-400 hover:bg-amber-500/20"><Icon icon="mdi:download" className="mr-1 h-4 w-4" />{t('download')}</Button></div>)}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {generatedImage ? (<div className="relative group"><div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl blur-xl transition-opacity group-hover:opacity-75" /><img src={generatedImage} alt="Generated banner" className="relative w-full rounded-xl border border-gray-800 shadow-2xl" /></div>) : (<div className="flex flex-col items-center justify-center py-20 text-center"><div className={`relative ${generating ? 'animate-pulse' : ''}`}><div className="absolute inset-0 bg-amber-500/20 rounded-full blur-2xl" /><Icon icon={generating ? "mdi:loading" : "mdi:image-filter-hdr"} className={`relative w-20 h-20 text-gray-700 ${generating ? 'animate-spin text-amber-500' : ''}`} /></div><p className="text-gray-400 mt-6 max-w-sm">{generating ? t('generatingMessage') : t('emptyState')}</p>{generating && <p className="text-sm text-gray-500 mt-2">{t('generatingHint')}</p>}</div>)}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-yellow-500/5 border-amber-500/20">
        <CardContent className="py-4"><div className="flex items-start gap-3"><Icon icon="mdi:lightbulb-on" className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" /><div><p className="text-sm font-medium text-amber-400 mb-1">{t('tipsTitle')}</p><p className="text-sm text-gray-400">{t('tipsContent')}</p></div></div></CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-900/90 to-black border-gray-800/50 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-800/50"><CardTitle className="text-white flex items-center gap-2"><Icon icon="mdi:history" className="w-5 h-5 text-amber-500" />{t('historyTitle') || 'Banner History'}</CardTitle></CardHeader>
        <CardContent className="pt-6">
          {loadingHistory ? (<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="aspect-video bg-gray-800/50 rounded-lg animate-pulse" />)}</div>) : bannerHistory.length === 0 ? (<div className="text-center py-12"><Icon icon="mdi:image-multiple-outline" className="w-16 h-16 text-gray-700 mx-auto mb-4" /><p className="text-gray-400">{t('historyEmpty') || 'No banners generated yet'}</p><p className="text-sm text-gray-500 mt-1">{t('historyEmptyHint') || 'Your generated banners will appear here'}</p></div>) : (<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{bannerHistory.map((banner) => (<div key={banner.id} className="group relative rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/50 transition-all cursor-pointer" onClick={() => setGeneratedImage(banner.image_url)}><img src={banner.image_url} alt={banner.prompt} className="w-full aspect-video object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"><div className="absolute bottom-0 left-0 right-0 p-3"><p className="text-xs text-gray-300 line-clamp-2 mb-2">{banner.prompt}</p><div className="flex items-center justify-between"><div className="flex gap-1"><span className="text-[10px] px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">{banner.aspect_ratio}</span><span className="text-[10px] px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 capitalize">{banner.style}</span></div><button onClick={(e) => { e.stopPropagation(); setDeleteDialog({ open: true, id: banner.id }) }} className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"><Icon icon="mdi:delete" className="w-4 h-4" /></button></div></div></div></div>))}</div>)}
        </CardContent>
      </Card>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent className="bg-gray-950 border-gray-800 text-white">
          <DialogHeader><DialogTitle>{t('deleteTitle') || 'Delete Banner'}</DialogTitle><DialogDescription className="text-gray-400">{t('deleteConfirm') || 'Are you sure you want to delete this banner? This action cannot be undone.'}</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: null })} className="border-gray-700 text-white">{t('cancel') || 'Cancel'}</Button><Button variant="destructive" onClick={() => deleteDialog.id && handleDeleteBanner(deleteDialog.id)} className="bg-red-600 hover:bg-red-700">{t('delete') || 'Delete'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
