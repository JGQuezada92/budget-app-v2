import type { FormState } from '@/types/aop'

// ============================================
// SAMPLE DEPARTMENTS
// ============================================

export const SAMPLE_DEPARTMENTS = [
  { value: 'finance', label: 'Finance', icon: '💰' },
  { value: 'marketing', label: 'Marketing', icon: '📢' },
  { value: 'sales', label: 'Sales', icon: '💼' },
  { value: 'hr', label: 'Human Resources', icon: '👥' },
  { value: 'it', label: 'Information Technology', icon: '💻' },
  { value: 'operations', label: 'Operations', icon: '⚙️' }
]

// ============================================
// GENERATE SAMPLE SUBMISSION
// ============================================

export function generateSampleSubmission(departmentType: string): Partial<FormState> {
  const generators: Record<string, () => Partial<FormState>> = {
    finance: generateFinanceSample,
    marketing: generateMarketingSample,
    sales: generateSalesSample,
    hr: generateHRSample,
    it: generateITSample,
    operations: generateOperationsSample
  }

  const generator = generators[departmentType.toLowerCase()] || generateFinanceSample
  return generator()
}

// ============================================
// FINANCE DEPARTMENT SAMPLE
// ============================================

function generateFinanceSample(): Partial<FormState> {
  return {
    departmentName: 'Finance',
    fiscalYear: '2027',
    teamDescription: 'The Finance department manages all financial operations, including accounting, financial planning & analysis, treasury, tax, and audit. We ensure accurate financial reporting, maintain fiscal controls, and provide strategic financial guidance to the organization.',
    responsibilities: 'Month-end and year-end close processes, financial statement preparation, budgeting and forecasting, cash flow management, accounts payable/receivable, payroll processing, tax compliance, internal and external audit support, financial analysis and modeling, board reporting.',
    teamTenets: 'Accuracy, Transparency, Compliance, Strategic Partnership',
    departmentHead: 'Robert Martinez - Chief Financial Officer (CFO)',
    aiStrategyOverview: 'Deploy Claude AI for automated financial report generation (targeting 80% automation of monthly reports), ChatGPT for data analysis and variance commentary, and AI-powered forecasting tools. Expected 35% reduction in manual data entry, 50% faster monthly close process, and ability to provide real-time financial insights instead of month-end only reporting.',
    
    businessMetrics: [
      { name: 'Days to Close Books', fy2025Actual: '12', fy2025Plan: '10', fy2026YtdActual: '10', fy2027Plan: '6', yoyPercent: '-40' },
      { name: 'Budget Variance %', fy2025Actual: '8', fy2025Plan: '5', fy2026YtdActual: '6', fy2027Plan: '3', yoyPercent: '-50' },
      { name: 'Invoice Processing Time (days)', fy2025Actual: '15', fy2025Plan: '12', fy2026YtdActual: '11', fy2027Plan: '5', yoyPercent: '-55' },
      { name: 'Forecast Accuracy %', fy2025Actual: '87', fy2025Plan: '90', fy2026YtdActual: '91', fy2027Plan: '95', yoyPercent: '4' },
      { name: 'Manual Data Entry Hours/Month', fy2025Actual: '180', fy2025Plan: '150', fy2026YtdActual: '145', fy2027Plan: '85', yoyPercent: '-41' }
    ],
    
    aiPerformanceMetrics: [
      { name: '% of reports automated by AI', fy2025Actual: '15', fy2026Ytd: '35', fy2027Target: '80', expectedImpact: 'Reduce manual report generation from 40 hours to 8 hours per month' },
      { name: 'Hours saved per month via AI', fy2025Actual: '25', fy2026Ytd: '60', fy2027Target: '150', expectedImpact: 'Equivalent to 1 FTE freed up for strategic analysis' },
      { name: 'AI-powered forecast accuracy improvement %', fy2025Actual: '2', fy2026Ytd: '4', fy2027Target: '8', expectedImpact: 'Better decision making through more accurate predictions' }
    ],
    
    initiatives: [
      {
        id: '1',
        name: 'AI-Powered Financial Reporting Automation',
        description: 'Implement Claude AI to automate monthly financial report generation, variance analysis, and commentary creation',
        aiIntegrationPlan: 'Deploy Claude for automated P&L and balance sheet commentary generation, variance analysis, and trend identification. Expected to reduce report preparation time by 75%.',
        aiToolsUsed: 'Claude AI, ChatGPT',
        totalCost: '250000',
        aiCostImpact: 'Reduces need for 1 analyst FTE ($120K annual savings)',
        isBaseline: false
      },
      {
        id: '2',
        name: 'Close Process Acceleration with AI',
        description: 'Use AI for automated account reconciliations and variance explanations to reduce close time from 10 days to 5 days',
        aiIntegrationPlan: 'AI will handle routine reconciliations, flag exceptions, and generate variance narratives automatically. Accountants focus on review and exceptions only.',
        aiToolsUsed: 'Custom AI reconciliation tool, Claude',
        totalCost: '180000',
        aiCostImpact: 'Saves 40 hours per month across team',
        isBaseline: false
      }
    ],
    
    aiEnabledWorkforce: {
      tasksAugmentedByAI: 'Financial report writing, variance analysis commentary, account reconciliations, data entry and validation, budget vs actual analysis, forecast model updates',
      expectedProductivityImprovement: '35% increase in FP&A output, 50% reduction in close time, 40% decrease in manual data tasks. Each analyst can handle 50% more analysis work.',
      skillsDevelopmentNeeded: 'AI prompt engineering for financial analysis, AI output review and validation, Advanced Excel with AI integration, Claude API usage training',
      hcIncreasesJustificationResources: '',
      workforceTable: [],
      nonHeadcountCosts: [],
      aiCostBenefitAnalysis: []
    },
    
    performanceAnalysis: 'FY26 performance showed improvement in close time from 12 to 10 days as we implemented initial AI automation. Budget variance remained at 6% vs 5% target, primarily due to unexpected consulting costs in Q2. Successfully delivered on digital transformation initiative ahead of schedule.',
    priorYearOutcomes: 'Implemented new GL system with 100% data migration accuracy, automated 15% of monthly reports using AI pilots, achieved SOX compliance certification, reduced audit findings by 40%.',
    
    aiToolsPiloted: 'ChatGPT for financial analysis commentary, Claude for report generation (pilot with 3 team members), Excel AI for forecasting',
    aiKeyWins: 'Reduced monthly reporting time by 25% using Claude for automated commentary generation. Improved forecast accuracy by 4% using AI-powered trend analysis.',
    aiMissesChallenges: 'Initial resistance from senior accountants concerned about accuracy. Had to implement strict review processes. AI struggled with complex non-standard transactions requiring manual intervention.',
    aiMeasurableImpacts: '$45K annual savings from reduced overtime during close, 30 hours per month of analyst time freed up for strategic work',
    
    historicalData: [],
    budgetData: [],
    supportingDocuments: [],
    appendixFAQs: []
  }
}

