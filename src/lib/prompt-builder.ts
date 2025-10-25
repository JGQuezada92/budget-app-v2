/**
 * Dynamic Prompt Builder
 * Constructs the AI analysis prompt using the customizable framework
 */

import { loadFramework, type PromptFramework } from './prompt-framework'
import type { AnalysisRequest } from './ai-analysis'

export function buildDynamicPrompt(request: AnalysisRequest): string {
  const framework = loadFramework()
  
  // Extract data from request
  const aiStrategyOverview = request.aopFormData.aiStrategyOverview || 'Not provided'
  const businessMetrics = request.aopFormData.businessMetrics || []
  const aiPerformanceMetrics = request.aopFormData.aiPerformanceMetrics || []
  const initiatives = request.aopFormData.initiatives || []
  const aiWorkforce = request.aopFormData.aiEnabledWorkforce || {}
  const appendixFAQs = request.aopFormData.appendixFAQs || []
  const teamDescription = request.aopFormData.teamDescription || 'Not provided'
  const responsibilities = request.aopFormData.responsibilities || 'Not provided'
  const departmentHead = request.aopFormData.departmentHead || 'Not provided'
  const aiToolsPiloted = request.aopFormData.aiToolsPiloted || 'Not provided'
  const aiKeyWins = request.aopFormData.aiKeyWins || 'Not provided'
  const aiMissesChallenges = request.aopFormData.aiMissesChallenges || 'Not provided'
  const aiMeasurableImpacts = request.aopFormData.aiMeasurableImpacts || 'Not provided'
  const performanceAnalysis = request.aopFormData.performanceAnalysis || 'Not provided'
  const priorYearOutcomes = request.aopFormData.priorYearOutcomes || 'Not provided'

  return `You are an expert FP&A (Financial Planning & Analysis) analyst with deep expertise in AI strategy and digital transformation, providing comprehensive budget analysis for the ${request.departmentName} department's FY${request.fiscalYear} AOP submission.

⚠️ CRITICAL INSTRUCTION: This analysis is for the ${request.departmentName} department. You MUST:
- Use ONLY the actual data, metrics, and initiatives from the ${request.departmentName} department provided below
- Tailor ALL analysis, insights, and recommendations specifically to the ${request.departmentName} function
- Reference the ACTUAL department name "${request.departmentName}" throughout your analysis
- Focus on KPIs and metrics relevant to ${request.departmentName}

═══════════════════════════════════════════════════════════════════════
ANALYSIS FRAMEWORK - ${Object.keys(framework.dimensions).length} DIMENSIONS
═══════════════════════════════════════════════════════════════════════

${buildDimensionsSection(framework, request)}

═══════════════════════════════════════════════════════════════════════
📋 DEPARTMENT-SPECIFIC SUBMISSION DATA
═══════════════════════════════════════════════════════════════════════

${buildSubmissionDataSection(request, {
  departmentHead,
  teamDescription,
  responsibilities,
  aiStrategyOverview,
  businessMetrics,
  aiPerformanceMetrics,
  performanceAnalysis,
  priorYearOutcomes,
  aiToolsPiloted,
  aiKeyWins,
  aiMeasurableImpacts,
  initiatives,
  aiWorkforce,
  appendixFAQs
})}

${buildFocusAreasSection(framework, request)}

${buildDepartmentGuidelinesSection(framework, request)}

═══════════════════════════════════════════════════════════════════════
OUTPUT REQUIREMENTS
═══════════════════════════════════════════════════════════════════════

Provide comprehensive analysis with these EXACT sections:

${buildOutputRequirementsSection(framework, request)}

═══════════════════════════════════════════════════════════════════════
ANALYSIS PRINCIPLES
═══════════════════════════════════════════════════════════════════════

${framework.principles.map(p => `✓ ${p}`).join('\n')}

═══════════════════════════════════════════════════════════════════════
🔴 FINAL CRITICAL REMINDER 🔴
═══════════════════════════════════════════════════════════════════════

This is an analysis for ${request.departmentName} department. Your response MUST:
✅ Use only data from ${request.departmentName} department's actual submission
✅ Reference "${request.departmentName}" by name throughout the analysis
✅ Suggest KPIs appropriate for ${request.departmentName} function
✅ Tailor AI strategy feedback to ${request.departmentName} workflows
❌ DO NOT use examples from other department types
❌ DO NOT invent or assume data that wasn't submitted

🎯 DEPARTMENT BEING ANALYZED: ${request.departmentName}

📊 ACTUAL BUSINESS METRICS SUBMITTED:
${businessMetrics.length > 0 ? businessMetrics.map((m: any) => `   • ${m.name || 'Unnamed metric'}`).join('\n') : '   • No business metrics submitted'}

🤖 ACTUAL AI PERFORMANCE METRICS SUBMITTED:
${aiPerformanceMetrics.length > 0 ? aiPerformanceMetrics.map((m: any) => `   • ${m.name || 'Unnamed metric'}`).join('\n') : '   • No AI metrics submitted'}

🎯 ACTUAL INITIATIVES SUBMITTED:
${initiatives.length > 0 ? initiatives.map((i: any) => `   • ${i.name || 'Unnamed initiative'}`).join('\n') : '   • No initiatives submitted'}

Format response as a JSON object with these exact keys: summary, insights, recommendations, risks, opportunities, kpiSuggestions, aiReadinessScore, confidenceScore

Each array element must follow the specified format. Be thorough but concise.`
}

