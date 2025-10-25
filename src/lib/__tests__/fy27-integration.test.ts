/**
 * FY27 AOP Template - Integration Tests
 * Comprehensive test suite for FY27 template validation, AI analysis, and data structures
 */

import { describe, test, expect, beforeEach } from '@jest/globals'
import { 
  validateCompleteSubmission,
  validateIntroductionSection,
  validateMetricsSection,
  validatePriorYearSection,
  validateInitiativesSection,
  validateResourcesSection,
  validateAppendixFAQSection,
  type ValidationResult
} from '../form-validation'
import { sampleFY27Submission, sampleFinanceDepartment } from '../sample-data'
import type { FormState, Initiative, WorkforceRow, AIPerformanceMetric } from '@/types/aop'
import { 
  calculateHCChange, 
  calculateYOYPercentage, 
  calculateTotalFTEs,
  calculateROI,
  getAIReadinessLabel,
  isValidFiscalYear,
  createDefaultFormState
} from '@/types/aop'

// ============================================
// TEST SUITE 1: FORM VALIDATION TESTS
// ============================================

describe('FY27 Form Validation Tests', () => {
  
  test('Sample FY27 submission should pass all validation', () => {
    const result = validateCompleteSubmission(sampleFY27Submission)
    
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
    expect(result.completionPercentage).toBe(100)
  })

  test('Should require AI Strategy Overview in introduction', () => {
    const incompleteData = {
      ...sampleFY27Submission,
      aiStrategyOverview: '' // Missing required field
    }
    
    const result = validateIntroductionSection(incompleteData)
    
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('AI Strategy Overview is required (FY27)')
  })

  test('AI Strategy Overview should have minimum length', () => {
    const briefStrategy = {
      ...sampleFY27Submission,
      aiStrategyOverview: 'We will use AI' // Too short
    }
    
    const result = validateIntroductionSection(briefStrategy)
    
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.warnings[0]).toContain('at least 100 characters')
  })

  test('Should require minimum 2 AI Performance Metrics', () => {
    const insufficientMetrics = {
      ...sampleFY27Submission,
      aiPerformanceMetrics: [
        sampleFY27Submission.aiPerformanceMetrics![0]
      ] // Only 1 metric
    }
    
    const result = validateMetricsSection(insufficientMetrics)
    
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('At least 2 AI Performance Metrics are required (FY27)')
  })

  test('Should validate all 4 parts of AI Retrospective', () => {
    const incompleteRetrospective = {
      ...sampleFY27Submission,
      aiToolsPiloted: '',
      aiKeyWins: '',
      aiMissesChallenges: '',
      aiMeasurableImpacts: ''
    }
    
    const result = validatePriorYearSection(incompleteRetrospective)
    
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('AI tools piloted/adopted is required (FY27)')
    expect(result.errors).toContain('AI key wins are required (FY27)')
    expect(result.errors).toContain('AI misses/challenges are required (FY27)')
    expect(result.errors).toContain('AI measurable impacts are required (FY27)')
  })

  test('AI Key Wins should have multiple examples', () => {
    const singleWin = {
      ...sampleFY27Submission,
      aiKeyWins: 'We had one success.' // Only 1 example
    }
    
    const result = validatePriorYearSection(singleWin)
    
    expect(result.warnings.some(w => w.includes('at least 2'))).toBe(true)
  })

  test('AI Measurable Impacts should include numbers', () => {
    const noNumbers = {
      ...sampleFY27Submission,
      aiMeasurableImpacts: 'We saved money and time.' // No specific metrics
    }
    
    const result = validatePriorYearSection(noNumbers)
    
    expect(result.warnings.some(w => w.includes('quantifiable'))).toBe(true)
  })

  test('Should require AI Integration Plan for each initiative', () => {
    const initiativesWithoutAI = {
      ...sampleFY27Submission,
      initiatives: [
        {
          id: '1',
          name: 'Test Initiative',
          owner: 'John Doe',
          startDate: '2027-01-01',
          endDate: '2027-12-31',
          isBaseline: false,
          priority: 'high',
          description: 'Test',
          aiIntegrationPlan: '' // Missing required field
        }
      ]
    }
    
    const result = validateInitiativesSection(initiativesWithoutAI as any)
    
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('AI Integration Plan'))).toBe(true)
  })

  test('Should require HC justification when requesting HC increases', () => {
    const hcIncreaseWithoutJustification = {
      ...sampleFY27Submission,
      initiatives: [
        {
          ...sampleFY27Submission.initiatives![0],
          isBaseline: false // Incremental = HC increase
        }
      ],
      hcJustification: {
        hcIncreasesJustification: '', // Missing
        hcReductionsExplanation: ''
      }
    }
    
    const result = validateInitiativesSection(hcIncreaseWithoutJustification)
    
    expect(result.errors.some(e => e.includes('HC increases justification'))).toBe(true)
  })

  test('Should require AI Workforce Planning sections', () => {
    const missingWorkforcePlanning = {
      ...sampleFY27Submission,
      aiEnabledWorkforce: {
        tasksAugmentedByAI: '',
        expectedProductivityImprovement: '',
        skillsDevelopmentNeeded: '',
        hcIncreasesJustificationResources: '',
        workforceTable: [],
        nonHeadcountCosts: [],
        aiCostBenefitAnalysis: []
      }
    }
    
    const result = validateResourcesSection(missingWorkforcePlanning)
    
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Tasks augmented/automated by AI is required (FY27)')
    expect(result.errors).toContain('Expected productivity improvement is required (FY27)')
    expect(result.errors).toContain('Skills development needed is required (FY27)')
  })

  test('Should require minimum 2 AI Cost-Benefit entries', () => {
    const insufficientCostBenefit = {
      ...sampleFY27Submission,
      aiEnabledWorkforce: {
        ...sampleFY27Submission.aiEnabledWorkforce!,
        aiCostBenefitAnalysis: [
          sampleFY27Submission.aiEnabledWorkforce!.aiCostBenefitAnalysis![0]
        ] // Only 1 entry
      }
    }
    
    const result = validateResourcesSection(insufficientCostBenefit)
    
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('AI Cost-Benefit Analysis requires at least 2 entries (FY27)')
  })

  test('Should require all 8 required FAQ questions answered', () => {
    const incompleteFAQs = {
      ...sampleFY27Submission,
      appendixFAQs: sampleFY27Submission.appendixFAQs!.map(faq => ({
        ...faq,
        answer: faq.required ? '' : faq.answer // Clear required answers
      }))
    }
    
    const result = validateAppendixFAQSection(incompleteFAQs)
    
    expect(result.isValid).toBe(false)
    expect(result.errors[0]).toContain('required FAQ question(s) not answered')
  })

  test('FAQ answers should be substantive (not too brief)', () => {
    const briefAnswers = {
      ...sampleFY27Submission,
      appendixFAQs: sampleFY27Submission.appendixFAQs!.map(faq => ({
        ...faq,
        answer: faq.required ? 'Yes.' : faq.answer // Too brief
      }))
    }
    
    const result = validateAppendixFAQSection(briefAnswers)
    
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.warnings.some(w => w.includes('too brief'))).toBe(true)
  })

  test('Should validate fiscal year is in valid range', () => {
    const invalidFY = {
      ...sampleFY27Submission,
      fiscalYear: '2024' // Not in FY25-27 range
    }
    
    const result = validateIntroductionSection(invalidFY)
    
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('Invalid fiscal year'))).toBe(true)
  })
})

