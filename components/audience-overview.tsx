"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function AudienceOverview() {
  const [segments] = useState([
    {
      id: "1",
      name: "High Value Customers",
      count: 3245,
      description: "Customers with lifetime value > $1000",
    },
    {
      id: "2",
      name: "Recent Purchasers",
      count: 5621,
      description: "Purchased in the last 30 days",
    },
    {
      id: "3",
      name: "At Risk",
      count: 1892,
      description: "No activity in 90+ days",
    },
    {
      id: "4",
      name: "Newsletter Subscribers",
      count: 12458,
      description: "Opted in for weekly newsletter",
    },
  ])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Audience Overview</h2>
        <Link href="/segments" className="text-sm text-sky-600 dark:text-sky-400 hover:underline flex items-center">
          View all <ChevronRight size={16} />
        </Link>
      </div>

      <div className="space-y-4">
        {segments.map((segment) => (
          <div key={segment.id} className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex justify-between">
              <p className="font-medium text-gray-900 dark:text-white">{segment.name}</p>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {segment.count.toLocaleString()} contacts
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{segment.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
