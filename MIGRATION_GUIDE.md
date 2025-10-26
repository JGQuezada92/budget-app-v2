# AOP FY27 Migration Guide

**Version:** 2.0  
**Last Updated:** October 10, 2025  
**Migration Complexity:** High - Significant structural changes

---

## 📋 Overview of Changes

FY27 introduces **significant AI-focused requirements across all sections** - this is not just a fiscal year update. The template has been fundamentally restructured to capture AI adoption strategy, measure AI impact, and justify headcount decisions in an AI-enabled environment.

### Major Themes:
- 🤖 **AI Integration**: Every section now requires AI strategy and impact documentation
- 📊 **Enhanced Metrics**: New AI Performance Metrics table required
- 👥 **AI-Enabled Workforce**: Workforce planning restructured around AI augmentation
- 💰 **ROI Focus**: AI cost-benefit analysis mandatory
- 📈 **Strategic Depth**: 12 new FAQ questions including competitive AI analysis

### Breaking Changes:
- ⚠️ **Cannot auto-migrate** - Manual review and enhancement required
- ⚠️ Section 5 completely restructured (not backwards compatible)
- ⚠️ New mandatory fields in all sections (1-5, 7)
- ⚠️ Database schema changes (see SQL section)

---

## 🔄 Section-by-Section Migration

### Section 1: Introduction ✏️

#### **Changes Summary:**
- **NEW REQUIRED:** AI Strategy Overview (200-400 characters recommended)
- **UPDATED:** Fiscal year dropdown (now FY25-27)
- **UNCHANGED:** Department, team description, responsibilities, tenets, department head

#### **Migration Steps:**

**Step 1:** Keep all existing introduction data
```typescript
// KEEP AS-IS:
departmentName: "Finance"
teamDescription: "Existing description..."
responsibilities: "Existing responsibilities..."
teamTenets: "Existing tenets..."
departmentHead: "John Smith - CFO"
```

**Step 2:** Update fiscal year
```typescript
// UPDATE:
fiscalYear: "2025" → "2027"
```

**Step 3:** ADD AI Strategy Overview (NEW REQUIRED)
```typescript
// ADD NEW FIELD:
aiStrategyOverview: "We will deploy [specific AI tools] across [X%] of workflows, targeting [specific efficiency gains]. Expected impact: [quantified outcomes]."
```

**Example AI Strategy:**
```
"We will deploy ChatGPT Enterprise for report generation (80% of team), 
Claude for data analysis (60% adoption), and Excel AI for forecasting. 
Target 35% reduction in manual data entry, 50% faster close process, and 
real-time financial insights vs. monthly reports. Expected productivity 
increase of 25-30% enabling 5 additional strategic projects without HC growth."
```

**Validation:**
- ✅ Minimum 50 characters (recommended 200-400)
- ✅ Should mention: (1) Specific tools, (2) % adoption target, (3) Expected impact

**Effort:** 15-30 minutes

---

### Section 2: Metrics 📊

#### **Changes Summary:**
- **MAJOR CHANGE:** Column structure updated from FY23-26 to FY25-27
- **NEW TABLE:** AI Performance Metrics (minimum 2 required)
- **NEW COLUMNS:** FY25 Actual, YOY %, FY26 YTD Actual, FY26 YTD YOY %, FY27 Plan, FY27 Plan YOY %

#### **Migration Steps:**

**Step 1:** Shift existing metrics forward 2 years

**OLD STRUCTURE:**
```
Metric Name | FY23 Actual | FY24 Expected | YTD YOY % | FY25 Plan | FY25 YOY % | FY26 Plan | FY26 YOY %
```

**NEW STRUCTURE:**
```
Metric Name | FY25 Actual | FY25 Plan | YOY % | FY26 YTD Actual | FY26 YTD YOY % | FY27 Plan | FY27 Plan YOY %
```

**Data Mapping:**
```typescript
// SHIFT DATA FORWARD:
OLD.fy2023_actual    → NEW.fy2025_actual
OLD.fy2024_expected  → (discard - use FY26 YTD instead)
OLD.fy2025_plan      → NEW.fy2025_plan
OLD.fy2026_plan      → NEW.fy2027_plan

// CALCULATE NEW FIELDS:
NEW.fy2026_ytd_actual = [Current YTD performance]
NEW.yoy_percent = ((fy2025_actual - fy2025_plan) / fy2025_plan) * 100
```

**Step 2:** CREATE AI Performance Metrics table (NEW)

Select minimum 2 metrics from:
- Tasks completed per FTE (AI-enabled)
- % of workflows with AI augmentation
- Hours saved per month via AI tools
- Cost reduction from AI automation
- AI tool adoption rate (% of team)
- Manual processes automated/made efficient using AI

**Example:**
```csv
AI Metric,FY25 Actual,FY26 YTD,FY27 Target,Expected Impact
% workflows with AI,10,35,70,"Enable 30% faster processing, reduce manual work by 40%"
Hours saved/month,50,180,450,"Equivalent to 2.8 FTE, redirected to strategic work"
```

**Validation:**
- ✅ Minimum 2 AI metrics selected
- ✅ FY27 targets should be realistic (15-30% gains typical)
- ✅ Expected Impact must be descriptive

**Effort:** 45-60 minutes (data shifting + new AI metrics creation)

---

### Section 3: Prior Year Review 📝

