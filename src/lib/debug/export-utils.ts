// Export utilities for debug dashboard reporting

export interface DebugReportData {
  timestamp: string
  departmentName: string
  fiscalYear: string
  dataFlow?: {
    stages: Array<{
      name: string
      status: 'complete' | 'incomplete' | 'error'
      details: Record<string, any>
    }>
    completenessScore: number
    missingFields: string[]
  }
  prompt?: {
    fullText: string
    characterCount: number
    estimatedTokens: number
    sectionCount: number
    criticalWarnings: number
    departmentMentions: number
    qualityScore: number
  }
  analysis?: {
    insights: Array<{
      title: string
      description: string
      severity: string
      category: string
    }>
    recommendations: Array<{
      title: string
      description: string
      priority: string
    }>
    risks: Array<{
      category: string
      description: string
      severity: string
    }>
    aiReadinessScore: number
    confidenceScore: number
  }
  validation?: {
    metricsReferenced: number
    totalMetrics: number
    initiativesReferenced: number
    totalInitiatives: number
    departmentReferenced: boolean
    dataUsageScore: number
    specificityScore: number
    relevanceScore: number
  }
  technical?: {
    apiCalls: Array<{
      endpoint: string
      timestamp: string
      duration: number
      status: number
    }>
    errors: Array<{
      message: string
      timestamp: string
      stack?: string
    }>
  }
}

export interface ComparisonData {
  dept1: {
    name: string
    prompt: string
    stats: Record<string, number>
  }
  dept2: {
    name: string
    prompt: string
    stats: Record<string, number>
  }
  differences: Array<{
    lineNumber: number
    dept1Line: string
    dept2Line: string
    type: 'added' | 'removed' | 'modified'
  }>
}

export interface ValidationData {
  completeness: {
    requiredFields: Array<{ field: string; status: 'complete' | 'incomplete' }>
    optionalFields: Array<{ field: string; status: 'complete' | 'incomplete' }>
    score: number
  }
  errors: Array<{ field: string; message: string; severity: 'error' | 'warning' }>
  recommendations: string[]
  beforeAfter?: {
    before: { score: number; errors: number; warnings: number }
    after: { score: number; errors: number; warnings: number }
  }
}

/**
 * Export debug report in JSON format
 */
export function exportAsJSON(data: DebugReportData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  downloadBlob(blob, `debug-report-${data.departmentName}-${Date.now()}.json`)
}

/**
 * Export debug report in Markdown format
 */
export function exportAsMarkdown(data: DebugReportData): void {
  const markdown = generateMarkdownReport(data)
  const blob = new Blob([markdown], { type: 'text/markdown' })
  downloadBlob(blob, `debug-report-${data.departmentName}-${Date.now()}.md`)
}

/**
 * Export debug report in CSV format (metrics only)
 */
export function exportAsCSV(data: DebugReportData): void {
  const csv = generateCSVReport(data)
  const blob = new Blob([csv], { type: 'text/csv' })
  downloadBlob(blob, `debug-metrics-${data.departmentName}-${Date.now()}.csv`)
}

/**
 * Export debug report in PDF format
 */
