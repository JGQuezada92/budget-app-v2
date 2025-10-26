'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Sparkles, Plus, Trash2, Users, DollarSign, TrendingUp, TrendingDown, Info, CheckCircle2, AlertCircle, Brain, Zap } from 'lucide-react'

interface ResourcesSectionProps {
  formData: any
  setFormData: (data: any) => void
}

interface WorkforceRow {
  id: string
  role: string
  fy2026Current: string
  fy2027Planned: string
  aiToolsLeveraged: string
  tasksAugmented: string
  productivityGains: string
  skillsRequired: string
  aiAugmentationStrategy: string
}

interface CostRow {
  id: string
  category: string
  fy2026Actual: string
  fy2027Plan: string
  notes: string
}

interface AICostBenefitRow {
  id: string
  expense: string
  annualCost: string
  expectedBenefit: string
  paybackPeriod: string
}

const COST_CATEGORIES = [
  'Contractors',
  'Marketing Spend',
  'Temp/Agency Fees',
  'SaaS Products',
  'AI Tool Licenses',
  'AI Training/Enablement',
  'Travel',
  'Office Supplies',
  'Equipment',
  'Other'
]

interface MonthlyAllocation {
  initiativeId: string
  january: string
  february: string
  march: string
  april: string
  may: string
  june: string
  july: string
  august: string
  september: string
  october: string
  november: string
  december: string
  total: number
}

