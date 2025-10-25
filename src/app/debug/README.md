# AI Analyst Debug Dashboard

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [How to Use Each Section](#how-to-use-each-section)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Adding New Features](#adding-new-features)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Overview

The AI Analyst Debug Dashboard is a comprehensive transparency tool that helps users and developers understand exactly how the AI analysis system works in the AOP (Annual Operating Plan) application. It provides visibility into data flow, prompt construction, analysis quality, and system diagnostics.

### Purpose

- **Transparency**: Show users what data the AI uses and how it processes it
- **Debugging**: Help diagnose issues when analysis isn't working correctly
- **Quality Assurance**: Verify that department-specific data is being used (not generic examples)
- **Education**: Teach users and developers about AI analysis methodology
- **Monitoring**: Track data quality, analysis effectiveness, and system performance

### Who Should Use This

- **Department Managers**: Verify AI is analyzing their specific data
- **Finance Team**: Ensure accurate metric analysis
- **Developers**: Debug prompt construction and API issues
- **QA Team**: Validate analysis quality across departments
- **Stakeholders**: Understand how AI-driven insights are generated

---

## Features

### ✅ Implemented Features

#### 1. **Data Flow Visualization**
- 7-stage pipeline from form submission to results
- Interactive stage expansion
- Data completeness scoring
- Sample data testing (Finance, Marketing, IT)
- Missing field detection

#### 2. **Prompt Inspector**
- View exact prompts sent to Claude API
- Syntax highlighting with color-coded sections
- Character/token count statistics
- Department-specific instruction verification
- Side-by-side prompt comparison
- Test prompt execution
- Export prompts as text files

#### 3. **Analysis Results Breakdown**
- Detailed insight dissection
- Recommendation analysis
- Risk assessment review
- Quality metrics (Specificity, Relevance, Data Usage)
- Validation results with checkmarks
- Raw JSON view

#### 4. **Troubleshooting Guide**
- Common issues checklist
- Interactive diagnostic tools
- Data completeness checker
- Prompt quality analyzer
- Response validator
- Step-by-step fix guides
- Code examples with before/after

#### 5. **Help System**
- 15+ searchable articles
- 4 categories (Getting Started, Data Flow, Troubleshooting, Customization)
- Difficulty levels (Beginner, Intermediate, Advanced)
- Code examples
- Related articles navigation
- Guided tour for new users
- Glossary with technical terms

#### 6. **Export & Reporting**
- **Formats**: PDF, JSON, Markdown, CSV
- **Specialized Reports**: Prompt comparison, Validation reports
- Section filtering (choose what to include)
- Sensitive data control
- Comments/notes field
- Export history (last 20)
- Email integration

#### 7. **Share Analysis**
- Generate shareable links
- 7-day expiration
- Read-only access
- No authentication required
- Perfect for asking for help

#### 8. **Additional Features**
- Keyboard shortcuts (Cmd/Ctrl + 1-4)
- Debug mode toggle (Simple vs Advanced)
- Sample analysis runner
- Feedback system
- Responsive design (mobile to desktop)
- Dark mode support

---

## Getting Started

### Accessing the Dashboard

1. Navigate to `/debug` from the homepage
2. Click the "AI Analyst Debug" button on the main page
3. Or use direct URL: `https://yourdomain.com/debug`

### First-Time Setup

1. **Run Sample Analysis**: Click "Run Sample Analysis" to test with Finance department data
2. **Explore Tabs**: Use keyboard shortcuts (Cmd+1, Cmd+2, etc.) or click tabs
3. **Open Help**: Click the blue "Help" button for guided tour
4. **Toggle Debug Mode**: Switch between Simple and Advanced views

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + 1` | Data Flow tab |
| `Cmd/Ctrl + 2` | Prompt Inspector tab |
| `Cmd/Ctrl + 3` | Analysis Results tab |
| `Cmd/Ctrl + 4` | Troubleshooting tab |
| `Cmd/Ctrl + P` | Quick jump to Prompt Inspector |

---

## How to Use Each Section

### 1. Data Flow Visualization

**Purpose**: Understand the 7-stage pipeline from form submission to analysis results

**How to Use**:
1. Select a sample department (Finance, Marketing, IT) from dropdown
2. Click "Generate Flow" to visualize the pipeline
3. Expand each stage to see detailed data
4. Check completeness scores and missing fields
5. Verify data is flowing correctly through all stages

**What to Look For**:
- ✅ All stages showing "Complete" status
- ✅ Completeness score above 80%
- ❌ Red X marks on stages (indicates issues)
- ⚠️ Missing fields list (shows what to fill in form)

**Common Issues**:
- **Low completeness score**: Fill out more form fields
- **Missing department name**: Verify form submission
- **Stage errors**: Check console logs for API failures

---

### 2. Prompt Inspector

**Purpose**: View and analyze the exact prompts sent to Claude API

**How to Use**:
1. Click "Load Sample Submission" and select a department
2. Click "Generate Prompt" to create the prompt
3. Review the syntax-highlighted prompt:
   - 🟢 **Green**: User data insertions
   - 🔵 **Blue**: Section headers
   - 🟡 **Yellow**: Critical warnings
4. Check statistics (character count, token estimate, sections, warnings)
5. Use "Compare Prompts" to see differences between departments
6. Click "Test Prompt" to run actual API call (costs money - confirm first)

**What to Look For**:
- ✅ Your department name appears 10+ times in green
- ✅ Your specific metrics are listed in green
- ✅ Critical warnings are present in yellow
- ✅ Department-specific focus areas included
- ❌ Generic IT examples for non-IT departments (bug if found)

**Export Options**:
- Click "Export Prompt" to download as .txt file
- Use "Compare Prompts" for side-by-side PDF report

---

### 3. Analysis Results Breakdown

**Purpose**: Dissect and evaluate AI analysis quality

**How to Use**:
1. Load a recent analysis result or run new sample analysis
2. Review each section:
   - **Overview**: Scores and timestamp
   - **Data Validation**: Which metrics/initiatives were referenced
   - **Insights Breakdown**: Each insight with data sources
   - **Recommendations**: Actionability and relevance
   - **KPI Suggestions**: Implementation difficulty
3. Check quality metrics (should be 80%+ for good analysis)
4. Expand "Raw JSON" to see full API response

**Quality Metrics Explained**:
- **Specificity Score**: % of specific numbers/percentages mentioned (target: 80%+)
- **Reference Score**: % of submitted data referenced (target: 80%+)
- **Actionability Score**: % of recommendations with clear action verbs (target: 70%+)
- **Relevance Score**: % of insights specific to department type (target: 90%+)

**Warning Signs**:
- ❌ Data Usage Score below 50% (AI not using your data)
- ❌ Specificity Score below 60% (too generic)
- ❌ Department name not referenced (wrong department analysis)
- ❌ Zero metrics referenced (data not flowing to prompt)

---

### 4. Troubleshooting Guide

**Purpose**: Diagnose and fix common issues

**How to Use**:
1. Browse common issues checklist
2. Click issue to expand diagnostic steps
3. Use diagnostic tools:
   - **Data Completeness Checker**: Upload form data, get completeness report
   - **Prompt Quality Analyzer**: Check if prompt includes your data
   - **Response Validator**: Verify AI used submitted data
4. Follow step-by-step fix guides
5. Test your changes with "Test Your Changes" section

**Common Issues & Fixes**:

**Issue: "AI is using IT examples for my Finance department"**
- **Cause**: Department-specific instructions not in prompt
- **Fix**: 
  1. Use Prompt Inspector to verify department name
  2. Check buildAnalysisPrompt includes Finance focus areas
  3. Verify critical warnings are present
  4. Ensure department field is correctly set in form

**Issue: "AI analysis doesn't reference my custom metrics"**
- **Cause**: Metrics not flowing to prompt (missing 'name' field)
- **Fix**:
  1. Check metrics have 'name' field (not blank)
  2. Verify in Data Flow tab
  3. Review prompt to see if metric names appear
  4. Ensure form validation passes

**Issue: "Analysis is too generic and not specific"**
- **Cause**: Missing data or low data quality
- **Fix**:
  1. Fill out more form fields
  2. Add specific numbers to metrics
  3. Write detailed AI Strategy Overview (300+ chars)
  4. Include specific initiatives with AI integration plans

---

### 5. Help System

**How to Use**:
1. Click blue "Help" button in top-right
2. Use search bar to find topics
3. Browse by category in left sidebar
4. Click article to read full content
5. View code examples
6. Click related articles for deeper dive
7. Use "Guided Tour" for step-by-step walkthrough

**Help Categories**:
- **Getting Started**: Basics and introductions
- **Understanding Data Flow**: How data moves through system
- **Troubleshooting**: Common problems and solutions
- **Customization**: How to modify the system
- **Technical Reference**: API docs and data structures

---

### 6. Export & Share

**How to Use**:
1. Click "Export Debug Report" in Quick Actions
2. Choose format (PDF recommended for sharing)
3. Select sections to include (checkboxes)
4. Toggle "Include Sensitive Data" (off for external sharing)
5. Add comments/notes for context
6. Click "Export Report" to download

**Export Formats**:
- **PDF**: Professional formatted report with sections
- **JSON**: Complete raw data for programmatic access
- **Markdown**: Human-readable documentation format
- **CSV**: Metrics and scores for Excel analysis

**Share Analysis**:
1. Click "Generate Share Link" in export dialog
2. Copy link and share with team
3. Link expires in 7 days
4. Recipients see read-only view (no edit access)

**When to Use**:
- **PDF**: Sharing with stakeholders, management, team
- **JSON**: Programmatic analysis, custom tools
- **Markdown**: Documentation, wiki, knowledge base
- **CSV**: Excel charts, data analysis, trending
- **Share Link**: Quick collaboration, asking for help

---

## Architecture

### File Structure

```
src/
├── app/
│   ├── debug/
│   │   ├── page.tsx           # Main dashboard page
│   │   └── README.md          # This file
│   └── api/
│       └── debug/
│           ├── validate-data/
│           │   └── route.ts   # Data validation endpoint
│           ├── analyze-prompt/
│           │   └── route.ts   # Prompt analysis endpoint
│           ├── compare-prompts/
│           │   └── route.ts   # Prompt comparison endpoint
│           └── test-analysis/
│               └── route.ts   # Test analysis endpoint
├── components/
│   └── debug/
│       ├── DataFlowVisualization.tsx
│       ├── PromptInspector.tsx
│       ├── AnalysisResultsBreakdown.tsx
│       ├── TroubleshootingGuide.tsx
│       ├── HelpModal.tsx
│       └── ExportDialog.tsx
└── lib/
    └── debug/
        ├── sample-data-manager.ts  # Sample data generation
        └── export-utils.ts         # Export functionality
```

### Component Hierarchy

```
DebugPage
├── Header
│   ├── Back Button
│   ├── Help Button
│   └── Debug Mode Toggle
├── Banner (Info Alert)
├── Quick Actions Card
│   ├── Run Sample Analysis
│   ├── Export Debug Report
│   └── Documentation Link
├── Main Debug Card
│   └── Tabs
│       ├── Data Flow (ErrorBoundary)
│       ├── Prompt Inspector (ErrorBoundary)
│       ├── Analysis Results (ErrorBoundary)
│       └── Troubleshooting (ErrorBoundary)
├── Feedback Section
├── HelpModal (Dialog)
└── ExportDialog (Dialog)
```

### Data Flow

```
User Form Submission
    ↓
localStorage (aopFormData)
    ↓
buildAnalysisPrompt() → Prompt Construction
    ↓
Claude API (Anthropic)
    ↓
parseAIResponse() → JSON Parsing
    ↓
validateAnalysisResponse() → Data Validation
    ↓
localStorage (latestAnalysis)
    ↓
Debug Dashboard Display
```

### State Management

- **Local State**: React `useState` for UI state
- **localStorage**: Persistent data (form data, analysis results, preferences)
- **No Global State**: Each component manages its own state
- **Props Drilling**: Parent passes data to children via props

### Error Handling

- **ErrorBoundaryWrapper**: Catches component-level errors
- **Try-Catch**: API calls wrapped in try-catch
- **Graceful Degradation**: Shows error UI, allows retry
- **Console Logging**: Errors logged for debugging

---

## API Endpoints

### Base URL
```
/api/debug/*
```

### Endpoints

#### 1. `POST /api/debug/validate-data`

**Purpose**: Validate form data completeness and quality

**Request Body**:
```typescript
{
  formData: FormState
}
```

**Response**:
```typescript
{
  completeness: {
    requiredFields: Array<{ field: string, status: 'complete' | 'incomplete' }>
    optionalFields: Array<{ field: string, status: 'complete' | 'incomplete' }>
    score: number
  }
  errors: Array<{ field: string, message: string, severity: 'error' | 'warning' }>
  recommendations: string[]
}
```

**Usage**:
```javascript
const response = await fetch('/api/debug/validate-data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ formData })
})
const validation = await response.json()
```

---

#### 2. `POST /api/debug/analyze-prompt`

**Purpose**: Analyze prompt quality and characteristics

**Request Body**:
```typescript
{
  formData: FormState
}
```

**Response**:
```typescript
{
  prompt: string
  statistics: {
    characterCount: number
    estimatedTokens: number
    sectionCount: number
    dataInsertionPoints: number
    criticalWarnings: number
    departmentMentions: number
  }
  quality: {
    hasUserData: boolean
    hasCriticalWarnings: boolean
    hasDepartmentSpecifics: boolean
    score: number  // 0-100
  }
}
```

---

#### 3. `POST /api/debug/compare-prompts`

**Purpose**: Compare prompts for two departments side-by-side

**Request Body**:
```typescript
{
  dept1Data: FormState
  dept2Data: FormState
}
```

**Response**:
```typescript
{
  prompt1: string
  prompt2: string
  differences: Array<{
    lineNumber: number
    dept1Line: string
    dept2Line: string
    type: 'added' | 'removed' | 'modified'
  }>
  summary: {
    totalDifferences: number
    dataPointDifferences: number
    instructionDifferences: number
  }
}
```

---

#### 4. `POST /api/debug/test-analysis`

**Purpose**: Run test analysis (with option to skip actual API call)

**Request Body**:
```typescript
{
  departmentName: string
  fiscalYear: string
  aopFormData: FormState
  options: {
    skipAPICall?: boolean  // Use mock data if true
  }
}
```

**Response**:
```typescript
{
  result: AnalysisResult
  metadata: {
    processingTime: number
    promptLength: number
    responseLength: number
    validationResults: {
      metricsReferenced: number
      initiativesReferenced: number
      departmentReferenced: boolean
    }
  }
}
```

---

## Adding New Features

### Step 1: Create Component

**Location**: `src/components/debug/[ComponentName].tsx`

**Template**:
```typescript
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MyNewComponent() {
  const [data, setData] = useState(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>My New Feature</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Your content here */}
      </CardContent>
    </Card>
  )
}
```

**Best Practices**:
- Use TypeScript with proper interfaces
- Follow existing Card-based layout
- Add loading states for async operations
- Include error handling
- Make it responsive
- Add helpful tooltips

---

### Step 2: Add Tab (Optional)

**In `src/app/debug/page.tsx`**:

1. **Import Component**:
```typescript
import MyNewComponent from '@/components/debug/MyNewComponent'
```

2. **Add TabsTrigger**:
```typescript
<TabsTrigger value="my-feature" className="...">
  <Icon className="h-4 w-4" />
  <span>My Feature</span>
  <Badge variant="outline">Cmd+5</Badge>