export async function exportAsPDF(data: DebugReportData): Promise<void> {
  // Dynamically import jsPDF to reduce bundle size
  const { jsPDF } = await import('jspdf')
  
  const doc = new jsPDF()
  let yPosition = 20

  // Helper to add text with word wrap
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    doc.setFontSize(fontSize)
    if (isBold) doc.setFont('helvetica', 'bold')
    else doc.setFont('helvetica', 'normal')
    
    const lines = doc.splitTextToSize(text, 170)
    doc.text(lines, 20, yPosition)
    yPosition += (lines.length * fontSize * 0.4) + 5
    
    // Add new page if needed
    if (yPosition > 270) {
      doc.addPage()
      yPosition = 20
    }
  }

  const addSection = (title: string) => {
    yPosition += 5
    addText(title, 16, true)
    yPosition += 2
  }

  // Title
  doc.setFillColor(99, 102, 241) // Indigo
  doc.rect(0, 0, 210, 40, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('AI Analyst Debug Report', 20, 25)
  doc.setFontSize(12)
  doc.text(`${data.departmentName} - FY${data.fiscalYear}`, 20, 33)
  doc.setTextColor(0, 0, 0)
  yPosition = 50

  // Executive Summary
  addSection('Executive Summary')
  addText(`Generated: ${new Date(data.timestamp).toLocaleString()}`)
  if (data.analysis) {
    addText(`AI Readiness Score: ${data.analysis.aiReadinessScore}/100`)
    addText(`Confidence Score: ${data.analysis.confidenceScore}/100`)
  }
  if (data.validation) {
    addText(`Data Usage Score: ${data.validation.dataUsageScore}%`)
  }

  // Data Quality
  if (data.dataFlow) {
    addSection('Data Quality Analysis')
    addText(`Completeness Score: ${data.dataFlow.completenessScore}%`)
    if (data.dataFlow.missingFields.length > 0) {
      addText(`Missing Fields: ${data.dataFlow.missingFields.join(', ')}`, 10)
    }
  }

  // Prompt Analysis
  if (data.prompt) {
    addSection('Prompt Analysis')
    addText(`Length: ${data.prompt.characterCount.toLocaleString()} characters (${data.prompt.estimatedTokens} tokens)`)
    addText(`Sections: ${data.prompt.sectionCount}`)
    addText(`Critical Warnings: ${data.prompt.criticalWarnings}`)
    addText(`Department Mentions: ${data.prompt.departmentMentions}`)
    addText(`Quality Score: ${data.prompt.qualityScore}%`)
  }

  // Validation Results
  if (data.validation) {
    addSection('Validation Results')
    addText(`Metrics Referenced: ${data.validation.metricsReferenced}/${data.validation.totalMetrics}`)
    addText(`Initiatives Referenced: ${data.validation.initiativesReferenced}/${data.validation.totalInitiatives}`)
    addText(`Department Name Found: ${data.validation.departmentReferenced ? 'Yes' : 'No'}`)
    addText(`Specificity Score: ${data.validation.specificityScore}%`)
    addText(`Relevance Score: ${data.validation.relevanceScore}%`)
  }

  // Key Insights
  if (data.analysis && data.analysis.insights.length > 0) {
    addSection('Key Insights')
    data.analysis.insights.slice(0, 5).forEach((insight, idx) => {
      addText(`${idx + 1}. ${insight.title}`, 11, true)
      addText(insight.description, 10)
    })
  }

  // Recommendations
  if (data.analysis && data.analysis.recommendations.length > 0) {
    addSection('Top Recommendations')
    data.analysis.recommendations.slice(0, 5).forEach((rec, idx) => {
      addText(`${idx + 1}. ${rec.title}`, 11, true)
      addText(rec.description, 10)
    })
  }

  // Technical Details
  if (data.technical && data.technical.errors.length > 0) {
    addSection('Errors & Issues')
    data.technical.errors.forEach(error => {
      addText(`• ${error.message}`, 10)
    })
  }

  // Save PDF
  doc.save(`debug-report-${data.departmentName}-${Date.now()}.pdf`)
}

/**
 * Export prompt comparison as PDF
 */
export async function exportPromptComparison(
  dept1: string,
  dept2: string,
  comparison: ComparisonData
): Promise<void> {
  const { jsPDF } = await import('jspdf')
  
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })
  
  let yPosition = 20

  // Title
  doc.setFillColor(139, 92, 246) // Purple
  doc.rect(0, 0, 297, 30, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Prompt Comparison Report', 148.5, 18, { align: 'center' })
  doc.setTextColor(0, 0, 0)
  yPosition = 40

  // Department names
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(dept1, 60, yPosition, { align: 'center' })
  doc.text(dept2, 237, yPosition, { align: 'center' })
  yPosition += 10

  // Statistics table
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  const stats = [
    ['Metric', dept1, dept2],
    ['Character Count', comparison.dept1.stats.characterCount?.toString() || 'N/A', comparison.dept2.stats.characterCount?.toString() || 'N/A'],
    ['Estimated Tokens', comparison.dept1.stats.estimatedTokens?.toString() || 'N/A', comparison.dept2.stats.estimatedTokens?.toString() || 'N/A'],
    ['Sections', comparison.dept1.stats.sectionCount?.toString() || 'N/A', comparison.dept2.stats.sectionCount?.toString() || 'N/A'],
    ['Critical Warnings', comparison.dept1.stats.criticalWarnings?.toString() || 'N/A', comparison.dept2.stats.criticalWarnings?.toString() || 'N/A'],
  ]

  // Draw table
  const colWidth = 80
  const rowHeight = 8
  stats.forEach((row, rowIdx) => {
    const y = yPosition + (rowIdx * rowHeight)
    if (rowIdx === 0) {
      doc.setFillColor(240, 240, 240)
      doc.rect(10, y - 5, colWidth * 3, rowHeight, 'F')
      doc.setFont('helvetica', 'bold')
    } else {
      doc.setFont('helvetica', 'normal')
    }
    doc.text(row[0], 15, y)
    doc.text(row[1], 95, y)
    doc.text(row[2], 175, y)
  })

  yPosition += (stats.length * rowHeight) + 10

  // Key differences
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Key Differences', 10, yPosition)
  yPosition += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  
  const topDifferences = comparison.differences.slice(0, 10)
  topDifferences.forEach(diff => {
    if (yPosition > 180) {
      doc.addPage()
      yPosition = 20
    }

    // Color code by type
    if (diff.type === 'added') doc.setTextColor(0, 128, 0)
    else if (diff.type === 'removed') doc.setTextColor(255, 0, 0)
    else doc.setTextColor(0, 0, 255)

    doc.text(`Line ${diff.lineNumber}:`, 10, yPosition)
    doc.setTextColor(0, 0, 0)
    
    const line1 = doc.splitTextToSize(diff.dept1Line || '-', 120)
    const line2 = doc.splitTextToSize(diff.dept2Line || '-', 120)
    
    doc.text(line1, 35, yPosition)
    doc.text(line2, 165, yPosition)
    
    yPosition += Math.max(line1.length, line2.length) * 4 + 3
  })

  doc.save(`prompt-comparison-${dept1}-vs-${dept2}-${Date.now()}.pdf`)
}

