"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { useUser } from "@/components/user-provider"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const { user } = useUser()
  const router = useRouter()

  if (!user) {
    router.push("/auth")
    return null
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-end">
        <ThemeToggle />
      </div>
    </header>
  )
}
