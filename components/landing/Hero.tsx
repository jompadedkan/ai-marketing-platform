'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/react'

export function Hero() {
  const t = useTranslations('landing.hero')
  const locale = useLocale()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-red-950/20" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="container relative z-10 px-4 mx-auto text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-center"><div className="p-4 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20"><Icon icon="mdi:robot-excited" className="w-16 h-16 text-primary" /></div></div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">{t('title').split(' ').slice(0, -2).join(' ')} </span>
            <span className="bg-gradient-to-r from-primary via-red-500 to-primary bg-clip-text text-transparent animate-pulse">{t('title').split(' ').slice(-2).join(' ')}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">{t('subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href={`/${locale}/auth/signup`}><Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white group">{t('cta')}<Icon icon="mdi:arrow-right" className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button></Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-gray-700 text-white hover:bg-white/10">{t('learnMore')}</Button>
          </div>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-gray-800">
            <div><div className="text-3xl font-bold text-primary">10K+</div><div className="text-sm text-gray-500">Contents Generated</div></div>
            <div><div className="text-3xl font-bold text-primary">2</div><div className="text-sm text-gray-500">Languages</div></div>
            <div><div className="text-3xl font-bold text-primary">99%</div><div className="text-sm text-gray-500">Satisfaction</div></div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"><Icon icon="mdi:chevron-down" className="w-8 h-8 text-gray-600" /></div>
    </section>
  )
}
