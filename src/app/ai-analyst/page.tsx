'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Target, 
  BarChart3,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingDown,
  FileText
} from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'

export default function AIAnalystPage() {
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalysis()
  }, [])

  const loadAnalysis = () => {
    try {
      const storedAnalysis = localStorage.getItem('latestAnalysis')
      if (storedAnalysis) {
        const parsedData = JSON.parse(storedAnalysis)
        
        // Check if it's new format (with request and result) or old format (just result)
        if (parsedData.result) {
          setAnalysis(parsedData.result)
        } else {
          setAnalysis(parsedData)
        }
      }
    } catch (error) {
      console.error('Error loading analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'medium':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'low':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <h1 className="text-2xl font-normal text-gray-900">AI Analyst</h1>
            <p className="text-sm text-gray-600 mt-1">AI-powered insights and analysis for your AOP submission</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-8 py-8">

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading analysis...</p>
              </div>
            </div>
          ) : !analysis ? (
            <Card className="border border-gray-200">
              <CardContent className="p-12 text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-normal text-gray-900 mb-3">
                  No Analysis Available Yet
                </h3>
                <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                  Submit your AOP to receive AI-powered analysis and insights.
                </p>
                <a
                  href="/submission"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Submit AOP
                </a>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-gray-100 p-1">
                <TabsTrigger value="overview" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="risks" className="gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Risks
                </TabsTrigger>
                <TabsTrigger value="opportunities" className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Opportunities
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="gap-2">
                  <Target className="h-4 w-4" />
                  Recommendations
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Executive Summary */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {analysis.executiveSummary || analysis.summary || 'Analysis completed successfully.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Key Metrics */}
                {analysis.keyMetrics && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(analysis.keyMetrics).map(([key, value]: [string, any]) => (
                      <Card key={key} className="border border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {typeof value === 'number' ? value.toLocaleString() : value}
                              </p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                              <TrendingUp className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Overall Assessment */}
                {analysis.overallAssessment && (
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle>Overall Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {analysis.overallAssessment}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Risks Tab */}
              <TabsContent value="risks" className="space-y-4">
                {analysis.risks && analysis.risks.length > 0 ? (
                  analysis.risks.map((risk: any, index: number) => (
                    <Card key={index} className={`border-l-4 ${getSeverityColor(risk.severity)} border border-gray-200`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getSeverityIcon(risk.severity)}
                            <div>
                              <CardTitle className="text-lg">{risk.title || risk.area}</CardTitle>
                              {risk.severity && (
                                <Badge variant="outline" className="mt-2">
                                  {risk.severity} Severity
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{risk.description || risk.issue}</p>
                        {risk.impact && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-1">Impact:</p>
                            <p className="text-sm text-gray-700">{risk.impact}</p>
                          </div>
                        )}
                        {risk.mitigation && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-1">Mitigation:</p>
                            <p className="text-sm text-gray-700">{risk.mitigation}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border border-gray-200">
                    <CardContent className="p-12 text-center">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Major Risks Identified</h3>
                      <p className="text-gray-600">Your submission appears to be well-structured with minimal risk factors.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Opportunities Tab */}
              <TabsContent value="opportunities" className="space-y-4">
                {analysis.opportunities && analysis.opportunities.length > 0 ? (
                  analysis.opportunities.map((opportunity: any, index: number) => (
                    <Card key={index} className="border-l-4 border-l-green-500 border border-gray-200">
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <Lightbulb className="h-5 w-5 text-green-500 mt-1" />
                          <div>
                            <CardTitle className="text-lg">{opportunity.title || opportunity.area}</CardTitle>
                            {opportunity.potential && (
                              <Badge variant="outline" className="mt-2 bg-green-50">
                                {opportunity.potential}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{opportunity.description || opportunity.suggestion}</p>
                        {opportunity.implementation && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-1">Implementation:</p>
                            <p className="text-sm text-gray-700">{opportunity.implementation}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border border-gray-200">
                    <CardContent className="p-12 text-center">
                      <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Opportunities Identified</h3>
                      <p className="text-gray-600">The AI analyst didn't identify specific opportunities at this time.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Recommendations Tab */}
              <TabsContent value="recommendations" className="space-y-4">
                {analysis.recommendations && analysis.recommendations.length > 0 ? (
                  analysis.recommendations.map((rec: any, index: number) => (
                    <Card key={index} className="border-l-4 border-l-blue-500 border border-gray-200">
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <Target className="h-5 w-5 text-blue-500 mt-1" />
                          <div>
                            <CardTitle className="text-lg">{rec.title || `Recommendation ${index + 1}`}</CardTitle>
                            {rec.priority && (
                              <Badge variant="outline" className="mt-2">
                                {rec.priority} Priority
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{rec.description || rec.recommendation}</p>
                        {rec.actionItems && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-2">Action Items:</p>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {rec.actionItems.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-blue-600">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border border-gray-200">
                    <CardContent className="p-12 text-center">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations Available</h3>
                      <p className="text-gray-600">The AI analyst didn't provide specific recommendations at this time.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </AppLayout>
  )
}