// ============================================
// MARKETING DEPARTMENT SAMPLE
// ============================================

function generateMarketingSample(): Partial<FormState> {
  return {
    departmentName: 'Marketing',
    fiscalYear: '2027',
    teamDescription: 'Marketing team drives customer acquisition, brand awareness, and demand generation through digital marketing, content creation, SEO/SEM, social media, and events. We focus on data-driven campaigns and continuous optimization.',
    responsibilities: 'Digital marketing strategy and execution, content creation and management, SEO/SEM optimization, social media management, brand strategy, lead generation, campaign analytics, marketing automation, events and webinars, customer research.',
    teamTenets: 'Data-Driven, Customer-Centric, Creative, Agile',
    departmentHead: 'Sarah Chen - Chief Marketing Officer (CMO)',
    aiStrategyOverview: 'Leverage AI for content creation (ChatGPT/Claude for copywriting - 60% of content), campaign optimization (AI-powered A/B testing and audience segmentation), and predictive analytics. Target 40% reduction in content production time, 30% improvement in conversion rates, and 50% faster campaign deployment cycles.',
    
    businessMetrics: [
      { name: 'Customer Acquisition Cost (CAC)', fy2025Actual: '145', fy2025Plan: '130', fy2026YtdActual: '125', fy2027Plan: '95', yoyPercent: '-24' },
      { name: 'Campaign ROI', fy2025Actual: '2.8', fy2025Plan: '3.0', fy2026YtdActual: '3.2', fy2027Plan: '4.0', yoyPercent: '25' },
      { name: 'Lead Conversion Rate %', fy2025Actual: '3.2', fy2025Plan: '3.5', fy2026YtdActual: '3.8', fy2027Plan: '5.0', yoyPercent: '32' },
      { name: 'Content Output (pieces/month)', fy2025Actual: '85', fy2025Plan: '100', fy2026YtdActual: '110', fy2027Plan: '180', yoyPercent: '64' },
      { name: 'Marketing Qualified Leads (MQLs)', fy2025Actual: '2400', fy2025Plan: '2800', fy2026YtdActual: '3100', fy2027Plan: '4500', yoyPercent: '45' }
    ],
    
    aiPerformanceMetrics: [
      { name: 'AI-generated content pieces per month', fy2025Actual: '10', fy2026Ytd: '45', fy2027Target: '120', expectedImpact: '67% of content automated, freeing team for strategy' },
      { name: 'Hours saved via AI copywriting', fy2025Actual: '15', fy2026Ytd: '55', fy2027Target: '140', expectedImpact: 'Equivalent to 0.8 FTE capacity added' },
      { name: 'AI-optimized campaigns performance lift %', fy2025Actual: '5', fy2026Ytd: '12', fy2027Target: '25', expectedImpact: 'Higher conversion rates through AI testing' }
    ],
    
    initiatives: [
      {
        id: '1',
        name: 'AI-Powered Content Creation Platform',
        description: 'Deploy enterprise AI tools for automated blog posts, social media content, email campaigns, and ad copy generation',
        aiIntegrationPlan: 'Use ChatGPT/Claude for content generation, Jasper for SEO optimization, Midjourney for creative assets. Human review and editing on all content. Expected 60% reduction in content production time.',
        aiToolsUsed: 'ChatGPT, Claude, Jasper, Midjourney',
        totalCost: '280000',
        aiCostImpact: 'Replaces $150K in freelance content costs',
        isBaseline: false
      },
      {
        id: '2',
        name: 'Automated Campaign Optimization Engine',
        description: 'AI-driven campaign testing, audience segmentation, and budget allocation optimization',
        aiIntegrationPlan: 'Machine learning models for A/B testing automation, audience targeting, and real-time budget optimization. Expected 30% improvement in campaign ROI through AI-optimized allocation.',
        aiToolsUsed: 'Custom ML models, Google AI, Meta AI',
        totalCost: '220000',
        aiCostImpact: 'Increases campaign efficiency without additional headcount',
        isBaseline: false
      },
      {
        id: '3',
        name: 'Predictive Lead Scoring System',
        description: 'AI-powered lead qualification and scoring to improve sales handoff quality',
        aiIntegrationPlan: 'Train ML model on historical conversion data to score leads. Integrate with CRM for automated routing. Expected to increase lead-to-opportunity conversion by 40%.',
        aiToolsUsed: 'Salesforce Einstein, Custom ML',
        totalCost: '150000',
        aiCostImpact: 'Improves sales efficiency, no direct cost savings',
        isBaseline: false
      }
    ],
    
    aiEnabledWorkforce: {
      tasksAugmentedByAI: 'Content writing and editing, campaign creative development, audience research and segmentation, A/B test analysis, performance reporting, social media scheduling, SEO keyword research',
      expectedProductivityImprovement: '40% increase in content output per marketer, 50% faster campaign deployment, 30% improvement in campaign performance through AI optimization',
      skillsDevelopmentNeeded: 'AI content creation and editing, AI tool integration and workflow design, Prompt engineering for marketing use cases, AI-generated content quality assurance',
      hcIncreasesJustificationResources: '',
      workforceTable: [],
      nonHeadcountCosts: [],
      aiCostBenefitAnalysis: []
    },
    
    performanceAnalysis: 'FY26 saw strong growth in MQLs (+29% YoY) driven by AI-enhanced content strategy. CAC decreased 14% as AI automation reduced production costs. Campaign ROI improved from 2.8x to 3.2x through better targeting and optimization.',
    priorYearOutcomes: 'Launched AI content pilot generating 45 pieces/month, implemented marketing automation platform with 85% adoption, exceeded MQL target by 11%, reduced content production costs by $80K through AI.',
    
    aiToolsPiloted: 'ChatGPT for blog writing and social posts, Jasper AI for SEO content, Canva AI for creative assets, Copy.ai for email campaigns',
    aiKeyWins: 'Reduced content production time from 8 hours to 2 hours per piece using AI. Improved email open rates by 18% using AI-optimized subject lines. Generated 45 blog posts per month vs 20 manual.',
    aiMissesChallenges: 'AI-generated content sometimes lacked brand voice consistency - required strict guidelines. Some team members feared job replacement - required change management. Image generation quality varied, still needed designer review.',
    aiMeasurableImpacts: '$95K savings in freelance content costs, 120 hours per month freed up for strategy vs execution, 18% improvement in campaign engagement metrics',
    
    historicalData: [],
    budgetData: [],
    supportingDocuments: [],
    appendixFAQs: []
  }
}

