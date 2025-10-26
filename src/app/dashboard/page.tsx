'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  FileText, Upload, Brain, TrendingUp, AlertTriangle, Lightbulb, Target, 
  Edit, Trash2, Sparkles, BarChart3, CheckCircle2, Filter, User, Shield 
} from 'lucide-react'
import Link from 'next/link'
import { RoleSwitcher } from '@/components/RoleSwitcher'
import { getUserRole, getUserDepartment, isAdmin } from '@/lib/auth-utils'
import AIAnalysisDebug from '@/components/debug/AIAnalysisDebug'
import { AppLayout } from '@/components/layout/AppLayout'

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<any>(null)
  const [analysisRequest, setAnalysisRequest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fiscalYearFilter, setFiscalYearFilter] = useState('all')
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user')
  const [userDepartment, setUserDepartment] = useState('')

  const handleEditSubmission = (submissionId: string) => {
    const submission = submissions.find(s => s.id === submissionId)
    if (submission) {
      localStorage.setItem('editingSubmission', JSON.stringify(submission))
      window.location.href = '/submission?edit=true'
    }
  }

  const handleDeleteSubmission = (submissionId: string) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      const updatedSubmissions = submissions.filter(s => s.id !== submissionId)
      setSubmissions(updatedSubmissions)
      setFilteredSubmissions(updatedSubmissions)
      localStorage.setItem('userSubmissions', JSON.stringify(updatedSubmissions))
    }
  }

  useEffect(() => {
    // Initialize role and department
    setUserRole(getUserRole())
    setUserDepartment(getUserDepartment())
    loadDashboardData()
  }, [])

  useEffect(() => {
    // Filter submissions when filter or submissions change
    let filtered = submissions

    // Role-based filtering
    if (userRole === 'user') {
      // Regular users see only their department's submissions
      filtered = filtered.filter(s => s.departmentName === userDepartment)
    }
    // Admins see all submissions (no department filter)

    // Fiscal year filter
    if (fiscalYearFilter !== 'all') {
      filtered = filtered.filter(s => s.fiscalYear === fiscalYearFilter)
    }

    setFilteredSubmissions(filtered)
  }, [fiscalYearFilter, submissions, userRole, userDepartment])

  const loadDashboardData = async () => {
    try {
      const storedSubmissions = localStorage.getItem('userSubmissions')
      if (storedSubmissions) {
        const allSubmissions = JSON.parse(storedSubmissions)
        
        setSubmissions(allSubmissions)
        console.log('Loaded submissions:', allSubmissions)
        console.log('User role:', userRole)
        console.log('User department:', userDepartment)
      } else {
        setSubmissions([])
        setFilteredSubmissions([])
      }

      const storedAnalysis = localStorage.getItem('latestAnalysis')
      if (storedAnalysis) {
        const parsedData = JSON.parse(storedAnalysis)
        console.log('Loading real AI analysis:', parsedData)
        
        // Check if it's new format (with request and result) or old format (just result)
        if (parsedData.result && parsedData.request) {
          // New format
          setAnalysis(parsedData.result)
          setAnalysisRequest(parsedData.request)
        } else {
          // Old format - just the result
          setAnalysis(parsedData)
          setAnalysisRequest(null)
        }
      } else {
        // Fallback mock data
        setAnalysis({
          summary: 'No recent analysis available. Submit a budget request with financial data to get AI-powered insights.',
          insights: [
            {
              title: 'No Recent Analysis',
              description: 'Submit a budget request with financial data to get AI-powered insights.'
            }
          ],
          recommendations: [
            {
              title: 'Upload Financial Data',
              description: 'Include historical and budget data for comprehensive analysis.'
            }
          ],
          risks: [
            {
              title: 'Missing Data',
              description: 'Without financial data, analysis capabilities are limited.'
            }
          ],
          opportunities: [
            {
              title: 'Get Started',
              description: 'Create your first budget submission to unlock AI insights.'
            }
          ],
          kpiSuggestions: [],
          aiReadinessScore: 0,
          confidenceScore: 0
        })
      }

      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setLoading(false)
    }
  }

  // Calculate stats
  const totalSubmissions = submissions.length
  const pendingReviews = submissions.filter(s => s.status === 'submitted').length
  const completed = submissions.filter(s => s.status === 'approved' || s.status === 'completed').length
  const avgAIReadiness = submissions.length > 0 
    ? Math.round(submissions.reduce((sum, s) => sum + (s.aiReadinessScore || 0), 0) / submissions.length)
    : 0

  // Get AI readiness color and category
  const getAIReadinessColor = (score: number) => {
    if (score >= 70) return { color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-500', label: 'Advanced' }
    if (score >= 40) return { color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-500', label: 'Developing' }
    return { color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-500', label: 'Emerging' }
  }

  const aiReadinessData = analysis?.aiReadinessScore ? getAIReadinessColor(analysis.aiReadinessScore) : getAIReadinessColor(0)

  // Calculate completion percentage for a submission
  const calculateCompletionPercentage = (submission: any) => {
    const formData = submission.formData || {}
    let completed = 0
    let total = 7 // 7 sections in FY27
    
    // Section 1: Introduction
    if (formData.departmentName && formData.aiStrategyOverview) completed++
    // Section 2: Metrics
    if (formData.aiPerformanceMetrics && formData.aiPerformanceMetrics.length >= 2) completed++
    // Section 3: Prior Year
    if (formData.aiToolsPiloted && formData.performanceAnalysis) completed++
    // Section 4: Initiatives
    if (formData.initiatives && formData.initiatives.length > 0) completed++
    // Section 5: Resources
    if (formData.aiEnabledWorkforce && formData.aiEnabledWorkforce.tasksAugmentedByAI) completed++
    // Section 6: Files
    if (formData.historicalData || formData.budgetData) completed++
    // Section 7: FAQs
    if (formData.appendixFAQs && formData.appendixFAQs.filter((f: any) => f.answer).length > 0) completed++
    
    return Math.round((completed / total) * 100)
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen bg-white">
          <div className="text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-gray-600 animate-pulse" />
            <p className="text-lg font-normal text-gray-900">Loading Dashboard...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-normal text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                {userRole === 'user' 
                  ? `${userDepartment} - FY27 AOP` 
                  : 'All Departments - FY27 AOP'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <RoleSwitcher />
              <Link href="/submission">
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <FileText className="h-4 w-4 mr-2" />
                  New Submission
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-gray-700">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-normal text-gray-900">{totalSubmissions}</div>
              <p className="text-xs text-gray-500 mt-1">All fiscal years</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-gray-700">Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-normal text-gray-900">{pendingReviews}</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-gray-700">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-normal text-gray-900">{completed}</div>
              <p className="text-xs text-gray-500 mt-1">Approved & finalized</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-gray-700">AI Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-normal text-gray-900">
                {avgAIReadiness}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {getAIReadinessColor(avgAIReadiness).label}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Readiness Assessment */}
        {analysis?.aiReadinessScore > 0 && (
          <Card className="mb-8 border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-normal text-gray-900">
                <Brain className="h-5 w-5 text-gray-700" />
                AI Readiness Assessment
              </CardTitle>
              <CardDescription className="text-gray-600">
                Department's AI maturity and integration capability
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Circular Progress */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-40 h-40">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - analysis.aiReadinessScore / 100)}`}
                        className={aiReadinessData.color}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className={`text-4xl font-bold ${aiReadinessData.color}`}>
                        {analysis.aiReadinessScore}
                      </span>
                      <span className="text-sm text-gray-500">Score</span>
                    </div>
                  </div>
                  <Badge variant="default" className={`mt-4 ${aiReadinessData.bgColor} ${aiReadinessData.color} border-0`}>
                    {aiReadinessData.label}
                  </Badge>
                </div>

                {/* Score Breakdown */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Readiness Breakdown
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>0-30: Early Exploration</span>
                          <span className="text-gray-500">Tools piloted, limited adoption</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>31-60: Growing Adoption</span>
                          <span className="text-gray-500">Some teams using, measurable impact</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>61-80: Maturing Practice</span>
                          <span className="text-gray-500">Widespread use, clear gains</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>81-100: AI-Native</span>
                          <span className="text-gray-500">Embedded workflows, innovation</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${aiReadinessData.bgColor}`}>
                    <p className={`text-sm ${aiReadinessData.color}`}>
                      <strong>Assessment:</strong> {analysis.summary.substring(0, 200)}...
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug Component - Development Only */}
        {analysisRequest && analysis && (
          <div className="mb-8">
            <AIAnalysisDebug request={analysisRequest} result={analysis} />
          </div>
        )}

        {/* AI Analysis Results with Tabs */}
        <Card className="mb-8 border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-normal text-gray-900">
              <Brain className="h-5 w-5 text-gray-700" />
              AI-Powered Analysis
            </CardTitle>
            <CardDescription className="text-gray-600">
              Comprehensive budget and strategy evaluation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="insights" className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-gray-100">
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                <TabsTrigger value="kpi">KPI Suggestions</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              {/* Insights Tab */}
              <TabsContent value="insights" className="space-y-3 mt-4">
                {analysis?.insights?.map((insight: any, index: number) => (
                  <div key={index} className="border border-gray-200 p-4 rounded">
                    <h4 className="font-normal text-gray-900 mb-2">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                ))}
              </TabsContent>

              {/* Recommendations Tab */}
              <TabsContent value="recommendations" className="space-y-3 mt-4">
                {analysis?.recommendations?.map((rec: any, index: number) => (
                  <div key={index} className="border border-gray-200 p-4 rounded">
                    <h4 className="font-normal text-gray-900 mb-2">{rec.title}</h4>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                  </div>
                ))}
              </TabsContent>

              {/* Risks Tab */}
              <TabsContent value="risks" className="space-y-3 mt-4">
                {analysis?.risks?.map((risk: any, index: number) => (
                  <div key={index} className="border border-gray-200 p-4 rounded">
                    <h4 className="font-normal text-gray-900 mb-2">{risk.title}</h4>
                    <p className="text-sm text-gray-600">{risk.description}</p>
                  </div>
                ))}
              </TabsContent>

              {/* Opportunities Tab */}
              <TabsContent value="opportunities" className="space-y-3 mt-4">
                {analysis?.opportunities?.map((opp: any, index: number) => (
                  <div key={index} className="border border-gray-200 p-4 rounded">
                    <h4 className="font-normal text-gray-900 mb-2">{opp.title}</h4>
                    <p className="text-sm text-gray-600">{opp.description}</p>
                  </div>
                ))}
              </TabsContent>

              {/* KPI Suggestions Tab */}
              <TabsContent value="kpi" className="space-y-4 mt-4">
                {analysis?.kpiSuggestions && analysis.kpiSuggestions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.kpiSuggestions.map((kpi: any, index: number) => (
                      <Card key={index} className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base font-normal text-gray-900 flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-gray-600" />
                              {kpi.title}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                              {kpi.difficulty || 'Medium'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-sm font-normal text-gray-700 mb-1">What to Measure:</p>
                            <p className="text-sm text-gray-600">{kpi.description}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded border border-gray-200">
                            <p className="text-sm font-normal text-gray-700 mb-1">Why This Matters:</p>
                            <p className="text-sm text-gray-600">{kpi.rationale}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No KPI suggestions available</p>
                    <p className="text-sm">Submit a detailed AOP to get KPI enhancement recommendations</p>
                  </div>
                )}
              </TabsContent>

              {/* Summary Tab */}
              <TabsContent value="summary" className="mt-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Executive Summary
                  </h4>
                  <p className="text-gray-700 whitespace-pre-line">{analysis?.summary}</p>
                  {analysis?.confidenceScore && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Analysis Confidence:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={analysis.confidenceScore} className="w-32 h-2" />
                          <span className="text-sm font-bold text-blue-600">{analysis.confidenceScore}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Recent Submissions with Filter */}
        <Card className="border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-normal text-gray-900">Recent Submissions</CardTitle>
                <CardDescription className="text-gray-600">Your budget submission history</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={fiscalYearFilter} onValueChange={setFiscalYearFilter}>
                  <SelectTrigger className="w-[180px] border-gray-300">
                    <SelectValue placeholder="Filter by year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fiscal Years</SelectItem>
                    <SelectItem value="2025">FY 2025</SelectItem>
                    <SelectItem value="2026">FY 2026</SelectItem>
                    <SelectItem value="2027">FY 2027</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSubmissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No submissions found</p>
                  <p className="text-sm">
                    {fiscalYearFilter === 'all' 
                      ? 'Create your first budget submission to get started' 
                      : `No submissions for FY ${fiscalYearFilter}`}
                  </p>
                </div>
              ) : (
                filteredSubmissions.map((submission) => {
                  const completionPercentage = calculateCompletionPercentage(submission)
                  const isFY27 = submission.fiscalYear === '2027'
                  const submissionAIReadiness = submission.aiReadinessScore || 0
                  const aiReadinessColors = getAIReadinessColor(submissionAIReadiness)

                  return (
                    <div key={submission.id} className="border border-gray-200 rounded p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-normal text-base text-gray-900">{submission.departmentName}</h4>
                            <Badge variant="outline" className="border-gray-300 text-gray-600">
                              FY {submission.fiscalYear}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Total Budget: ${(submission.totalBudget / 1000).toFixed(0)}K
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{completionPercentage}% Complete</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-gray-300 text-gray-600">
                            {submission.status}
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditSubmission(submission.id)}
                              className="border-gray-300"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSubmission(submission.id)}
                              className="border-gray-300 text-gray-600 hover:text-gray-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </AppLayout>
  )
}
