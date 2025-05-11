"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, Send, History, Bell, Bot, X, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  // Close sidebar when route changes on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [setOpen])

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Segments", href: "/segments", icon: Users },
    { name: "Create Campaign", href: "/campaigns/create", icon: Send },
    { name: "Campaign History", href: "/campaigns/history", icon: History },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "AI Assistant", href: "/ai-assistant", icon: Bot },
  ]

  const handleLogout = () => {
    // In a real app, you would clear authentication state here
    router.push("/")
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900 dark:text-white">
              Xeno CRM
            </Link>
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