// ============================================
// SALES DEPARTMENT SAMPLE
// ============================================

function generateSalesSample(): Partial<FormState> {
  return {
    departmentName: 'Sales',
    fiscalYear: '2027',
    teamDescription: 'Sales team responsible for revenue generation, customer acquisition, and account management. We manage the full sales cycle from prospecting through closing and expansion.',
    responsibilities: 'Lead qualification and prospecting, sales presentations and demos, contract negotiation, quota attainment, pipeline management, account expansion, customer relationship management, sales forecasting, CRM data management.',
    teamTenets: 'Results-Driven, Customer Success, Collaboration, Continuous Improvement',
    departmentHead: 'Michael Torres - VP of Sales',
    aiStrategyOverview: 'Implement AI for lead scoring and qualification (predictive models - 70% accuracy target), sales coaching and call analysis (Gong/Chorus), and automated proposal generation. Expected 25% increase in rep productivity, 15% higher win rates, and 30% reduction in administrative time.',
    
    businessMetrics: [
      { name: 'Pipeline Velocity (days)', fy2025Actual: '45', fy2025Plan: '40', fy2026YtdActual: '42', fy2027Plan: '32', yoyPercent: '-24' },
      { name: 'Win Rate %', fy2025Actual: '22', fy2025Plan: '25', fy2026YtdActual: '26', fy2027Plan: '32', yoyPercent: '23' },
      { name: 'Average Deal Size', fy2025Actual: '58000', fy2025Plan: '65000', fy2026YtdActual: '67000', fy2027Plan: '75000', yoyPercent: '12' },
      { name: 'Quota Attainment %', fy2025Actual: '94', fy2025Plan: '100', fy2026YtdActual: '102', fy2027Plan: '108', yoyPercent: '6' },
      { name: 'Customer Retention Rate %', fy2025Actual: '89', fy2025Plan: '92', fy2026YtdActual: '93', fy2027Plan: '96', yoyPercent: '3' }
    ],
    
    aiPerformanceMetrics: [
      { name: 'AI-qualified leads per month', fy2025Actual: '120', fy2026Ytd: '280', fy2027Target: '500', expectedImpact: 'Reps spend time on best opportunities' },
      { name: 'Hours saved via AI proposal generation', fy2025Actual: '8', fy2026Ytd: '25', fy2027Target: '60', expectedImpact: 'More time for customer conversations' }
    ],
    
    initiatives: [
      {
        id: '1',
        name: 'AI-Powered Lead Scoring and Qualification',
        description: 'Machine learning model to score and prioritize leads based on conversion probability',
        aiIntegrationPlan: 'Train ML model on 3 years of historical data. Integrate with Salesforce. Auto-route high-score leads. Expected 40% improvement in lead quality.',
        aiToolsUsed: 'Salesforce Einstein, Custom ML model',
        totalCost: '320000',
        aiCostImpact: 'Increases efficiency without adding SDRs',
        isBaseline: false
      },
      {
        id: '2',
        name: 'Automated Proposal Generation System',
        description: 'AI-generated sales proposals customized to prospect needs using historical winning proposals',
        aiIntegrationPlan: 'Claude generates tailored proposals from templates. Uses prospect data and past wins. Human review before sending. 70% time reduction in proposal creation.',
        aiToolsUsed: 'Claude AI, PandaDoc',
        totalCost: '180000',
        aiCostImpact: 'Saves 30 hours per month across sales team',
        isBaseline: false
      }
    ],
    
    aiEnabledWorkforce: {
      tasksAugmentedByAI: 'Lead research and qualification, proposal and quote generation, email follow-ups, meeting notes and CRM updates, competitive analysis, sales forecasting',
      expectedProductivityImprovement: '25% more qualified conversations per rep, 15% higher close rates through AI insights, 30% reduction in administrative overhead',
      skillsDevelopmentNeeded: 'AI sales tools training, Effective use of AI-generated insights, Data-driven selling with AI analytics, AI coaching tool adoption',
      hcIncreasesJustificationResources: '',
      workforceTable: [],
      nonHeadcountCosts: [],
      aiCostBenefitAnalysis: []
    },
    
    performanceAnalysis: 'FY26 exceeded quota at 102% driven by AI-enhanced lead qualification. Win rate improved from 22% to 26% using AI sales coaching tools. Pipeline velocity reduced from 45 to 42 days.',
    priorYearOutcomes: 'Implemented Salesforce Einstein for lead scoring (26% higher conversion on AI-scored leads), achieved 102% of quota target, expanded into 3 new verticals, increased average deal size by 15%.',
    
    aiToolsPiloted: 'Salesforce Einstein for lead scoring, Gong for call analysis and coaching, ChatGPT for proposal drafting, Chorus for conversation intelligence',
    aiKeyWins: 'AI lead scoring increased conversion rate by 26%. Gong coaching helped new reps ramp 40% faster. Automated CRM updates saved 5 hours per rep per week.',
    aiMissesChallenges: 'AI call analysis revealed uncomfortable truths about rep performance - required careful change management. Some reps gamed the AI scoring system initially.',
    aiMeasurableImpacts: '$180K in additional revenue from higher win rates, 25 hours per week across team saved on admin tasks',
    
    historicalData: [],
    budgetData: [],
    supportingDocuments: [],
    appendixFAQs: []
  }
}

// ============================================
// HR DEPARTMENT SAMPLE
// ============================================

