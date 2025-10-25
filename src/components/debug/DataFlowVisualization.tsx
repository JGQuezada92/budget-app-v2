'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { 
  ChevronDown, ChevronUp, FileText, Code, Zap, Cloud, 
  CheckCircle, AlertCircle, TrendingUp, ArrowDown 
} from 'lucide-react'
import { sampleFY27Submission, getSampleDataByDepartment } from '@/lib/sample-data'

interface Stage {
  number: number
  title: string
  description: string
  color: string
  icon: any
  data?: any
}

export default function DataFlowVisualization() {
  const [selectedSample, setSelectedSample] = useState('finance')
  const [expandedStages, setExpandedStages] = useState<Set<number>>(new Set([1]))

  // Load sample data based on selection
  const getSampleData = () => {
    switch (selectedSample) {
      case 'finance':
        return getSampleDataByDepartment('finance')
      case 'marketing':
        return {
          departmentName: 'Marketing',
          fiscalYear: '2027',
          businessMetrics: [
            { name: 'Customer Acquisition Cost (CAC)', fy2025Actual: '125', fy2027Plan: '95' },
            { name: 'Conversion Rate (%)', fy2025Actual: '3.2', fy2027Plan: '4.5' },
            { name: 'Marketing ROI', fy2025Actual: '2.8', fy2027Plan: '3.5' }
          ],
          aiPerformanceMetrics: [
            { name: 'AI-generated content pieces per month', fy2027Target: '150' },
            { name: 'Hours saved via AI copywriting', fy2027Target: '80' }
          ],
          initiatives: [
            { name: 'AI-Powered Content Creation Platform', totalCost: '250000' },
            { name: 'Automated Campaign Optimization', totalCost: '180000' }
          ],
          aiStrategyOverview: 'Deploy AI for content creation (ChatGPT, Claude), campaign optimization, and audience targeting. Target 40% reduction in content production time and 30% improvement in conversion rates.'
        }
      case 'it':
        return sampleFY27Submission
      default:
        return getSampleDataByDepartment('finance')
    }
  }

  const sampleData = getSampleData()

  const toggleStage = (stageNumber: number) => {
    const newExpanded = new Set(expandedStages)
    if (newExpanded.has(stageNumber)) {
      newExpanded.delete(stageNumber)
    } else {
      newExpanded.add(stageNumber)
    }
    setExpandedStages(newExpanded)
  }

  const expandAll = () => {
    setExpandedStages(new Set([1, 2, 3, 4, 5, 6, 7]))
  }

  const collapseAll = () => {
    setExpandedStages(new Set())
  }

  // Define all stages
  const stages: Stage[] = [
    {
      number: 1,
      title: 'Form Submission',
      description: 'User submits AOP form with department data',
      color: 'blue',
      icon: FileText,
      data: {
        'Department Name': sampleData.departmentName,
        'Fiscal Year': `FY${sampleData.fiscalYear}`,
        'Business Metrics Count': sampleData.businessMetrics?.length || 0,
        'Business Metric Names': sampleData.businessMetrics?.map((m: any) => m.name).join(', ') || 'None',
        'AI Metrics Count': sampleData.aiPerformanceMetrics?.length || 0,
        'AI Metric Names': sampleData.aiPerformanceMetrics?.map((m: any) => m.name).join(', ') || 'None',
        'Initiatives Count': sampleData.initiatives?.length || 0,
        'Initiative Names': sampleData.initiatives?.map((i: any) => i.name).join(', ') || 'None',
        'AI Strategy Length': `${sampleData.aiStrategyOverview?.length || 0} characters`
      }
    },
    {
      number: 2,
      title: 'Data Extraction',
      description: 'buildAnalysisPrompt function extracts data from formData',
      color: 'purple',
      icon: Code,
      data: {
        'Source File': 'src/lib/ai-analysis.ts',
        'Function': 'buildAnalysisPrompt(request)',
        'Extracted Fields': [
          'aiStrategyOverview',
          'businessMetrics[]',
          'aiPerformanceMetrics[]',
          'initiatives[]',
          'aiEnabledWorkforce{}',
          'appendixFAQs[]',
          'teamDescription',
          'responsibilities',
          'departmentHead',
          'performanceAnalysis',
          'priorYearOutcomes'
        ].join(', '),
        'Missing Fields': sampleData.aiStrategyOverview ? 'None' : 'aiStrategyOverview missing',
        'Validation': 'All required fields extracted ✓'
      }
    },
    {
      number: 3,
      title: 'Prompt Construction',
      description: 'Build comprehensive analysis prompt with department context',
      color: 'indigo',
      icon: FileText,
      data: {
        'Estimated Prompt Length': '12,000-15,000 characters',
        'Sections Included': [
          '📋 Department-Specific Submission Data',
          '📊 Quantitative Financial Analysis',
          '📝 Qualitative Narrative Analysis',
          '📈 KPI Evaluation & Enhancement',
          '⚠️ Critical Analysis Requirements'
        ].join(' | '),
        'Department-Specific Instructions': `FOR ${sampleData.departmentName?.toUpperCase()} DEPARTMENT`,
        'Critical Warnings': '5 sections with ⚠️ symbols',
        'Actual Metrics Listed': `${sampleData.businessMetrics?.length || 0} business + ${sampleData.aiPerformanceMetrics?.length || 0} AI metrics`,
        'Department References': `${sampleData.departmentName} mentioned 10+ times`
      }
    },
    {
      number: 4,
      title: 'Claude API Call',
      description: 'Send prompt to Anthropic Claude API',
      color: 'orange',
      icon: Cloud,
      data: {
        'Model': 'claude-sonnet-4-20250514',
        'Max Tokens': '8,000',
        'Temperature': '0.7',
        'API Endpoint': 'https://api.anthropic.com/v1/messages',
        'Request Method': 'POST',
        'API Call Timestamp': 'Real-time on submission',
        'Estimated Processing Time': '10-30 seconds'
      }
    },
    {
      number: 5,
      title: 'Response Parsing',
      description: 'Parse JSON response and validate structure',
      color: 'green',
      icon: Code,
      data: {
        'Parser Function': 'parseAIResponse(text)',
        'Response Type': 'JSON',
        'Required Fields': [
          'summary',
          'insights[]',
          'recommendations[]',
          'risks[]',
          'opportunities[]',
          'kpiSuggestions[]',
          'aiReadinessScore',
          'confidenceScore'
        ].join(', '),
        'Validation': 'Checks all required fields present',
        'Default Values': 'Provides fallbacks for missing fields',
        'Error Handling': 'Try-catch with detailed error logging'
      }
    },
    {
      number: 6,
      title: 'Response Validation',
      description: 'Verify AI used submitted data (validateAnalysisResponse)',
      color: 'teal',
      icon: CheckCircle,
      data: {
        'Validator Function': 'validateAnalysisResponse(result, request)',
        'Checks Performed': [
          'Department name referenced',
          'Metrics referenced in analysis',
          'Initiatives referenced in analysis',
          'Data usage percentage calculated'
        ].join(' | '),
        'Expected Metrics References': `${sampleData.businessMetrics?.length || 0}/${sampleData.businessMetrics?.length || 0}`,
        'Expected Initiatives References': `${sampleData.initiatives?.length || 0}/${sampleData.initiatives?.length || 0}`,
        'Target Data Usage Score': '≥ 80%',
        'Warnings Logged': 'If score < 50% or items not referenced'
      }
    },
    {
      number: 7,
      title: 'Return to User',
      description: 'Display analysis results on dashboard',
      color: 'blue',
      icon: TrendingUp,
      data: {
        'Typical Insights Count': '5-7',
        'Typical Recommendations Count': '5-7',
        'Typical Risks Count': '4-5',
        'Typical Opportunities Count': '3-4',
        'Typical KPI Suggestions': '3-4',
        'AI Readiness Score Range': '0-100',
        'Confidence Score Range': '0-100',
        'Display Location': '/dashboard',
        'Storage': 'localStorage (latestAnalysis)'
      }
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, any> = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        border: 'border-blue-200 dark:border-blue-900',
        text: 'text-blue-900 dark:text-blue-100',
        icon: 'text-blue-600'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-950/20',
        border: 'border-purple-200 dark:border-purple-900',
        text: 'text-purple-900 dark:text-purple-100',
        icon: 'text-purple-600'
      },
      indigo: {
        bg: 'bg-indigo-50 dark:bg-indigo-950/20',
        border: 'border-indigo-200 dark:border-indigo-900',
        text: 'text-indigo-900 dark:text-indigo-100',
        icon: 'text-indigo-600'
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-950/20',
        border: 'border-orange-200 dark:border-orange-900',
        text: 'text-orange-900 dark:text-orange-100',
        icon: 'text-orange-600'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-950/20',
        border: 'border-green-200 dark:border-green-900',
        text: 'text-green-900 dark:text-green-100',
        icon: 'text-green-600'
      },
      teal: {
        bg: 'bg-teal-50 dark:bg-teal-950/20',
        border: 'border-teal-200 dark:border-teal-900',
        text: 'text-teal-900 dark:text-teal-100',
        icon: 'text-teal-600'
      }
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Select Sample Submission</label>
          <Select value={selectedSample} onValueChange={setSelectedSample}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="finance">Sample Finance Department</SelectItem>
              <SelectItem value="marketing">Sample Marketing Department</SelectItem>
              <SelectItem value="it">Sample IT Department</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={expandAll} variant="outline" size="sm">
            Expand All
          </Button>
          <Button onClick={collapseAll} variant="outline" size="sm">
            Collapse All
          </Button>
        </div>
      </div>

      {/* Flow Visualization */}
      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const isExpanded = expandedStages.has(stage.number)
          const colors = getColorClasses(stage.color)
          const Icon = stage.icon

          return (
            <div key={stage.number}>
              <Card className={`${colors.border} ${colors.bg} border-2`}>
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => toggleStage(stage.number)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${colors.border} border`}>
                        <Icon className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <div>
                        <CardTitle className={`${colors.text} flex items-center gap-2`}>
                          <Badge variant="outline" className="font-mono">
                            Stage {stage.number}
                          </Badge>
                          {stage.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {stage.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </CardHeader>

                {isExpanded && stage.data && (
                  <CardContent className="pt-0">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="space-y-2">
                        {typeof stage.data === 'object' && !Array.isArray(stage.data) ? (
                          Object.entries(stage.data).map(([key, value]) => (
                            <div key={key} className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                              <div className="font-medium text-gray-700 dark:text-gray-300">
                                {key}:
                              </div>
                              <div className="col-span-2 text-gray-900 dark:text-gray-100 font-mono text-sm">
                                {typeof value === 'string' ? value : JSON.stringify(value)}
                              </div>
                            </div>
                          ))
                        ) : (
                          <pre className="text-xs font-mono whitespace-pre-wrap">
                            {JSON.stringify(stage.data, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Arrow between stages */}
              {idx < stages.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDown className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 border-2">
        <CardHeader>
          <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Pipeline Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">7</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Stages</div>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {sampleData.businessMetrics?.length || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Business Metrics</div>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {sampleData.initiatives?.length || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Initiatives</div>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">~30s</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Processing Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

