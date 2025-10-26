'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Info, TrendingDown, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react'

interface Props {
  formData: any
  setFormData: (data: any) => void
}

export default function PriorYearSection({ formData, setFormData }: Props) {
  // Character counts for AI fields
  const aiToolsLength = formData.aiToolsPiloted?.length || 0
  const aiWinsLength = formData.aiKeyWins?.length || 0
  const aiChallengesLength = formData.aiMissesChallenges?.length || 0
  const aiImpactsLength = formData.aiMeasurableImpacts?.length || 0

  return (
    <div className="space-y-8">
      {/* FY27 Update Alert */}
      <Alert className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-blue-900 dark:text-blue-100">
          FY27 Template Update
        </AlertTitle>
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          New sections added: Performance Analysis (section e) and AI-Specific Retrospective are now required.
        </AlertDescription>
      </Alert>

      {/* SECTION 3: Prior Year Review - Traditional Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Prior Year Review (FY26)
          </CardTitle>
          <CardDescription>
            Reflect on the previous fiscal year&apos;s performance, outcomes, and learnings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* a) Key Metrics Commentary */}
          <div>
            <Label htmlFor="metricsCommentary" className="text-base font-medium">
              a) Key Metrics Commentary <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Provide context and analysis on the metrics performance from the prior year
            </p>
            <Textarea
              id="metricsCommentary"
              rows={5}
              placeholder="Analyze key metrics performance, explain variances, and provide context for results..."
              value={formData.metricsCommentary || ''}
              onChange={(e) => setFormData({ ...formData, metricsCommentary: e.target.value })}
              className="mt-2"
              required
            />
          </div>

          {/* b) Key Outcomes and Initiatives Completed */}
          <div>
            <Label htmlFor="priorYearOutcomes" className="text-base font-medium">
              b) Key Outcomes and Initiatives Completed <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Describe major accomplishments and completed initiatives
            </p>
            <Textarea
              id="priorYearOutcomes"
              rows={6}
              placeholder="List major accomplishments, completed projects, and significant milestones achieved during the prior year..."
              value={formData.priorYearOutcomes || ''}
              onChange={(e) => setFormData({ ...formData, priorYearOutcomes: e.target.value })}
              className="mt-2"
              required
            />
          </div>

          {/* c) Wins, Mistakes, Misses, and Learnings */}
          <div>
            <Label htmlFor="priorYearLearnings" className="text-base font-medium">
              c) Wins, Mistakes, Misses, and Learnings <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Reflect on successes, challenges, and key takeaways
            </p>
            <Textarea
              id="priorYearLearnings"
              rows={6}
              placeholder="Be candid about what went well, what didn't, and what you learned. Include specific examples of wins and mistakes..."
              value={formData.priorYearLearnings || ''}
              onChange={(e) => setFormData({ ...formData, priorYearLearnings: e.target.value })}
              className="mt-2"
              required
            />
          </div>

          {/* d) Industry Trends and Changes */}
          <div>
            <Label htmlFor="industryTrends" className="text-base font-medium">
              d) Industry Trends and Changes <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Note relevant industry developments, competitive landscape changes, or market shifts
            </p>
            <Textarea
              id="industryTrends"
              rows={4}
              placeholder="Describe industry trends, market changes, competitive dynamics, or regulatory shifts that impacted your function..."
              value={formData.industryTrends || ''}
              onChange={(e) => setFormData({ ...formData, industryTrends: e.target.value })}
              className="mt-2"
              required
            />
          </div>

          {/* e) Performance Analysis - NEW for FY27 */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="performanceAnalysis" className="text-base font-medium">
                e) Analysis on Performance of Achieving Targets and Execution of Initiatives <span className="text-red-500">*</span>
              </Label>
            </div>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Were targets achieved and initiatives executed efficiently and effectively? If not, please explain why.
            </p>
            <Textarea
              id="performanceAnalysis"
              rows={6}
              placeholder="Analyze the achievement of targets and efficiency of initiative execution. Address: (1) which targets were met/missed and why, (2) execution effectiveness vs. planned timeline/budget, (3) key factors that helped or hindered performance, (4) corrective actions taken or lessons for future planning."
              value={formData.performanceAnalysis || ''}
              onChange={(e) => setFormData({ ...formData, performanceAnalysis: e.target.value })}
              className="mt-2"
              required
            />
            <div className="flex justify-end mt-2">
              <span className="text-xs text-muted-foreground">
                {formData.performanceAnalysis?.length || 0} characters
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI-SPECIFIC RETROSPECTIVE - BRAND NEW SECTION */}
      <Card className="border-purple-200 dark:border-purple-900">
        <CardHeader className="bg-purple-50/50 dark:bg-purple-950/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                AI Retrospective (FY26)
              </CardTitle>
              <CardDescription>
                Reflect on your department&apos;s AI adoption journey during FY26
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 mt-6">
          {/* Info Alert */}
          <Alert className="border-purple-200 bg-purple-50/50 dark:border-purple-900 dark:bg-purple-950/20">
            <Info className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <AlertDescription className="text-purple-800 dark:text-purple-200">
              If your department used AI tools in FY26, describe your experience here. If you didn&apos;t use AI tools yet, explain your FY27 adoption plans and why you&apos;re starting now.
            </AlertDescription>
          </Alert>

          {/* 1. Tools Piloted/Adopted */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="aiToolsPiloted" className="text-base font-medium">
                1. Tools Piloted/Adopted
              </Label>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" title="List all AI tools used by your team" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              (Optional - only fill if AI tools were used) List all AI tools used (e.g., ChatGPT, Claude, GitHub Copilot)
            </p>
            <Textarea
              id="aiToolsPiloted"
              rows={4}
              placeholder="If no tools used: 'We did not pilot AI tools in FY26. Our FY27 plan is to...' If tools used: 'List tools and adoption approach...'"
              value={formData.aiToolsPiloted || ''}
              onChange={(e) => setFormData({ ...formData, aiToolsPiloted: e.target.value })}
              className="mt-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs ${aiToolsLength > 0 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                {aiToolsLength > 0 ? '✓ Field populated' : 'Optional'}
              </span>
              <span className="text-xs text-muted-foreground">
                {aiToolsLength} characters
              </span>
            </div>
          </div>

          {/* 2. Key Wins */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="aiKeyWins" className="text-base font-medium">
                2. Key Wins
              </Label>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              (Optional - only fill if AI tools were used) Describe 2-3 specific successes with measurable impact
            </p>
            <Textarea
              id="aiKeyWins"
              rows={5}
              placeholder="If applicable: Describe specific wins with metrics. If not applicable: 'No AI tools used in FY26. See FY27 plans above.'"
              value={formData.aiKeyWins || ''}
              onChange={(e) => setFormData({ ...formData, aiKeyWins: e.target.value })}
              className="mt-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs ${aiWinsLength > 0 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                {aiWinsLength > 0 ? '✓ Field populated' : 'Optional'}
              </span>
              <span className="text-xs text-muted-foreground">
                {aiWinsLength} characters
              </span>
            </div>
          </div>

          {/* 3. Misses/Challenges */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="aiMissesChallenges" className="text-base font-medium">
                3. Misses/Challenges
              </Label>
              <TrendingDown className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              (Optional - only fill if AI tools were used) Identify what didn&apos;t work or adoption barriers encountered
            </p>
            <Textarea
              id="aiMissesChallenges"
              rows={5}
              placeholder="If applicable: Describe challenges faced. If not applicable: 'N/A - no AI tools piloted in FY26.'"
              value={formData.aiMissesChallenges || ''}
              onChange={(e) => setFormData({ ...formData, aiMissesChallenges: e.target.value })}
              className="mt-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs ${aiChallengesLength > 0 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                {aiChallengesLength > 0 ? '✓ Field populated' : 'Optional'}
              </span>
              <span className="text-xs text-muted-foreground">
                {aiChallengesLength} characters
              </span>
            </div>
          </div>

          {/* 4. Measurable Impacts */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="aiMeasurableImpacts" className="text-base font-medium">
                4. Measurable Impacts
              </Label>
              <BarChart3 className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              (Optional - only fill if AI tools were used) Quantify cost reductions, efficiency gains, or innovation acceleration
            </p>
            <Textarea
              id="aiMeasurableImpacts"
              rows={5}
              placeholder="If applicable: Include specific metrics and percentages. If not applicable: 'N/A - no AI tools in FY26.'"
              value={formData.aiMeasurableImpacts || ''}
              onChange={(e) => setFormData({ ...formData, aiMeasurableImpacts: e.target.value })}
              className="mt-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs ${aiImpactsLength > 0 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                {aiImpactsLength > 0 ? '✓ Field populated' : 'Optional'}
              </span>
              <span className="text-xs text-muted-foreground">
                {aiImpactsLength} characters
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
