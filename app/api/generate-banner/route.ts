import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { prompt, aspectRatio = '16:9', style } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing required prompt' },
        { status: 400 }
      )
    }

    if (!REPLICATE_API_KEY) {
      return NextResponse.json(
        { error: 'Replicate API key not configured' },
        { status: 500 }
      )
    }

    const enhancedPrompt = buildBannerPrompt(prompt, style)

    const response = await fetch('https://api.replicate.com/v1/models/google/nano-banana-pro/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait=60',
      },
      body: JSON.stringify({
        input: {
          prompt: enhancedPrompt,
          aspect_ratio: aspectRatio,
          output_format: 'png',
          safety_tolerance: 2,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Replicate API error:', error)
      return NextResponse.json(
        { error: 'Failed to generate banner' },
        { status: response.status }
      )
    }

    const prediction = await response.json()

    if (prediction.status === 'succeeded') {
      return NextResponse.json({
        success: true,
        imageUrl: prediction.output,
        id: prediction.id,
      })
    }

    if (prediction.status === 'processing' || prediction.status === 'starting') {
      return NextResponse.json({
        success: true,
        status: prediction.status,
        id: prediction.id,
        getUrl: prediction.urls?.get,
      })
    }

    if (prediction.status === 'failed') {
      return NextResponse.json(
        { error: prediction.error || 'Banner generation failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      prediction,
    })

  } catch (error) {
    console.error('Error in generate-banner route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const predictionId = searchParams.get('id')

  if (!predictionId) {
    return NextResponse.json(
      { error: 'Missing prediction ID' },
      { status: 400 }
    )
  }

  if (!REPLICATE_API_KEY) {
    return NextResponse.json(
      { error: 'Replicate API key not configured' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: {
          'Authorization': `Bearer ${REPLICATE_API_KEY}`,
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to get prediction status' },
        { status: response.status }
      )
    }

    const prediction = await response.json()

    return NextResponse.json({
      status: prediction.status,
      imageUrl: prediction.output,
      error: prediction.error,
    })

  } catch (error) {
    console.error('Error checking prediction status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function buildBannerPrompt(prompt: string, style?: string): string {
  const stylePrompts: Record<string, string> = {
    modern: 'modern, clean design, minimalist, professional, sleek typography',
    vintage: 'vintage style, retro aesthetics, nostalgic, warm colors, classic typography',
    bold: 'bold colors, high contrast, impactful, dynamic, eye-catching',
    minimal: 'minimal design, lots of white space, simple, elegant, understated',
    creative: 'creative, artistic, unique, innovative design, expressive',
    corporate: 'corporate style, professional, business-like, trustworthy, clean',
    playful: 'playful, fun, colorful, energetic, vibrant',
    elegant: 'elegant, sophisticated, luxurious, refined, premium feel',
  }

  const styleModifier = style && stylePrompts[style] ? stylePrompts[style] : ''
  
  return `Create a professional marketing banner: ${prompt}. ${styleModifier}. High quality, suitable for social media and web advertising, clear readable text if any, visually appealing composition.`
}
