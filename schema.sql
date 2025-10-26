-- ============================================
-- BUDGET APP V2 - DATABASE SCHEMA
-- FY27 AOP Template Structure
-- Migration-safe: Preserves existing data
-- ============================================

-- departments table (simple lookup)
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- aop_submissions (main form data)
CREATE TABLE IF NOT EXISTS aop_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_name TEXT NOT NULL,
  fiscal_year TEXT NOT NULL,
  status TEXT DEFAULT 'draft', -- draft, submitted, reviewed
  
  -- Section 1: Introduction
  team_description TEXT,
  responsibilities TEXT,
  team_tenets TEXT,
  department_head TEXT,
  ai_strategy_overview TEXT, -- NEW: Section 1 AI Strategy
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  submitted_at TIMESTAMPTZ
);

-- Add new column to existing aop_submissions table
ALTER TABLE aop_submissions ADD COLUMN IF NOT EXISTS ai_strategy_overview TEXT;

-- metrics table (Section 2 - Key Metrics) - UPDATED STRUCTURE
CREATE TABLE IF NOT EXISTS aop_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES aop_submissions(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  -- OLD STRUCTURE (for backwards compatibility)
  fy2023_actual DECIMAL,
  fy2024_expected DECIMAL,
  ytd_yoy_percent DECIMAL,
  fy2025_plan DECIMAL,
  fy2025_yoy_percent DECIMAL,
  fy2026_plan DECIMAL,
  fy2026_yoy_percent DECIMAL,
  -- NEW STRUCTURE for FY25-27
  fy2025_actual DECIMAL,
  yoy_percent DECIMAL,
  fy2026_ytd_actual DECIMAL,
  fy2026_ytd_yoy_percent DECIMAL,
  fy2027_plan DECIMAL,
  fy2027_plan_yoy_percent DECIMAL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add new columns to existing aop_metrics table
ALTER TABLE aop_metrics ADD COLUMN IF NOT EXISTS fy2025_actual DECIMAL;
ALTER TABLE aop_metrics ADD COLUMN IF NOT EXISTS yoy_percent DECIMAL;
ALTER TABLE aop_metrics ADD COLUMN IF NOT EXISTS fy2026_ytd_actual DECIMAL;
ALTER TABLE aop_metrics ADD COLUMN IF NOT EXISTS fy2026_ytd_yoy_percent DECIMAL;
ALTER TABLE aop_metrics ADD COLUMN IF NOT EXISTS fy2027_plan DECIMAL;
ALTER TABLE aop_metrics ADD COLUMN IF NOT EXISTS fy2027_plan_yoy_percent DECIMAL;

-- NEW TABLE: ai_performance_metrics (AI-specific KPIs)
CREATE TABLE IF NOT EXISTS ai_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES aop_submissions(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  fy2025_actual DECIMAL,
  fy2026_ytd DECIMAL,
  fy2027_target DECIMAL,
  expected_impact TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- initiatives table (Section 4 - Key Initiatives) - UPDATED
CREATE TABLE IF NOT EXISTS initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES aop_submissions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  owner TEXT,
  start_date DATE,
  end_date DATE,
  priority INTEGER,
  is_baseline BOOLEAN DEFAULT false,
  -- NEW: AI Integration fields
  ai_integration_plan TEXT,
  ai_tools_used TEXT,
  ai_efficiency_gains TEXT,
  total_cost DECIMAL,
  ai_cost_impact DECIMAL,
  key_output_metrics TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add new columns to existing initiatives table
ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS ai_integration_plan TEXT;
ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS ai_tools_used TEXT;
ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS ai_efficiency_gains TEXT;
ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS total_cost DECIMAL;
ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS ai_cost_impact DECIMAL;
ALTER TABLE initiatives ADD COLUMN IF NOT EXISTS key_output_metrics TEXT;

-- NEW TABLE: monthly_resource_allocation (FTE allocation by month)
CREATE TABLE IF NOT EXISTS monthly_resource_allocation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id UUID REFERENCES initiatives(id) ON DELETE CASCADE,
  allocation_type TEXT NOT NULL, -- 'baseline' or 'incremental'
  january DECIMAL DEFAULT 0,
  february DECIMAL DEFAULT 0,
  march DECIMAL DEFAULT 0,
  april DECIMAL DEFAULT 0,
  may DECIMAL DEFAULT 0,
  june DECIMAL DEFAULT 0,
  july DECIMAL DEFAULT 0,
  august DECIMAL DEFAULT 0,
  september DECIMAL DEFAULT 0,
  october DECIMAL DEFAULT 0,
  november DECIMAL DEFAULT 0,
  december DECIMAL DEFAULT 0,
  total_ftes DECIMAL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- NEW TABLE: prior_year_analysis (Section 3 - Prior Year Review)
CREATE TABLE IF NOT EXISTS prior_year_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES aop_submissions(id) ON DELETE CASCADE,
  -- Traditional retrospective
  metrics_commentary TEXT,
  key_outcomes TEXT,
  wins_mistakes_learnings TEXT,
  industry_trends TEXT,
  performance_analysis TEXT, -- NEW: Section 3e
  -- AI Retrospective (NEW)
  ai_tools_piloted TEXT,
  ai_key_wins TEXT,
  ai_misses_challenges TEXT,
  ai_measurable_impacts TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- NEW TABLE: ai_workforce_planning (Section 5 - Headcount with AI)
CREATE TABLE IF NOT EXISTS ai_workforce_planning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES aop_submissions(id) ON DELETE CASCADE,
  role_level TEXT NOT NULL, -- e.g., 'Director', 'Manager', 'IC'
  fy2026_current_hc INTEGER DEFAULT 0,
  fy2027_planned_hc INTEGER DEFAULT 0,
  hc_change INTEGER DEFAULT 0,
  ai_tools_leveraged TEXT,
  tasks_augmented TEXT,
  expected_productivity_gains TEXT,
  skills_development_needed TEXT,
  ai_augmentation_strategy TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- NEW TABLE: non_headcount_costs (Section 6 - Operating Expenses)
CREATE TABLE IF NOT EXISTS non_headcount_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES aop_submissions(id) ON DELETE CASCADE,
  cost_category TEXT NOT NULL, -- e.g., 'Software Licenses', 'Travel', 'Training'
  fy2026_actual DECIMAL DEFAULT 0,
  fy2027_plan DECIMAL DEFAULT 0,
  change_amount DECIMAL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- NEW TABLE: ai_cost_benefit_analysis (Section 7 - AI Investments)
CREATE TABLE IF NOT EXISTS ai_cost_benefit_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES aop_submissions(id) ON DELETE CASCADE,
  ai_expense_vendor TEXT NOT NULL, -- e.g., 'OpenAI API', 'Anthropic Claude'
  annual_cost DECIMAL DEFAULT 0,
  expected_savings_benefit DECIMAL DEFAULT 0,
  payback_period TEXT, -- e.g., '6 months', '1 year'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- NEW TABLE: appendix_faqs (Section 8 - Strategic Questions)
CREATE TABLE IF NOT EXISTS appendix_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES aop_submissions(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL, -- e.g., 'most_important_decisions', 'biggest_needle_mover'
  answer TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- financial_uploads table (Historical & Budget Data)
CREATE TABLE IF NOT EXISTS financial_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES aop_submissions(id) ON DELETE CASCADE,
  file_type TEXT NOT NULL, -- 'historical' or 'budget'
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  month TEXT,
  account_code TEXT,
  account_name TEXT,
  amount DECIMAL,
  category TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- supporting_documents table (Additional Context)
CREATE TABLE IF NOT EXISTS supporting_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES aop_submissions(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  description TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- ai_analysis table (Store AI results)
CREATE TABLE IF NOT EXISTS ai_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES aop_submissions(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  insights JSONB,
  recommendations JSONB,
  risks JSONB,
  opportunities JSONB,
  confidence_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Indexes on foreign keys
CREATE INDEX IF NOT EXISTS idx_aop_metrics_submission_id ON aop_metrics(submission_id);
CREATE INDEX IF NOT EXISTS idx_ai_performance_metrics_submission_id ON ai_performance_metrics(submission_id);
CREATE INDEX IF NOT EXISTS idx_initiatives_submission_id ON initiatives(submission_id);
CREATE INDEX IF NOT EXISTS idx_monthly_resource_allocation_initiative_id ON monthly_resource_allocation(initiative_id);
CREATE INDEX IF NOT EXISTS idx_prior_year_analysis_submission_id ON prior_year_analysis(submission_id);
CREATE INDEX IF NOT EXISTS idx_ai_workforce_planning_submission_id ON ai_workforce_planning(submission_id);
CREATE INDEX IF NOT EXISTS idx_non_headcount_costs_submission_id ON non_headcount_costs(submission_id);
CREATE INDEX IF NOT EXISTS idx_ai_cost_benefit_analysis_submission_id ON ai_cost_benefit_analysis(submission_id);
CREATE INDEX IF NOT EXISTS idx_appendix_faqs_submission_id ON appendix_faqs(submission_id);
CREATE INDEX IF NOT EXISTS idx_financial_uploads_submission_id ON financial_uploads(submission_id);
CREATE INDEX IF NOT EXISTS idx_supporting_documents_submission_id ON supporting_documents(submission_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_submission_id ON ai_analysis(submission_id);

-- Indexes on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_aop_submissions_department_name ON aop_submissions(department_name);
CREATE INDEX IF NOT EXISTS idx_aop_submissions_fiscal_year ON aop_submissions(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_aop_submissions_status ON aop_submissions(status);
CREATE INDEX IF NOT EXISTS idx_initiatives_priority ON initiatives(priority);
CREATE INDEX IF NOT EXISTS idx_initiatives_is_baseline ON initiatives(is_baseline);

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Insert sample departments
INSERT INTO departments (name) 
SELECT * FROM (VALUES 
  ('Finance'),
  ('Human Resources'),
  ('Information Technology'),
  ('Marketing'),
  ('Operations'),
  ('Sales')
) AS v(name)
WHERE NOT EXISTS (
  SELECT 1 FROM departments WHERE name = v.name
);

-- ============================================
-- MIGRATION NOTES
-- ============================================
-- This schema supports both legacy (FY23-26) and new (FY25-27) structures
-- Legacy columns in aop_metrics are preserved for backwards compatibility
-- All ALTER TABLE statements use IF NOT EXISTS to be idempotent
-- Indexes are created with IF NOT EXISTS for safe reapplication
-- Foreign keys include ON DELETE CASCADE for referential integrity
-- ============================================
