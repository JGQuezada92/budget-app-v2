import { NextRequest, NextResponse } from 'next/server'
import { buildAnalysisPrompt } from '@/lib/ai-analysis'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Build the analysis request object
    const analysisRequest = {
      departmentName: body.departmentName || 'Unknown Department',
      fiscalYear: body.fiscalYear || '2027',
      historicalData: body.historicalData || [],
      budgetData: body.budgetData || [],
      aopFormData: body.aopFormData || {},
      supportingDocs: body.supportingDocs || []
    }
    
    // Generate the prompt
    const prompt = buildAnalysisPrompt(analysisRequest)
    
    return NextResponse.json({
      prompt: prompt,
      length: prompt.length
    })
  } catch (error) {
    console.error('Error generating prompt preview:', error)
    return NextResponse.json(
      { error: 'Failed to generate prompt preview' },
      { status: 500 }
    )
  }
}