function buildDimensionsSection(framework: PromptFramework, request: AnalysisRequest): string {
  return Object.entries(framework.dimensions)
    .map(([key, dim]) => `
═══════════════════════════════════════════════════════════════════════
${dim.name.toUpperCase()} (Weight: ${dim.weight}%)
═══════════════════════════════════════════════════════════════════════

${dim.description}

REQUIRED ANALYSIS:
${dim.instructions.map(i => `- ${i}`).join('\n')}
`).join('\n')
}

function buildSubmissionDataSection(request: AnalysisRequest, data: any): string {
  return `
SECTION 1: DEPARTMENT INFORMATION
──────────────────────────────────
Department Name: ${request.departmentName}
Fiscal Year: FY${request.fiscalYear}
Department Head: ${data.departmentHead}

Team Description:
${data.teamDescription}

Responsibilities:
${data.responsibilities}

AI Strategy Overview:
${data.aiStrategyOverview}

SECTION 2: BUSINESS & AI PERFORMANCE METRICS
──────────────────────────────────────────────

📊 Business Metrics Submitted: ${data.businessMetrics.length} metrics
${data.businessMetrics.length > 0 ? data.businessMetrics.map((m: any, idx: number) => `
${idx + 1}. ${m.name || 'Unnamed'}
   - FY2025 Actual: ${m.fy2025Actual || 'N/A'}
   - FY2025 Plan: ${m.fy2025Plan || 'N/A'}
   - FY2026 YTD Actual: ${m.fy2026YtdActual || 'N/A'}
   - FY2027 Plan: ${m.fy2027Plan || 'N/A'}
   - YOY %: ${m.yoyPercent || 'N/A'}%`).join('\n') : '   No business metrics submitted'}

🤖 AI Performance Metrics Submitted: ${data.aiPerformanceMetrics.length} metrics
${data.aiPerformanceMetrics.length > 0 ? data.aiPerformanceMetrics.map((m: any, idx: number) => `
${idx + 1}. ${m.name || 'Unnamed'}
   - FY2025 Actual: ${m.fy2025Actual || 'N/A'}
   - FY2026 YTD: ${m.fy2026Ytd || 'N/A'}
   - FY2027 Target: ${m.fy2027Target || 'N/A'}
   - Expected Impact: ${m.expectedImpact || 'N/A'}`).join('\n') : '   No AI metrics submitted'}

SECTION 3: PRIOR YEAR PERFORMANCE (FY26)
─────────────────────────────────────────

Performance Analysis:
${data.performanceAnalysis}

Prior Year Outcomes:
${data.priorYearOutcomes}

AI Tools Piloted in FY26:
${data.aiToolsPiloted}

AI Key Wins:
${data.aiKeyWins}

AI Measurable Impacts:
${data.aiMeasurableImpacts}

SECTION 4: KEY INITIATIVES FOR FY27
────────────────────────────────────

Total Initiatives Submitted: ${data.initiatives.length}
${data.initiatives.length > 0 ? data.initiatives.map((init: any, idx: number) => `
${idx + 1}. ${init.name || 'Unnamed Initiative'}
   Description: ${init.description || 'N/A'}
   AI Integration Plan: ${init.aiIntegrationPlan || 'N/A'}
   Total Cost: $${init.totalCost || 'N/A'}
   AI Cost Impact: ${init.aiCostImpact || 'N/A'}
   Type: ${init.isBaseline ? 'Baseline' : 'Incremental'}`).join('\n') : '   No initiatives submitted'}

SECTION 5: AI-ENABLED WORKFORCE PLANNING
─────────────────────────────────────────

Tasks Augmented by AI:
${data.aiWorkforce.tasksAugmentedByAI || 'Not provided'}

Expected Productivity Improvement:
${data.aiWorkforce.expectedProductivityImprovement || 'Not provided'}

Skills Development Needed:
${data.aiWorkforce.skillsDevelopmentNeeded || 'Not provided'}

HC Justification (if applicable):
${data.aiWorkforce.hcIncreasesJustificationResources || 'Not provided'}

Workforce Planning Table: ${data.aiWorkforce.workforceTable?.length || 0} roles defined
AI Cost-Benefit Analysis: ${data.aiWorkforce.aiCostBenefitAnalysis?.length || 0} entries

SECTION 7: STRATEGIC FAQ RESPONSES
───────────────────────────────────

${data.appendixFAQs.slice(0, 5).map((faq: any, idx: number) => `Q${idx + 1}: ${faq.question}
A${idx + 1}: ${faq.answer || 'Not answered'}`).join('\n\n')}

HISTORICAL FINANCIAL DATA (Uploaded):
${request.historicalData.length > 0 ? JSON.stringify(request.historicalData, null, 2) : 'No historical data uploaded'}

BUDGET/FORECAST DATA (Uploaded):
${request.budgetData.length > 0 ? JSON.stringify(request.budgetData, null, 2) : 'No budget data uploaded'}
`
}

