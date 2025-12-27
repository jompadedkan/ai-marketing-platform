'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Icon } from '@iconify/react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { getCurrentUser, getProfile, signOut } from '@/lib/supabase'
import { toast } from 'sonner'

export function Header() {
  const router = useRouter()
  const locale = useLocale()
  const [userName, setUserName] = useState('User')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadUser() }, [])

  const loadUser = async () => {
    try {
      const user = await getCurrentUser()
      if (user) { const profile = await getProfile(user.id); setUserName(profile.full_name || user.email || 'User') }
    } catch (error) { console.error('Error loading user:', error) } finally { setLoading(false) }
  }

  const handleSignOut = async () => {
    try { await signOut(); toast.success('Signed out successfully'); router.push(`/${locale}/auth/signin`) }
    catch (error) { toast.error('Error signing out') }
  }

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-gray-800 bg-black/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4"><h2 className="text-lg font-semibold text-white">Dashboard</h2></div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white"><Icon icon="mdi:bell" className="w-5 h-5" /></Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 gap-2 px-2">
                <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-white text-sm">{loading ? '...' : getInitials(userName)}</AvatarFallback></Avatar>
                <span className="text-sm text-white max-w-[150px] truncate hidden md:inline-block">{loading ? 'Loading...' : userName}</span>
                <Icon icon="mdi:chevron-down" className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-gray-950 border-gray-800">
              <DropdownMenuLabel className="text-gray-400">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard/settings`)} className="text-white hover:bg-gray-800 cursor-pointer"><Icon icon="mdi:cog" className="mr-2 w-4 h-4" />Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard/history`)} className="text-white hover:bg-gray-800 cursor-pointer"><Icon icon="mdi:history" className="mr-2 w-4 h-4" />History</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem onClick={handleSignOut} className="text-primary hover:bg-gray-800 cursor-pointer"><Icon icon="mdi:logout" className="mr-2 w-4 h-4" />Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
