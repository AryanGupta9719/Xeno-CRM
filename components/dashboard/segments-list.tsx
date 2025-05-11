"use client"

import { useState } from "react"
import { Edit, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SegmentsList() {
  const [segments] = useState([
    {
      id: "1",
      name: "High Value Customers",
      count: 3245,
      description: "Customers with lifetime value > $1000",
      createdAt: "22025-05-11",
    },
    {
      id: "2",
      name: "Recent Purchasers",
      count: 5621,
      description: "Purchased in the last 30 days",
      createdAt: "2025-05-11",
    },
    {
      id: "3",
      name: "At Risk",
      count: 1892,
      description: "No activity in 90+ days",
      createdAt: "2025-05-11",
    },
    {
      id: "4",
      name: "Newsletter Subscribers",
      count: 12458,
      description: "Opted in for weekly newsletter",
      createdAt: "2025-05-11",
    },
    {
      id: "5",
      name: "first time customers",
      count: 4327,
      description: "made their first purchase",
      createdAt: "2025-05-11",
    },
  ])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Audience
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {segments.map((segment) => (
              <tr key={segment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900 dark:text-white">{segment.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Users size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">{segment.count.toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {segment.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(segment.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit size={16} className="text-gray-500 dark:text-gray-400" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 size={16} className="text-red-500 dark:text-red-400" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
