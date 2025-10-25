'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, LineChart, Line 
} from 'recharts'
import { 
  Eye, Download, CheckCircle, Clock, AlertCircle, Brain, Sparkles, 
  TrendingUp, TrendingDown, Filter, Search, FileDown, BarChart3,
  DollarSign, Users, Target, Shield, Lock
} from 'lucide-react'
import Link from 'next/link'
import { RoleSwitcher } from '@/components/RoleSwitcher'
import { getUserRole, isAdmin } from '@/lib/auth-utils'
import { AppLayout } from '@/components/layout/AppLayout'

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#14B8A6']

interface DepartmentData {
  id: string
  department: string
  fiscalYear: string
  status: string
  totalBudget: number
  headcount: number
  headcountChange: number
  submittedDate: string | null
  confidenceScore: number | null
  aiReadinessScore: number
  aiInvestment: number
  expectedAISavings: number
  aiToolsUsed: string[]
  kpiEnhancementCount: number
  hasAIJustification: boolean
}

export default function AdminDashboard() {
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([])
  const [filteredData, setFilteredData] = useState<DepartmentData[]>([])
  const [categoryAggregates, setCategoryAggregates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentData | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [hasAdminAccess, setHasAdminAccess] = useState(false)
  
  // Filter states
  const [fiscalYearFilter, setFiscalYearFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [aiReadinessFilter, setAiReadinessFilter] = useState('all')
  const [hcChangeFilter, setHcChangeFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Check admin access
    const adminAccess = isAdmin()
    setHasAdminAccess(adminAccess)
    
    if (adminAccess) {
      loadAdminData()
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    filterDepartments()
  }, [fiscalYearFilter, statusFilter, aiReadinessFilter, hcChangeFilter, searchTerm, departmentData])

  // Helper function to calculate AI Readiness Score from formData
  const calculateAIReadinessScore = (formData: any): number => {
    if (!formData) return 0
    
    let score = 0
    let maxScore = 100
    
    // AI Strategy Overview (20 points)
    if (formData.aiStrategyOverview && formData.aiStrategyOverview.length > 100) score += 20
    else if (formData.aiStrategyOverview) score += 10
    
    // AI Performance Metrics (20 points)
    const aiMetricsCount = formData.aiPerformanceMetrics?.filter((m: any) => m.enabled).length || 0
    if (aiMetricsCount >= 3) score += 20
    else if (aiMetricsCount >= 2) score += 15
    else if (aiMetricsCount >= 1) score += 10
    
    // AI Retrospective (20 points)
    const hasRetrospective = formData.aiToolsPiloted && formData.aiKeyWins && 
                             formData.aiMissesChallenges && formData.aiMeasurableImpacts
    if (hasRetrospective) score += 20
    
    // AI Integration in Initiatives (20 points)
    const initiativesWithAI = formData.initiatives?.filter((i: any) => i.aiIntegrationPlan).length || 0
    const totalInitiatives = formData.initiatives?.length || 1
    score += Math.round((initiativesWithAI / totalInitiatives) * 20)
    
    // AI Workforce Planning (10 points)
    const hasWorkforcePlanning = formData.aiEnabledWorkforce?.tasksAugmentedByAI && 
                                  formData.aiEnabledWorkforce?.expectedProductivityImprovement
    if (hasWorkforcePlanning) score += 10
    
    // AI Cost-Benefit Analysis (10 points)
    const costBenefitCount = formData.aiEnabledWorkforce?.aiCostBenefitAnalysis?.length || 0
    if (costBenefitCount >= 3) score += 10
    else if (costBenefitCount >= 2) score += 7
    else if (costBenefitCount >= 1) score += 4
    
    return Math.min(score, maxScore)
  }

  // Helper function to calculate AI Investment
  const calculateAIInvestment = (formData: any): number => {
    const costBenefitAnalysis = formData.aiEnabledWorkforce?.aiCostBenefitAnalysis || []
    return costBenefitAnalysis.reduce((sum: number, entry: any) => 
      sum + (parseFloat(entry.annualCost) || 0), 0)
  }

  // Helper function to calculate Expected AI Savings
  const calculateExpectedAISavings = (formData: any): number => {
    const costBenefitAnalysis = formData.aiEnabledWorkforce?.aiCostBenefitAnalysis || []
    return costBenefitAnalysis.reduce((sum: number, entry: any) => 
      sum + (parseFloat(entry.expectedSavingsBenefit) || parseFloat(entry.expectedBenefit) || 0), 0)
  }

  // Helper function to extract AI tools used
  const extractAIToolsUsed = (formData: any): string[] => {
    const tools = new Set<string>()
    
    // From AI Strategy Overview
    const strategy = formData.aiStrategyOverview || ''
    const commonTools = ['GitHub Copilot', 'Copilot', 'Claude', 'ChatGPT', 'Cursor', 'Midjourney']
    commonTools.forEach(tool => {
      if (strategy.toLowerCase().includes(tool.toLowerCase())) {
        tools.add(tool)
      }
    })
    
    // From initiatives
    formData.initiatives?.forEach((init: any) => {
      if (init.aiToolsUsed) {
        init.aiToolsUsed.split(',').forEach((tool: string) => {
          const trimmed = tool.trim()
          if (trimmed) tools.add(trimmed)
        })
      }
    })
    
    // From workforce planning
    formData.aiEnabledWorkforce?.workforceTable?.forEach((row: any) => {
      if (row.aiToolsLeveraged) {
        row.aiToolsLeveraged.split(',').forEach((tool: string) => {
          const trimmed = tool.trim()
          if (trimmed) tools.add(trimmed)
        })
      }
    })
    
    return Array.from(tools)
  }

  // Helper function to count KPI enhancements
  const countKPIEnhancements = (formData: any): number => {
    return formData.aiPerformanceMetrics?.filter((m: any) => m.enabled).length || 0
  }

  // Helper function to check AI justification
  const checkHasAIJustification = (formData: any): boolean => {
    const hasInitiativeJustification = formData.hcJustification?.hcIncreasesJustification?.length > 0
    const hasWorkforceJustification = formData.aiEnabledWorkforce?.hcIncreasesJustificationResources?.length > 0
    return hasInitiativeJustification || hasWorkforceJustification || false
  }

  const loadAdminData = async () => {
    try {
      // Read real submissions from localStorage
      const storedSubmissions = localStorage.getItem('userSubmissions')
      
      if (!storedSubmissions) {
        // No submissions yet - set empty state
        setDepartmentData([])
        setFilteredData([])
        setCategoryAggregates([])
        setLoading(false)
        return
      }

      const submissions = JSON.parse(storedSubmissions)
      
      // Transform submissions into DepartmentData format
      const transformedData: DepartmentData[] = submissions.map((submission: any) => {
        const formData = submission.formData || {}
        
        // Calculate headcount from workforce table
        const workforceTable = formData.aiEnabledWorkforce?.workforceTable || []
        const totalCurrentHC = workforceTable.reduce((sum: number, row: any) => 
          sum + (parseFloat(row.fy2026Current) || parseFloat(row.fy2026CurrentHc) || 0), 0)
        const totalPlannedHC = workforceTable.reduce((sum: number, row: any) => 
          sum + (parseFloat(row.fy2027Planned) || parseFloat(row.fy2027PlannedHc) || 0), 0)
        
        return {
          id: submission.id,
          department: submission.departmentName,
          fiscalYear: submission.fiscalYear,
          status: submission.status || 'draft',
          totalBudget: submission.totalBudget || 0,
          headcount: totalPlannedHC || totalCurrentHC || 0,
          headcountChange: totalPlannedHC - totalCurrentHC,
          submittedDate: submission.submittedAt || null,
          confidenceScore: submission.confidenceScore || null,
          aiReadinessScore: calculateAIReadinessScore(formData),
          aiInvestment: calculateAIInvestment(formData),
          expectedAISavings: calculateExpectedAISavings(formData),
          aiToolsUsed: extractAIToolsUsed(formData),
          kpiEnhancementCount: countKPIEnhancements(formData),
          hasAIJustification: checkHasAIJustification(formData)
        }
      })

      setDepartmentData(transformedData)
      setFilteredData(transformedData)

      // Calculate category aggregates from real data
      if (transformedData.length > 0) {
        const totalAIInvestment = transformedData.reduce((sum, dept) => sum + dept.aiInvestment, 0)
        const totalBudget = transformedData.reduce((sum, dept) => sum + dept.totalBudget, 0)
        
        // Calculate categories from non-headcount costs
        const allCosts = transformedData.flatMap(dept => 
          submissions.find((s: any) => s.id === dept.id)?.formData?.aiEnabledWorkforce?.nonHeadcountCosts || []
        )
        
        const costByCategory: Record<string, number> = {}
        allCosts.forEach((cost: any) => {
          const category = cost.costCategory || cost.category || 'Other'
          const amount = parseFloat(cost.fy2027Plan) || parseFloat(cost.fy2027Plan) || 0
          costByCategory[category] = (costByCategory[category] || 0) + amount
        })
        
        // Estimate headcount costs (assuming avg $120K per FTE)
        const totalHeadcount = transformedData.reduce((sum, dept) => sum + dept.headcount, 0)
        const headcountCost = totalHeadcount * 120000
        
        // Build category aggregates
        const categories = [
          { category: 'Headcount', amount: headcountCost },
          { category: 'AI Tool Licenses', amount: costByCategory['AI Tool Licenses'] || totalAIInvestment * 0.6 },
          { category: 'AI Training', amount: costByCategory['AI Training/Enablement'] || totalAIInvestment * 0.4 },
          { category: 'Software & Licenses', amount: costByCategory['SaaS Products'] || 0 },
          { category: 'Marketing', amount: costByCategory['Marketing Spend'] || 0 },
          { category: 'Professional Fees', amount: costByCategory['Contractors'] || 0 },
          { category: 'Equipment', amount: costByCategory['Equipment'] || 0 },
          { category: 'Other', amount: costByCategory['Other'] || 0 }
        ].filter(cat => cat.amount > 0)
        
        const totalAmount = categories.reduce((sum, cat) => sum + cat.amount, 0)
        
        const categoriesWithPercentage = categories.map(cat => ({
          ...cat,
          percentage: totalAmount > 0 ? Math.round((cat.amount / totalAmount) * 100) : 0
        }))
        
        setCategoryAggregates(categoriesWithPercentage)
      } else {
        setCategoryAggregates([])
      }

      setLoading(false)
    } catch (error) {
      console.error('Error loading admin data:', error)
      setDepartmentData([])
      setFilteredData([])
      setLoading(false)
    }
  }

  const filterDepartments = () => {
    let filtered = [...departmentData]

    if (fiscalYearFilter !== 'all') {
      filtered = filtered.filter(d => d.fiscalYear === fiscalYearFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => d.status === statusFilter)
    }

    if (aiReadinessFilter !== 'all') {
      if (aiReadinessFilter === 'low') {
        filtered = filtered.filter(d => d.aiReadinessScore < 40)
      } else if (aiReadinessFilter === 'medium') {
        filtered = filtered.filter(d => d.aiReadinessScore >= 40 && d.aiReadinessScore < 70)
      } else if (aiReadinessFilter === 'high') {
        filtered = filtered.filter(d => d.aiReadinessScore >= 70)
      }
    }

    if (hcChangeFilter !== 'all') {
      if (hcChangeFilter === 'increase') {
        filtered = filtered.filter(d => d.headcountChange > 0)
      } else if (hcChangeFilter === 'decrease') {
        filtered = filtered.filter(d => d.headcountChange < 0)
      } else if (hcChangeFilter === 'stable') {
        filtered = filtered.filter(d => d.headcountChange === 0)
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredData(filtered)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      submitted: { label: 'Submitted', className: 'bg-green-100 text-green-700' },
      draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
      under_review: { label: 'Under Review', className: 'bg-blue-100 text-blue-700' },
      approved: { label: 'Approved', className: 'bg-purple-100 text-purple-700' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getAIReadinessColor = (score: number) => {
    if (score >= 70) return { text: 'text-green-600', bg: 'bg-green-100', label: 'Advanced' }
    if (score >= 40) return { text: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Developing' }
    return { text: 'text-red-600', bg: 'bg-red-100', label: 'Emerging' }
  }

  // Calculate aggregates
  const totalBudget = filteredData.reduce((sum, dept) => sum + dept.totalBudget, 0)
  const submittedCount = filteredData.filter(d => d.status === 'submitted' || d.status === 'under_review').length
  const totalHeadcountChange = filteredData.reduce((sum, dept) => sum + dept.headcountChange, 0)
  const avgAIReadiness = filteredData.length > 0 
    ? Math.round(filteredData.reduce((sum, d) => sum + d.aiReadinessScore, 0) / filteredData.length)
    : 0
  const totalAIInvestment = filteredData.reduce((sum, dept) => sum + dept.aiInvestment, 0)
  const totalExpectedAISavings = filteredData.reduce((sum, dept) => sum + dept.expectedAISavings, 0)

  // AI Readiness Distribution Data
  const aiReadinessDistribution = [
    { range: '0-40 (Emerging)', count: filteredData.filter(d => d.aiReadinessScore < 40).length },
    { range: '40-70 (Developing)', count: filteredData.filter(d => d.aiReadinessScore >= 40 && d.aiReadinessScore < 70).length },
    { range: '70-100 (Advanced)', count: filteredData.filter(d => d.aiReadinessScore >= 70).length }
  ]

  // AI Tool Usage Data
  const aiToolUsage: Record<string, number> = {}
  filteredData.forEach(dept => {
    dept.aiToolsUsed.forEach(tool => {
      aiToolUsage[tool] = (aiToolUsage[tool] || 0) + 1
    })
  })
  const aiToolData = Object.entries(aiToolUsage)
    .map(([tool, count]) => ({ tool, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // HC Changes Data
  const hcChangesData = [
    { name: 'HC Increase (Justified)', value: filteredData.filter(d => d.headcountChange > 0 && d.hasAIJustification).length },
    { name: 'HC Increase (Needs Justification)', value: filteredData.filter(d => d.headcountChange > 0 && !d.hasAIJustification).length },
    { name: 'HC Decrease (AI Compensated)', value: filteredData.filter(d => d.headcountChange < 0).length },
    { name: 'HC Stable', value: filteredData.filter(d => d.headcountChange === 0).length }
  ]

  // AI Investment vs ROI Scatter Data
  const aiInvestmentROIData = filteredData.map(dept => ({
    department: dept.department,
    investment: dept.aiInvestment / 1000,
    savings: dept.expectedAISavings / 1000,
    roi: ((dept.expectedAISavings - dept.aiInvestment) / dept.aiInvestment * 100).toFixed(0)
  }))

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-pulse" />
            <p className="text-lg font-medium">Loading Admin Dashboard...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Access denied for non-admin users
  if (!hasAdminAccess) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <div className="flex items-center gap-3">
                <RoleSwitcher />
                <Link href="/dashboard">
                  <Button variant="outline">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border-2 border-red-200">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Lock className="h-16 w-16 mx-auto mb-4 text-red-400" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
                <p className="text-gray-600 mb-6">
                  You don't have permission to view this page. Admin access is required to view aggregated department data.
                </p>
                <Alert variant="default" className="max-w-md mx-auto mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Testing Mode</AlertTitle>
                  <AlertDescription>
                    Use the "View as" selector in the header to switch to Admin role for testing purposes.
                  </AlertDescription>
                </Alert>
                <div className="flex gap-3 justify-center">
                  <Link href="/dashboard">
                    <Button>
                      Go to My Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      localStorage.setItem('userRole', 'admin')
                      window.location.reload()
                    }}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Switch to Admin (Testing)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      </AppLayout>
    )
  }

  const lastUpdated = new Date().toLocaleString()

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <Badge variant="default" className="bg-purple-500">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin View - All Departments
                </Badge>
              </div>
              <p className="text-gray-600 mt-1">FY27 AOP Submissions Overview - AI-Enhanced</p>
              <p className="text-xs text-gray-500 mt-1">Last updated: {lastUpdated}</p>
            </div>
            <div className="flex gap-2">
              <RoleSwitcher />
              <Link href="/dashboard">
                <Button variant="outline">
                  User Dashboard
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => {
                  setLoading(true)
                  loadAdminData()
                }}
              >
                Refresh Data
              </Button>
              <Select defaultValue="summary">
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">
                    <div className="flex items-center gap-2">
                      <FileDown className="h-4 w-4" />
                      Export Summary (PDF)
                    </div>
                  </SelectItem>
                  <SelectItem value="all">Export All Data (Excel)</SelectItem>
                  <SelectItem value="ai">AI Readiness Report (PDF)</SelectItem>
                  <SelectItem value="financial">Financial Aggregations (Excel)</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={fiscalYearFilter} onValueChange={setFiscalYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Fiscal Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2025">FY 2025</SelectItem>
                  <SelectItem value="2026">FY 2026</SelectItem>
                  <SelectItem value="2027">FY 2027</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={aiReadinessFilter} onValueChange={setAiReadinessFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="AI Readiness" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="low">Low (&lt;40)</SelectItem>
                  <SelectItem value="medium">Medium (40-70)</SelectItem>
                  <SelectItem value="high">High (70+)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={hcChangeFilter} onValueChange={setHcChangeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="HC Change" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Changes</SelectItem>
                  <SelectItem value="increase">Increase</SelectItem>
                  <SelectItem value="decrease">Decrease</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                onClick={() => {
                  setFiscalYearFilter('all')
                  setStatusFilter('all')
                  setAiReadinessFilter('all')
                  setHcChangeFilter('all')
                  setSearchTerm('')
                }}
              >
                Clear Filters
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Showing {filteredData.length} of {departmentData.length} departments
            </p>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="border-2 border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                ${(totalBudget / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-gray-500 mt-1">Requested funding</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {submittedCount}/{filteredData.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">Submitted/Total</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                Avg AI Readiness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getAIReadinessColor(avgAIReadiness).text}`}>
                {avgAIReadiness}
              </div>
              <p className="text-xs text-gray-500 mt-1">{getAIReadinessColor(avgAIReadiness).label}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">AI Investment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                ${(totalAIInvestment / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-gray-500 mt-1">Total AI spend</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-teal-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Expected ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal-600">
                ${(totalExpectedAISavings / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-gray-500 mt-1">AI savings target</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Adoption Overview */}
        {departmentData.length > 0 && (
          <Card className="mb-8 border-2 border-purple-200">
            <CardHeader className="bg-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Adoption Overview
                <Badge variant="default" className="bg-purple-500">
                  <Sparkles className="h-3 w-3 mr-1" />
                  FY27 Analytics
                </Badge>
              </CardTitle>
              <CardDescription>
                Comprehensive view of AI strategy adoption across departments
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Readiness Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Readiness Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={aiReadinessDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" angle={-15} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* AI Tool Usage */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Tool Usage Across Departments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={aiToolData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="tool" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* AI Investment vs ROI */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Investment vs. Expected ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="investment" name="Investment" unit="K" />
                      <YAxis dataKey="savings" name="Savings" unit="K" />
                      <ZAxis range={[50, 400]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Legend />
                      <Scatter name="Departments" data={aiInvestmentROIData} fill="#3B82F6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* HC Changes with AI Context */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">HC Changes with AI Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={hcChangesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {hcChangesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Department Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Department Submissions</CardTitle>
            <CardDescription>Detailed view with AI readiness and financial metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <FileDown className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {departmentData.length === 0 ? 'No Submissions Yet' : 'No Matching Submissions'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {departmentData.length === 0 
                    ? 'Departments have not submitted any AOP forms yet.'
                    : 'No submissions match your current filter criteria.'}
                </p>
                {departmentData.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Visit <a href="/submission" className="text-blue-600 hover:underline">/submission</a> to create your first AOP submission.
                  </p>
                )}
                {departmentData.length > 0 && filteredData.length === 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setFiscalYearFilter('all')
                      setStatusFilter('all')
                      setAiReadinessFilter('all')
                      setHcChangeFilter('all')
                      setSearchTerm('')
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>FY</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>HC Change</TableHead>
                      <TableHead>AI Readiness</TableHead>
                      <TableHead>AI Investment</TableHead>
                      <TableHead>Expected Savings</TableHead>
                      <TableHead>KPI Suggestions</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((dept) => {
                    const aiColor = getAIReadinessColor(dept.aiReadinessScore)
                    return (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {dept.department}
                            {dept.fiscalYear === '2027' && (
                              <Badge variant="outline" className="text-xs bg-purple-50">
                                <Sparkles className="h-3 w-3 mr-1" />
                                FY27
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{dept.fiscalYear}</TableCell>
                        <TableCell>{getStatusBadge(dept.status)}</TableCell>
                        <TableCell>${(dept.totalBudget / 1000).toFixed(0)}K</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {dept.headcountChange > 0 ? (
                              <>
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <span className="text-green-600 font-medium">+{dept.headcountChange}</span>
                              </>
                            ) : dept.headcountChange < 0 ? (
                              <>
                                <TrendingDown className="h-4 w-4 text-red-600" />
                                <span className="text-red-600 font-medium">{dept.headcountChange}</span>
                              </>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                            {dept.headcountChange !== 0 && (
                              dept.hasAIJustification ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-600" />
                              )
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${aiColor.bg} ${aiColor.text} border-0`}>
                            {dept.aiReadinessScore}
                          </Badge>
                        </TableCell>
                        <TableCell>${(dept.aiInvestment / 1000).toFixed(0)}K</TableCell>
                        <TableCell className="text-green-600 font-medium">
                          ${(dept.expectedAISavings / 1000).toFixed(0)}K
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{dept.kpiEnhancementCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedDepartment(dept)
                              setShowDetailModal(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Aggregation Views */}
        {departmentData.length > 0 && categoryAggregates.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Aggregations
              </CardTitle>
              <CardDescription>Budget breakdown and category analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Budget by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryAggregates}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
                      <Bar dataKey="amount" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* AI Investment Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Investment Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'AI Tool Licenses', value: 310000 },
                          { name: 'AI Training', value: 175000 },
                          { name: 'Implementation', value: 120000 },
                          { name: 'AI Classes', value: 85000 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={(entry) => `${entry.name}: $${(entry.value / 1000).toFixed(0)}K`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[0, 1, 2, 3].map((index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Department Detail Modal (simplified - would be enhanced with tabs) */}
      {showDetailModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{selectedDepartment.department}</CardTitle>
                  <CardDescription>FY{selectedDepartment.fiscalYear} AOP Submission Details</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="ai">AI Strategy</TabsTrigger>
                  <TabsTrigger value="kpi">KPI Analysis</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Budget</p>
                      <p className="text-2xl font-bold">${(selectedDepartment.totalBudget / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">AI Readiness Score</p>
                      <p className={`text-2xl font-bold ${getAIReadinessColor(selectedDepartment.aiReadinessScore).text}`}>
                        {selectedDepartment.aiReadinessScore}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">HC Change</p>
                      <p className="text-2xl font-bold">{selectedDepartment.headcountChange > 0 ? '+' : ''}{selectedDepartment.headcountChange}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">AI Investment</p>
                      <p className="text-2xl font-bold text-purple-600">${(selectedDepartment.aiInvestment / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">AI Tools Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDepartment.aiToolsUsed.map((tool, idx) => (
                        <Badge key={idx} variant="outline" className="bg-purple-50">
                          <Sparkles className="h-3 w-3 mr-1" />
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Expected AI Savings</h4>
                    <p className="text-xl text-green-600 font-bold">
                      ${(selectedDepartment.expectedAISavings / 1000).toFixed(0)}K
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="kpi">
                  <p className="text-gray-600">KPI analysis details would be displayed here...</p>
                </TabsContent>

                <TabsContent value="resources">
                  <p className="text-gray-600">Resource allocation tables would be displayed here...</p>
                </TabsContent>

                <TabsContent value="financial">
                  <p className="text-gray-600">Detailed financial breakdown would be displayed here...</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
    </AppLayout>
  )
}
