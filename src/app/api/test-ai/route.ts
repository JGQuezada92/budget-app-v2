import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function GET(request: NextRequest) {
  try {
    // Check if API key exists
    const apiKey = process.env.ANTHROPIC_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'ANTHROPIC_API_KEY not found in environment variables',
        hint: 'Make sure .env.local exists and server was restarted'
      }, { status: 500 })
    }

    // Check API key format
    if (!apiKey.startsWith('sk-ant-')) {
      return NextResponse.json({
        success: false,
        error: 'API key has invalid format',
        format: apiKey.substring(0, 10) + '...',
        hint: 'API key should start with sk-ant-'
      }, { status: 500 })
    }

    // Try a simple API call
    const client = new Anthropic({ apiKey })
    
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Say "API is working!" if you can read this.'
        }
      ]
    })

    const content = response.content[0]
    const text = content.type === 'text' ? content.text : 'Unknown response'

    return NextResponse.json({
      success: true,
      message: 'Anthropic API is working!',
      apiKeyPrefix: apiKey.substring(0, 15) + '...',
      testResponse: text,
      model: 'claude-sonnet-4-20250514'
    })

  } catch (error: any) {
    console.error('Test AI Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.constructor.name,
      details: error.toString()
    }, { status: 500 })
  }
}

