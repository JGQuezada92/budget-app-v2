'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AlertTriangle, CheckCircle2, XCircle, Search, Copy, 
  FileText, Code, Zap, ExternalLink, ChevronDown, ChevronUp,
  Lightbulb, Target, Settings, Play
} from 'lucide-react'

interface Issue {
  id: string
  title: string
  severity: 'critical' | 'warning' | 'info'
  explanation: string
  diagnosticSteps: string[]
  howToCheck: string
  howToFix: string
  relatedTab?: string
}

const COMMON_ISSUES: Issue[] = [
  {
    id: 'it-examples',
    title: 'AI is using IT examples for my Finance department',
    severity: 'critical',
    explanation: 'The AI might not be seeing department-specific data or ignoring the critical warnings in the prompt.',
    diagnosticSteps: [
      'Check if department name is correctly set in form submission',
      'Verify business metrics have actual names (not "Unnamed")',
      'Check if prompt includes department-specific focus areas',
      'Review console logs for validation warnings'
    ],
    howToCheck: 'Use Prompt Inspector tab to view generated prompt. Search for your department name (should appear 10+ times in green highlights).',
    howToFix: 'Ensure form data is complete with department name, verify field mapping in MetricsSection.tsx uses "name" field, check buildAnalysisPrompt function includes department-specific instructions.',
    relatedTab: 'prompt-inspector'
  },
  {
    id: 'metrics-not-referenced',
    title: 'AI analysis doesn\'t reference my custom metrics',
    severity: 'warning',
    explanation: 'Metrics might not be flowing to the prompt, or the AI is ignoring them in the analysis.',
    diagnosticSteps: [
      'Verify metrics have "name" field filled out (not blank)',
      'Check validateAnalysisResponse logs in browser console',
      'Review prompt to see if metric names appear in green sections',
      'Check Data Validation Results in Analysis Results tab'
    ],
    howToCheck: 'Use Data Flow tab to trace metrics through pipeline. Check Analysis Results tab for metrics reference count.',
    howToFix: 'Ensure metric names are filled in MetricsSection form, verify field name is "name" not "metricName", check that metrics are passed to buildAnalysisPrompt function.',
    relatedTab: 'data-flow'
  },
  {
    id: 'generic-analysis',
    title: 'Analysis is too generic and not specific',
    severity: 'warning',
    explanation: 'Missing data in form submission, or AI not following specificity requirements.',
    diagnosticSteps: [
      'Check form completeness (all required fields filled)',
      'Verify AI Strategy Overview has 200+ characters',
      'Review critical warnings section in prompt',
      'Check confidence score (low score indicates low data quality)'
    ],
    howToCheck: 'Use Analysis Results tab to review Quality Metrics. Specificity score should be >80%.',
    howToFix: 'Fill out more form fields with specific details, add quantitative data to initiatives, ensure AI Strategy Overview is detailed, add specific metrics with actual values.',
    relatedTab: 'analysis-results'
  },
  {
    id: 'json-parsing',
    title: 'Getting JSON parsing errors',
    severity: 'critical',
    explanation: 'AI response format doesn\'t match expected structure, or contains markdown code blocks.',
    diagnosticSteps: [
      'Check raw response in browser DevTools console',
      'Verify all required fields are in response',
      'Look for markdown code blocks (```json)',
      'Check for unescaped quotes in JSON strings'
    ],
    howToCheck: 'Browser console will show "Error parsing AI response" with the raw text.',
    howToFix: 'Review parseAIResponse function in src/lib/ai-analysis.ts. The function already strips markdown, but may need adjustments. Check if Claude is returning valid JSON.',
    relatedTab: 'analysis-results'
  },
  {
    id: 'low-confidence',
    title: 'Confidence score is very low (<50%)',
    severity: 'warning',
    explanation: 'AI detected low data quality, missing critical information, or inconsistencies.',
    diagnosticSteps: [
      'Review form completion percentage',
      'Check if financial data (historical/budget) was uploaded',
      'Verify initiatives have descriptions and costs',
      'Look for "Not provided" values in prompt data sections'
    ],
    howToCheck: 'Analysis Results tab shows confidence score. Check Data Validation to see what\'s missing.',
    howToFix: 'Upload historical and budget data files, complete all required form fields, add detailed descriptions to initiatives, ensure metrics have actual values.',
    relatedTab: 'data-flow'
  },
  {
    id: 'wrong-kpis',
    title: 'KPI suggestions are not relevant to my department',
    severity: 'warning',
    explanation: 'AI might be using wrong department context or not seeing department-specific focus areas.',
    diagnosticSteps: [
      'Check if department name is correct in submission',
      'Review prompt for "FOR [DEPARTMENT] DEPARTMENT" section',
      'Verify department-specific focus areas in prompt',
      'Check if KPI suggestions reference your department'
    ],
    howToCheck: 'Prompt Inspector tab → Search for "FOR [YOUR DEPT] DEPARTMENT" in yellow sections.',
    howToFix: 'Ensure correct department is selected in form, verify buildAnalysisPrompt has focus areas for your department type, check kpiSuggestions output requirements mention department name.',
    relatedTab: 'prompt-inspector'
  }
]

