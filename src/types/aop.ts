// ============================================
// FY27 AOP TypeScript Interfaces
// Comprehensive type definitions for Budget App V2
// ============================================

export interface AOPSubmission {
  id: string
  departmentName: string
  fiscalYear: 'FY 2025' | 'FY 2026' | 'FY 2027'
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
  submittedAt?: string
  lastUpdated: string
  introduction: IntroductionSection
  businessMetrics: BusinessMetric[]
  aiPerformanceMetrics: AIPerformanceMetric[]
  priorYearReview: PriorYearReview
  initiatives: Initiative[]
  hcJustification: HCJustification
  resourceAllocation: ResourceAllocation
  aiWorkforcePlanning: AIWorkforcePlanning
  nonHeadcountCosts: NonHeadcountCost[]
  aiCostBenefitAnalysis: AICostBenefitAnalysis[]
  historicalData: FinancialDataRow[]
  budgetData: FinancialDataRow[]
  supportingDocuments: SupportingDocument[]
  appendixFAQs: AppendixFAQ[]
}

// ============================================
// SECTION 1: INTRODUCTION
// ============================================

export interface IntroductionSection {
  departmentName: string
  fiscalYear: string
  teamDescription: string
  responsibilities: string
  teamTenets?: string
  departmentHead: string
  aiStrategyOverview: string // NEW FY27
}

// ============================================
// SECTION 2: METRICS
// ============================================

export interface BusinessMetric {
  id: string
  name: string  // Standardized field name (was metricName)
  // New FY25-27 structure
  fy2025Actual?: number
  fy2025Plan?: number
  yoyPercent?: number
  fy2026YtdActual?: number
  fy2026YtdYoyPercent?: number
  fy2027Plan?: number
  fy2027PlanYoyPercent?: number
  // Legacy fields for backwards compatibility
  fy2023Actual?: number
  fy2024Expected?: number
  ytdYoyPercent?: number
}

export interface AIPerformanceMetric {
  id: string
  name: string  // Standardized field name (was metricName)
  metricType: 'tasks_per_fte' | 'workflow_augmentation' | 'hours_saved' | 'cost_reduction' | 'adoption_rate' | 'processes_automated'
  enabled: boolean
  fy2025Actual?: number
  fy2026Ytd?: number
  fy2027Target?: number
  expectedImpact?: string
}

// ============================================
// SECTION 3: PRIOR YEAR REVIEW
// ============================================

export interface PriorYearReview {
  metricsCommentary: string
  keyOutcomes: string
  winsAndLearnings: string
  industryTrends: string
  performanceAnalysis: string // NEW FY27
  aiRetrospective: AIRetrospective // NEW FY27
}

export interface AIRetrospective {
  toolsPiloted: string
  keyWins: string
  missesChallenges: string
  measurableImpacts: string
}

// ============================================
// SECTION 4: INITIATIVES
// ============================================

export interface Initiative {
  id: string
  name: string
  description: string
  owner: string
  startDate: string
  endDate: string
  isBaseline: boolean
  priority: 'high' | 'medium' | 'low'
  // Traditional fields
  keyMetricGoals?: string
  projectResources?: string
  permanentResources?: string
  dependencies?: string
  fixedVariableCosts?: string
  // NEW FY27 AI Fields
  aiIntegrationPlan: string
  aiToolsUsed?: string
  totalCost?: number
  aiCostImpact?: number
  keyOutputMetrics?: string
}

export interface HCJustification {
  hcIncreasesJustification?: string
  hcReductionsExplanation?: string
}

export interface ResourceAllocation {
  baseline: MonthlyAllocation[]
  incremental: MonthlyAllocation[]
}

export interface MonthlyAllocation {
  initiativeId: string
  initiativeName: string
  allocationType: 'baseline' | 'incremental'
  january: number
  february: number
  march: number
  april: number
  may: number
  june: number
  july: number
  august: number
  september: number
  october: number
  november: number
  december: number
  totalFtes: number
}

// ============================================
// SECTION 5: AI-ENABLED WORKFORCE PLANNING
// ============================================

