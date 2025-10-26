'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Props {
  formData: any
  setFormData: (data: any) => void
}

export default function IntroductionSection({ formData, setFormData }: Props) {
  return (
    <div className="space-y-8" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div>
        <h2 className="text-xl font-normal text-gray-900 mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>
          Division Information
        </h2>
        <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
          Provide details about your division structure, leadership, and resource planning.
        </p>
      </div>
      <div className="space-y-6">
        {/* Department Name - REQUIRED */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="departmentName" className="text-sm font-normal text-gray-700" style={{ fontFamily: 'Arial, sans-serif' }}>
              Department Name <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.departmentName || ''}
              onValueChange={(value) => setFormData({ ...formData, departmentName: value })}
            >
              <SelectTrigger className="mt-2 border-gray-300" style={{ fontFamily: 'Arial, sans-serif' }}>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Human Resources">Human Resources</SelectItem>
                <SelectItem value="Information Technology">Information Technology</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fiscal Year - REQUIRED */}
          <div>
            <Label htmlFor="fiscalYear" className="text-sm font-normal text-gray-700" style={{ fontFamily: 'Arial, sans-serif' }}>
              Fiscal Year <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.fiscalYear || ''}
              onValueChange={(value) => setFormData({ ...formData, fiscalYear: value })}
            >
              <SelectTrigger className="mt-2 border-gray-300" style={{ fontFamily: 'Arial, sans-serif' }}>
                <SelectValue placeholder="Select fiscal year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">FY25 (2025)</SelectItem>
                <SelectItem value="2026">FY26 (2026)</SelectItem>
                <SelectItem value="2027">FY27 (2027)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Department Head - REQUIRED */}
        <div>
          <Label htmlFor="departmentHead" className="text-sm font-normal text-gray-700" style={{ fontFamily: 'Arial, sans-serif' }}>
            Division Leader Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="departmentHead"
            placeholder="Enter division leader's full name"
            value={formData.departmentHead || ''}
            onChange={(e) => setFormData({ ...formData, departmentHead: e.target.value })}
            className="mt-2 border-gray-300"
            style={{ fontFamily: 'Arial, sans-serif' }}
          />
        </div>

        <div>
          <Label htmlFor="teamCount" className="text-sm font-normal text-gray-700" style={{ fontFamily: 'Arial, sans-serif' }}>
            Total Number of Teams / Groups
          </Label>
          <Input
            id="teamCount"
            type="number"
            placeholder="0"
            value={formData.teamCount || ''}
            onChange={(e) => setFormData({ ...formData, teamCount: e.target.value })}
            className="mt-2 border-gray-300"
            style={{ fontFamily: 'Arial, sans-serif' }}
          />
        </div>

        {/* Team Description - REQUIRED */}
        <div>
          <Label htmlFor="teamDescription" className="text-sm font-normal text-gray-700" style={{ fontFamily: 'Arial, sans-serif' }}>
            Team Details <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="teamDescription"
            placeholder="Describe each team/group within your division, their primary functions, and key responsibilities..."
            rows={5}
            value={formData.teamDescription || ''}
            onChange={(e) => setFormData({ ...formData, teamDescription: e.target.value })}
            className="mt-2 border-gray-300"
            style={{ fontFamily: 'Arial, sans-serif' }}
          />
          <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
            Provide an overview of each team&apos;s purpose and structure.
          </p>
        </div>

        {/* Responsibilities - REQUIRED */}
        <div>
          <Label htmlFor="responsibilities" className="text-sm font-normal text-gray-700" style={{ fontFamily: 'Arial, sans-serif' }}>
            Responsibilities and Scope <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="responsibilities"
            placeholder="Detail your team's core responsibilities, areas of ownership, and scope of operations..."
            rows={4}
            value={formData.responsibilities || ''}
            onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
            className="mt-2 border-gray-300"
            style={{ fontFamily: 'Arial, sans-serif' }}
          />
          <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
            Describe what your department is responsible for and accountable to deliver.
          </p>
        </div>

        {/* AI Strategy Overview - REQUIRED for FY27 */}
        <div>
          <Label htmlFor="aiStrategyOverview" className="text-sm font-normal text-gray-700" style={{ fontFamily: 'Arial, sans-serif' }}>
            AI Strategy Overview <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(FY27 Required)</span>
          </Label>
          <Textarea
            id="aiStrategyOverview"
            placeholder="Describe your department's AI adoption strategy: (1) AI tools/platforms planned (e.g., Claude, ChatGPT), (2) % of workflows targeted for AI augmentation, (3) expected productivity impact..."
            rows={5}
            value={formData.aiStrategyOverview || ''}
            onChange={(e) => setFormData({ ...formData, aiStrategyOverview: e.target.value })}
            className="mt-2 border-gray-300"
            style={{ fontFamily: 'Arial, sans-serif' }}
          />
          <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
            Recommended: 200-400 characters. Current: {formData.aiStrategyOverview?.length || 0} characters
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="headcountPrevYear" className="text-sm font-normal text-gray-700" style={{ fontFamily: 'Arial, sans-serif' }}>
              Headcount (Previous Year)
            </Label>
            <Input
              id="headcountPrevYear"
              type="number"
              placeholder="0"
              value={formData.headcountPrevYear || ''}
              onChange={(e) => setFormData({ ...formData, headcountPrevYear: e.target.value })}
              className="mt-2 border-gray-300"
              style={{ fontFamily: 'Arial, sans-serif' }}
            />
            <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
              Total FTE count for FY{formData.fiscalYear && parseInt(formData.fiscalYear) > 2025 ? parseInt(formData.fiscalYear) - 1 : '20XX'}
            </p>
          </div>

          <div>
            <Label htmlFor="headcountNextYear" className="text-sm font-normal text-gray-700" style={{ fontFamily: 'Arial, sans-serif' }}>
              Headcount (Next Year)
            </Label>
            <Input
              id="headcountNextYear"
              type="number"
              placeholder="0"
              value={formData.headcountNextYear || ''}
              onChange={(e) => setFormData({ ...formData, headcountNextYear: e.target.value })}
              className="mt-2 border-gray-300"
              style={{ fontFamily: 'Arial, sans-serif' }}
            />
            <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
              Projected FTE count for FY{formData.fiscalYear || '20XX'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="costsPrevYear" className="text-sm font-normal text-gray-700" style={{ fontFamily: 'Arial, sans-serif' }}>
              FY {formData.fiscalYear && parseInt(formData.fiscalYear) > 2025 ? parseInt(formData.fiscalYear) - 1 : '20XX'} Costs
            </Label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" style={{ fontFamily: 'Arial, sans-serif' }}>$</span>
              <Input
                id="costsPrevYear"
                type="number"
                placeholder="0"
                value={formData.costsPrevYear || ''}
                onChange={(e) => setFormData({ ...formData, costsPrevYear: e.target.value })}
                className="pl-7 border-gray-300"
                style={{ fontFamily: 'Arial, sans-serif' }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
              Total projected costs for previous fiscal year
            </p>
          </div>

          <div>
            <Label htmlFor="costsNextYear" className="text-sm font-normal text-gray-700" style={{ fontFamily: 'Arial, sans-serif' }}>
              FY {formData.fiscalYear || '20XX'} Costs
            </Label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" style={{ fontFamily: 'Arial, sans-serif' }}>$</span>
              <Input
                id="costsNextYear"
                type="number"
                placeholder="0"
                value={formData.costsNextYear || ''}
                onChange={(e) => setFormData({ ...formData, costsNextYear: e.target.value })}
                className="pl-7 border-gray-300"
                style={{ fontFamily: 'Arial, sans-serif' }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
              Total projected costs for current fiscal year
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

