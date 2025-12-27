'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/react'
import { getCurrentUser, getProfile, updateProfile } from '@/lib/supabase'
import { toast } from 'sonner'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default function SettingsPage() {
  const t = useTranslations('dashboard.settings')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState({ fullName: '', email: '' })

  useEffect(() => { loadProfile() }, [])

  const loadProfile = async () => {
    try {
      const user = await getCurrentUser()
      if (user) {
        const profile = await getProfile(user.id)
        setProfileData({ fullName: profile.full_name || '', email: profile.email })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const user = await getCurrentUser()
      if (user) {
        await updateProfile(user.id, { full_name: profileData.fullName } as any)
        toast.success('Profile updated successfully')
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-800 rounded-lg"></div>
          <div className="h-64 bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">{t('profile')}</CardTitle>
          <CardDescription className="text-gray-400">Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{t('fullName')}</label>
            <Input value={profileData.fullName} onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })} className="bg-gray-900/50 border-gray-700 text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{t('email')}</label>
            <Input value={profileData.email} disabled className="bg-gray-900/50 border-gray-700 text-gray-500" />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>
          <Button onClick={handleSaveProfile} disabled={saving} className="bg-primary hover:bg-primary/90 text-white">
            {saving ? (<><Icon icon="mdi:loading" className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : (<><Icon icon="mdi:content-save" className="mr-2 h-4 w-4" />{t('save')}</>)}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">{t('language')}</CardTitle>
          <CardDescription className="text-gray-400">Choose your preferred language</CardDescription>
        </CardHeader>
        <CardContent>
          <LanguageSwitcher />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/50">
        <CardHeader>
          <CardTitle className="text-red-500">{t('deleteAccount')}</CardTitle>
          <CardDescription className="text-gray-400">{t('deleteWarning')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => toast.error('Account deletion is not implemented in this demo')}>
            <Icon icon="mdi:delete-forever" className="mr-2 h-4 w-4" />{t('confirmDelete')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