#### **Changes Summary:**
- **NEW REQUIRED:** Section e) Performance Analysis
- **NEW SECTION:** AI-Specific Retrospective (4 required fields)
- **RENAMED:** Section a) now "Key Metrics Commentary" (was implicit)
- **UNCHANGED:** Sections b-d (outcomes, learnings, trends)

#### **Migration Steps:**

**Step 1:** Keep existing data
```typescript
// KEEP AS-IS:
priorYearOutcomes: "Existing outcomes..."
priorYearLearnings: "Existing learnings..."
industryTrends: "Existing trends..."
```

**Step 2:** ADD Metrics Commentary (NEW - section a)
```typescript
// ADD NEW:
metricsCommentary: "Provide context on metrics performance, explain variances..."
```

**Step 3:** ADD Performance Analysis (NEW - section e)
```typescript
// ADD NEW:
performanceAnalysis: "Were targets achieved? Initiatives executed efficiently? Explain gaps..."
```

**Example:**
```
"FY26 targets: 45 features planned vs. 38 delivered (84% achievement). 
Gap due to 2-month delay in payment system project. Infrastructure uptime 
99.92% exceeded 99.9% target. Cost: $920K actual vs. $1M planned (8% under 
budget) due to AI tools reducing contractor needs by $80K."
```

**Step 4:** CREATE AI-Specific Retrospective (4 fields - NEW)

```typescript
// ALL NEW REQUIRED FIELDS:
aiToolsPiloted: "List ALL AI tools used. If none, explain why and FY27 plans..."

aiKeyWins: "Describe 2-3 specific successes with measurable impact. 
Example: 'Reduced code review time by 30% using GitHub Copilot, saving 15 hours/week'"

aiMissesChallenges: "Identify what didn't work, adoption barriers encountered..."

aiMeasurableImpacts: "Quantify cost reductions, efficiency gains, innovation acceleration. 
MUST include at least 2 metrics with numbers. Example: '$50K annual savings, 25% time reduction'"
```

**Validation:**
- ✅ All 9 fields required (5 traditional + 4 AI retrospective)
- ✅ AI Key Wins must have 2+ specific examples
- ✅ AI Measurable Impacts must include numbers/percentages

**Effort:** 90-120 minutes (new AI content creation requires research and data)

---

### Section 4: Key Initiatives 🎯

#### **Changes Summary:**
- **NEW REQUIRED PER INITIATIVE:** AI Integration Plan (150+ characters recommended)
- **NEW FIELDS:** AI Tools Used, Total Cost, AI Cost Impact, Key Output Metrics
- **NEW SECTION:** HC Justification (2 text fields)
- **NEW TABLES:** Monthly Resource Allocation (Baseline + Incremental)
- **NEW UI:** 3-tab layout (Details, Resources, Justification)

#### **Migration Steps:**

**Step 1:** For EACH existing initiative, ADD AI Integration Plan

```typescript
// EXISTING INITIATIVE:
{
  name: "Payment System Modernization",
  description: "Migrate to new payment processor...",
  owner: "Jane Doe",
  startDate: "2025-01-15",
  endDate: "2025-09-30",
  isBaseline: false,
  priority: "high"
}

// ADD THESE FIELDS:
{
  ...existingFields,
  
  // REQUIRED:
  aiIntegrationPlan: "Leverage Claude for API documentation generation, reducing 
    documentation time by 60%. GitHub Copilot for integration code, accelerating 
    development by 25%. AI-powered testing tools to automate 50% of regression tests. 
    Expected to save 8 FTE hours/week across project.",
  
  // OPTIONAL BUT RECOMMENDED:
  aiToolsUsed: "Claude, GitHub Copilot, AI Testing Tools",
  totalCost: 280000,
  aiCostImpact: 95000, // Expected savings/efficiency from AI
  keyOutputMetrics: "Reduce payment processing time from 3s to 1s, 99.9% uptime"
}
```

**Step 2:** CREATE HC Justification section

```typescript
// NEW SECTION (only if initiatives request HC changes):
hcJustification: {
  hcIncreasesJustification: "For any HC increases, explain why AI insufficient...",
  hcReductionsExplanation: "For any HC decreases, explain how AI maintains output..."
}
```

**Example Justification for HC Increase:**
```
"Requesting 2 Senior Engineers despite 30% AI productivity gains because: 
(1) Business growth of 60% exceeds AI capacity boost of 30%, (2) AI cannot 
replace senior judgment for architecture decisions, (3) Need specialized 
mobile expertise not augmentable by AI, (4) AI improves efficiency on routine 
tasks but we need more people for strategic work."
```

**Step 3:** CREATE Monthly Resource Allocation Tables

```typescript
// NEW: BASELINE ALLOCATION (for ongoing initiatives)
resourceAllocation: {
  baseline: [
    {
      initiativeId: "init-1",
      initiativeName: "Tech Debt Reduction",
      allocationType: "baseline",
      january: 3.5, february: 3.5, march: 4.0, ...
      totalFtes: 39.0
    }
  ],
  
  // NEW: INCREMENTAL ALLOCATION (for new initiatives)
  incremental: [
    {
      initiativeId: "init-2",
      initiativeName: "Mobile App Redesign",
      allocationType: "incremental",
      january: 1.0, february: 2.0, march: 2.5, ...
      totalFtes: 20.5
    }
  ]
}
```

