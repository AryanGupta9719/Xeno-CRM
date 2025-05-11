"use client"

import { Users, Send, BarChart3, TrendingUp } from "lucide-react"

export function DashboardCards() {
  const cards = [
    {
      title: "Total Audience",
      value: "24,892",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Campaigns Sent",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: Send,
      color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Delivery Rate",
      value: "98.3%",
      change: "+1.1%",
      trend: "up",
      icon: BarChart3,
      color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    },
    {
      title: "Engagement",
      value: "42.7%",
      change: "+5.3%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-md"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{card.value}</h3>
              <p
                className={`text-sm mt-1 ${card.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {card.change} from last month
              </p>
            </div>
            <div className={`p-3 rounded-full ${card.color}`}>
              <card.icon size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
