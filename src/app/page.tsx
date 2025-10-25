import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, FileText, BarChart, Brain, Bug } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-4">Budget Planning & Analysis</h1>
          <p className="text-xl text-blue-100">
            AI-powered budget submissions with intelligent FP&A insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/95 backdrop-blur hover:shadow-2xl transition-shadow">
            <CardHeader>
              <FileText className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Submit Budget</CardTitle>
              <CardDescription>Complete your AOP form and upload financial data</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/submission">
                <Button className="w-full">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur hover:shadow-2xl transition-shadow">
            <CardHeader>
              <Brain className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>View Dashboard</CardTitle>
              <CardDescription>See your submissions and AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button className="w-full" variant="outline">
                  My Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur hover:shadow-2xl transition-shadow">
            <CardHeader>
              <BarChart className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Admin View</CardTitle>
              <CardDescription>Review all department submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <Button className="w-full" variant="outline">
                  Admin Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur hover:shadow-2xl transition-shadow">
            <CardHeader>
              <Bug className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>AI Analyst Debug</CardTitle>
              <CardDescription>View AI analysis data flow, prompts, and transparency tools</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/debug">
                <Button className="w-full" variant="outline">
                  Debug Tools
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-2 rounded">✓</div>
                <div>
                  <strong>AOP Template Compliance:</strong> Form mirrors your exact template structure
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-green-100 p-2 rounded">✓</div>
                <div>
                  <strong>AI FP&A Analysis:</strong> Claude AI acts as your personal analyst
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-purple-100 p-2 rounded">✓</div>
                <div>
                  <strong>File Upload Support:</strong> Historical data, budgets, and supporting docs
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-orange-100 p-2 rounded">✓</div>
                <div>
                  <strong>Beautiful Dashboards:</strong> User and admin views with insights
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}