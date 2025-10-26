'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  FileText, Download, Play, Copy, Info, Zap, 
  ArrowLeftRight, ChevronDown, ChevronUp, Sparkles 
} from 'lucide-react'
import { sampleFY27Submission, getSampleDataByDepartment } from '@/lib/sample-data'

interface PromptAnnotation {
  line: number
  text: string
  type: 'data' | 'instruction' | 'warning'
}

export default function PromptInspector() {
  const [selectedSample, setSelectedSample] = useState('finance')
  const [prompt, setPrompt] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [compareMode, setCompareMode] = useState(false)
  const [comparePrompt, setComparePrompt] = useState<string | null>(null)
  const [compareDept, setCompareDept] = useState('marketing')
  const [showTestDialog, setShowTestDialog] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [isTesting, setIsTesting] = useState(false)

  // Get sample data based on selection
  const getSampleData = (sampleType: string) => {
    switch (sampleType) {
      case 'finance':
        return getSampleDataByDepartment('finance')
      case 'marketing':
        return {
          departmentName: 'Marketing',
          fiscalYear: '2027',
          teamDescription: 'Marketing team responsible for brand strategy, customer acquisition, and campaign management',
          responsibilities: 'Digital marketing, content creation, SEO/SEM, social media, brand management, lead generation',
          departmentHead: 'Sarah Johnson - CMO',
          aiStrategyOverview: 'Deploy AI for content creation (ChatGPT, Claude for copywriting), campaign optimization (automated A/B testing), and audience targeting (AI-powered segmentation). Target 40% reduction in content production time, 30% improvement in conversion rates, and 50% faster campaign deployment.',
          businessMetrics: [
            { name: 'Customer Acquisition Cost (CAC)', fy2025Actual: '125', fy2026YtdActual: '115', fy2027Plan: '95' },
            { name: 'Conversion Rate (%)', fy2025Actual: '3.2', fy2026YtdActual: '3.8', fy2027Plan: '4.5' },
            { name: 'Marketing ROI', fy2025Actual: '2.8', fy2026YtdActual: '3.1', fy2027Plan: '3.5' }
          ],
          aiPerformanceMetrics: [
            { name: 'AI-generated content pieces per month', fy2027Target: '150' },
            { name: 'Hours saved via AI copywriting', fy2027Target: '80' }
          ],
          initiatives: [
            { name: 'AI-Powered Content Creation Platform', totalCost: '250000', description: 'Automated content generation and optimization' },
            { name: 'Automated Campaign Optimization', totalCost: '180000', description: 'AI-driven campaign testing and optimization' }
          ],
          aiEnabledWorkforce: {
            tasksAugmentedByAI: 'Content writing, campaign optimization, audience segmentation, performance reporting',
            expectedProductivityImprovement: '35% increase in content output, 40% reduction in campaign setup time',
            skillsDevelopmentNeeded: 'AI prompt engineering, AI content review and editing, AI tool integration'
          }
        }
      case 'it':
        return sampleFY27Submission
      default:
        return getSampleDataByDepartment('finance')
    }
  }

  const generatePrompt = async (sampleType: string = selectedSample) => {
    setIsGenerating(true)
    try {
      const sampleData = getSampleData(sampleType)
      
      const response = await fetch('/api/preview-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          departmentName: sampleData.departmentName,
          fiscalYear: sampleData.fiscalYear,
          historicalData: [],
          budgetData: [],
          aopFormData: sampleData
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (compareMode && sampleType !== selectedSample) {
          setComparePrompt(data.prompt)
        } else {
          setPrompt(data.prompt)
        }
      } else {
        alert('Failed to generate prompt')
      }
    } catch (error) {
      console.error('Error generating prompt:', error)
      alert('Error generating prompt')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCompareMode = async () => {
    if (!compareMode) {
      // Entering compare mode
      setCompareMode(true)
      // Generate prompt for comparison department
      await generatePrompt(compareDept)
    } else {
      // Exiting compare mode
      setCompareMode(false)
      setComparePrompt(null)
    }
  }

  const exportPrompt = () => {
    if (prompt) {
      const blob = new Blob([prompt], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-prompt-${selectedSample}-${new Date().getTime()}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const copyToClipboard = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt)
      alert('Prompt copied to clipboard!')
    }
  }

  const testPrompt = async () => {
    setIsTesting(true)
    try {
      const sampleData = getSampleData(selectedSample)
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          departmentName: sampleData.departmentName,
          fiscalYear: sampleData.fiscalYear,
          historicalData: [],
          budgetData: [],
          aopFormData: sampleData
        })
      })

      if (response.ok) {
        const result = await response.json()
        setTestResult(result)
      } else {
        alert('Failed to test prompt')
      }
    } catch (error) {
      console.error('Error testing prompt:', error)
      alert('Error testing prompt')
    } finally {
      setIsTesting(false)
      setShowTestDialog(false)
    }
  }

  // Calculate prompt statistics
  const getPromptStats = (promptText: string | null) => {
    if (!promptText) return null

    const sampleData = getSampleData(selectedSample)
    const lines = promptText.split('\n')
    const sections = promptText.match(/═{3,}/g)?.length || 0
    const criticalWarnings = (promptText.match(/⚠️/g) || []).length
    const departmentMentions = (promptText.toLowerCase().match(new RegExp(sampleData.departmentName?.toLowerCase() || '', 'g')) || []).length
    
    const dataPoints = [
      sampleData.businessMetrics?.length || 0,
      sampleData.aiPerformanceMetrics?.length || 0,
      sampleData.initiatives?.length || 0,
      sampleData.aiStrategyOverview ? 1 : 0,
      sampleData.teamDescription ? 1 : 0,
      sampleData.responsibilities ? 1 : 0
    ].reduce((a, b) => a + b, 0)

    return {
      characterCount: promptText.length,
      estimatedTokens: Math.ceil(promptText.length / 4),
      lineCount: lines.length,
      sectionCount: sections,
      criticalWarnings,
      departmentMentions,
      dataPoints
    }
  }

  const stats = getPromptStats(prompt)

  // Render prompt with syntax highlighting
  const renderPromptLine = (line: string, idx: number, deptName: string) => {
    let className = 'text-gray-800 dark:text-gray-200'
    let bgClassName = ''
    let annotation = ''

    // User data sections (green background)
    if (line.includes('Department Name:') || 
        line.includes('Team Description:') ||
        line.includes('Responsibilities:') ||
        line.includes('AI Strategy Overview:') ||
        line.includes('Business Metrics Submitted:') ||
        line.includes('AI Performance Metrics Submitted:') ||
        line.includes('Total Initiatives Submitted:') ||
        line.includes(`Department: ${deptName}`) ||
        (deptName && line.toLowerCase().includes(deptName.toLowerCase()) && 
         (line.includes('DEPARTMENT') || line.includes('Department')))) {
      bgClassName = 'bg-green-100 dark:bg-green-950/40'
      className = 'text-green-900 dark:text-green-100 font-semibold'
      annotation = '💚 User Data - Actual submitted information'
    }
    
    // Section headers (blue background)
    if (line.includes('═══════') || 
        line.includes('───────') ||
        line.includes('SECTION 1:') ||
        line.includes('SECTION 2:') ||
        line.includes('SECTION 3:') ||
        line.includes('SECTION 4:') ||
        line.includes('SECTION 5:') ||
        line.includes('SECTION 7:') ||
        line.includes('ANALYSIS FRAMEWORK') ||
        line.includes('OUTPUT REQUIREMENTS')) {
      bgClassName = 'bg-blue-100 dark:bg-blue-950/40'
      className = 'text-blue-900 dark:text-blue-100 font-bold'
      annotation = '💙 Section Header - Organizes prompt structure'
    }
    
    // Critical warnings (yellow background)
    if (line.includes('⚠️') || 
        line.includes('CRITICAL') ||
        line.includes('MANDATORY') ||
        line.includes('DO NOT') ||
        line.includes('🔴') ||
        line.includes('🚨')) {
      bgClassName = 'bg-yellow-100 dark:bg-yellow-950/40'
      className = 'text-yellow-900 dark:text-yellow-100 font-semibold'
      annotation = '⚠️ Critical Warning - Prevents AI from using generic examples'
    }

    return (
      <div
        key={idx}
        className={`${bgClassName} ${className} pl-12 pr-4 py-0.5 relative group hover:bg-opacity-80 transition-colors`}
      >
        <span className="absolute left-2 text-gray-400 text-xs select-none w-8 text-right">
          {idx + 1}
        </span>
        {line}
        {showAnnotations && annotation && (
          <span className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
            {annotation}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls Section */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Prompt Configuration
          </CardTitle>
          <CardDescription>
            Generate and inspect AI analysis prompts for different departments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sample Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Load Sample Submission</label>
              <Select value={selectedSample} onValueChange={setSelectedSample}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="finance">Finance Department Sample</SelectItem>
                  <SelectItem value="marketing">Marketing Department Sample</SelectItem>
                  <SelectItem value="it">IT Department Sample</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <Button 
                onClick={() => generatePrompt(selectedSample)} 
                disabled={isGenerating}
                className="w-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Prompt'}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          {prompt && (
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
              <Button onClick={exportPrompt} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export as .txt
              </Button>
              <Button 
                onClick={handleCompareMode} 
                variant="outline" 
                size="sm"
                className={compareMode ? 'bg-purple-100' : ''}
              >
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                {compareMode ? 'Exit Compare Mode' : 'Compare Prompts'}
              </Button>
              <Button 
                onClick={() => setShowAnnotations(!showAnnotations)} 
                variant="outline" 
                size="sm"
              >
                <Info className="h-4 w-4 mr-2" />
                {showAnnotations ? 'Hide' : 'Show'} Annotations
              </Button>
              <Button 
                onClick={() => setShowTestDialog(true)} 
                variant="outline" 
                size="sm"
                className="border-green-300 text-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Test Prompt
              </Button>
            </div>
          )}

          {/* Compare Mode Controls */}
          {compareMode && (
            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50 dark:bg-purple-950/20">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Compare with:</label>
                <Select value={compareDept} onValueChange={setCompareDept}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => generatePrompt(compareDept)} 
                  size="sm"
                  disabled={isGenerating}
                >
                  Generate Comparison
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prompt Statistics */}
      {stats && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Prompt Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.characterCount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Characters</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  ~{stats.estimatedTokens.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Est. Tokens</div>
              </div>
              <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">
                  {stats.lineCount}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Lines</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.sectionCount}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Sections</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.criticalWarnings}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Warnings</div>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.dataPoints}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Data Points</div>
              </div>
              <div className="text-center p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg">
                <div className="text-2xl font-bold text-teal-600">
                  {stats.departmentMentions}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Dept Mentions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      {prompt && (
        <Alert className="border-gray-200 bg-gray-50 dark:bg-gray-900">
          <Info className="h-4 w-4" />
          <AlertTitle>Color Coding Guide</AlertTitle>
          <AlertDescription className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                <span>User Data (actual submitted values)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
                <span>Section Headers & Instructions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-200 border border-yellow-400 rounded"></div>
                <span>Critical Warnings & Requirements</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Prompt Display */}
      {!compareMode && prompt && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Prompt for {selectedSample.charAt(0).toUpperCase() + selectedSample.slice(1)} Department
            </CardTitle>
            <CardDescription>
              Hover over highlighted lines to see annotations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <pre className="text-xs font-mono bg-white dark:bg-gray-900 overflow-x-auto max-h-[600px] overflow-y-auto">
                {prompt.split('\n').map((line, idx) => 
                  renderPromptLine(line, idx, getSampleData(selectedSample).departmentName || '')
                )}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compare Mode - Side by Side */}
      {compareMode && prompt && comparePrompt && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {selectedSample.charAt(0).toUpperCase() + selectedSample.slice(1)} Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <pre className="text-xs font-mono bg-white dark:bg-gray-900 overflow-x-auto max-h-[500px] overflow-y-auto">
                  {prompt.split('\n').map((line, idx) => 
                    renderPromptLine(line, idx, getSampleData(selectedSample).departmentName || '')
                  )}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {compareDept.charAt(0).toUpperCase() + compareDept.slice(1)} Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <pre className="text-xs font-mono bg-white dark:bg-gray-900 overflow-x-auto max-h-[500px] overflow-y-auto">
                  {comparePrompt.split('\n').map((line, idx) => 
                    renderPromptLine(line, idx, getSampleData(compareDept).departmentName || '')
                  )}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Test Result */}
      {testResult && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-600" />
              Test Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-900 p-3 rounded-lg text-center">
                <div className="text-lg font-bold text-blue-600">{testResult.insights?.length || 0}</div>
                <div className="text-xs text-gray-600">Insights</div>
              </div>
              <div className="bg-white dark:bg-gray-900 p-3 rounded-lg text-center">
                <div className="text-lg font-bold text-green-600">{testResult.recommendations?.length || 0}</div>
                <div className="text-xs text-gray-600">Recommendations</div>
              </div>
              <div className="bg-white dark:bg-gray-900 p-3 rounded-lg text-center">
                <div className="text-lg font-bold text-purple-600">{testResult.aiReadinessScore || 0}/100</div>
                <div className="text-xs text-gray-600">AI Readiness</div>
              </div>
              <div className="bg-white dark:bg-gray-900 p-3 rounded-lg text-center">
                <div className="text-lg font-bold text-orange-600">{testResult.confidenceScore || 0}/100</div>
                <div className="text-xs text-gray-600">Confidence</div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Summary:</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{testResult.summary}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Confirmation Dialog */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-600" />
              Test Prompt with Claude API
            </DialogTitle>
            <DialogDescription>
              This will send the prompt to Claude API and cost API tokens
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
              <Info className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> This will make a real API call to Anthropic Claude and consume API tokens. 
                Estimated cost: ~$0.05-0.15 per request depending on prompt size.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Department:</span>
                <span className="font-mono">{getSampleData(selectedSample).departmentName}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tokens:</span>
                <span className="font-mono">~{stats?.estimatedTokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Model:</span>
                <span className="font-mono">claude-sonnet-4-20250514</span>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button onClick={() => setShowTestDialog(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={testPrompt} disabled={isTesting}>
                {isTesting ? 'Testing...' : 'Confirm & Test'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

