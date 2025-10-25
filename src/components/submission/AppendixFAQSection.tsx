'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ChevronDown, ChevronUp, Maximize2, Minimize2, FileText, Info, AlertCircle, CheckCircle2, Brain } from 'lucide-react'

interface AppendixFAQSectionProps {
  formData: any
  setFormData: (data: any) => void
}

interface FAQItem {
  questionKey: string
  question: string
  answer: string
  required: boolean
  isAIFocused?: boolean
}

const FAQ_QUESTIONS: Omit<FAQItem, 'answer'>[] = [
  {
    questionKey: 'most_important_decisions',
    question: 'What are the most important decisions that we need in this meeting?',
    required: false
  },
  {
    questionKey: 'biggest_needle_mover',
    question: 'What is the single biggest thing we can do to move the needle in this business and how will we organize to do just that?',
    required: false
  },
  {
    questionKey: 'disruptive_ideas',
    question: 'What are your disruptive ideas? (New/bold/risky product ideas or initiatives that are likely to fail but if they were to succeed, would result in a step-change in revenue/customer growth, cost reduction, or enable you to build a moat/relative advantage vs your competitors.)',
    required: false
  },
  {
    questionKey: 'initiatives_not_included',
    question: 'What new initiatives and/or product ideas did you investigate that you chose not to include in the plan, and why didn\'t they make the cut?',
    required: false
  },
  {
    questionKey: 'surprises_fy26',
    question: 'What were the positive and negative surprises in FY26? What are the specific measures you put in place (initiatives, processes, or structural changes) to address these surprises?',
    required: false
  },
  {
    questionKey: 'top_misses_learnings',
    question: 'What are your top misses and learnings? What are you most disappointed about with your division/product/business in FY26?',
    required: false
  },
  {
    questionKey: 'single_threaded_leaders',
    question: 'Are there any programs or initiatives in your business that don\'t have a single-threaded leader?',
    required: false
  },
  {
    questionKey: 'partner_dependency',
    question: 'Do any customers, business partners, or suppliers represent greater than 20% of your business? If so, what are you doing to reduce your dependency on these partners?',
    required: false
  },
  {
    questionKey: 'dependencies_wish_controlled',
    question: 'What dependencies do you have in your business today that you wish you controlled?',
    required: false
  },
  {
    questionKey: 'dogs_not_barking',
    question: 'What \'dogs not barking\' do you worry about? (In other words, what are potential blind spots for you where you don\'t have reliable data/information about your competitors/customers/the industry that could have a big impact on your business.)',
    required: false
  },
  {
    questionKey: 'competitors_using_ai',
    question: 'How are competitors using AI and where might we be falling behind?',
    required: false,
    isAIFocused: true
  },
  {
    questionKey: 'more_ai_budget_scenario',
    question: 'What would you do differently if you had 50% more AI tool budget but no additional HC?',
    required: false,
    isAIFocused: true
  }
]

const PLACEHOLDERS: Record<string, string> = {
  most_important_decisions: 'List key decisions needed from leadership (e.g., budget approvals, strategic direction, resource allocation priorities)...',
  biggest_needle_mover: 'Describe the single highest-impact initiative and how you\'ll organize the team to execute it successfully...',
  disruptive_ideas: 'Share bold, innovative ideas that could transform the business if successful, even if they carry significant risk...',
  initiatives_not_included: 'Explain initiatives you considered but didn\'t include in the plan and the reasoning behind those decisions...',
  surprises_fy26: 'Describe unexpected positive and negative events in FY26 and the concrete actions taken to address them...',
  top_misses_learnings: 'Be candid about the biggest disappointments and key lessons learned from FY26...',
  single_threaded_leaders: 'Identify any programs lacking clear ownership and plans to address this...',
  partner_dependency: 'Describe any high-dependency relationships (>20%) and mitigation strategies...',
  dependencies_wish_controlled: 'List critical dependencies outside your control and why they concern you...',
  dogs_not_barking: 'Identify potential blind spots where lack of information could impact your business...',
  competitors_using_ai: 'Analyze competitor AI strategies and areas where we may be lagging. Include specific examples and potential risks...',
  more_ai_budget_scenario: 'Describe how you would deploy 50% more AI investment to maximize impact without adding headcount. Be specific about tools, use cases, and expected ROI...'
}

