'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const menuItems = [
  { key: 'home', href: '/dashboard', icon: 'mdi:home' },
  { key: 'generate', href: '/dashboard/generate', icon: 'mdi:magic-wand' },
  { key: 'banner', href: '/dashboard/banner', icon: 'mdi:image-plus' },
  { key: 'history', href: '/dashboard/history', icon: 'mdi:history' },
  { key: 'settings', href: '/dashboard/settings', icon: 'mdi:cog' },
]

export function Sidebar() {
  const t = useTranslations('dashboard.nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <div className="lg:hidden fixed inset-0 bg-black/50 z-40" />
      <aside className={cn("fixed left-0 top-0 z-50 h-screen bg-gradient-to-b from-gray-950 to-black border-r border-gray-800 transition-all duration-300", collapsed ? 'w-16' : 'w-64')}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          {!collapsed && (<Link href={`/${locale}/dashboard`} className="flex items-center gap-2"><Icon icon="mdi:robot-excited" className="w-8 h-8 text-primary" /><span className="text-lg font-bold text-white">AI Marketing</span></Link>)}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-white hover:bg-gray-800"><Icon icon={collapsed ? 'mdi:menu' : 'mdi:close'} className="w-5 h-5" /></Button>
        </div>
        <nav className="p-3 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === `/${locale}${item.href}`
            return (<Link key={item.key} href={`/${locale}${item.href}`} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all", isActive ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800')}><Icon icon={item.icon} className="w-5 h-5 flex-shrink-0" />{!collapsed && <span className="font-medium">{t(item.key)}</span>}</Link>)
          })}
        </nav>
        <div className="absolute bottom-4 left-0 right-0 px-3">
          {!collapsed && (<div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"><Icon icon="mdi:lightning-bolt" className="w-6 h-6 text-primary mb-2" /><p className="text-sm font-semibold text-white mb-1">Upgrade to Pro</p><p className="text-xs text-gray-400 mb-3">Get unlimited generations</p><Button size="sm" className="w-full bg-primary hover:bg-primary/90">Upgrade</Button></div>)}
        </div>
      </aside>
    </>
  )
}
