import type { FormState, Initiative, AIPerformanceMetric, AppendixFAQ } from '@/types/aop'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  completionPercentage: number
}

export function validateIntroductionSection(formData: Partial<FormState>): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Required fields
  if (!formData.departmentName) errors.push("Department name is required")
  if (!formData.fiscalYear) errors.push("Fiscal year is required")
  if (!formData.teamDescription) errors.push("Team description is required")
  if (!formData.responsibilities) errors.push("Responsibilities are required")
  if (!formData.departmentHead) errors.push("Department head is required")
  if (!formData.aiStrategyOverview) errors.push("AI Strategy Overview is required (FY27)")
  
  // Character count validation
  if (formData.aiStrategyOverview && formData.aiStrategyOverview.length < 100) {
    warnings.push("AI Strategy Overview should be at least 100 characters for meaningful analysis")
  }
  
  if (formData.aiStrategyOverview && formData.aiStrategyOverview.length > 500) {
    warnings.push("AI Strategy Overview is quite long. Consider being more concise (recommended 200-400 characters)")
  }
  
  // Fiscal year validation
  if (formData.fiscalYear && !['2025', '2026', '2027'].includes(formData.fiscalYear)) {
    errors.push("Invalid fiscal year. Must be 2025, 2026, or 2027")
  }
  
  // Team description minimum length
  if (formData.teamDescription && formData.teamDescription.length < 50) {
    warnings.push("Team description seems brief. Provide more detail for better context")
  }
  
  const requiredFields = 6
  const completedFields = [
    formData.departmentName,
    formData.fiscalYear,
    formData.teamDescription,
    formData.responsibilities,
    formData.departmentHead,
    formData.aiStrategyOverview
  ].filter(Boolean).length
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    completionPercentage: (completedFields / requiredFields) * 100
  }
}

export function validateMetricsSection(formData: Partial<FormState>): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Business metrics validation - at least 1 required but allow 0 (flexible)
  if (!formData.businessMetrics || formData.businessMetrics.length === 0) {
    warnings.push("No business metrics added. Consider adding key performance metrics for your department.")
  }
  
  // AI Performance Metrics validation - OPTIONAL
  if (!formData.aiPerformanceMetrics || formData.aiPerformanceMetrics.length === 0) {
    warnings.push("Consider adding AI metrics if your department uses AI tools")
  }
  
  // Check for metric names
  formData.businessMetrics?.forEach((metric: any, index: number) => {
    if (!metric.name || metric.name.trim() === '') {
      errors.push(`Business Metric ${index + 1}: Name is required`)
    }
    if (!metric.fy2025Actual && !metric.fy2025Plan) {
      warnings.push(`${metric.name || `Metric ${index + 1}`}: Missing FY2025 data`)
    }
  })
  
  // Check for AI metric names
  formData.aiPerformanceMetrics?.forEach((metric: any, index: number) => {
    if (!metric.name || metric.name.trim() === '') {
      warnings.push(`AI Metric ${index + 1}: Name is missing`)
    }
  })
  
  // Validate AI metrics have expected impact
  formData.aiPerformanceMetrics?.forEach((metric: any, index: number) => {
    if (metric.enabled && !metric.expectedImpact) {
      warnings.push(`AI Metric ${index + 1}: Expected impact description is missing`)
    }
    if (metric.enabled && !metric.fy2027Target) {
      warnings.push(`AI Metric ${index + 1}: FY2027 target is missing`)
    }
  })
  
  // Completion based on having at least some metrics (business or AI)
  const hasMetrics = (formData.businessMetrics?.length || 0) > 0 || (formData.aiPerformanceMetrics?.length || 0) > 0
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    completionPercentage: hasMetrics ? 100 : 0
  }
}

