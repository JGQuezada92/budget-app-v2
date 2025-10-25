import { NextRequest, NextResponse } from 'next/server'
import { analyzeSubmission, buildAnalysisPrompt } from '@/lib/ai-analysis'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json()
    const skipAPICall = body.options?.skipAPICall || false

    // Build analysis request
    const analysisRequest = {
      departmentName: body.departmentName || 'Unknown',
      fiscalYear: body.fiscalYear || '2027',
      historicalData: body.historicalData || [],
      budgetData: body.budgetData || [],
      aopFormData: body.aopFormData || body,
      supportingDocs: body.supportingDocs || []
    }

    // Generate prompt for metadata
    const prompt = buildAnalysisPrompt(analysisRequest)
    const promptLength = prompt.length

    let result: any
    let responseLength = 0

    if (skipAPICall) {
      // Return mock result for testing without API cost
      result = {
        summary: `Mock analysis for ${analysisRequest.departmentName} department. This is a test result that doesn't call the Claude API.`,
        insights: [
          { title: 'Mock Insight 1', description: 'This is a mock insight for testing purposes.' },
          { title: 'Mock Insight 2', description: 'Another mock insight to verify the system works.' }
        ],
        recommendations: [
          { title: 'Mock Recommendation 1', description: 'This is a mock recommendation for testing.' },
          { title: 'Mock Recommendation 2', description: 'Another mock recommendation.' }
        ],
        risks: [
          { title: 'Mock Risk', description: 'This is a mock risk for testing purposes.' }
        ],
        opportunities: [
          { title: 'Mock Opportunity', description: 'This is a mock opportunity for testing.' }
        ],
        kpiSuggestions: [
          { title: 'Mock KPI', description: 'Track this metric', rationale: 'Important for the department' }
        ],
        aiReadinessScore: 50,
        confidenceScore: 60
      }
      responseLength = JSON.stringify(result).length
    } else {
      // Run real analysis
      if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json(
          { error: 'Claude API key not configured. Set ANTHROPIC_API_KEY environment variable.' },
          { status: 500 }
        )
      }

      result = await analyzeSubmission(analysisRequest)
      responseLength = JSON.stringify(result).length
    }

    const processingTime = Date.now() - startTime

    // Validate which data was referenced
    const businessMetrics = analysisRequest.aopFormData.businessMetrics || []
    const aiMetrics = analysisRequest.aopFormData.aiPerformanceMetrics || []
    const initiatives = analysisRequest.aopFormData.initiatives || []

    const allAnalysisText = [
      result.summary || '',
      ...(result.insights || []).map((i: any) => `${i.title} ${i.description}`),
      ...(result.recommendations || []).map((r: any) => `${r.title} ${r.description}`),
      ...(result.kpiSuggestions || []).map((k: any) => `${k.title} ${k.description} ${k.rationale}`)
    ].join(' ').toLowerCase()

    const metricsReferenced = [...businessMetrics, ...aiMetrics].filter((m: any) => {
      const name = (m.name || m.metricName || '').toLowerCase()
      return name && allAnalysisText.includes(name)
    }).length

    const initiativesReferenced = initiatives.filter((i: any) => {
      const name = (i.name || '').toLowerCase()
      return name && allAnalysisText.includes(name)
    }).length

    const departmentReferenced = allAnalysisText.includes(analysisRequest.departmentName.toLowerCase())

    return NextResponse.json({
      result,
      metadata: {
        processingTime,
        promptLength,
        responseLength,
        estimatedTokens: Math.ceil(promptLength / 4),
        apiCallMade: !skipAPICall,
        validationResults: {
          metricsTotal: businessMetrics.length + aiMetrics.length,
          metricsReferenced,
          initiativesTotal: initiatives.length,
          initiativesReferenced,
          departmentReferenced,
          dataUsageScore: Math.round(
            ((metricsReferenced + initiativesReferenced + (departmentReferenced ? 1 : 0)) / 
            (businessMetrics.length + aiMetrics.length + initiatives.length + 1)) * 100
          )
        }
      }
    })
  } catch (error) {
    console.error('Error testing analysis:', error)
    return NextResponse.json(
      { error: 'Failed to test analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

