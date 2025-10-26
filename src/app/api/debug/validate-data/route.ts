import { NextRequest, NextResponse } from 'next/server'
import { validateCompleteSubmission } from '@/lib/form-validation'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Run comprehensive validation
    const validationResult = validateCompleteSubmission(formData)

    // Calculate completeness scores
    const requiredFieldsCount = 15 // Approximate number of required fields
    const optionalFieldsCount = 25 // Approximate number of optional fields
    
    const businessMetrics = formData.businessMetrics || []
    const aiMetrics = formData.aiPerformanceMetrics || []
    const initiatives = formData.initiatives || []

    // Check metric names
    const metricsWithNames = businessMetrics.filter((m: any) => m.name && m.name.trim() !== '')
    const aiMetricsWithNames = aiMetrics.filter((m: any) => m.name && m.name.trim() !== '')
    const initiativesWithDescriptions = initiatives.filter((i: any) => i.description && i.description.trim() !== '')

    // Build suggestions
    const suggestions: string[] = []
    
    if (metricsWithNames.length < businessMetrics.length) {
      suggestions.push('Some business metrics are missing names - add descriptive names for better AI analysis')
    }
    
    if (!formData.aiStrategyOverview || formData.aiStrategyOverview.length < 200) {
      suggestions.push('AI Strategy Overview is short or missing - add detailed strategy (200+ characters recommended)')
    }
    
    if (!formData.historicalData || formData.historicalData.length === 0) {
      suggestions.push('No historical data uploaded - add historical financial data for better variance analysis')
    }
    
    if (initiatives.length < 2) {
      suggestions.push('Add more initiatives (at least 2-3) to provide context for AI analysis')
    }

    // Calculate overall data quality score
    const dataQualityFactors = [
      formData.departmentName ? 1 : 0,
      formData.aiStrategyOverview?.length >= 200 ? 1 : 0,
      metricsWithNames.length >= 3 ? 1 : 0,
      initiatives.length >= 2 ? 1 : 0,
      formData.performanceAnalysis?.length > 0 ? 1 : 0,
      formData.historicalData?.length > 0 ? 1 : 0
    ]
    const dataQualityScore = Math.round((dataQualityFactors.reduce((a, b) => a + b, 0) / dataQualityFactors.length) * 100)

    return NextResponse.json({
      isValid: validationResult.isValid,
      errors: validationResult.errors,
      warnings: validationResult.warnings,
      completionPercentage: validationResult.completionPercentage,
      dataQuality: {
        score: dataQualityScore,
        requiredFieldsFilled: Math.min(requiredFieldsCount, validationResult.errors.length === 0 ? requiredFieldsCount : requiredFieldsCount - validationResult.errors.length),
        requiredFieldsTotal: requiredFieldsCount,
        optionalFieldsFilled: Math.min(optionalFieldsCount, Math.floor(validationResult.completionPercentage / 100 * optionalFieldsCount)),
        optionalFieldsTotal: optionalFieldsCount,
        metricsWithNames: metricsWithNames.length,
        metricsTotal: businessMetrics.length,
        initiativesWithDescriptions: initiativesWithDescriptions.length,
        initiativesTotal: initiatives.length
      },
      suggestions
    })
  } catch (error) {
    console.error('Error validating data:', error)
    return NextResponse.json(
      { error: 'Failed to validate data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