function generateHRSample(): Partial<FormState> {
  return {
    departmentName: 'Human Resources',
    fiscalYear: '2027',
    teamDescription: 'HR team manages the full employee lifecycle from recruitment through offboarding, compensation and benefits, employee relations, compliance, and organizational development.',
    responsibilities: 'Talent acquisition and recruitment, onboarding and offboarding, compensation and benefits administration, employee relations and engagement, performance management, compliance and labor law, training and development, HR systems and analytics.',
    teamTenets: 'People First, Fair and Consistent, Data-Informed, Continuous Learning',
    departmentHead: 'Jennifer Williams - Chief People Officer (CPO)',
    aiStrategyOverview: 'Deploy AI for resume screening (80% automation), candidate matching, employee engagement analysis, and HR chatbot for common queries. Expected 50% faster time-to-hire, 30% reduction in screening time, and 24/7 employee support.',
    
    businessMetrics: [
      { name: 'Time to Hire (days)', fy2025Actual: '45', fy2025Plan: '40', fy2026YtdActual: '38', fy2027Plan: '25', yoyPercent: '-34' },
      { name: 'Cost per Hire', fy2025Actual: '5200', fy2025Plan: '4800', fy2026YtdActual: '4500', fy2027Plan: '3200', yoyPercent: '-29' },
      { name: 'Employee Retention Rate %', fy2025Actual: '87', fy2025Plan: '90', fy2026YtdActual: '91', fy2027Plan: '93', yoyPercent: '2' },
      { name: 'Training Completion Rate %', fy2025Actual: '78', fy2025Plan: '85', fy2026YtdActual: '88', fy2027Plan: '95', yoyPercent: '8' },
      { name: 'Employee Satisfaction Score', fy2025Actual: '7.2', fy2025Plan: '7.5', fy2026YtdActual: '7.8', fy2027Plan: '8.5', yoyPercent: '9' }
    ],
    
    aiPerformanceMetrics: [
      { name: 'Resumes screened by AI per month', fy2025Actual: '150', fy2026Ytd: '420', fy2027Target: '800', expectedImpact: 'Recruiters focus on top candidates only' },
      { name: 'Hours saved via AI screening', fy2025Actual: '12', fy2026Ytd: '40', fy2027Target: '85', expectedImpact: '50% reduction in time-to-hire' }
    ],
    
    initiatives: [
      {
        id: '1',
        name: 'AI-Powered Recruitment Platform',
        description: 'Automated resume screening, candidate matching, and interview scheduling using AI',
        aiIntegrationPlan: 'AI screens resumes against job requirements, ranks candidates, schedules interviews automatically. Reduces recruiter screening time by 80%, improves candidate quality matching.',
        aiToolsUsed: 'HireVue, Paradox AI chatbot, Custom NLP model',
        totalCost: '240000',
        aiCostImpact: 'Handles volume without adding recruiters',
        isBaseline: false
      },
      {
        id: '2',
        name: 'Employee Engagement AI Analytics',
        description: 'Predictive analytics for retention risk and engagement improvement recommendations',
        aiIntegrationPlan: 'Analyze survey data, performance metrics, and behavioral signals to predict turnover risk. Provide personalized engagement recommendations to managers.',
        aiToolsUsed: 'Workday AI, Custom ML model',
        totalCost: '180000',
        aiCostImpact: 'Prevents costly turnover, no direct savings',
        isBaseline: false
      }
    ],
    
    aiEnabledWorkforce: {
      tasksAugmentedByAI: 'Resume screening and ranking, candidate sourcing, interview scheduling, employee inquiry responses (chatbot), engagement survey analysis, compliance documentation',
      expectedProductivityImprovement: '50% faster hiring process, 30% reduction in recruiter screening time, 80% of routine employee questions handled by AI chatbot',
      skillsDevelopmentNeeded: 'AI recruiting tools training, Bias detection in AI screening, Employee engagement analytics, Change management for AI adoption',
      hcIncreasesJustificationResources: '',
      workforceTable: [],
      nonHeadcountCosts: [],
      aiCostBenefitAnalysis: []
    },
    
    performanceAnalysis: 'FY26 improved time-to-hire from 45 to 38 days using AI screening pilots. Retention increased to 91% through proactive engagement using AI insights. Training completion reached 88%.',
    priorYearOutcomes: 'Implemented AI resume screening (80% of resumes auto-filtered), deployed employee chatbot handling 500+ queries/month, improved offer acceptance rate to 89%, reduced recruiting costs by $120K.',
    
    aiToolsPiloted: 'HireVue for video interview analysis, Paradox chatbot for candidate engagement, Workday AI for workforce analytics, ChatGPT for job description writing',
    aiKeyWins: 'AI screening reduced time-to-hire by 7 days. Chatbot handled 65% of employee queries without HR intervention. Predictive analytics identified 85% of at-risk employees early.',
    aiMissesChallenges: 'Initial concerns about AI bias in screening - required extensive testing and oversight. Employees skeptical of AI chatbot initially - required trust building. Integration challenges with legacy HRIS.',
    aiMeasurableImpacts: '$140K savings in recruiting costs, 35 hours per week freed up from screening tasks, improved candidate experience scores by 22%',
    
    historicalData: [],
    budgetData: [],
    supportingDocuments: [],
    appendixFAQs: []
  }
}

// ============================================
// IT DEPARTMENT SAMPLE
// ============================================

