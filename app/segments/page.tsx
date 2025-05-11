"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SegmentsList } from "@/components/dashboard/segments-list"
import { UserFooter } from "@/components/dashboard/user-footer"
import { Sidebar } from "@/components/dashboard/sidebar"
import { RuleBuilder } from '@/app/components/rule-builder/rule-builder'
import { RuleGroup } from '@/app/types/rule-builder'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { v4 as uuidv4 } from 'uuid'

export default function SegmentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [rules, setRules] = useState<RuleGroup>({
    id: 'initial-id', // Stable initial ID
    operator: 'AND',
    rules: [],
    groups: []
  })

  // Generate UUID on client-side only
  useEffect(() => {
    setRules(prev => ({
      ...prev,
      id: uuidv4()
    }))
  }, [])

  const handleSave = () => {
    console.log('Saved rules:', rules)
    // Here you would typically save the rules to your backend
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Audience Segments</h1>
            <a
              href="/segments/create"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md transition-colors"
            >
              Create New Segment
            </a>
          </div>
          <SegmentsList />

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Define Segment Rules</h2>
            <p className="text-gray-600 mb-6">
              Create rules to segment your audience based on their behavior and characteristics.
              Use AND/OR logic to combine multiple conditions.
            </p>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Create Segment Rules</h2>
              <RuleBuilder value={rules} onChange={setRules} />
              
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave}>
                  Save Segment
                </Button>
              </div>
            </Card>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Current Rules (JSON):</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(rules, null, 2)}
              </pre>
            </div>
          </div>
        </main>

        <UserFooter />
      </div>
    </div>
  )
}