export function validatePriorYearSection(formData: Partial<FormState>): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Original required fields
  if (!formData.metricsCommentary) errors.push("Key metrics commentary is required")
  if (!formData.priorYearOutcomes) errors.push("Key outcomes are required")
  if (!formData.priorYearLearnings) errors.push("Wins and learnings are required")
  if (!formData.industryTrends) errors.push("Industry trends are required")
  
  // NEW FY27 required field
  if (!formData.performanceAnalysis) errors.push("Performance analysis is required (FY27)")
  
  // AI retrospective fields are OPTIONAL now
  if (!formData.aiToolsPiloted && !formData.aiKeyWins && !formData.aiMissesChallenges && !formData.aiMeasurableImpacts) {
    warnings.push("Consider completing AI retrospective fields if your department used AI tools in FY26")
  }
  
  // Optional: Validation for AI Key Wins if provided
  if (formData.aiKeyWins && formData.aiKeyWins.length > 0) {
    const sentences = formData.aiKeyWins.split(/[.!?]/).filter((s: string) => s.trim().length > 0)
    if (sentences.length < 2) {
      warnings.push("AI Key Wins: Consider providing at least 2 specific examples")
    }
  }
  
  // Optional: Validation for AI Measurable Impacts if provided
  if (formData.aiMeasurableImpacts && formData.aiMeasurableImpacts.length > 0 && !/\d+/.test(formData.aiMeasurableImpacts)) {
    warnings.push("AI Measurable Impacts: Consider including quantifiable metrics (numbers or percentages)")
  }
  
  // Check for sufficient detail
  if (formData.performanceAnalysis && formData.performanceAnalysis.length < 100) {
    warnings.push("Performance analysis seems brief. Provide more detail on target achievement")
  }
  
  const requiredFields = 5  // Only non-AI fields are required
  const completedFields = [
    formData.metricsCommentary,
    formData.priorYearOutcomes,
    formData.priorYearLearnings,
    formData.industryTrends,
    formData.performanceAnalysis
  ].filter(Boolean).length
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    completionPercentage: (completedFields / requiredFields) * 100
  }
}

export function validateInitiativesSection(formData: Partial<FormState>): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  if (!formData.initiatives || formData.initiatives.length === 0) {
    errors.push("At least one initiative is required")
  }
  
  let validInitiativesCount = 0
  
  // Validate each initiative
  formData.initiatives?.forEach((initiative: any, index: number) => {
    const initNumber = index + 1
    let isValid = true
    
    if (!initiative.name) {
      errors.push(`Initiative ${initNumber}: Name is required`)
      isValid = false
    }
    if (!initiative.owner) {
      errors.push(`Initiative ${initNumber}: Owner is required`)
      isValid = false
    }
    if (!initiative.startDate) {
      errors.push(`Initiative ${initNumber}: Start date is required`)
      isValid = false
    }
    if (!initiative.endDate) {
      errors.push(`Initiative ${initNumber}: End date is required`)
      isValid = false
    }
    
    // NEW FY27 validation
    if (!initiative.aiIntegrationPlan || initiative.aiIntegrationPlan.trim() === '') {
      warnings.push(`Initiative ${initNumber}: Consider adding an AI Integration Plan to show how AI tools will support this initiative`)
    } else if (initiative.aiIntegrationPlan.length < 50) {
      warnings.push(`Initiative ${initNumber}: AI Integration Plan seems brief`)
    }
    
    if (!initiative.totalCost || parseFloat(initiative.totalCost) === 0) {
      warnings.push(`Initiative ${initNumber}: Total cost not specified`)
    }
    
    if (!initiative.keyOutputMetrics) {
      warnings.push(`Initiative ${initNumber}: Key output metrics not defined`)
    }
    
    // Date validation
    if (initiative.startDate && initiative.endDate) {
      const start = new Date(initiative.startDate)
      const end = new Date(initiative.endDate)
      if (end < start) {
        errors.push(`Initiative ${initNumber}: End date cannot be before start date`)
        isValid = false
      }
    }
    
    if (isValid) validInitiativesCount++
  })
  
  // NEW FY27: HC Justification validation
  const hasIncrementalInitiatives = formData.initiatives?.some((i: any) => !i.isBaseline)
  
  if (hasIncrementalInitiatives && !formData.hcJustification?.hcIncreasesJustification) {
    errors.push("HC increases justification required for incremental initiatives (FY27)")
  }
  
  // Resource allocation validation
  if (!formData.resourceAllocation?.baseline || formData.resourceAllocation.baseline.length === 0) {
    warnings.push("Baseline monthly resource allocation not completed")
  }
  
  if (hasIncrementalInitiatives && (!formData.resourceAllocation?.incremental || formData.resourceAllocation.incremental.length === 0)) {
    warnings.push("Incremental resource allocation not completed for new initiatives")
  }
  
  const totalInitiatives = formData.initiatives?.length || 0
  const completionPercentage = totalInitiatives > 0 
    ? (validInitiativesCount / totalInitiatives) * 100 
    : 0
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    completionPercentage
  }
}