**Validation:**
- ✅ Every initiative needs AI Integration Plan
- ✅ HC increases require justification
- ✅ Resource allocation by month for all initiatives

**Effort:** 60-90 minutes per initiative + 30 minutes for resource allocation

---

### Section 5: Resources 🏗️

#### **Changes Summary:**
- **COMPLETE RESTRUCTURE** - Cannot directly migrate
- **NEW:** 4 required text fields (AI strategy questions)
- **NEW TABLE:** AI-Enabled Workforce Planning (9 columns, role-by-role AI strategy)
- **ENHANCED TABLE:** Non-Headcount Costs (now includes AI categories)
- **NEW TABLE:** AI Cost-Benefit Analysis (minimum 2 entries)

#### **Migration Steps:**

**CANNOT AUTO-MIGRATE** - Must rebuild from scratch

**Step 1:** DELETE old simple headcount fields
```typescript
// OLD (DELETE):
currentHeadcount: "45"
plannedHeadcount: "48"
hiringPlan: "Planning to add 3 senior engineers..."
technologyNeeds: "Need new AWS services..."
```

**Step 2:** CREATE 4 new required text fields

```typescript
// NEW REQUIRED STRUCTURE:
aiEnabledWorkforce: {
  tasksAugmentedByAI: "List tasks AI will handle: code generation, testing, 
    documentation, log analysis, query optimization...",
  
  expectedProductivityImprovement: "25-30% increase per engineer. Breakdown: 
    code writing 35% faster, testing 40% faster, documentation 75% faster...",
  
  skillsDevelopmentNeeded: "AI prompt engineering training (40 hours), GitHub 
    Copilot certification, Claude API workshop, change management training...",
  
  hcIncreasesJustificationResources: "If requesting HC increases, justify 
    despite AI availability..."
}
```

**Step 3:** CREATE Workforce Planning Table (NEW)

```typescript
workforceTable: [
  {
    id: "1",
    roleLevel: "Senior Engineers",
    fy2026CurrentHc: 12,
    fy2027PlannedHc: 14,
    hcChange: 2, // Auto-calculated
    aiToolsLeveraged: "GitHub Copilot, Cursor, Claude",
    tasksAugmented: "Code writing, review, documentation",
    expectedProductivityGains: "30%",
    skillsDevelopmentRequired: "Advanced prompt engineering",
    aiAugmentationStrategy: "AI handles boilerplate, seniors focus on architecture..."
  },
  // Add row for each role type in your team
]
```

**Step 4:** UPDATE Non-Headcount Costs table

```typescript
// ADD NEW AI-SPECIFIC CATEGORIES:
nonHeadcountCosts: [
  { category: "Contractors", fy2026Actual: 180000, fy2027Plan: 100000 },
  { category: "SaaS Products", fy2026Actual: 240000, fy2027Plan: 260000 },
  
  // NEW FY27 CATEGORIES:
  { category: "AI Tool Licenses", fy2026Actual: 42000, fy2027Plan: 118000 },
  { category: "AI Training/Enablement", fy2026Actual: 25000, fy2027Plan: 85000 },
  // ... other categories
]
```

**Step 5:** CREATE AI Cost-Benefit Analysis (NEW)

```typescript
aiCostBenefitAnalysis: [
  {
    id: "1",
    aiExpenseVendor: "GitHub Copilot Enterprise",
    annualCost: 22464,
    expectedSavingsBenefit: 185000,
    paybackPeriod: "1.5 months"
  },
  {
    id: "2",
    aiExpenseVendor: "Claude API",
    annualCost: 45000,
    expectedSavingsBenefit: 165000,
    paybackPeriod: "3 months"
  }
  // Minimum 2 entries required
]
```

**Validation:**
- ✅ All 4 text fields required
- ✅ Minimum 1 workforce planning row
- ✅ Minimum 2 AI cost-benefit entries
- ✅ HC justification required if planned > current

**Effort:** 2-3 hours (most complex migration)

---

### Section 6: File Uploads 📁

#### **Changes Summary:**
- **NO STRUCTURAL CHANGES**
- **ENHANCED:** AI analysis now uses files for P&L analysis

#### **Migration Steps:**

**No migration needed** - existing file uploads work as-is.

**Note:** AI analyst now performs more sophisticated analysis on uploaded data:
- Variance analysis (historical vs. budget)
- Trend detection
- Feasibility assessment
- P&L analysis from Appendix 1 uploads

**Effort:** 0 minutes (no changes)

---

### Section 7: Appendix FAQs ❓

#### **Changes Summary:**
- **COMPLETELY NEW SECTION**
- **12 Questions:** 8 required, 4 optional
- **AI Focus:** 2 questions specifically about AI strategy

#### **Migration Steps:**

**CREATE new section from scratch** - Answer 12 strategic questions:

**Required Questions (8):**
1. Most important decisions needed
2. Biggest needle mover
3. Disruptive ideas
4. Initiatives not included (and why)
5. Surprises in FY26 and measures taken
6. Top misses and learnings
7. **How competitors using AI** (AI-focused)
8. **What you'd do with 50% more AI budget** (AI-focused)

**Optional Questions (4):**
9. Programs without single-threaded leaders
10. Partner dependencies (>20%)
11. Dependencies you wish you controlled
12. "Dogs not barking" (blind spots)

**Example Answers:**

