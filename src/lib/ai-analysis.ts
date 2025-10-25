import Anthropic from '@anthropic-ai/sdk'
import type { FormState, FinancialDataRow, AIAnalysisResult, AnalysisItem, KPISuggestion } from '@/types/aop'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export interface AnalysisRequest {
  departmentName: string
  fiscalYear: string
  historicalData: FinancialDataRow[]
  budgetData: FinancialDataRow[]
  aopFormData: Partial<FormState>
  supportingDocs?: string[]
}

export interface AnalysisResult {
  summary: string
  insights: AnalysisItem[]
  recommendations: AnalysisItem[]
  risks: AnalysisItem[]
  opportunities: AnalysisItem[]
  kpiSuggestions: KPISuggestion[]
  aiReadinessScore: number
  confidenceScore: number
}

export async function analyzeSubmission(request: AnalysisRequest): Promise<AnalysisResult> {
  // Development logging
  if (process.env.NODE_ENV !== 'production') {
    console.log('═══════════════════════════════════════════════════════════════')
    console.log('🔍 AI ANALYSIS REQUEST STARTED')
    console.log('═══════════════════════════════════════════════════════════════')
    console.log(`🏢 Department: ${request.departmentName}`)
    console.log(`📅 Fiscal Year: FY${request.fiscalYear}`)
    console.log(`📊 Business Metrics Count: ${request.aopFormData.businessMetrics?.length || 0}`)
    console.log(`   Business Metric Names: ${request.aopFormData.businessMetrics?.map((m: any) => m.name || m.metricName || 'Unnamed').join(', ') || 'None'}`)
    console.log(`🤖 AI Metrics Count: ${request.aopFormData.aiPerformanceMetrics?.length || 0}`)
    console.log(`   AI Metric Names: ${request.aopFormData.aiPerformanceMetrics?.map((m: any) => m.name || m.metricName || 'Unnamed').join(', ') || 'None'}`)
    console.log(`📋 Initiatives Count: ${request.aopFormData.initiatives?.length || 0}`)
    console.log(`   Initiative Names: ${request.aopFormData.initiatives?.map((i: any) => i.name || 'Unnamed').join(', ') || 'None'}`)
    console.log(`📝 AI Strategy Length: ${request.aopFormData.aiStrategyOverview?.length || 0} characters`)
    console.log('═══════════════════════════════════════════════════════════════')
  }
  
  const prompt = buildAnalysisPrompt(request)
  
  // Log prompt details
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📏 Prompt Length: ${prompt.length} characters`)
    console.log(`🚀 Sending to Claude API...`)
  }
  
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  })

  // Log response details
  if (process.env.NODE_ENV !== 'production') {
    console.log(`✅ Received response from Claude`)
    const content = response.content[0]
    if (content.type === 'text') {
      console.log(`📏 Response Length: ${content.text.length} characters`)
    }
  }

  const content = response.content[0]
  if (content.type === 'text') {
    let result = parseAIResponse(content.text)
    
    // Log parsed result summary
    if (process.env.NODE_ENV !== 'production') {
      console.log('═══════════════════════════════════════════════════════════════')
      console.log('✨ PARSED AI RESPONSE')
      console.log('═══════════════════════════════════════════════════════════════')
      console.log(`💡 Insights: ${result.insights?.length || 0}`)
      console.log(`✅ Recommendations: ${result.recommendations?.length || 0}`)
      console.log(`⚠️  Risks: ${result.risks?.length || 0}`)
      console.log(`🎯 Opportunities: ${result.opportunities?.length || 0}`)
      console.log(`📊 KPI Suggestions: ${result.kpiSuggestions?.length || 0}`)
      console.log(`🤖 AI Readiness Score: ${result.aiReadinessScore}/100`)
      console.log(`📈 Confidence Score: ${result.confidenceScore}/100`)
      console.log('═══════════════════════════════════════════════════════════════')
    }
    
    // Validate response against submitted data
    result = validateAnalysisResponse(result, request)
    
    return result
  }

  throw new Error('Unexpected response format')
}

export function buildAnalysisPrompt(request: AnalysisRequest): string {
  // Extract FY27 specific data
  const aiStrategyOverview = request.aopFormData.aiStrategyOverview || 'Not provided'
  const businessMetrics = request.aopFormData.businessMetrics || []
  const aiPerformanceMetrics = request.aopFormData.aiPerformanceMetrics || []
  const initiatives = request.aopFormData.initiatives || []
  const aiWorkforce = request.aopFormData.aiEnabledWorkforce || {}
  const appendixFAQs = request.aopFormData.appendixFAQs || []
  
  // Introduction section data
  const teamDescription = request.aopFormData.teamDescription || 'Not provided'
  const responsibilities = request.aopFormData.responsibilities || 'Not provided'
  const departmentHead = request.aopFormData.departmentHead || 'Not provided'
  
  // AI Retrospective data
  const aiToolsPiloted = request.aopFormData.aiToolsPiloted || 'Not provided'
  const aiKeyWins = request.aopFormData.aiKeyWins || 'Not provided'
  const aiMissesChallenges = request.aopFormData.aiMissesChallenges || 'Not provided'
  const aiMeasurableImpacts = request.aopFormData.aiMeasurableImpacts || 'Not provided'
  
  // Prior year performance
  const performanceAnalysis = request.aopFormData.performanceAnalysis || 'Not provided'
  const priorYearOutcomes = request.aopFormData.priorYearOutcomes || 'Not provided'
  
  const basePrompt = `You are an expert FP&A (Financial Planning & Analysis) analyst with deep expertise in AI strategy and digital transformation, providing comprehensive budget analysis for the ${request.departmentName} department's FY${request.fiscalYear} AOP submission.

⚠️ CRITICAL INSTRUCTION: This analysis is for the ${request.departmentName} department. You MUST:
- Use ONLY the actual data, metrics, and initiatives from the ${request.departmentName} department provided below
- Tailor ALL analysis, insights, and recommendations specifically to the ${request.departmentName} function
- DO NOT use generic IT/Engineering examples (like GitHub Copilot, code quality, deployment velocity, etc.)
- DO NOT use examples from other departments unless explicitly comparing
- Reference the ACTUAL department name "${request.departmentName}" throughout your analysis
- Focus on KPIs and metrics relevant to ${request.departmentName}, not software development

═══════════════════════════════════════════════════════════════════════
ANALYSIS FRAMEWORK - THREE DIMENSIONS
═══════════════════════════════════════════════════════════════════════

You MUST analyze THREE dimensions and synthesize findings across all three:

═══════════════════════════════════════════════════════════════════════
📋 DEPARTMENT-SPECIFIC SUBMISSION DATA
═══════════════════════════════════════════════════════════════════════

SECTION 1: DEPARTMENT INFORMATION
──────────────────────────────────
Department Name: ${request.departmentName}
Fiscal Year: FY${request.fiscalYear}
Department Head: ${departmentHead}

Team Description:
${teamDescription}

Responsibilities:
${responsibilities}

AI Strategy Overview:
${aiStrategyOverview}

SECTION 2: BUSINESS & AI PERFORMANCE METRICS
──────────────────────────────────────────────

📊 Business Metrics Submitted: ${businessMetrics.length} metrics
${businessMetrics.length > 0 ? businessMetrics.map((m: any, idx: number) => `
${idx + 1}. ${m.name || 'Unnamed'}
   - FY2025 Actual: ${m.fy2025Actual || 'N/A'}
   - FY2025 Plan: ${m.fy2025Plan || 'N/A'}
   - FY2026 YTD Actual: ${m.fy2026YtdActual || 'N/A'}
   - FY2027 Plan: ${m.fy2027Plan || 'N/A'}
   - YOY %: ${m.yoyPercent || 'N/A'}%`).join('\n') : '   No business metrics submitted'}

🤖 AI Performance Metrics Submitted: ${aiPerformanceMetrics.length} metrics
${aiPerformanceMetrics.length > 0 ? aiPerformanceMetrics.map((m: any, idx: number) => `
${idx + 1}. ${m.name || 'Unnamed'}
   - FY2025 Actual: ${m.fy2025Actual || 'N/A'}
   - FY2026 YTD: ${m.fy2026Ytd || 'N/A'}
   - FY2027 Target: ${m.fy2027Target || 'N/A'}
   - Expected Impact: ${m.expectedImpact || 'N/A'}`).join('\n') : '   No AI metrics submitted'}

SECTION 3: PRIOR YEAR PERFORMANCE (FY26)
─────────────────────────────────────────

Performance Analysis:
${performanceAnalysis}

Prior Year Outcomes:
${priorYearOutcomes}

AI Tools Piloted in FY26:
${aiToolsPiloted}

AI Key Wins:
${aiKeyWins}

AI Measurable Impacts:
${aiMeasurableImpacts}

SECTION 4: KEY INITIATIVES FOR FY27
────────────────────────────────────

Total Initiatives Submitted: ${initiatives.length}
${initiatives.length > 0 ? initiatives.map((init: any, idx: number) => `
${idx + 1}. ${init.name || 'Unnamed Initiative'}
   Description: ${init.description || 'N/A'}
   AI Integration Plan: ${init.aiIntegrationPlan || 'N/A'}
   Total Cost: $${init.totalCost || 'N/A'}
   AI Cost Impact: ${init.aiCostImpact || 'N/A'}
   Type: ${init.isBaseline ? 'Baseline' : 'Incremental'}`).join('\n') : '   No initiatives submitted'}

SECTION 5: AI-ENABLED WORKFORCE PLANNING
─────────────────────────────────────────

Tasks Augmented by AI:
${aiWorkforce.tasksAugmentedByAI || 'Not provided'}

Expected Productivity Improvement:
${aiWorkforce.expectedProductivityImprovement || 'Not provided'}

Skills Development Needed:
${aiWorkforce.skillsDevelopmentNeeded || 'Not provided'}

HC Justification (if applicable):
${aiWorkforce.hcIncreasesJustificationResources || 'Not provided'}

Workforce Planning Table: ${aiWorkforce.workforceTable?.length || 0} roles defined
AI Cost-Benefit Analysis: ${aiWorkforce.aiCostBenefitAnalysis?.length || 0} entries

SECTION 7: STRATEGIC FAQ RESPONSES
───────────────────────────────────

${appendixFAQs.slice(0, 5).map((faq: any, idx: number) => `Q${idx + 1}: ${faq.question}
A${idx + 1}: ${faq.answer || 'Not answered'}`).join('\n\n')}

═══════════════════════════════════════════════════════════════════════
1. QUANTITATIVE FINANCIAL ANALYSIS
═══════════════════════════════════════════════════════════════════════

HISTORICAL FINANCIAL DATA (Uploaded):
${request.historicalData.length > 0 ? JSON.stringify(request.historicalData, null, 2) : 'No historical data uploaded'}

BUDGET/FORECAST DATA (Uploaded):
${request.budgetData.length > 0 ? JSON.stringify(request.budgetData, null, 2) : 'No budget data uploaded'}

FINANCIAL METRICS FROM SUBMISSION:
${JSON.stringify(businessMetrics, null, 2)}

REQUIRED QUANTITATIVE ANALYSIS:
- Perform variance analysis between historical actuals and planned budget
- Identify trends, anomalies, and patterns in spending/revenue
- Assess budget feasibility and realism based on historical performance
- Calculate year-over-year growth rates and evaluate reasonableness
- Analyze cost structure and efficiency ratios
- Flag any concerning variances or unrealistic projections

═══════════════════════════════════════════════════════════════════════
2. QUALITATIVE NARRATIVE ANALYSIS
═══════════════════════════════════════════════════════════════════════

AI STRATEGY OVERVIEW (Section 1):
${aiStrategyOverview}

AI RETROSPECTIVE - FY26 PERFORMANCE (Section 3):
- Tools Piloted/Adopted: ${aiToolsPiloted}
- Key Wins: ${aiKeyWins}
- Misses/Challenges: ${aiMissesChallenges}
- Measurable Impacts: ${aiMeasurableImpacts}

PRIOR YEAR PERFORMANCE ANALYSIS:
${performanceAnalysis}

PRIOR YEAR OUTCOMES:
${priorYearOutcomes}

KEY INITIATIVES (Section 4):
${JSON.stringify(initiatives.map((init: any) => ({
  name: init.name,
  description: init.description,
  aiIntegrationPlan: init.aiIntegrationPlan,
  aiToolsUsed: init.aiToolsUsed,
  totalCost: init.totalCost,
  aiCostImpact: init.aiCostImpact,
  isBaseline: init.isBaseline
})), null, 2)}

AI-ENABLED WORKFORCE PLANNING (Section 5):
- Tasks Augmented by AI: ${aiWorkforce.tasksAugmentedByAI || 'Not provided'}
- Expected Productivity Improvement: ${aiWorkforce.expectedProductivityImprovement || 'Not provided'}
- Skills Development Needed: ${aiWorkforce.skillsDevelopmentNeeded || 'Not provided'}
- HC Justification: ${aiWorkforce.hcIncreasesJustificationResources || 'Not provided'}
- Workforce Table: ${JSON.stringify(aiWorkforce.workforceTable || [], null, 2)}
- AI Cost-Benefit Analysis: ${JSON.stringify(aiWorkforce.aiCostBenefitAnalysis || [], null, 2)}

STRATEGIC FAQ RESPONSES (Section 7 - Selected Key Questions):
${appendixFAQs.slice(0, 5).map((faq: any) => `Q: ${faq.question}\nA: ${faq.answer || 'Not answered'}`).join('\n\n')}

REQUIRED QUALITATIVE ANALYSIS:
- Assess strategic alignment and logical consistency
- Evaluate depth of thinking in strategic responses
- Review AI strategy comprehensiveness and realism
- Analyze context and reasoning behind budget requests
- Evaluate quality of prior year learnings
- Assess leadership's understanding of AI opportunities

═══════════════════════════════════════════════════════════════════════
3. KPI EVALUATION & ENHANCEMENT
═══════════════════════════════════════════════════════════════════════

SELECTED BUSINESS KPIs FOR ${request.departmentName.toUpperCase()} DEPARTMENT:
${JSON.stringify(businessMetrics, null, 2)}

SELECTED AI PERFORMANCE METRICS FOR ${request.departmentName.toUpperCase()} DEPARTMENT:
${JSON.stringify(aiPerformanceMetrics, null, 2)}

REQUIRED KPI ANALYSIS (specific to ${request.departmentName} department):
- Evaluate if these are the OPTIMAL KPIs for the ${request.departmentName} function
- Determine if KPIs are leading indicators or lagging indicators for ${request.departmentName} performance
- Assess whether targets are realistic given the ${request.departmentName} department's AI augmentation plans
- Recommend ${request.departmentName}-specific KPIs for better performance tracking
- Suggest industry-standard benchmarks relevant to the ${request.departmentName} function
- Evaluate balance between ${request.departmentName} output metrics and efficiency metrics
- Check if AI metrics actually measure AI impact on ${request.departmentName} operations (not just usage)
- Consider what metrics are standard for ${request.departmentName} departments across industries

═══════════════════════════════════════════════════════════════════════
SPECIFIC FY27 FOCUS AREAS
═══════════════════════════════════════════════════════════════════════

1. AI STRATEGY EVALUATION FOR ${request.departmentName.toUpperCase()}:
   ✓ Is the ${request.departmentName} AI strategy comprehensive, specific, and realistic for this function?
   ✓ Are AI tool selections appropriate for ${request.departmentName} department's stated goals and function?
   ✓ Are productivity gain estimates realistic for ${request.departmentName} operations? (typical range: 15-30% for AI augmentation)
   ✓ Is AI adoption % target achievable given ${request.departmentName} department's current maturity?
   ✓ Does strategy show understanding of AI limitations specific to ${request.departmentName} work?
   ✓ Are the AI tools mentioned relevant to ${request.departmentName} workflows (not generic IT tools)?

2. AI-ENABLED WORKFORCE PLANNING ASSESSMENT:
   ✓ Review HC increase requests vs. AI augmentation claims (red flag if requesting HC while claiming high AI productivity gains)
   ✓ Flag HC increases that aren't justified given AI availability
   ✓ Validate HC reductions have clear AI compensation plans
   ✓ Assess if skills development plans align with AI tools mentioned
   ✓ Check if workforce planning table shows thoughtful role-by-role AI integration

3. AI COST-BENEFIT ANALYSIS VALIDATION:
   ✓ Evaluate ROI on AI tool investments - are benefits > costs?
   ✓ Check if payback periods are realistic (typically 6-18 months for AI tools)
   ✓ Compare AI costs vs. expected savings/benefits for reasonableness
   ✓ Flag if AI spending seems insufficient given ambitious stated strategy
   ✓ Assess if department is over-investing in AI without clear ROI

4. HISTORICAL PERFORMANCE CONTEXT:
   ✓ How did department perform vs. prior year targets? (use performanceAnalysis data)
   ✓ Were AI adoption barriers mentioned and addressed?
   ✓ Are FY27 targets realistic given FY26 actual performance?
   ✓ Do prior year learnings inform FY27 strategy?
   ✓ Is there evidence of learning from mistakes?

5. STRATEGIC THINKING EVALUATION (from FAQs):
   ✓ Quality of "biggest needle mover" response
   ✓ Innovation and risk-taking in "disruptive ideas"
   ✓ Competitive awareness from AI competitor analysis
   ✓ Resource allocation logic and trade-offs
   ✓ Depth of strategic thinking vs. surface-level responses

═══════════════════════════════════════════════════════════════════════
OUTPUT REQUIREMENTS
═══════════════════════════════════════════════════════════════════════

Provide comprehensive analysis with these EXACT sections:

1. **summary** (string): 2-3 paragraph executive summary for ${request.departmentName} department covering:
   - Overall budget feasibility assessment specific to ${request.departmentName} operations
   - Key concerns and strengths of the ${request.departmentName} department's submission
   - AI readiness and strategy evaluation for ${request.departmentName} function
   - Primary recommendation tailored to ${request.departmentName} department's needs
   - MUST mention the department name "${request.departmentName}" in the summary

2. **insights** (array, 5-7 insights): Critical findings across all three dimensions
   Format: [{"title": "Short insight title", "description": "Detailed explanation with specific data/numbers"}]
   Include mix of:
   - Financial variance findings
   - Strategic alignment observations  
   - AI strategy assessment
   - Performance trend analysis

3. **recommendations** (array, 5-7 specific recommendations): Actionable advice
   Format: [{"title": "Recommendation title", "description": "Detailed actionable steps"}]
   Include:
   - Budget optimization suggestions (with $ amounts where possible)
   - AI strategy improvements
   - Resource allocation adjustments
   - KPI enhancement recommendations
   - Risk mitigation actions

4. **risks** (array, 4-5 risks): Concerns and red flags
   Format: [{"title": "Risk title", "description": "Detailed risk explanation and potential impact"}]
   Categories:
   - Financial risks (budget unrealism, variance concerns, cost overruns)
   - AI adoption risks (over-optimistic automation estimates, insufficient training/change management)
   - Execution risks (resource constraints, dependencies, timeline concerns)
   - Strategic risks (KPI misalignment, competitive gaps, market changes)

5. **opportunities** (array, 3-4 opportunities): Areas for improvement
   Format: [{"title": "Opportunity title", "description": "How to capture this opportunity"}]
   Focus on:
   - Areas for greater AI leverage
   - Efficiency improvement potential
   - Innovation possibilities
   - Cost optimization opportunities

6. **kpiSuggestions** (array, 3-4 suggestions): ${request.departmentName}-specific KPI enhancements
   Format: [{"title": "KPI name", "description": "What to measure and how", "rationale": "Why this KPI is important for ${request.departmentName}"}]
   Suggest KPIs specifically relevant to ${request.departmentName} department:
   - Alternative or additional KPIs for better ${request.departmentName} performance tracking
   - Industry-standard metrics that ${request.departmentName} departments typically track
   - ${request.departmentName}-specific AI impact metrics that are missing or poorly defined
   - Leading indicators vs. current lagging indicators for ${request.departmentName} function
   - DO NOT suggest IT/Engineering metrics unless this is an IT department

7. **aiReadinessScore** (number, 0-100): Department's AI maturity score
   - 0-30: Early exploration (tools piloted, no real adoption)
   - 31-60: Growing adoption (some teams using AI, measurable but limited impact)
   - 61-80: Maturing practice (widespread adoption, clear productivity gains, systematic approach)
   - 81-100: AI-native operation (AI embedded in workflows, significant measurable impact, continuous innovation)
   
   Justify score based on:
   - Quality and specificity of AI strategy
   - Evidence of FY26 AI wins and measurable impacts
   - Comprehensiveness of FY27 AI plans
   - Realism of productivity estimates
   - Quality of AI cost-benefit analysis
   - Workforce planning sophistication

8. **confidenceScore** (number, 0-100): Your confidence in this analysis
   - Base on data quality, completeness of submission, and clarity of information
   - Lower confidence if critical data missing or inconsistent

═══════════════════════════════════════════════════════════════════════
ANALYSIS PRINCIPLES
═══════════════════════════════════════════════════════════════════════

✓ Be SPECIFIC - Reference actual numbers, percentages, and dollar amounts from the submission
✓ Be ACTIONABLE - Every recommendation should be implementable
✓ Be BALANCED - Acknowledge both strengths and concerns
✓ Be DATA-DRIVEN - Ground insights in quantitative and qualitative evidence
✓ Be REALISTIC - Consider typical AI productivity gains (15-30%), not science fiction
✓ CROSS-REFERENCE - Connect financial data, narrative explanations, and strategic claims
✓ FLAG INCONSISTENCIES - Note when claims don't match data or seem unrealistic

═══════════════════════════════════════════════════════════════════════
🔴 FINAL CRITICAL REMINDER 🔴
═══════════════════════════════════════════════════════════════════════

This is an analysis for ${request.departmentName} department. Your response MUST:
✅ Use only data from ${request.departmentName} department's actual submission
✅ Reference "${request.departmentName}" by name throughout the analysis
✅ Suggest KPIs appropriate for ${request.departmentName} function based on industry standards for this type of department
✅ Tailor AI strategy feedback to ${request.departmentName} workflows
❌ DO NOT use IT/Engineering examples (GitHub, code quality, deployment frequency) unless this IS an IT department
❌ DO NOT use generic software development metrics for non-technical departments
❌ DO NOT reference tools or metrics from other department types

═══════════════════════════════════════════════════════════════════════
⚠️⚠️⚠️ CRITICAL: USE ACTUAL DEPARTMENT DATA ONLY ⚠️⚠️⚠️
═══════════════════════════════════════════════════════════════════════

🎯 DEPARTMENT BEING ANALYZED: ${request.departmentName}

📊 ACTUAL BUSINESS METRICS SUBMITTED BY ${request.departmentName.toUpperCase()}:
${businessMetrics.length > 0 ? businessMetrics.map((m: any) => `   • ${m.name || 'Unnamed metric'}`).join('\n') : '   • No business metrics submitted'}

🤖 ACTUAL AI PERFORMANCE METRICS SUBMITTED BY ${request.departmentName.toUpperCase()}:
${aiPerformanceMetrics.length > 0 ? aiPerformanceMetrics.map((m: any) => `   • ${m.name || 'Unnamed metric'}`).join('\n') : '   • No AI metrics submitted'}

🎯 ACTUAL INITIATIVES SUBMITTED BY ${request.departmentName.toUpperCase()}:
${initiatives.length > 0 ? initiatives.map((i: any) => `   • ${i.name || 'Unnamed initiative'}`).join('\n') : '   • No initiatives submitted'}

📋 DEPARTMENT-SPECIFIC FOCUS AREAS:

${request.departmentName === 'Finance' || request.departmentName === 'finance' ? `
FOR FINANCE DEPARTMENT - Focus on:
   • Financial operations metrics (DSO, DPO, cash conversion cycle)
   • Month-end close efficiency, reconciliation processes
   • Budget variance analysis, forecast accuracy
   • Compliance and audit readiness
   • AI tools for financial analysis, reporting automation, reconciliation
   • FP&A productivity improvements
` : request.departmentName === 'Marketing' || request.departmentName === 'marketing' ? `
FOR MARKETING DEPARTMENT - Focus on:
   • Customer acquisition cost (CAC), conversion rates
   • Campaign performance metrics, ROI, ROAS
   • Lead generation, pipeline contribution
   • Brand awareness, engagement metrics
   • AI tools for content creation, campaign optimization, audience targeting
   • Marketing automation efficiency
` : request.departmentName === 'Human Resources' || request.departmentName === 'HR' ? `
FOR HR DEPARTMENT - Focus on:
   • Time-to-hire, cost-per-hire
   • Employee turnover, retention rates
   • Onboarding completion, employee satisfaction
   • Recruiting efficiency, offer acceptance rate
   • AI tools for candidate screening, resume analysis, employee engagement
   • HR process automation
` : request.departmentName === 'Sales' || request.departmentName === 'sales' ? `
FOR SALES DEPARTMENT - Focus on:
   • Pipeline velocity, win rate, deal size
   • Sales cycle length, quota attainment
   • Lead conversion, opportunity progression
   • Customer retention, upsell/cross-sell rates
   • AI tools for lead scoring, sales forecasting, CRM optimization
   • Sales productivity per rep
` : request.departmentName === 'Operations' || request.departmentName === 'operations' ? `
FOR OPERATIONS DEPARTMENT - Focus on:
   • Process efficiency, cycle time reduction
   • Quality metrics, defect rates, SLA compliance
   • Resource utilization, capacity planning
   • Supply chain metrics, inventory turnover
   • AI tools for demand forecasting, process optimization, quality control
   • Operational cost reduction
` : request.departmentName === 'Information Technology' || request.departmentName === 'IT' || request.departmentName === 'Engineering' ? `
FOR IT/ENGINEERING DEPARTMENT - Focus on:
   • Development velocity, deployment frequency
   • System uptime, incident response time
   • Code quality, technical debt metrics
   • Feature delivery, sprint completion
   • AI tools for code generation, testing, infrastructure automation
   • Engineering productivity, DevOps efficiency
` : `
FOR ${request.departmentName.toUpperCase()} DEPARTMENT - Focus on:
   • Core operational metrics relevant to ${request.departmentName} function
   • Efficiency and productivity KPIs specific to ${request.departmentName}
   • AI tools appropriate for ${request.departmentName} workflows
   • Cost reduction and process improvement in ${request.departmentName} operations
   • Industry-standard metrics for ${request.departmentName} departments
`}

⚠️ MANDATORY REQUIREMENTS FOR THIS ANALYSIS:
1. Analyze ONLY the metrics, initiatives, and data listed above from ${request.departmentName}
2. Do NOT invent or assume metrics that weren't submitted
3. Do NOT use examples from other department types
4. If you suggest new KPIs, ensure they are relevant to ${request.departmentName} function
5. Reference the ACTUAL metric names and initiative names listed above
6. Tailor ALL recommendations specifically to ${request.departmentName} workflows

Format response as a JSON object with these exact keys: summary, insights, recommendations, risks, opportunities, kpiSuggestions, aiReadinessScore, confidenceScore

Each array element must follow the specified format. Be thorough but concise.`

  const criticalInstructions = `

═══════════════════════════════════════════════════════════════════════
⚠️⚠️⚠️ CRITICAL ANALYSIS REQUIREMENTS ⚠️⚠️⚠️
═══════════════════════════════════════════════════════════════════════

1. 📋 USE ONLY SUBMITTED DATA:
   ✓ Analyze ONLY the data provided in the DEPARTMENT-SPECIFIC SUBMISSION DATA section above
   ✓ Reference specific metric names, initiative names, and numbers from the submission
   ✓ If a field shows "Not provided" or "N/A", acknowledge the gap rather than inventing data
   ✓ Do NOT fabricate metrics, costs, or details that weren't explicitly provided
   ✓ Every insight must trace back to actual submitted data

2. 🎯 DEPARTMENT-SPECIFIC ANALYSIS:
   This is ${request.departmentName} - Tailor ALL analysis to this department's function:
   
   ${request.departmentName === 'Finance' || request.departmentName === 'finance' ? `
   ➤ FINANCE FOCUS:
     • Financial operations: close processes, reconciliation, reporting cycles
     • Budgeting & forecasting accuracy and efficiency
     • Compliance, audit readiness, SOX controls
     • Cash management, working capital optimization
     • FP&A productivity and decision support
     • DO NOT use: software development, marketing, or sales metrics
   ` : request.departmentName === 'Marketing' || request.departmentName === 'marketing' ? `
   ➤ MARKETING FOCUS:
     • Customer acquisition: CAC, conversion rates, funnel metrics
     • Campaign performance: ROI, ROAS, engagement rates
     • Brand metrics: awareness, sentiment, reach
     • Lead generation and pipeline contribution
     • Content performance and marketing automation
     • DO NOT use: software development, finance, or sales metrics
   ` : request.departmentName === 'Sales' || request.departmentName === 'sales' ? `
   ➤ SALES FOCUS:
     • Pipeline management: velocity, coverage, progression
     • Quota attainment and win rates
     • Conversion rates across sales stages
     • Customer retention, upsell, cross-sell
     • Sales cycle efficiency and rep productivity
     • DO NOT use: software development, finance, or marketing metrics
   ` : request.departmentName === 'Human Resources' || request.departmentName === 'HR' ? `
   ➤ HR FOCUS:
     • Recruitment: time-to-hire, cost-per-hire, quality-of-hire
     • Retention: turnover rates, exit reasons, tenure analysis
     • Training & development: completion rates, skill gaps
     • Employee engagement and satisfaction
     • Compliance: labor law, benefits, payroll accuracy
     • DO NOT use: software development, finance, or sales metrics
   ` : request.departmentName === 'Information Technology' || request.departmentName === 'IT' || request.departmentName === 'Engineering' ? `
   ➤ IT/ENGINEERING FOCUS:
     • System reliability: uptime, incident response, MTTR
     • Development velocity: sprint completion, deployment frequency
     • Technical debt and code quality metrics
     • Infrastructure efficiency and cost optimization
     • DevOps maturity and automation coverage
     • DO NOT use: marketing, sales, or HR metrics
   ` : request.departmentName === 'Operations' || request.departmentName === 'operations' ? `
   ➤ OPERATIONS FOCUS:
     • Process efficiency: cycle time, throughput, utilization
     • Quality metrics: defect rates, SLA compliance
     • Supply chain: inventory turnover, lead times
     • Capacity planning and resource optimization
     • Operational cost per unit
     • DO NOT use: software development, marketing, or sales metrics
   ` : `
   ➤ ${request.departmentName.toUpperCase()} FOCUS:
     • Core operational metrics specific to ${request.departmentName} function
     • Efficiency and productivity KPIs relevant to ${request.departmentName}
     • Business outcomes unique to ${request.departmentName} department
     • Industry-standard metrics for ${request.departmentName} departments
     • DO NOT use generic examples from unrelated departments
   `}

3. 📊 CITE SPECIFIC DATA:
   ✓ Every insight MUST reference specific numbers, percentages, or dollar amounts from the submission
   ✓ Every recommendation MUST relate to specific metrics or initiatives mentioned above
   ✓ Every KPI suggestion MUST be relevant to ${request.departmentName}'s actual operations
   ✓ Use exact metric names as they appear in the submission (e.g., "${businessMetrics[0]?.name || 'the first metric'}")
   ✓ Reference specific initiative names when making recommendations

4. ⚠️ ACKNOWLEDGE DATA GAPS:
   ✓ If critical data is missing, explicitly note this in your analysis
   ✓ Recommend what additional data would improve the analysis
   ✓ Lower your confidenceScore if data quality is poor or incomplete
   ✓ Don't penalize departments for optional fields being blank
   ✓ Flag when missing data prevents thorough analysis

5. 🔒 JSON FORMAT ONLY:
   ✓ Your ENTIRE response MUST be valid JSON
   ✓ Use the EXACT structure specified in OUTPUT REQUIREMENTS
   ✓ Do NOT include any text outside the JSON structure
   ✓ No markdown, no code blocks, no explanations - JUST JSON
   ✓ Start with { and end with }
   ✓ Ensure all strings are properly escaped

═══════════════════════════════════════════════════════════════════════
🚨 FINAL VERIFICATION BEFORE RESPONDING 🚨
═══════════════════════════════════════════════════════════════════════

Before submitting your analysis, verify:
✅ Department name "${request.departmentName}" appears in your summary
✅ All insights reference ACTUAL submitted metrics by name
✅ All recommendations relate to ACTUAL submitted initiatives
✅ KPI suggestions are appropriate for ${request.departmentName} function
✅ No generic IT/software examples unless department is IT/Engineering
✅ Response is valid JSON with all required fields
✅ confidenceScore reflects actual data quality

Your analysis will be reviewed for adherence to these requirements.`

  return basePrompt + criticalInstructions
}

function parseAIResponse(text: string): AnalysisResult {
  try {
    // Remove markdown code blocks if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(cleaned)
    
    // Validate required fields
    const requiredFields = [
      'summary', 
      'insights', 
      'recommendations', 
      'risks', 
      'opportunities', 
      'kpiSuggestions',
      'aiReadinessScore',
      'confidenceScore'
    ]
    
    for (const field of requiredFields) {
      if (!(field in parsed)) {
        console.warn(`Missing required field: ${field}`)
        // Provide defaults for missing fields
        if (field === 'kpiSuggestions') {
          parsed[field] = []
        } else if (field === 'aiReadinessScore' || field === 'confidenceScore') {
          parsed[field] = 50
        } else if (field === 'summary') {
          parsed[field] = 'Analysis completed with limited data.'
        } else {
          parsed[field] = []
        }
      }
    }
    
    return parsed as AnalysisResult
  } catch (error) {
    console.error('Error parsing AI response:', error)
    console.error('Raw text:', text)
    throw new Error('Failed to parse AI analysis. Please check the AI response format.')
  }
}

function validateAnalysisResponse(result: AnalysisResult, request: AnalysisRequest): AnalysisResult {
  // Development validation only
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔎 Validating AI Response against submitted data...')
    
    // Extract submitted metric names
    const businessMetrics = request.aopFormData.businessMetrics || []
    const aiPerformanceMetrics = request.aopFormData.aiPerformanceMetrics || []
    const submittedMetricNames = [
      ...businessMetrics.map((m: any) => (m.name || m.metricName || '').toLowerCase()).filter((n: string) => n.length > 0),
      ...aiPerformanceMetrics.map((m: any) => (m.name || m.metricName || '').toLowerCase()).filter((n: string) => n.length > 0)
    ]
    
    // Extract submitted initiative names
    const initiatives = request.aopFormData.initiatives || []
    const submittedInitiativeNames = initiatives
      .map((i: any) => (i.name || '').toLowerCase())
      .filter((n: string) => n.length > 0)
    
    // Combine all analysis text
    const allAnalysisText = [
      result.summary || '',
      ...(result.insights || []).map((i: any) => `${i.title || ''} ${i.description || ''}`),
      ...(result.recommendations || []).map((r: any) => `${r.title || ''} ${r.description || ''}`),
      ...(result.kpiSuggestions || []).map((k: any) => `${k.title || ''} ${k.description || ''} ${k.rationale || ''}`)
    ].join(' ').toLowerCase()
    
    // Count referenced metrics
    const metricsReferenced = submittedMetricNames.filter(name => 
      allAnalysisText.includes(name)
    ).length
    
    // Count referenced initiatives
    const initiativesReferenced = submittedInitiativeNames.filter(name => 
      allAnalysisText.includes(name)
    ).length
    
    // Check if department name is referenced
    const departmentReferenced = allAnalysisText.includes(request.departmentName.toLowerCase())
    
    // Log validation results
    console.log('─────────────────────────────────────────────────────────────')
    console.log('📊 VALIDATION RESULTS:')
    console.log(`${departmentReferenced ? '✅' : '❌'} Department Referenced: ${departmentReferenced ? 'Yes' : 'No'} ("${request.departmentName}")`)
    console.log(`${metricsReferenced > 0 ? '✅' : '❌'} Metrics Referenced: ${metricsReferenced}/${submittedMetricNames.length}`)
    console.log(`${initiativesReferenced > 0 ? '✅' : '❌'} Initiatives Referenced: ${initiativesReferenced}/${submittedInitiativeNames.length}`)
    
    // Warnings for missing references
    if (metricsReferenced === 0 && submittedMetricNames.length > 0) {
      console.warn('⚠️  WARNING: Analysis does not reference any submitted metric names!')
      console.warn(`   Submitted metrics: ${submittedMetricNames.join(', ')}`)
    }
    
    if (initiativesReferenced === 0 && submittedInitiativeNames.length > 0) {
      console.warn('⚠️  WARNING: Analysis does not reference any submitted initiative names!')
      console.warn(`   Submitted initiatives: ${submittedInitiativeNames.join(', ')}`)
    }
    
    if (!departmentReferenced) {
      console.warn(`⚠️  WARNING: Analysis does not reference department name "${request.departmentName}"!`)
    }
    
    console.log('─────────────────────────────────────────────────────────────')
  }
  
  return result
}
