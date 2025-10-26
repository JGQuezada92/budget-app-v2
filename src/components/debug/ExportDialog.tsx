'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  FileDown, Loader2, CheckCircle, X, FileJson, FileText,
  FileSpreadsheet, FileType, Mail, Share2, Clock, Trash2,
  Copy, ExternalLink, AlertCircle
} from 'lucide-react'
import { 
  exportDebugReport, 
  getExportHistory, 
  clearExportHistory,
  type DebugReportData 
} from '@/lib/debug/export-utils'

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  debugData: DebugReportData | null
}

type ExportFormat = 'json' | 'markdown' | 'pdf' | 'csv'

interface ExportSection {
  id: string
  label: string
  description: string
  enabled: boolean
}

export default function ExportDialog({ open, onOpenChange, debugData }: ExportDialogProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'history'>('export')
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf')
  const [includeSensitiveData, setIncludeSensitiveData] = useState(false)
  const [comments, setComments] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [exportHistory, setExportHistory] = useState(getExportHistory())

  const [sections, setSections] = useState<ExportSection[]>([
    { id: 'summary', label: 'Executive Summary', description: 'Overview, scores, key findings', enabled: true },
    { id: 'dataFlow', label: 'Data Flow Analysis', description: 'Pipeline stages and completeness', enabled: true },
    { id: 'prompt', label: 'Prompt Analysis', description: 'Full prompt text and statistics', enabled: true },
    { id: 'analysis', label: 'Analysis Results', description: 'Insights, recommendations, risks', enabled: true },
    { id: 'validation', label: 'Validation Results', description: 'Data usage and quality metrics', enabled: true },
    { id: 'technical', label: 'Technical Details', description: 'API logs and errors', enabled: false },
  ])

  const toggleSection = (id: string) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ))
  }

  const handleExport = async () => {
    if (!debugData) {
      setExportError('No debug data available')
      return
    }

    setIsExporting(true)
    setExportSuccess(false)
    setExportError(null)

    try {
      // Filter data based on selected sections
      const filteredData: DebugReportData = {
        ...debugData,
        dataFlow: sections.find(s => s.id === 'dataFlow')?.enabled ? debugData.dataFlow : undefined,
        prompt: sections.find(s => s.id === 'prompt')?.enabled ? debugData.prompt : undefined,
        analysis: sections.find(s => s.id === 'analysis')?.enabled ? debugData.analysis : undefined,
        validation: sections.find(s => s.id === 'validation')?.enabled ? debugData.validation : undefined,
        technical: sections.find(s => s.id === 'technical')?.enabled ? debugData.technical : undefined,
      }

      await exportDebugReport(filteredData, selectedFormat, {
        includeSensitiveData,
        comments
      })

      setExportSuccess(true)
      setExportHistory(getExportHistory())

      // Auto-close success message after 3 seconds
      setTimeout(() => {
        setExportSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Export failed:', error)
      setExportError(error instanceof Error ? error.message : 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  const handleGenerateShareLink = async () => {
    if (!debugData) return

    setIsGeneratingLink(true)
    
    try {
      // In a real implementation, this would call an API to store the data
      // and return a unique link. For now, we'll simulate it.
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate mock share ID
      const shareId = Math.random().toString(36).substring(7)
      const link = `${window.location.origin}/debug/shared/${shareId}`
      
      // In production, you would:
      // const response = await fetch('/api/debug/share', {
      //   method: 'POST',
      //   body: JSON.stringify(debugData)
      // })
      // const { shareId } = await response.json()
      
      setShareLink(link)
      
      // Store in localStorage for demo (in production, store on server)
      localStorage.setItem(`shared-debug-${shareId}`, JSON.stringify(debugData))
    } catch (error) {
      console.error('Failed to generate share link:', error)
      setExportError('Failed to generate share link')
    } finally {
      setIsGeneratingLink(false)
    }
  }

  const copyShareLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink)
      alert('Link copied to clipboard!')
    }
  }

  const handleEmailReport = () => {
    const subject = `AI Analyst Debug Report - ${debugData?.departmentName || 'Unknown'}`
    const body = `Please find attached the AI Analyst debug report.\n\nGenerated: ${new Date().toLocaleString()}\n\nComments:\n${comments || 'None'}`
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear export history?')) {
      clearExportHistory()
      setExportHistory([])
    }
  }

  const formatOptions = [
    { value: 'pdf' as ExportFormat, label: 'PDF', icon: FileType, description: 'Professional formatted report' },
    { value: 'json' as ExportFormat, label: 'JSON', icon: FileJson, description: 'Complete raw data' },
    { value: 'markdown' as ExportFormat, label: 'Markdown', icon: FileText, description: 'Human-readable report' },
    { value: 'csv' as ExportFormat, label: 'CSV', icon: FileSpreadsheet, description: 'Metrics and scores only' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-blue-600" />
            Export Debug Report
          </DialogTitle>
          <DialogDescription>
            Export comprehensive analysis and debugging information
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b pb-2">
          <Button
            variant={activeTab === 'export' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('export')}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('history')}
          >
            <Clock className="h-4 w-4 mr-2" />
            History ({exportHistory.length})
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'export' ? (
            /* Export Tab */
            <div className="space-y-4 p-1">
              {/* Format Selection */}
              <div>
                <label className="text-sm font-semibold mb-2 block">Export Format</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {formatOptions.map(option => {
                    const Icon = option.icon
                    return (
                      <Card
                        key={option.value}
                        className={`cursor-pointer transition-all ${
                          selectedFormat === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                            : 'hover:border-gray-400'
                        }`}
                        onClick={() => setSelectedFormat(option.value)}
                      >
                        <CardContent className="p-4 text-center">
                          <Icon className={`h-8 w-8 mx-auto mb-2 ${
                            selectedFormat === option.value ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <div className="font-semibold text-sm">{option.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Sections to Include */}
              <div>
                <label className="text-sm font-semibold mb-2 block">Include in Report</label>
                <div className="space-y-2">
                  {sections.map(section => (
                    <Card key={section.id} className="cursor-pointer" onClick={() => toggleSection(section.id)}>
                      <CardContent className="p-3 flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={section.enabled}
                          onChange={() => toggleSection(section.id)}
                          className="h-4 w-4"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{section.label}</div>
                          <div className="text-xs text-gray-500">{section.description}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="text-sm font-semibold block">Options</label>
                
                <Card className="cursor-pointer" onClick={() => setIncludeSensitiveData(!includeSensitiveData)}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeSensitiveData}
                      onChange={(e) => setIncludeSensitiveData(e.target.checked)}
                      className="h-4 w-4"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Include Sensitive Data</div>
                      <div className="text-xs text-gray-500">Include full prompt text and technical details</div>
                    </div>
                    {includeSensitiveData && (
                      <Badge variant="destructive" className="text-xs">Sensitive</Badge>
                    )}
                  </CardContent>
                </Card>

                <div>
                  <label className="text-sm font-medium mb-2 block">Comments / Notes</label>
                  <Textarea
                    placeholder="Add any comments or context for this export..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={3}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Preview */}
              <Card className="bg-gray-50 dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Export Preview</CardTitle>
                  <CardDescription className="text-xs">
                    What will be included in your {selectedFormat.toUpperCase()} export
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs space-y-1">
                  {sections.filter(s => s.enabled).map(section => (
                    <div key={section.id} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>{section.label}</span>
                    </div>
                  ))}
                  {includeSensitiveData && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      <span>Sensitive data included</span>
                    </div>
                  )}
                  {comments && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Comments: {comments.slice(0, 50)}{comments.length > 50 ? '...' : ''}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Success/Error Messages */}
              {exportSuccess && (
                <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Report exported successfully! Check your downloads folder.
                  </AlertDescription>
                </Alert>
              )}

              {exportError && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    {exportError}
                  </AlertDescription>
                </Alert>
              )}

              {/* Share Section */}
              <Card className="border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Analysis
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Generate a shareable link (expires in 7 days)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {!shareLink ? (
                    <Button
                      onClick={handleGenerateShareLink}
                      disabled={isGeneratingLink || !debugData}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      {isGeneratingLink ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Share2 className="h-4 w-4 mr-2" />
                      )}
                      Generate Share Link
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={shareLink}
                          readOnly
                          className="flex-1 text-xs p-2 border rounded bg-white dark:bg-gray-800"
                        />
                        <Button onClick={copyShareLink} size="sm" variant="outline">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        onClick={() => window.open(shareLink, '_blank')}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                      >
                        <ExternalLink className="h-3 w-3 mr-2" />
                        Open Shared View
                      </Button>
                      <p className="text-xs text-gray-600">
                        This link will expire on {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={handleExport}
                  disabled={isExporting || !debugData}
                  className="flex-1"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileDown className="h-4 w-4 mr-2" />
                  )}
                  {isExporting ? 'Exporting...' : 'Export Report'}
                </Button>
                <Button
                  onClick={handleEmailReport}
                  variant="outline"
                  disabled={!debugData}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          ) : (
            /* History Tab */
            <div className="space-y-3 p-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Recent Exports</h3>
                {exportHistory.length > 0 && (
                  <Button onClick={handleClearHistory} variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear History
                  </Button>
                )}
              </div>

              {exportHistory.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No export history yet</p>
                    <p className="text-xs mt-1">Your exported reports will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                exportHistory.map((item, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {item.departmentName} - FY{item.fiscalYear}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(item.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.format.toUpperCase()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

