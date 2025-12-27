'use client'

import { useTranslations } from 'next-intl'
import { Icon } from '@iconify/react'

const steps = [{ icon: 'mdi:account-plus', key: 'step1' }, { icon: 'mdi:text-box-edit', key: 'step2' }, { icon: 'mdi:rocket-launch', key: 'step3' }]

export function HowItWorks() {
  const t = useTranslations('landing.howItWorks')

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('title')}</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <div key={step.key} className="relative">
                {index < steps.length - 1 && (<div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary via-primary/50 to-transparent" />)}
                <div className="text-center relative z-10">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-xl font-bold mb-4">{index + 1}</div>
                  <div className="flex justify-center mb-6"><div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center"><Icon icon={step.icon} className="w-12 h-12 text-primary" /></div></div>
                  <h3 className="text-2xl font-bold text-white mb-3">{t(`${step.key}.title`)}</h3>
                  <p className="text-gray-400">{t(`${step.key}.description`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
