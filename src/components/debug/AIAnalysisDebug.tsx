'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react'
import type { AnalysisRequest, AnalysisResult } from '@/lib/ai-analysis'

interface AIAnalysisDebugProps {
  request: AnalysisRequest
  result: AnalysisResult
}

export default function AIAnalysisDebug({ request, result }: AIAnalysisDebugProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  // Extract submitted data
  const businessMetrics = request.aopFormData.businessMetrics || []
  const aiPerformanceMetrics = request.aopFormData.aiPerformanceMetrics || []
  const initiatives = request.aopFormData.initiatives || []
  const aiStrategyOverview = request.aopFormData.aiStrategyOverview || ''

  // Extract metric names
  const businessMetricNames = businessMetrics.map((m: any) => m.name || m.metricName || 'Unnamed')
  const aiMetricNames = aiPerformanceMetrics.map((m: any) => m.name || m.metricName || 'Unnamed')
  const initiativeNames = initiatives.map((i: any) => i.name || 'Unnamed')

  // Combine all analysis text
  const allAnalysisText = [
    result.summary || '',
    ...(result.insights || []).map((i: any) => `${i.title || ''} ${i.description || ''}`),
    ...(result.recommendations || []).map((r: any) => `${r.title || ''} ${r.description || ''}`),
    ...(result.kpiSuggestions || []).map((k: any) => `${k.title || ''} ${k.description || ''} ${k.rationale || ''}`)
  ].join(' ').toLowerCase()

  // Check department reference
  const departmentReferenced = allAnalysisText.includes(request.departmentName.toLowerCase())

  // Check which metrics were referenced
  const metricsReferenceCheck = [
    ...businessMetricNames.map(name => ({
      name,
      referenced: allAnalysisText.includes(name.toLowerCase()),
      type: 'Business'
    })),
    ...aiMetricNames.map(name => ({
      name,
      referenced: allAnalysisText.includes(name.toLowerCase()),
      type: 'AI'
    }))
  ]

  // Check which initiatives were referenced
  const initiativesReferenceCheck = initiativeNames.map(name => ({
    name,
    referenced: allAnalysisText.includes(name.toLowerCase())
  }))

  // Calculate overall data usage score
  const totalItems = metricsReferenceCheck.length + initiativesReferenceCheck.length + 1 // +1 for department
  const referencedItems = [
    ...metricsReferenceCheck.filter(m => m.referenced),
    ...initiativesReferenceCheck.filter(i => i.referenced),
    departmentReferenced ? [1] : []
  ].flat().length
  const dataUsageScore = totalItems > 0 ? Math.round((referencedItems / totalItems) * 100) : 0

  return (
    <Card className="border-yellow-500 border-2 bg-yellow-50 dark:bg-yellow-950/20">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <CardTitle className="text-yellow-900 dark:text-yellow-100">
                AI Analysis Debug Info
              </CardTitle>
              <CardDescription className="text-yellow-700 dark:text-yellow-300">
                Development Only - Verify AI uses submitted data
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-yellow-600 text-yellow-700">
              DEBUG
            </Badge>
            <Badge 
              variant={dataUsageScore >= 80 ? "default" : dataUsageScore >= 50 ? "secondary" : "destructive"}
              className={dataUsageScore >= 80 ? "bg-green-500" : dataUsageScore >= 50 ? "bg-yellow-500" : ""}
            >
              {dataUsageScore}% Data Usage
            </Badge>
            <Button variant="ghost" size="icon">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Section A: Data Sent to AI */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
              📤 Section A: Data Sent to AI
            </h3>
            
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-yellow-200 space-y-3">
              <div>
                <span className="font-medium">🏢 Department:</span> {request.departmentName}
              </div>
              
              <div>
                <span className="font-medium">📊 Business Metrics:</span> {businessMetrics.length} metrics
                {businessMetricNames.length > 0 && (
                  <ul className="ml-6 mt-2 space-y-1">
                    {businessMetricNames.map((name, idx) => (
                      <li key={idx} className="text-sm">• {name}</li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div>
                <span className="font-medium">🤖 AI Performance Metrics:</span> {aiPerformanceMetrics.length} metrics
                {aiMetricNames.length > 0 && (
                  <ul className="ml-6 mt-2 space-y-1">
                    {aiMetricNames.map((name, idx) => (
                      <li key={idx} className="text-sm">• {name}</li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div>
                <span className="font-medium">📋 Initiatives:</span> {initiatives.length} initiatives
                {initiativeNames.length > 0 && (
                  <ul className="ml-6 mt-2 space-y-1">
                    {initiativeNames.map((name, idx) => (
                      <li key={idx} className="text-sm">• {name}</li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div>
                <span className="font-medium">📝 AI Strategy Overview:</span> {aiStrategyOverview.length} characters
                {aiStrategyOverview.length === 0 && (
                  <span className="text-red-600 dark:text-red-400 ml-2">(Not provided)</span>
                )}
              </div>
            </div>
          </div>

          {/* Section B: Analysis Quality Check */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
              🔍 Section B: Analysis Quality Check
            </h3>
            
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-yellow-200 space-y-4">
              {/* Department Reference Check */}
              <div className="flex items-center gap-2">
                {departmentReferenced ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={departmentReferenced ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                  Department name &quot;{request.departmentName}&quot; {departmentReferenced ? 'appears' : 'MISSING'} in analysis
                </span>
              </div>

              {/* Metrics Reference Check */}
              <div>
                <div className="font-medium mb-2">
                  Metric Names Referenced: {metricsReferenceCheck.filter(m => m.referenced).length}/{metricsReferenceCheck.length}
                </div>
                <div className="space-y-1 ml-4">
                  {metricsReferenceCheck.map((metric, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {metric.referenced ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className={metric.referenced ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                        [{metric.type}] {metric.name}
                      </span>
                    </div>
                  ))}
                  {metricsReferenceCheck.length === 0 && (
                    <div className="text-sm text-gray-500">No metrics submitted</div>
                  )}
                </div>
              </div>

              {/* Initiatives Reference Check */}
              <div>
                <div className="font-medium mb-2">
                  Initiative Names Referenced: {initiativesReferenceCheck.filter(i => i.referenced).length}/{initiativesReferenceCheck.length}
                </div>
                <div className="space-y-1 ml-4">
                  {initiativesReferenceCheck.map((initiative, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {initiative.referenced ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className={initiative.referenced ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                        {initiative.name}
                      </span>
                    </div>
                  ))}
                  {initiativesReferenceCheck.length === 0 && (
                    <div className="text-sm text-gray-500">No initiatives submitted</div>
                  )}
                </div>
              </div>

              {/* Overall Data Usage Score */}
              <div className="pt-4 border-t border-yellow-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">Overall Data Usage Score:</span>
                  <div className="flex items-center gap-2">
                    <div className={`text-2xl font-bold ${
                      dataUsageScore >= 80 ? 'text-green-600' : 
                      dataUsageScore >= 50 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {dataUsageScore}%
                    </div>
                    {dataUsageScore >= 80 ? (
                      <Badge className="bg-green-500">Excellent</Badge>
                    ) : dataUsageScore >= 50 ? (
                      <Badge className="bg-yellow-500">Needs Improvement</Badge>
                    ) : (
                      <Badge variant="destructive">Poor - AI may be using generic examples</Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Based on {referencedItems}/{totalItems} submitted items referenced in the analysis
                </p>
              </div>

              {/* Warning if score is low */}
              {dataUsageScore < 50 && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-3 rounded">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-800 dark:text-red-200">
                      <strong>Warning:</strong> Low data usage score indicates the AI may be using generic examples 
                      instead of analyzing your specific submitted data. Review the prompt in src/lib/ai-analysis.ts 
                      to ensure it emphasizes using actual department data.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

