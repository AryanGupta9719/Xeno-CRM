"use client"

import { useState, useEffect } from "react"
import { Calendar, BarChart3, Users, Sparkles, Tag, Clock, MessageSquare, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Insight = {
  id: string
  title: string
  icon: any
  content: string
  color: string
}

type Suggestion = {
  id: string
  title: string
  icon: any
  content: string
  action: string
  color: string
  actionHandler: () => void
}

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIAssistant() {
  const [activeTab, setActiveTab] = useState<"insights" | "suggestions" | "chat">("insights")
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState<Insight[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [userInput, setUserInput] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)
  const router = useRouter()

  // Fetch initial data
  useEffect(() => {
    fetchInsights()
    fetchSuggestions()
  }, [])

  const fetchInsights = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/ai/insights')
      if (!response.ok) throw new Error('Failed to fetch insights')
      const data = await response.json()
      setInsights(data.insights)
    } catch (error) {
      console.error('Error fetching insights:', error)
      toast.error('Failed to load insights')
    } finally {
      setLoading(false)
    }
  }

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('/api/ai/suggestions')
      if (!response.ok) throw new Error('Failed to fetch suggestions')
      const data = await response.json()
      setSuggestions(data.suggestions.map((s: any) => ({
        ...s,
        actionHandler: () => handleSuggestionAction(s)
      })))
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      toast.error('Failed to load suggestions')
    }
  }

  const handleSuggestionAction = (suggestion: any) => {
    switch (suggestion.action) {
      case "Schedule Campaign":
        router.push('/campaigns/create?schedule=true')
        break
      case "Create Campaign":
        router.push('/campaigns/create?type=reengagement')
        break
      case "Create Segment":
        router.push('/segments/create')
        break
      default:
        toast.info('Action not implemented yet')
    }
  }

  const handleSendMessage = async () => {
    if (!userInput.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, newMessage])
    setUserInput("")
    setSendingMessage(true)

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      }

      setChatMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to get response from AI')
    } finally {
      setSendingMessage(false)
    }
  }

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
          <button
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "chat"
                ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("chat")}
          >
            Chat
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
          </div>
        ) : (
        <div className="space-y-4">
            {activeTab === "insights" && insights.map((insight) => (
                <div
                  key={insight.id}
                  className="flex p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className={`p-3 rounded-full mr-4 ${insight.color}`}>
                  {insight.icon === "BarChart3" && <BarChart3 className="h-5 w-5" />}
                  {insight.icon === "Tag" && <Tag className="h-5 w-5" />}
                  {insight.icon === "Users" && <Users className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">{insight.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{insight.content}</p>
                  </div>
                </div>
            ))}

            {activeTab === "suggestions" && suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="flex p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className={`p-3 rounded-full mr-4 ${suggestion.color}`}>
                  {suggestion.icon === "Clock" && <Clock className="h-5 w-5" />}
                  {suggestion.icon === "MessageSquare" && <MessageSquare className="h-5 w-5" />}
                  {suggestion.icon === "Users" && <Users className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">{suggestion.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{suggestion.content}</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={suggestion.actionHandler}
                  >
                      {suggestion.action}
                    </Button>
                  </div>
                </div>
              ))}

            {activeTab === "chat" && (
              <div className="space-y-4">
                <div className="h-[400px] overflow-y-auto space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-sky-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask me anything about your campaigns..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={sendingMessage}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sendingMessage || !userInput.trim()}
                  >
                    {sendingMessage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
        </div>
        )}
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
          <Button onClick={() => router.push('/campaigns/create?schedule=true')}>
            Schedule Next Campaign
          </Button>
        </div>
      </div>
    </div>
  )
}