export function validateResourcesSection(formData: Partial<FormState>): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  const aiWorkforce = formData.aiEnabledWorkforce || {}
  
  // NEW FY27 required fields
  if (!aiWorkforce.tasksAugmentedByAI) {
    errors.push("Tasks augmented/automated by AI is required (FY27)")
  }
  if (!aiWorkforce.expectedProductivityImprovement) {
    errors.push("Expected productivity improvement is required (FY27)")
  }
  if (!aiWorkforce.skillsDevelopmentNeeded) {
    errors.push("Skills development needed is required (FY27)")
  }
  
  // Workforce planning table validation
  if (!aiWorkforce.workforceTable || aiWorkforce.workforceTable.length === 0) {
    errors.push("AI-Enabled Workforce Planning table is required (at least 1 row) (FY27)")
  }
  
  // Validate workforce planning entries
  aiWorkforce.workforceTable?.forEach((row: any, index: number) => {
    if (!row.role) warnings.push(`Workforce row ${index + 1}: Role/level missing`)
    if (!row.fy2026Current && !row.fy2027Planned) {
      warnings.push(`Workforce row ${index + 1}: Missing headcount data`)
    }
    if (row.fy2027Planned && !row.aiAugmentationStrategy) {
      warnings.push(`Workforce row ${index + 1}: AI augmentation strategy missing`)
    }
  })
  
  // HC increase justification check
  let totalHCIncrease = 0
  aiWorkforce.workforceTable?.forEach((row: any) => {
    const current = parseFloat(row.fy2026Current) || 0
    const planned = parseFloat(row.fy2027Planned) || 0
    const change = planned - current
    if (change > 0) totalHCIncrease += change
  })
  
  if (totalHCIncrease > 0 && !aiWorkforce.hcIncreasesJustificationResources) {
    errors.push("HC increases justification required when requesting additional headcount (FY27)")
  }
  
  // Productivity improvement validation
  if (aiWorkforce.expectedProductivityImprovement) {
    const hasPercentage = /\d+%/.test(aiWorkforce.expectedProductivityImprovement)
    if (!hasPercentage) {
      warnings.push("Expected productivity improvement should include specific percentages")
    }
  }
  
  // Non-headcount costs validation - optional now
  if (!aiWorkforce.nonHeadcountCosts || aiWorkforce.nonHeadcountCosts.length === 0) {
    warnings.push("Consider adding non-headcount costs for a complete budget picture")
  }
  
  // AI Cost-Benefit Analysis validation - OPTIONAL
  if (!aiWorkforce.aiCostBenefitAnalysis || aiWorkforce.aiCostBenefitAnalysis.length === 0) {
    warnings.push("Consider adding AI cost-benefit analysis if your department invests in AI tools")
  }
  
  // Validate ROI calculations
  aiWorkforce.aiCostBenefitAnalysis?.forEach((entry: any, index: number) => {
    const cost = parseFloat(entry.annualCost) || 0
    const benefit = parseFloat(entry.expectedBenefit) || 0
    
    if (cost > 0 && benefit === 0) {
      warnings.push(`AI Investment ${index + 1}: Expected benefit not specified`)
    }
    if (cost > 0 && benefit < cost) {
      warnings.push(`AI Investment ${index + 1}: Expected benefit is less than cost (negative ROI)`)
    }
    if (!entry.paybackPeriod) {
      warnings.push(`AI Investment ${index + 1}: Payback period not specified`)
    }
  })
  
  const requiredFields = 7
  const completedFields = [
    aiWorkforce.tasksAugmentedByAI,
    aiWorkforce.expectedProductivityImprovement,
    aiWorkforce.skillsDevelopmentNeeded,
    aiWorkforce.hcIncreasesJustificationResources || totalHCIncrease === 0,
    aiWorkforce.workforceTable?.length > 0,
    aiWorkforce.nonHeadcountCosts?.length > 0,
    aiWorkforce.aiCostBenefitAnalysis?.length >= 2
  ].filter(Boolean).length
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    completionPercentage: (completedFields / requiredFields) * 100
  }
}

