'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@iconify/react'
import { getCurrentUser, getGenerations, type Generation } from '@/lib/supabase'
import { Skeleton } from '@/components/ui/skeleton'

export function RecentGenerations() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadGenerations() }, [])

  const loadGenerations = async () => {
    try {
      const user = await getCurrentUser()
      if (user) { const data = await getGenerations(user.id, 5); setGenerations(data) }
    } catch (error) { console.error('Error loading generations:', error) } finally { setLoading(false) }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) { case 'post': return 'mdi:post'; case 'caption': return 'mdi:text-short'; case 'article': return 'mdi:file-document'; default: return 'mdi:file' }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)), 'day')
  }

  if (loading) {
    return (<Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800"><CardHeader><CardTitle className="text-white">Recent Generations</CardTitle></CardHeader><CardContent className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full bg-gray-800" />)}</CardContent></Card>)
  }

  if (generations.length === 0) {
    return (<Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800"><CardHeader><CardTitle className="text-white">Recent Generations</CardTitle></CardHeader><CardContent><div className="text-center py-12"><Icon icon="mdi:file-document-outline" className="w-16 h-16 text-gray-700 mx-auto mb-4" /><p className="text-gray-400">No content generated yet</p><p className="text-sm text-gray-500 mt-2">Start creating amazing content!</p></div></CardContent></Card>)
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
      <CardHeader><CardTitle className="text-white">Recent Generations</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {generations.map((gen) => (
          <div key={gen.id} className="p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon icon={getContentTypeIcon(gen.content_type)} className="w-5 h-5 text-primary" />
                <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">{gen.content_type}</Badge>
                <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">{gen.language.toUpperCase()}</Badge>
              </div>
              <span className="text-xs text-gray-500">{formatDate(gen.created_at)}</span>
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">{gen.prompt}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
