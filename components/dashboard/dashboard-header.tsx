"use client"

import { useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface DashboardHeaderProps {
  toggleSidebar: () => void
}

export function DashboardHeader({ toggleSidebar }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, you would clear authentication state here
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button className="p-2 rounded-md md:hidden" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>

        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
