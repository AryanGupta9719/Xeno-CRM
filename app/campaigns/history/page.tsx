"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CampaignHistory } from "@/components/dashboard/campaign-history"
import { UserFooter } from "@/components/dashboard/user-footer"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function CampaignHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Campaign History</h1>
          </div>
          <CampaignHistory />
        </main>

        <UserFooter />
      </div>
    </div>
  )
}