/**
 * Export validation report as PDF
 */
export async function exportValidationReport(validation: ValidationData): Promise<void> {
  const { jsPDF } = await import('jspdf')
  
  const doc = new jsPDF()
  let yPosition = 20

  // Title
  doc.setFillColor(34, 197, 94) // Green
  doc.rect(0, 0, 210, 35, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('Data Validation Report', 105, 20, { align: 'center' })
  doc.setFontSize(12)
  doc.text(`Score: ${validation.completeness.score}%`, 105, 28, { align: 'center' })
  doc.setTextColor(0, 0, 0)
  yPosition = 45

  // Completeness checklist
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Required Fields', 20, yPosition)
  yPosition += 8

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  validation.completeness.requiredFields.forEach(field => {
    // Traffic light indicator
    if (field.status === 'complete') {
      doc.setFillColor(34, 197, 94) // Green
      doc.text('✓', 20, yPosition)
    } else {
      doc.setFillColor(239, 68, 68) // Red
      doc.text('✗', 20, yPosition)
    }
    
    doc.text(field.field, 30, yPosition)
    yPosition += 6

    if (yPosition > 270) {
      doc.addPage()
      yPosition = 20
    }
  })

  yPosition += 5

  // Errors and warnings
  if (validation.errors.length > 0) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Issues Found', 20, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    // Sort by severity
    const errors = validation.errors.filter(e => e.severity === 'error')
    const warnings = validation.errors.filter(e => e.severity === 'warning')

    errors.forEach(error => {
      doc.setTextColor(239, 68, 68) // Red
      doc.text('ERROR:', 20, yPosition)
      doc.setTextColor(0, 0, 0)
      const lines = doc.splitTextToSize(`${error.field}: ${error.message}`, 160)
      doc.text(lines, 45, yPosition)
      yPosition += lines.length * 5 + 2
    })

    warnings.forEach(warning => {
      doc.setTextColor(234, 179, 8) // Yellow
      doc.text('WARNING:', 20, yPosition)
      doc.setTextColor(0, 0, 0)
      const lines = doc.splitTextToSize(`${warning.field}: ${warning.message}`, 160)
      doc.text(lines, 45, yPosition)
      yPosition += lines.length * 5 + 2
    })
  }

  yPosition += 5

  // Recommendations
  if (validation.recommendations.length > 0) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Recommendations', 20, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    validation.recommendations.forEach((rec, idx) => {
      const lines = doc.splitTextToSize(`${idx + 1}. ${rec}`, 170)
      doc.text(lines, 20, yPosition)
      yPosition += lines.length * 5 + 3

      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }
    })
  }

  // Before/After comparison
  if (validation.beforeAfter) {
    yPosition += 5
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Improvement Tracking', 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    const before = validation.beforeAfter.before
    const after = validation.beforeAfter.after

    doc.text('Before:', 20, yPosition)
    doc.text(`Score: ${before.score}%`, 30, yPosition + 5)
    doc.text(`Errors: ${before.errors}`, 30, yPosition + 10)
    doc.text(`Warnings: ${before.warnings}`, 30, yPosition + 15)

    doc.text('After:', 100, yPosition)
    doc.text(`Score: ${after.score}%`, 110, yPosition + 5)
    doc.text(`Errors: ${after.errors}`, 110, yPosition + 10)
    doc.text(`Warnings: ${after.warnings}`, 110, yPosition + 15)

    // Improvement arrow
    if (after.score > before.score) {
      doc.setTextColor(34, 197, 94) // Green
      doc.text('↑ Improved', 70, yPosition + 10)
    } else if (after.score < before.score) {
      doc.setTextColor(239, 68, 68) // Red
      doc.text('↓ Declined', 70, yPosition + 10)
    }
    doc.setTextColor(0, 0, 0)
  }

  doc.save(`validation-report-${Date.now()}.pdf`)
}

