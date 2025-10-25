import { NextRequest, NextResponse } from 'next/server'
import { analyzeSubmission } from '@/lib/ai-analysis'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const analysis = await analyzeSubmission({
      departmentName: body.departmentName,
      fiscalYear: body.fiscalYear,
      historicalData: body.historicalData || [],
      budgetData: body.budgetData || [],
      aopFormData: body.aopFormData,
      supportingDocs: body.supportingDocs
    })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze submission' },
      { status: 500 }
    )
  }
}