function generateITSample(): Partial<FormState> {
  return {
    departmentName: 'Information Technology',
    fiscalYear: '2027',
    teamDescription: 'IT department provides technology infrastructure, application development, cybersecurity, and technical support for the organization.',
    responsibilities: 'Application development and maintenance, infrastructure and cloud operations, cybersecurity and compliance, help desk and technical support, database administration, network management, DevOps and CI/CD.',
    teamTenets: 'Reliability, Security, Innovation, User-Centric',
    departmentHead: 'David Park - Chief Technology Officer (CTO)',
    aiStrategyOverview: 'Deploy GitHub Copilot across all developers (100% adoption), Claude for code review and documentation, and AI-powered DevOps automation. Target 30% improvement in development velocity, 40% reduction in code review time, 50% better documentation coverage.',
    
    businessMetrics: [
      { name: 'System Uptime %', fy2025Actual: '99.2', fy2025Plan: '99.5', fy2026YtdActual: '99.6', fy2027Plan: '99.9', yoyPercent: '0.3' },
      { name: 'Deployment Frequency (per week)', fy2025Actual: '12', fy2025Plan: '15', fy2026YtdActual: '18', fy2027Plan: '25', yoyPercent: '39' },
      { name: 'Mean Time to Resolution (hours)', fy2025Actual: '8', fy2025Plan: '6', fy2026YtdActual: '5', fy2027Plan: '3', yoyPercent: '-40' },
      { name: 'Code Quality Score', fy2025Actual: '7.8', fy2025Plan: '8.2', fy2026YtdActual: '8.5', fy2027Plan: '9.0', yoyPercent: '6' },
      { name: 'Developer Productivity (story points/sprint)', fy2025Actual: '42', fy2025Plan: '45', fy2026YtdActual: '52', fy2027Plan: '65', yoyPercent: '25' }
    ],
    
    aiPerformanceMetrics: [
      { name: 'Code generated by AI %', fy2025Actual: '12', fy2026Ytd: '35', fy2027Target: '50', expectedImpact: 'Faster feature development' },
      { name: 'Hours saved via AI code assistance', fy2025Actual: '180', fy2026Ytd: '520', fy2027Target: '900', expectedImpact: 'Equivalent to 5 FTE capacity' }
    ],
    
    initiatives: [
      {
        id: '1',
        name: 'AI-Assisted Development Platform',
        description: 'Full deployment of GitHub Copilot, Claude, and Cursor for AI-pair programming across engineering team',
        aiIntegrationPlan: 'Every developer uses Copilot for code generation, Claude for code review, Cursor for refactoring. Expected 35% productivity boost and 50% reduction in code review time.',
        aiToolsUsed: 'GitHub Copilot, Claude, Cursor',
        totalCost: '180000',
        aiCostImpact: 'Delivers 30% more features without proportional HC growth',
        isBaseline: false
      },
      {
        id: '2',
        name: 'AI-Powered DevOps Automation',
        description: 'Automated incident detection, root cause analysis, and remediation using AI',
        aiIntegrationPlan: 'AI monitors systems, predicts failures, automatically remediates common issues. Expected 60% reduction in MTTR and 40% fewer incidents.',
        aiToolsUsed: 'Datadog AI, Custom ML models',
        totalCost: '280000',
        aiCostImpact: 'Reduces on-call burden, prevents outages',
        isBaseline: false
      }
    ],
    
    aiEnabledWorkforce: {
      tasksAugmentedByAI: 'Code generation and completion, code review and bug detection, documentation writing, test case generation, incident analysis and remediation, DevOps automation',
      expectedProductivityImprovement: '35% increase in feature velocity, 50% reduction in code review time, 40% faster incident resolution, 60% better documentation coverage',
      skillsDevelopmentNeeded: 'AI-assisted development workflows, Effective prompt engineering for code generation, AI code review and validation, DevOps AI tool integration',
      hcIncreasesJustificationResources: '',
      workforceTable: [],
      nonHeadcountCosts: [],
      aiCostBenefitAnalysis: []
    },
    
    performanceAnalysis: 'FY26 exceeded targets with 18 deployments/week vs 15 target using AI DevOps. Code quality improved to 8.5 with AI-assisted review. System uptime reached 99.6%.',
    priorYearOutcomes: 'Deployed GitHub Copilot to 85% of developers, achieved 99.6% uptime (exceeding 99.5% target), delivered 38 major features vs 35 planned, reduced production incidents by 35%.',
    
    aiToolsPiloted: 'GitHub Copilot (85% team adoption), Claude for code review, Cursor for refactoring, Datadog AI for incident prediction',
    aiKeyWins: 'Copilot increased developer productivity by 28% measured. AI code review caught 42% more bugs pre-production. Auto-documentation coverage went from 45% to 78%.',
    aiMissesChallenges: 'Some senior engineers skeptical - required hands-on workshops. AI-generated code quality varied (30% needed modification). Cost underestimated by $18K.',
    aiMeasurableImpacts: 'Delivered 3 extra features without adding headcount ($360K value), reduced production bugs by 35% (saved $80K in hotfix costs), freed up 180 hours/month for innovation work',
    
    historicalData: [],
    budgetData: [],
    supportingDocuments: [],
    appendixFAQs: []
  }
}

// ============================================
// OPERATIONS DEPARTMENT SAMPLE
// ============================================