export interface AIWorkforcePlanning {
  tasksAugmentedByAI: string
  expectedProductivityImprovement: string
  skillsDevelopmentNeeded: string
  hcIncreasesJustificationResources?: string
  workforceTable: WorkforceRow[]
  nonHeadcountCosts: NonHeadcountCost[]
  aiCostBenefitAnalysis: AICostBenefitAnalysis[]
}

export interface WorkforceRow {
  id: string
  roleLevel: string
  fy2026CurrentHc: number
  fy2027PlannedHc: number
  hcChange: number
  aiToolsLeveraged?: string
  tasksAugmented?: string
  expectedProductivityGains?: string
  skillsDevelopmentRequired?: string
  aiAugmentationStrategy?: string
}

export interface NonHeadcountCost {
  id: string
  costCategory: string
  fy2026Actual?: number
  fy2027Plan?: number
  change?: number
  notes?: string
}

export interface AICostBenefitAnalysis {
  id: string
  aiExpenseVendor: string
  annualCost: number
  expectedSavingsBenefit: number
  paybackPeriod: string
  netBenefit?: number
  roiPercentage?: number
}

// ============================================
// SECTION 6: FILE UPLOADS
// ============================================

export interface FinancialDataRow {
  id: string
  month: string
  accountCode: string
  accountName: string
  amount: number
  category?: string
  fileType?: 'historical' | 'budget' | 'forecast'
}

export interface SupportingDocument {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  description?: string
  uploadedAt: string
}

// ============================================
// SECTION 7: APPENDIX FAQS
// ============================================

export interface AppendixFAQ {
  id: string
  questionKey: string
  question: string
  answer: string
  required: boolean
  isAIFocused?: boolean
}

// ============================================
// AI ANALYSIS RESULTS
// ============================================

export interface AIAnalysisResult {
  submissionId: string
  departmentName: string
  fiscalYear: string
  summary: string
  insights: AnalysisItem[]
  recommendations: AnalysisItem[]
  risks: AnalysisItem[]
  opportunities: AnalysisItem[]
  kpiSuggestions: KPISuggestion[]
  aiReadinessScore: number
  confidenceScore: number
  analyzedAt: string
}

export interface AnalysisItem {
  title: string
  description: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
  category?: 'financial' | 'strategic' | 'ai' | 'execution' | 'kpi'
}

export interface KPISuggestion {
  title: string
  description: string
  rationale: string
  expectedBenefit?: string
  implementationDifficulty?: 'low' | 'medium' | 'high'
}

// ============================================
// ADMIN DASHBOARD TYPES
// ============================================

export interface DepartmentSummary {
  id: string
  departmentName: string
  fiscalYear: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
  totalBudget: number
  headcount: number
  headcountChange: number
  submittedDate: string | null
  confidenceScore: number | null
  aiReadinessScore: number
  aiInvestment: number
  expectedAISavings: number
  aiToolsUsed: string[]
  kpiEnhancementCount: number
  hasAIJustification: boolean
  completionPercentage: number
}

export interface BudgetCategoryAggregate {
  category: string
  amount: number
  percentage: number
  yoyChange?: number
}

export interface AIToolUsage {
  toolName: string
  departmentCount: number
  totalUsers?: number
  averageAdoptionRate?: number
}

export interface AIReadinessDistribution {
  scoreRange: string
  count: number
  percentage: number
  departments: string[]
}

export interface HCChangeAnalysis {
  type: 'increase_justified' | 'increase_unjustified' | 'decrease_ai_compensated' | 'stable'
  count: number
  departments: string[]
}

// ============================================
// FORM STATE & VALIDATION
// ============================================

export interface FormState {
  // Section 1: Introduction
  departmentName: string
  fiscalYear: string
  teamDescription: string
  responsibilities: string
  teamTenets: string
  departmentHead: string
  aiStrategyOverview: string
  
  // Section 2: Metrics
  businessMetrics: BusinessMetric[]
  aiPerformanceMetrics: AIPerformanceMetric[]
  
  // Section 3: Prior Year Review
  metricsCommentary: string
  priorYearOutcomes: string
  priorYearLearnings: string
  industryTrends: string
  performanceAnalysis: string
  // AI Retrospective
  aiToolsPiloted: string
  aiKeyWins: string
  aiMissesChallenges: string
  aiMeasurableImpacts: string
  
  // Section 4: Initiatives
  initiatives: Initiative[]
  resourceAllocation: ResourceAllocation
  hcJustification: HCJustification
  
