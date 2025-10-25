'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Plus, Trash2, Sparkles, DollarSign, Target, Users, Calendar, Info, CheckCircle2, AlertCircle } from 'lucide-react'

interface InitiativesSectionProps {
  formData: any
  setFormData: (data: any) => void
}

interface Initiative {
  id: string
  name: string
  description: string
  owner: string
  startDate: string
  endDate: string
  priority: string
  isBaseline: boolean
  // NEW FY27 FIELDS
  aiIntegrationPlan: string
  aiToolsUsed: string
  totalCost: string
  aiCostImpact: string
  keyOutputMetrics: string
}

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

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function InitiativesSection({ formData, setFormData }: InitiativesSectionProps) {
  const [initiatives, setInitiatives] = useState<Initiative[]>([
    {
      id: '1',
      name: '',
      description: '',
      owner: '',
      startDate: '',
      endDate: '',
      priority: 'medium',
      isBaseline: false,
      aiIntegrationPlan: '',
      aiToolsUsed: '',
      totalCost: '',
      aiCostImpact: '',
      keyOutputMetrics: ''
    },
  ])

  const [baselineAllocations, setBaselineAllocations] = useState<MonthlyAllocation[]>([])
  const [incrementalAllocations, setIncrementalAllocations] = useState<MonthlyAllocation[]>([])
  const [hcJustification, setHcJustification] = useState({
    hcIncreasesJustification: '',
    hcReductionsExplanation: ''
  })

  // Initialize allocations when initiatives change
  useEffect(() => {
    const newBaselineAllocations = initiatives.map(init => {
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

    const incrementalInits = initiatives.filter(i => !i.isBaseline)
    const newIncrementalAllocations = incrementalInits.map(init => {
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
  }, [initiatives.length, initiatives.map(i => i.id).join(',')])

  // Sync with formData
  useEffect(() => {
    setFormData({
      ...formData,
      initiatives,
      resourceAllocation: {
        baseline: baselineAllocations,
        incremental: incrementalAllocations
      },
      hcJustification
    })
  }, [initiatives, baselineAllocations, incrementalAllocations, hcJustification])

  const addInitiative = () => {
    setInitiatives([
      ...initiatives,
      {
        id: Date.now().toString(),
        name: '',
        description: '',
        owner: '',
        startDate: '',
        endDate: '',
        priority: 'medium',
        isBaseline: false,
        aiIntegrationPlan: '',
        aiToolsUsed: '',
        totalCost: '',
        aiCostImpact: '',
        keyOutputMetrics: ''
      },
    ])
  }

  const removeInitiative = (id: string) => {
    setInitiatives(initiatives.filter((i) => i.id !== id))
    setBaselineAllocations(baselineAllocations.filter(a => a.initiativeId !== id))
    setIncrementalAllocations(incrementalAllocations.filter(a => a.initiativeId !== id))
  }

  const updateInitiative = (id: string, field: keyof Initiative, value: any) => {
    setInitiatives(initiatives.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

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

  const hasIncrementalInitiatives = initiatives.some(i => !i.isBaseline)
  const hasBaselineInitiatives = initiatives.some(i => i.isBaseline)

  return (
    <div className="space-y-8">
      {/* FY27 Update Alert */}
      <Alert className="border-purple-200 bg-purple-50/50 dark:border-purple-900 dark:bg-purple-950/20">
        <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        <AlertTitle className="text-purple-900 dark:text-purple-100">
          FY27 Update: AI Integration Plans Recommended
        </AlertTitle>
        <AlertDescription className="text-purple-800 dark:text-purple-200">
          Consider adding an AI Integration Plan for each initiative describing how AI will augment execution, expected efficiency gains, and cost impacts.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="initiatives" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="initiatives">
            <Target className="h-4 w-4 mr-2" />
            Initiative Details
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Users className="h-4 w-4 mr-2" />
            Resource Allocation
          </TabsTrigger>
          <TabsTrigger value="justification">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            HC Justification
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INITIATIVE DETAILS */}
        <TabsContent value="initiatives" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Section 4: Key Initiatives</CardTitle>
              <CardDescription>Define major projects and initiatives planned for FY27 with AI integration strategy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {initiatives.map((initiative, index) => (
                <Card key={initiative.id} className={initiative.isBaseline ? "bg-slate-50 dark:bg-slate-900/50" : "bg-blue-50/50 dark:bg-blue-950/20"}>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">Initiative #{index + 1}</CardTitle>
                        {initiative.isBaseline && <Badge variant="secondary">Baseline</Badge>}
                        {!initiative.isBaseline && <Badge className="bg-blue-500">Incremental</Badge>}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInitiative(initiative.id)}
                        disabled={initiatives.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Initiative Name */}
                    <div className="space-y-2">
                      <Label>Initiative Name *</Label>
                      <Input
                        placeholder="Enter initiative name"
                        value={initiative.name}
                        onChange={(e) => updateInitiative(initiative.id, 'name', e.target.value)}
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label>Description *</Label>
                      <Textarea
                        placeholder="Describe the initiative, its goals, and expected outcomes..."
                        rows={3}
                        value={initiative.description}
                        onChange={(e) => updateInitiative(initiative.id, 'description', e.target.value)}
                      />
                    </div>

                    {/* Owner and Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Initiative Owner *</Label>
                        <Input
                          placeholder="Owner name"
                          value={initiative.owner}
                          onChange={(e) => updateInitiative(initiative.id, 'owner', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select
                          value={initiative.priority}
                          onValueChange={(value) => updateInitiative(initiative.id, 'priority', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={initiative.startDate}
                          onChange={(e) => updateInitiative(initiative.id, 'startDate', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={initiative.endDate}
                          onChange={(e) => updateInitiative(initiative.id, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Costs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Total Initiative Cost ($)
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={initiative.totalCost}
                          onChange={(e) => updateInitiative(initiative.id, 'totalCost', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-purple-500" />
                          AI Cost Efficiency/Growth Impact ($)
                        </Label>
                        <Input
                          type="number"
                          placeholder="Expected savings or revenue growth"
                          value={initiative.aiCostImpact}
                          onChange={(e) => updateInitiative(initiative.id, 'aiCostImpact', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Expected cost savings or revenue growth from AI augmentation
                        </p>
                      </div>
                    </div>

                    {/* Key Output Metrics */}
                    <div className="space-y-2">
                      <Label>Key Output Metric(s)</Label>
                      <Textarea
                        placeholder="Specific metrics this initiative will impact (e.g., 'Reduce customer churn by 15%', 'Increase conversion rate from 2% to 3.5%')"
                        rows={2}
                        value={initiative.keyOutputMetrics}
                        onChange={(e) => updateInitiative(initiative.id, 'keyOutputMetrics', e.target.value)}
                      />
                    </div>

                    {/* AI INTEGRATION SECTION - NEW FY27 */}
                    <div className="pt-4 border-t border-purple-200 dark:border-purple-900 space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        <h4 className="font-semibold text-base">AI Integration (Recommended)</h4>
                        <Badge variant="default" className="bg-purple-500 hover:bg-purple-600">
                          <Sparkles className="h-3 w-3" />
                          NEW FY27
                        </Badge>
                      </div>

                      {/* AI Integration Plan */}
                      <div className="space-y-2">
                        <Label className="text-base font-medium">
                          AI Integration Plan (recommended)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Describe how AI will augment this initiative, tools to be used, and expected efficiency gains
                        </p>
                        <Textarea
                          placeholder="Example: 'Will use Claude for automated document analysis to reduce review time by 40%. GitHub Copilot for code development to accelerate feature delivery by 25%. Expected to save 10 FTE hours/week across the initiative lifecycle.'"
                          rows={4}
                          value={initiative.aiIntegrationPlan}
                          onChange={(e) => updateInitiative(initiative.id, 'aiIntegrationPlan', e.target.value)}
                          className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                        {!initiative.aiIntegrationPlan && (
                          <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Recommended: Add an AI Integration Plan to strengthen your initiative proposal
                          </p>
                        )}
                      </div>

                      {/* AI Tools Used */}
                      <div className="space-y-2">
                        <Label>AI Tools to be Used</Label>
                        <Input
                          placeholder="e.g., ChatGPT, Claude, GitHub Copilot, Cursor, Custom AI models"
                          value={initiative.aiToolsUsed}
                          onChange={(e) => updateInitiative(initiative.id, 'aiToolsUsed', e.target.value)}
                          className="border-purple-200 focus:border-purple-500"
                        />
                        <p className="text-xs text-muted-foreground">
                          List all AI tools/platforms that will be leveraged (comma-separated)
                        </p>
                      </div>
                    </div>

                    {/* Baseline Toggle */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id={`baseline-${initiative.id}`}
                        checked={initiative.isBaseline}
                        onChange={(e) => updateInitiative(initiative.id, 'isBaseline', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <Label htmlFor={`baseline-${initiative.id}`} className="cursor-pointer">
                        This is a baseline/ongoing initiative (existing headcount)
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addInitiative} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Initiative
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: RESOURCE ALLOCATION TABLES */}
        <TabsContent value="resources" className="space-y-6 mt-6">
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
                      {initiatives.filter(i => i.isBaseline).map((initiative, idx) => {
                        const allocation = baselineAllocations.find(a => a.initiativeId === initiative.id)
                        return (
                          <TableRow key={initiative.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-slate-50 dark:bg-slate-900/30'}>
                            <TableCell className="font-medium sticky left-0 bg-inherit">
                              {initiative.name || `Initiative #${initiatives.indexOf(initiative) + 1}`}
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
                      {initiatives.filter(i => !i.isBaseline).map((initiative, idx) => {
                        const allocation = incrementalAllocations.find(a => a.initiativeId === initiative.id)
                        return (
                          <TableRow key={initiative.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-blue-50/30 dark:bg-blue-950/10'}>
                            <TableCell className="font-medium sticky left-0 bg-inherit">
                              {initiative.name || `Initiative #${initiatives.indexOf(initiative) + 1}`}
                            </TableCell>
                            {MONTHS.map(month => (
                              <TableCell key={month}>
                                <Input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  value={allocation?.[month as keyof MonthlyAllocation] || '0'}
                                  onChange={(e) => updateAllocation('incremental', initiative.id, month, e.target.value)}
                                  className="w-[70px] text-center"
                                  placeholder="0"
                                />
                              </TableCell>
                            ))}
                            <TableCell className="bg-blue-100 dark:bg-blue-900/50 text-center font-bold">
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
        </TabsContent>

        {/* TAB 3: HC JUSTIFICATION */}
        <TabsContent value="justification" className="space-y-6 mt-6">
          <Card className="border-amber-200 dark:border-amber-900">
            <CardHeader className="bg-amber-50/50 dark:bg-amber-950/20">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-amber-600" />
                Justification for HC Changes in an AI-Enabled Environment
                <Badge variant="default" className="bg-amber-500">
                  REQUIRED FY27
                </Badge>
              </CardTitle>
              <CardDescription>
                Explain headcount changes in the context of AI augmentation capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <Alert className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
                <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  In FY27, all headcount changes must be justified considering AI's potential to augment productivity. Explain why AI cannot fully address the need (for increases) or how AI enables maintained output (for reductions).
                </AlertDescription>
              </Alert>

              {/* HC Increases Justification */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="hcIncreasesJustification" className="text-base font-medium">
                    1. Justification for HC Increases
                  </Label>
                  {hasIncrementalInitiatives && (
                    <Badge variant="destructive" className="text-xs">
                      Required - Incremental initiatives detected
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  For any HC increases, explain why AI augmentation is insufficient to meet goals
                </p>
                <Textarea
                  id="hcIncreasesJustification"
                  rows={6}
                  placeholder="Example: 'Requesting 3 additional FTEs for customer success team because: (1) AI tools like ChatGPT can automate responses but cannot replace high-touch relationship building for enterprise accounts, (2) despite 30% efficiency gains from AI, customer base growth of 50% requires additional headcount, (3) AI augmentation allows each CSM to handle 20 accounts instead of 15, but still need more people for 100 new accounts.'"
                  value={hcJustification.hcIncreasesJustification}
                  onChange={(e) => setHcJustification({ ...hcJustification, hcIncreasesJustification: e.target.value })}
                  className="border-amber-200 focus:border-amber-500"
                  required={hasIncrementalInitiatives}
                />
                {hasIncrementalInitiatives && !hcJustification.hcIncreasesJustification && (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Justification required because you have incremental initiatives requesting new HC
                  </p>
                )}
              </div>

              {/* HC Reductions Explanation */}
              <div className="space-y-3">
                <Label htmlFor="hcReductionsExplanation" className="text-base font-medium">
                  2. Explanation for HC Reductions (if applicable)
                </Label>
                <p className="text-sm text-muted-foreground">
                  For any HC reductions, explain how AI will maintain or improve output with fewer people
                </p>
                <Textarea
                  id="hcReductionsExplanation"
                  rows={6}
                  placeholder="Example: 'Reducing 2 FTEs from data entry team because AI-powered OCR and automated data extraction eliminates 80% of manual data entry work. Remaining team will focus on exception handling and quality assurance. Output will increase from 1000 to 1500 records/day with fewer people due to AI automation.'"
                  value={hcJustification.hcReductionsExplanation}
                  onChange={(e) => setHcJustification({ ...hcJustification, hcReductionsExplanation: e.target.value })}
                  className="border-amber-200 focus:border-amber-500"
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank if no headcount reductions are planned
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
