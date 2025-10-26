'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Brain, 
  MessageSquare, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Main dashboard and submission management'
  },
  {
    name: 'AOP',
    href: '/submission',
    icon: FileText,
    description: 'Submit your Annual Operating Plan'
  },
  {
    name: 'AI Analyst',
    href: '/ai-analyst',
    icon: Brain,
    description: 'AI-powered analysis and insights'
  },
  {
    name: 'Review',
    href: '/review',
    icon: MessageSquare,
    description: 'Admin feedback and revisions'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Configure AI analyst framework'
  }
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href || pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between border-b border-gray-200 px-4 py-4 bg-white",
        collapsed ? "justify-center" : ""
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 border border-gray-200">
              <span className="text-sm font-normal text-gray-700">BP</span>
            </div>
            <div>
              <h2 className="text-sm font-normal text-gray-900">Budget Planning</h2>
              <p className="text-xs text-gray-600">FP&A Platform</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden h-8 w-8 lg:flex hover:bg-gray-100"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 bg-white">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded px-3 py-2.5 text-sm font-normal transition-all",
                "hover:bg-gray-50",
                active && "bg-gray-100 text-gray-900 border-l-2 border-teal-600",
                !active && "text-gray-700",
                collapsed ? "justify-center" : ""
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={cn("h-5 w-5 flex-shrink-0", active ? "text-teal-600" : "text-gray-600")} />
              {!collapsed && (
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  {!collapsed && (
                    <span className="text-xs font-normal text-gray-500">
                      {item.description}
                    </span>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className={cn(
        "border-t border-gray-200 p-4 bg-white",
        collapsed ? "flex justify-center" : ""
      )}>
        {!collapsed ? (
          <div className="text-xs text-gray-600">
            <p className="font-normal">FY27 Budget Platform</p>
            <p className="mt-1">Powered by Claude AI</p>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
            <span className="text-xs font-normal text-gray-700">BP</span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 h-full w-72 bg-white lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed left-0 top-0 z-30 h-full bg-white border-r border-gray-200 transition-all duration-300",
          collapsed ? "w-16" : "w-72"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}

