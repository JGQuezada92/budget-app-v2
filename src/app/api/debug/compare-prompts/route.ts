import { NextRequest, NextResponse } from 'next/server'
import { buildAnalysisPrompt } from '@/lib/ai-analysis'

interface LineDifference {
  lineNumber: number
  dept1Line: string
  dept2Line: string
  type: 'added' | 'removed' | 'modified' | 'same'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Build analysis requests for both departments
    const request1 = {
      departmentName: body.dept1Data?.departmentName || 'Department 1',
      fiscalYear: body.dept1Data?.fiscalYear || '2027',
      historicalData: body.dept1Data?.historicalData || [],
      budgetData: body.dept1Data?.budgetData || [],
      aopFormData: body.dept1Data || {},
      supportingDocs: []
    }

    const request2 = {
      departmentName: body.dept2Data?.departmentName || 'Department 2',
      fiscalYear: body.dept2Data?.fiscalYear || '2027',
      historicalData: body.dept2Data?.historicalData || [],
      budgetData: body.dept2Data?.budgetData || [],
      aopFormData: body.dept2Data || {},
      supportingDocs: []
    }

    // Generate both prompts
    const prompt1 = buildAnalysisPrompt(request1)
    const prompt2 = buildAnalysisPrompt(request2)

    // Compare prompts line by line
    const lines1 = prompt1.split('\n')
    const lines2 = prompt2.split('\n')
    const maxLines = Math.max(lines1.length, lines2.length)

    const differences: LineDifference[] = []
    let dataPointDifferences = 0
    let instructionDifferences = 0

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || ''
      const line2 = lines2[i] || ''

      if (line1 !== line2) {
        let type: 'added' | 'removed' | 'modified' = 'modified'
        
        if (!line1 && line2) {
          type = 'added'
        } else if (line1 && !line2) {
          type = 'removed'
        }

        differences.push({
          lineNumber: i + 1,
          dept1Line: line1,
          dept2Line: line2,
          type
        })

        // Categorize difference type
        if (line1.includes('Department Name:') || line2.includes('Department Name:') ||
            line1.includes('Business Metrics') || line2.includes('Business Metrics') ||
            line1.includes('Initiative') || line2.includes('Initiative')) {
          dataPointDifferences++
        } else if (line1.includes('FOR ') || line2.includes('FOR ') ||
                   line1.includes('FOCUS') || line2.includes('FOCUS')) {
          instructionDifferences++
        }
      }
    }

    // Summary statistics
    const summary = {
      totalDifferences: differences.length,
      dataPointDifferences,
      instructionDifferences,
      dept1Name: request1.departmentName,
      dept2Name: request2.departmentName,
      similarityPercentage: Math.round(((maxLines - differences.length) / maxLines) * 100)
    }

    return NextResponse.json({
      prompt1,
      prompt2,
      differences: differences.slice(0, 100), // Limit to first 100 differences for performance
      summary
    })
  } catch (error) {
    console.error('Error comparing prompts:', error)
    return NextResponse.json(
      { error: 'Failed to compare prompts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