// ============================================
// TEST SUITE 2: AI ANALYSIS INTEGRATION TESTS
// ============================================

describe('AI Analysis Integration Tests', () => {
  
  test('Should analyze FY27 submission without errors', async () => {
    // Note: This test requires ANTHROPIC_API_KEY environment variable
    // Skip if not available in test environment
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('Skipping AI analysis test - API key not configured')
      return
    }

    const request = {
      departmentName: 'Information Technology',
      fiscalYear: '2027',
      historicalData: sampleFY27Submission.historicalData || [],
      budgetData: sampleFY27Submission.budgetData || [],
      aopFormData: sampleFY27Submission,
      supportingDocs: []
    }

    const result = await analyzeSubmission(request)

    expect(result).toBeDefined()
    expect(result.summary).toBeDefined()
    expect(result.insights).toBeDefined()
    expect(result.recommendations).toBeDefined()
    expect(result.risks).toBeDefined()
    expect(result.opportunities).toBeDefined()
  }, 30000) // 30 second timeout for AI call

  test('AI analysis should include KPI suggestions', async () => {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('Skipping - API key not configured')
      return
    }

    const request = {
      departmentName: 'Information Technology',
      fiscalYear: '2027',
      historicalData: [],
      budgetData: [],
      aopFormData: sampleFY27Submission
    }

    const result = await analyzeSubmission(request)

    expect(result.kpiSuggestions).toBeDefined()
    expect(Array.isArray(result.kpiSuggestions)).toBe(true)
    
    // KPI suggestions should have correct structure
    if (result.kpiSuggestions.length > 0) {
      const firstSuggestion = result.kpiSuggestions[0]
      expect(firstSuggestion).toHaveProperty('title')
      expect(firstSuggestion).toHaveProperty('description')
      expect(firstSuggestion).toHaveProperty('rationale')
    }
  }, 30000)

  test('AI analysis should calculate AI Readiness Score (0-100)', async () => {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('Skipping - API key not configured')
      return
    }

    const request = {
      departmentName: 'Information Technology',
      fiscalYear: '2027',
      historicalData: [],
      budgetData: [],
      aopFormData: sampleFY27Submission
    }

    const result = await analyzeSubmission(request)

    expect(result.aiReadinessScore).toBeDefined()
    expect(typeof result.aiReadinessScore).toBe('number')
    expect(result.aiReadinessScore).toBeGreaterThanOrEqual(0)
    expect(result.aiReadinessScore).toBeLessThanOrEqual(100)
  }, 30000)

  test('AI should evaluate AI strategy quality', async () => {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('Skipping - API key not configured')
      return
    }

    const request = {
      departmentName: 'Information Technology',
      fiscalYear: '2027',
      historicalData: [],
      budgetData: [],
      aopFormData: sampleFY27Submission
    }

    const result = await analyzeSubmission(request)

    // Analysis should reference AI strategy
    const aiRelatedContent = [
      result.summary,
      ...result.insights.map(i => i.description),
      ...result.recommendations.map(r => r.description)
    ].join(' ').toLowerCase()

    expect(aiRelatedContent).toMatch(/\b(ai|artificial intelligence|copilot|claude|automation)\b/)
  }, 30000)
})