export default function AppendixFAQSection({ formData, setFormData }: AppendixFAQSectionProps) {
  const [faqAnswers, setFaqAnswers] = useState<FAQItem[]>(
    FAQ_QUESTIONS.map(q => ({
      ...q,
      answer: ''
    }))
  )

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['most_important_decisions']))
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Calculate completion stats
  const totalQuestions = FAQ_QUESTIONS.length
  const requiredQuestions = FAQ_QUESTIONS.filter(q => q.required).length
  const answeredCount = faqAnswers.filter(q => q.answer.trim().length > 0).length
  const requiredAnsweredCount = faqAnswers.filter(q => q.required && q.answer.trim().length > 0).length
  const completionPercentage = (answeredCount / totalQuestions) * 100
  const requiredComplete = requiredAnsweredCount === requiredQuestions

  // Sync with formData
  useEffect(() => {
    setFormData({
      ...formData,
      appendixFAQs: faqAnswers
    })
    setHasUnsavedChanges(false)
  }, [faqAnswers])

  const updateAnswer = (questionKey: string, answer: string) => {
    setHasUnsavedChanges(true)
    setFaqAnswers(faqAnswers.map(faq => 
      faq.questionKey === questionKey ? { ...faq, answer } : faq
    ))
  }

  const toggleExpanded = (questionKey: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(questionKey)) {
      newExpanded.delete(questionKey)
    } else {
      newExpanded.add(questionKey)
    }
    setExpandedItems(newExpanded)
  }

  const expandAll = () => {
    setExpandedItems(new Set(FAQ_QUESTIONS.map(q => q.questionKey)))
  }

  const collapseAll = () => {
    setExpandedItems(new Set())
  }

  return (
    <div className="space-y-6">
      {/* Header Card with Stats */}
      <Card className="border-blue-200 dark:border-blue-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Appendix: Strategic FAQs
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                  OPTIONAL
                </Badge>
              </CardTitle>
              <CardDescription>
                These strategic questions are optional but recommended to provide valuable context for your AOP submission
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={expandAll} variant="outline" size="sm">
                <Maximize2 className="h-4 w-4 mr-2" />
                Expand All
              </Button>
              <Button onClick={collapseAll} variant="outline" size="sm">
                <Minimize2 className="h-4 w-4 mr-2" />
                Collapse All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Completion Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {answeredCount}/{totalQuestions}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Questions Answered (Optional)</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {completionPercentage.toFixed(0)}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Completion</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Optional Info Alert */}
          <Alert className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              All questions are optional. Answer those that are relevant to your department to provide valuable strategic context.
            </AlertDescription>
          </Alert>

          {hasUnsavedChanges && (
            <Alert className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Changes are being auto-saved...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* FAQ Questions */}
      <div className="space-y-4">
        {faqAnswers.map((faq, index) => {
          const isExpanded = expandedItems.has(faq.questionKey)
          const hasAnswer = faq.answer.trim().length > 0
          const charCount = faq.answer.length

          return (
            <Card 
              key={faq.questionKey} 
              className={`transition-all ${faq.isAIFocused ? 'border-purple-200 dark:border-purple-900' : ''} ${hasAnswer ? 'border-green-200 dark:border-green-900' : ''}`}
            >
              <CardHeader 
                className={`cursor-pointer hover:bg-accent/50 transition-colors ${faq.isAIFocused ? 'bg-purple-50/30 dark:bg-purple-950/20' : ''}`}
                onClick={() => toggleExpanded(faq.questionKey)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="font-mono">
                        Q{index + 1}
                      </Badge>
                      {faq.isAIFocused && (
                        <Badge variant="default" className="bg-purple-500 text-xs">
                          <Brain className="h-3 w-3 mr-1" />
                          AI Focus
                        </Badge>
                      )}
                      {hasAnswer && (
                        <Badge variant="default" className="bg-green-500 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Answered
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base font-medium leading-relaxed">
                      {faq.question}
                    </CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor={faq.questionKey} className="text-sm font-medium">
                      Your Answer
                    </Label>
                    <Textarea
                      id={faq.questionKey}
                      rows={6}
                      placeholder={PLACEHOLDERS[faq.questionKey]}
                      value={faq.answer}
                      onChange={(e) => updateAnswer(faq.questionKey, e.target.value)}
                      className={`${faq.isAIFocused ? 'border-purple-200 focus:border-purple-500' : ''}`}
                      required={faq.required}
                    />
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${hasAnswer ? 'text-green-600 dark:text-green-400 font-medium' : 'text-muted-foreground'}`}>
                        {hasAnswer ? '✓ Answer provided' : 'Optional'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {charCount} characters
                      </span>
                    </div>
                  </div>

                  {/* Context/Helper Text for specific questions */}
                  {faq.questionKey === 'disruptive_ideas' && (
                    <Alert className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
                      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <AlertDescription className="text-blue-800 dark:text-blue-200 text-xs">
                        Think big! Disruptive ideas should be transformative, even if they carry high risk. Consider innovations that could fundamentally change your business model.
                      </AlertDescription>
                    </Alert>
                  )}

                  {faq.questionKey === 'competitors_using_ai' && (
                    <Alert className="border-purple-200 bg-purple-50/50 dark:border-purple-900 dark:bg-purple-950/20">
                      <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <AlertDescription className="text-purple-800 dark:text-purple-200 text-xs">
                        Research competitor AI implementations. Include specific examples of AI tools they're using, outcomes they've achieved, and areas where we need to catch up.
                      </AlertDescription>
                    </Alert>
                  )}

                  {faq.questionKey === 'more_ai_budget_scenario' && (
                    <Alert className="border-purple-200 bg-purple-50/50 dark:border-purple-900 dark:bg-purple-950/20">
                      <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <AlertDescription className="text-purple-800 dark:text-purple-200 text-xs">
                        Be specific about AI tools, use cases, and expected ROI. Consider how additional AI investment could replace the need for headcount while maintaining or improving output.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Summary Alert at Bottom */}
      {requiredComplete ? (
        <Alert className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-900 dark:text-green-100">
            All Required Questions Complete!
          </AlertTitle>
          <AlertDescription className="text-green-800 dark:text-green-200">
            You've answered all {requiredQuestions} required questions. {totalQuestions - answeredCount > 0 ? `Consider answering the ${totalQuestions - answeredCount} optional questions for additional context.` : 'All questions answered!'}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-900 dark:text-red-100">
            Required Questions Incomplete
          </AlertTitle>
          <AlertDescription className="text-red-800 dark:text-red-200">
            Please complete the remaining {requiredQuestions - requiredAnsweredCount} required questions before submitting your AOP.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

