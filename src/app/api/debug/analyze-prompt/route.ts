import { NextRequest, NextResponse } from 'next/server'
import { buildAnalysisPrompt } from '@/lib/ai-analysis'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Build analysis request
    const analysisRequest = {
      departmentName: body.departmentName || 'Unknown',
      fiscalYear: body.fiscalYear || '2027',
      historicalData: body.historicalData || [],
      budgetData: body.budgetData || [],
      aopFormData: body.aopFormData || body,
      supportingDocs: body.supportingDocs || []
    }

    // Generate prompt
    const prompt = buildAnalysisPrompt(analysisRequest)

    // Analyze prompt statistics
    const lines = prompt.split('\n')
    const characterCount = prompt.length
    const estimatedTokens = Math.ceil(characterCount / 4)
    
    // Count sections (major separators)
    const sectionCount = (prompt.match(/═{10,}/g) || []).length
    
    // Count data insertion points (green sections in UI)
    const dataInsertionKeywords = [
      'Department Name:',
      'Team Description:',
      'Responsibilities:',
      'Business Metrics Submitted:',
      'AI Performance Metrics Submitted:',
      'Total Initiatives Submitted:',
      'AI Strategy Overview:',
      'Performance Analysis:',
      'Prior Year Outcomes:'
    ]
    const dataInsertionPoints = dataInsertionKeywords.filter(keyword => 
      prompt.includes(keyword)
    ).length
    
    // Count critical warnings
    const criticalWarnings = (prompt.match(/⚠️/g) || []).length
    
    // Count department mentions
    const departmentName = analysisRequest.departmentName
    const departmentMentions = departmentName && departmentName !== 'Unknown' 
      ? (prompt.toLowerCase().match(new RegExp(departmentName.toLowerCase(), 'g')) || []).length
      : 0

    // Quality assessment
    const hasUserData = dataInsertionPoints >= 5
    const hasCriticalWarnings = criticalWarnings >= 10
    const hasDepartmentSpecifics = prompt.includes(`FOR ${departmentName.toUpperCase()} DEPARTMENT`)
    
    // Calculate quality score
    let qualityScore = 0
    if (hasUserData) qualityScore += 30
    if (hasCriticalWarnings) qualityScore += 30
    if (hasDepartmentSpecifics) qualityScore += 25
    if (departmentMentions >= 10) qualityScore += 15

    return NextResponse.json({
      prompt,
      statistics: {
        characterCount,
        estimatedTokens,
        lineCount: lines.length,
        sectionCount,
        dataInsertionPoints,
        criticalWarnings,
        departmentMentions
      },
      quality: {
        hasUserData,
        hasCriticalWarnings,
        hasDepartmentSpecifics,
        score: qualityScore
      }
    })
  } catch (error) {
    console.error('Error analyzing prompt:', error)
    return NextResponse.json(
      { error: 'Failed to analyze prompt', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

