'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, Book, Code, Wrench, Settings, FileText, 
  Clock, TrendingUp, ThumbsUp, ThumbsDown, ChevronRight,
  Play, Lightbulb, HelpCircle
} from 'lucide-react'

interface Article {
  id: string
  title: string
  category: string
  readTime: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  content: string
  codeExample?: string
  relatedArticles?: string[]
}

const ARTICLES: Article[] = [
  // GETTING STARTED
  {
    id: 'what-is-debug',
    title: 'What is the AI Analyst Debug Dashboard?',
    category: 'Getting Started',
    readTime: 3,
    difficulty: 'Beginner',
    content: `The AI Analyst Debug Dashboard is a transparency tool that shows you exactly how the AI analysis system works. It helps you:

• Understand what data is sent to the AI
• View the exact prompts used for analysis
• Diagnose issues when analysis isn't working correctly
• Verify that your department's data is being used (not generic examples)
• Track data quality and analysis effectiveness

The dashboard has 4 main tabs:
1. Data Flow - Shows the 7-stage pipeline from form submission to analysis results
2. Prompt Inspector - View and test the exact prompts sent to Claude API
3. Analysis Results - Breakdown of AI insights with quality metrics
4. Troubleshooting - Common issues and how to fix them`,
    relatedArticles: ['data-flow-diagram', 'prompt-inspector-guide']
  },
  {
    id: 'data-flow-diagram',
    title: 'How to read the Data Flow diagram',
    category: 'Getting Started',
    readTime: 5,
    difficulty: 'Beginner',
    content: `The Data Flow visualization shows 7 stages:

Stage 1: Form Submission - User enters department data, metrics, and initiatives
Stage 2: Data Extraction - buildAnalysisPrompt extracts fields from formData
Stage 3: Prompt Construction - Builds comprehensive prompt with department context
Stage 4: Claude API Call - Sends prompt to Anthropic Claude
Stage 5: Response Parsing - Converts JSON response to structured data
Stage 6: Response Validation - Verifies AI used submitted data
Stage 7: Return to User - Displays results on dashboard

Click any stage to expand and see detailed data. Use the sample selector to test with Finance, Marketing, or IT department data.`,
    relatedArticles: ['what-is-debug', 'data-extraction']
  },
  
  // UNDERSTANDING DATA FLOW
  {
    id: 'what-data-used',
    title: 'What data does the AI use for analysis?',
    category: 'Understanding Data Flow',
    readTime: 4,
    difficulty: 'Beginner',
    content: `The AI uses data from your AOP submission:

1. Department Information:
   - Department name, fiscal year
   - Team description and responsibilities
   - Department head, team tenets
   - AI strategy overview

2. Metrics:
   - Business metrics (names, FY25/26/27 values)
   - AI performance metrics (adoption, hours saved, etc.)

3. Initiatives:
   - Initiative names and descriptions
   - AI integration plans
   - Total costs and AI cost impacts

4. Prior Year Performance:
   - Performance analysis, outcomes
   - AI tools piloted, wins, challenges
   - Measurable impacts

5. AI Workforce Planning:
   - Tasks augmented by AI
   - Expected productivity improvements
   - Skills development needs

6. Strategic FAQ Responses:
   - First 5 FAQ answers provided

All this data is inserted into the prompt to give AI complete context for analysis.`,
    relatedArticles: ['data-extraction', 'missing-data']
  },
  {
    id: 'data-extraction',
    title: 'How is form data extracted and processed?',
    category: 'Understanding Data Flow',
    readTime: 6,
    difficulty: 'Intermediate',
    content: `Data extraction happens in the buildAnalysisPrompt function (src/lib/ai-analysis.ts):

1. Extract Basic Fields:
   - aiStrategyOverview = formData.aiStrategyOverview || 'Not provided'
   - businessMetrics = formData.businessMetrics || []
   - initiatives = formData.initiatives || []

2. Extract Nested Data:
   - teamDescription = formData.teamDescription
   - aiWorkforce = formData.aiEnabledWorkforce

3. Build Prompt Sections:
   - SECTION 1: Department info and AI strategy
   - SECTION 2: Metrics with FY25/26/27 values
   - SECTION 3: Prior year performance
   - SECTION 4: Initiatives with AI integration
   - SECTION 5: Workforce planning

4. Add Critical Instructions:
   - Department-specific focus areas
   - Warnings against using IT examples
   - Data usage requirements

The extracted data is inserted using template literals like \${departmentName} throughout the prompt.`,
    codeExample: `// Example from buildAnalysisPrompt
const aiStrategyOverview = request.aopFormData.aiStrategyOverview || 'Not provided'
const businessMetrics = request.aopFormData.businessMetrics || []

// Insert into prompt
\`Department Name: \${request.departmentName}
AI Strategy: \${aiStrategyOverview}
Metrics: \${businessMetrics.map(m => m.name).join(', ')}\``,
    relatedArticles: ['what-data-used', 'prompt-template']
  },
  {
    id: 'missing-data',
    title: 'What happens if data is missing?',
    category: 'Understanding Data Flow',
    readTime: 3,
    difficulty: 'Beginner',
    content: `When data is missing from the form submission:

1. Extraction Phase:
   - Fields default to 'Not provided' or empty arrays
   - No error thrown, processing continues

2. Prompt Phase:
   - Missing sections show "Not provided"
   - AI is instructed to acknowledge gaps
   - Confidence score will be lower

3. Analysis Phase:
   - AI notes missing data in summary
   - Recommendations may include "provide more data"
   - Confidence score reduced (typically 40-60 vs 80+)

4. Validation Phase:
   - Warnings logged about missing fields
   - Data usage score will be lower
   - Suggestions provided for improvement

Best Practice: Fill out as many fields as possible, especially:
- AI Strategy Overview (200+ characters recommended)
- Business metrics with names and values
- Initiative descriptions and AI integration plans
- Prior year performance data`,
    relatedArticles: ['data-extraction', 'improve-quality']
  },
  
  // TROUBLESHOOTING
  {
    id: 'generic-analysis',
    title: 'Why is my analysis too generic?',
    category: 'Troubleshooting',
    readTime: 4,
    difficulty: 'Beginner',
    content: `Generic analysis usually indicates:

1. Missing Data:
   - Check if you filled out all sections
   - Verify metrics have specific names
   - Ensure AI Strategy Overview is detailed

2. Low Data Quality:
   - Metrics without values
   - Initiatives without descriptions
   - Vague or missing AI integration plans

3. Field Name Issues:
   - Metrics should use 'name' field (not 'metricName')
   - Verify in Data Flow tab

How to Check:
- Go to Analysis Results tab
- Check "Data Validation Results" section
- Look for red X marks on missing references
- Review "Quality Metrics" - Specificity should be >80%

How to Fix:
- Fill out more form fields with specific details
- Add quantitative metrics with actual values
- Write detailed AI Strategy Overview (300+ characters)
- Include specific numbers in initiative descriptions`,
    relatedArticles: ['improve-quality', 'data-validation']
  },
  {
    id: 'it-examples-wrong-dept',
    title: 'How to fix IT examples appearing for non-IT departments',
    category: 'Troubleshooting',
    readTime: 5,
    difficulty: 'Intermediate',
    content: `If Finance gets IT examples (GitHub, code quality, etc.):

Problem: AI not seeing department-specific instructions

Diagnostic Steps:
1. Use Prompt Inspector tab
2. Search for your department name
3. Should appear 10+ times in green
4. Look for "FOR [YOUR DEPT] DEPARTMENT" section in yellow

Check These:
• Department name correctly set in form
• buildAnalysisPrompt includes dept-specific focus areas
• Critical warnings present in prompt
• validateAnalysisResponse logs show dept referenced

Fix:
1. Verify department field in form (src/components/submission/IntroductionSection.tsx)
2. Check buildAnalysisPrompt has focus areas for your dept (src/lib/ai-analysis.ts lines 331-386)
3. Ensure prompt includes critical warnings section
4. Test with Prompt Inspector - dept name should be in green throughout`,
    codeExample: `// Check in src/lib/ai-analysis.ts
\${request.departmentName === 'Finance' ? \`
FOR FINANCE DEPARTMENT - Focus on:
  • Financial operations, close processes
  • DO NOT use: software development metrics
\` : ...}`,
    relatedArticles: ['dept-specific-prompts', 'validation-warnings']
  },
  
  // CUSTOMIZATION
  {
    id: 'modify-prompt',
    title: 'How to modify the AI prompt',
    category: 'Customization',
    readTime: 8,
    difficulty: 'Advanced',
    content: `To customize the AI prompt:

Location: src/lib/ai-analysis.ts
Function: buildAnalysisPrompt(request: AnalysisRequest): string

Structure:
1. Extract data (lines 104-120)
2. Build basePrompt with sections
3. Add criticalInstructions
4. Return basePrompt + criticalInstructions

Common Modifications:

A. Add New Section:
   Add after line 183 in the DEPARTMENT-SPECIFIC SUBMISSION DATA section

B. Emphasize Specific Requirements:
   Edit CRITICAL ANALYSIS REQUIREMENTS section (lines 500-606)

C. Adjust Department Focus Areas:
   Edit department-specific focus sections (lines 331-386)

D. Change Output Requirements:
   Edit OUTPUT REQUIREMENTS section to add new fields

After modifying:
- Test with Prompt Inspector
- Verify changes appear in generated prompt
- Run test analysis to see impact`,
    codeExample: `// Example: Add emphasis on metrics
REQUIRED QUANTITATIVE ANALYSIS:
- Perform variance analysis
- MUST reference each submitted metric by name  // NEW
- Cite specific FY2025 vs FY2027 values  // NEW`,
    relatedArticles: ['prompt-template', 'add-department']
  },
  {
    id: 'add-department',
    title: 'How to add new department types',
    category: 'Customization',
    readTime: 10,
    difficulty: 'Advanced',
    content: `Adding a new department (e.g., Legal):

Step 1: Add to Form Selector
File: src/components/submission/IntroductionSection.tsx (line 33)
<SelectItem value="Legal">Legal</SelectItem>

Step 2: Add Focus Areas to Prompt
File: src/lib/ai-analysis.ts (after line 371)

\${request.departmentName === 'Legal' ? \`
FOR LEGAL DEPARTMENT - Focus on:
  • Contract review efficiency, SLA compliance
  • Legal spend, outside counsel costs
  • Compliance metrics, regulatory adherence
  • Risk mitigation, litigation management
  • AI for contract analysis, legal research
  • DO NOT use: software dev, marketing metrics
\` : ...}

Step 3: Add to Sample Data
File: src/lib/debug/sample-data-manager.ts
Create generateLegalSample() function with appropriate metrics

Step 4: Test
- Use Prompt Inspector to generate Legal dept prompt
- Verify focus areas appear
- Check that Legal-specific KPIs are suggested`,
    codeExample: `// Complete Legal department focus areas
FOR LEGAL DEPARTMENT - Focus on:
  • Contract review: cycle time, accuracy
  • Compliance: regulatory adherence rates
  • Legal spend: cost per matter, outside counsel
  • Risk: litigation exposure, settlements
  • AI tools: contract analysis, legal research
  • DO NOT use: code quality, deployment, CAC`,
    relatedArticles: ['modify-prompt', 'sample-data']
  }
]