  // Section 5: AI-Enabled Workforce Planning
  aiEnabledWorkforce: AIWorkforcePlanning
  
  // Section 6: File Uploads
  historicalData: FinancialDataRow[]
  budgetData: FinancialDataRow[]
  supportingDocuments: SupportingDocument[]
  
  // Section 7: Appendix FAQs
  appendixFAQs: AppendixFAQ[]
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  completionPercentage: number
}

export interface SectionValidation {
  [sectionName: string]: ValidationResult
}

// ============================================
// UTILITY TYPES
// ============================================

export type FiscalYear = '2025' | '2026' | '2027'
export type SubmissionStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
export type Priority = 'high' | 'medium' | 'low'
export type AllocationPeriod = 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december'
export type AIMetricType = 'tasks_per_fte' | 'workflow_augmentation' | 'hours_saved' | 'cost_reduction' | 'adoption_rate' | 'processes_automated'
export type Difficulty = 'low' | 'medium' | 'high'
export type Severity = 'low' | 'medium' | 'high' | 'critical'
export type AnalysisCategory = 'financial' | 'strategic' | 'ai' | 'execution' | 'kpi'

// ============================================
// CONSTANTS
// ============================================

export const FISCAL_YEARS: FiscalYear[] = ['2025', '2026', '2027']

export const SUBMISSION_STATUSES: SubmissionStatus[] = ['draft', 'submitted', 'under_review', 'approved', 'rejected']

export const PRIORITIES: Priority[] = ['high', 'medium', 'low']

export const AI_METRIC_TYPES: { value: AIMetricType; label: string }[] = [
  { value: 'tasks_per_fte', label: 'Tasks completed per FTE (AI-enabled)' },
  { value: 'workflow_augmentation', label: '% of workflows with AI augmentation' },
  { value: 'hours_saved', label: 'Hours saved per month via AI tools' },
  { value: 'cost_reduction', label: 'Cost reduction from AI automation' },
  { value: 'adoption_rate', label: 'AI tool adoption rate (% of team)' },
  { value: 'processes_automated', label: 'Manual processes automated/made efficient using AI' }
]

export const MONTHS: AllocationPeriod[] = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
]

export const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const COST_CATEGORIES = [
  'Contractors',
  'Marketing Spend',
  'Temp/Agency Fees',
  'SaaS Products',
  'AI Tool Licenses',
  'AI Training/Enablement',
  'Travel',
  'Office Supplies',
  'Equipment',
  'Other'
]

export const AI_COST_CATEGORIES = ['AI Tool Licenses', 'AI Training/Enablement']

export const DEPARTMENTS = [
  'Finance',
  'Human Resources',
  'Information Technology',
  'Marketing',
  'Operations',
  'Sales'
]

// ============================================
// FAQ QUESTION KEYS
// ============================================

export const FAQ_QUESTION_KEYS = {
  MOST_IMPORTANT_DECISIONS: 'most_important_decisions',
  BIGGEST_NEEDLE_MOVER: 'biggest_needle_mover',
  DISRUPTIVE_IDEAS: 'disruptive_ideas',
  INITIATIVES_NOT_INCLUDED: 'initiatives_not_included',
  SURPRISES_FY26: 'surprises_fy26',
  TOP_MISSES_LEARNINGS: 'top_misses_learnings',
  SINGLE_THREADED_LEADERS: 'single_threaded_leaders',
  PARTNER_DEPENDENCY: 'partner_dependency',
  DEPENDENCIES_WISH_CONTROLLED: 'dependencies_wish_controlled',
  DOGS_NOT_BARKING: 'dogs_not_barking',
  COMPETITORS_USING_AI: 'competitors_using_ai',
  MORE_AI_BUDGET_SCENARIO: 'more_ai_budget_scenario'
} as const

// ============================================
// HELPER FUNCTIONS
// ============================================

export function calculateHCChange(current: number, planned: number): number {
  return planned - current
}

