"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function RecentCampaigns() {
  const [campaigns] = useState([
    {
      id: "1",
      name: "Summer Sale Announcement",
      date: "2023-05-01",
      status: "Delivered",
      deliveryRate: "99.2%",
    },
    {
      id: "2",
      name: "New Product Launch",
      date: "2023-04-15",
      status: "Delivered",
      deliveryRate: "98.7%",
    },
    {
      id: "3",
      name: "Customer Feedback Survey",
      date: "2023-04-01",
      status: "Delivered",
      deliveryRate: "97.5%",
    },
    {
      id: "4",
      name: "Loyalty Program Update",
      date: "2023-03-20",
      status: "Delivered",
      deliveryRate: "99.1%",
    },
  ])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Campaigns</h2>
        <Link
          href="/campaigns/history"
          className="text-sm text-sky-600 dark:text-sky-400 hover:underline flex items-center"
        >
          View all <ChevronRight size={16} />
        </Link>
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{campaign.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(campaign.date).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                {campaign.status}
              </span>
              <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">{campaign.deliveryRate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