**Q: How are competitors using AI?**
```
"GitHub using AI Copilot internally with 95% adoption driving 40% productivity 
gains (vs. our 85% adoption, 25% gains). Vercel integrated AI deeply into 
platform - automated deployments, error detection. We're behind on: (1) Dedicated 
AI Engineering teams (they have 5-10 people, we have 0), (2) Custom AI model 
training on codebase - they build proprietary tools, we use generic. Need to 
invest in AI customization or risk widening productivity gap."
```

**Q: What would you do with 50% more AI budget?**
```
"With additional $102K (50% more than $203K budget), would invest in: 
(1) Custom AI model fine-tuning on our codebase ($85K) - increase suggestion 
accuracy from 60% to 85%, add 10% productivity. (2) AI DevOps automation ($45K) - 
auto-scaling, cost optimization, save $150K annually. (3) Premium Claude Enterprise 
($35K) - larger context, better quality. Total additional benefit: $380K on $102K 
investment (373% ROI)."
```

**Validation:**
- ✅ All 8 required questions must have answers
- ✅ Answers should be substantive (50+ words recommended)
- ✅ AI-focused questions should include specific metrics

**Effort:** 90-120 minutes (requires strategic thinking)

---

## 🗄️ Database Schema Changes

### SQL Migration Script:

```sql
-- ============================================
-- FY27 DATABASE MIGRATION
-- Run these ALTER statements on existing database
-- ============================================

-- 1. UPDATE aop_submissions table
ALTER TABLE aop_submissions 
  ADD COLUMN IF NOT EXISTS ai_strategy_overview TEXT;

-- 2. UPDATE aop_metrics table (add new columns, keep old for compatibility)
ALTER TABLE aop_metrics 
  ADD COLUMN IF NOT EXISTS fy2025_actual DECIMAL,
  ADD COLUMN IF NOT EXISTS yoy_percent DECIMAL,
  ADD COLUMN IF NOT EXISTS fy2026_ytd_actual DECIMAL,
  ADD COLUMN IF NOT EXISTS fy2026_ytd_yoy_percent DECIMAL,
  ADD COLUMN IF NOT EXISTS fy2027_plan DECIMAL,
  ADD COLUMN IF NOT EXISTS fy2027_plan_yoy_percent DECIMAL;

-- 3. CREATE ai_performance_metrics table (NEW)
CREATE TABLE IF NOT EXISTS ai_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES aop_submissions(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_type TEXT,
  fy2025_actual DECIMAL,
  fy2026_ytd DECIMAL,
  fy2027_target DECIMAL,
  expected_impact TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. UPDATE initiatives table
ALTER TABLE initiatives 
  ADD COLUMN IF NOT EXISTS ai_integration_plan TEXT,
  ADD COLUMN IF NOT EXISTS ai_tools_used TEXT,
  ADD COLUMN IF NOT EXISTS ai_efficiency_gains TEXT,
  ADD COLUMN IF NOT EXISTS total_cost DECIMAL,
  ADD COLUMN IF NOT EXISTS ai_cost_impact DECIMAL,
  ADD COLUMN IF NOT EXISTS key_output_metrics TEXT;

-- 5. CREATE monthly_resource_allocation table (NEW)
CREATE TABLE IF NOT EXISTS monthly_resource_allocation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id UUID REFERENCES initiatives(id) ON DELETE CASCADE,
  allocation_type TEXT,
  january DECIMAL, february DECIMAL, march DECIMAL, april DECIMAL,
  may DECIMAL, june DECIMAL, july DECIMAL, august DECIMAL,
  september DECIMAL, october DECIMAL, november DECIMAL, december DECIMAL,
  total_ftes DECIMAL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. CREATE prior_year_analysis table (NEW)
CREATE TABLE IF NOT EXISTS prior_year_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES aop_submissions(id) ON DELETE CASCADE,
  metrics_commentary TEXT,
  key_outcomes TEXT,
  wins_mistakes_learnings TEXT,
  industry_trends TEXT,
  performance_analysis TEXT,
  ai_tools_piloted TEXT,
  ai_key_wins TEXT,
  ai_misses_challenges TEXT,
  ai_measurable_impacts TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. CREATE ai_workforce_planning table (NEW)
CREATE TABLE IF NOT EXISTS ai_workforce_planning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES aop_submissions(id) ON DELETE CASCADE,
  role_level TEXT,
  fy2026_current_hc INTEGER,
  fy2027_planned_hc INTEGER,
  hc_change INTEGER,
  ai_tools_leveraged TEXT,
  tasks_augmented TEXT,
  expected_productivity_gains TEXT,
  skills_development_needed TEXT,
  ai_augmentation_strategy TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. CREATE non_headcount_costs table (NEW)
CREATE TABLE IF NOT EXISTS non_headcount_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES aop_submissions(id) ON DELETE CASCADE,
  cost_category TEXT,
  fy2026_actual DECIMAL,
  fy2027_plan DECIMAL,
  change_amount DECIMAL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. CREATE ai_cost_benefit_analysis table (NEW)
CREATE TABLE IF NOT EXISTS ai_cost_benefit_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES aop_submissions(id) ON DELETE CASCADE,
  ai_expense_vendor TEXT,
  annual_cost DECIMAL,
  expected_savings_benefit DECIMAL,
  payback_period TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. CREATE appendix_faqs table (NEW)
CREATE TABLE IF NOT EXISTS appendix_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES aop_submissions(id) ON DELETE CASCADE,
  question_key TEXT,
  question TEXT,
  answer TEXT,
  required BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_performance_metrics_submission_id 
  ON ai_performance_metrics(submission_id);
CREATE INDEX IF NOT EXISTS idx_monthly_resource_allocation_initiative_id 
  ON monthly_resource_allocation(initiative_id);
CREATE INDEX IF NOT EXISTS idx_prior_year_analysis_submission_id 
  ON prior_year_analysis(submission_id);
CREATE INDEX IF NOT EXISTS idx_ai_workforce_planning_submission_id 
  ON ai_workforce_planning(submission_id);
CREATE INDEX IF NOT EXISTS idx_non_headcount_costs_submission_id 
  ON non_headcount_costs(submission_id);
CREATE INDEX IF NOT EXISTS idx_ai_cost_benefit_analysis_submission_id 
  ON ai_cost_benefit_analysis(submission_id);
CREATE INDEX IF NOT EXISTS idx_appendix_faqs_submission_id 
  ON appendix_faqs(submission_id);
```

