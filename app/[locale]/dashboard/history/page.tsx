'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Icon } from '@iconify/react'
import { getCurrentUser, getGenerations, deleteGeneration, type Generation } from '@/lib/supabase'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

export default function HistoryPage() {
  const t = useTranslations('dashboard.history')
  const [generations, setGenerations] = useState<Generation[]>([])
  const [filteredGenerations, setFilteredGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null })

  useEffect(() => { loadGenerations() }, [])
  useEffect(() => { filterGenerations() }, [searchQuery, filterType, generations])

  const loadGenerations = async () => {
    try {
      const user = await getCurrentUser()
      if (user) {
        const data = await getGenerations(user.id, 100)
        setGenerations(data)
        setFilteredGenerations(data)
      }
    } catch (error) {
      console.error('Error loading generations:', error)
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const filterGenerations = () => {
    let filtered = [...generations]
    if (searchQuery) {
      filtered = filtered.filter((gen) =>
        gen.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gen.generated_content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (filterType !== 'all') {
      filtered = filtered.filter((gen) => gen.content_type === filterType)
    }
    setFilteredGenerations(filtered)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteGeneration(id)
      setGenerations(generations.filter((g) => g.id !== id))
      toast.success('Deleted successfully')
      setDeleteDialog({ open: false, id: null })
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete')
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return 'mdi:post'
      case 'caption': return 'mdi:text-short'
      case 'article': return 'mdi:file-document'
      default: return 'mdi:file'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
        <div className="space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32 w-full bg-gray-800" />)}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-gray-400">View and manage all your generated content</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input placeholder={t('search')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500" />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[200px] bg-gray-900/50 border-gray-700 text-white"><SelectValue placeholder={t('filter')} /></SelectTrigger>
          <SelectContent className="bg-gray-950 border-gray-800">
            <SelectItem value="all">{t('all')}</SelectItem>
            <SelectItem value="post">Social Post</SelectItem>
            <SelectItem value="caption">Caption</SelectItem>
            <SelectItem value="article">Article</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredGenerations.length === 0 ? (
        <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
          <CardContent className="py-16">
            <div className="text-center">
              <Icon icon="mdi:file-document-outline" className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">{t('empty')}</p>
              <p className="text-sm text-gray-500">Start generating content to see your history</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredGenerations.map((gen) => (
            <Card key={gen.id} className="bg-gradient-to-br from-gray-900 to-black border-gray-800 hover:border-primary/30 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon icon={getContentTypeIcon(gen.content_type)} className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="border-gray-700 text-gray-400">{gen.content_type}</Badge>
                        <Badge variant="outline" className="border-gray-700 text-gray-400">{gen.language.toUpperCase()}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(gen.created_at)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteDialog({ open: true, id: gen.id })} className="text-gray-400 hover:text-red-500">
                    <Icon icon="mdi:delete" className="w-5 h-5" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div><p className="text-sm font-medium text-gray-400 mb-1">Prompt:</p><p className="text-white">{gen.prompt}</p></div>
                  <div><p className="text-sm font-medium text-gray-400 mb-1">Generated Content:</p><div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800"><p className="text-gray-300 whitespace-pre-wrap line-clamp-3">{gen.generated_content}</p></div></div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(gen.generated_content); toast.success('Copied to clipboard!') }} className="border-gray-700 text-white hover:bg-gray-800">
                    <Icon icon="mdi:content-copy" className="mr-1 h-4 w-4" />Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent className="bg-gray-950 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Delete Content</DialogTitle>
            <DialogDescription className="text-gray-400">{t('confirmDelete')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: null })} className="border-gray-700 text-white">Cancel</Button>
            <Button variant="destructive" onClick={() => deleteDialog.id && handleDelete(deleteDialog.id)} className="bg-primary hover:bg-primary/90">{t('delete')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
