'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArrowLeft, ArrowRight, Save, Send, AlertCircle, CheckCircle, Info, Eye, Copy } from 'lucide-react'
import Link from 'next/link'

// Import section components
import IntroductionSection from '@/components/submission/IntroductionSection'
import MetricsSection from '@/components/submission/MetricsSection'
import PriorYearSection from '@/components/submission/PriorYearSection'
import InitiativesSection from '@/components/submission/InitiativesSection'
import ResourcesSection from '@/components/submission/ResourcesSection'
import FileUploadsSection from '@/components/submission/FileUploadsSection'
import AppendixFAQSection from '@/components/submission/AppendixFAQSection'
import { RoleSwitcher } from '@/components/RoleSwitcher'
import { AppLayout } from '@/components/layout/AppLayout'

// Import validation functions
import { validateCompleteSubmission, validateSection, type ValidationResult } from '@/lib/form-validation'
import { getUserDepartment, isAdmin } from '@/lib/auth-utils'

export default function SubmissionPage() {
  const [activeTab, setActiveTab] = useState('introduction')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingSubmissionId, setEditingSubmissionId] = useState<string | null>(null)
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({})
  const [showValidationSummary, setShowValidationSummary] = useState(false)
  const [previewPrompt, setPreviewPrompt] = useState<string | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [formData, setFormData] = useState({
    // Section 1: Introduction
    departmentName: '',
    fiscalYear: '2027',
    teamDescription: '',
    responsibilities: '',
    teamTenets: '',
    departmentHead: '',
    aiStrategyOverview: '', // NEW FY27
    
    // Section 2: Metrics
    businessMetrics: [], // NEW FY27 - replaces old metrics structure
    aiPerformanceMetrics: [], // NEW FY27
    
    // Section 3: Prior Year Review
    metricsCommentary: '', // NEW FY27
    priorYearOutcomes: '',
    priorYearLearnings: '',
    industryTrends: '',
    performanceAnalysis: '', // NEW FY27
    // AI Retrospective (NEW FY27)
    aiToolsPiloted: '',
    aiKeyWins: '',
    aiMissesChallenges: '',
    aiMeasurableImpacts: '',
    
    // Section 4: Initiatives (enhanced with AI fields)
    initiatives: [],
    resourceAllocation: {
      baseline: [],
      incremental: []
    },
    hcJustification: {
      hcIncreasesJustification: '',
      hcReductionsExplanation: ''
    },
    
    // Section 5: AI-Enabled Workforce Planning (NEW FY27)
    aiEnabledWorkforce: {
      tasksAugmentedByAI: '',
      expectedProductivityImprovement: '',
      skillsDevelopmentNeeded: '',
      hcIncreasesJustificationResources: '',
      workforceTable: [],
      nonHeadcountCosts: [],
      aiCostBenefitAnalysis: []
    },
    
    // Section 6: File Uploads
    historicalData: [],
    budgetData: [],
    supportingDocuments: [],
    
    // Section 7: Appendix FAQs (NEW FY27)
    appendixFAQs: []
  })

  // Check for edit mode on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const isEdit = urlParams.get('edit') === 'true'
    
    if (isEdit) {
      const editingSubmission = localStorage.getItem('editingSubmission')
      if (editingSubmission) {
        const submission = JSON.parse(editingSubmission)
        setIsEditMode(true)
        setEditingSubmissionId(submission.id)
        setFormData(submission.formData)
        console.log('Loading submission for edit:', submission)
      }
    } else {
      // Pre-fill department for new submissions (user role only)
      if (!isAdmin()) {
        const userDept = getUserDepartment()
        setFormData(prev => ({
          ...prev,
          departmentName: userDept
        }))
      }
    }
  }, [])

  // Validate sections when formData changes
  useEffect(() => {
    const sections = ['introduction', 'metrics', 'prior-year', 'initiatives', 'resources', 'uploads', 'appendix']
    const newValidationResults: Record<string, ValidationResult> = {}
    
    sections.forEach(section => {
      newValidationResults[section] = validateSection(section, formData)
    })
    
    setValidationResults(newValidationResults)
  }, [formData])

  const handleSaveDraft = async () => {
    if (isSaving) return
    
    try {
      setIsSaving(true)
      console.log('Saving draft...', formData)
      // TODO: Save to database as draft
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      alert('Draft saved successfully!')
    } catch (error) {
      console.error('Error saving draft:', error)
      alert('Error saving draft. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreviewPrompt = async () => {
    setIsLoadingPreview(true)
    try {
      const response = await fetch('/api/preview-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          departmentName: formData.departmentName,
          fiscalYear: formData.fiscalYear,
          historicalData: formData.historicalData,
          budgetData: formData.budgetData,
          aopFormData: formData,
          supportingDocs: formData.supportingDocuments
        })
      })

      if (response.ok) {
        const data = await response.json()
        setPreviewPrompt(data.prompt)
        setShowPreviewDialog(true)
      } else {
        alert('Failed to generate prompt preview')
      }
    } catch (error) {
      console.error('Error previewing prompt:', error)
      alert('Error generating prompt preview')
    } finally {
      setIsLoadingPreview(false)
    }
  }

  const handleCopyPrompt = () => {
    if (previewPrompt) {
      navigator.clipboard.writeText(previewPrompt)
      alert('Prompt copied to clipboard!')
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    
    try {
      setIsSubmitting(true)
      console.log('Submitting...', formData)
      
      // FY27 Comprehensive Validation using validation library
      const validationResult = validateCompleteSubmission(formData)
      
      // Check validation results
      const hasErrors = !validationResult.isValid
      const hasWarnings = validationResult.warnings.length > 0
      
      // Show validation summary if there are issues
      if (hasErrors || hasWarnings) {
        setShowValidationSummary(true)
        
        // ONLY block submission if there are ERRORS
        if (hasErrors) {
          setIsSubmitting(false)
          window.scrollTo({ top: 0, behavior: 'smooth' })
          return  // Exit - don't submit
        }
        
        // If only warnings (no errors), scroll to top but CONTINUE
        window.scrollTo({ top: 0, behavior: 'smooth' })
        // DON'T return - fall through to submission code below
      }

      // Trigger AI analysis - Always run if basic info is present
      console.log('Triggering AI analysis...')
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            departmentName: formData.departmentName,
            fiscalYear: formData.fiscalYear,
            historicalData: formData.historicalData || [],
            budgetData: formData.budgetData || [],
            aopFormData: formData,
            supportingDocs: formData.supportingDocuments || []
          })
        })

        if (response.ok) {
          const analysis = await response.json()
          console.log('✅ AI Analysis completed:', analysis)
          // Store analysis results and request data for dashboard display
          localStorage.setItem('latestAnalysis', JSON.stringify({
            result: analysis,
            request: {
              departmentName: formData.departmentName,
              fiscalYear: formData.fiscalYear,
              historicalData: formData.historicalData || [],
              budgetData: formData.budgetData || [],
              aopFormData: formData
            }
          }))
          console.log('✅ Analysis saved to localStorage')
        } else {
          const errorText = await response.text()
          console.error('❌ AI analysis failed:', response.status, errorText)
          alert('AI analysis failed. Submission saved but no insights generated.')
        }
      } catch (aiError) {
        console.error('❌ AI analysis error:', aiError)
        alert('AI analysis error: ' + aiError.message + '. Submission saved but no insights generated.')
        // Continue with submission even if AI fails
      }

      // Save submission to localStorage (in production, this would be to Supabase)
      const submissionData = {
        id: isEditMode ? editingSubmissionId : Date.now().toString(),
        departmentName: formData.departmentName,
        fiscalYear: formData.fiscalYear,
        status: 'submitted',
        submittedAt: isEditMode ? 
          JSON.parse(localStorage.getItem('userSubmissions') || '[]')
            .find((s: any) => s.id === editingSubmissionId)?.submittedAt || new Date().toISOString()
          : new Date().toISOString(),
        totalBudget: formData.budgetData.length > 0 ? 
          formData.budgetData.reduce((sum: number, item: any) => sum + (parseFloat(item.amount) || 0), 0) : 0,
        formData: formData
      }

      // Get existing submissions and update or add
      const existingSubmissions = JSON.parse(localStorage.getItem('userSubmissions') || '[]')
      let updatedSubmissions
      
      if (isEditMode) {
        // Update existing submission
        updatedSubmissions = existingSubmissions.map((s: any) => 
          s.id === editingSubmissionId ? submissionData : s
        )
      } else {
        // Add new submission
        updatedSubmissions = [...existingSubmissions, submissionData]
      }
      
      localStorage.setItem('userSubmissions', JSON.stringify(updatedSubmissions))
      
      // Clear edit mode data
      if (isEditMode) {
        localStorage.removeItem('editingSubmission')
      }
      
      console.log('Submission saved:', submissionData)
      
      alert('Submission successful! Your budget request has been submitted for review.')
      
      // Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Error submitting:', error)
      alert('Error submitting form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-normal text-gray-900" style={{ fontFamily: 'Arial, sans-serif' }}>
                Annual Operating Plan
              </h1>
              <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                FY {formData.fiscalYear} Budget Submission
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 px-3 py-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                Draft
              </Badge>
              <Button 
                onClick={handleSaveDraft} 
                variant="outline"
                disabled={isSaving || isSubmitting}
                className="border-gray-300"
                style={{ fontFamily: 'Arial, sans-serif' }}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
                </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Clean Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-8 py-4">
            <button
              onClick={() => setActiveTab('introduction')}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                activeTab === 'introduction' ? 'border-orange-500' : 'border-transparent'
              }`}
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              <span className={`w-2 h-2 rounded-full ${activeTab === 'introduction' ? 'bg-orange-500' : 'bg-gray-300'}`} />
              <span className={`text-sm ${activeTab === 'introduction' ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                Introduction
              </span>
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                activeTab === 'metrics' ? 'border-red-500' : 'border-transparent'
              }`}
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              <span className={`w-2 h-2 rounded-full ${activeTab === 'metrics' ? 'bg-red-500' : 'bg-gray-300'}`} />
              <span className={`text-sm ${activeTab === 'metrics' ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                Metrics
              </span>
            </button>
            <button
              onClick={() => setActiveTab('prior-year')}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                activeTab === 'prior-year' ? 'border-green-500' : 'border-transparent'
              }`}
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              <span className={`w-2 h-2 rounded-full ${activeTab === 'prior-year' ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className={`text-sm ${activeTab === 'prior-year' ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                Prior Year
              </span>
            </button>
            <button
              onClick={() => setActiveTab('initiatives')}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                activeTab === 'initiatives' ? 'border-orange-500' : 'border-transparent'
              }`}
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              <span className={`w-2 h-2 rounded-full ${activeTab === 'initiatives' ? 'bg-orange-500' : 'bg-gray-300'}`} />
              <span className={`text-sm ${activeTab === 'initiatives' ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                Initiatives
              </span>
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                activeTab === 'resources' ? 'border-red-500' : 'border-transparent'
              }`}
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              <span className={`w-2 h-2 rounded-full ${activeTab === 'resources' ? 'bg-red-500' : 'bg-gray-300'}`} />
              <span className={`text-sm ${activeTab === 'resources' ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                Resources
              </span>
            </button>
            <button
              onClick={() => setActiveTab('uploads')}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                activeTab === 'uploads' ? 'border-green-500' : 'border-transparent'
              }`}
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              <span className={`w-2 h-2 rounded-full ${activeTab === 'uploads' ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className={`text-sm ${activeTab === 'uploads' ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                Files
              </span>
            </button>
            <button
              onClick={() => setActiveTab('appendix')}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                activeTab === 'appendix' ? 'border-orange-500' : 'border-transparent'
              }`}
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              <span className={`w-2 h-2 rounded-full ${activeTab === 'appendix' ? 'bg-orange-500' : 'bg-gray-300'}`} />
              <span className={`text-sm ${activeTab === 'appendix' ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                FAQs
              </span>
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="flex items-center gap-2 pb-2 border-b-2 border-transparent ml-auto"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              <span className="text-sm text-gray-600">Actions</span>
            </button>
                    </div>
                  </div>
                </div>

      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8" style={{ fontFamily: 'Arial, sans-serif' }}>

          {/* Validation Summary - Only show when there are actual errors on submit */}
            {showValidationSummary && (() => {
              const validationResult = validateCompleteSubmission(formData)
            return validationResult.errors.length > 0 ? (
              <Alert variant="destructive" className="mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
                  <AlertCircle className="h-4 w-4" />
                <AlertTitle style={{ fontFamily: 'Arial, sans-serif' }}>Please correct the following errors:</AlertTitle>
                <AlertDescription style={{ fontFamily: 'Arial, sans-serif' }}>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                          {validationResult.errors.map((error, idx) => (
                            <li key={idx} className="text-sm">{error}</li>
                          ))}
                        </ul>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setShowValidationSummary(false)}
                    className="mt-4"
                    style={{ fontFamily: 'Arial, sans-serif' }}
                      >
                        Dismiss
                      </Button>
                  </AlertDescription>
                </Alert>
            ) : null
            })()}

          {/* Tab Content */}
          {activeTab === 'introduction' && (
                <IntroductionSection formData={formData} setFormData={setFormData} />
          )}
          {activeTab === 'metrics' && (
                <MetricsSection formData={formData} setFormData={setFormData} />
          )}
          {activeTab === 'prior-year' && (
                <PriorYearSection formData={formData} setFormData={setFormData} />
          )}
          {activeTab === 'initiatives' && (
                <InitiativesSection formData={formData} setFormData={setFormData} />
          )}
          {activeTab === 'resources' && (
                <ResourcesSection formData={formData} setFormData={setFormData} />
          )}
          {activeTab === 'uploads' && (
                <FileUploadsSection formData={formData} setFormData={setFormData} />
          )}
          {activeTab === 'appendix' && (
                <AppendixFAQSection formData={formData} setFormData={setFormData} />
          )}

            {/* Action Buttons */}
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                <Button 
              onClick={() => {
                const tabs = ['introduction', 'metrics', 'prior-year', 'initiatives', 'resources', 'uploads', 'appendix']
                const currentIndex = tabs.indexOf(activeTab)
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1])
                } else {
                  handleSubmit()
                }
              }}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6"
              disabled={isSubmitting || isSaving}
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              {activeTab === 'appendix' ? (
                isSubmitting ? 'Submitting...' : 'Submit for Review'
              ) : (
                <>
                  Continue to {activeTab === 'introduction' ? 'Metrics' : 
                              activeTab === 'metrics' ? 'Prior Year' : 
                              activeTab === 'prior-year' ? 'Initiatives' : 
                              activeTab === 'initiatives' ? 'Resources' : 
                              activeTab === 'resources' ? 'Files' : 
                              activeTab === 'uploads' ? 'FAQs' : 'Review'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
              </Button>
            </div>
        </div>
      </main>
    </div>
    </AppLayout>
  )
}

// Keep Preview Dialog outside but not shown by default
function PreviewPromptDialog({ open, onOpenChange, previewPrompt, onCopy, formData }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col" style={{ fontFamily: 'Arial, sans-serif' }}>
                <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                    <Eye className="h-5 w-5 text-purple-600" />
                    AI Analysis Prompt Preview
                  </DialogTitle>
          <DialogDescription style={{ fontFamily: 'Arial, sans-serif' }}>
                    Review the exact prompt being sent to Claude API
                  </DialogDescription>
                </DialogHeader>
        
        <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-gray-50" style={{ fontFamily: 'Arial, sans-serif' }}>
          {previewPrompt && (
            <pre className="text-xs whitespace-pre-wrap leading-relaxed" style={{ fontFamily: 'Arial, sans-serif' }}>
              {previewPrompt}
            </pre>
          )}
        </div>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button 
            onClick={onCopy}
            variant="outline"
            size="sm"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy to Clipboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