export function validateFileUploadsSection(formData: Partial<FormState>): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // File uploads are optional but recommended
  if (!formData.historicalData || formData.historicalData.length === 0) {
    warnings.push("Historical financial data not uploaded. This will limit AI analysis capabilities.")
  }
  
  if (!formData.budgetData || formData.budgetData.length === 0) {
    warnings.push("Budget forecast data not uploaded. This will limit AI analysis capabilities.")
  }
  
  if (!formData.supportingDocuments || formData.supportingDocuments.length === 0) {
    warnings.push("No supporting documents uploaded. Consider adding context documents for better analysis.")
  }
  
  const completionPercentage = [
    formData.historicalData?.length > 0,
    formData.budgetData?.length > 0,
    formData.supportingDocuments?.length > 0
  ].filter(Boolean).length * 33.33
  
  return {
    isValid: true, // Files are optional
    errors,
    warnings,
    completionPercentage
  }
}

export function validateAppendixFAQSection(formData: Partial<FormState>): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // All FAQ questions are OPTIONAL now
  if (!formData.appendixFAQs || formData.appendixFAQs.length === 0) {
    warnings.push("Strategic questions are optional but recommended to provide valuable context")
    return { isValid: true, errors, warnings, completionPercentage: 0 }
  }
  
  const totalQuestions = formData.appendixFAQs.length
  const answeredCount = formData.appendixFAQs.filter((faq: any) => 
    faq.answer && faq.answer.trim().length > 0
  ).length
  
  // Encourage answering at least some questions
  if (answeredCount === 0) {
    warnings.push("Consider answering some strategic questions to provide valuable context for your AOP submission")
  }
  
  // Check for substantive answers if provided
  formData.appendixFAQs.forEach((faq: any) => {
    if (faq.answer && faq.answer.trim().length > 0) {
      const wordCount = faq.answer.trim().split(/\s+/).length
      if (wordCount < 10) {
        warnings.push(`FAQ "${faq.question.substring(0, 50)}...": Answer seems brief. Consider providing more detail.`)
      }
    }
  })
  
  // Check AI-specific questions for substance if answered
  const aiQuestions = formData.appendixFAQs.filter((faq: any) => 
    faq.isAIFocused && faq.answer && faq.answer.trim().length > 0
  )
  
  aiQuestions.forEach((faq: any) => {
    if (!/\d+/.test(faq.answer)) {
      warnings.push(`AI-focused FAQ: Consider including specific metrics or percentages for better context`)
    }
  })
  
  const completionPercentage = totalQuestions > 0
    ? (answeredCount / totalQuestions) * 100
    : 0
  
  return {
    isValid: true, // All questions are optional
    errors,
    warnings,
    completionPercentage
  }
}

export function validateCompleteSubmission(formData: Partial<FormState>): ValidationResult {
  const sections = [
    { name: 'Introduction', result: validateIntroductionSection(formData) },
    { name: 'Metrics', result: validateMetricsSection(formData) },
    { name: 'Prior Year Review', result: validatePriorYearSection(formData) },
    { name: 'Initiatives', result: validateInitiativesSection(formData) },
    { name: 'Resources', result: validateResourcesSection(formData) },
    { name: 'File Uploads', result: validateFileUploadsSection(formData) },
    { name: 'Appendix FAQs', result: validateAppendixFAQSection(formData) }
  ]
  
  const allErrors: string[] = []
  const allWarnings: string[] = []
  
  sections.forEach(section => {
    if (section.result.errors.length > 0) {
      allErrors.push(`${section.name}:`)
      allErrors.push(...section.result.errors.map(e => `  • ${e}`))
    }
    if (section.result.warnings.length > 0) {
      allWarnings.push(`${section.name}:`)
      allWarnings.push(...section.result.warnings.map(w => `  • ${w}`))
    }
  })
  
  const overallCompletion = sections.reduce((sum, s) => sum + s.result.completionPercentage, 0) / sections.length
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    completionPercentage: overallCompletion
  }
}

// Helper function to get section-specific validation
export function validateSection(sectionName: string, formData: Partial<FormState>): ValidationResult {
  switch (sectionName) {
    case 'introduction':
      return validateIntroductionSection(formData)
    case 'metrics':
      return validateMetricsSection(formData)
    case 'prior-year':
      return validatePriorYearSection(formData)
    case 'initiatives':
      return validateInitiativesSection(formData)
    case 'resources':
      return validateResourcesSection(formData)
    case 'uploads':
      return validateFileUploadsSection(formData)
    case 'appendix':
      return validateAppendixFAQSection(formData)
    default:
      return {
        isValid: true,
        errors: [],
        warnings: [],
        completionPercentage: 100
      }
  }
}

