'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { RecentGenerations } from '@/components/dashboard/RecentGenerations'
import { Icon } from '@iconify/react'
import { getCurrentUser, getProfile, getGenerations } from '@/lib/supabase'

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const locale = useLocale()
  const [userName, setUserName] = useState('User')
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    thisMonth: 0,
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const user = await getCurrentUser()
      if (user) {
        const profile = await getProfile(user.id)
        setUserName(profile.full_name || user.email || 'User')

        const generations = await getGenerations(user.id, 100)
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

        setStats({
          total: generations.length,
          thisWeek: generations.filter(g => new Date(g.created_at) > weekAgo).length,
          thisMonth: generations.filter(g => new Date(g.created_at) > monthAgo).length,
        })
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {t('welcome')}, {userName}!
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your content today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title={t('home.stats.total')}
          value={stats.total}
          icon="mdi:file-document-multiple"
        />
        <StatsCard
          title={t('home.stats.thisWeek')}
          value={stats.thisWeek}
          icon="mdi:calendar-week"
        />
        <StatsCard
          title={t('home.stats.thisMonth')}
          value={stats.thisMonth}
          icon="mdi:calendar-month"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          {t('home.quickActions')}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href={`/${locale}/dashboard/generate`}>
            <Button
              className="w-full h-24 bg-gradient-to-br from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white"
            >
              <div className="flex flex-col items-center gap-2">
                <Icon icon="mdi:magic-wand" className="w-8 h-8" />
                <span className="font-semibold">{t('home.generateNew')}</span>
              </div>
            </Button>
          </Link>
          <Link href={`/${locale}/dashboard/history`}>
            <Button
              variant="outline"
              className="w-full h-24 border-gray-700 text-white hover:bg-gray-800"
            >
              <div className="flex flex-col items-center gap-2">
                <Icon icon="mdi:history" className="w-8 h-8" />
                <span className="font-semibold">View History</span>
              </div>
            </Button>
          </Link>
          <Link href={`/${locale}/dashboard/settings`}>
            <Button
              variant="outline"
              className="w-full h-24 border-gray-700 text-white hover:bg-gray-800"
            >
              <div className="flex flex-col items-center gap-2">
                <Icon icon="mdi:cog" className="w-8 h-8" />
                <span className="font-semibold">Settings</span>
              </div>
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          {t('home.recent')}
        </h2>
        <RecentGenerations />
      </div>
    </div>
  )
}
