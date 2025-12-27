import { useTranslations } from 'next-intl'
import { AuthForm } from '@/components/auth/AuthForm'
import Link from 'next/link'
import { Icon } from '@iconify/react'

export default function SignInPage() {
  const t = useTranslations('auth.signin')

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-red-950/10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

      <Link 
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-10"
      >
        <Icon icon="mdi:arrow-left" className="w-5 h-5" />
        <span>Back to home</span>
      </Link>

      <div className="relative z-10 px-4">
        <AuthForm
          mode="signin"
          translations={{
            title: t('title'),
            subtitle: t('subtitle'),
            email: t('email'),
            password: t('password'),
            submit: t('submit'),
            alternateText: t('noAccount'),
            alternateLink: t('signupLink'),
          }}
        />
      </div>
    </div>
  )
}
