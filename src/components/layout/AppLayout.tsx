'use client'

import { Sidebar } from './Sidebar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 lg:pl-72 transition-all duration-300">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  )
}

