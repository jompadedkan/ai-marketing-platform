'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Icon } from '@iconify/react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const t = useTranslations('landing.footer')
  const locale = useLocale()

  return (
    <footer className="bg-black border-t border-gray-900">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4"><Icon icon="mdi:robot-excited" className="w-8 h-8 text-primary" /><span className="text-xl font-bold text-white">AI Marketing</span></div>
            <p className="text-gray-400 mb-4 max-w-md">Create engaging marketing content in seconds with the power of artificial intelligence.</p>
            <LanguageSwitcher />
          </div>
          <div><h3 className="text-white font-semibold mb-4">Quick Links</h3><ul className="space-y-2"><li><Link href={`/${locale}/auth/signup`} className="text-gray-400 hover:text-primary transition-colors">Get Started</Link></li><li><Link href="#features" className="text-gray-400 hover:text-primary transition-colors">Features</Link></li><li><Link href="#how-it-works" className="text-gray-400 hover:text-primary transition-colors">How It Works</Link></li></ul></div>
          <div><h3 className="text-white font-semibold mb-4">Legal</h3><ul className="space-y-2"><li><Link href="/about" className="text-gray-400 hover:text-primary transition-colors">{t('about')}</Link></li><li><Link href="/privacy" className="text-gray-400 hover:text-primary transition-colors">{t('privacy')}</Link></li><li><Link href="/terms" className="text-gray-400 hover:text-primary transition-colors">{t('terms')}</Link></li><li><Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">{t('contact')}</Link></li></ul></div>
        </div>
        <Separator className="bg-gray-900 mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} AI Marketing Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Icon icon="mdi:twitter" className="w-5 h-5" /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Icon icon="mdi:facebook" className="w-5 h-5" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Icon icon="mdi:linkedin" className="w-5 h-5" /></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Icon icon="mdi:github" className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
