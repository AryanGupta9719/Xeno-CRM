"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Settings, LogOut, ChevronUp, ChevronDown } from "lucide-react"
import { useUser } from "@/components/user-provider"
import { Button } from "@/components/ui/button"

export function UserFooter() {
  const { user, logout } = useUser()
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/auth")
  }

  return (
    <footer className="sticky bottom-0 w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300">
      <div className="container mx-auto">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div
              className={`transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-100 md:opacity-0 md:max-h-0 md:overflow-hidden"}`}
            >
              <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hidden md:flex"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Collapse user info" : "Expand user info"}
            >
              {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </Button>

            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Settings">
              <Settings size={18} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
