# FY27 AOP Sample Data Files

This directory contains sample data files for testing the FY27 Annual Operating Plan (AOP) template.

## 📁 Files in This Directory

### 1. **historical-financial-data-fy26.csv**
Historical financial data for Engineering department (FY26 actuals).

**Structure:**
- Month, Account Code, Account Name, Amount, Category, Department
- 8 months of detailed financial data (Jan-Aug 2026)
- Includes headcount, software licenses, AI tools, contractors, infrastructure
- Shows progressive AI tool adoption throughout FY26

**Usage:**
Upload this file in **Section 6: File Uploads** as "Historical Financial Data"

**Key Data Points:**
- Monthly salaries: $385K-$415K
- AI tool costs ramping up: $2.8K → $10.3K monthly
- Contractor costs decreasing: $35K → $12K (AI impact)
- Total monthly spend: ~$650K-$700K

---

### 2. **budget-forecast-fy27.csv**
Budget forecast for Engineering department (FY27 plan).

**Structure:**
- Month, Account Code, Account Name, Amount, Category, Department, Notes
- 6 months of detailed budget planning (Jan-Jun 2027)
- Includes new AI tool licenses at full deployment
- Shows headcount increases reflected in salaries

**Usage:**
Upload this file in **Section 6: File Uploads** as "Budget Forecast Data"

**Key Data Points:**
- Monthly salaries: $445K-$475K (reflecting 46→48 engineers)
- AI tool licenses: $27.2K monthly (GitHub Copilot, Claude, Cursor, Testing tools)
- Contractor costs reduced: $8.5K monthly (down from $35K)
- Total monthly spend: ~$775K-$850K

**AI Investment Breakdown:**
- GitHub Copilot: $18,720/month (48 licenses @ $39/mo)
- Claude API: $3,750/month
- Cursor Pro: $2,000/month (25 licenses @ $20/mo)
- AI Testing Tools: $1,500/month
- ChatGPT Enterprise: $1,250/month (allocated share)
- AI Training: $7,000-$9,000/month

---

### 3. **business-metrics-fy27.csv**
Key business metrics for Engineering with FY25-27 structure.

**Structure:**
- Metric Name, FY 2025 Actual, FY 2025 Plan, YOY %, FY 2026 YTD Actual, FY 2026 YTD Actual YOY %, FY 2027 Plan, FY 2027 Plan YOY %
- 10 engineering-specific KPIs
- Shows impact of AI adoption on metrics

**Usage:**
Reference for filling out **Section 2: Metrics** table or import functionality

**Key Metrics:**
- Features Shipped: 42 → 38 → **60** (58% growth with AI)
- Code Review Time: 4.5h → 3.2h → **2.5h** (44% reduction)
- Test Coverage: 72% → 78% → **85%**
- Developer Satisfaction: 7.2 → 8.1 → **8.5**

---

### 4. **ai-performance-metrics-fy27.csv**
AI-specific performance metrics (NEW for FY27).

**Structure:**
- AI Performance Metric, FY 2025 Actual, FY 2026 YTD, FY 2027 Target, Expected Impact
- 6 AI metrics showing adoption journey
- Quantifiable impact descriptions

**Usage:**
Reference for filling out **Section 2: AI Performance Metrics** table

**Key AI Metrics:**
- Workflow Augmentation: 15% → 45% → **85%**
- Hours Saved: 120 → 480 → **1,200 hours/month**
- Cost Reduction: $45K → $185K → **$520K annually**
- Tool Adoption: 55% → 85% → **95%**

---

## 🎯 How to Use These Files

### For Testing the Submission Form:

1. **Navigate to Submission Page** (`/submission`)

2. **Section 2: Metrics**
   - Manually enter data from `business-metrics-fy27.csv`
   - Select and fill AI metrics from `ai-performance-metrics-fy27.csv`

3. **Section 6: File Uploads**
   - Upload `historical-financial-data-fy26.csv` as Historical Data
   - Upload `budget-forecast-fy27.csv` as Budget Forecast
   - These files will be analyzed by the AI

4. **Submit the Form**
   - AI analysis will process the uploaded financial data
   - Results will show on dashboard

---

## 📊 Sample Data Characteristics

**Department:** Information Technology (Engineering)
**Team Size:** 45 → 47 engineers (net +2 after +3 senior, -1 QA)
**Fiscal Year:** FY 2027
**AI Readiness Journey:**
- FY25: Early exploration (15% workflows)
- FY26: Growing adoption (45% workflows, $185K savings)
- FY27: Mature practice (85% workflows, $520K savings)

**AI Tools Used:**
- GitHub Copilot (48 licenses, $22.5K annually)
- Claude API (code review, $45K annually)
- Cursor Pro (25 licenses, $24K annually)
- AI Testing Tools ($18K annually)
- ChatGPT Enterprise ($15K allocated)
- AI Training Program ($85K annually)

**Expected Outcomes:**
- 30% productivity improvement
- 58% increase in feature delivery (38 → 60 features)
- $520K in cost savings and efficiency gains
- ROI: 302% on AI investments
- Payback period: 2.9 months average

---

## 💡 Programmatic Sample Data

For quick form testing during development, use the TypeScript sample data loader:

**File:** `src/lib/sample-data.ts`

**Usage:**
```typescript
import { loadSampleData, getSampleDataByDepartment } from '@/lib/sample-data'

// Load complete Engineering department data
const testData = loadSampleData()
setFormData(testData)

// Or get by department name
const financeData = getSampleDataByDepartment('Finance')
```

The TypeScript sample includes:
- All 7 sections pre-populated
- 3 complete initiatives with AI integration plans
- Full workforce planning with 5 role types
- 6 AI cost-benefit entries
- All 12 FAQ questions answered
- Programmatic financial data

---

## 🔄 Data Alignment

The CSV files and TypeScript sample data are aligned:
- Same Engineering department
- Same fiscal year (FY27)
- Same AI tools and costs
- Same business metrics
- Consistent narrative and numbers

You can upload the CSV files AND use the TypeScript sample data together for comprehensive testing.

---

## 📝 Notes

- All dollar amounts are realistic for a 45-person engineering team
- AI productivity gains (25-30%) are based on industry benchmarks
- Payback periods (1.5-4 months) reflect actual AI tool ROI data
- HC changes are justified with specific business reasoning
- Includes both successes and realistic challenges (skepticism, learning curves)

---

## 🎓 Educational Value

These samples demonstrate:
- ✅ Expected level of detail for each section
- ✅ How to quantify AI impact with specific metrics
- ✅ Proper justification for HC changes despite AI gains
- ✅ Realistic ROI calculations for AI investments
- ✅ Strategic thinking in FAQ responses
- ✅ Honest reflection on challenges and learnings

Use these as templates for creating your own department's AOP submission!