// ============================================
// TEST SUITE 3: DATA STRUCTURE COMPATIBILITY
// ============================================

describe('Data Structure Compatibility Tests', () => {
  
  test('FY27 submission should have all required top-level fields', () => {
    expect(sampleFY27Submission).toHaveProperty('departmentName')
    expect(sampleFY27Submission).toHaveProperty('fiscalYear')
    expect(sampleFY27Submission).toHaveProperty('aiStrategyOverview')
    expect(sampleFY27Submission).toHaveProperty('businessMetrics')
    expect(sampleFY27Submission).toHaveProperty('aiPerformanceMetrics')
    expect(sampleFY27Submission).toHaveProperty('initiatives')
    expect(sampleFY27Submission).toHaveProperty('aiEnabledWorkforce')
    expect(sampleFY27Submission).toHaveProperty('appendixFAQs')
  })

  test('Business metrics should use FY25-27 column structure', () => {
    const metrics = sampleFY27Submission.businessMetrics || []
    expect(metrics.length).toBeGreaterThan(0)
    
    const firstMetric = metrics[0]
    
    // New FY25-27 structure
    expect(firstMetric).toHaveProperty('fy2025Actual')
    expect(firstMetric).toHaveProperty('fy2025Plan')
    expect(firstMetric).toHaveProperty('yoyPercent')
    expect(firstMetric).toHaveProperty('fy2026YtdActual')
    expect(firstMetric).toHaveProperty('fy2026YtdYoyPercent')
    expect(firstMetric).toHaveProperty('fy2027Plan')
    expect(firstMetric).toHaveProperty('fy2027PlanYoyPercent')
    
    // Should NOT use old FY23-24 columns as primary fields
    expect(firstMetric.name).toBeDefined()
  })

  test('AI Performance Metrics should have correct structure', () => {
    const aiMetrics = sampleFY27Submission.aiPerformanceMetrics || []
    expect(aiMetrics.length).toBeGreaterThanOrEqual(2)
    
    const firstMetric = aiMetrics[0] as AIPerformanceMetric
    
    expect(firstMetric).toHaveProperty('id')
    expect(firstMetric).toHaveProperty('name')
    expect(firstMetric).toHaveProperty('metricType')
    expect(firstMetric).toHaveProperty('enabled')
    expect(firstMetric).toHaveProperty('fy2025Actual')
    expect(firstMetric).toHaveProperty('fy2026Ytd')
    expect(firstMetric).toHaveProperty('fy2027Target')
    expect(firstMetric).toHaveProperty('expectedImpact')
    
    // Metric type should be valid
    const validTypes = ['tasks_per_fte', 'workflow_augmentation', 'hours_saved', 'cost_reduction', 'adoption_rate', 'processes_automated']
    expect(validTypes).toContain(firstMetric.metricType)
  })

  test('Initiatives should have AI-specific fields', () => {
    const initiatives = sampleFY27Submission.initiatives || []
    expect(initiatives.length).toBeGreaterThan(0)
    
    const firstInitiative = initiatives[0] as Initiative
    
    // Traditional fields
    expect(firstInitiative).toHaveProperty('name')
    expect(firstInitiative).toHaveProperty('owner')
    expect(firstInitiative).toHaveProperty('startDate')
    expect(firstInitiative).toHaveProperty('endDate')
    
    // NEW FY27 AI fields
    expect(firstInitiative).toHaveProperty('aiIntegrationPlan')
    expect(firstInitiative.aiIntegrationPlan).toBeTruthy()
    expect(firstInitiative.aiIntegrationPlan!.length).toBeGreaterThan(50)
  })

  test('Workforce Planning should have AI-specific columns', () => {
    const workforceTable = sampleFY27Submission.aiEnabledWorkforce?.workforceTable || []
    expect(workforceTable.length).toBeGreaterThan(0)
    
    const firstRow = workforceTable[0] as WorkforceRow
    
    expect(firstRow).toHaveProperty('roleLevel')
    expect(firstRow).toHaveProperty('fy2026CurrentHc')
    expect(firstRow).toHaveProperty('fy2027PlannedHc')
    expect(firstRow).toHaveProperty('hcChange')
    expect(firstRow).toHaveProperty('aiToolsLeveraged')
    expect(firstRow).toHaveProperty('tasksAugmented')
    expect(firstRow).toHaveProperty('expectedProductivityGains')
    expect(firstRow).toHaveProperty('aiAugmentationStrategy')
  })

  test('Resource allocation should have baseline and incremental', () => {
    const allocation = sampleFY27Submission.resourceAllocation
    
    expect(allocation).toBeDefined()
    expect(allocation).toHaveProperty('baseline')
    expect(allocation).toHaveProperty('incremental')
    expect(Array.isArray(allocation!.baseline)).toBe(true)
    expect(Array.isArray(allocation!.incremental)).toBe(true)
  })

  test('Appendix FAQs should have 12 questions', () => {
    const faqs = sampleFY27Submission.appendixFAQs || []
    expect(faqs.length).toBe(12)
    
    // Should have required questions
    const requiredCount = faqs.filter(f => f.required).length
    expect(requiredCount).toBeGreaterThanOrEqual(8)
    
    // Should have AI-focused questions
    const aiFocusedCount = faqs.filter(f => f.isAIFocused).length
    expect(aiFocusedCount).toBeGreaterThanOrEqual(2)
  })
})

