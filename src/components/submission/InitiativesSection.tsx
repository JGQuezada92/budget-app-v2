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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Plus, Trash2, Sparkles, Target, AlertCircle } from 'lucide-react'

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

  // Resource Allocation and HC Justification moved to Resources section

  // Sync with formData
  useEffect(() => {
    setFormData({
      ...formData,
      initiatives
    })
  }, [initiatives])

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
  }

  const updateInitiative = (id: string, field: keyof Initiative, value: any) => {
    setInitiatives(initiatives.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

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
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="initiatives">
            <Target className="h-4 w-4 mr-2" />
            Initiative Details
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INITIATIVE DETAILS */}
        <TabsContent value="initiatives" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Strategic Initiatives
              </CardTitle>
              <CardDescription>
                Define key initiatives for FY2027 with AI integration plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {initiatives.map((initiative, index) => (
                <Card key={initiative.id} className="border-purple-200 dark:border-purple-800">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Initiative #{index + 1}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={initiative.priority === 'high' ? 'destructive' : initiative.priority === 'medium' ? 'default' : 'secondary'}>
                          {initiative.priority} priority
                        </Badge>
                        {initiative.isBaseline && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Baseline
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInitiative(initiative.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Initiative Name */}
                      <div className="space-y-2">
                        <Label>Initiative Name *</Label>
                        <Input
                          placeholder="e.g., AI-Powered Customer Analytics Platform"
                          value={initiative.name}
                          onChange={(e) => updateInitiative(initiative.id, 'name', e.target.value)}
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>

                      {/* Owner */}
                      <div className="space-y-2">
                        <Label>Owner *</Label>
                        <Input
                          placeholder="e.g., John Smith, Data Engineering Team"
                          value={initiative.owner}
                          onChange={(e) => updateInitiative(initiative.id, 'owner', e.target.value)}
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label>Description *</Label>
                      <Textarea
                        placeholder="Describe the initiative, its objectives, and expected outcomes..."
                        rows={3}
                        value={initiative.description}
                        onChange={(e) => updateInitiative(initiative.id, 'description', e.target.value)}
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Start Date */}
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={initiative.startDate}
                          onChange={(e) => updateInitiative(initiative.id, 'startDate', e.target.value)}
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>

                      {/* End Date */}
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={initiative.endDate}
                          onChange={(e) => updateInitiative(initiative.id, 'endDate', e.target.value)}
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>

                      {/* Priority */}
                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select value={initiative.priority} onValueChange={(value) => updateInitiative(initiative.id, 'priority', value)}>
                          <SelectTrigger className="border-purple-200 focus:border-purple-500">
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

                    {/* FY27 AI Integration Fields */}
                    <div className="border-t pt-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        <Label className="text-purple-700 dark:text-purple-300 font-medium">AI Integration Plan (FY27)</Label>
                      </div>

                      {/* AI Integration Plan */}
                      <div className="space-y-2">
                        <Label>AI Integration Plan</Label>
                        <p className="text-xs text-muted-foreground">
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
      </Tabs>
    </div>
  )
}