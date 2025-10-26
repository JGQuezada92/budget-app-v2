'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, TrendingUp, Sparkles, Info, CheckCircle2, BarChart3 } from 'lucide-react'

interface BusinessMetric {
  name: string
  explanation: string  // NEW: Explanation of what the metric means
  fy2025Actual: string
  fy2025Plan: string
  yoyPercent: string
  fy2026YtdActual: string
  fy2026YtdYoyPercent: string
  fy2027Plan: string
  fy2027PlanYoyPercent: string
}

interface AIMetric {
  id: string
  name: string
  explanation: string  // NEW: Explanation of what the metric means
  enabled: boolean
  fy2025Actual: string
  fy2026Ytd: string
  fy2027Target: string
  expectedImpact: string
}

interface Props {
  formData: any
  setFormData: (data: any) => void
}

export default function MetricsSection({ formData, setFormData }: Props) {
  // Business Metrics State - Start with empty array
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetric[]>([])

  // AI Metrics State - Start with empty array
  const [aiMetrics, setAiMetrics] = useState<AIMetric[]>([])

  // Sync with formData
  useEffect(() => {
    setFormData({
      ...formData,
      businessMetrics,
      aiPerformanceMetrics: aiMetrics
    })
  }, [businessMetrics, aiMetrics])

  // Business Metrics Functions
  const addBusinessMetric = () => {
    setBusinessMetrics([...businessMetrics, {
      name: '',
      explanation: '',
      fy2025Actual: '',
      fy2025Plan: '',
      yoyPercent: '',
      fy2026YtdActual: '',
      fy2026YtdYoyPercent: '',
      fy2027Plan: '',
      fy2027PlanYoyPercent: ''
    }])
  }
  
  const addAIMetric = () => {
    setAiMetrics([...aiMetrics, {
      id: `ai-${Date.now()}`,
      name: '',
      explanation: '',
      enabled: true,
      fy2025Actual: '',
      fy2026Ytd: '',
      fy2027Target: '',
      expectedImpact: ''
    }])
  }

  const removeBusinessMetric = (index: number) => {
    setBusinessMetrics(businessMetrics.filter((_, i) => i !== index))
  }
  
  const removeAIMetric = (index: number) => {
    setAiMetrics(aiMetrics.filter((_, i) => i !== index))
  }

  const updateBusinessMetric = (index: number, field: keyof BusinessMetric, value: string) => {
    const updated = [...businessMetrics]
    updated[index] = { ...updated[index], [field]: value }
    
    // Auto-calculate YOY percentages
    if (field === 'fy2025Actual' || field === 'fy2025Plan') {
      const actual = parseFloat(updated[index].fy2025Actual) || 0
      const plan = parseFloat(updated[index].fy2025Plan) || 0
      if (plan > 0) {
        const yoy = ((actual - plan) / plan * 100).toFixed(1)
        updated[index].yoyPercent = yoy
      }
    }
    
    if (field === 'fy2026YtdActual' || field === 'fy2025Actual') {
      const ytdActual = parseFloat(updated[index].fy2026YtdActual) || 0
      const fy2025Actual = parseFloat(updated[index].fy2025Actual) || 0
      if (fy2025Actual > 0) {
        const yoy = ((ytdActual - fy2025Actual) / fy2025Actual * 100).toFixed(1)
        updated[index].fy2026YtdYoyPercent = yoy
      }
    }
    
    if (field === 'fy2027Plan' || field === 'fy2026YtdActual') {
      const plan = parseFloat(updated[index].fy2027Plan) || 0
      const ytdActual = parseFloat(updated[index].fy2026YtdActual) || 0
      if (ytdActual > 0) {
        const yoy = ((plan - ytdActual) / ytdActual * 100).toFixed(1)
        updated[index].fy2027PlanYoyPercent = yoy
      }
    }
    
    setBusinessMetrics(updated)
  }

  // AI Metrics Functions
  const updateAiMetric = (index: number, field: keyof AIMetric, value: string | boolean) => {
    const updated = [...aiMetrics]
    updated[index] = { ...updated[index], [field]: value }
    setAiMetrics(updated)
  }

  return (
    <div className="space-y-8">
      {/* FY27 Update Alert */}
      <Alert className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-blue-900 dark:text-blue-100">
          FY27 Update: Customizable Metrics
        </AlertTitle>
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          Add your own business metrics and AI metrics (if applicable). All metric names are customizable to fit your department&apos;s needs.
        </AlertDescription>
      </Alert>

      {/* TABLE 1: Key Business Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Key Business Metrics
              </CardTitle>
              <CardDescription>
                Track your department&apos;s key performance indicators across FY25-27
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {businessMetrics.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="min-w-[200px] font-semibold">
                      Summary of Key Metrics
                      <div className="text-xs font-normal text-muted-foreground">(Outputs and Inputs)</div>
                    </TableHead>
                    <TableHead className="min-w-[250px] font-semibold">
                      Metric Explanation
                      <div className="text-xs font-normal text-muted-foreground">(What this metric measures)</div>
                    </TableHead>
                    <TableHead className="min-w-[120px] text-center">
                      FY 2025<br />Actual
                    </TableHead>
                    <TableHead className="min-w-[120px] text-center">
                      FY 2025<br />Plan
                    </TableHead>
                    <TableHead className="min-w-[100px] text-center bg-blue-50 dark:bg-blue-950/30">
                      YOY %
                    </TableHead>
                    <TableHead className="min-w-[120px] text-center">
                      FY 2026<br />YTD Actual
                    </TableHead>
                    <TableHead className="min-w-[120px] text-center bg-blue-50 dark:bg-blue-950/30">
                      FY 2026 YTD<br />Actual YOY%
                    </TableHead>
                    <TableHead className="min-w-[120px] text-center">
                      FY 2027<br />Plan
                    </TableHead>
                    <TableHead className="min-w-[120px] text-center bg-blue-50 dark:bg-blue-950/30">
                      FY 2027 Plan<br />YOY%
                    </TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businessMetrics.map((metric, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                      <TableCell>
                        <Input
                          value={metric.name}
                          onChange={(e) => updateBusinessMetric(index, 'name', e.target.value)}
                          placeholder="Enter custom metric name (e.g., Net Revenue, Active Users)"
                          className="min-w-[180px] font-medium"
                        />
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={metric.explanation}
                          onChange={(e) => updateBusinessMetric(index, 'explanation', e.target.value)}
                          placeholder="Explain what this metric measures and why it's important for your department..."
                          rows={2}
                          className="min-w-[240px] text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={metric.fy2025Actual}
                          onChange={(e) => updateBusinessMetric(index, 'fy2025Actual', e.target.value)}
                          placeholder="e.g., 95%, 1.2M, 450"
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={metric.fy2025Plan}
                          onChange={(e) => updateBusinessMetric(index, 'fy2025Plan', e.target.value)}
                          placeholder="e.g., 95%, 1.2M, 450"
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell className="bg-blue-50/50 dark:bg-blue-950/20">
                        <div className={`text-center font-semibold ${parseFloat(metric.yoyPercent) > 0 ? 'text-green-600 dark:text-green-400' : parseFloat(metric.yoyPercent) < 0 ? 'text-red-600 dark:text-red-400' : ''}`}>
                          {metric.yoyPercent ? `${metric.yoyPercent}%` : '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={metric.fy2026YtdActual}
                          onChange={(e) => updateBusinessMetric(index, 'fy2026YtdActual', e.target.value)}
                          placeholder="e.g., 95%, 1.2M, 450"
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell className="bg-blue-50/50 dark:bg-blue-950/20">
                        <div className={`text-center font-semibold ${parseFloat(metric.fy2026YtdYoyPercent) > 0 ? 'text-green-600 dark:text-green-400' : parseFloat(metric.fy2026YtdYoyPercent) < 0 ? 'text-red-600 dark:text-red-400' : ''}`}>
                          {metric.fy2026YtdYoyPercent ? `${metric.fy2026YtdYoyPercent}%` : '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={metric.fy2027Plan}
                          onChange={(e) => updateBusinessMetric(index, 'fy2027Plan', e.target.value)}
                          placeholder="e.g., 95%, 1.2M, 450"
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell className="bg-blue-50/50 dark:bg-blue-950/20">
                        <div className={`text-center font-semibold ${parseFloat(metric.fy2027PlanYoyPercent) > 0 ? 'text-green-600 dark:text-green-400' : parseFloat(metric.fy2027PlanYoyPercent) < 0 ? 'text-red-600 dark:text-red-400' : ''}`}>
                          {metric.fy2027PlanYoyPercent ? `${metric.fy2027PlanYoyPercent}%` : '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBusinessMetric(index)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {businessMetrics.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-2">No business metrics added yet</p>
              <p className="text-sm">Click "Add Business Metric" below to start tracking your KPIs</p>
            </div>
          )}
          
          <p className="text-sm text-gray-500 mt-2">
            💡 Tip: Enter values flexibly - use numbers (1500), percentages (95.5%), or suffixes (1.2M, 450K)
          </p>
          
          <div className="mt-4">
            <Button onClick={addBusinessMetric} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Business Metric
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TABLE 2: AI Performance Metrics */}
      <Card className="border-purple-200 dark:border-purple-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                AI Performance Metrics
              </CardTitle>
              <CardDescription>
                Track AI-related metrics if your department uses AI tools (Optional - leave blank if not applicable)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Metrics Table */}
          {aiMetrics.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-purple-50 dark:bg-purple-950/30">
                    <TableHead className="min-w-[250px] font-semibold">
                      AI Performance Metrics
                    </TableHead>
                    <TableHead className="min-w-[250px] font-semibold">
                      Metric Explanation
                      <div className="text-xs font-normal text-muted-foreground">(What this AI metric measures)</div>
                    </TableHead>
                    <TableHead className="min-w-[120px] text-center">
                      FY 2025<br />Actual
                    </TableHead>
                    <TableHead className="min-w-[120px] text-center">
                      FY 2026<br />YTD
                    </TableHead>
                    <TableHead className="min-w-[120px] text-center">
                      FY 2027<br />Target
                    </TableHead>
                    <TableHead className="min-w-[300px]">
                      Expected Impact
                    </TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aiMetrics.map((metric, index) => (
                    <TableRow key={metric.id} className={index % 2 === 0 ? 'bg-background' : 'bg-purple-50/30 dark:bg-purple-950/10'}>
                      <TableCell>
                        <Input
                          value={metric.name}
                          onChange={(e) => updateAiMetric(index, 'name', e.target.value)}
                          placeholder="e.g., Hours saved per month via AI tools"
                          className="font-medium min-w-[240px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={metric.explanation}
                          onChange={(e) => updateAiMetric(index, 'explanation', e.target.value)}
                          placeholder="Explain what this AI metric measures and how it relates to your department's AI strategy..."
                          rows={2}
                          className="min-w-[240px] text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={metric.fy2025Actual}
                          onChange={(e) => updateAiMetric(index, 'fy2025Actual', e.target.value)}
                          placeholder="e.g., 95%, 1.2M, 450"
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={metric.fy2026Ytd}
                          onChange={(e) => updateAiMetric(index, 'fy2026Ytd', e.target.value)}
                          placeholder="e.g., 95%, 1.2M, 450"
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={metric.fy2027Target}
                          onChange={(e) => updateAiMetric(index, 'fy2027Target', e.target.value)}
                          placeholder="e.g., 95%, 1.2M, 450"
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={metric.expectedImpact}
                          onChange={(e) => updateAiMetric(index, 'expectedImpact', e.target.value)}
                          placeholder="Describe expected impact..."
                          rows={2}
                          className="min-w-[280px] text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAIMetric(index)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {aiMetrics.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-2">No AI metrics added yet</p>
              <p className="text-sm">AI metrics are optional. Add them if your department uses AI tools.</p>
            </div>
          )}
          
          <p className="text-sm text-gray-500 mt-2">
            💡 Tip: Enter values flexibly - use numbers, percentages, or formatted values as appropriate for your metric
          </p>
          
          <div className="mt-4">
            <Button onClick={addAIMetric} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add AI Performance Metric
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