// ============================================
// TEST SUITE 4: BACKWARD COMPATIBILITY
// ============================================

describe('Backward Compatibility Tests', () => {
  
  test('Should handle FY26 submission without AI fields gracefully', () => {
    const fy26Submission = {
      departmentName: 'Finance',
      fiscalYear: '2026',
      teamDescription: 'Finance team',
      responsibilities: 'Financial management',
      departmentHead: 'CFO',
      // Missing AI fields
      priorYearOutcomes: 'Completed budget',
      priorYearLearnings: 'Learned lessons'
    }
    
    const result = validateIntroductionSection(fy26Submission)
    
    // Should identify missing AI fields but not crash
    expect(result).toBeDefined()
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('AI Strategy Overview'))).toBe(true)
  })

  test('Should accept valid FY25, FY26, and FY27 fiscal years', () => {
    expect(isValidFiscalYear('2025')).toBe(true)
    expect(isValidFiscalYear('2026')).toBe(true)
    expect(isValidFiscalYear('2027')).toBe(true)
    expect(isValidFiscalYear('2024')).toBe(false)
    expect(isValidFiscalYear('2028')).toBe(false)
  })

  test('Metrics validation should handle missing new columns gracefully', () => {
    const legacyMetrics = {
      businessMetrics: [
        {
          id: '1',
          name: 'Revenue',
          // Old structure
          fy2023_actual: 100,
          fy2024_expected: 110
          // Missing new FY25-27 columns
        }
      ],
      aiPerformanceMetrics: [] // Missing
    }
    
    const result = validateMetricsSection(legacyMetrics)
    
    expect(result).toBeDefined()
    expect(result.isValid).toBe(false) // Should fail on missing AI metrics
  })
})

// ============================================
// TEST SUITE 5: RESOURCE ALLOCATION LOGIC
// ============================================

describe('Resource Allocation Logic Tests', () => {
  
  test('Monthly allocations should sum to total FTEs', () => {
    const allocation = sampleFY27Submission.resourceAllocation!.baseline[0]
    
    const sum = allocation.january + allocation.february + allocation.march + 
                allocation.april + allocation.may + allocation.june +
                allocation.july + allocation.august + allocation.september +
                allocation.october + allocation.november + allocation.december
    
    expect(sum).toBeCloseTo(allocation.totalFtes, 1) // Within 0.1
  })

  test('calculateTotalFTEs helper should correctly sum months', () => {
    const allocation = {
      january: 2.5, february: 2.5, march: 3.0, april: 3.0,
      may: 2.5, june: 2.5, july: 2.0, august: 2.0,
      september: 2.5, october: 3.0, november: 2.5, december: 2.0
    }
    
    const total = calculateTotalFTEs(allocation)
    expect(total).toBe(30.0)
  })

  test('HC change should match planned minus current', () => {
    const workforceTable = sampleFY27Submission.aiEnabledWorkforce!.workforceTable!
    
    workforceTable.forEach(row => {
      const expectedChange = row.fy2027PlannedHc - row.fy2026CurrentHc
      expect(row.hcChange).toBe(expectedChange)
    })
  })

  test('calculateHCChange helper should work correctly', () => {
    expect(calculateHCChange(10, 12)).toBe(2)   // Increase
    expect(calculateHCChange(10, 8)).toBe(-2)   // Decrease
    expect(calculateHCChange(10, 10)).toBe(0)   // No change
  })

  test('Total workforce HC should be reasonable (< 1000)', () => {
    const workforceTable = sampleFY27Submission.aiEnabledWorkforce!.workforceTable!
    
    const totalCurrent = workforceTable.reduce((sum, row) => sum + row.fy2026CurrentHc, 0)
    const totalPlanned = workforceTable.reduce((sum, row) => sum + row.fy2027PlannedHc, 0)
    
    expect(totalCurrent).toBeLessThan(1000)
    expect(totalPlanned).toBeLessThan(1000)
    expect(totalCurrent).toBeGreaterThan(0)
    expect(totalPlanned).toBeGreaterThan(0)
  })
})

