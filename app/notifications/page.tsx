"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { NotificationsList } from "@/components/dashboard/notifications-list"
import { UserFooter } from "@/components/dashboard/user-footer"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Notifications</h1>
          <NotificationsList />
        </main>

        <UserFooter />
      </div>
    </div>
  )
}
