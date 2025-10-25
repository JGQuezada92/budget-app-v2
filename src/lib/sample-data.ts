import type { 
  AOPSubmission, 
  FormState, 
  BusinessMetric, 
  AIPerformanceMetric,
  Initiative,
  WorkforceRow,
  NonHeadcountCost,
  AICostBenefitAnalysis,
  FinancialDataRow,
  AppendixFAQ,
  MonthlyAllocation
} from '@/types/aop'

// ============================================
// SAMPLE FY27 AOP SUBMISSION
// Engineering Department - Complete Test Data
// ============================================

export const sampleFY27Submission: Partial<FormState> = {
  // ============================================
  // SECTION 1: INTRODUCTION
  // ============================================
  departmentName: 'Information Technology',
  fiscalYear: '2027',
  teamDescription: 'The Engineering team is responsible for designing, developing, and maintaining all software products and internal systems. We operate in an agile environment with cross-functional squads focused on customer-facing applications, infrastructure, and DevOps automation. Our mission is to deliver high-quality, scalable solutions that drive business growth and operational excellence.',
  responsibilities: 'Core responsibilities include: (1) Product development for web and mobile applications, (2) Platform infrastructure and cloud operations (AWS), (3) DevOps and CI/CD pipeline management, (4) Security and compliance monitoring, (5) Technical debt reduction and system modernization, (6) API development and integration, (7) Database architecture and optimization.',
  teamTenets: 'Customer obsession: Build with the end user in mind. Technical excellence: Write maintainable, scalable code. Continuous improvement: Iterate and learn from failures. Collaboration: Break down silos between teams. Innovation: Embrace new technologies that solve real problems.',
  departmentHead: 'Sarah Chen - VP of Engineering',
  aiStrategyOverview: 'We will deploy GitHub Copilot across 100% of engineering team (45 engineers), Claude for code review and documentation (80% adoption target), and Cursor for AI-pair programming (60% adoption). Target 30% reduction in code review time, 25% faster feature development, and 40% improvement in documentation quality. Expected team productivity increase of 25-30% while maintaining code quality, enabling us to deliver 15 additional features in FY27 without proportional HC growth.',
  
  // ============================================
  // SECTION 2: BUSINESS METRICS
  // ============================================
  businessMetrics: [
    {
      id: 'bm-1',
      name: 'Features Shipped (Annual)',
      fy2025Actual: 42,
      fy2025Plan: 45,
      yoyPercent: -6.7,
      fy2026YtdActual: 38,
      fy2026YtdYoyPercent: -9.5,
      fy2027Plan: 60,
      fy2027PlanYoyPercent: 57.9
    },
    {
      id: 'bm-2',
      name: 'Production Incidents (Monthly Avg)',
      fy2025Actual: 12,
      fy2025Plan: 10,
      yoyPercent: 20,
      fy2026YtdActual: 8,
      fy2026YtdYoyPercent: -33.3,
      fy2027Plan: 5,
      fy2027PlanYoyPercent: -37.5
    },
    {
      id: 'bm-3',
      name: 'Code Deployment Frequency (per week)',
      fy2025Actual: 18,
      fy2025Plan: 20,
      yoyPercent: -10,
      fy2026YtdActual: 25,
      fy2026YtdYoyPercent: 38.9,
      fy2027Plan: 35,
      fy2027PlanYoyPercent: 40
    },
    {
      id: 'bm-4',
      name: 'Average Code Review Time (hours)',
      fy2025Actual: 4.5,
      fy2025Plan: 4,
      yoyPercent: 12.5,
      fy2026YtdActual: 3.2,
      fy2026YtdYoyPercent: -28.9,
      fy2027Plan: 2.5,
      fy2027PlanYoyPercent: -21.9
    },
    {
      id: 'bm-5',
      name: 'Test Coverage (%)',
      fy2025Actual: 72,
      fy2025Plan: 75,
      yoyPercent: -4,
      fy2026YtdActual: 78,
      fy2026YtdYoyPercent: 8.3,
      fy2027Plan: 85,
      fy2027PlanYoyPercent: 9
    },
    {
      id: 'bm-6',
      name: 'Developer Satisfaction Score (1-10)',
      fy2025Actual: 7.2,
      fy2025Plan: 7.5,
      yoyPercent: -4,
      fy2026YtdActual: 8.1,
      fy2026YtdYoyPercent: 12.5,
      fy2027Plan: 8.5,
      fy2027PlanYoyPercent: 4.9
    }
  ],
  
  // ============================================
  // SECTION 2: AI PERFORMANCE METRICS
  // ============================================
  aiPerformanceMetrics: [
    {
      id: 'ai-1',
      name: '% of workflows with AI augmentation',
      metricType: 'workflow_augmentation',
      enabled: true,
      fy2025Actual: 15,
      fy2026Ytd: 45,
      fy2027Target: 85,
      expectedImpact: 'Will enable developers to ship features 30% faster and reduce time spent on boilerplate code by 40%'
    },
    {
      id: 'ai-2',
      name: 'Hours saved per month via AI tools',
      metricType: 'hours_saved',
      enabled: true,
      fy2025Actual: 120,
      fy2026Ytd: 480,
      fy2027Target: 1200,
      expectedImpact: 'Equivalent to 7.5 FTE hours per month, redirected to high-value innovation work and technical debt reduction'
    },
    {
      id: 'ai-3',
      name: 'Cost reduction from AI automation',
      metricType: 'cost_reduction',
      enabled: true,
      fy2025Actual: 45000,
      fy2026Ytd: 185000,
      fy2027Target: 520000,
      expectedImpact: 'Primarily from reduced QA manual testing time, faster bug detection, and automated documentation generation'
    }
  ],
  
  // ============================================
  // SECTION 3: PRIOR YEAR REVIEW
  // ============================================
  metricsCommentary: 'FY26 showed strong improvement in deployment frequency and code review efficiency as we began AI adoption. Production incidents decreased 33% YoY due to better AI-assisted testing and code quality checks. Feature velocity remained below plan at 38 vs. 45 target, primarily due to team transition period and learning curve with new AI tools. Test coverage improved to 78%, exceeding our 75% target, with AI-generated test cases contributing significantly.',
  
  priorYearOutcomes: 'Major accomplishments in FY26: (1) Successfully migrated 80% of infrastructure to Kubernetes with zero downtime, (2) Launched mobile app redesign 2 weeks ahead of schedule using AI-assisted development, (3) Reduced P0/P1 incidents by 40% through improved monitoring and AI anomaly detection, (4) Completed technical debt reduction initiative removing 25K lines of legacy code, (5) Achieved SOC2 Type II certification for security compliance.',
  
  priorYearLearnings: 'Key wins: Early AI tool adoption gave us competitive advantage in velocity. Cross-functional pairing with product team improved feature quality. Wins: GitHub Copilot adoption exceeded expectations with 70% team satisfaction. Mistakes: Underestimated AI tool learning curve - productivity dipped 15% in first quarter before gains materialized. Should have invested more in prompt engineering training upfront. Missed on database optimization initiative - ran 3 months over timeline. Learning: AI tools require cultural change management, not just technical rollout.',
  
  industryTrends: 'Industry shift toward AI-native development accelerating rapidly. Competitors adopting AI coding assistants showing 20-35% productivity gains. Rise of AI-generated tests and documentation becoming standard practice. Increased focus on platform engineering and developer experience. Cloud costs optimization critical as infrastructure scales. Talent market highly competitive for AI-experienced engineers.',
  
  performanceAnalysis: 'FY26 targets: 45 features planned vs. 38 delivered (84% achievement rate). Primary gap due to 2-month delay in payment system modernization project caused by unexpected PCI compliance requirements. Infrastructure uptime target of 99.9% achieved at 99.92%. Cost targets: came in 8% under budget ($920K actual vs. $1M planned) due to AI tools reducing contractor needs by $80K. Initiatives executed efficiently once AI tools adoption stabilized in Q2. Key factor: invested heavily in AI training which paid off in H2 with 35% velocity improvement.',
  
  // AI Retrospective (NEW FY27)
  aiToolsPiloted: 'GitHub Copilot (deployed to all 45 engineers, 85% active daily users), Claude for code review and documentation (35 engineers, 78% adoption), Cursor for AI pair programming (pilot with 15 senior engineers, 60% satisfaction), ChatGPT Enterprise (available to all, 90% have used, 65% use weekly). Also piloted Amazon CodeWhisperer (discontinued after 3 months - GitHub Copilot was superior for our stack). Internal AI-powered log analysis tool built by platform team.',
  
  aiKeyWins: '1) Reduced code review time from 4.5 hours to 3.2 hours average (28% improvement) using AI-assisted review with Claude, saving 58 hours per week across team. 2) Accelerated onboarding of 8 new engineers - ramp-to-productivity dropped from 3 months to 6 weeks using AI coding assistants. 3) Generated 15,000 lines of automated test code using AI, achieving 78% test coverage (up from 72%). 4) Documentation completeness improved from 45% to 82% using AI doc generation.',
  
  aiMissesChallenges: 'Low initial adoption among senior engineers (only 40% in Q1) due to skepticism - required hands-on workshops to increase buy-in. Data privacy concerns prevented using external AI for customer data analysis - had to build internal tools. AI-generated code quality varied - needed additional review processes (30% of AI suggestions required modification). Cost underestimation: GitHub Copilot licenses ($19/user/month) exceeded budget by $15K annually. Learning curve caused 15% productivity dip in Q1 before gains materialized in Q2.',
  
  aiMeasurableImpacts: '1) $185K annual savings from reduced contractor needs (eliminated 2 contractor roles due to AI productivity gains). 2) 28% reduction in code review time from 58 hours/week to 42 hours/week team-wide. 3) Accelerated feature development cycle by 22%, launching 8 additional features in H2 FY26. 4) Reduced bug escape rate by 18% through AI-assisted testing. 5) Cut documentation time from 3 hours per feature to 45 minutes (75% reduction). 6) Improved developer satisfaction score from 7.2 to 8.1 (12.5% increase).',
  
  // ============================================
  // SECTION 4: INITIATIVES
  // ============================================
  initiatives: [
    {
      id: 'init-1',
      name: 'AI-Native Development Platform',
      description: 'Build internal developer platform integrating AI tools into our entire SDLC. Includes custom VS Code extensions, AI-powered code review automation, intelligent test generation, and automated documentation pipeline. Will reduce manual tasks and enable developers to focus on complex problem-solving.',
      owner: 'Michael Rodriguez - Principal Engineer',
      startDate: '2027-01-15',
      endDate: '2027-09-30',
      isBaseline: false,
      priority: 'high',
      aiIntegrationPlan: 'Leverage Claude API for intelligent code review that understands our coding standards and automatically flags issues. GitHub Copilot for boilerplate generation and test writing. Build custom AI models trained on our codebase for better suggestions. Expected to reduce PR review time by 50% and increase code quality scores by 25%. Will automate 70% of documentation tasks.',
      aiToolsUsed: 'Claude API, GitHub Copilot, Custom AI models, ChatGPT',
      totalCost: 280000,
      aiCostImpact: 420000,
      keyOutputMetrics: 'Reduce PR review time from 3.2 hours to 1.6 hours, increase documentation coverage from 82% to 95%, reduce bugs in production by 30%'
    },
    {
      id: 'init-2',
      name: 'Mobile App 2.0 Redesign',
      description: 'Complete redesign of mobile application with modern UI/UX, improved performance, and new features based on customer feedback. Migrate from React Native to native iOS/Swift and Android/Kotlin for better performance. Target 40% improvement in app store ratings.',
      owner: 'Jessica Park - Engineering Manager, Mobile',
      startDate: '2027-02-01',
      endDate: '2027-10-31',
      isBaseline: false,
      priority: 'high',
      aiIntegrationPlan: 'Use GitHub Copilot for iOS/Android native development to accelerate coding by 35%. Cursor for UI component generation and responsive design. AI-powered visual testing tools to automate 60% of QA regression tests. Claude for API documentation and SDK generation. Expected to deliver project 25% faster than traditional approach.',
      aiToolsUsed: 'GitHub Copilot, Cursor, Claude, AI Visual Testing',
      totalCost: 420000,
      aiCostImpact: 180000,
      keyOutputMetrics: 'Ship redesigned app by Q4, achieve 4.5+ app store rating (from 3.8), reduce crash rate by 60%, increase MAU by 25%'
    },
    {
      id: 'init-3',
      name: 'Technical Debt Reduction & System Modernization',
      description: 'Ongoing initiative to refactor legacy codebase, upgrade dependencies, improve test coverage, and eliminate tech debt accumulated over 5 years. Focus on payment processing system, user authentication microservice, and data pipeline infrastructure.',
      owner: 'David Kim - Staff Engineer',
      startDate: '2027-01-01',
      endDate: '2027-12-31',
      isBaseline: true,
      priority: 'medium',
      aiIntegrationPlan: 'AI tools will significantly accelerate refactoring. Use Claude to analyze legacy code and suggest modernization paths. GitHub Copilot for generating updated code patterns and migration scripts. AI-powered static analysis to identify code smells and security vulnerabilities. Expected to complete 40% more refactoring work compared to manual approach.',
      aiToolsUsed: 'Claude, GitHub Copilot, AI Static Analysis Tools',
      totalCost: 150000,
      aiCostImpact: 90000,
      keyOutputMetrics: 'Reduce legacy code by 30%, improve code maintainability score from 6.2 to 8.0, eliminate 15 critical security vulnerabilities'
    }
  ],
  
  resourceAllocation: {
    baseline: [
      {
        initiativeId: 'init-3',
        initiativeName: 'Technical Debt Reduction',
        allocationType: 'baseline',
        january: 3.5, february: 3.5, march: 4.0, april: 4.0,
        may: 3.5, june: 3.5, july: 2.5, august: 2.5,
        september: 3.0, october: 3.5, november: 3.0, december: 2.5,
        totalFtes: 39.0
      }
    ],
    incremental: [
      {
        initiativeId: 'init-1',
        initiativeName: 'AI-Native Development Platform',
        allocationType: 'incremental',
        january: 1.0, february: 2.0, march: 2.5, april: 3.0,
        may: 3.0, june: 3.0, july: 2.5, august: 2.0,
        september: 1.5, october: 0, november: 0, december: 0,
        totalFtes: 20.5
      },
      {
        initiativeId: 'init-2',
        initiativeName: 'Mobile App 2.0 Redesign',
        allocationType: 'incremental',
        january: 0, february: 1.5, march: 2.0, april: 3.0,
        may: 3.5, june: 4.0, july: 4.0, august: 3.5,
        september: 3.0, october: 2.5, november: 0, december: 0,
        totalFtes: 27.0
      }
    ]
  },
  
  hcJustification: {
    hcIncreasesJustification: 'Requesting 3 additional Senior Engineers despite 25-30% AI productivity gains because: (1) Business growth requires 60% more feature capacity - even with AI augmentation, 45 engineers cannot deliver 60 features (up from 38). AI gets us 30% more capacity (45 * 1.3 = 58.5 effective FTEs) but we need 68 effective FTEs for planned work. (2) AI tools excel at code generation but cannot replace senior engineering judgment for architecture decisions, system design, and complex debugging. (3) Mobile 2.0 redesign requires specialized native iOS/Android expertise not currently on team. (4) AI reduces time on routine tasks but increases capacity for innovation - we need more people to capitalize on this efficiency.',
    hcReductionsExplanation: 'Reducing 1 QA Engineer position as AI-powered automated testing covers 60% of regression testing previously done manually. Remaining QA team (4 engineers) will focus on complex integration testing, performance testing, and AI test oversight. Output will increase from 500 to 700 automated tests per sprint with fewer people.'
  },
  
  // ============================================
  // SECTION 5: AI-ENABLED WORKFORCE PLANNING
  // ============================================
  aiEnabledWorkforce: {
    tasksAugmentedByAI: 'Code generation for boilerplate, CRUD operations, and API endpoints (GitHub Copilot). Code review and PR feedback (Claude analyzing diffs and suggesting improvements). Test case generation for unit and integration tests (AI test generators). Documentation writing for APIs, architecture docs, and release notes (Claude/ChatGPT). Bug triage and log analysis (custom AI tools). Database query optimization (AI-powered query analyzers). Onboarding and knowledge base creation (AI documentation tools).',
    
    expectedProductivityImprovement: '25-30% productivity increase per engineer based on FY26 pilot results. Breakdown: Code writing 35% faster (Copilot), code review 28% faster (Claude), testing 40% faster (AI test gen), documentation 75% faster (AI writing), debugging 20% faster (AI log analysis). Senior engineers gain more (30%+) as AI handles routine work. Junior engineers gain less (20%) as they still need learning time. Overall team output equivalent to adding 11-13 engineers without actually hiring.',
    
    skillsDevelopmentNeeded: 'AI prompt engineering training (40 hours per engineer, $60K budget). GitHub Copilot advanced certification for all engineers (16 hours, $25K). Claude API integration workshop for tech leads (24 hours, $15K). AI security and compliance training (8 hours per engineer, $12K). Monthly lunch-and-learns on AI best practices. Create internal AI champions program - 5 senior engineers trained as AI advocates.',
    
    hcIncreasesJustificationResources: 'Despite 25-30% AI productivity gains, requesting 3 additional Senior Engineers (net +2 after QA reduction) because: Business demand growing 60% but AI only provides 30% capacity increase. AI excels at code generation but cannot replace human judgment for architecture, system design, trade-off decisions, and complex debugging. Mobile 2.0 requires specialized skills not augmentable by current AI tools. Need senior talent to mentor team on AI best practices and build internal AI tooling.',
    
    workforceTable: [
      {
        id: 'wf-1',
        roleLevel: 'VP Engineering',
        fy2026CurrentHc: 1,
        fy2027PlannedHc: 1,
        hcChange: 0,
        aiToolsLeveraged: 'ChatGPT, Claude',
        tasksAugmented: 'Strategy documents, architecture reviews, performance analysis',
        expectedProductivityGains: '15%',
        skillsDevelopmentRequired: 'AI leadership training, strategic AI planning',
        aiAugmentationStrategy: 'AI assists with data analysis for decision-making and generates first drafts of technical strategy documents'
      },
      {
        id: 'wf-2',
        roleLevel: 'Engineering Managers',
        fy2026CurrentHc: 4,
        fy2027PlannedHc: 5,
        hcChange: 1,
        aiToolsLeveraged: 'GitHub Copilot, Claude, ChatGPT',
        tasksAugmented: 'Performance reviews, project planning, code review oversight',
        expectedProductivityGains: '20%',
        skillsDevelopmentRequired: 'AI team management, AI-assisted planning tools',
        aiAugmentationStrategy: 'AI drafts performance reviews and project plans, analyzes sprint metrics, suggests resource allocation optimizations'
      },
      {
        id: 'wf-3',
        roleLevel: 'Senior Engineers (L5-L6)',
        fy2026CurrentHc: 12,
        fy2027PlannedHc: 14,
        hcChange: 2,
        aiToolsLeveraged: 'GitHub Copilot, Cursor, Claude',
        tasksAugmented: 'Code writing, architecture design, code review, mentoring',
        expectedProductivityGains: '30%',
        skillsDevelopmentRequired: 'Advanced prompt engineering, AI model fine-tuning',
        aiAugmentationStrategy: 'AI handles 40% of boilerplate code, automates documentation, accelerates code review. Seniors focus on architecture, complex algorithms, and AI tool optimization'
      },
      {
        id: 'wf-4',
        roleLevel: 'Mid-Level Engineers (L3-L4)',
        fy2026CurrentHc: 22,
        fy2027PlannedHc: 22,
        hcChange: 0,
        aiToolsLeveraged: 'GitHub Copilot, Claude, AI Testing Tools',
        tasksAugmented: 'Feature development, bug fixes, testing, documentation',
        expectedProductivityGains: '25%',
        skillsDevelopmentRequired: 'Copilot best practices, AI-assisted debugging',
        aiAugmentationStrategy: 'AI significantly accelerates feature development and testing. Focus shifts to code quality, system thinking, and learning from AI-generated solutions'
      },
      {
        id: 'wf-5',
        roleLevel: 'QA Engineers',
        fy2026CurrentHc: 5,
        fy2027PlannedHc: 4,
        hcChange: -1,
        aiToolsLeveraged: 'AI Test Generators, ChatGPT, Automated Visual Testing',
        tasksAugmented: 'Test case creation, regression testing, test automation',
        expectedProductivityGains: '40%',
        skillsDevelopmentRequired: 'AI testing tools, automated visual testing certification',
        aiAugmentationStrategy: 'AI automates 60% of regression tests. QA team focuses on complex integration testing, performance testing, and AI test oversight. Output increases despite HC reduction.'
      }
    ],
    
    nonHeadcountCosts: [
      { id: 'cost-1', costCategory: 'Contractors', fy2026Actual: 180000, fy2027Plan: 100000, change: -80000, notes: 'Reduced contractor needs due to AI productivity gains' },
      { id: 'cost-2', costCategory: 'Marketing Spend', fy2026Actual: 0, fy2027Plan: 0, change: 0, notes: 'N/A for Engineering' },
      { id: 'cost-3', costCategory: 'Temp/Agency Fees', fy2026Actual: 45000, fy2027Plan: 30000, change: -15000, notes: 'Less temp staffing needed with AI tools' },
      { id: 'cost-4', costCategory: 'SaaS Products', fy2026Actual: 240000, fy2027Plan: 260000, change: 20000, notes: 'Added monitoring tools, offset by contractor savings' },
      { id: 'cost-5', costCategory: 'AI Tool Licenses', fy2026Actual: 42000, fy2027Plan: 118000, change: 76000, notes: 'GitHub Copilot ($38K), Claude API ($45K), Cursor licenses ($25K), Testing tools ($10K)' },
      { id: 'cost-6', costCategory: 'AI Training/Enablement', fy2026Actual: 25000, fy2027Plan: 85000, change: 60000, notes: 'Comprehensive AI training program for all engineers' },
      { id: 'cost-7', costCategory: 'Travel', fy2026Actual: 55000, fy2027Plan: 60000, change: 5000, notes: 'Conference attendance and team offsites' },
      { id: 'cost-8', costCategory: 'Office Supplies', fy2026Actual: 8000, fy2027Plan: 8000, change: 0, notes: 'Minimal spend' },
      { id: 'cost-9', costCategory: 'Equipment', fy2026Actual: 135000, fy2027Plan: 150000, change: 15000, notes: 'Laptops for new hires + equipment refresh' },
      { id: 'cost-10', costCategory: 'Other', fy2026Actual: 12000, fy2027Plan: 15000, change: 3000, notes: 'Misc expenses' }
    ],
    
    aiCostBenefitAnalysis: [
      {
        id: 'ai-cost-1',
        aiExpenseVendor: 'GitHub Copilot Enterprise (48 licenses @ $39/mo)',
        annualCost: 22464,
        expectedSavingsBenefit: 185000,
        paybackPeriod: '1.5 months',
        netBenefit: 162536,
        roiPercentage: 733
      },
      {
        id: 'ai-cost-2',
        aiExpenseVendor: 'Claude API (Code Review & Documentation)',
        annualCost: 45000,
        expectedSavingsBenefit: 165000,
        paybackPeriod: '3 months',
        netBenefit: 120000,
        roiPercentage: 267
      },
      {
        id: 'ai-cost-3',
        aiExpenseVendor: 'Cursor Pro (25 licenses @ $20/mo)',
        annualCost: 6000,
        expectedSavingsBenefit: 48000,
        paybackPeriod: '1.5 months',
        netBenefit: 42000,
        roiPercentage: 700
      },
      {
        id: 'ai-cost-4',
        aiExpenseVendor: 'AI Testing Tools (Automated Visual Testing)',
        annualCost: 18000,
        expectedSavingsBenefit: 75000,
        paybackPeriod: '3 months',
        netBenefit: 57000,
        roiPercentage: 317
      },
      {
        id: 'ai-cost-5',
        aiExpenseVendor: 'AI Training & Enablement Program',
        annualCost: 85000,
        expectedSavingsBenefit: 250000,
        paybackPeriod: '4 months',
        netBenefit: 165000,
        roiPercentage: 194
      },
      {
        id: 'ai-cost-6',
        aiExpenseVendor: 'ChatGPT Enterprise (Company-wide, allocated to Engineering)',
        annualCost: 15000,
        expectedSavingsBenefit: 45000,
        paybackPeriod: '4 months',
        netBenefit: 30000,
        roiPercentage: 200
      }
    ]
  },
  
  // ============================================
  // SECTION 6: FILE UPLOADS (Sample Financial Data)
  // ============================================
  historicalData: [
    { id: 'hist-1', month: 'Jan 2026', accountCode: '5100', accountName: 'Salaries - Engineering', amount: 385000, category: 'Headcount' },
    { id: 'hist-2', month: 'Feb 2026', accountCode: '5100', accountName: 'Salaries - Engineering', amount: 385000, category: 'Headcount' },
    { id: 'hist-3', month: 'Mar 2026', accountCode: '5100', accountName: 'Salaries - Engineering', amount: 395000, category: 'Headcount' },
    { id: 'hist-4', month: 'Apr 2026', accountCode: '5100', accountName: 'Salaries - Engineering', amount: 395000, category: 'Headcount' },
    { id: 'hist-5', month: 'May 2026', accountCode: '5100', accountName: 'Salaries - Engineering', amount: 410000, category: 'Headcount' },
    { id: 'hist-6', month: 'Jun 2026', accountCode: '5100', accountName: 'Salaries - Engineering', amount: 410000, category: 'Headcount' },
    { id: 'hist-7', month: 'Jan 2026', accountCode: '6200', accountName: 'Software Licenses', amount: 28000, category: 'Software' },
    { id: 'hist-8', month: 'Feb 2026', accountCode: '6200', accountName: 'Software Licenses', amount: 28000, category: 'Software' },
    { id: 'hist-9', month: 'Jan 2026', accountCode: '6350', accountName: 'Contractors - Engineering', amount: 35000, category: 'Professional Fees' },
    { id: 'hist-10', month: 'Feb 2026', accountCode: '6350', accountName: 'Contractors - Engineering', amount: 32000, category: 'Professional Fees' },
    { id: 'hist-11', month: 'Jan 2026', accountCode: '6410', accountName: 'Cloud Infrastructure (AWS)', amount: 85000, category: 'Infrastructure' },
    { id: 'hist-12', month: 'Feb 2026', accountCode: '6410', accountName: 'Cloud Infrastructure (AWS)', amount: 88000, category: 'Infrastructure' }
  ],
  
  budgetData: [
    { id: 'budget-1', month: 'Jan 2027', accountCode: '5100', accountName: 'Salaries - Engineering', amount: 445000, category: 'Headcount' },
    { id: 'budget-2', month: 'Feb 2027', accountCode: '5100', accountName: 'Salaries - Engineering', amount: 445000, category: 'Headcount' },
    { id: 'budget-3', month: 'Mar 2027', accountCode: '5100', accountName: 'Salaries - Engineering', amount: 460000, category: 'Headcount' },
    { id: 'budget-4', month: 'Apr 2027', accountCode: '5100', accountName: 'Salaries - Engineering', amount: 460000, category: 'Headcount' },
    { id: 'budget-5', month: 'May 2027', accountCode: '5100', accountName: 'Salaries - Engineering', amount: 460000, category: 'Headcount' },
    { id: 'budget-6', month: 'Jun 2027', accountCode: '5100', accountName: 'Salaries - Engineering', amount: 475000, category: 'Headcount' },
    { id: 'budget-7', month: 'Jan 2027', accountCode: '6200', accountName: 'Software Licenses', amount: 32000, category: 'Software' },
    { id: 'budget-8', month: 'Feb 2027', accountCode: '6200', accountName: 'Software Licenses', amount: 32000, category: 'Software' },
    { id: 'budget-9', month: 'Jan 2027', accountCode: '6215', accountName: 'AI Tool Licenses', amount: 18500, category: 'AI Tools' },
    { id: 'budget-10', month: 'Feb 2027', accountCode: '6215', accountName: 'AI Tool Licenses', amount: 18500, category: 'AI Tools' },
    { id: 'budget-11', month: 'Jan 2027', accountCode: '6410', accountName: 'Cloud Infrastructure (AWS)', amount: 92000, category: 'Infrastructure' },
    { id: 'budget-12', month: 'Feb 2027', accountCode: '6410', accountName: 'Cloud Infrastructure (AWS)', amount: 94000, category: 'Infrastructure' }
  ],
  
  supportingDocuments: [],
  
  // ============================================
  // SECTION 7: APPENDIX FAQs
  // ============================================
  appendixFAQs: [
    {
      id: 'faq-1',
      questionKey: 'most_important_decisions',
      question: 'What are the most important decisions that we need in this meeting?',
      answer: `1) Approve $203K incremental AI tool investment (GitHub Copilot, Claude API, Cursor) with expected $520K annual savings. 2) Approve 3 Senior Engineer headcount increases despite AI gains - business demand (60% growth) exceeds AI productivity boost (30%). 3) Approve Mobile 2.0 redesign budget of $420K - critical for customer retention and competitive positioning. 4) Approve QA headcount reduction of 1 engineer with AI test automation compensation plan.`,
      required: true
    },
    {
      id: 'faq-2',
      questionKey: 'biggest_needle_mover',
      question: 'What is the single biggest thing we can do to move the needle in this business and how will we organize to do just that?',
      answer: `Deploy AI-Native Development Platform initiative. This will increase engineering throughput by 30%, enabling us to deliver 60 features in FY27 vs. 38 in FY26 (58% increase) without proportional HC growth. Organization: Dedicate 1 Senior Engineer as full-time AI Platform Lead, create AI Champions group (5 senior engineers), assign 20.5 FTEs over 9 months. Platform will standardize AI tool usage, automate workflows, and multiply impact of every engineer. Expected ROI: $420K benefit on $280K investment (150% ROI, 8-month payback).`,
      required: true
    },
    {
      id: 'faq-3',
      questionKey: 'disruptive_ideas',
      question: 'What are your disruptive ideas? (New/bold/risky product ideas or initiatives that are likely to fail but if they were to succeed, would result in a step-change in revenue/customer growth, cost reduction, or enable you to build a moat/relative advantage vs your competitors.)',
      answer: `AI-Generated Personalized Features: Use AI to auto-generate personalized UI/UX for each customer based on usage patterns and preferences. Risk: May create maintenance nightmare and quality issues. Reward: Could increase user engagement 3-5x and create massive competitive moat. No-Code AI Development Platform: Let business users build features using natural language AI without engineers. Risk: Quality, security, scalability concerns. 70% likely to fail. Reward: Could 10x feature velocity and democratize product development. Predictive Performance Optimization: AI that automatically identifies and fixes performance bottlenecks before users notice. Risk: Complex, may introduce bugs. Reward: 50% infrastructure cost reduction, superior user experience.`,
      required: true
    },
    {
      id: 'faq-4',
      questionKey: 'initiatives_not_included',
      question: 'What new initiatives and/or product ideas did you investigate that you chose not to include in the plan, and why didn\'t they make the cut?',
      answer: `GraphQL API Migration ($350K, 18 months): Investigated but decided current REST APIs sufficient. Cost/benefit didn't justify given AI can help optimize existing APIs. Microservices Decomposition ($580K, 24 months): Too risky and expensive. AI tools help manage monolith complexity adequately. Blockchain Integration for Data Integrity ($420K): Technology too immature, unclear customer demand. Real-time Collaboration Features ($280K): Deprioritized due to limited customer research validation. In-house AI Model Training ($750K): Too expensive vs. using commercial APIs. Would need ML team we don't have.`,
      required: true
    },
    {
      id: 'faq-5',
      questionKey: 'surprises_fy26',
      question: 'What were the positive and negative surprises in FY26? What are the specific measures you put in place (initiatives, processes, or structural changes) to address these surprises?',
      answer: `Positive surprises: (1) GitHub Copilot adoption exceeded expectations - 85% daily active users vs. 60% target. Measure: Expanded to all engineers early. (2) AI reduced contractor needs by $80K more than planned. Measure: Shifted budget to AI tools. (3) Junior engineer productivity increased 35% vs. 20% expected. Negative surprises: (1) Senior engineer AI skepticism - only 40% adopted in Q1. Measure: Implemented mandatory hands-on AI workshops, increased to 90% by Q4. (2) AI tool costs ran 35% over budget. Measure: Created quarterly AI spend review process. (3) Mobile app performance degraded in Q3. Measure: Created dedicated performance task force, now resolved.`,
      required: true
    },
    {
      id: 'faq-6',
      questionKey: 'top_misses_learnings',
      question: 'What are your top misses and learnings? What are you most disappointed about with your division/product/business in FY26?',
      answer: `Top miss: Only shipped 38 features vs. 45 planned (84% achievement). Root cause: Underestimated AI learning curve impact in Q1-Q2, productivity dipped before improving. Learning: AI adoption requires 2-3 month adjustment period with dedicated training. Disappointment: Failed to launch real-time notifications feature due to technical complexity - deprioritized for FY27. Payment system modernization ran 2 months late due to unexpected PCI compliance scope. Learning: Need better upfront requirements analysis and compliance expertise earlier in planning. Most disappointed: Lost 3 senior engineers to competitors offering better AI tooling and remote flexibility. Learning: AI tools are talent retention factor - engineers want to work with cutting-edge technology.`,
      required: true
    },
    {
      id: 'faq-7',
      questionKey: 'single_threaded_leaders',
      question: 'Are there any programs or initiatives in your business that don\'t have a single-threaded leader?',
      answer: `Security and compliance initiatives historically lacked single owner - responsibility diffused across team. Addressed by appointing Security Champion role (senior engineer, 20% time allocation). Platform engineering initiatives sometimes lack clear ownership when multiple teams depend on them. Creating dedicated Platform Engineering team with clear leader in FY27.`,
      required: false
    },
    {
      id: 'faq-8',
      questionKey: 'partner_dependency',
      question: 'Do any customers, business partners, or suppliers represent greater than 20% of your business? If so, what are you doing to reduce your dependency on these partners?',
      answer: `AWS represents 95% of our cloud infrastructure spend ($1M+), creating significant dependency. Mitigation: (1) Building multi-cloud abstraction layer to enable GCP migration if needed, (2) Negotiating committed use discounts for better pricing leverage, (3) Optimizing workloads to reduce costs (AI-powered cost optimization tools saved $120K in FY26). GitHub represents 100% of our code repository - mitigating with automated daily backups to S3 and tested migration plan to GitLab if needed.`,
      required: false
    },
    {
      id: 'faq-9',
      questionKey: 'dependencies_wish_controlled',
      question: 'What dependencies do you have in your business today that you wish you controlled?',
      answer: `AI API dependencies (OpenAI, Anthropic) - wish we had in-house AI capabilities to reduce vendor risk and API costs. Payment processor dependencies (Stripe) - payment flow is business-critical but entirely external. Third-party authentication (Auth0) - would prefer in-house solution for better customization and cost control. Mobile app store policies (Apple, Google) - at mercy of policy changes that can break features overnight.`,
      required: false
    },
    {
      id: 'faq-10',
      questionKey: 'dogs_not_barking',
      question: `What 'dogs not barking' do you worry about? (In other words, what are potential blind spots for you where you don't have reliable data/information about your competitors/customers/the industry that could have a big impact on your business.)`,
      answer: `Lack of visibility into how competitors are using AI internally - we see their output but not their development processes. May be falling behind on AI-native development practices. Limited insight into customer satisfaction with our engineering velocity and quality - don't have good developer experience metrics from customers. Unclear on industry AI adoption rates - are we ahead or behind? Missing data on engineering talent market compensation trends - may be losing talent without realizing why. Don't track developer happiness metrics systematically - could miss retention risks early.`,
      required: false
    },
    {
      id: 'faq-11',
      questionKey: 'competitors_using_ai',
      question: 'How are competitors using AI and where might we be falling behind?',
      answer: `Competitors deploying AI extensively: (1) GitHub is using AI Copilot internally with 95%+ adoption driving 40% productivity gains (vs. our 85% adoption, 25% gains). (2) Vercel integrated AI into their development platform deeply - automated deployments, error detection, performance optimization. We're catching up. (3) Linear shipped AI-powered project management features. (4) Atlassian using AI for automated testing and deployment. Falling behind: Competitors have dedicated AI Engineering teams (5-10 people) - we don't. They're building custom AI models on their codebase - we're using generic tools. Need to invest in AI customization and internal tooling or risk productivity gap widening.`,
      required: true,
      isAIFocused: true
    },
    {
      id: 'faq-12',
      questionKey: 'more_ai_budget_scenario',
      question: 'What would you do differently if you had 50% more AI tool budget but no additional HC?',
      answer: `With 50% more AI budget ($305K vs. $203K), would invest in: (1) Custom AI model fine-tuning on our codebase ($85K) - could increase code suggestion accuracy from 60% to 85%, adding 10% more productivity. (2) AI-powered DevOps automation platform ($45K) - auto-scaling, cost optimization, incident prediction. Could reduce infrastructure costs by $150K annually and prevent outages. (3) Premium Claude Enterprise tier ($35K extra) - larger context windows, faster responses, dedicated support. Would improve code review quality and speed. (4) AI pair programming copilot for architecture design ($50K) - helps senior engineers make better system design decisions. (5) AI-powered technical debt detection ($35K) - continuously scans codebase and prioritizes refactoring. Expected total additional benefit: $380K annually on $102K additional investment (373% ROI).`,
      required: true,
      isAIFocused: true
    }
  ]
}

