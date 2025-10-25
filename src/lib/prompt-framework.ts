/**
 * Dynamic Prompt Framework Management
 * Allows users to customize the AI analysis framework through Settings
 */

export interface PromptFramework {
  // Core analysis dimensions
  dimensions: {
    quantitative: AnalysisDimension
    qualitative: AnalysisDimension
    kpiEvaluation: AnalysisDimension
  }
  
  // Focus areas specific to FY27
  focusAreas: FocusArea[]
  
  // Analysis principles
  principles: string[]
  
  // Output requirements
  outputStructure: OutputRequirement[]
  
  // Department-specific guidelines
  departmentGuidelines: Record<string, string[]>
}

export interface AnalysisDimension {
  name: string
  description: string
  instructions: string[]
  weight: number // 0-100, how much to emphasize this dimension
}

export interface FocusArea {
  name: string
  description: string
  evaluationCriteria: string[]
  enabled: boolean
}

export interface OutputRequirement {
  field: string
  format: string
  description: string
  minCount?: number
  maxCount?: number
}

/**
 * Default FY27 Framework - This is what's currently hardcoded
 */
export const DEFAULT_FRAMEWORK: PromptFramework = {
  dimensions: {
    quantitative: {
      name: "Quantitative Financial Analysis",
      description: "Analyze numerical data, budgets, and financial metrics",
      instructions: [
        "Perform variance analysis between historical actuals and planned budget",
        "Identify trends, anomalies, and patterns in spending/revenue",
        "Assess budget feasibility and realism based on historical performance",
        "Calculate year-over-year growth rates and evaluate reasonableness",
        "Analyze cost structure and efficiency ratios",
        "Flag any concerning variances or unrealistic projections"
      ],
      weight: 30
    },
    qualitative: {
      name: "Qualitative Narrative Analysis",
      description: "Evaluate strategic thinking, AI strategy, and narrative quality",
      instructions: [
        "Assess strategic alignment and logical consistency",
        "Evaluate depth of thinking in strategic responses",
        "Review AI strategy comprehensiveness and realism",
        "Analyze context and reasoning behind budget requests",
        "Evaluate quality of prior year learnings",
        "Assess leadership's understanding of AI opportunities"
      ],
      weight: 40
    },
    kpiEvaluation: {
      name: "KPI Evaluation & Enhancement",
      description: "Assess whether departments are tracking the right metrics",
      instructions: [
        "Evaluate if these are the OPTIMAL KPIs for the department's function",
        "Determine if KPIs are leading indicators or lagging indicators",
        "Assess whether targets are realistic given AI augmentation plans",
        "Recommend department-specific KPIs for better performance tracking",
        "Suggest industry-standard benchmarks relevant to the function",
        "Evaluate balance between output metrics and efficiency metrics",
        "Check if AI metrics actually measure AI impact (not just usage)",
        "Consider what metrics are standard for this department across industries"
      ],
      weight: 30
    }
  },
  
  focusAreas: [
    {
      name: "AI Strategy Evaluation",
      description: "Assess the quality and realism of the department's AI strategy",
      evaluationCriteria: [
        "Is the AI strategy comprehensive, specific, and realistic for this function?",
        "Are AI tool selections appropriate for department's stated goals?",
        "Are productivity gain estimates realistic? (typical range: 15-30% for AI augmentation)",
        "Is AI adoption % target achievable given current maturity?",
        "Does strategy show understanding of AI limitations?",
        "Are the AI tools mentioned relevant to department workflows?"
      ],
      enabled: true
    },
    {
      name: "AI-Enabled Workforce Planning",
      description: "Evaluate how AI impacts headcount and workforce plans",
      evaluationCriteria: [
        "Review HC increase requests vs. AI augmentation claims",
        "Flag HC increases that aren't justified given AI availability",
        "Validate HC reductions have clear AI compensation plans",
        "Assess if skills development plans align with AI tools mentioned",
        "Check if workforce planning shows thoughtful role-by-role AI integration"
      ],
      enabled: true
    },
    {
      name: "AI Cost-Benefit Analysis",
      description: "Validate the ROI and financial logic of AI investments",
      evaluationCriteria: [
        "Evaluate ROI on AI tool investments - are benefits > costs?",
        "Check if payback periods are realistic (typically 6-18 months)",
        "Compare AI costs vs. expected savings/benefits for reasonableness",
        "Flag if AI spending seems insufficient given ambitious stated strategy",
        "Assess if department is over-investing in AI without clear ROI"
      ],
      enabled: true
    },
    {
      name: "Historical Performance Context",
      description: "Use prior year performance to assess FY27 realism",
      evaluationCriteria: [
        "How did department perform vs. prior year targets?",
        "Were AI adoption barriers mentioned and addressed?",
        "Are FY27 targets realistic given FY26 actual performance?",
        "Do prior year learnings inform FY27 strategy?",
        "Is there evidence of learning from mistakes?"
      ],
      enabled: true
    },
    {
      name: "Strategic Thinking Quality",
      description: "Assess depth and quality of strategic responses",
      evaluationCriteria: [
        "Quality of 'biggest needle mover' response",
        "Innovation and risk-taking in 'disruptive ideas'",
        "Competitive awareness from AI competitor analysis",
        "Resource allocation logic and trade-offs",
        "Depth of strategic thinking vs. surface-level responses"
      ],
      enabled: true
    }
  ],
  
  principles: [
    "Be SPECIFIC - Reference actual numbers, percentages, and dollar amounts from the submission",
    "Be ACTIONABLE - Every recommendation should be implementable",
    "Be BALANCED - Acknowledge both strengths and concerns",
    "Be DATA-DRIVEN - Ground insights in quantitative and qualitative evidence",
    "Be REALISTIC - Consider typical AI productivity gains (15-30%), not science fiction",
    "CROSS-REFERENCE - Connect financial data, narrative explanations, and strategic claims",
    "FLAG INCONSISTENCIES - Note when claims don't match data or seem unrealistic",
    "USE ACTUAL DATA ONLY - Analyze only what was submitted, don't invent data",
    "DEPARTMENT-SPECIFIC - Tailor all analysis to the specific department's function",
    "CITE SOURCES - Reference exact metric names and initiative names from submission"
  ],
  
  outputStructure: [
    {
      field: "summary",
      format: "string",
      description: "2-3 paragraph executive summary covering overall budget feasibility, key concerns/strengths, AI readiness, and primary recommendation",
      minCount: 1,
      maxCount: 1
    },
    {
      field: "insights",
      format: "array<{title, description}>",
      description: "Critical findings across all three dimensions (financial, strategic, AI)",
      minCount: 5,
      maxCount: 7
    },
    {
      field: "recommendations",
      format: "array<{title, description}>",
      description: "Specific, actionable advice with dollar amounts where possible",
      minCount: 5,
      maxCount: 7
    },
    {
      field: "risks",
      format: "array<{title, description}>",
      description: "Concerns and red flags (financial, AI adoption, execution, strategic)",
      minCount: 4,
      maxCount: 5
    },
    {
      field: "opportunities",
      format: "array<{title, description}>",
      description: "Areas for improvement (AI leverage, efficiency, innovation, cost optimization)",
      minCount: 3,
      maxCount: 4
    },
    {
      field: "kpiSuggestions",
      format: "array<{title, description, rationale}>",
      description: "Department-specific KPI enhancements with industry-standard alternatives",
      minCount: 3,
      maxCount: 4
    },
    {
      field: "aiReadinessScore",
      format: "number (0-100)",
      description: "Department's AI maturity score based on strategy quality, evidence of wins, and plan comprehensiveness",
      minCount: 1,
      maxCount: 1
    },
    {
      field: "confidenceScore",
      format: "number (0-100)",
      description: "Confidence in analysis based on data quality and completeness",
      minCount: 1,
      maxCount: 1
    }
  ],
  
  departmentGuidelines: {
    "Finance": [
      "Financial operations metrics (DSO, DPO, cash conversion cycle)",
      "Month-end close efficiency, reconciliation processes",
      "Budget variance analysis, forecast accuracy",
      "Compliance and audit readiness",
      "AI tools for financial analysis, reporting automation, reconciliation",
      "FP&A productivity improvements"
    ],
    "Marketing": [
      "Customer acquisition cost (CAC), conversion rates",
      "Campaign performance metrics, ROI, ROAS",
      "Lead generation, pipeline contribution",
      "Brand awareness, engagement metrics",
      "AI tools for content creation, campaign optimization, audience targeting",
      "Marketing automation efficiency"
    ],
    "Human Resources": [
      "Time-to-hire, cost-per-hire",
      "Employee turnover, retention rates",
      "Onboarding completion, employee satisfaction",
      "Recruiting efficiency, offer acceptance rate",
      "AI tools for candidate screening, resume analysis, employee engagement",
      "HR process automation"
    ],
    "Sales": [
      "Pipeline velocity, win rate, deal size",
      "Sales cycle length, quota attainment",
      "Lead conversion, opportunity progression",
      "Customer retention, upsell/cross-sell rates",
      "AI tools for lead scoring, sales forecasting, CRM optimization",
      "Sales productivity per rep"
    ],
    "Operations": [
      "Process efficiency, cycle time reduction",
      "Quality metrics, defect rates, SLA compliance",
      "Resource utilization, capacity planning",
      "Supply chain metrics, inventory turnover",
      "AI tools for demand forecasting, process optimization, quality control",
      "Operational cost reduction"
    ],
    "Information Technology": [
      "Development velocity, deployment frequency",
      "System uptime, incident response time",
      "Code quality, technical debt metrics",
      "Feature delivery, sprint completion",
      "AI tools for code generation, testing, infrastructure automation",
      "Engineering productivity, DevOps efficiency"
    ]
  }
}

