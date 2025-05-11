"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, RefreshCw, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

type Campaign = {
  id: string
  name: string
  date: string
  sent: number
  delivered: number
  failed: number
  segment: string
  expanded?: boolean
}

type DeliveryLog = {
  id: string
  recipient: string
  status: "Delivered" | "Failed"
  timestamp: string
  reason?: string
}

export function CampaignHistory() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Summer Sale Announcement",
      date: "2023-05-01",
      sent: 12500,
      delivered: 12375,
      failed: 125,
      segment: "Newsletter Subscribers",
      expanded: false,
    },
    {
      id: "2",
      name: "New Product Launch",
      date: "2023-04-15",
      sent: 8750,
      delivered: 8645,
      failed: 105,
      segment: "High Value Customers",
      expanded: false,
    },
    {
      id: "3",
      name: "Customer Feedback Survey",
      date: "2023-04-01",
      sent: 5000,
      delivered: 4875,
      failed: 125,
      segment: "Recent Purchasers",
      expanded: false,
    },
    {
      id: "4",
      name: "Loyalty Program Update",
      date: "2023-03-20",
      sent: 15000,
      delivered: 14850,
      failed: 150,
      segment: "All Customers",
      expanded: false,
    },
    {
      id: "5",
      name: "Flash Sale Weekend",
      date: "2023-03-10",
      sent: 10000,
      delivered: 9900,
      failed: 100,
      segment: "Recent Purchasers",
      expanded: false,
    },
  ])

  const [logs, setLogs] = useState<Record<string, DeliveryLog[]>>({
    "1": [
      { id: "1-1", recipient: "user1@example.com", status: "Delivered", timestamp: "2023-05-01T10:15:00Z" },
      { id: "1-2", recipient: "user2@example.com", status: "Delivered", timestamp: "2023-05-01T10:15:05Z" },
      {
        id: "1-3",
        recipient: "user3@example.com",
        status: "Failed",
        timestamp: "2023-05-01T10:15:10Z",
        reason: "Invalid email address",
      },
      { id: "1-4", recipient: "user4@example.com", status: "Delivered", timestamp: "2023-05-01T10:15:15Z" },
    ],
    "2": [
      { id: "2-1", recipient: "customer1@example.com", status: "Delivered", timestamp: "2023-04-15T14:30:00Z" },
      {
        id: "2-2",
        recipient: "customer2@example.com",
        status: "Failed",
        timestamp: "2023-04-15T14:30:05Z",
        reason: "Mailbox full",
      },
      { id: "2-3", recipient: "customer3@example.com", status: "Delivered", timestamp: "2023-04-15T14:30:10Z" },
    ],
  })

  const toggleExpand = (id: string) => {
    setCampaigns(
      campaigns.map((campaign) => (campaign.id === id ? { ...campaign, expanded: !campaign.expanded } : campaign)),
    )
  }

  const resendFailed = (campaignId: string) => {
    // Simulate resending failed messages
    alert(`Resending failed messages for campaign ${campaignId}`)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"></th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Campaign Name
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Segment
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sent
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Delivered
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Failed
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Delivery Rate
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {campaigns.map((campaign) => (
              <>
                <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button variant="ghost" size="icon" onClick={() => toggleExpand(campaign.id)} className="h-8 w-8">
                      {campaign.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">{campaign.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(campaign.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{campaign.segment}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{campaign.sent.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600 dark:text-green-400">
                      {campaign.delivered.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-red-600 dark:text-red-400">{campaign.failed.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {((campaign.delivered / campaign.sent) * 100).toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center text-gray-700 dark:text-gray-300"
                        onClick={() => toggleExpand(campaign.id)}
                      >
                        <Eye size={14} className="mr-1" />
                        View Log
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center text-sky-600 dark:text-sky-400"
                        onClick={() => resendFailed(campaign.id)}
                      >
                        <RefreshCw size={14} className="mr-1" />
                        Resend Failed
                      </Button>
                    </div>
                  </td>
                </tr>
                {campaign.expanded && (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30">
                      <div className="text-sm">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Delivery Log</h4>
                        <div className="max-h-64 overflow-y-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 text-left">
                                  Recipient
                                </th>
                                <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 text-left">
                                  Status
                                </th>
                                <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 text-left">
                                  Timestamp
                                </th>
                                <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 text-left">
                                  Details
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {logs[campaign.id] ? (
                                logs[campaign.id].map((log) => (
                                  <tr key={log.id}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                      {log.recipient}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          log.status === "Delivered"
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                        }`}
                                      >
                                        {log.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                      {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                      {log.reason || "-"}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan={4}
                                    className="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400"
                                  >
                                    No logs available for this campaign
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