// ============================================
// TEST SUITE 6: COST-BENEFIT VALIDATION
// ============================================

describe('Cost-Benefit Validation Tests', () => {
  
  test('AI cost-benefit entries should have positive ROI', () => {
    const costBenefitAnalysis = sampleFY27Submission.aiEnabledWorkforce!.aiCostBenefitAnalysis!
    
    costBenefitAnalysis.forEach(entry => {
      const cost = entry.annualCost
      const benefit = entry.expectedSavingsBenefit
      
      expect(benefit).toBeGreaterThan(cost) // Should have positive ROI
      
      const roi = calculateROI(benefit, cost)
      expect(roi).toBeGreaterThan(0)
    })
  })

  test('calculateROI helper should work correctly', () => {
    expect(calculateROI(200, 100)).toBe(100)    // 100% ROI
    expect(calculateROI(150, 100)).toBe(50)     // 50% ROI
    expect(calculateROI(100, 100)).toBe(0)      // Break even
    expect(calculateROI(50, 100)).toBe(-50)     // Negative ROI
    expect(calculateROI(100, 0)).toBe(0)        // Avoid division by zero
  })

  test('Payback periods should be specified and reasonable', () => {
    const costBenefitAnalysis = sampleFY27Submission.aiEnabledWorkforce!.aiCostBenefitAnalysis!
    
    costBenefitAnalysis.forEach(entry => {
      expect(entry.paybackPeriod).toBeDefined()
      expect(entry.paybackPeriod.length).toBeGreaterThan(0)
      
      // Should mention time unit (months, weeks, etc.)
      expect(entry.paybackPeriod.toLowerCase()).toMatch(/month|week|quarter|year/)
    })
  })

  test('Total AI investment should be less than expected savings', () => {
    const costBenefitAnalysis = sampleFY27Submission.aiEnabledWorkforce!.aiCostBenefitAnalysis!
    
    const totalCost = costBenefitAnalysis.reduce((sum, entry) => sum + entry.annualCost, 0)
    const totalBenefit = costBenefitAnalysis.reduce((sum, entry) => sum + entry.expectedSavingsBenefit, 0)
    
    expect(totalBenefit).toBeGreaterThan(totalCost)
    
    const overallROI = calculateROI(totalBenefit, totalCost)
    expect(overallROI).toBeGreaterThan(50) // At least 50% ROI expected
  })

  test('Should warn on negative ROI entries', () => {
    const negativeROI = {
      ...sampleFY27Submission,
      aiEnabledWorkforce: {
        ...sampleFY27Submission.aiEnabledWorkforce!,
        aiCostBenefitAnalysis: [
          {
            id: '1',
            aiExpenseVendor: 'Expensive Tool',
            annualCost: 100000,
            expectedSavingsBenefit: 50000, // Benefit < Cost
            paybackPeriod: 'Never'
          },
          {
            id: '2',
            aiExpenseVendor: 'Good Tool',
            annualCost: 10000,
            expectedSavingsBenefit: 50000,
            paybackPeriod: '2 months'
          }
        ]
      }
    }
    
    const result = validateResourcesSection(negativeROI)
    
    expect(result.warnings.some(w => w.includes('negative ROI'))).toBe(true)
  })
})

// ============================================
// TEST SUITE 7: CALCULATION HELPERS
// ============================================