export function calculateYOYPercentage(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function calculateTotalFTEs(allocation: Partial<Record<AllocationPeriod, number>>): number {
  return MONTHS.reduce((sum, month) => sum + (allocation[month] || 0), 0)
}

export function calculateROI(benefit: number, cost: number): number {
  if (cost === 0) return 0
  return ((benefit - cost) / cost) * 100
}

export function getAIReadinessLabel(score: number): string {
  if (score >= 70) return 'Advanced'
  if (score >= 40) return 'Developing'
  return 'Emerging'
}

export function getAIReadinessDescription(score: number): string {
  if (score >= 81) return 'AI-native operation with embedded workflows, significant impact, and continuous innovation'
  if (score >= 61) return 'Maturing practice with widespread adoption, clear productivity gains, and systematic approach'
  if (score >= 31) return 'Growing adoption with some teams using AI and measurable but limited impact'
  return 'Early exploration with tools piloted but no real widespread adoption'
}

export function isValidFiscalYear(year: string): year is FiscalYear {
  return ['2025', '2026', '2027'].includes(year)
}

export function isValidStatus(status: string): status is SubmissionStatus {
  return ['draft', 'submitted', 'under_review', 'approved', 'rejected'].includes(status)
}

// ============================================
// TYPE GUARDS
// ============================================

export function isAOPSubmission(obj: any): obj is AOPSubmission {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.departmentName === 'string' &&
    isValidFiscalYear(obj.fiscalYear) &&
    isValidStatus(obj.status)
  )
}

export function isInitiative(obj: any): obj is Initiative {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.owner === 'string' &&
    typeof obj.aiIntegrationPlan === 'string'
  )
}

export function isAIPerformanceMetric(obj: any): obj is AIPerformanceMetric {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.enabled === 'boolean'
  )
}

// ============================================
// DEFAULT VALUES
// ============================================

export const createDefaultFormState = (): FormState => ({
  // Section 1: Introduction
  departmentName: '',
  fiscalYear: '2027',
  teamDescription: '',
  responsibilities: '',
  teamTenets: '',
  departmentHead: '',
  aiStrategyOverview: '',
  
  // Section 2: Metrics
  businessMetrics: [],
  aiPerformanceMetrics: [],
  
  // Section 3: Prior Year Review
  metricsCommentary: '',
  priorYearOutcomes: '',
  priorYearLearnings: '',
  industryTrends: '',
  performanceAnalysis: '',
  aiToolsPiloted: '',
  aiKeyWins: '',
  aiMissesChallenges: '',
  aiMeasurableImpacts: '',
  
  // Section 4: Initiatives
  initiatives: [],
  resourceAllocation: {
    baseline: [],
    incremental: []
  },
  hcJustification: {
    hcIncreasesJustification: '',
    hcReductionsExplanation: ''
  },
  
  // Section 5: AI-Enabled Workforce Planning
  aiEnabledWorkforce: {
    tasksAugmentedByAI: '',
    expectedProductivityImprovement: '',
    skillsDevelopmentNeeded: '',
    hcIncreasesJustificationResources: '',
    workforceTable: [],
    nonHeadcountCosts: [],
    aiCostBenefitAnalysis: []
  },
  
  // Section 6: File Uploads
  historicalData: [],
  budgetData: [],
  supportingDocuments: [],
  
  // Section 7: Appendix FAQs
  appendixFAQs: []
})

export const createDefaultInitiative = (): Initiative => ({
  id: Date.now().toString(),
  name: '',
  description: '',
  owner: '',
  startDate: '',
  endDate: '',
  isBaseline: false,
  priority: 'medium',
  aiIntegrationPlan: '',
  aiToolsUsed: '',
  totalCost: 0,
  aiCostImpact: 0,
  keyOutputMetrics: ''
})

export const createDefaultWorkforceRow = (): WorkforceRow => ({
  id: Date.now().toString(),
  roleLevel: '',
  fy2026CurrentHc: 0,
  fy2027PlannedHc: 0,
  hcChange: 0,
  aiToolsLeveraged: '',
  tasksAugmented: '',
  expectedProductivityGains: '',
  skillsDevelopmentRequired: '',
  aiAugmentationStrategy: ''
})

export const createDefaultAICostBenefit = (): AICostBenefitAnalysis => ({
  id: Date.now().toString(),
  aiExpenseVendor: '',
  annualCost: 0,
  expectedSavingsBenefit: 0,
  paybackPeriod: '',
  netBenefit: 0,
  roiPercentage: 0
})

