'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Sparkles, CheckCircle2, XCircle, TrendingUp, AlertTriangle, 
  Target, Lightbulb, FileDown, ChevronDown, ChevronUp, 
  Activity, BarChart3, Info
} from 'lucide-react'

interface AnalysisResultsBreakdownProps {
  initialResult?: any
  initialRequest?: any
}

export default function AnalysisResultsBreakdown({ initialResult, initialRequest }: AnalysisResultsBreakdownProps) {
  const [result, setResult] = useState<any>(initialResult || null)
  const [request, setRequest] = useState<any>(initialRequest || null)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [expandedInsights, setExpandedInsights] = useState<Set<number>>(new Set())
  const [expandedRecommendations, setExpandedRecommendations] = useState<Set<number>>(new Set())
  const [expandedKPIs, setExpandedKPIs] = useState<Set<number>>(new Set())
  const [showRawJSON, setShowRawJSON] = useState(false)

  useEffect(() => {
    // Load submissions from localStorage
    const stored = localStorage.getItem('userSubmissions')
    if (stored) {
      const parsed = JSON.parse(stored)
      setSubmissions(parsed.slice(0, 10)) // Last 10 submissions
    }

    // Load latest analysis if no initial result
    if (!initialResult) {
      const storedAnalysis = localStorage.getItem('latestAnalysis')
      if (storedAnalysis) {
        const parsed = JSON.parse(storedAnalysis)
        if (parsed.result && parsed.request) {
          setResult(parsed.result)
          setRequest(parsed.request)
        } else {
          setResult(parsed)
        }
      }
    }
  }, [initialResult])

  const loadSubmissionAnalysis = async (submissionId: string) => {
    // For now, we'll use the latest analysis
    // In future, could store analysis per submission
    const storedAnalysis = localStorage.getItem('latestAnalysis')
    if (storedAnalysis) {
      const parsed = JSON.parse(storedAnalysis)
      if (parsed.result && parsed.request) {
        setResult(parsed.result)
        setRequest(parsed.request)
      }
    }
  }

  const toggleInsight = (index: number) => {
    const newSet = new Set(expandedInsights)
    if (newSet.has(index)) {
      newSet.delete(index)
    } else {
      newSet.add(index)
    }
    setExpandedInsights(newSet)
  }

  const toggleRecommendation = (index: number) => {
    const newSet = new Set(expandedRecommendations)
    if (newSet.has(index)) {
      newSet.delete(index)
    } else {
      newSet.add(index)
    }
    setExpandedRecommendations(newSet)
  }

  const toggleKPI = (index: number) => {
    const newSet = new Set(expandedKPIs)
    if (newSet.has(index)) {
      newSet.delete(index)
    } else {
      newSet.add(index)
    }
    setExpandedKPIs(newSet)
  }

  const exportReport = () => {
    if (!result) return

    const markdown = `# AI Analysis Report

## Department: ${request?.departmentName || 'Unknown'}
## Fiscal Year: FY${request?.fiscalYear || '2027'}

### AI Readiness Score: ${result.aiReadinessScore}/100
### Confidence Score: ${result.confidenceScore}/100

## Summary
${result.summary}

## Insights (${result.insights?.length || 0})
${result.insights?.map((insight: any, idx: number) => `
### ${idx + 1}. ${insight.title}
${insight.description}
`).join('\n')}

## Recommendations (${result.recommendations?.length || 0})
${result.recommendations?.map((rec: any, idx: number) => `
### ${idx + 1}. ${rec.title}
${rec.description}
`).join('\n')}

## Risks (${result.risks?.length || 0})
${result.risks?.map((risk: any, idx: number) => `
### ${idx + 1}. ${risk.title}
${risk.description}
`).join('\n')}

## KPI Suggestions (${result.kpiSuggestions?.length || 0})
${result.kpiSuggestions?.map((kpi: any, idx: number) => `
### ${idx + 1}. ${kpi.title}
**Description:** ${kpi.description}
**Rationale:** ${kpi.rationale}
`).join('\n')}
`

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analysis-report-${request?.departmentName || 'unknown'}-${new Date().getTime()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Calculate quality metrics
  const calculateQualityMetrics = () => {
    if (!result) return null

    const allText = [
      result.summary || '',
      ...(result.insights || []).map((i: any) => `${i.title} ${i.description}`),
      ...(result.recommendations || []).map((r: any) => `${r.title} ${r.description}`)
    ].join(' ')

    // Specificity: Count numbers and percentages
    const numberMatches = allText.match(/\d+(?:\.\d+)?%|\$\d+(?:,\d{3})*(?:\.\d+)?[KMB]?|\d+(?:\.\d+)?/g) || []
    const specificityScore = Math.min(100, (numberMatches.length / 20) * 100)

    // Actionability: Count action verbs
    const actionVerbs = ['implement', 'reduce', 'increase', 'improve', 'develop', 'create', 'establish', 'optimize', 'enhance', 'deploy', 'adopt', 'invest', 'focus', 'prioritize']
    const actionMatches = actionVerbs.filter(verb => allText.toLowerCase().includes(verb))
    const actionabilityScore = Math.min(100, (actionMatches.length / 10) * 100)

    // Reference Score: From validation if available
    let referenceScore = 50 // Default
    if (request) {
      const businessMetrics = request.aopFormData?.businessMetrics || []
      const aiMetrics = request.aopFormData?.aiPerformanceMetrics || []
      const initiatives = request.aopFormData?.initiatives || []
      
      const submittedItems = [...businessMetrics, ...aiMetrics, ...initiatives]
      const allTextLower = allText.toLowerCase()
      
      const referencedCount = submittedItems.filter((item: any) => {
        const name = (item.name || item.metricName || '').toLowerCase()
        return name && allTextLower.includes(name)
      }).length

      referenceScore = submittedItems.length > 0 ? (referencedCount / submittedItems.length) * 100 : 0
    }

    // Relevance Score: Check for department-specific terms
    const deptName = request?.departmentName?.toLowerCase() || ''
    const deptMentions = (allText.toLowerCase().match(new RegExp(deptName, 'g')) || []).length
    const relevanceScore = Math.min(100, (deptMentions / 5) * 100)

    return {
      specificityScore: Math.round(specificityScore),
      actionabilityScore: Math.round(actionabilityScore),
      referenceScore: Math.round(referenceScore),
      relevanceScore: Math.round(relevanceScore),
      numberCount: numberMatches.length,
      actionVerbCount: actionMatches.length
    }
  }

  const qualityMetrics = calculateQualityMetrics()

  // Validate which data was referenced
  const validateDataReferences = () => {
    if (!result || !request) return null

    const businessMetrics = request.aopFormData?.businessMetrics || []
    const aiMetrics = request.aopFormData?.aiPerformanceMetrics || []
    const initiatives = request.aopFormData?.initiatives || []

    const allText = [
      result.summary || '',
      ...(result.insights || []).map((i: any) => `${i.title} ${i.description}`),
      ...(result.recommendations || []).map((r: any) => `${r.title} ${r.description}`),
      ...(result.kpiSuggestions || []).map((k: any) => `${k.title} ${k.description} ${k.rationale}`)
    ].join(' ').toLowerCase()

    const deptReferenced = allText.includes(request.departmentName?.toLowerCase() || '')

    const metricsCheck = [...businessMetrics, ...aiMetrics].map((m: any) => ({
      name: m.name || m.metricName || 'Unnamed',
      type: businessMetrics.includes(m) ? 'Business' : 'AI',
      referenced: allText.includes((m.name || m.metricName || '').toLowerCase())
    }))

    const initiativesCheck = initiatives.map((i: any) => ({
      name: i.name || 'Unnamed',
      referenced: allText.includes((i.name || '').toLowerCase())
    }))

    const totalItems = metricsCheck.length + initiativesCheck.length + 1
    const referencedItems = [
      ...metricsCheck.filter(m => m.referenced),
      ...initiativesCheck.filter(i => i.referenced),
      deptReferenced ? [1] : []
    ].flat().length

    return {
      deptReferenced,
      metricsCheck,
      initiativesCheck,
      dataUsageScore: totalItems > 0 ? Math.round((referencedItems / totalItems) * 100) : 0
    }
  }

  const validation = validateDataReferences()

  // Categorize insights
  const categorizeInsight = (insight: any) => {
    const text = `${insight.title} ${insight.description}`.toLowerCase()
    if (text.includes('budget') || text.includes('cost') || text.includes('financial') || text.includes('$')) return 'financial'
    if (text.includes('ai ') || text.includes('automation') || text.includes('tool')) return 'ai'
    if (text.includes('kpi') || text.includes('metric') || text.includes('performance')) return 'kpi'
    if (text.includes('strategy') || text.includes('alignment') || text.includes('goal')) return 'strategic'
    return 'execution'
  }

  const getSeverityLevel = (insight: any) => {
    const text = `${insight.title} ${insight.description}`.toLowerCase()
    if (text.includes('critical') || text.includes('significant') || text.includes('major')) return 'high'
    if (text.includes('concern') || text.includes('warning') || text.includes('risk')) return 'medium'
    return 'low'
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      financial: 'bg-blue-100 text-blue-800 border-blue-300',
      ai: 'bg-purple-100 text-purple-800 border-purple-300',
      kpi: 'bg-green-100 text-green-800 border-green-300',
      strategic: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      execution: 'bg-orange-100 text-orange-800 border-orange-300'
    }
    return colors[category] || colors.execution
  }

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800 border-red-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-gray-100 text-gray-800 border-gray-300'
    }
    return colors[severity] || colors.low
  }

  if (!result) {
    return (
      <Alert className="border-yellow-200 bg-yellow-50">
        <Info className="h-4 w-4" />
        <AlertTitle>No Analysis Results Available</AlertTitle>
        <AlertDescription>
          Submit a budget request with data to generate AI analysis results, or select a recent submission above.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Load Analysis Section */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle>Load Analysis Result</CardTitle>
          <CardDescription>Select a submission to analyze its AI-generated insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedSubmission} onValueChange={(val) => {
              setSelectedSubmission(val)
              loadSubmissionAnalysis(val)
            }}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a recent submission" />
              </SelectTrigger>
              <SelectContent>
                {submissions.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.departmentName} - FY{sub.fiscalYear} ({new Date(sub.submittedAt).toLocaleDateString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={exportReport} variant="outline">
              <FileDown className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SECTION A: Overview Card */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Analysis Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Department</div>
              <div className="text-xl font-bold">{request?.departmentName || 'Unknown'}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Fiscal Year</div>
              <div className="text-xl font-bold">FY{request?.fiscalYear || '2027'}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">AI Readiness</div>
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - (result.aiReadinessScore || 0) / 100)}`}
                    className="text-purple-600"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xl font-bold">{result.aiReadinessScore || 0}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Confidence</div>
              <div className="text-xl font-bold">{result.confidenceScore || 0}%</div>
              <Progress value={result.confidenceScore || 0} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION B: Data Validation Results */}
      {validation && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Data Validation Results
            </CardTitle>
            <CardDescription>
              Verification that AI analysis used the submitted data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Department Reference */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
              {validation.deptReferenced ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={validation.deptReferenced ? 'text-green-700' : 'text-red-700'}>
                Department name &quot;{request.departmentName}&quot; {validation.deptReferenced ? 'referenced' : 'NOT referenced'} in analysis
              </span>
            </div>

            {/* Metrics References */}
            <div>
              <h4 className="font-semibold mb-2">Metrics Referenced: {validation.metricsCheck.filter((m: any) => m.referenced).length}/{validation.metricsCheck.length}</h4>
              <div className="space-y-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                {validation.metricsCheck.map((metric: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    {metric.referenced ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <Badge variant="outline" className="text-xs">{metric.type}</Badge>
                    <span className={metric.referenced ? 'text-green-700' : 'text-red-700'}>
                      {metric.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Initiatives References */}
            <div>
              <h4 className="font-semibold mb-2">Initiatives Referenced: {validation.initiativesCheck.filter((i: any) => i.referenced).length}/{validation.initiativesCheck.length}</h4>
              <div className="space-y-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                {validation.initiativesCheck.map((initiative: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    {initiative.referenced ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={initiative.referenced ? 'text-green-700' : 'text-red-700'}>
                      {initiative.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Usage Score */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">Overall Data Usage Score</span>
                <div className="flex items-center gap-2">
                  <span className={`text-3xl font-bold ${
                    validation.dataUsageScore >= 80 ? 'text-green-600' :
                    validation.dataUsageScore >= 50 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {validation.dataUsageScore}%
                  </span>
                  {validation.dataUsageScore >= 80 ? (
                    <Badge className="bg-green-500">Excellent</Badge>
                  ) : validation.dataUsageScore >= 50 ? (
                    <Badge className="bg-yellow-500">Good</Badge>
                  ) : (
                    <Badge variant="destructive">Needs Improvement</Badge>
                  )}
                </div>
              </div>
              <Progress value={validation.dataUsageScore} className="mt-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quality Metrics */}
      {qualityMetrics && (
        <Card className="border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              Analysis Quality Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{qualityMetrics.specificityScore}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Specificity</div>
                <div className="text-xs text-gray-500 mt-1">{qualityMetrics.numberCount} numbers cited</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{qualityMetrics.actionabilityScore}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Actionability</div>
                <div className="text-xs text-gray-500 mt-1">{qualityMetrics.actionVerbCount} action verbs</div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{qualityMetrics.referenceScore}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Reference Score</div>
                <div className="text-xs text-gray-500 mt-1">Data cited</div>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">{qualityMetrics.relevanceScore}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Relevance</div>
                <div className="text-xs text-gray-500 mt-1">Dept-specific</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION C: Insights Breakdown */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            Insights Breakdown ({result.insights?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.insights?.map((insight: any, idx: number) => {
            const isExpanded = expandedInsights.has(idx)
            const category = categorizeInsight(insight)
            const severity = getSeverityLevel(insight)

            return (
              <Card 
                key={idx} 
                className="border-l-4 border-l-blue-500 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => toggleInsight(idx)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">#{idx + 1}</Badge>
                        <Badge className={`text-xs ${getCategoryColor(category)}`}>
                          {category}
                        </Badge>
                        <Badge className={`text-xs ${getSeverityColor(severity)}`}>
                          {severity}
                        </Badge>
                      </div>
                      <CardTitle className="text-base">{insight.title}</CardTitle>
                    </div>
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {insight.description}
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-xs">
                      <strong>Analysis:</strong> This insight is categorized as <Badge className="text-xs ml-1">{category}</Badge> 
                      with <Badge className="text-xs ml-1">{severity}</Badge> severity.
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </CardContent>
      </Card>

      {/* SECTION D: Recommendations Breakdown */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Recommendations Breakdown ({result.recommendations?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.recommendations?.map((rec: any, idx: number) => {
            const isExpanded = expandedRecommendations.has(idx)
            const category = categorizeInsight(rec)
            const hasActionVerb = /implement|reduce|increase|improve|develop|create|establish|optimize|enhance|deploy|adopt|invest/i.test(rec.description)

            return (
              <Card 
                key={idx} 
                className="border-l-4 border-l-green-500 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => toggleRecommendation(idx)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">#{idx + 1}</Badge>
                        <Badge className={`text-xs ${getCategoryColor(category)}`}>
                          {category}
                        </Badge>
                        {hasActionVerb && (
                          <Badge className="text-xs bg-green-100 text-green-800">
                            ✓ Actionable
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base">{rec.title}</CardTitle>
                    </div>
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {rec.description}
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-xs space-y-1">
                      <div><strong>Category:</strong> {category}</div>
                      <div><strong>Actionability:</strong> {hasActionVerb ? '✓ Contains action verbs' : '⚠ May lack specific actions'}</div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </CardContent>
      </Card>

      {/* SECTION E: KPI Suggestions Analysis */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            KPI Suggestions Analysis ({result.kpiSuggestions?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.kpiSuggestions?.map((kpi: any, idx: number) => {
            const isExpanded = expandedKPIs.has(idx)
            const isStandardKPI = /time to|turnover|roi|conversion|revenue|cost per|efficiency|satisfaction/i.test(kpi.title)

            return (
              <Card 
                key={idx} 
                className="border-l-4 border-l-purple-500 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => toggleKPI(idx)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">KPI #{idx + 1}</Badge>
                        {isStandardKPI && (
                          <Badge className="text-xs bg-blue-100 text-blue-800">
                            Industry Standard
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base">{kpi.title}</CardTitle>
                    </div>
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pt-0 space-y-3">
                    <div>
                      <strong className="text-sm">Description:</strong>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {kpi.description}
                      </p>
                    </div>
                    <div>
                      <strong className="text-sm">Rationale:</strong>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {kpi.rationale}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-xs">
                      <div><strong>Type:</strong> {isStandardKPI ? 'Industry-standard KPI' : 'Custom KPI suggestion'}</div>
                      <div><strong>Relevance:</strong> Tailored to {request?.departmentName || 'department'} operations</div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </CardContent>
      </Card>

      {/* SECTION F: Risk Assessment */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Risk Assessment ({result.risks?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.risks?.map((risk: any, idx: number) => {
            const severity = getSeverityLevel(risk)

            return (
              <Card 
                key={idx} 
                className={`border-l-4 ${
                  severity === 'high' ? 'border-l-red-500' :
                  severity === 'medium' ? 'border-l-yellow-500' :
                  'border-l-gray-500'
                }`}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getSeverityColor(severity)}`}>
                      {severity.toUpperCase()}
                    </Badge>
                    <CardTitle className="text-base">{risk.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {risk.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </CardContent>
      </Card>

      {/* Raw JSON Section */}
      <Card className="border-gray-200">
        <CardHeader className="cursor-pointer" onClick={() => setShowRawJSON(!showRawJSON)}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Raw JSON Response
            </CardTitle>
            {showRawJSON ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </CardHeader>
        {showRawJSON && (
          <CardContent>
            <pre className="text-xs font-mono bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto border">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