/**
 * Generate comprehensive debug report
 */
export async function exportDebugReport(
  data: DebugReportData,
  format: 'json' | 'markdown' | 'pdf' | 'csv',
  options: {
    includeSensitiveData?: boolean
    comments?: string
  } = {}
): Promise<void> {
  // Add comments to metadata
  const reportData = {
    ...data,
    metadata: {
      generatedAt: new Date().toISOString(),
      includedSensitiveData: options.includeSensitiveData || false,
      comments: options.comments || ''
    }
  }

  // Remove sensitive data if requested
  if (!options.includeSensitiveData && reportData.prompt) {
    reportData.prompt.fullText = '[REDACTED - Sensitive data excluded]'
  }

  // Export in requested format
  switch (format) {
    case 'json':
      exportAsJSON(reportData)
      break
    case 'markdown':
      exportAsMarkdown(reportData)
      break
    case 'pdf':
      await exportAsPDF(reportData)
      break
    case 'csv':
      exportAsCSV(reportData)
      break
  }

  // Log export event
  console.log(`Debug report exported as ${format.toUpperCase()}`)
  
  // Save to export history
  saveToExportHistory({
    timestamp: reportData.timestamp,
    format,
    departmentName: reportData.departmentName,
    fiscalYear: reportData.fiscalYear
  })
}

/**
 * Helper: Download blob as file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Helper: Generate Markdown report
 */
function generateMarkdownReport(data: DebugReportData): string {
  let md = `# AI Analyst Debug Report\n\n`
  md += `**Department:** ${data.departmentName}\n`
  md += `**Fiscal Year:** ${data.fiscalYear}\n`
  md += `**Generated:** ${new Date(data.timestamp).toLocaleString()}\n\n`
  
  md += `---\n\n`
  
  // Executive Summary
  md += `## Executive Summary\n\n`
  if (data.analysis) {
    md += `- **AI Readiness Score:** ${data.analysis.aiReadinessScore}/100\n`
    md += `- **Confidence Score:** ${data.analysis.confidenceScore}/100\n`
  }
  if (data.validation) {
    md += `- **Data Usage Score:** ${data.validation.dataUsageScore}%\n`
  }
  md += `\n`
  
  // Data Quality
  if (data.dataFlow) {
    md += `## Data Quality Analysis\n\n`
    md += `- **Completeness Score:** ${data.dataFlow.completenessScore}%\n`
    if (data.dataFlow.missingFields.length > 0) {
      md += `- **Missing Fields:**\n`
      data.dataFlow.missingFields.forEach(field => {
        md += `  - ${field}\n`
      })
    }
    md += `\n`
  }
  
  // Prompt Analysis
  if (data.prompt) {
    md += `## Prompt Analysis\n\n`
    md += `- **Character Count:** ${data.prompt.characterCount.toLocaleString()}\n`
    md += `- **Estimated Tokens:** ${data.prompt.estimatedTokens}\n`
    md += `- **Sections:** ${data.prompt.sectionCount}\n`
    md += `- **Critical Warnings:** ${data.prompt.criticalWarnings}\n`
    md += `- **Department Mentions:** ${data.prompt.departmentMentions}\n`
    md += `- **Quality Score:** ${data.prompt.qualityScore}%\n\n`
    
    if (data.prompt.fullText && !data.prompt.fullText.includes('[REDACTED')) {
      md += `### Full Prompt\n\n\`\`\`\n${data.prompt.fullText}\n\`\`\`\n\n`
    }
  }
  
  // Validation
  if (data.validation) {
    md += `## Validation Results\n\n`
    md += `| Metric | Value |\n`
    md += `|--------|-------|\n`
    md += `| Metrics Referenced | ${data.validation.metricsReferenced}/${data.validation.totalMetrics} |\n`
    md += `| Initiatives Referenced | ${data.validation.initiativesReferenced}/${data.validation.totalInitiatives} |\n`
    md += `| Department Name Found | ${data.validation.departmentReferenced ? '✓' : '✗'} |\n`
    md += `| Specificity Score | ${data.validation.specificityScore}% |\n`
    md += `| Relevance Score | ${data.validation.relevanceScore}% |\n\n`
  }
  
  // Insights
  if (data.analysis && data.analysis.insights.length > 0) {
    md += `## Key Insights\n\n`
    data.analysis.insights.forEach((insight, idx) => {
      md += `### ${idx + 1}. ${insight.title}\n\n`
      md += `${insight.description}\n\n`
      md += `- **Severity:** ${insight.severity}\n`
      md += `- **Category:** ${insight.category}\n\n`
    })
  }
  
  // Recommendations
  if (data.analysis && data.analysis.recommendations.length > 0) {
    md += `## Recommendations\n\n`
    data.analysis.recommendations.forEach((rec, idx) => {
      md += `### ${idx + 1}. ${rec.title}\n\n`
      md += `${rec.description}\n\n`
      md += `- **Priority:** ${rec.priority}\n\n`
    })
  }
  
  return md
}

