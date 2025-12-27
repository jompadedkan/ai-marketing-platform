'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signIn, signUp } from '@/lib/supabase'
import { toast } from 'sonner'
import { Icon } from '@iconify/react'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  translations: {
    title: string
    subtitle: string
    email: string
    password: string
    fullName?: string
    submit: string
    alternateText: string
    alternateLink: string
  }
}

export function AuthForm({ mode, translations }: AuthFormProps) {
  const router = useRouter()
  const locale = useLocale()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'signup') {
        if (!formData.fullName.trim()) { toast.error('Please enter your full name'); return }
        await signUp(formData.email, formData.password, formData.fullName)
        toast.success('Account created successfully! Please sign in.')
        router.push(`/${locale}/auth/signin`)
      } else {
        await signIn(formData.email, formData.password)
        toast.success('Signed in successfully!')
        router.push(`/${locale}/dashboard`)
      }
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') console.error('Auth error:', error)
      toast.error(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-gray-900 to-black border-gray-800">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4"><div className="p-3 rounded-xl bg-primary/10 border border-primary/20"><Icon icon="mdi:robot-excited" className="w-10 h-10 text-primary" /></div></div>
        <CardTitle className="text-2xl text-center text-white">{translations.title}</CardTitle>
        <CardDescription className="text-center text-gray-400">{translations.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-gray-300">{translations.fullName}</label>
              <Input id="fullName" type="text" placeholder="John Doe" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500" />
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">{translations.email}</label>
            <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-300">{translations.password}</label>
            <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500" />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={loading}>
            {loading ? (<><Icon icon="mdi:loading" className="mr-2 h-4 w-4 animate-spin" />Loading...</>) : translations.submit}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-400">{translations.alternateText} </span>
          <a href={`/${locale}/auth/${mode === 'signin' ? 'signup' : 'signin'}`} className="text-primary hover:underline">{translations.alternateLink}</a>
        </div>
      </CardContent>
    </Card>
  )
}