function generateOperationsSample(): Partial<FormState> {
  return {
    departmentName: 'Operations',
    fiscalYear: '2027',
    teamDescription: 'Operations team manages supply chain, logistics, quality control, and process optimization to ensure efficient delivery of products and services.',
    responsibilities: 'Supply chain management, inventory optimization, quality assurance, process improvement, vendor management, logistics coordination, production planning, operational analytics.',
    teamTenets: 'Efficiency, Quality, Continuous Improvement, Customer Focus',
    departmentHead: 'Lisa Anderson - VP of Operations',
    aiStrategyOverview: 'Implement AI for demand forecasting (40% accuracy improvement target), quality inspection automation (computer vision), and process optimization. Expected 25% reduction in inventory costs, 35% improvement in forecast accuracy, 50% faster quality inspections.',
    
    businessMetrics: [
      { name: 'Process Efficiency %', fy2025Actual: '78', fy2025Plan: '82', fy2026YtdActual: '84', fy2027Plan: '92', yoyPercent: '10' },
      { name: 'Defect Rate %', fy2025Actual: '2.8', fy2025Plan: '2.0', fy2026YtdActual: '1.9', fy2027Plan: '1.0', yoyPercent: '-47' },
      { name: 'On-Time Delivery %', fy2025Actual: '89', fy2025Plan: '92', fy2026YtdActual: '93', fy2027Plan: '97', yoyPercent: '4' },
      { name: 'Inventory Turnover', fy2025Actual: '6.2', fy2025Plan: '7.0', fy2026YtdActual: '7.5', fy2027Plan: '9.0', yoyPercent: '20' },
      { name: 'Cost Per Unit', fy2025Actual: '24.50', fy2025Plan: '23.00', fy2026YtdActual: '22.80', fy2027Plan: '19.50', yoyPercent: '-14' }
    ],
    
    aiPerformanceMetrics: [
      { name: 'AI-powered quality inspections per day', fy2025Actual: '80', fy2026Ytd: '250', fy2027Target: '500', expectedImpact: '3x faster quality checks' },
      { name: 'Forecast accuracy improvement %', fy2025Actual: '5', fy2026Ytd: '12', fy2027Target: '25', expectedImpact: 'Reduce inventory costs by 20%' }
    ],
    
    initiatives: [
      {
        id: '1',
        name: 'AI-Powered Demand Forecasting System',
        description: 'Machine learning models for accurate demand prediction and inventory optimization',
        aiIntegrationPlan: 'Train ML models on 5 years of historical data, external market signals, and seasonality patterns. Auto-adjust inventory levels. Expected 35% improvement in forecast accuracy.',
        aiToolsUsed: 'Custom ML models, AWS Forecast',
        totalCost: '320000',
        aiCostImpact: 'Reduces excess inventory by $2M annually',
        isBaseline: false
      }
    ],
    
    aiEnabledWorkforce: {
      tasksAugmentedByAI: 'Quality inspections using computer vision, demand forecasting, route optimization, anomaly detection in production, vendor performance analysis',
      expectedProductivityImprovement: '50% faster quality inspections, 35% better forecast accuracy, 25% reduction in logistics costs through AI route optimization',
      skillsDevelopmentNeeded: 'AI forecasting model training, Computer vision quality inspection, Data analytics for AI insights, Process optimization with AI tools',
      hcIncreasesJustificationResources: '',
      workforceTable: [],
      nonHeadcountCosts: [],
      aiCostBenefitAnalysis: []
    },
    
    performanceAnalysis: 'FY26 improved on-time delivery to 93% using AI demand forecasting. Defect rate reduced to 1.9% with AI quality inspection. Process efficiency reached 84%.',
    priorYearOutcomes: 'Implemented AI demand forecasting pilot (12% accuracy improvement), deployed computer vision quality inspection (250 inspections/day), achieved 93% on-time delivery, reduced inventory carrying costs by 15%.',
    
    aiToolsPiloted: 'AWS Forecast for demand prediction, computer vision for quality inspection, route optimization AI for logistics, predictive maintenance AI',
    aiKeyWins: 'AI forecasting reduced stockouts by 45% and overstock by 28%. Computer vision quality inspection 3x faster than manual. Predictive maintenance prevented $180K in equipment downtime.',
    aiMissesChallenges: 'Computer vision struggled with edge cases requiring human review. AI forecasting accuracy dropped during COVID disruptions. Integration with legacy ERP system difficult.',
    aiMeasurableImpacts: '$2.1M reduction in inventory costs, $180K prevented downtime, 120 hours per week saved on quality inspections',
    
    historicalData: [],
    budgetData: [],
    supportingDocuments: [],
    appendixFAQs: []
  }
}

// ============================================
// GET SAMPLE ANALYSIS RESULT
// ============================================