function buildFocusAreasSection(framework: PromptFramework, request: AnalysisRequest): string {
  const enabledFocusAreas = framework.focusAreas.filter(fa => fa.enabled)
  
  if (enabledFocusAreas.length === 0) {
    return ''
  }

  return `
═══════════════════════════════════════════════════════════════════════
SPECIFIC FOCUS AREAS FOR ${request.departmentName.toUpperCase()}
═══════════════════════════════════════════════════════════════════════

${enabledFocusAreas.map((fa, idx) => `
${idx + 1}. ${fa.name.toUpperCase()}:
   ${fa.description}
   
   Evaluation Criteria:
${fa.evaluationCriteria.map(c => `   ✓ ${c}`).join('\n')}
`).join('\n')}
`
}

function buildDepartmentGuidelinesSection(framework: PromptFramework, request: AnalysisRequest): string {
  const guidelines = framework.departmentGuidelines[request.departmentName]
  
  if (!guidelines || guidelines.length === 0) {
    return `
═══════════════════════════════════════════════════════════════════════
📋 DEPARTMENT-SPECIFIC FOCUS
═══════════════════════════════════════════════════════════════════════

FOR ${request.departmentName.toUpperCase()} DEPARTMENT - Focus on:
   • Core operational metrics relevant to ${request.departmentName} function
   • Efficiency and productivity KPIs specific to ${request.departmentName}
   • AI tools appropriate for ${request.departmentName} workflows
   • Cost reduction and process improvement in ${request.departmentName} operations
   • Industry-standard metrics for ${request.departmentName} departments
`
  }

  return `
═══════════════════════════════════════════════════════════════════════
📋 DEPARTMENT-SPECIFIC FOCUS
═══════════════════════════════════════════════════════════════════════

FOR ${request.departmentName.toUpperCase()} DEPARTMENT - Focus on:
${guidelines.map(g => `   • ${g}`).join('\n')}
`
}

function buildOutputRequirementsSection(framework: PromptFramework, request: AnalysisRequest): string {
  return framework.outputStructure.map(out => {
    const countInfo = out.minCount || out.maxCount 
      ? ` (${out.minCount}-${out.maxCount} items)`
      : ''
    return `
${out.field}${countInfo}:
   ${out.description}
   Format: ${out.format}
`
  }).join('\n')
}

