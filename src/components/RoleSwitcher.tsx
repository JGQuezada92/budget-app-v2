'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Shield, User } from 'lucide-react'
import { getUserRole, setUserRole, getUserDepartment, setUserDepartment, DEPARTMENTS } from '@/lib/auth-utils'

export function RoleSwitcher() {
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [department, setDepartment] = useState('')

  useEffect(() => {
    setRole(getUserRole())
    setDepartment(getUserDepartment())
  }, [])

  const handleRoleChange = (newRole: 'user' | 'admin') => {
    setUserRole(newRole, true) // Will refresh page
  }

  const handleDepartmentChange = (newDept: string) => {
    setUserDepartment(newDept, true) // Will refresh page
  }

  return (
    <div className="flex items-center gap-3">
      {/* Department Selector (only for regular users) */}
      {role === 'user' && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Department:</span>
          <Select value={department} onValueChange={handleDepartmentChange}>
            <SelectTrigger className="w-[180px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Role Switcher (for testing) */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">View as:</span>
        <Select value={role} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[120px] h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3" />
                User
              </div>
            </SelectItem>
            <SelectItem value="admin">
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3" />
                Admin
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <Badge 
          variant={role === 'admin' ? 'default' : 'secondary'}
          className={role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'}
        >
          {role === 'admin' ? (
            <>
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </>
          ) : (
            <>
              <User className="h-3 w-3 mr-1" />
              User
            </>
          )}
        </Badge>
      </div>
    </div>
  )
}