export function getSampleAnalysisResult(departmentType: string): any {
  const baseResult = {
    aiReadinessScore: 65,
    confidenceScore: 78
  }

  switch (departmentType.toLowerCase()) {
    case 'finance':
      return {
        ...baseResult,
        summary: 'The Finance department\'s FY27 AOP submission demonstrates strong strategic alignment with AI-enabled transformation. The plan shows realistic productivity targets (35% improvement) through Claude AI deployment for report automation. Budget appears feasible with $430K in initiatives offset by $120K in FTE savings. Key concern: close process automation timeline may be aggressive given change management requirements.',
        insights: [
          { title: 'Strong AI Strategy Foundation', description: 'Finance has articulated a clear AI strategy targeting 80% report automation using Claude. The 35% productivity improvement target aligns with industry benchmarks for AI-augmented finance teams.' },
          { title: 'Realistic Close Time Reduction Plan', description: 'The goal to reduce close from 10 to 6 days is achievable with AI-powered reconciliations. Similar finance teams have achieved 40-50% close time reduction using AI automation.' },
          { title: 'Budget Variance Improvement Opportunity', description: 'Current 6% budget variance is above best-in-class (3-4%). AI-powered forecasting could improve this significantly as planned.' },
          { title: 'Strong ROI on AI Investment', description: 'The $250K AI reporting initiative shows clear payback with $120K annual savings plus productivity gains worth $180K in additional FP&A capacity.' },
          { title: 'FY26 Performance Shows Momentum', description: 'Improving close time from 12 to 10 days in FY26 demonstrates execution capability. The FY27 target of 6 days builds on proven success.' }
        ],
        recommendations: [
          { title: 'Add Forecast Accuracy Metric', description: 'Include Forecast Accuracy % as a KPI to track AI forecasting improvements. Target 95% accuracy by FY27 end.' },
          { title: 'Expand AI Training Budget', description: 'Allocate $40K for AI skills development focusing on prompt engineering for financial analysis and AI tool adoption.' },
          { title: 'Implement Phased Close Automation', description: 'Start with high-volume, low-complexity reconciliations in Q1, then expand. Avoid big-bang approach to reduce change management risk.' },
          { title: 'Track AI-Generated Report Quality', description: 'Add metric for AI report accuracy (% requiring human correction) to ensure quality doesn\'t suffer with automation.' },
          { title: 'Consider Days Sales Outstanding KPI', description: 'Add DSO metric to track receivables efficiency and cash conversion cycle improvements from AI-powered collections follow-up.' }
        ],
        risks: [
          { title: 'Aggressive Close Timeline', description: 'Reducing close from 10 to 6 days in one year is ambitious. If AI adoption faces resistance or technical issues, target may be missed. Recommend 8-day interim target.' },
          { title: 'Change Management for AI Adoption', description: 'Senior accountants may resist AI automation of their work. Need robust change management and training to ensure 80% adoption target is met.' },
          { title: 'AI Tool Cost Escalation', description: 'Claude API costs could exceed budget if usage scales faster than expected. Monitor closely and set usage guardrails.' },
          { title: 'Data Quality Dependency', description: 'AI effectiveness depends on clean, structured data. If GL data quality issues exist, AI automation will amplify problems.' }
        ],
        opportunities: [
          { title: 'Real-Time Financial Insights', description: 'With AI automation, Finance could shift from monthly to weekly or daily insights, dramatically improving business decision speed.' },
          { title: 'Strategic FP&A Capacity', description: 'Freeing up 150 hours/month allows Finance to add strategic initiatives like predictive analytics, scenario modeling, and business partnering.' },
          { title: 'Audit Efficiency Gains', description: 'AI-generated audit trails and automated reconciliations could reduce external audit fees by 20-30%.' }
        ],
        kpiSuggestions: [
          { title: 'Days Sales Outstanding (DSO)', description: 'Measure average days to collect receivables', rationale: 'Critical for cash flow management and working capital optimization' },
          { title: 'Cash Conversion Cycle', description: 'Track days from cash outflow to cash inflow', rationale: 'Holistic view of working capital efficiency' },
          { title: 'AI Report Accuracy %', description: 'Percentage of AI-generated reports requiring no manual corrections', rationale: 'Ensure AI automation maintains quality standards' },
          { title: 'Time Spent on Strategic Analysis %', description: 'Percentage of FP&A time on value-add vs transaction processing', rationale: 'Track shift from tactical to strategic work as AI handles routine tasks' }
        ]
      }

    case 'marketing':
      return {
        ...baseResult,
        aiReadinessScore: 58,
        summary: 'The Marketing department\'s FY27 AOP shows ambitious AI content automation plans with 60% of content AI-generated. The 40% CAC reduction target is aggressive but achievable with AI optimization. Strong campaign ROI improvement from 2.8x to 4.0x demonstrates AI leverage potential. Main concern: Content quality consistency needs governance framework.',
        insights: [
          { title: 'Aggressive CAC Reduction Target', description: 'Reducing CAC from $125 to $95 (24% reduction) while scaling is challenging. AI content automation can help but requires excellent conversion optimization.' },
          { title: 'AI Content Strategy Well-Defined', description: 'Plan to use ChatGPT/Claude for 60% of content is clear and specific. The 40% reduction in production time aligns with industry benchmarks.' },
          { title: 'Strong Campaign ROI Improvement', description: 'Improving ROI from 2.8x to 4.0x through AI optimization is ambitious but feasible with proper A/B testing and audience segmentation.' },
          { title: 'Lead Volume Growth Dependent on Quality', description: 'MQL growth from 2,400 to 4,500 requires maintaining lead quality while scaling. AI qualification helps but needs monitoring.' }
        ],
        recommendations: [
          { title: 'Implement AI Content Quality Framework', description: 'Establish brand voice guidelines for AI, quality review checklist, and approval workflows to ensure consistency.' },
          { title: 'Add Content Performance Metric', description: 'Track AI-generated content engagement vs human-created to validate quality and optimize AI usage.' },
          { title: 'Pilot AI Campaigns Before Scaling', description: 'Start with 20% AI-generated content in Q1, measure performance, then scale to 60% by Q3 based on results.' },
          { title: 'Include Customer Lifetime Value KPI', description: 'Track CLV to ensure CAC reduction doesn\'t come at expense of customer quality.' }
        ],
        risks: [
          { title: 'Brand Voice Consistency Risk', description: 'AI-generated content may lack consistent brand voice across channels. Need governance and editing process.' },
          { title: 'Over-Optimization Risk', description: 'Excessive AI optimization could lead to homogenized campaigns that underperform. Balance AI efficiency with creative differentiation.' },
          { title: 'CAC Reduction May Impact Lead Quality', description: 'Aggressive CAC targets could incentivize quantity over quality. Monitor conversion rates downstream.' }
        ],
        opportunities: [
          { title: 'Personalization at Scale', description: 'AI enables personalized content for micro-segments that was previously cost-prohibitive.' },
          { title: 'Real-Time Campaign Optimization', description: 'AI can adjust campaigns in real-time based on performance, dramatically improving ROI.' }
        ],
        kpiSuggestions: [
          { title: 'AI Content Engagement Rate', description: 'Track performance of AI-generated vs human content', rationale: 'Validate AI content quality and effectiveness' },
          { title: 'Marketing Qualified Lead to SQL Conversion %', description: 'Track lead quality through funnel', rationale: 'Ensure CAC reduction maintains lead quality' },
          { title: 'Customer Lifetime Value (CLV)', description: 'Average revenue per customer over lifetime', rationale: 'Balance CAC reduction with customer quality' }
        ]
      }

    default:
      return {
        ...baseResult,
        summary: 'Sample analysis summary for debugging purposes.',
        insights: [],
        recommendations: [],
        risks: [],
        opportunities: [],
        kpiSuggestions: []
      }
  }
}

// ============================================
// COMPARE DEPARTMENT PROMPTS
// ============================================

export function compareDepartmentPrompts(dept1: string, dept2: string) {
  return {
    department1: dept1,
    department2: dept2,
    differences: {
      metrics: {
        [dept1]: dept1 === 'finance' ? ['Days to Close', 'Budget Variance', 'Forecast Accuracy'] 
                : dept1 === 'marketing' ? ['CAC', 'Campaign ROI', 'Lead Conversion']
                : ['System Uptime', 'Deployment Frequency'],
        [dept2]: dept2 === 'finance' ? ['Days to Close', 'Budget Variance', 'Forecast Accuracy']
                : dept2 === 'marketing' ? ['CAC', 'Campaign ROI', 'Lead Conversion']
                : ['System Uptime', 'Deployment Frequency']
      },
      focusAreas: {
        [dept1]: dept1 === 'finance' ? 'Financial operations, close process, compliance'
                : dept1 === 'marketing' ? 'Customer acquisition, campaigns, content'
                : 'Development velocity, system reliability',
        [dept2]: dept2 === 'finance' ? 'Financial operations, close process, compliance'
                : dept2 === 'marketing' ? 'Customer acquisition, campaigns, content'
                : 'Development velocity, system reliability'
      },
      aiTools: {
        [dept1]: dept1 === 'finance' ? 'Claude, ChatGPT, Excel AI'
                : dept1 === 'marketing' ? 'ChatGPT, Jasper, Midjourney'
                : 'GitHub Copilot, Claude, Cursor',
        [dept2]: dept2 === 'finance' ? 'Claude, ChatGPT, Excel AI'
                : dept2 === 'marketing' ? 'ChatGPT, Jasper, Midjourney'
                : 'GitHub Copilot, Claude, Cursor'
      }
    },
    similarityScore: dept1 === dept2 ? 100 : 15
  }
}

// ============================================
// COMMON ISSUES DATABASE
// ============================================

