# AI Marketing Platform

🚀 AI-powered marketing content and banner generator built with Next.js, Supabase, and Replicate.

## Features

- ✅ **AI Content Generation** - Generate marketing posts, captions, and articles using OpenRouter
- ✅ **AI Banner Generation** - Create stunning banners using Nano Banana Pro from Replicate
- ✅ **Multi-language Support** - English and Thai
- ✅ **User Authentication** - Sign up/Sign in with Supabase
- ✅ **Content History** - Save and manage generated content
- ✅ **Banner History** - Save and manage generated banners
- ✅ **Dark Theme** - Beautiful red/black/white color scheme

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **AI Content**: OpenRouter (Claude 3.5 Sonnet)
- **AI Images**: Replicate (Nano Banana Pro)
- **i18n**: next-intl

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run development server: `npm run dev`

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENROUTER_API_KEY=your-openrouter-key
REPLICATE_API_KEY=your-replicate-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## License

MIT