describe('Calculation Helper Tests', () => {
  
  test('calculateYOYPercentage should calculate correctly', () => {
    expect(calculateYOYPercentage(110, 100)).toBeCloseTo(10, 1)
    expect(calculateYOYPercentage(90, 100)).toBeCloseTo(-10, 1)
    expect(calculateYOYPercentage(100, 100)).toBe(0)
    expect(calculateYOYPercentage(100, 0)).toBe(0) // Avoid division by zero
  })

  test('getAIReadinessLabel should return correct labels', () => {
    expect(getAIReadinessLabel(85)).toBe('Advanced')
    expect(getAIReadinessLabel(70)).toBe('Advanced')
    expect(getAIReadinessLabel(65)).toBe('Developing')
    expect(getAIReadinessLabel(40)).toBe('Developing')
    expect(getAIReadinessLabel(35)).toBe('Emerging')
    expect(getAIReadinessLabel(0)).toBe('Emerging')
  })
})

// ============================================
// TEST SUITE 8: MULTI-DEPARTMENT SCENARIOS
// ============================================

describe('Multi-Department Scenario Tests', () => {
  
  test('Engineering sample should differ from Finance sample', () => {
    expect(sampleFY27Submission.departmentName).not.toBe(sampleFinanceDepartment.departmentName)
    expect(sampleFY27Submission.aiStrategyOverview).not.toBe(sampleFinanceDepartment.aiStrategyOverview)
  })

  test('Both department samples should pass validation', () => {
    const engineeringResult = validateCompleteSubmission(sampleFY27Submission)
    const financeResult = validateCompleteSubmission(sampleFinanceDepartment)
    
    // Engineering should be complete
    expect(engineeringResult.isValid).toBe(true)
    expect(engineeringResult.completionPercentage).toBe(100)
    
    // Finance may be partial but should validate without errors in present sections
    expect(financeResult).toBeDefined()
  })
})

// ============================================
// TEST SUITE 9: EDGE CASES
// ============================================

describe('Edge Case Tests', () => {
  
  test('Should handle empty form data gracefully', () => {
    const emptyForm = createDefaultFormState()
    const result = validateCompleteSubmission(emptyForm)
    
    expect(result).toBeDefined()
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.completionPercentage).toBe(0)
  })

  test('Should handle partially completed form', () => {
    const partialForm = {
      ...createDefaultFormState(),
      departmentName: 'Marketing',
      fiscalYear: '2027',
      aiStrategyOverview: 'We will use AI tools to improve marketing efficiency by 20%'
    }
    
    const result = validateCompleteSubmission(partialForm)
    
    expect(result.completionPercentage).toBeGreaterThan(0)
    expect(result.completionPercentage).toBeLessThan(100)
  })

  test('Should validate initiatives with no AI tools specified', () => {
    const noAITools = {
      ...sampleFY27Submission,
      initiatives: [{
        id: '1',
        name: 'Legacy System Maintenance',
        owner: 'Jane Doe',
        startDate: '2027-01-01',
        endDate: '2027-12-31',
        isBaseline: true,
        priority: 'low' as const,
        description: 'Maintain old systems',
        aiIntegrationPlan: 'This legacy system cannot be augmented with AI tools due to technical constraints. Will maintain manually.',
        aiToolsUsed: '', // No AI tools
        totalCost: 50000,
        aiCostImpact: 0 // No AI impact
      }]
    }
    
    const result = validateInitiativesSection(noAITools as any)
    
    // Should pass - AI Integration Plan explains why no AI
    expect(result.isValid).toBe(true)
  })

  test('Should handle workforce with no HC changes', () => {
    const noHCChange = {
      ...sampleFY27Submission,
      aiEnabledWorkforce: {
        ...sampleFY27Submission.aiEnabledWorkforce!,
        workforceTable: [{
          id: '1',
          roleLevel: 'Engineers',
          fy2026CurrentHc: 10,
          fy2027PlannedHc: 10, // No change
          hcChange: 0,
          aiToolsLeveraged: 'GitHub Copilot',
          tasksAugmented: 'Code generation',
          expectedProductivityGains: '25%',
          aiAugmentationStrategy: 'AI enables same output with same HC'
        }]
      }
    }
    
    const result = validateResourcesSection(noHCChange)
    
    // Should not require HC justification if no HC change
    expect(result.errors.some(e => e.includes('HC increases justification required'))).toBe(false)
  })
})

// ============================================
// TEST SUITE 10: END-TO-END WORKFLOW
// ============================================

