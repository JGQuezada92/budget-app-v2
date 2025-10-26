import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { loadFramework, saveFramework, getFrameworkSummary, type PromptFramework } from '@/lib/prompt-framework'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { userMessage } = await request.json()
    
    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: userMessage is required' },
        { status: 400 }
      )
    }

    // Load current framework
    const currentFramework = loadFramework()
    const frameworkSummary = getFrameworkSummary(currentFramework)

    // Build prompt for Claude to help modify the framework
    const systemPrompt = `You are an AI assistant helping users configure their AI budget analyst framework.

Current Framework Configuration:
${frameworkSummary}

The user wants to modify this framework. Your job is to:
1. Understand what changes they want to make
2. Explain the implications of those changes
3. Provide the updated framework configuration as JSON

The framework has these customizable parts:
- **dimensions**: Three analysis dimensions (quantitative, qualitative, kpiEvaluation) with weights
- **focusAreas**: Specific areas to evaluate (can be enabled/disabled)
- **principles**: Core analysis principles
- **outputStructure**: What fields the analysis should return
- **departmentGuidelines**: Department-specific focus areas

Respond with:
1. A conversational explanation of what you're changing and why
2. The complete updated framework as JSON in a code block

Format your response as:
[Your explanation here]

\`\`\`json
{
  "dimensions": {...},
  "focusAreas": [...],
  "principles": [...],
  "outputStructure": [...],
  "departmentGuidelines": {...}
}
\`\`\`

Be conversational and helpful. Ask clarifying questions if the user's request is ambiguous.`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ],
      system: systemPrompt
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    const assistantMessage = content.text

    // Try to extract JSON from the response
    const jsonMatch = assistantMessage.match(/```json\n([\s\S]*?)\n```/)
    let updatedFramework: Partial<PromptFramework> | null = null
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        updatedFramework = JSON.parse(jsonMatch[1])
      } catch (e) {
        console.error('Failed to parse framework JSON:', e)
      }
    }

    return NextResponse.json({
      message: assistantMessage,
      updatedFramework,
      currentFramework
    })

  } catch (error: any) {
    console.error('Framework chat error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process framework modification',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve current framework
export async function GET() {
  try {
    const framework = loadFramework()
    const summary = getFrameworkSummary(framework)
    
    return NextResponse.json({
      framework,
      summary
    })
  } catch (error: any) {
    console.error('Error loading framework:', error)
    return NextResponse.json(
      { error: 'Failed to load framework', details: error.message },
      { status: 500 }
    )
  }
}

// PUT endpoint to save framework modifications
export async function PUT(request: NextRequest) {
  try {
    const { framework } = await request.json()
    
    if (!framework) {
      return NextResponse.json(
        { error: 'Framework data is required' },
        { status: 400 }
      )
    }

    saveFramework(framework)
    
    return NextResponse.json({
      success: true,
      message: 'Framework updated successfully',
      framework
    })
  } catch (error: any) {
    console.error('Error saving framework:', error)
    return NextResponse.json(
      { error: 'Failed to save framework', details: error.message },
      { status: 500 }
    )
  }
}