const GLOSSARY = [
  { term: 'AI Readiness Score', definition: 'A 0-100 score measuring your department\'s AI maturity based on strategy quality, evidence of wins, comprehensiveness of plans, and realism of estimates. 0-30 = Early exploration, 61-80 = Maturing practice, 81-100 = AI-native operation.' },
  { term: 'Confidence Score', definition: 'A 0-100 score indicating the AI\'s confidence in the analysis based on data quality, completeness of submission, and clarity of information. Lower scores indicate missing or inconsistent data.' },
  { term: 'Data Usage Score', definition: 'Percentage of submitted items (metrics, initiatives, department name) that were actually referenced in the AI analysis. 80%+ is excellent, below 50% suggests AI used generic examples.' },
  { term: 'Validation', definition: 'The process of checking that AI analysis actually used the submitted data. The validateAnalysisResponse function counts how many metrics and initiatives were mentioned.' },
  { term: 'Prompt Engineering', definition: 'The practice of crafting effective prompts for AI systems. The buildAnalysisPrompt function is our prompt engineering implementation.' },
  { term: 'FormState', definition: 'TypeScript interface defining the structure of AOP form data, including all sections from introduction through appendix FAQs. Located in src/types/aop.ts.' },
  { term: 'Department-Specific Analysis', definition: 'Analysis tailored to a specific department type. Finance gets financial metrics (DSO, close time), Marketing gets marketing metrics (CAC, conversion), etc.' },
  { term: 'buildAnalysisPrompt', definition: 'Function in src/lib/ai-analysis.ts that generates the prompt sent to Claude API. It extracts form data and constructs a comprehensive analysis request.' },
  { term: 'validateAnalysisResponse', definition: 'Function that verifies AI analysis used submitted data. Counts metric/initiative references and warns if data usage is low.' }
]