interface HCJustification {
  hcIncreasesJustification: string
  hcReductionsExplanation: string
}

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function ResourcesSection({ formData, setFormData }: ResourcesSectionProps) {
  // AI Strategy Text Fields
  const [aiStrategyFields, setAiStrategyFields] = useState({
    tasksAugmentedByAI: '',
    expectedProductivityImprovement: '',
    skillsDevelopmentNeeded: '',
    hcIncreasesJustificationResources: ''
  })

  // Workforce Planning Table
  const [workforceRows, setWorkforceRows] = useState<WorkforceRow[]>([
    {
      id: '1',
      role: 'Director',
      fy2026Current: '0',
      fy2027Planned: '0',
      aiToolsLeveraged: '',
      tasksAugmented: '',
      productivityGains: '',
      skillsRequired: '',
      aiAugmentationStrategy: ''
    }
  ])

  // Non-Headcount Costs - Start with empty array
  const [costRows, setCostRows] = useState<CostRow[]>([])

  // AI Cost-Benefit Analysis - Start with empty array (optional)
  const [aiCostRows, setAiCostRows] = useState<AICostBenefitRow[]>([])

  // Resource Allocation and HC Justification (moved from Initiatives)
  const [baselineAllocations, setBaselineAllocations] = useState<MonthlyAllocation[]>([])
  const [incrementalAllocations, setIncrementalAllocations] = useState<MonthlyAllocation[]>([])
  const [hcJustification, setHcJustification] = useState<HCJustification>({
    hcIncreasesJustification: '',
    hcReductionsExplanation: ''
  })

  // Calculate progress
  const requiredFieldsComplete = [
    aiStrategyFields.tasksAugmentedByAI.length > 0,
    aiStrategyFields.expectedProductivityImprovement.length > 0,
    aiStrategyFields.skillsDevelopmentNeeded.length > 0,
    workforceRows.length > 0
  ].filter(Boolean).length

  const totalHCIncrease = workforceRows.reduce((sum, row) => {
    const change = (parseFloat(row.fy2027Planned) || 0) - (parseFloat(row.fy2026Current) || 0)
    return sum + (change > 0 ? change : 0)
  }, 0)

  const hcJustificationRequired = totalHCIncrease > 0
  const progressPercentage = (requiredFieldsComplete / 4) * 100

  // Calculate totals
  const totalCurrentHC = workforceRows.reduce((sum, row) => sum + (parseFloat(row.fy2026Current) || 0), 0)
  const totalPlannedHC = workforceRows.reduce((sum, row) => sum + (parseFloat(row.fy2027Planned) || 0), 0)
  const totalCostChange = costRows.reduce((sum, row) => {
    const actual = parseFloat(row.fy2026Actual) || 0
    const plan = parseFloat(row.fy2027Plan) || 0
    return sum + (plan - actual)
  }, 0)
  const totalAICost = aiCostRows.reduce((sum, row) => sum + (parseFloat(row.annualCost) || 0), 0)
  const totalAIBenefit = aiCostRows.reduce((sum, row) => sum + (parseFloat(row.expectedBenefit) || 0), 0)

  // Initialize allocations when initiatives change
  useEffect(() => {
    const initiatives = formData.initiatives || []
    const newBaselineAllocations = initiatives.map((init: any) => {
      const existing = baselineAllocations.find(a => a.initiativeId === init.id)
      return existing || {
        initiativeId: init.id,
        january: '0', february: '0', march: '0', april: '0',
        may: '0', june: '0', july: '0', august: '0',
        september: '0', october: '0', november: '0', december: '0',
        total: 0
      }
    })
    setBaselineAllocations(newBaselineAllocations)

    const incrementalInits = initiatives.filter((i: any) => !i.isBaseline)
    const newIncrementalAllocations = incrementalInits.map((init: any) => {
      const existing = incrementalAllocations.find(a => a.initiativeId === init.id)
      return existing || {
        initiativeId: init.id,
        january: '0', february: '0', march: '0', april: '0',
        may: '0', june: '0', july: '0', august: '0',
        september: '0', october: '0', november: '0', december: '0',
        total: 0
      }
    })
    setIncrementalAllocations(newIncrementalAllocations)
  }, [formData.initiatives])

  // Sync with formData
  useEffect(() => {
    setFormData({
      ...formData,
      aiEnabledWorkforce: {
        ...aiStrategyFields,
        workforceTable: workforceRows,
        nonHeadcountCosts: costRows,
        aiCostBenefitAnalysis: aiCostRows
      },
      resourceAllocation: {
        baseline: baselineAllocations,
        incremental: incrementalAllocations
      },
      hcJustification
    })
  }, [aiStrategyFields, workforceRows, costRows, aiCostRows, baselineAllocations, incrementalAllocations, hcJustification])

  // Workforce table functions
  const addWorkforceRow = () => {
    setWorkforceRows([...workforceRows, {
      id: Date.now().toString(),
      role: '',
      fy2026Current: '0',
      fy2027Planned: '0',
      aiToolsLeveraged: '',
      tasksAugmented: '',
      productivityGains: '',
      skillsRequired: '',
      aiAugmentationStrategy: ''
    }])
  }

  const removeWorkforceRow = (id: string) => {
    if (workforceRows.length > 1) {
      setWorkforceRows(workforceRows.filter(row => row.id !== id))
    }
  }

  const updateWorkforceRow = (id: string, field: keyof WorkforceRow, value: string) => {
    setWorkforceRows(workforceRows.map(row => row.id === id ? { ...row, [field]: value } : row))
  }

  const addCostRow = () => {
    setCostRows([...costRows, {
      id: Date.now().toString(),
      category: '',
      fy2026Actual: '0',
      fy2027Plan: '0',
      notes: ''
    }])
  }

  const removeCostRow = (id: string) => {
    setCostRows(costRows.filter(row => row.id !== id))
  }

  const updateCostRow = (id: string, field: keyof CostRow, value: string) => {
    setCostRows(costRows.map(row => row.id === id ? { ...row, [field]: value } : row))
  }

  const addAICostRow = () => {
    setAiCostRows([...aiCostRows, {
      id: Date.now().toString(),
      expense: '',
      annualCost: '0',
      expectedBenefit: '0',
      paybackPeriod: ''
    }])
  }

  const removeAICostRow = (id: string) => {
    setAiCostRows(aiCostRows.filter(row => row.id !== id))
  }

  const updateAICostRow = (id: string, field: keyof AICostBenefitRow, value: string) => {
    setAiCostRows(aiCostRows.map(row => row.id === id ? { ...row, [field]: value } : row))
  }

  // Resource Allocation Functions (moved from Initiatives)
  const updateAllocation = (type: 'baseline' | 'incremental', initiativeId: string, month: string, value: string) => {
    const allocations = type === 'baseline' ? baselineAllocations : incrementalAllocations
    const setAllocations = type === 'baseline' ? setBaselineAllocations : setIncrementalAllocations

    const updated = allocations.map(alloc => {
      if (alloc.initiativeId === initiativeId) {
        const newAlloc = { ...alloc, [month]: value }
        // Calculate total
        const total = MONTHS.reduce((sum, m) => sum + (parseFloat(newAlloc[m as keyof MonthlyAllocation] as string) || 0), 0)
        return { ...newAlloc, total: parseFloat(total.toFixed(2)) }
      }
      return alloc
    })

    setAllocations(updated)
  }

  const hasIncrementalInitiatives = (formData.initiatives || []).some((i: any) => !i.isBaseline)
  const hasBaselineInitiatives = (formData.initiatives || []).some((i: any) => i.isBaseline)

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <Card className="border-purple-200 dark:border-purple-900">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`h-5 w-5 ${progressPercentage === 100 ? 'text-green-500' : 'text-muted-foreground'}`} />
                <span className="font-medium">Section Completion Progress</span>
              </div>
              <Badge variant={progressPercentage === 100 ? "default" : "secondary"} className={progressPercentage === 100 ? "bg-green-500" : ""}>
                {requiredFieldsComplete}/4 Required Sections
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Complete all 4 required text sections and add at least 1 workforce planning row
            </p>
          </div>
        </CardContent>
      </Card>

      {/* FY27 Update Alert */}
      <Alert className="border-purple-200 bg-purple-50/50 dark:border-purple-900 dark:bg-purple-950/20">
        <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        <AlertTitle className="text-purple-900 dark:text-purple-100">
          FY27 Update: AI-Enabled Workforce Planning
        </AlertTitle>
        <AlertDescription className="text-purple-800 dark:text-purple-200">
          Section 5 now focuses on how AI augments your workforce. Describe AI adoption strategy, productivity gains, and cost-benefit analysis for all AI investments.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="workforce" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workforce">
            <Users className="h-4 w-4 mr-2" />
            Workforce Planning
          </TabsTrigger>
          <TabsTrigger value="allocation">
            <DollarSign className="h-4 w-4 mr-2" />
            Resource Allocation
          </TabsTrigger>
          <TabsTrigger value="justification">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            HC Justification
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: WORKFORCE PLANNING */}
        <TabsContent value="workforce" className="space-y-6 mt-6">

      {/* PART 1: AI STRATEGY TEXT FIELDS */}
      <Card>
        <CardHeader className="bg-purple-50/50 dark:bg-purple-950/20">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI-Enabled Workforce Planning (REQUIRED)
          </CardTitle>
          <CardDescription>
            Answer these 4 questions to describe your AI augmentation strategy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 1. Tasks Augmented by AI */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="tasksAugmentedByAI" className="text-base font-medium">
                1. Which tasks will be augmented/automated by AI? <span className="text-red-500">*</span>
              </Label>
              {aiStrategyFields.tasksAugmentedByAI.length > 0 ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <Textarea
              id="tasksAugmentedByAI"
              rows={5}
              placeholder="List specific tasks that AI will augment or automate. Example: 'Code review and debugging (GitHub Copilot), Report generation and data analysis (Claude), Customer inquiry routing (AI chatbot), Documentation creation (ChatGPT).'"
              value={aiStrategyFields.tasksAugmentedByAI}
              onChange={(e) => setAiStrategyFields({ ...aiStrategyFields, tasksAugmentedByAI: e.target.value })}
              className="border-purple-200 focus:border-purple-500"
              required
            />
            <div className="flex justify-end">
              <span className="text-xs text-muted-foreground">{aiStrategyFields.tasksAugmentedByAI.length} characters</span>
            </div>
          </div>

          {/* 2. Expected Productivity Improvement */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="expectedProductivityImprovement" className="text-base font-medium">
                2. Expected productivity improvement per FTE <span className="text-red-500">*</span>
              </Label>
              {aiStrategyFields.expectedProductivityImprovement.length > 0 ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <Textarea
              id="expectedProductivityImprovement"
              rows={4}
              placeholder="Quantify expected productivity gains. Example: '15% increase in output per engineer through AI-assisted coding, 20% reduction in data analysis time for analysts, 30% faster document processing for operations team.'"
              value={aiStrategyFields.expectedProductivityImprovement}
              onChange={(e) => setAiStrategyFields({ ...aiStrategyFields, expectedProductivityImprovement: e.target.value })}
              className="border-purple-200 focus:border-purple-500"
              required
            />
            <div className="flex justify-end">
              <span className="text-xs text-muted-foreground">{aiStrategyFields.expectedProductivityImprovement.length} characters</span>
            </div>
          </div>

          {/* 3. Skills Development Needed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="skillsDevelopmentNeeded" className="text-base font-medium">
                3. Skills development needed to leverage AI effectively <span className="text-red-500">*</span>
              </Label>
              {aiStrategyFields.skillsDevelopmentNeeded.length > 0 ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <Textarea
              id="skillsDevelopmentNeeded"
              rows={4}
              placeholder="Describe training and skills needed. Example: 'AI prompt engineering training (40 hours), GitHub Copilot certification for all developers, Claude API integration workshop, Change management training for AI adoption.'"
              value={aiStrategyFields.skillsDevelopmentNeeded}
              onChange={(e) => setAiStrategyFields({ ...aiStrategyFields, skillsDevelopmentNeeded: e.target.value })}
              className="border-purple-200 focus:border-purple-500"
              required
            />
            <div className="flex justify-end">
              <span className="text-xs text-muted-foreground">{aiStrategyFields.skillsDevelopmentNeeded.length} characters</span>
            </div>
          </div>

          {/* 4. HC Increases Justification */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="hcIncreasesJustificationResources" className="text-base font-medium">
                4. Justification for any HC increases despite AI availability{hcJustificationRequired && <span className="text-red-500"> *</span>}
              </Label>
              {hcJustificationRequired && (
                aiStrategyFields.hcIncreasesJustificationResources.length > 0 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Badge variant="destructive" className="text-xs">Required - HC increase detected</Badge>
                )
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              If planning HC increases, explain why AI augmentation is insufficient
            </p>
            <Textarea
              id="hcIncreasesJustificationResources"
              rows={5}
              placeholder="Explain HC increases in context of AI. Example: 'While AI improves efficiency by 25%, business growth of 60% still requires additional headcount. AI enables each person to do more, but the absolute volume of work exceeds AI-augmented capacity.'"
              value={aiStrategyFields.hcIncreasesJustificationResources}
              onChange={(e) => setAiStrategyFields({ ...aiStrategyFields, hcIncreasesJustificationResources: e.target.value })}
              className="border-purple-200 focus:border-purple-500"
              required={hcJustificationRequired}
            />
            {hcJustificationRequired && !aiStrategyFields.hcIncreasesJustificationResources && (
              <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Justification required because planned HC ({totalPlannedHC}) exceeds current HC ({totalCurrentHC})
              </p>
            )}
            <div className="flex justify-end">
              <span className="text-xs text-muted-foreground">{aiStrategyFields.hcIncreasesJustificationResources.length} characters</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PART 2: WORKFORCE PLANNING TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Composition with AI Augmentation
          </CardTitle>
          <CardDescription>
            Detail how AI will augment each role in your team structure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-purple-50 dark:bg-purple-950/30">
                  <TableHead className="min-w-[150px]">Role/Level</TableHead>
                  <TableHead className="min-w-[100px] text-center">FY 2026<br />Current HC</TableHead>
                  <TableHead className="min-w-[100px] text-center">FY 2027<br />Planned HC</TableHead>
                  <TableHead className="min-w-[80px] text-center bg-blue-100 dark:bg-blue-950">Change</TableHead>
                  <TableHead className="min-w-[180px]">AI Tools Leveraged</TableHead>
                  <TableHead className="min-w-[200px]">Tasks Augmented/Automated</TableHead>
                  <TableHead className="min-w-[120px]">Expected<br />Productivity Gains</TableHead>
                  <TableHead className="min-w-[150px]">Skills/Development<br />Required</TableHead>
                  <TableHead className="min-w-[250px]">AI Augmentation Strategy</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workforceRows.map((row, idx) => {
                  const current = parseFloat(row.fy2026Current) || 0
                  const planned = parseFloat(row.fy2027Planned) || 0
                  const change = planned - current
                  const changeColor = change > 0 ? 'text-green-600 dark:text-green-400' : change < 0 ? 'text-red-600 dark:text-red-400' : ''

                  return (
                    <TableRow key={row.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                      <TableCell>
                        <Input
                          value={row.role}
                          onChange={(e) => updateWorkforceRow(row.id, 'role', e.target.value)}
                          placeholder="e.g., Senior Engineer"
                          className="min-w-[140px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.fy2026Current}
                          onChange={(e) => updateWorkforceRow(row.id, 'fy2026Current', e.target.value)}
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.fy2027Planned}
                          onChange={(e) => updateWorkforceRow(row.id, 'fy2027Planned', e.target.value)}
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell className="bg-blue-50/50 dark:bg-blue-950/20">
                        <div className={`text-center font-bold ${changeColor}`}>
                          {change > 0 && '+'}{change}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.aiToolsLeveraged}
                          onChange={(e) => updateWorkforceRow(row.id, 'aiToolsLeveraged', e.target.value)}
                          placeholder="e.g., GitHub Copilot"
                        />
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={row.tasksAugmented}
                          onChange={(e) => updateWorkforceRow(row.id, 'tasksAugmented', e.target.value)}
                          placeholder="Tasks AI will handle"
                          rows={2}
                          className="min-w-[190px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.productivityGains}
                          onChange={(e) => updateWorkforceRow(row.id, 'productivityGains', e.target.value)}
                          placeholder="e.g., 20%"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.skillsRequired}
                          onChange={(e) => updateWorkforceRow(row.id, 'skillsRequired', e.target.value)}
                          placeholder="Training needed"
                        />
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={row.aiAugmentationStrategy}
                          onChange={(e) => updateWorkforceRow(row.id, 'aiAugmentationStrategy', e.target.value)}
                          placeholder="How AI enhances this role..."
                          rows={2}
                          className="min-w-[240px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeWorkforceRow(row.id)}
                          disabled={workforceRows.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {/* Total Row */}
                <TableRow className="bg-purple-100 dark:bg-purple-950 font-bold">
                  <TableCell>TOTAL</TableCell>
                  <TableCell className="text-center">{totalCurrentHC}</TableCell>
                  <TableCell className="text-center">{totalPlannedHC}</TableCell>
                  <TableCell className={`text-center ${(totalPlannedHC - totalCurrentHC) > 0 ? 'text-green-600 dark:text-green-400' : (totalPlannedHC - totalCurrentHC) < 0 ? 'text-red-600 dark:text-red-400' : ''}`}>
                    {(totalPlannedHC - totalCurrentHC) > 0 && '+'}{totalPlannedHC - totalCurrentHC}
                  </TableCell>
                  <TableCell colSpan={6}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <Button onClick={addWorkforceRow} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
        </CardContent>
      </Card>

      {/* PART 3: NON-HEADCOUNT COSTS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Non-Headcount Fixed and Variable Costs
          </CardTitle>
          <CardDescription>
            Operating expenses including AI-specific investments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100 dark:bg-slate-900">
                  <TableHead className="min-w-[200px]">Cost Category</TableHead>
                  <TableHead className="min-w-[120px] text-center">FY 2026 Actual</TableHead>
                  <TableHead className="min-w-[120px] text-center">FY 2027 Plan</TableHead>
                  <TableHead className="min-w-[100px] text-center bg-blue-100 dark:bg-blue-950">Change ($)</TableHead>
                  <TableHead className="min-w-[250px]">Notes</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costRows.map((row, idx) => {
                  const actual = parseFloat(row.fy2026Actual) || 0
                  const plan = parseFloat(row.fy2027Plan) || 0
                  const change = plan - actual
                  const changeColor = change > 0 ? 'text-red-600 dark:text-red-400' : change < 0 ? 'text-green-600 dark:text-green-400' : ''

                  return (
                    <TableRow key={row.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                      <TableCell>
                        <Input
                          value={row.category}
                          onChange={(e) => updateCostRow(row.id, 'category', e.target.value)}
                          placeholder="Enter category name (e.g., Software Licenses, Travel)"
                          className="min-w-[180px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.fy2026Actual}
                          onChange={(e) => updateCostRow(row.id, 'fy2026Actual', e.target.value)}
                          className="text-right"
                          placeholder="$0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.fy2027Plan}
                          onChange={(e) => updateCostRow(row.id, 'fy2027Plan', e.target.value)}
                          className="text-right"
                          placeholder="$0"
                        />
                      </TableCell>
                      <TableCell className="bg-blue-50/50 dark:bg-blue-950/20">
                        <div className={`text-center font-bold ${changeColor}`}>
                          {change > 0 && '+'}{change < 0 && ''}{change !== 0 ? `$${Math.abs(change).toLocaleString()}` : '$0'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.notes}
                          onChange={(e) => updateCostRow(row.id, 'notes', e.target.value)}
                          placeholder="Add notes..."
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCostRow(row.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {costRows.length > 0 && (
                  <TableRow className="bg-slate-200 dark:bg-slate-800 font-bold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">
                      ${costRows.reduce((sum, row) => sum + (parseFloat(row.fy2026Actual) || 0), 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ${costRows.reduce((sum, row) => sum + (parseFloat(row.fy2027Plan) || 0), 0).toLocaleString()}
                    </TableCell>
                    <TableCell className={`text-center ${totalCostChange > 0 ? 'text-red-600 dark:text-red-400' : totalCostChange < 0 ? 'text-green-600 dark:text-green-400' : ''}`}>
                      {totalCostChange > 0 && '+'}{totalCostChange < 0 && ''}{totalCostChange !== 0 ? `$${Math.abs(totalCostChange).toLocaleString()}` : '$0'}
                    </TableCell>
                    <TableCell colSpan={2}></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {costRows.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-2">No cost categories added yet</p>
              <p className="text-sm">Click "Add Cost Category" below to add operating expenses</p>
            </div>
          )}
          
          <div className="mt-4">
            <Button onClick={addCostRow} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Cost Category
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PART 4: AI COST-BENEFIT ANALYSIS */}
      <Card className="border-purple-200 dark:border-purple-900">
        <CardHeader className="bg-purple-50/50 dark:bg-purple-950/20">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-500" />
            AI Cost-Benefit Analysis
          </CardTitle>
          <CardDescription>
            (Optional - only complete if investing in AI tools) Quantify AI investments and expected returns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <Alert className="border-purple-200 bg-purple-50/50 dark:border-purple-900 dark:bg-purple-950/20">
            <Info className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <AlertDescription className="text-purple-800 dark:text-purple-200">
              Optional: If your department invests in AI tools, list them here. If tools are shared services (e.g., corporate ChatGPT account), still provide expected benefits even if cost is incurred elsewhere.
            </AlertDescription>
          </Alert>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-purple-100 dark:bg-purple-950">
                  <TableHead className="min-w-[250px]">AI Expense and/or Vendors</TableHead>
                  <TableHead className="min-w-[120px] text-center">Annual Cost ($)</TableHead>
                  <TableHead className="min-w-[140px] text-center">Expected<br />Savings/Benefit ($)</TableHead>
                  <TableHead className="min-w-[120px] text-center">Payback Period</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aiCostRows.map((row, idx) => (
                  <TableRow key={row.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-purple-50/20 dark:bg-purple-950/10'}>
                    <TableCell>
                      <Input
                        value={row.expense}
                        onChange={(e) => updateAICostRow(row.id, 'expense', e.target.value)}
                        placeholder="e.g., ChatGPT Enterprise licenses"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={row.annualCost}
                        onChange={(e) => updateAICostRow(row.id, 'annualCost', e.target.value)}
                        className="text-right"
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={row.expectedBenefit}
                        onChange={(e) => updateAICostRow(row.id, 'expectedBenefit', e.target.value)}
                        className="text-right"
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.paybackPeriod}
                        onChange={(e) => updateAICostRow(row.id, 'paybackPeriod', e.target.value)}
                        placeholder="e.g., 6 months"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAICostRow(row.id)}
                        disabled={aiCostRows.length <= 2}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Total Row */}
                <TableRow className="bg-purple-200 dark:bg-purple-900 font-bold">
                  <TableCell>TOTAL</TableCell>
                  <TableCell className="text-right">${totalAICost.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-green-600 dark:text-green-400">${totalAIBenefit.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    {totalAIBenefit > totalAICost && (
                      <Badge variant="default" className="bg-green-500">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Positive ROI
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {aiCostRows.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-2">No AI investments added yet</p>
              <p className="text-sm">This section is optional. Add AI tools if your department invests in AI.</p>
            </div>
          )}

          <div className="mt-4">
            <Button onClick={addAICostRow} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add AI Investment
            </Button>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        {/* TAB 2: RESOURCE ALLOCATION */}
        <TabsContent value="allocation" className="space-y-6 mt-6">
          <Alert className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-900 dark:text-blue-100">
              Monthly Resource Allocation
            </AlertTitle>
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              Allocate FTEs by month for each initiative. Total FTEs will auto-calculate. Baseline uses current headcount, Incremental represents new resource requests.
            </AlertDescription>
          </Alert>

          {/* BASELINE RESOURCE ALLOCATION TABLE */}
          {hasBaselineInitiatives && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Baseline Resource Allocation (Current HC)
                </CardTitle>
                <CardDescription>
                  Allocate existing headcount resources across baseline initiatives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-100 dark:bg-slate-900">
                        <TableHead className="min-w-[200px] font-semibold sticky left-0 bg-slate-100 dark:bg-slate-900">
                          Initiative
                        </TableHead>
                        {MONTH_LABELS.map(month => (
                          <TableHead key={month} className="min-w-[80px] text-center">
                            {month}
                          </TableHead>
                        ))}
                        <TableHead className="min-w-[100px] text-center bg-green-100 dark:bg-green-950 font-semibold">
                          Total FTEs
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(formData.initiatives || []).filter((i: any) => i.isBaseline).map((initiative: any, idx: number) => {
                        const allocation = baselineAllocations.find(a => a.initiativeId === initiative.id)
                        return (
                          <TableRow key={initiative.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-slate-50 dark:bg-slate-900/30'}>
                            <TableCell className="font-medium sticky left-0 bg-inherit">
                              {initiative.name || `Initiative #${(formData.initiatives || []).indexOf(initiative) + 1}`}
                            </TableCell>
                            {MONTHS.map(month => (
                              <TableCell key={month}>
                                <Input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  value={allocation?.[month as keyof MonthlyAllocation] || '0'}
                                  onChange={(e) => updateAllocation('baseline', initiative.id, month, e.target.value)}
                                  className="w-[70px] text-center"
                                  placeholder="0"
                                />
                              </TableCell>
                            ))}
                            <TableCell className="bg-green-50 dark:bg-green-950/30 text-center font-bold">
                              {allocation?.total.toFixed(1) || '0.0'}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* INCREMENTAL RESOURCE REQUEST TABLE */}
          {hasIncrementalInitiatives && (
            <Card className="border-blue-300 dark:border-blue-800">
              <CardHeader className="bg-blue-50/50 dark:bg-blue-950/20">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Incremental Resource Request (New HC)
                  <Badge className="bg-blue-500">Requires Justification</Badge>
                </CardTitle>
                <CardDescription>
                  Request additional headcount resources for incremental initiatives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-blue-100 dark:bg-blue-950">
                        <TableHead className="min-w-[200px] font-semibold sticky left-0 bg-blue-100 dark:bg-blue-950">
                          Initiative
                        </TableHead>
                        {MONTH_LABELS.map(month => (
                          <TableHead key={month} className="min-w-[80px] text-center">
                            {month}
                          </TableHead>
                        ))}
                        <TableHead className="min-w-[100px] text-center bg-blue-200 dark:bg-blue-900 font-semibold">
                          Total FTEs
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(formData.initiatives || []).filter((i: any) => !i.isBaseline).map((initiative: any, idx: number) => {
                        const allocation = incrementalAllocations.find(a => a.initiativeId === initiative.id)
                        return (
                          <TableRow key={initiative.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-blue-50 dark:bg-blue-950/30'}>
                            <TableCell className="font-medium sticky left-0 bg-inherit">
                              {initiative.name || `Initiative #${(formData.initiatives || []).indexOf(initiative) + 1}`}
                            </TableCell>
                            {MONTHS.map(month => (
                              <TableCell key={month}>
                                <Input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  value={allocation?.[month as keyof MonthlyAllocation] || '0'}
                                  onChange={(e) => updateAllocation('incremental', initiative.id, month, e.target.value)}
                                  className="w-[70px] text-center border-blue-200 focus:border-blue-500"
                                  placeholder="0"
                                />
                              </TableCell>
                            ))}
                            <TableCell className="bg-blue-100 dark:bg-blue-950/50 text-center font-bold">
                              {allocation?.total.toFixed(1) || '0.0'}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SUMMARY CARD */}
          <Card className="border-green-300 dark:border-green-800">
            <CardHeader className="bg-green-50/50 dark:bg-green-950/20">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Resource Allocation Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                    {baselineAllocations.reduce((sum, alloc) => sum + alloc.total, 0).toFixed(1)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Baseline FTEs</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {incrementalAllocations.reduce((sum, alloc) => sum + alloc.total, 0).toFixed(1)}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Incremental FTEs</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {(baselineAllocations.reduce((sum, alloc) => sum + alloc.total, 0) + incrementalAllocations.reduce((sum, alloc) => sum + alloc.total, 0)).toFixed(1)}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Total FTEs</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: HC JUSTIFICATION */}
        <TabsContent value="justification" className="space-y-6 mt-6">
          <Alert className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-900 dark:text-amber-100">
              Headcount Justification Required
            </AlertTitle>
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              Provide detailed justification for any headcount increases or changes. This information is critical for budget approval.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Headcount Justification
              </CardTitle>
              <CardDescription>
                Explain the business case for headcount changes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hcIncreasesJustification">Justification for Headcount Increases</Label>
                <Textarea
                  id="hcIncreasesJustification"
                  placeholder="Explain why additional headcount is needed, what specific roles, and how this supports business objectives..."
                  rows={6}
                  value={hcJustification.hcIncreasesJustification}
                  onChange={(e) => setHcJustification({...hcJustification, hcIncreasesJustification: e.target.value})}
                  className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                />
                <p className="text-xs text-muted-foreground">
                  Required if requesting incremental headcount. Include role descriptions, business impact, and timeline.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hcReductionsExplanation">Headcount Reductions Explanation</Label>
                <Textarea
                  id="hcReductionsExplanation"
                  placeholder="If reducing headcount, explain the rationale, impact on operations, and mitigation strategies..."
                  rows={4}
                  value={hcJustification.hcReductionsExplanation}
                  onChange={(e) => setHcJustification({...hcJustification, hcReductionsExplanation: e.target.value})}
                  className="border-red-200 focus:border-red-500 focus:ring-red-500"
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Explain any headcount reductions and how operations will be maintained.
                </p>
              </div>

              {/* Validation */}
              {incrementalAllocations.reduce((sum, alloc) => sum + alloc.total, 0) > 0 && !hcJustification.hcIncreasesJustification && (
                <Alert className="border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertTitle className="text-red-900 dark:text-red-100">
                    Justification Required
                  </AlertTitle>
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    You have requested incremental headcount but haven't provided justification. This is required for budget approval.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
