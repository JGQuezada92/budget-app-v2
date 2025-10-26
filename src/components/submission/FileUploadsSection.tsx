'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import Papa from 'papaparse'

interface Props {
  formData: any
  setFormData: (data: any) => void
}

export default function FileUploadsSection({ formData, setFormData }: Props) {
  const [historicalFile, setHistoricalFile] = useState<File | null>(null)
  const [budgetFile, setBudgetFile] = useState<File | null>(null)
  const [supportingDocs, setSupportingDocs] = useState<File[]>([])

  const onHistoricalDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setHistoricalFile(acceptedFiles[0])
      // Parse CSV for preview
      Papa.parse(acceptedFiles[0], {
        header: true,
        complete: (results) => {
          console.log('Historical data parsed:', results.data)
          setFormData({ ...formData, historicalData: results.data })
        }
      })
    }
  }, [formData, setFormData])

  const onBudgetDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setBudgetFile(acceptedFiles[0])
      Papa.parse(acceptedFiles[0], {
        header: true,
        complete: (results) => {
          console.log('Budget data parsed:', results.data)
          setFormData({ ...formData, budgetData: results.data })
        }
      })
    }
  }, [formData, setFormData])

  const onSupportingDrop = useCallback((acceptedFiles: File[]) => {
    setSupportingDocs([...supportingDocs, ...acceptedFiles])
    setFormData({ ...formData, supportingDocuments: [...supportingDocs, ...acceptedFiles] })
  }, [supportingDocs, formData, setFormData])

  const historicalDropzone = useDropzone({
    onDrop: onHistoricalDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  })

  const budgetDropzone = useDropzone({
    onDrop: onBudgetDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  })

  const supportingDropzone = useDropzone({
    onDrop: onSupportingDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: true
  })

  return (
    <div className="space-y-6">
      {/* Historical Financial Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Historical Financial Data
          </CardTitle>
          <CardDescription>
            Upload CSV/Excel with actual financial data from the most recent fiscal year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...historicalDropzone.getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              historicalDropzone.isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input {...historicalDropzone.getInputProps()} />
            {historicalFile ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{historicalFile.name}</span>
              </div>
            ) : (
              <div>
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">Drag & drop CSV/Excel file here, or click to browse</p>
                <p className="text-xs text-gray-500 mt-2">Required columns: Month, Account Code, Account Name, Amount, Category</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Budget Financial Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-600" />
            Budget Financial Data
          </CardTitle>
          <CardDescription>
            Upload CSV/Excel with budget data for comparison against historical
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...budgetDropzone.getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              budgetDropzone.isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
            }`}
          >
            <input {...budgetDropzone.getInputProps()} />
            {budgetFile ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{budgetFile.name}</span>
              </div>
            ) : (
              <div>
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">Drag & drop CSV/Excel file here, or click to browse</p>
                <p className="text-xs text-gray-500 mt-2">Required columns: Month, Account Code, Account Name, Budget Amount, Category</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Supporting Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-purple-600" />
            Supporting Documents & Context
          </CardTitle>
          <CardDescription>
            Upload contracts, presentations, or other supporting materials for AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...supportingDropzone.getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              supportingDropzone.isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
            }`}
          >
            <input {...supportingDropzone.getInputProps()} />
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">Drag & drop files here, or click to browse</p>
            <p className="text-xs text-gray-500 mt-2">Accepts: PDF, Word, Excel, Images (multiple files allowed)</p>
          </div>

          {supportingDocs.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Uploaded Files:</h4>
              {supportingDocs.map((doc, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {doc.name}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