// ============================================
// TEST DATA LOADER
// ============================================

/**
 * Loads sample FY27 data into the form for testing purposes
 * Only use in development mode
 */
export function loadSampleData(): Partial<FormState> {
  if (process.env.NODE_ENV === 'production') {
    console.warn('Sample data should not be loaded in production')
    return {}
  }
  
  console.log('Loading FY27 sample Engineering department data...')
  return sampleFY27Submission
}

/**
 * Quick test function to populate form with sample data
 * Call from browser console: window.loadTestData()
 */
export function setupTestDataLoader() {
  if (typeof window !== 'undefined') {
    (window as any).loadTestData = () => {
      const data = loadSampleData()
      console.log('Sample data loaded. Use setFormData() to apply to your form.')
      return data
    }
    console.log('Test data loader ready. Call window.loadTestData() to get sample data.')
  }
}

// ============================================
// ADDITIONAL SAMPLE DATA SETS
// ============================================

/**
 * Sample data for Finance department (smaller team, different AI use cases)
 */
export const sampleFinanceDepartment: Partial<FormState> = {
  departmentName: 'Finance',
  fiscalYear: '2027',
  teamDescription: 'Finance team manages all financial planning, accounting, reporting, and analysis. We ensure financial health, regulatory compliance, and provide strategic insights to leadership.',
  responsibilities: 'Financial reporting, budgeting and forecasting, accounts payable/receivable, payroll, tax compliance, audit preparation, financial analysis and modeling, board reporting.',
  departmentHead: 'Robert Martinez - CFO',
  aiStrategyOverview: 'Deploy Claude for financial report generation (90% of monthly reports automated), ChatGPT for data analysis and modeling (60% faster), Excel AI for forecasting (40% accuracy improvement). Target 35% reduction in manual data entry through AI automation, 50% faster close process, and ability to provide real-time financial insights instead of monthly reports.',
  
  businessMetrics: [
    { id: 'fm-1', name: 'Days to Monthly Close', fy2025Actual: 12, fy2026YtdActual: 10, fy2027Plan: 6, fy2027PlanYoyPercent: -40 },
    { id: 'fm-2', name: 'Forecast Accuracy (%)', fy2025Actual: 87, fy2026YtdActual: 91, fy2027Plan: 95, fy2027PlanYoyPercent: 4.4 },
    { id: 'fm-3', name: 'Manual Data Entry Hours/Month', fy2025Actual: 180, fy2026YtdActual: 145, fy2027Plan: 85, fy2027PlanYoyPercent: -41.4 }
  ],
  
  aiPerformanceMetrics: [
    {
      id: 'fai-1',
      name: '% of workflows with AI augmentation',
      metricType: 'workflow_augmentation',
      enabled: true,
      fy2025Actual: 10,
      fy2026Ytd: 35,
      fy2027Target: 75,
      expectedImpact: 'Automate report generation, variance analysis, and forecasting processes'
    },
    {
      id: 'fai-2',
      name: 'Hours saved per month via AI tools',
      metricType: 'hours_saved',
      enabled: true,
      fy2025Actual: 20,
      fy2026Ytd: 95,
      fy2027Target: 280,
      expectedImpact: 'Equivalent to 1.75 FTE, redirected to strategic analysis and business partnering'
    }
  ]
}

/**
 * Export all sample data sets
 */
export const sampleDataSets = {
  engineering: sampleFY27Submission,
  finance: sampleFinanceDepartment
}

/**
 * Get sample data by department
 */
export function getSampleDataByDepartment(departmentName: string): Partial<FormState> {
  const normalized = departmentName.toLowerCase()
  
  if (normalized.includes('engineering') || normalized.includes('technology') || normalized.includes('it')) {
    return sampleFY27Submission
  }
  
  if (normalized.includes('finance')) {
    return sampleFinanceDepartment
  }
  
  // Default to engineering sample
  return sampleFY27Submission
}