export const COMMON_ISSUES = [
  {
    id: 'it-examples-finance',
    department: 'finance',
    symptom: 'Analysis mentions GitHub, code quality, deployment frequency',
    diagnosis: 'AI is using IT department examples instead of Finance-specific analysis',
    solution: 'Verify department name is set correctly and prompt includes Finance-specific focus areas'
  },
  {
    id: 'missing-metrics',
    department: 'all',
    symptom: 'Analysis doesn\'t mention specific metric names from submission',
    diagnosis: 'Metrics not flowing to prompt or AI ignoring them',
    solution: 'Check metric "name" field is populated, verify in Prompt Inspector'
  },
  {
    id: 'generic-insights',
    department: 'all',
    symptom: 'Insights are vague without specific numbers or percentages',
    diagnosis: 'Low data quality or AI not following specificity requirements',
    solution: 'Fill out more form fields with quantitative data, check Specificity Score'
  }
]

// ============================================
// DIAGNOSTIC TESTS
// ============================================

export const DIAGNOSTIC_TESTS = [
  {
    id: 'dept-name-propagation',
    name: 'Department Name Propagation',
    description: 'Verify department name flows from form to prompt to analysis',
    expectedResult: 'Department name appears 10+ times in prompt, mentioned in analysis summary',
    howToTest: 'Use Prompt Inspector to search for department name, check Analysis Results for references'
  },
  {
    id: 'metric-extraction',
    name: 'Metric Name Extraction',
    description: 'Verify metric names are extracted and included in prompt',
    expectedResult: 'All metric names listed in SECTION 2 of prompt with green highlighting',
    howToTest: 'Generate prompt, scroll to SECTION 2: BUSINESS METRICS, verify names match form'
  },
  {
    id: 'validation-scoring',
    name: 'Validation Score Accuracy',
    description: 'Verify validateAnalysisResponse correctly counts references',
    expectedResult: 'Reference counts match manual count of metric/initiative mentions',
    howToTest: 'Check console logs for validation results, compare with manual search in analysis text'
  },
  {
    id: 'dept-specific-kpis',
    name: 'Department-Specific KPI Suggestions',
    description: 'Verify AI suggests KPIs appropriate for department type',
    expectedResult: 'Finance gets DSO/cash flow KPIs, Marketing gets CAC/conversion KPIs, etc.',
    howToTest: 'Check KPI Suggestions in Analysis Results - should not see IT metrics for non-IT departments'
  }
]

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getDepartmentLabel(departmentType: string): string {
  const dept = SAMPLE_DEPARTMENTS.find(d => d.value === departmentType.toLowerCase())
  return dept ? dept.label : departmentType
}

export function getDepartmentIcon(departmentType: string): string {
  const dept = SAMPLE_DEPARTMENTS.find(d => d.value === departmentType.toLowerCase())
  return dept ? dept.icon : '📊'
}

export function getExpectedKPIs(departmentType: string): string[] {
  const kpis: Record<string, string[]> = {
    finance: ['Days Sales Outstanding (DSO)', 'Cash Conversion Cycle', 'Budget Variance %', 'Forecast Accuracy', 'Days to Close'],
    marketing: ['Customer Acquisition Cost (CAC)', 'Marketing ROI', 'Lead Conversion Rate', 'Customer Lifetime Value (CLV)', 'Campaign ROI'],
    sales: ['Pipeline Velocity', 'Win Rate', 'Average Deal Size', 'Quota Attainment', 'Customer Retention Rate'],
    hr: ['Time to Hire', 'Cost per Hire', 'Employee Retention Rate', 'Training Completion Rate', 'Employee Satisfaction Score'],
    it: ['System Uptime %', 'Deployment Frequency', 'Mean Time to Resolution (MTTR)', 'Code Quality Score', 'Technical Debt Ratio'],
    operations: ['Process Efficiency %', 'Defect Rate', 'On-Time Delivery %', 'Inventory Turnover', 'Cost Per Unit']
  }
  return kpis[departmentType.toLowerCase()] || []
}

export function getUnexpectedKPIs(departmentType: string): string[] {
  // Returns KPIs that should NOT appear for this department
  const allKPIs = {
    finance: ['Days Sales Outstanding', 'Cash Conversion Cycle'],
    marketing: ['Customer Acquisition Cost', 'Campaign ROI'],
    sales: ['Pipeline Velocity', 'Win Rate'],
    hr: ['Time to Hire', 'Turnover Rate'],
    it: ['System Uptime', 'Deployment Frequency', 'Code Quality'],
    operations: ['Process Efficiency', 'Defect Rate']
  }

  const unexpected: string[] = []
  Object.entries(allKPIs).forEach(([dept, kpis]) => {
    if (dept !== departmentType.toLowerCase()) {
      if (dept === 'it') {
        // IT KPIs should definitely not appear in non-IT departments
        unexpected.push(...kpis)
      }
    }
  })

  return unexpected
}

// ============================================
// VALIDATION HELPERS
// ============================================

export function validateDepartmentSpecificity(analysisText: string, departmentType: string): {
  score: number
  issues: string[]
  strengths: string[]
} {
  const issues: string[] = []
  const strengths: string[] = []
  const text = analysisText.toLowerCase()
  
  const expectedKPIs = getExpectedKPIs(departmentType)
  const unexpectedKPIs = getUnexpectedKPIs(departmentType)
  
  // Check for department name
  const deptMentions = (text.match(new RegExp(departmentType, 'gi')) || []).length
  if (deptMentions >= 10) {
    strengths.push(`Department name mentioned ${deptMentions} times - good context`)
  } else if (deptMentions < 3) {
    issues.push(`Department name only mentioned ${deptMentions} times - may lack specificity`)
  }
  
  // Check for unexpected IT terms (for non-IT departments)
  if (departmentType.toLowerCase() !== 'it' && departmentType.toLowerCase() !== 'information technology') {
    const itTerms = ['github', 'copilot', 'deployment frequency', 'code quality', 'pull request', 'sprint velocity']
    const foundITTerms = itTerms.filter(term => text.includes(term))
    if (foundITTerms.length > 0) {
      issues.push(`Found IT-specific terms: ${foundITTerms.join(', ')} - may indicate generic IT examples`)
    }
  }
  
  // Calculate score
  let score = 100
  score -= (issues.length * 20)
  score = Math.max(0, Math.min(100, score))
  
  return { score, issues, strengths }
}

// ============================================
// EXPORT ALL GENERATORS
// ============================================

export {
  generateFinanceSample,
  generateMarketingSample,
  generateSalesSample,
  generateHRSample,
  generateITSample,
  generateOperationsSample
}

