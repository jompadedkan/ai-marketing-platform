'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@iconify/react'

const features = [{ icon: 'mdi:brain', key: 'feature1' }, { icon: 'mdi:translate', key: 'feature2' }, { icon: 'mdi:file-document-multiple', key: 'feature3' }, { icon: 'mdi:history', key: 'feature4' }]

export function Features() {
  const t = useTranslations('landing.features')

  return (
    <section className="py-24 bg-black relative">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('title')}</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.key} className="bg-gradient-to-br from-gray-900 to-black border-gray-800 hover:border-primary/50 transition-all duration-300 group hover:scale-105">
              <CardHeader><div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"><Icon icon={feature.icon} className="w-8 h-8 text-primary" /></div><CardTitle className="text-white text-xl">{t(`${feature.key}.title`)}</CardTitle></CardHeader>
              <CardContent><CardDescription className="text-gray-400">{t(`${feature.key}.description`)}</CardDescription></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