**Run Migration:**
```bash
# If using PostgreSQL/Supabase:
psql -U your_user -d your_database -f schema.sql

# If using SQLite:
sqlite3 your_database.db < schema.sql
```

---

## 📊 FormData Structure Changes

### OLD FormData Structure (FY25/FY26):
```typescript
{
  departmentName: string,
  fiscalYear: string,
  teamDescription: string,
  // ... 5 more intro fields
  
  priorYearOutcomes: string,
  priorYearLearnings: string,
  industryTrends: string,
  
  currentHeadcount: string,
  plannedHeadcount: string,
  hiringPlan: string,
  
  historicalData: [],
  budgetData: [],
  supportingDocuments: []
  // ~15 total fields
}
```

### NEW FormData Structure (FY27):
```typescript
{
  // Section 1 (7 fields)
  departmentName, fiscalYear, teamDescription, responsibilities, 
  teamTenets, departmentHead, aiStrategyOverview,
  
  // Section 2 (2 arrays)
  businessMetrics: BusinessMetric[],
  aiPerformanceMetrics: AIPerformanceMetric[],
  
  // Section 3 (9 fields)
  metricsCommentary, priorYearOutcomes, priorYearLearnings, 
  industryTrends, performanceAnalysis,
  aiToolsPiloted, aiKeyWins, aiMissesChallenges, aiMeasurableImpacts,
  
  // Section 4 (3 objects)
  initiatives: Initiative[],
  resourceAllocation: { baseline: [], incremental: [] },
  hcJustification: { hcIncreasesJustification, hcReductionsExplanation },
  
  // Section 5 (1 complex object)
  aiEnabledWorkforce: {
    tasksAugmentedByAI, expectedProductivityImprovement,
    skillsDevelopmentNeeded, hcIncreasesJustificationResources,
    workforceTable: [], nonHeadcountCosts: [], aiCostBenefitAnalysis: []
  },
  
  // Section 6 (3 arrays - unchanged)
  historicalData: [], budgetData: [], supportingDocuments: [],
  
  // Section 7 (1 array)
  appendixFAQs: AppendixFAQ[]
  
  // ~50+ total fields/objects
}
```

**Migration Function Example:**
```typescript
function migrateFY25toFY27(oldData: any): FormState {
  return {
    // Map old fields to new structure
    departmentName: oldData.departmentName,
    fiscalYear: "2027",
    teamDescription: oldData.teamDescription,
    // ... map existing fields
    
    // ADD NEW REQUIRED FIELDS (must be filled manually):
    aiStrategyOverview: "", // MANUAL INPUT REQUIRED
    businessMetrics: [], // MANUAL INPUT REQUIRED
    aiPerformanceMetrics: [], // MANUAL INPUT REQUIRED
    performanceAnalysis: "", // MANUAL INPUT REQUIRED
    aiToolsPiloted: "", // MANUAL INPUT REQUIRED
    // ... all new AI fields
  }
}
```

---

## ✅ Validation Changes

### NEW Validation Rules for FY27:

**1. Introduction Section:**
```typescript
// NEW:
- aiStrategyOverview required (min 50 chars, recommended 200-400)
- Must mention specific AI tools and % targets
```

**2. Metrics Section:**
```typescript
// NEW:
- Minimum 2 AI Performance Metrics selected
- AI metrics must have expectedImpact descriptions
- FY27 targets required for AI metrics
```

**3. Prior Year Review:**
```typescript
// NEW:
- 5 additional required fields (total 9 vs. 4)
- AI Key Wins must have 2+ specific examples
- AI Measurable Impacts must include numbers/metrics
```

**4. Initiatives:**
```typescript
// NEW:
- Every initiative requires AI Integration Plan (min 50 chars)
- HC increases require justification in AI context
- Monthly resource allocation tables required
```

**5. Resources:**
```typescript
// NEW:
- 4 required AI strategy text fields
- Minimum 1 workforce planning row
- Minimum 2 AI cost-benefit entries
- HC justification conditional on HC increases
```

**6. Appendix FAQs:**
```typescript
// NEW:
- All 8 required questions must be answered
- Answers must be substantive (10+ words minimum)
- AI-focused questions should include metrics
```

---

## ⏱️ Estimated Migration Effort