/**
 * Load the current framework from storage (localStorage or Supabase in future)
 */
export function loadFramework(): PromptFramework {
  try {
    const stored = localStorage.getItem('aiAnalysisFramework')
    if (stored) {
      const parsed = JSON.parse(stored)
      // Merge with defaults to ensure all fields exist
      return {
        ...DEFAULT_FRAMEWORK,
        ...parsed,
        dimensions: {
          ...DEFAULT_FRAMEWORK.dimensions,
          ...parsed.dimensions
        }
      }
    }
  } catch (error) {
    console.error('Error loading framework:', error)
  }
  return DEFAULT_FRAMEWORK
}

/**
 * Save framework modifications
 */
export function saveFramework(framework: PromptFramework): void {
  try {
    localStorage.setItem('aiAnalysisFramework', JSON.stringify(framework))
    console.log('✅ Framework saved successfully')
  } catch (error) {
    console.error('Error saving framework:', error)
    throw error
  }
}

/**
 * Reset to default framework
 */
export function resetFramework(): PromptFramework {
  localStorage.removeItem('aiAnalysisFramework')
  return DEFAULT_FRAMEWORK
}

/**
 * Get a human-readable summary of the current framework
 */
export function getFrameworkSummary(framework: PromptFramework): string {
  const enabledFocusAreas = framework.focusAreas.filter(fa => fa.enabled)
  
  return `
## Current AI Analysis Framework

### Analysis Dimensions
${Object.entries(framework.dimensions).map(([key, dim]) => `
**${dim.name}** (Weight: ${dim.weight}%)
${dim.description}
${dim.instructions.map(i => `- ${i}`).join('\n')}
`).join('\n')}

### Focus Areas (${enabledFocusAreas.length} enabled)
${enabledFocusAreas.map(fa => `
**${fa.name}**
${fa.description}
Evaluation Criteria:
${fa.evaluationCriteria.map(c => `- ${c}`).join('\n')}
`).join('\n')}

### Analysis Principles
${framework.principles.map(p => `- ${p}`).join('\n')}

### Output Structure
${framework.outputStructure.map(out => `- **${out.field}**: ${out.description}`).join('\n')}
`
}

