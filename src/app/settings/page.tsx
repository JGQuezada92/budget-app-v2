'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Settings as SettingsIcon, 
  Save,
  RotateCcw,
  Brain,
  MessageSquare,
  Eye,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Send
} from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'

interface Message {
  role: 'user' | 'assistant'
  content: string
  framework?: any
}

export default function SettingsPage() {
  const [framework, setFramework] = useState<any>(null)
  const [frameworkSummary, setFrameworkSummary] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  // Chat interface state
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Preview state
  const [previewPrompt, setPreviewPrompt] = useState('')
  const [previewLoading, setPreviewLoading] = useState(false)

  useEffect(() => {
    loadFramework()
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const loadFramework = async () => {
    try {
      const response = await fetch('/api/framework-chat')
      if (response.ok) {
        const data = await response.json()
        setFramework(data.framework)
        setFrameworkSummary(data.summary)
        
        // Initialize chat with framework summary
        setChatMessages([{
          role: 'assistant',
          content: `Hello! I'm here to help you customize your AI analyst framework. Here's what's currently configured:\n\n${data.summary}\n\nYou can ask me to:\n- Change analysis dimension weights\n- Add or remove focus areas\n- Modify evaluation criteria\n- Adjust analysis principles\n- Update department guidelines\n\nWhat would you like to modify?`
        }])
      }
    } catch (error) {
      console.error('Error loading framework:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!framework) return
    
    try {
      setSaving(true)
      const response = await fetch('/api/framework-chat', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ framework })
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        // Reload to get updated summary
        await loadFramework()
      } else {
        alert('Failed to save framework')
      }
    } catch (error) {
      console.error('Error saving framework:', error)
      alert('Error saving framework')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!confirm('Reset to default framework? This will undo all your customizations.')) {
      return
    }

    try {
      localStorage.removeItem('aiAnalysisFramework')
      await loadFramework()
      setChatMessages([{
        role: 'assistant',
        content: 'Framework has been reset to defaults. All customizations have been removed.'
      }])
    } catch (error) {
      console.error('Error resetting framework:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!userInput.trim() || chatLoading) return

    const newUserMessage: Message = {
      role: 'user',
      content: userInput
    }

    setChatMessages(prev => [...prev, newUserMessage])
    setUserInput('')
    setChatLoading(true)

    try {
      const response = await fetch('/api/framework-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: userInput })
      })

      if (response.ok) {
        const data = await response.json()
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message,
          framework: data.updatedFramework
        }

        setChatMessages(prev => [...prev, assistantMessage])

        // If framework was updated, show option to apply it
        if (data.updatedFramework) {
          // Auto-preview the changes but don't apply yet
        }
      } else {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I encountered an error processing your request.'
        }])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error connecting to the AI.'
      }])
    } finally {
      setChatLoading(false)
    }
  }

  const applyFrameworkUpdate = (updatedFramework: any) => {
    setFramework(updatedFramework)
    setChatMessages(prev => [...prev, {
      role: 'assistant',
      content: '✅ Framework updated! Don\'t forget to click "Save Changes" to persist these modifications.'
    }])
  }

  const handlePreviewPrompt = async () => {
    setPreviewLoading(true)
    try {
      // For preview, we'll use a sample request
      const sampleRequest = {
        departmentName: 'Finance',
        fiscalYear: '2027',
        historicalData: [],
        budgetData: [],
        aopFormData: {
          businessMetrics: [{ name: 'Revenue Growth', fy2027Plan: '15%' }],
          aiPerformanceMetrics: [{ name: 'AI Adoption Rate', fy2027Target: '75%' }],
          initiatives: [{ name: 'AI-Powered Financial Forecasting' }]
        }
      }

      const response = await fetch('/api/preview-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleRequest)
      })

      if (response.ok) {
        const data = await response.json()
        setPreviewPrompt(data.prompt)
      } else {
        alert('Failed to generate preview')
      }
    } catch (error) {
      console.error('Preview error:', error)
      alert('Error generating preview')
    } finally {
      setPreviewLoading(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading framework...</p>
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
                <h1 className="text-2xl font-normal text-gray-900">AI Framework Configuration</h1>
                <p className="text-sm text-gray-600 mt-1">
                  View and customize the AI analyst's analysis framework
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="border-gray-300"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {saving ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="h-4 w-4 mr-2" /> Save Changes</>
                  )}
                </Button>
              </div>
            </div>
            
            {saved && (
              <Alert className="mt-4 bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-900">Framework Saved</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your framework changes have been saved and will apply to all future analyses.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-8 py-8">
          <Tabs defaultValue="current" className="space-y-6">
            <TabsList className="bg-gray-100 p-1">
              <TabsTrigger value="current" className="gap-2">
                <Brain className="h-4 w-4" />
                Current Framework
              </TabsTrigger>
              <TabsTrigger value="chat" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Modify with Chat
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="h-4 w-4" />
                Preview Prompt
              </TabsTrigger>
            </TabsList>

            {/* Current Framework Tab */}
            <TabsContent value="current" className="space-y-6">
              <Card className="border border-gray-200">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg font-normal">Active Framework Configuration</CardTitle>
                  <CardDescription>
                    This is the actual framework Claude uses to analyze budget submissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="prose prose-sm max-w-none">
                    <pre className="bg-gray-50 p-4 rounded border border-gray-200 overflow-auto text-xs whitespace-pre-wrap">
                      {frameworkSummary}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {framework && (
                <Card className="border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-lg font-normal">Raw Configuration (JSON)</CardTitle>
                    <CardDescription>
                      Advanced view of the framework data structure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <pre className="bg-gray-50 p-4 rounded border border-gray-200 overflow-auto text-xs">
                      {JSON.stringify(framework, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Chat Interface Tab */}
            <TabsContent value="chat" className="space-y-6">
              <Card className="border border-gray-200">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg font-normal">AI Framework Editor</CardTitle>
                  <CardDescription>
                    Chat with AI to modify your analysis framework. Describe what you want to change in plain English.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Chat messages */}
                  <div className="space-y-4 mb-4 max-h-[500px] overflow-y-auto">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          msg.role === 'user' 
                            ? 'bg-teal-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          
                          {msg.framework && (
                            <div className="mt-3 pt-3 border-t border-gray-300">
                              <Button
                                size="sm"
                                onClick={() => applyFrameworkUpdate(msg.framework)}
                                className="bg-teal-600 hover:bg-teal-700 text-white"
                              >
                                Apply This Update
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg px-4 py-3">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder="E.g., 'Increase the weight of qualitative analysis to 50%' or 'Add a focus area for cost optimization'"
                      className="flex-1 border-gray-300"
                      disabled={chatLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={chatLoading || !userInput.trim()}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Alert className="border-gray-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>How to Use</AlertTitle>
                <AlertDescription className="text-sm">
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Ask to change dimension weights (e.g., "Make quantitative analysis more important")</li>
                    <li>Request new focus areas (e.g., "Add evaluation criteria for cost efficiency")</li>
                    <li>Modify principles (e.g., "Add a principle about sustainability considerations")</li>
                    <li>Update department guidelines (e.g., "Add marketing automation metrics")</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-6">
              <Card className="border border-gray-200">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg font-normal">Prompt Preview</CardTitle>
                  <CardDescription>
                    See the exact prompt Claude will receive when analyzing a submission
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Button
                      onClick={handlePreviewPrompt}
                      disabled={previewLoading}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      {previewLoading ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                      ) : (
                        <><Eye className="h-4 w-4 mr-2" /> Generate Preview</>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Uses a sample Finance department submission to show how the framework is applied
                    </p>
                  </div>

                  {previewPrompt && (
                    <div className="mt-4">
                      <Textarea
                        value={previewPrompt}
                        readOnly
                        className="min-h-[600px] font-mono text-xs border-gray-300"
                      />
                      <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                        <span>Prompt Length: {previewPrompt.length.toLocaleString()} characters</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigator.clipboard.writeText(previewPrompt)}
                          className="border-gray-300"
                        >
                          Copy to Clipboard
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AppLayout>
  )
}