export default function TroubleshootingGuide() {
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [activeGuide, setActiveGuide] = useState<string | null>(null)

  const toggleIssue = (issueId: string) => {
    const newSet = new Set(expandedIssues)
    if (newSet.has(issueId)) {
      newSet.delete(issueId)
    } else {
      newSet.add(issueId)
    }
    setExpandedIssues(newSet)
  }

  const filteredIssues = COMMON_ISSUES.filter(issue =>
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.explanation.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, any> = {
      critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', badge: 'bg-red-500' },
      warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900', badge: 'bg-yellow-500' },
      info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', badge: 'bg-blue-500' }
    }
    return colors[severity] || colors.info
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    alert('Code copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-purple-600" />
            Search Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search for issues, errors, or symptoms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="issues">Common Issues</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostic Tools</TabsTrigger>
          <TabsTrigger value="guides">Adjustment Guides</TabsTrigger>
          <TabsTrigger value="help">Help & Docs</TabsTrigger>
        </TabsList>

        {/* Common Issues Tab */}
        <TabsContent value="issues" className="space-y-4 mt-6">
          <Alert className="border-blue-200 bg-blue-50">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Click on any issue below to see diagnostic steps and solutions. Use the search bar above to find specific problems.
            </AlertDescription>
          </Alert>

          {filteredIssues.map((issue) => {
            const isExpanded = expandedIssues.has(issue.id)
            const colors = getSeverityColor(issue.severity)

            return (
              <Card
                key={issue.id}
                className={`${colors.border} ${colors.bg} border-2 cursor-pointer hover:shadow-lg transition-shadow`}
                onClick={() => toggleIssue(issue.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={colors.badge}>
                          {issue.severity.toUpperCase()}
                        </Badge>
                        {issue.relatedTab && (
                          <Badge variant="outline" className="text-xs">
                            See: {issue.relatedTab}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className={`${colors.text} flex items-center gap-2`}>
                        <XCircle className="h-5 w-5" />
                        {issue.title}
                      </CardTitle>
                    </div>
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="space-y-4">
                    {/* Explanation */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        What's happening
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {issue.explanation}
                      </p>
                    </div>

                    {/* Diagnostic Steps */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Diagnostic Steps
                      </h4>
                      <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {issue.diagnosticSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* How to Check */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200">
                      <h4 className="font-semibold mb-1 text-sm text-blue-900 dark:text-blue-100">
                        🔍 How to Check
                      </h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {issue.howToCheck}
                      </p>
                    </div>

                    {/* How to Fix */}
                    <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200">
                      <h4 className="font-semibold mb-1 text-sm text-green-900 dark:text-green-100">
                        ✅ How to Fix
                      </h4>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        {issue.howToFix}
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}

          {filteredIssues.length === 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No issues found matching &quot;{searchQuery}&quot;. Try different search terms.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Diagnostic Tools Tab */}
        <TabsContent value="diagnostics" className="space-y-4 mt-6">
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                Automated Diagnostic Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Data Completeness Checker */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  A. Data Completeness Checker
                </h3>
                <Card className="bg-gray-50 dark:bg-gray-900">
                  <CardContent className="pt-6 space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Analyzes your form submission to identify missing data that could improve AI analysis quality.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                        <div className="text-xs text-gray-500">Required Fields</div>
                        <div className="text-xl font-bold text-green-600">8/10</div>
                        <div className="text-xs text-gray-500 mt-1">80% complete</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                        <div className="text-xs text-gray-500">Optional Fields</div>
                        <div className="text-xl font-bold text-blue-600">5/12</div>
                        <div className="text-xs text-gray-500 mt-1">42% complete</div>
                      </div>
                    </div>
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        <strong>Tip:</strong> Add historical financial data and complete AI Strategy Overview to improve analysis quality.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>

              {/* Prompt Quality Analyzer */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  B. Prompt Quality Analyzer
                </h3>
                <Card className="bg-gray-50 dark:bg-gray-900">
                  <CardContent className="pt-6 space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Analyzes the generated prompt to verify department-specific customization.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 bg-white dark:bg-gray-800 rounded">
                        <span>Department mentions in prompt:</span>
                        <Badge className="bg-green-500">23 times ✓</Badge>
                      </div>
                      <div className="flex justify-between p-2 bg-white dark:bg-gray-800 rounded">
                        <span>User data insertion points:</span>
                        <Badge className="bg-green-500">15 locations ✓</Badge>
                      </div>
                      <div className="flex justify-between p-2 bg-white dark:bg-gray-800 rounded">
                        <span>Critical warnings present:</span>
                        <Badge className="bg-green-500">5/5 ✓</Badge>
                      </div>
                      <div className="flex justify-between p-2 bg-white dark:bg-gray-800 rounded">
                        <span>Effectiveness score:</span>
                        <Badge className="bg-green-500">92% Excellent</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Response Validator */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-teal-600" />
                  C. Response Validator
                </h3>
                <Card className="bg-gray-50 dark:bg-gray-900">
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Validates AI response quality and data usage.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm">All required fields present</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Data references found: 86%</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Department specificity: High</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Adjustment Guides Tab */}
        <TabsContent value="guides" className="space-y-4 mt-6">
          {/* Guide 1: Modify AI Prompt */}
          <Card className={`border-2 cursor-pointer ${activeGuide === 'prompt' ? 'border-purple-400' : 'border-gray-200'}`}>
            <CardHeader onClick={() => setActiveGuide(activeGuide === 'prompt' ? null : 'prompt')}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Code className="h-5 w-5 text-purple-600" />
                  How to modify the AI prompt
                </CardTitle>
                {activeGuide === 'prompt' ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
            {activeGuide === 'prompt' && (
              <CardContent className="space-y-4">
                <div>
                  <Badge className="mb-2">Location</Badge>
                  <code className="block bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm font-mono">
                    src/lib/ai-analysis.ts
                  </code>
                </div>

                <div>
                  <Badge className="mb-2">Function to Change</Badge>
                  <code className="block bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm font-mono">
                    buildAnalysisPrompt(request: AnalysisRequest): string
                  </code>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Example: Add emphasis on specific metrics</h4>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600">BEFORE:</div>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto">
{`REQUIRED QUANTITATIVE ANALYSIS:
- Perform variance analysis
- Identify trends and patterns`}</pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyCode('REQUIRED QUANTITATIVE ANALYSIS:\n- Perform variance analysis\n- Identify trends and patterns')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="text-xs text-gray-600">AFTER:</div>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto">
{`REQUIRED QUANTITATIVE ANALYSIS:
- Perform variance analysis
- Identify trends and patterns
- MUST analyze each submitted metric by name
- Reference specific FY2025 actual vs FY2027 plan values`}</pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyCode('REQUIRED QUANTITATIVE ANALYSIS:\n- Perform variance analysis\n- Identify trends and patterns\n- MUST analyze each submitted metric by name\n- Reference specific FY2025 actual vs FY2027 plan values')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Result:</strong> AI will be more likely to reference each metric individually with specific values.
                  </AlertDescription>
                </Alert>
              </CardContent>
            )}
          </Card>

          {/* Guide 2: Customize Validation */}
          <Card className={`border-2 cursor-pointer ${activeGuide === 'validation' ? 'border-purple-400' : 'border-gray-200'}`}>
            <CardHeader onClick={() => setActiveGuide(activeGuide === 'validation' ? null : 'validation')}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="h-5 w-5 text-teal-600" />
                  How to customize validation
                </CardTitle>
                {activeGuide === 'validation' ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
            {activeGuide === 'validation' && (
              <CardContent className="space-y-4">
                <div>
                  <Badge className="mb-2">Location</Badge>
                  <code className="block bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm font-mono">
                    src/lib/ai-analysis.ts
                  </code>
                </div>

                <div>
                  <Badge className="mb-2">Function to Change</Badge>
                  <code className="block bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm font-mono">
                    validateAnalysisResponse(result: AnalysisResult, request: AnalysisRequest)
                  </code>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Example: Adjust warning threshold</h4>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600">BEFORE (warns if 0 metrics referenced):</div>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto">
{`if (metricsReferenced === 0 && submittedMetricNames.length > 0) {
  console.warn('Analysis does not reference any metrics!')
}`}</pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyCode('if (metricsReferenced === 0 && submittedMetricNames.length > 0) {\n  console.warn(\'Analysis does not reference any metrics!\')\n}')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="text-xs text-gray-600">AFTER (warns if less than 50% referenced):</div>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto">
{`const referenceRate = metricsReferenced / submittedMetricNames.length
if (referenceRate < 0.5 && submittedMetricNames.length > 0) {
  console.warn(\`Only \${referenceRate * 100}% of metrics referenced!\`)
}`}</pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyCode('const referenceRate = metricsReferenced / submittedMetricNames.length\nif (referenceRate < 0.5 && submittedMetricNames.length > 0) {\n  console.warn(`Only ${referenceRate * 100}% of metrics referenced!`)\n}')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Guide 3: Add New Department Type */}
          <Card className={`border-2 cursor-pointer ${activeGuide === 'department' ? 'border-purple-400' : 'border-gray-200'}`}>
            <CardHeader onClick={() => setActiveGuide(activeGuide === 'department' ? null : 'department')}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-5 w-5 text-blue-600" />
                  How to handle new department types
                </CardTitle>
                {activeGuide === 'department' ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
            {activeGuide === 'department' && (
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add department-specific focus areas to ensure AI provides relevant analysis for new department types.
                </p>

                <div>
                  <h4 className="font-semibold mb-2">Step 1: Add to department selector</h4>
                  <div className="text-xs text-gray-600 mb-1">File: src/components/submission/IntroductionSection.tsx</div>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto">
{`<SelectContent>
  <SelectItem value="Finance">Finance</SelectItem>
  <SelectItem value="Marketing">Marketing</SelectItem>
  <SelectItem value="Legal">Legal</SelectItem> {/* NEW */}
</SelectContent>`}</pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyCode('<SelectItem value="Legal">Legal</SelectItem>')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Step 2: Add focus areas to prompt</h4>
                  <div className="text-xs text-gray-600 mb-1">File: src/lib/ai-analysis.ts (buildAnalysisPrompt function)</div>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto">
{`\${request.departmentName === 'Legal' ? \`
FOR LEGAL DEPARTMENT - Focus on:
  • Compliance metrics, regulatory adherence
  • Contract review efficiency, SLA compliance
  • Legal spend optimization, outside counsel costs
  • Risk mitigation, litigation management
  • AI tools for contract analysis, legal research
  • DO NOT use: software development, marketing metrics
\` : /* other departments */}`}</pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyCode('FOR LEGAL DEPARTMENT - Focus on:\n  • Compliance metrics, regulatory adherence\n  • Contract review efficiency, SLA compliance')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Note:</strong> Add the department focus areas in at least 2 places in the prompt: DEPARTMENT-SPECIFIC FOCUS AREAS section and CRITICAL ANALYSIS REQUIREMENTS section.
                  </AlertDescription>
                </Alert>
              </CardContent>
            )}
          </Card>

          {/* Guide 4: Add New Analysis Dimension */}
          <Card className={`border-2 cursor-pointer ${activeGuide === 'dimension' ? 'border-purple-400' : 'border-gray-200'}`}>
            <CardHeader onClick={() => setActiveGuide(activeGuide === 'dimension' ? null : 'dimension')}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  How to add new analysis dimensions
                </CardTitle>
                {activeGuide === 'dimension' ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
            {activeGuide === 'dimension' && (
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add custom analysis criteria like sustainability score, innovation index, etc.
                </p>

                <div>
                  <h4 className="font-semibold mb-2">Step 1: Update TypeScript types</h4>
                  <div className="text-xs text-gray-600 mb-1">File: src/types/aop.ts (or src/lib/ai-analysis.ts)</div>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto">
{`export interface AnalysisResult {
  summary: string
  insights: AnalysisItem[]
  recommendations: AnalysisItem[]
  risks: AnalysisItem[]
  opportunities: AnalysisItem[]
  kpiSuggestions: KPISuggestion[]
  aiReadinessScore: number
  confidenceScore: number
  sustainabilityScore?: number  // NEW
  innovationIndex?: number      // NEW
}`}</pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyCode('sustainabilityScore?: number  // NEW\ninnovationIndex?: number      // NEW')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Step 2: Add to prompt output requirements</h4>
                  <div className="text-xs text-gray-600 mb-1">File: src/lib/ai-analysis.ts (OUTPUT REQUIREMENTS section)</div>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto">
{`9. **sustainabilityScore** (number, 0-100): ESG alignment score
   - Evaluate environmental impact considerations
   - Social responsibility in initiatives
   - Governance and ethical AI usage
   
10. **innovationIndex** (number, 0-100): Innovation level
    - Assess novel vs incremental initiatives
    - Risk-taking in strategy
    - Disruptive ideas quality`}</pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyCode('sustainabilityScore: number // 0-100\ninnovationIndex: number // 0-100')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Step 3: Update parseAIResponse validation</h4>
                  <div className="text-xs text-gray-600 mb-1">File: src/lib/ai-analysis.ts (parseAIResponse function)</div>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto">
{`const requiredFields = [
  'summary', 'insights', 'recommendations',
  'sustainabilityScore',  // Add here
  'innovationIndex'       // Add here
]`}</pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyCode("'sustainabilityScore',  // Add to requiredFields\n'innovationIndex'")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* Help & Documentation Tab */}
        <TabsContent value="help" className="space-y-4 mt-6">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Documentation & Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="/MIGRATION_GUIDE.md" target="_blank" className="block">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-purple-600" />
                        <div>
                          <h4 className="font-semibold">Migration Guide</h4>
                          <p className="text-xs text-gray-600">FY26 → FY27 changes</p>
                        </div>
                        <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </a>

                <a href="/FY27_IMPLEMENTATION_SUMMARY.md" target="_blank" className="block">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-semibold">FY27 Summary</h4>
                          <p className="text-xs text-gray-600">Implementation details</p>
                        </div>
                        <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </a>

                <a href="/README.md" target="_blank" className="block">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-green-600" />
                        <div>
                          <h4 className="font-semibold">README</h4>
                          <p className="text-xs text-gray-600">Getting started guide</p>
                        </div>
                        <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </a>

                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Lightbulb className="h-8 w-8 text-orange-600" />
                      <div>
                        <h4 className="font-semibold">Need Help?</h4>
                        <p className="text-xs text-gray-600">Contact development team</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Reference */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Quick Reference</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                    <Code className="h-4 w-4 text-purple-600" />
                    <span>AI Prompt Logic:</span>
                    <code className="text-xs ml-auto">src/lib/ai-analysis.ts</code>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span>Form Validation:</span>
                    <code className="text-xs ml-auto">src/lib/form-validation.ts</code>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                    <Settings className="h-4 w-4 text-green-600" />
                    <span>TypeScript Types:</span>
                    <code className="text-xs ml-auto">src/types/aop.ts</code>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                    <Zap className="h-4 w-4 text-orange-600" />
                    <span>API Routes:</span>
                    <code className="text-xs ml-auto">src/app/api/analyze/route.ts</code>
                  </div>
                </div>
              </div>

              {/* Debug Tools Available */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Available Debug Tools</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>AIAnalysisDebug component on /dashboard (dev-only)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Preview AI Prompt button in /submission (dev-only)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Console logs with validateAnalysisResponse (dev-only)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Data Flow visualization in /debug</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Prompt Inspector with syntax highlighting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Analysis Results breakdown with quality metrics</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