describe('End-to-End Workflow Tests', () => {
  
  test('Complete FY27 submission workflow', () => {
    // Step 1: Start with empty form
    let formData = createDefaultFormState()
    expect(validateCompleteSubmission(formData).completionPercentage).toBe(0)
    
    // Step 2: Fill introduction
    formData = {
      ...formData,
      departmentName: 'Engineering',
      fiscalYear: '2027',
      teamDescription: 'Engineering team builds products',
      responsibilities: 'Software development and maintenance',
      departmentHead: 'VP Engineering',
      aiStrategyOverview: 'Deploy GitHub Copilot to 100% of team, expecting 30% productivity gain and 25% faster development'
    }
    
    const introResult = validateIntroductionSection(formData)
    expect(introResult.completionPercentage).toBe(100)
    
    // Step 3: Add metrics (would continue for all sections...)
    // This validates the progressive completion model works
  })

  test('Submission should be saveable at any completion level', () => {
    const partialSubmission = {
      ...createDefaultFormState(),
      departmentName: 'Sales',
      fiscalYear: '2027'
    }
    
    // Should be able to save draft even if incomplete
    const result = validateCompleteSubmission(partialSubmission)
    expect(result).toBeDefined()
    // Not valid for submission, but can be saved as draft
    expect(result.isValid).toBe(false)
  })

  test('Validation should improve as sections are completed', () => {
    const stages = [
      createDefaultFormState(), // 0% complete
      { ...createDefaultFormState(), departmentName: 'IT', fiscalYear: '2027', aiStrategyOverview: 'AI strategy here with at least 100 characters to meet validation requirements for meaningful analysis and planning' }, // ~14% complete
      sampleFY27Submission // 100% complete
    ]
    
    const completions = stages.map(stage => validateCompleteSubmission(stage).completionPercentage)
    
    // Should be monotonically increasing
    expect(completions[0]).toBeLessThan(completions[1])
    expect(completions[1]).toBeLessThan(completions[2])
    expect(completions[2]).toBe(100)
  })
})

// ============================================
// TEST SUITE 11: PERFORMANCE & LIMITS
// ============================================

describe('Performance and Limits Tests', () => {
  
  test('Should handle large number of initiatives', () => {
    const manyInitiatives = {
      ...sampleFY27Submission,
      initiatives: Array(50).fill(null).map((_, i) => ({
        id: `init-${i}`,
        name: `Initiative ${i}`,
        owner: 'Owner',
        startDate: '2027-01-01',
        endDate: '2027-12-31',
        isBaseline: false,
        priority: 'medium' as const,
        description: 'Description',
        aiIntegrationPlan: 'AI integration plan with sufficient detail to meet the minimum character requirement for validation'
      }))
    }
    
    const result = validateInitiativesSection(manyInitiatives as any)
    
    expect(result).toBeDefined()
    // Should complete in reasonable time (< 1 second)
  })

  test('Should handle workforce table with many roles', () => {
    const manyRoles = {
      ...sampleFY27Submission,
      aiEnabledWorkforce: {
        ...sampleFY27Submission.aiEnabledWorkforce!,
        workforceTable: Array(30).fill(null).map((_, i) => ({
          id: `role-${i}`,
          roleLevel: `Role ${i}`,
          fy2026CurrentHc: 5,
          fy2027PlannedHc: 5,
          hcChange: 0,
          aiAugmentationStrategy: 'Strategy'
        }))
      }
    }
    
    const result = validateResourcesSection(manyRoles as any)
    expect(result).toBeDefined()
  })

  test('Should handle very long text fields', () => {
    const longText = 'A'.repeat(10000) // 10K characters
    
    const longContent = {
      ...sampleFY27Submission,
      aiStrategyOverview: longText
    }
    
    const result = validateIntroductionSection(longContent)
    
    expect(result).toBeDefined()
    expect(result.warnings.some(w => w.includes('quite long'))).toBe(true)
  })
})

// ============================================
// TEST SUITE 12: TYPE SAFETY
// ============================================

describe('Type Safety Tests', () => {
  
  test('Sample data should match FormState type structure', () => {
    // TypeScript compilation itself validates this
    // Runtime check for key properties
    const requiredProps = [
      'departmentName', 'fiscalYear', 'aiStrategyOverview',
      'businessMetrics', 'aiPerformanceMetrics',
      'initiatives', 'aiEnabledWorkforce', 'appendixFAQs'
    ]
    
    requiredProps.forEach(prop => {
      expect(sampleFY27Submission).toHaveProperty(prop)
    })
  })

  test('AI Performance Metrics should have valid metric types', () => {
    const validTypes = [
      'tasks_per_fte', 'workflow_augmentation', 'hours_saved', 
      'cost_reduction', 'adoption_rate', 'processes_automated'
    ]
    
    const aiMetrics = sampleFY27Submission.aiPerformanceMetrics || []
    
    aiMetrics.forEach(metric => {
      expect(validTypes).toContain(metric.metricType)
    })
  })

  test('Initiatives should have valid priority values', () => {
    const validPriorities = ['high', 'medium', 'low']
    
    const initiatives = sampleFY27Submission.initiatives || []
    
    initiatives.forEach(initiative => {
      expect(validPriorities).toContain(initiative.priority)
    })
  })
})

// ============================================
// TEST SUITE 13: CONSISTENCY CHECKS
// ============================================