interface HelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function HelpModal({ open, onOpenChange }: HelpModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [articleFeedback, setArticleFeedback] = useState<Record<string, 'helpful' | 'not-helpful'>>({})
  const [showGuidedTour, setShowGuidedTour] = useState(false)
  const [dontShowTourAgain, setDontShowTourAgain] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Getting Started')

  const categories = Array.from(new Set(ARTICLES.map(a => a.category)))

  const filteredArticles = ARTICLES.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory

    return matchesSearch && matchesCategory
  })

  const filteredGlossary = GLOSSARY.filter(item =>
    searchQuery === '' ||
    item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-red-100 text-red-800'
    }
    return colors[difficulty] || colors.Beginner
  }

  const markFeedback = (articleId: string, helpful: boolean) => {
    setArticleFeedback({
      ...articleFeedback,
      [articleId]: helpful ? 'helpful' : 'not-helpful'
    })
  }

  const startGuidedTour = () => {
    setShowGuidedTour(true)
    if (dontShowTourAgain) {
      localStorage.setItem('skipDebugDashboardTour', 'true')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            Debug Dashboard Help & Documentation
          </DialogTitle>
          <DialogDescription>
            Searchable knowledge base and tutorials
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-64 border-r p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Guided Tour */}
              <Button 
                onClick={startGuidedTour} 
                variant="outline" 
                size="sm"
                className="w-full border-purple-300 text-purple-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Guided Tour
              </Button>

              {/* Categories */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Categories</h3>
                <div className="space-y-1">
                  <Button
                    variant={activeCategory === 'All' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => setActiveCategory('All')}
                  >
                    All Articles
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={activeCategory === category ? 'secondary' : 'ghost'}
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="pt-4 border-t">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Quick Links</h3>
                <div className="space-y-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-sm" onClick={() => setSelectedArticle(null)}>
                    <Book className="h-4 w-4 mr-2" />
                    Browse Articles
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                    <Code className="h-4 w-4 mr-2" />
                    Code Reference
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedArticle ? (
              /* Article View */
              <div className="max-w-3xl">
                <Button 
                  onClick={() => setSelectedArticle(null)}
                  variant="ghost"
                  size="sm"
                  className="mb-4"
                >
                  ← Back to Articles
                </Button>

                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-2">{selectedArticle.title}</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {selectedArticle.readTime} min read
                    </Badge>
                    <Badge className={`text-xs ${getDifficultyColor(selectedArticle.difficulty)}`}>
                      {selectedArticle.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {selectedArticle.category}
                    </Badge>
                  </div>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                        {selectedArticle.content}
                      </div>

                      {selectedArticle.codeExample && (
                        <div className="mt-6">
                          <h4 className="font-semibold mb-2">Code Example:</h4>
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                            {selectedArticle.codeExample}
                          </pre>
                        </div>
                      )}

                      {selectedArticle.relatedArticles && selectedArticle.relatedArticles.length > 0 && (
                        <div className="mt-6 pt-6 border-t">
                          <h4 className="font-semibold mb-3">Related Articles:</h4>
                          <div className="space-y-2">
                            {selectedArticle.relatedArticles.map(relatedId => {
                              const related = ARTICLES.find(a => a.id === relatedId)
                              return related ? (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="w-full justify-start"
                                  onClick={() => setSelectedArticle(related)}
                                >
                                  <ChevronRight className="h-4 w-4 mr-2" />
                                  {related.title}
                                </Button>
                              ) : null
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Article Feedback */}
                <Card className="mt-4 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Was this article helpful?</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={articleFeedback[selectedArticle.id] === 'helpful' ? 'default' : 'outline'}
                          onClick={() => markFeedback(selectedArticle.id, true)}
                          className={articleFeedback[selectedArticle.id] === 'helpful' ? 'bg-green-600' : ''}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Yes
                        </Button>
                        <Button
                          size="sm"
                          variant={articleFeedback[selectedArticle.id] === 'not-helpful' ? 'default' : 'outline'}
                          onClick={() => markFeedback(selectedArticle.id, false)}
                          className={articleFeedback[selectedArticle.id] === 'not-helpful' ? 'bg-red-600' : ''}
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          No
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Articles List & Other Content */
              <Tabs defaultValue="articles" className="w-full">
                <TabsList>
                  <TabsTrigger value="articles">
                    <Book className="h-4 w-4 mr-2" />
                    Articles
                  </TabsTrigger>
                  <TabsTrigger value="videos">
                    <Play className="h-4 w-4 mr-2" />
                    Videos
                  </TabsTrigger>
                  <TabsTrigger value="glossary">
                    <FileText className="h-4 w-4 mr-2" />
                    Glossary
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="articles" className="space-y-3 mt-4">
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map(article => (
                      <Card 
                        key={article.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedArticle(article)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-base mb-2">{article.title}</CardTitle>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {article.readTime} min
                                </Badge>
                                <Badge className={`text-xs ${getDifficultyColor(article.difficulty)}`}>
                                  {article.difficulty}
                                </Badge>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </CardHeader>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center text-gray-500">
                        No articles found matching &quot;{searchQuery}&quot;
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="videos" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="cursor-not-allowed opacity-75">
                      <CardContent className="pt-6">
                        <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-3">
                          <Play className="h-12 w-12 text-gray-400" />
                        </div>
                        <h4 className="font-semibold mb-1">5-Minute Dashboard Overview</h4>
                        <p className="text-xs text-gray-600">Coming soon - Quick tour of all debug features</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-not-allowed opacity-75">
                      <CardContent className="pt-6">
                        <div className="aspect-video bg-gradient-to-br from-green-100 to-teal-100 rounded-lg flex items-center justify-center mb-3">
                          <Play className="h-12 w-12 text-gray-400" />
                        </div>
                        <h4 className="font-semibold mb-1">Diagnosing Analysis Issues</h4>
                        <p className="text-xs text-gray-600">Coming soon - Step-by-step troubleshooting</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-not-allowed opacity-75">
                      <CardContent className="pt-6">
                        <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-3">
                          <Play className="h-12 w-12 text-gray-400" />
                        </div>
                        <h4 className="font-semibold mb-1">Customizing AI Prompts</h4>
                        <p className="text-xs text-gray-600">Coming soon - How to adjust prompts for your needs</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="glossary" className="space-y-2 mt-4">
                  {filteredGlossary.map((item, idx) => (
                    <Card key={idx}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold">{item.term}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {item.definition}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>

        {/* Guided Tour Overlay */}
        {showGuidedTour && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Guided Tour
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Welcome to the Debug Dashboard! This guided tour will walk you through each feature.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">Tour includes:</h4>
                  <ul className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                    <li>• Data Flow visualization overview</li>
                    <li>• Prompt Inspector features</li>
                    <li>• Analysis Results breakdown</li>
                    <li>• Troubleshooting guide</li>
                    <li>• Keyboard shortcuts</li>
                  </ul>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="dontShow"
                    checked={dontShowTourAgain}
                    onChange={(e) => setDontShowTourAgain(e.target.checked)}
                  />
                  <label htmlFor="dontShow" className="text-sm text-gray-600">
                    Don&apos;t show this again
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setShowGuidedTour(false)} className="flex-1">
                    Start Tour
                  </Button>
                  <Button onClick={() => setShowGuidedTour(false)} variant="outline">
                    Skip
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

