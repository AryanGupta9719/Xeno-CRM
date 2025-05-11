"use client"

import { useState } from "react"
import { Calendar, BarChart3, Users, Sparkles, Tag, Clock, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AIAssistant() {
  const [activeTab, setActiveTab] = useState<"insights" | "suggestions">("insights")

  const insights = [
    {
      id: "1",
      title: "Campaign Performance",
      icon: BarChart3,
      content:
        "Your last campaign reached 1,284 recipients with a 98.3% delivery rate. Open rate was 42.7%, which is 15% higher than industry average.",
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
    {
      id: "2",
      title: "Audience Tagging",
      icon: Tag,
      content:
        'Based on engagement patterns, we\'ve auto-tagged 342 contacts as "High Intent" and 156 as "Win-back Opportunity".',
      color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    },
    {
      id: "3",
      title: "Lookalike Audience",
      icon: Users,
      content:
        'We\'ve identified a potential lookalike audience of 2,500 contacts based on your "High Value Customers" segment.',
      color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    },
  ]

  const suggestions = [
    {
      id: "1",
      title: "Optimal Send Time",
      icon: Clock,
      content:
        "Based on past engagement, Tuesday at 10:00 AM is the optimal time to send your next campaign to maximize open rates.",
      action: "Schedule Campaign",
      color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    },
    {
      id: "2",
      title: "Re-engagement Campaign",
      icon: MessageSquare,
      content:
        "We've detected 876 inactive subscribers. Consider sending a re-engagement campaign with a special offer.",
      action: "Create Campaign",
      color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    },
    {
      id: "3",
      title: "Segment Opportunity",
      icon: Users,
      content:
        "Create a new segment for customers who purchased in the last 30 days but haven't subscribed to your newsletter.",
      action: "Create Segment",
      color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-sky-100 dark:bg-sky-900/30 rounded-full mr-4">
            <Sparkles className="h-6 w-6 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Assistant</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Personalized insights and recommendations for your campaigns
            </p>
          </div>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "insights"
                ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("insights")}
          >
            Insights
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "suggestions"
                ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("suggestions")}
          >
            Suggestions
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === "insights"
            ? insights.map((insight) => (
                <div
                  key={insight.id}
                  className="flex p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className={`p-3 rounded-full mr-4 ${insight.color}`}>
                    <insight.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">{insight.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{insight.content}</p>
                  </div>
                </div>
              ))
            : suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="flex p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className={`p-3 rounded-full mr-4 ${suggestion.color}`}>
                    <suggestion.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">{suggestion.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{suggestion.content}</p>
                    <Button size="sm" variant="outline">
                      {suggestion.action}
                    </Button>
                  </div>
                </div>
              ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mr-4">
            <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Smart Scheduling</h2>
            <p className="text-gray-500 dark:text-gray-400">AI-powered recommendations for optimal campaign timing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Best Day</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">Tuesday</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Based on historical open rates</p>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Best Time</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">10:00 AM</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Highest engagement window</p>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Frequency</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">Weekly</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Optimal sending frequency</p>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button>Schedule Next Campaign</Button>
        </div>
      </div>
    </div>
  )
}
