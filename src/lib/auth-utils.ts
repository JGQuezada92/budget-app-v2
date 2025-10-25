/**
 * Authentication and Role Management Utilities
 * TEMPORARY SOLUTION using localStorage for testing
 * 
 * TODO: Replace with real authentication (Supabase Auth) in production
 */

export type UserRole = 'user' | 'admin'

export const DEPARTMENTS = [
  'Finance',
  'Human Resources',
  'Information Technology',
  'Marketing',
  'Operations',
  'Sales'
] as const

/**
 * Get current user role from localStorage
 * Defaults to 'user' if not set
 */
export function getUserRole(): UserRole {
  if (typeof window === 'undefined') return 'user'
  
  const role = localStorage.getItem('userRole')
  return (role === 'admin' || role === 'user') ? role : 'user'
}

/**
 * Set user role and optionally refresh page
 */
export function setUserRole(role: UserRole, refresh: boolean = true): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('userRole', role)
  console.log(`User role set to: ${role}`)
  
  if (refresh) {
    window.location.reload()
  }
}

/**
 * Get current user's department from localStorage
 * Defaults to first department if not set
 */
export function getUserDepartment(): string {
  if (typeof window === 'undefined') return DEPARTMENTS[0]
  
  const dept = localStorage.getItem('userDepartment')
  return dept || DEPARTMENTS[0]
}

/**
 * Set user department and optionally refresh page
 */
export function setUserDepartment(department: string, refresh: boolean = true): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('userDepartment', department)
  console.log(`User department set to: ${department}`)
  
  if (refresh) {
    window.location.reload()
  }
}

/**
 * Check if current user is admin
 */
export function isAdmin(): boolean {
  return getUserRole() === 'admin'
}

/**
 * Check if current user is regular user
 */
export function isUser(): boolean {
  return getUserRole() === 'user'
}

/**
 * Initialize user with default values if not set
 */
export function initializeUser(): void {
  if (typeof window === 'undefined') return
  
  if (!localStorage.getItem('userRole')) {
    localStorage.setItem('userRole', 'user')
  }
  
  if (!localStorage.getItem('userDepartment')) {
    localStorage.setItem('userDepartment', DEPARTMENTS[0])
  }
}

/**
 * Get user info object
 */
export function getUserInfo() {
  return {
    role: getUserRole(),
    department: getUserDepartment(),
    isAdmin: isAdmin()
  }
}


