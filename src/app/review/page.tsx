'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Clock,
  AlertCircle,
  Edit,
  FileText,
  User,
  Calendar
} from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import Link from 'next/link'

interface Feedback {
  id: string
  submissionId: string
  departmentName: string
  fiscalYear: string
  status: 'pending' | 'approved' | 'revision_requested'
  reviewerName: string
  reviewDate: string
  comments: string
  sections: {
    sectionName: string
    status: 'approved' | 'needs_revision'
    feedback: string
    specificFields?: string[]
  }[]
}

export default function ReviewPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeedback()
  }, [])

  const loadFeedback = () => {
    try {
      // Load feedback from localStorage
      const storedFeedback = localStorage.getItem('submissionFeedback')
      if (storedFeedback) {
        setFeedbacks(JSON.parse(storedFeedback))
      }
    } catch (error) {
      console.error('Error loading feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'revision_requested':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { text: string; className: string }> = {
      approved: { text: 'Approved', className: 'bg-green-100 text-green-800 border-green-200' },
      revision_requested: { text: 'Revision Requested', className: 'bg-red-100 text-red-800 border-red-200' },
      pending: { text: 'Pending Review', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
    }
    
    const variant = variants[status] || variants.pending
    return <Badge className={variant.className}>{variant.text}</Badge>
  }

  const handleEditSubmission = (submissionId: string) => {
    // Load the submission and redirect to edit mode
    const submissions = JSON.parse(localStorage.getItem('userSubmissions') || '[]')
    const submission = submissions.find((s: any) => s.id === submissionId)
    
    if (submission) {
      localStorage.setItem('editingSubmission', JSON.stringify(submission))
      window.location.href = '/submission?edit=true'
    }
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <h1 className="text-2xl font-normal text-gray-900">Review & Feedback</h1>
            <p className="text-sm text-gray-600 mt-1">View admin feedback and make revisions to your submissions</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-8 py-8">

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading feedback...</p>
              </div>
            </div>
          ) : feedbacks.length === 0 ? (
            <Card className="border border-gray-200">
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-normal text-gray-900 mb-3">
                  No Feedback Yet
                </h3>
                <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                  Once your AOP submissions are reviewed, feedback from administrators will appear here.
                </p>
                <Link href="/submission">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <FileText className="h-4 w-4 mr-2" />
                    View My Submissions
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {feedbacks.map((feedback) => (
                <Card key={feedback.id} className="border border-gray-200">
                  <CardHeader className="border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">
                          {feedback.departmentName} - FY{feedback.fiscalYear}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            Reviewed by {feedback.reviewerName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(feedback.reviewDate).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusIcon(feedback.status)}
                        {getStatusBadge(feedback.status)}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* Overall Comments */}
                    {feedback.comments && (
                      <Alert className="mb-6 border-gray-200">
                        <MessageSquare className="h-4 w-4 text-gray-600" />
                        <AlertTitle className="text-gray-900 font-normal">Overall Comments</AlertTitle>
                        <AlertDescription className="mt-2 text-gray-700 text-sm">
                          {feedback.comments}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Section-specific Feedback */}
                    <div className="space-y-4">
                      <h3 className="font-normal text-gray-900 mb-3">Section-by-Section Review</h3>
                      
                      {feedback.sections.map((section, index) => (
                        <div
                          key={index}
                          className="p-4 rounded border border-gray-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {section.status === 'approved' ? (
                                <CheckCircle2 className="h-5 w-5 text-gray-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-gray-600" />
                              )}
                              <h4 className="font-normal text-gray-900">{section.sectionName}</h4>
                            </div>
                            <Badge variant="outline" className="border-gray-300 text-gray-600">
                              {section.status === 'approved' ? 'Approved' : 'Needs Revision'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-2">{section.feedback}</p>
                          
                          {section.specificFields && section.specificFields.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs font-normal text-gray-600 mb-2">
                                Fields requiring attention:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {section.specificFields.map((field, i) => (
                                  <Badge key={i} variant="outline" className="text-xs border-gray-300 text-gray-600">
                                    {field}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    {feedback.status === 'revision_requested' && (
                      <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                        <Button
                          onClick={() => handleEditSubmission(feedback.submissionId)}
                          className="bg-teal-600 hover:bg-teal-700"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Submission
                        </Button>
                        <Button variant="outline" className="border-gray-300" asChild>
                          <Link href="/submission">
                            <FileText className="h-4 w-4 mr-2" />
                            View All Submissions
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  )
}