### By Section:
| Section | Complexity | Time Estimate | Notes |
|---------|-----------|---------------|--------|
| 1. Introduction | Low | 15-30 min | Add AI strategy overview |
| 2. Metrics | Medium | 45-60 min | Shift data, create AI metrics |
| 3. Prior Year | High | 90-120 min | Add 5 new fields with AI content |
| 4. Initiatives | High | 60-90 min/initiative | AI plans, justification, allocation |
| 5. Resources | Very High | 2-3 hours | Complete rebuild required |
| 6. Files | None | 0 min | No changes needed |
| 7. Appendix | High | 90-120 min | Create new section, answer 12 questions |

### Total Per Submission:
- **Minimum:** 6-8 hours (simple department, few initiatives)
- **Average:** 8-12 hours (typical department)
- **Complex:** 12-16 hours (large department, many initiatives)

### Breakdown by Activity:
- **Data entry/shifting:** 2-3 hours (30%)
- **AI content creation:** 4-6 hours (50%)
- **Strategic thinking (FAQs):** 2-3 hours (20%)

---

## 📝 Complete Migration Checklist

### Pre-Migration:
- [ ] Backup existing database
- [ ] Run schema.sql to create new tables
- [ ] Test on non-production environment first
- [ ] Review sample data files for examples
- [ ] Gather AI adoption data from FY26

### Section 1: Introduction
- [ ] Keep existing 6 fields
- [ ] Update fiscal year to 2027
- [ ] Write AI Strategy Overview (200-400 chars)
- [ ] Include: tools, % adoption, expected impact
- [ ] Validate: min 50 characters

### Section 2: Metrics
- [ ] Shift business metrics from FY23-26 to FY25-27
- [ ] Add FY26 YTD actual data
- [ ] Recalculate all YOY percentages
- [ ] Select minimum 2 AI Performance Metrics
- [ ] Fill FY25 actual, FY26 YTD, FY27 target for each
- [ ] Write expected impact for each AI metric
- [ ] Validate: 2+ AI metrics selected

### Section 3: Prior Year Review
- [ ] Keep existing 4 sections (b, c, d)
- [ ] Add metrics commentary (section a)
- [ ] Add performance analysis (section e)
- [ ] Write AI tools piloted (list all tools used)
- [ ] Write AI key wins (2-3 specific examples with metrics)
- [ ] Write AI misses/challenges (honest assessment)
- [ ] Write AI measurable impacts (2+ quantified metrics)
- [ ] Validate: All 9 fields complete

### Section 4: Initiatives
- [ ] For EACH initiative:
  - [ ] Add AI Integration Plan (150+ chars)
  - [ ] Add AI tools used
  - [ ] Add total cost
  - [ ] Add AI cost impact
  - [ ] Add key output metrics
- [ ] Create monthly resource allocation (baseline table)
- [ ] Create monthly resource allocation (incremental table)
- [ ] Write HC increases justification (if applicable)
- [ ] Write HC reductions explanation (if applicable)
- [ ] Validate: All initiatives have AI plans

### Section 5: Resources
- [ ] Answer: Which tasks augmented/automated by AI?
- [ ] Answer: Expected productivity improvement per FTE
- [ ] Answer: Skills development needed
- [ ] Answer: HC increases justification (if increasing HC)
- [ ] Create workforce planning table (1 row per role type)
- [ ] For each role: current HC, planned HC, AI tools, strategy
- [ ] Fill non-headcount costs table (include AI categories)
- [ ] Create AI cost-benefit analysis (2+ entries)
- [ ] For each: vendor, cost, benefit, payback period
- [ ] Validate: All required fields complete, 2+ AI cost entries

### Section 6: File Uploads
- [ ] Keep existing file uploads (no changes needed)
- [ ] Consider uploading updated FY27 budget files

### Section 7: Appendix FAQs
- [ ] Answer Question 1: Most important decisions
- [ ] Answer Question 2: Biggest needle mover
- [ ] Answer Question 3: Disruptive ideas
- [ ] Answer Question 4: Initiatives not included
- [ ] Answer Question 5: Surprises in FY26
- [ ] Answer Question 6: Top misses and learnings
- [ ] Answer Question 7: Competitors using AI (AI-FOCUSED)
- [ ] Answer Question 8: 50% more AI budget scenario (AI-FOCUSED)
- [ ] Answer optional questions 9-12 (recommended)
- [ ] Validate: All 8 required questions answered

### Post-Migration:
- [ ] Run validation on complete form
- [ ] Review all AI-related fields for consistency
- [ ] Verify ROI calculations make sense
- [ ] Check that HC justifications align with AI strategy
- [ ] Test submission process
- [ ] Verify AI analysis works with new data structure

---

## 🧪 Testing After Migration

### Step 1: Validation Testing
```typescript
import { validateCompleteSubmission } from '@/lib/form-validation'

const result = validateCompleteSubmission(migratedFormData)
console.log('Validation Result:', result)
console.log('Errors:', result.errors)
console.log('Warnings:', result.warnings)
console.log('Completion:', result.completionPercentage)
```

**Expected Results:**
- ✅ `isValid: true`
- ✅ `errors: []`
- ✅ `completionPercentage: 100`
- ⚠️ Some warnings acceptable (e.g., "could add more detail")

### Step 2: AI Analysis Testing
```typescript
// Submit form and verify AI analysis runs
await handleSubmit()

// Check analysis results
const analysis = localStorage.getItem('latestAnalysis')
console.log('AI Analysis:', JSON.parse(analysis))
```

