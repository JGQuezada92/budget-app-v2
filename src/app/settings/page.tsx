'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Settings as SettingsIcon, 
  Save,
  RotateCcw,
  Brain,
  FileText,
  Shield,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'

interface AISettings {
  systemPrompt: string
  analysisFramework: string
  riskThresholds: {
    high: number
    medium: number
    low: number
  }
  focusAreas: string[]
  temperature: number
  maxTokens: number
}

const defaultSettings: AISettings = {
  systemPrompt: `You are an expert Financial Planning & Analysis (FP&A) analyst reviewing budget submissions. Your role is to provide constructive, actionable insights that help departments improve their financial planning.

Analyze submissions with a focus on:
- Budget reasonableness and alignment with historical trends
- Risk identification and mitigation strategies
- Growth opportunities and cost optimization
- Compliance with organizational policies
- Data quality and completeness`,
  
  analysisFramework: `# Analysis Framework

## 1. Executive Summary
Provide a high-level overview of the submission quality and key findings.

## 2. Risk Assessment
Identify potential risks with severity ratings:
- **High**: Issues requiring immediate attention
- **Medium**: Areas of concern that need monitoring
- **Low**: Minor observations

## 3. Opportunity Analysis
Highlight opportunities for:
- Cost optimization
- Revenue enhancement
- Process improvements
- Strategic initiatives

## 4. Recommendations
Provide specific, actionable recommendations prioritized by:
- Priority level (High/Medium/Low)
- Implementation complexity
- Expected impact`,

  riskThresholds: {
    high: 75,
    medium: 50,
    low: 25
  },
  
  focusAreas: [
    'Budget vs Actual Analysis',
    'Headcount Planning',
    'Capital Expenditures',
    'Operating Expenses',
    'Revenue Projections',
    'Risk Management'
  ],
  
  temperature: 0.7,
  maxTokens: 4000
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AISettings>(defaultSettings)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    try {
      const storedSettings = localStorage.getItem('aiAnalystSettings')
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    try {
      localStorage.setItem('aiAnalystSettings', JSON.stringify(settings))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      setSettings(defaultSettings)
      localStorage.removeItem('aiAnalystSettings')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const updateFocusArea = (index: number, value: string) => {
    const newFocusAreas = [...settings.focusAreas]
    newFocusAreas[index] = value
    setSettings({ ...settings, focusAreas: newFocusAreas })
  }

  const addFocusArea = () => {
    setSettings({ ...settings, focusAreas: [...settings.focusAreas, ''] })
  }

  const removeFocusArea = (index: number) => {
    const newFocusAreas = settings.focusAreas.filter((_, i) => i !== index)
    setSettings({ ...settings, focusAreas: newFocusAreas })
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg">
                  <SettingsIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">AI Analyst Settings</h1>
                  <p className="text-gray-600">Configure the AI analyst framework and analysis parameters</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset to Defaults
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
            
            {saved && (
              <Alert className="mt-4 bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-900">Settings Saved</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your AI analyst settings have been saved successfully. Changes will apply to future analyses.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading settings...</p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="framework" className="space-y-6">
              <TabsList className="bg-white/80 backdrop-blur p-1">
                <TabsTrigger value="framework" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Analysis Framework
                </TabsTrigger>
                <TabsTrigger value="prompts" className="gap-2">
                  <Brain className="h-4 w-4" />
                  System Prompts
                </TabsTrigger>
                <TabsTrigger value="parameters" className="gap-2">
                  <SettingsIcon className="h-4 w-4" />
                  Parameters
                </TabsTrigger>
              </TabsList>

              {/* Analysis Framework Tab */}
              <TabsContent value="framework" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Analysis Framework
                    </CardTitle>
                    <CardDescription>
                      Define the structure and methodology the AI analyst uses to evaluate budget submissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="framework">Framework Template</Label>
                      <Textarea
                        id="framework"
                        value={settings.analysisFramework}
                        onChange={(e) => setSettings({ ...settings, analysisFramework: e.target.value })}
                        className="mt-2 min-h-[400px] font-mono text-sm"
                        placeholder="Enter the analysis framework..."
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Use Markdown formatting to structure the analysis framework
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Focus Areas</CardTitle>
                    <CardDescription>
                      Key areas the AI analyst should prioritize during analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {settings.focusAreas.map((area, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={area}
                          onChange={(e) => updateFocusArea(index, e.target.value)}
                          placeholder="Focus area..."
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeFocusArea(index)}
                          disabled={settings.focusAreas.length <= 1}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addFocusArea} className="w-full">
                      + Add Focus Area
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* System Prompts Tab */}
              <TabsContent value="prompts" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      System Prompt
                    </CardTitle>
                    <CardDescription>
                      Define the AI analyst's role, expertise, and approach to analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="systemPrompt">System Prompt</Label>
                      <Textarea
                        id="systemPrompt"
                        value={settings.systemPrompt}
                        onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
                        className="mt-2 min-h-[300px] font-mono text-sm"
                        placeholder="Enter the system prompt..."
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        This prompt defines the AI's persona and analytical approach
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Best Practices</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                      <li>Be specific about the AI's expertise and role</li>
                      <li>Include guidelines for tone and communication style</li>
                      <li>Define key priorities and focus areas</li>
                      <li>Specify any constraints or requirements</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </TabsContent>

              {/* Parameters Tab */}
              <TabsContent value="parameters" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-orange-600" />
                      Risk Thresholds
                    </CardTitle>
                    <CardDescription>
                      Configure severity thresholds for risk classification (0-100)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="highRisk">High Risk Threshold</Label>
                        <Input
                          id="highRisk"
                          type="number"
                          min="0"
                          max="100"
                          value={settings.riskThresholds.high}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              riskThresholds: { ...settings.riskThresholds, high: Number(e.target.value) }
                            })
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="mediumRisk">Medium Risk Threshold</Label>
                        <Input
                          id="mediumRisk"
                          type="number"
                          min="0"
                          max="100"
                          value={settings.riskThresholds.medium}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              riskThresholds: { ...settings.riskThresholds, medium: Number(e.target.value) }
                            })
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lowRisk">Low Risk Threshold</Label>
                        <Input
                          id="lowRisk"
                          type="number"
                          min="0"
                          max="100"
                          value={settings.riskThresholds.low}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              riskThresholds: { ...settings.riskThresholds, low: Number(e.target.value) }
                            })
                          }
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle>AI Model Parameters</CardTitle>
                    <CardDescription>
                      Configure Claude AI model behavior for analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="temperature">
                        Temperature: {settings.temperature}
                      </Label>
                      <Input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.temperature}
                        onChange={(e) => setSettings({ ...settings, temperature: Number(e.target.value) })}
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Lower values = more focused and deterministic, Higher values = more creative
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="maxTokens">Max Tokens: {settings.maxTokens}</Label>
                      <Input
                        id="maxTokens"
                        type="range"
                        min="1000"
                        max="8000"
                        step="500"
                        value={settings.maxTokens}
                        onChange={(e) => setSettings({ ...settings, maxTokens: Number(e.target.value) })}
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum length of AI response (longer = more detailed but slower)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