</TabsTrigger>
```

3. **Add TabsContent**:
```typescript
<TabsContent value="my-feature" className="mt-6">
  <ErrorBoundaryWrapper componentName="My New Feature">
    <MyNewComponent />
  </ErrorBoundaryWrapper>
</TabsContent>
```

4. **Add Keyboard Shortcut**:
```typescript
case '5':
  e.preventDefault()
  setActiveTab('my-feature')
  break
```

---

### Step 3: Create API Route (Optional)

**Location**: `src/app/api/debug/my-endpoint/route.ts`

**Template**:
```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Your logic here
    const result = processData(body)
    
    return NextResponse.json({ 
      success: true, 
      data: result 
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Best Practices**:
- Always use try-catch
- Validate input data
- Return proper HTTP status codes
- Log errors to console
- Type request/response bodies

---

### Step 4: Add to Export (Optional)

**Update `src/lib/debug/export-utils.ts`**:

1. **Add to DebugReportData interface**:
```typescript
export interface DebugReportData {
  // ... existing fields
  myNewData?: {
    field1: string
    field2: number
  }
}
```

2. **Add to export sections in ExportDialog**:
```typescript
{ 
  id: 'myFeature', 
  label: 'My New Feature', 
  description: 'Description of data', 
  enabled: true 
}
```

3. **Include in PDF generator**:
```typescript
if (data.myNewData) {
  addSection('My New Feature')
  addText(`Field 1: ${data.myNewData.field1}`)
}
```

---

### Step 5: Add Help Article

**Update `src/components/debug/HelpModal.tsx`**:

```typescript
{
  id: 'my-new-feature',
  title: 'How to use My New Feature',
  category: 'Getting Started',
  readTime: 5,
  difficulty: 'Beginner',
  content: `Detailed explanation here...`,
  codeExample: `// Code example
const example = 'code'`,
  relatedArticles: ['other-article-id']
}
```

---

## Troubleshooting

### Common Development Issues

#### Issue: "Component not rendering"
**Solution**:
1. Check browser console for errors
2. Verify component is imported correctly
3. Check ErrorBoundaryWrapper isn't catching error
4. Ensure TypeScript types are correct

#### Issue: "API route returns 404"
**Solution**:
1. Verify route file is in correct folder structure
2. Check export is named correctly (`export async function POST`)
3. Restart Next.js dev server
4. Clear `.next` folder and rebuild

#### Issue: "localStorage data not persisting"
**Solution**:
1. Check browser privacy settings
2. Verify localStorage key is consistent
3. Use `JSON.stringify` when saving objects
4. Check for quota exceeded errors

#### Issue: "Export not working"
**Solution**:
1. Check jsPDF is installed: `npm install jspdf`
2. Verify blob creation in console
3. Check browser popup blocker settings
4. Test with different browsers

---

## Best Practices

### Code Style

- **TypeScript**: Use strict typing, avoid `any`
- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions
- **Formatting**: Use Prettier with 2-space indentation
- **Comments**: JSDoc for functions, inline for complex logic

### Performance

- **Lazy Loading**: Use dynamic imports for large components
- **Memoization**: Use `useMemo` for expensive calculations
- **Debouncing**: Debounce search inputs and API calls
- **Pagination**: Limit displayed items, add "load more"

### Security

- **Input Validation**: Validate all user inputs
- **XSS Prevention**: Sanitize data before rendering
- **API Keys**: Never expose API keys in frontend
- **CORS**: Configure properly for API routes

### Testing

- **Unit Tests**: Test utility functions
- **Component Tests**: Test with React Testing Library
- **E2E Tests**: Use Playwright for critical flows
- **Manual Testing**: Test on Chrome, Firefox, Safari

### Accessibility

- **Keyboard Navigation**: All features accessible via keyboard
- **ARIA Labels**: Add proper labels for screen readers
- **Color Contrast**: Ensure WCAG AA compliance
- **Focus States**: Visible focus indicators

---

## Future Roadmap

### Planned Enhancements

- [ ] Real-time WebSocket updates for analysis progress
- [ ] Advanced filtering and search across all debug data
- [ ] Performance metrics and bottleneck analysis
- [ ] A/B testing framework for prompt variations
- [ ] Historical trend analysis across submissions
- [ ] Integration with error tracking (Sentry)
- [ ] Custom debug plugins architecture
- [ ] Collaboration features (comments, annotations)
- [ ] Mobile app for on-the-go debugging
- [ ] AI-powered debugging suggestions

### Contributing

To contribute to the debug dashboard:

1. Read this README thoroughly
2. Review existing components for patterns
3. Create feature branch from `main`
4. Write clean, typed code with comments
5. Test on multiple browsers
6. Update this README if adding major features
7. Submit pull request with clear description

---

## Support

### Getting Help

1. **Help Modal**: Click blue "Help" button in dashboard
2. **Search**: Use search bar in help modal
3. **Documentation**: Read this README
4. **Code Comments**: Check inline comments in source
5. **Team**: Ask fellow developers

### Reporting Issues

When reporting issues, include:
- What you were trying to do
- What happened (actual behavior)
- What you expected (expected behavior)
- Steps to reproduce
- Browser and OS
- Screenshots if relevant
- Console error logs

---

## License

This debug dashboard is part of the AOP application and follows the same license terms.

---

**Last Updated**: October 10, 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team