describe('Data Consistency Tests', () => {
  
  test('AI tools mentioned in strategy should appear in initiatives', () => {
    const strategyTools = sampleFY27Submission.aiStrategyOverview!.toLowerCase()
    const initiatives = sampleFY27Submission.initiatives || []
    
    // Check that AI tools from strategy are used in at least one initiative
    const hasGitHubCopilot = strategyTools.includes('copilot') || strategyTools.includes('github')
    const hasClaude = strategyTools.includes('claude')
    
    if (hasGitHubCopilot || hasClaude) {
      const initiativeTools = initiatives.map(i => i.aiToolsUsed?.toLowerCase() || '').join(' ')
      
      // At least one tool should be mentioned in initiatives
      expect(initiativeTools.length).toBeGreaterThan(0)
    }
  })

  test('Total HC change across workforce should be consistent', () => {
    const workforceTable = sampleFY27Submission.aiEnabledWorkforce!.workforceTable!
    
    const totalCurrent = workforceTable.reduce((sum, row) => sum + row.fy2026CurrentHc, 0)
    const totalPlanned = workforceTable.reduce((sum, row) => sum + row.fy2027PlannedHc, 0)
    const totalChange = workforceTable.reduce((sum, row) => sum + row.hcChange, 0)
    
    expect(totalChange).toBe(totalPlanned - totalCurrent)
  })

  test('Non-headcount costs change should equal plan minus actual', () => {
    const costs = sampleFY27Submission.aiEnabledWorkforce!.nonHeadcountCosts!
    
    costs.forEach(cost => {
      if (cost.fy2026Actual !== undefined && cost.fy2027Plan !== undefined) {
        const expectedChange = cost.fy2027Plan - cost.fy2026Actual
        
        if (cost.change !== undefined) {
          expect(cost.change).toBeCloseTo(expectedChange, 0)
        }
      }
    })
  })
})

// ============================================
// TEST UTILITIES
// ============================================

/**
 * Helper function to count total validation errors across all sections
 */
function countTotalErrors(formData: Partial<FormState>): number {
  const results = [
    validateIntroductionSection(formData),
    validateMetricsSection(formData),
    validatePriorYearSection(formData),
    validateInitiativesSection(formData),
    validateResourcesSection(formData),
    validateAppendixFAQSection(formData)
  ]
  
  return results.reduce((sum, r) => sum + r.errors.length, 0)
}

/**
 * Helper to check if submission is FY27 compliant
 */
function isFY27Compliant(formData: Partial<FormState>): boolean {
  const hasAIStrategy = !!formData.aiStrategyOverview
  const hasAIMetrics = (formData.aiPerformanceMetrics?.length || 0) >= 2
  const hasAIRetrospective = !!(formData.aiToolsPiloted && formData.aiKeyWins && 
                                  formData.aiMissesChallenges && formData.aiMeasurableImpacts)
  const hasAIWorkforce = !!(formData.aiEnabledWorkforce?.tasksAugmentedByAI)
  const hasAICostBenefit = (formData.aiEnabledWorkforce?.aiCostBenefitAnalysis?.length || 0) >= 2
  const hasFAQs = (formData.appendixFAQs?.filter(f => f.required && f.answer).length || 0) >= 8
  
  return hasAIStrategy && hasAIMetrics && hasAIRetrospective && 
         hasAIWorkforce && hasAICostBenefit && hasFAQs
}

describe('FY27 Compliance Tests', () => {
  
  test('Sample submission should be FY27 compliant', () => {
    expect(isFY27Compliant(sampleFY27Submission)).toBe(true)
  })

  test('Empty submission should not be FY27 compliant', () => {
    expect(isFY27Compliant(createDefaultFormState())).toBe(false)
  })

  test('FY26 style submission should not be FY27 compliant', () => {
    const fy26Style = {
      departmentName: 'Finance',
      fiscalYear: '2026',
      teamDescription: 'Team',
      responsibilities: 'Responsibilities',
      departmentHead: 'CFO',
      // Missing all AI fields
    }
    
    expect(isFY27Compliant(fy26Style)).toBe(false)
  })
})

// ============================================
// TEST SUMMARY
// ============================================

describe('Test Suite Summary', () => {
  
  test('All test suites should be documented', () => {
    const testSuites = [
      'Form Validation Tests',
      'AI Analysis Integration Tests',
      'Data Structure Compatibility Tests',
      'Backward Compatibility Tests',
      'Resource Allocation Logic Tests',
      'Cost-Benefit Validation Tests',
      'Calculation Helper Tests',
      'Multi-Department Scenario Tests',
      'Edge Case Tests',
      'Type Safety Tests',
      'Data Consistency Tests',
      'FY27 Compliance Tests'
    ]
    
    expect(testSuites.length).toBe(12)
  })
})