**Expected Results:**
- ✅ AI analysis completes without errors
- ✅ `aiReadinessScore` between 0-100
- ✅ `kpiSuggestions` array populated
- ✅ All 8 analysis sections present

### Step 3: Dashboard Display Testing
```typescript
// Navigate to /dashboard
// Verify migrated submission displays correctly

// Check:
- ✅ AI Readiness Score shows circular progress
- ✅ KPI Suggestions tab populated
- ✅ FY27 badge appears
- ✅ Completion percentage shows 100%
```

### Step 4: Admin Dashboard Testing
```typescript
// Navigate to /admin
// Verify aggregated data includes migrated submission

// Check:
- ✅ Department appears in table with FY27 badge
- ✅ AI Readiness Score displayed
- ✅ AI Investment and Expected Savings shown
- ✅ Charts include migrated data
```

---

## 🔙 Rollback Plan

### If Migration Fails:

**1. Database Rollback:**
```sql
-- Restore from backup
pg_restore -U your_user -d your_database backup.sql

-- Or manually drop new tables:
DROP TABLE IF EXISTS ai_performance_metrics CASCADE;
DROP TABLE IF EXISTS monthly_resource_allocation CASCADE;
DROP TABLE IF EXISTS prior_year_analysis CASCADE;
DROP TABLE IF EXISTS ai_workforce_planning CASCADE;
DROP TABLE IF EXISTS non_headcount_costs CASCADE;
DROP TABLE IF EXISTS ai_cost_benefit_analysis CASCADE;
DROP TABLE IF EXISTS appendix_faqs CASCADE;

-- Remove new columns:
ALTER TABLE aop_submissions DROP COLUMN IF EXISTS ai_strategy_overview;
ALTER TABLE initiatives DROP COLUMN IF EXISTS ai_integration_plan;
-- etc.
```

**2. Code Rollback:**
```bash
# Revert to FY25/FY26 version
git checkout previous-version

# Or restore specific files
git checkout HEAD~1 src/components/submission/
git checkout HEAD~1 schema.sql
```

**3. Data Recovery:**
```typescript
// Restore old formData structure from localStorage backup
const oldSubmission = localStorage.getItem('submissionBackup_FY26')
if (oldSubmission) {
  setFormData(JSON.parse(oldSubmission))
}
```

---

## 🚨 Common Migration Issues

### Issue 1: AI Strategy Overview Too Generic
**Problem:** "We will use AI to improve productivity"  
**Solution:** Be specific - mention tools, percentages, outcomes
**Example:** "Deploy GitHub Copilot (100% of team), Claude (80% adoption), targeting 30% code review reduction and 25% faster development"

### Issue 2: Missing AI Retrospective Data
**Problem:** Department hasn't used AI tools yet  
**Solution:** Explain why and describe FY27 adoption plan
**Example:** "No AI tools piloted in FY26 due to budget constraints and security concerns. FY27 plan: pilot GitHub Copilot with 5 engineers (Q1), expand to 50% team (Q2), full rollout (Q3)."

### Issue 3: Can't Justify HC Increases with AI
**Problem:** Requesting HC but claiming high AI productivity gains  
**Solution:** Show business growth exceeds AI capacity or explain AI limitations
**Example:** "While AI provides 30% productivity boost, business demand growing 60%. AI handles routine tasks but can't replace senior judgment for architecture decisions."

### Issue 4: AI Cost-Benefit Shows Negative ROI
**Problem:** AI costs > expected benefits  
**Solution:** Either reduce cost or better quantify benefits
**Example:** Include indirect benefits - faster time-to-market, improved quality, developer happiness, talent retention

### Issue 5: FAQ Answers Too Brief
**Problem:** One-sentence answers to strategic questions  
**Solution:** Provide detailed, thoughtful responses with examples
**Guideline:** Aim for 50-150 words per answer, include specific metrics

---

## 📈 Best Practices for Successful Migration

### 1. Start with AI Data Collection
**Before migrating, gather:**
- List of all AI tools used (or plan to use)
- Actual productivity metrics from FY26 pilots
- Cost data for AI tool licenses
- Employee feedback on AI adoption
- Measured time savings or efficiency gains

### 2. Use Realistic AI Productivity Estimates
**Industry Benchmarks:**
- Code generation: 20-40% faster
- Code review: 25-35% reduction in time
- Testing: 30-50% automation of manual tests
- Documentation: 60-80% faster generation
- Overall developer productivity: 15-30%

**Don't claim:** 5x or 10x productivity (unrealistic)

### 3. Be Honest About Challenges
**Include in AI Retrospective:**
- Learning curves (2-3 months typical)
- Adoption resistance (especially from senior staff)
- Cost overruns (AI tools often more expensive than expected)
- Quality issues (AI suggestions need review)
- Change management difficulties

### 4. Align Numbers Across Sections
**Ensure consistency:**
- AI savings in Section 2 metrics = Sum of Section 5 cost-benefit
- HC changes in Section 4 = HC changes in Section 5 workforce table
- AI tools mentioned in Introduction = Tools in initiatives and workforce planning
- Productivity claims supported by actual metrics

### 5. Leverage Sample Data
**Use as templates:**
- `sample-data/` CSV files show expected data structure
- `src/lib/sample-data.ts` shows complete submission example
- Copy phrasing and structure, customize for your department