/**
 * Helper: Generate CSV report (metrics only)
 */
function generateCSVReport(data: DebugReportData): string {
  let csv = 'Metric,Value\n'
  
  csv += `Department,${data.departmentName}\n`
  csv += `Fiscal Year,${data.fiscalYear}\n`
  csv += `Generated,${new Date(data.timestamp).toISOString()}\n`
  csv += `\n`
  
  if (data.analysis) {
    csv += `AI Readiness Score,${data.analysis.aiReadinessScore}\n`
    csv += `Confidence Score,${data.analysis.confidenceScore}\n`
  }
  
  if (data.validation) {
    csv += `Metrics Referenced,${data.validation.metricsReferenced}\n`
    csv += `Total Metrics,${data.validation.totalMetrics}\n`
    csv += `Initiatives Referenced,${data.validation.initiativesReferenced}\n`
    csv += `Total Initiatives,${data.validation.totalInitiatives}\n`
    csv += `Department Referenced,${data.validation.departmentReferenced ? 'Yes' : 'No'}\n`
    csv += `Data Usage Score,${data.validation.dataUsageScore}\n`
    csv += `Specificity Score,${data.validation.specificityScore}\n`
    csv += `Relevance Score,${data.validation.relevanceScore}\n`
  }
  
  if (data.prompt) {
    csv += `Prompt Character Count,${data.prompt.characterCount}\n`
    csv += `Prompt Estimated Tokens,${data.prompt.estimatedTokens}\n`
    csv += `Prompt Sections,${data.prompt.sectionCount}\n`
    csv += `Prompt Critical Warnings,${data.prompt.criticalWarnings}\n`
    csv += `Prompt Department Mentions,${data.prompt.departmentMentions}\n`
    csv += `Prompt Quality Score,${data.prompt.qualityScore}\n`
  }
  
  if (data.dataFlow) {
    csv += `Data Completeness Score,${data.dataFlow.completenessScore}\n`
    csv += `Missing Fields Count,${data.dataFlow.missingFields.length}\n`
  }
  
  return csv
}

/**
 * Save export to history
 */
function saveToExportHistory(exportRecord: {
  timestamp: string
  format: string
  departmentName: string
  fiscalYear: string
}): void {
  try {
    const historyKey = 'debugExportHistory'
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]')
    
    history.unshift(exportRecord)
    
    // Keep only last 20 exports
    const trimmedHistory = history.slice(0, 20)
    
    localStorage.setItem(historyKey, JSON.stringify(trimmedHistory))
  } catch (error) {
    console.error('Failed to save export history:', error)
  }
}

/**
 * Get export history
 */
export function getExportHistory(): Array<{
  timestamp: string
  format: string
  departmentName: string
  fiscalYear: string
}> {
  try {
    return JSON.parse(localStorage.getItem('debugExportHistory') || '[]')
  } catch {
    return []
  }
}

/**
 * Clear export history
 */
export function clearExportHistory(): void {
  localStorage.removeItem('debugExportHistory')
}