---

## 🎓 Training Recommendations

### For Department Heads:
- **Time commitment:** 2-4 hours to understand new template
- **Focus areas:** AI strategy articulation, ROI calculations, strategic FAQ responses
- **Resources:** Review `sample-data/README.md` and sample FAQs

### For Finance/Operations Completing Forms:
- **Time commitment:** 8-12 hours per submission
- **Focus areas:** Data accuracy, AI metric selection, workforce planning
- **Resources:** Review `src/lib/sample-data.ts` for examples

### For IT/Admin Support:
- **Time commitment:** 4-6 hours for technical setup
- **Focus areas:** Database migration, schema updates, testing
- **Resources:** Review `schema.sql` and this guide's SQL section

---

## 📞 Support & Resources

### Documentation:
- **This Guide:** Complete migration instructions
- **README.md:** Project overview and setup
- **schema.sql:** Database structure
- **sample-data/README.md:** Sample file documentation
- **src/types/aop.ts:** TypeScript type definitions

### Sample Data Files:
- `sample-data/historical-financial-data-fy26.csv`
- `sample-data/budget-forecast-fy27.csv`
- `sample-data/business-metrics-fy27.csv`
- `sample-data/ai-performance-metrics-fy27.csv`
- `src/lib/sample-data.ts` (programmatic samples)

### Code References:
- **Validation:** `src/lib/form-validation.ts`
- **AI Analysis:** `src/lib/ai-analysis.ts`
- **Types:** `src/types/aop.ts`
- **Components:** `src/components/submission/*.tsx`

---

## 🔮 Future Considerations

### FY28 and Beyond:
The FY27 template establishes a pattern for future years:
- AI sections will likely expand further
- May add AI governance and ethics sections
- Possible addition of AI innovation metrics
- Enhanced competitive AI analysis

### Maintain Backwards Compatibility:
- Keep legacy metric columns in database
- Support both old and new formData structures in code
- Enable filtering by fiscal year in admin dashboard

### Continuous Improvement:
- Gather feedback on FY27 template usability
- Refine AI metric definitions based on usage
- Enhance validation rules based on common errors
- Improve AI analysis prompt based on results quality

---

## ✨ Success Criteria

### Migration is Complete When:
- ✅ All 7 sections filled out
- ✅ Overall completion shows 100%
- ✅ Zero validation errors
- ✅ AI analysis runs successfully
- ✅ Dashboard displays submission with AI Readiness Score
- ✅ Admin dashboard shows aggregated metrics
- ✅ All required FAQ questions answered
- ✅ AI Cost-Benefit Analysis shows positive ROI

### Quality Indicators:
- ✅ AI Strategy is specific (not generic)
- ✅ All numbers are internally consistent
- ✅ HC justifications align with AI productivity claims
- ✅ FAQ answers demonstrate strategic thinking
- ✅ AI Readiness Score ≥ 40 (at least "Developing")

---

## 📋 Quick Reference Card

### Must-Add Fields (Cannot Skip):
1. ✨ AI Strategy Overview
2. 📊 AI Performance Metrics (2+)
3. 📝 Performance Analysis
4. 🤖 AI Retrospective (4 fields)
5. 🎯 AI Integration Plan per initiative
6. 👥 AI-Enabled Workforce Planning (4 text + table)
7. 💰 AI Cost-Benefit Analysis (2+ entries)
8. ❓ Appendix FAQs (8 required questions)

### Key Validation Rules:
- Minimum 2 AI Performance Metrics
- Every initiative needs AI Integration Plan
- HC increases require AI-context justification
- At least 2 AI cost-benefit entries
- All 8 required FAQ questions answered

### Common Pitfall Avoidance:
- ❌ Generic AI strategy ("we'll use AI") → ✅ Specific tools and targets
- ❌ Unrealistic productivity (100% gains) → ✅ Industry benchmarks (15-30%)
- ❌ No AI justification for HC → ✅ Explain why AI insufficient
- ❌ Brief FAQ answers (1 sentence) → ✅ Detailed responses (50+ words)

---

## 🎯 Migration Template

**Use this as your migration worksheet:**

```markdown
## Department: ___________________
## Migration Date: ___________________
## Migrated By: ___________________

### Checklist:
- [ ] Section 1: Added AI Strategy Overview
- [ ] Section 2: Shifted metrics FY23-26 → FY25-27
- [ ] Section 2: Created 2+ AI Performance Metrics
- [ ] Section 3: Added metrics commentary
- [ ] Section 3: Added performance analysis
- [ ] Section 3: Completed AI Retrospective (4 fields)
- [ ] Section 4: Added AI Integration Plan to all initiatives
- [ ] Section 4: Created monthly resource allocation tables
- [ ] Section 4: Added HC justification
- [ ] Section 5: Answered 4 AI strategy questions
- [ ] Section 5: Created workforce planning table
- [ ] Section 5: Created AI cost-benefit analysis (2+ entries)
- [ ] Section 7: Answered all 8 required FAQ questions
- [ ] Validation: Zero errors
- [ ] Testing: Submission successful
- [ ] Testing: AI analysis completed
- [ ] Dashboard: Shows AI Readiness Score

### Notes:
_Document any issues, decisions, or special cases here_
```

---

**END OF MIGRATION GUIDE**

For questions or issues, review the sample data files or consult with the development team.

