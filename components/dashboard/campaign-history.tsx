"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, RefreshCw, Eye, Filter, ArrowUpDown, Send, Loader2, Tag, List, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import React from "react"
import { CampaignDetailsModal } from "./campaign-details-modal"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { DeliveryLogsModal } from "./delivery-logs-modal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type Campaign = {
  _id: string
  name: string
  createdAt: string
  segment: string
  status: string
  messageVariants: Array<{
    content: string
    type: string
  }>
  audienceRules: {
    segment: string
    conditions: any[]
  }
  totalAudienceCount?: number
  deliveryStats?: {
    sent: number
    failed: number
  }
  tag?: string
  objective?: string
  description?: string
}

type SortField = 'createdAt' | 'name' | 'totalAudienceCount' | 'deliveryStats.sent'
type SortOrder = 'asc' | 'desc'

// Update tag colors mapping
const tagColors: Record<string, { bg: string; text: string }> = {
  'Win-back': {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-300'
  },
  'High-Value Customers': {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300'
  },
  'New Customers': {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300'
  },
  'Engagement': {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300'
  },
  'Loyalty': {
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    text: 'text-pink-700 dark:text-pink-300'
  },
  'Seasonal': {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-300'
  },
  'Feedback': {
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    text: 'text-indigo-700 dark:text-indigo-300'
  },
  'Cart Abandonment': {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300'
  },
  'General': {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300'
  }
}

// Helper function to generate natural language summary
const generateCampaignSummary = (campaign: any) => {
  const total = campaign.totalAudienceCount || 0
  const sent = campaign.deliveryStats?.sent || 0
  const failed = campaign.deliveryStats?.failed || 0
  const successRate = total > 0 ? Math.round((sent / total) * 100) : 0
  const failureRate = total > 0 ? Math.round((failed / total) * 100) : 0

  // Format numbers with commas
  const formatNumber = (num: number) => num.toLocaleString('en-IN')

  // Generate summary based on campaign status
  if (campaign.status === 'completed') {
    if (failed === 0) {
      return `Perfect delivery! All ${formatNumber(total)} messages were successfully sent.`
    }
    
    if (successRate >= 90) {
      return `Great performance! ${formatNumber(sent)} out of ${formatNumber(total)} messages delivered successfully (${successRate}% success rate). Only ${formatNumber(failed)} messages failed.`
    }
    
    if (successRate >= 70) {
      return `Good delivery rate: ${formatNumber(sent)} messages sent successfully out of ${formatNumber(total)} (${successRate}% success rate). ${formatNumber(failed)} messages failed.`
    }
    
    return `Campaign completed with ${formatNumber(sent)} successful deliveries out of ${formatNumber(total)} attempts (${successRate}% success rate). ${formatNumber(failed)} messages failed (${failureRate}% failure rate).`
  }

  if (campaign.status === 'sending') {
    const progress = total > 0 ? Math.round((sent / total) * 100) : 0
    return `Campaign in progress: ${formatNumber(sent)} out of ${formatNumber(total)} messages sent (${progress}% complete).`
  }

  if (campaign.status === 'scheduled') {
    return `Campaign scheduled to reach ${formatNumber(total)} users.`
  }

  if (campaign.status === 'draft') {
    return `Draft campaign targeting ${formatNumber(total)} users.`
  }

  if (campaign.status === 'failed') {
    return `Campaign failed to send. ${formatNumber(failed)} out of ${formatNumber(total)} messages failed to deliver.`
  }

  return `Campaign status: ${campaign.status}`
}

// Add preview types
type MessagePreview = {
  userId: string
  name: string
  message: string
}

// Add dummy user data
const dummyUsers = [
  { id: 'user_1', name: 'Aryan' },
  { id: 'user_2', name: 'Raj' },
  { id: 'user_3', name: 'Priya' },
  { id: 'user_4', name: 'Vikram' },
  { id: 'user_5', name: 'Ananya' }
]

// Add message templates based on campaign tag
const messageTemplates: Record<string, string[]> = {
  'Win-back': [
    "We've missed you! Here's 20% off your next purchase.",
    "Come back to us! Enjoy 25% off on your next order.",
    "We want you back! Here's a special 30% discount."
  ],
  'High-Value Customers': [
    "Exclusive offer: 40% off on premium products!",
    "VIP access: Early sale with 35% discount.",
    "Special treat: 50% off on your favorite items."
  ],
  'New Customers': [
    "Welcome! Get 15% off on your first purchase.",
    "New here? Enjoy 20% off on your first order.",
    "First-time buyer? Here's 25% off for you."
  ],
  'Engagement': [
    "Check out our new collection! 10% off for you.",
    "New arrivals alert! Get 15% off today.",
    "Latest trends are here! Enjoy 20% off."
  ],
  'Loyalty': [
    "Thank you for being loyal! Here's 25% off.",
    "Loyalty reward: 30% off on your next purchase.",
    "Special thanks: 35% off for our loyal customers."
  ],
  'Seasonal': [
    "Season's greetings! Enjoy 20% off.",
    "Holiday special: 25% off on all items.",
    "Festive offer: 30% off on selected products."
  ],
  'Feedback': [
    "Help us improve! Get 15% off for your feedback.",
    "Share your thoughts! Earn 20% off.",
    "Your opinion matters! Get 25% off for feedback."
  ],
  'Cart Abandonment': [
    "Complete your purchase! 10% off waiting for you.",
    "Your cart misses you! Get 15% off.",
    "Don't forget your items! 20% off on checkout."
  ],
  'General': [
    "Special offer: 15% off on all products.",
    "Limited time: 20% off on everything.",
    "Flash sale: 25% off on selected items."
  ]
}

export function CampaignHistory() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCampaigns, setExpandedCampaigns] = useState<Record<string, boolean>>({})
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [sendingCampaignId, setSendingCampaignId] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [selectedCampaignForSend, setSelectedCampaignForSend] = useState<Campaign | null>(null)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [tagFilter, setTagFilter] = useState<string>("all")
  const [sendingProgress, setSendingProgress] = useState<Record<string, { sent: number; failed: number; total: number }>>({})
  const [selectedLogsCampaignId, setSelectedLogsCampaignId] = useState<string | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [selectedCampaignForPreview, setSelectedCampaignForPreview] = useState<Campaign | null>(null)
  const [messagePreviews, setMessagePreviews] = useState<MessagePreview[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/campaigns')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch campaigns')
      }
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch campaigns')
      }
      setCampaigns(data.data.campaigns || [])
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to fetch campaigns')
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedCampaigns(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const filteredCampaigns = campaigns
    .filter(campaign => {
      const statusMatch = statusFilter === "all" || campaign.status === statusFilter
      const dateMatch = (!dateRange.start || new Date(campaign.createdAt) >= new Date(dateRange.start)) &&
                       (!dateRange.end || new Date(campaign.createdAt) <= new Date(dateRange.end))
      const tagMatch = tagFilter === "all" || campaign.tag === tagFilter
      return statusMatch && dateMatch && tagMatch
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'createdAt':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'totalAudienceCount':
          comparison = (a.totalAudienceCount || 0) - (b.totalAudienceCount || 0)
          break
        case 'deliveryStats.sent':
          comparison = (a.deliveryStats?.sent || 0) - (b.deliveryStats?.sent || 0)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage)
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Add preview generation function
  const generateMessagePreviews = (campaign: Campaign) => {
    const templates = messageTemplates[campaign.tag || 'General']
    return dummyUsers.map(user => {
      const template = templates[Math.floor(Math.random() * templates.length)]
      const message = template.replace('{{name}}', user.name)
      return {
        userId: user.id,
        name: user.name,
        message
      }
    })
  }

  // Update handleSendCampaign to show preview first
  const handleSendCampaign = async (campaignId: string) => {
    const campaign = campaigns.find(c => c._id === campaignId)
    if (!campaign) return

    setSelectedCampaignForPreview(campaign)
    setMessagePreviews(generateMessagePreviews(campaign))
    setShowPreviewModal(true)
  }

  // Add actual send function
  const handleConfirmSend = async () => {
    if (!selectedCampaignForPreview) return

    try {
      setSendingCampaignId(selectedCampaignForPreview._id)
      setShowPreviewModal(false)
      
      // First update status to sending
      const statusResponse = await fetch(`/api/campaigns/${selectedCampaignForPreview._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'sending' }),
      })

      if (!statusResponse.ok) {
        throw new Error('Failed to update campaign status')
      }

      // Start sending the campaign
      const response = await fetch(`/api/campaigns/${selectedCampaignForPreview._id}/send`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send campaign')
      }

      const result = await response.json()
      
      // Update local state immediately for better UX
      setCampaigns(prevCampaigns => 
        prevCampaigns.map(campaign => 
          campaign._id === selectedCampaignForPreview._id 
            ? {
                ...campaign,
                status: 'sending',
                totalAudienceCount: result.data.totalAudienceCount,
                deliveryStats: result.data.deliveryStats
              }
            : campaign
        )
      )

      // Initialize progress tracking
      setSendingProgress(prev => ({
        ...prev,
        [selectedCampaignForPreview._id]: {
          sent: 0,
          failed: 0,
          total: result.data.totalAudienceCount
        }
      }))

      // Start polling for progress updates
      const pollInterval = setInterval(async () => {
        try {
          const progressResponse = await fetch(`/api/campaigns/${selectedCampaignForPreview._id}`)
          if (!progressResponse.ok) return

          const progressData = await progressResponse.json()
          if (!progressData.success) return

          const campaign = progressData.data
          
          // Update progress
          setSendingProgress(prev => ({
            ...prev,
            [selectedCampaignForPreview._id]: {
              sent: campaign.deliveryStats?.sent || 0,
              failed: campaign.deliveryStats?.failed || 0,
              total: campaign.totalAudienceCount || 0
            }
          }))

          // Check if campaign is complete
          if (campaign.deliveryStats?.sent + campaign.deliveryStats?.failed >= campaign.totalAudienceCount) {
            clearInterval(pollInterval)
            
            // Update status to completed
            const completeResponse = await fetch(`/api/campaigns/${selectedCampaignForPreview._id}/status`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ status: 'completed' }),
            })

            if (completeResponse.ok) {
              // Update campaign status in local state
              setCampaigns(prevCampaigns => 
                prevCampaigns.map(c => 
                  c._id === selectedCampaignForPreview._id 
                    ? {
                        ...c,
                        status: 'completed',
                        deliveryStats: campaign.deliveryStats
                      }
                    : c
                )
              )
            }
          }

          // Update campaign status
          setCampaigns(prevCampaigns => 
            prevCampaigns.map(c => 
              c._id === selectedCampaignForPreview._id 
                ? {
                    ...c,
                    status: campaign.status,
                    deliveryStats: campaign.deliveryStats
                  }
                : c
            )
          )
        } catch (error) {
          console.error('Error polling campaign progress:', error)
          clearInterval(pollInterval)
        }
      }, 2000) // Poll every 2 seconds

      // Clean up interval after 5 minutes (safety timeout)
      setTimeout(() => {
        clearInterval(pollInterval)
      }, 5 * 60 * 1000)

    } catch (error) {
      console.error('Error sending campaign:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to send campaign')
    } finally {
      setSendingCampaignId(null)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tags</option>
            <option value="Win-back">Win-back</option>
            <option value="High-Value Customers">High-Value Customers</option>
            <option value="New Customers">New Customers</option>
            <option value="Engagement">Engagement</option>
            <option value="Loyalty">Loyalty</option>
            <option value="Seasonal">Seasonal</option>
            <option value="Feedback">Feedback</option>
            <option value="Cart Abandonment">Cart Abandonment</option>
            <option value="General">General</option>
          </select>

          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchCampaigns}
          className="flex items-center"
        >
          <RefreshCw size={14} className="mr-2" />
          Refresh
        </Button>
      </div>

    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"></th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <span>Campaign Name</span>
                    <ArrowUpDown size={14} />
                  </button>
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <span>Date</span>
                    <ArrowUpDown size={14} />
                  </button>
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('totalAudienceCount')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <span>Audience Size</span>
                    <ArrowUpDown size={14} />
                  </button>
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('deliveryStats.sent')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <span>Delivery Stats</span>
                    <ArrowUpDown size={14} />
                  </button>
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedCampaigns.map((campaign) => (
                <React.Fragment key={campaign._id}>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                      <Button variant="ghost" size="icon" onClick={() => toggleExpand(campaign._id)} className="h-8 w-8">
                        {expandedCampaigns[campaign._id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{campaign.name || 'Unnamed Campaign'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        campaign.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {(campaign.totalAudienceCount || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <span className="text-green-600 dark:text-green-400">
                          {campaign.deliveryStats?.sent || 0} sent
                        </span>
                        <span className="mx-2 text-gray-400">/</span>
                        <span className="text-red-600 dark:text-red-400">
                          {campaign.deliveryStats?.failed || 0} failed
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                        {campaign.status === 'draft' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendCampaign(campaign._id)}
                            disabled={sendingCampaignId === campaign._id}
                            className="flex items-center text-blue-600 dark:text-blue-400"
                          >
                            {sendingCampaignId === campaign._id ? (
                              <Loader2 size={14} className="mr-1 animate-spin" />
                            ) : (
                              <Send size={14} className="mr-1" />
                            )}
                            {sendingCampaignId === campaign._id ? 'Sending...' : 'Send Campaign'}
                          </Button>
                        )}
                        {(campaign.status === 'completed' || campaign.status === 'failed') && (
                      <Button
                            variant="outline"
                        size="sm"
                            onClick={() => setSelectedLogsCampaignId(campaign._id)}
                        className="flex items-center text-gray-700 dark:text-gray-300"
                      >
                            <List size={14} className="mr-1" />
                            View Logs
                      </Button>
                        )}
                      <Button
                        variant="ghost"
                        size="sm"
                          onClick={() => setSelectedCampaignId(campaign._id)}
                          className="flex items-center text-gray-700 dark:text-gray-300"
                      >
                          <Eye size={14} className="mr-1" />
                          View Details
                      </Button>
                    </div>
                  </td>
                </tr>
                  {expandedCampaigns[campaign._id] && (
                  <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30">
                      <div className="text-sm">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Message Variants</h4>
                          <div className="space-y-2">
                            {campaign.messageVariants?.map((variant, index) => (
                              <div key={`${campaign._id}-variant-${index}`} className="bg-white dark:bg-gray-800 rounded-lg p-3">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                  Variant {index + 1} - {variant.type}
                                </div>
                                <div className="text-sm text-gray-900 dark:text-white">{variant.content}</div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Add progress bar for sending campaigns */}
                          {campaign.status === 'sending' && sendingProgress[campaign._id] && (
                            <div className="mt-4">
                              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                <span>Delivery Progress</span>
                                <span>
                                  {sendingProgress[campaign._id].sent + sendingProgress[campaign._id].failed} / {sendingProgress[campaign._id].total}
                                      </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${((sendingProgress[campaign._id].sent + sendingProgress[campaign._id].failed) / sendingProgress[campaign._id].total) * 100}%`
                                  }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span>{sendingProgress[campaign._id].sent} sent</span>
                                <span>{sendingProgress[campaign._id].failed} failed</span>
                              </div>
                        </div>
                          )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <AlertDialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Message Preview</AlertDialogTitle>
            <AlertDialogDescription>
              Preview how your campaign messages will look to recipients
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedCampaignForPreview && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Campaign Details</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Name:</span> {selectedCampaignForPreview.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Tag:</span> {selectedCampaignForPreview.tag}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Audience Size:</span> {selectedCampaignForPreview.totalAudienceCount?.toLocaleString() || 0} users
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Message Previews</h4>
                <div className="space-y-3">
                  {messagePreviews.map((preview, index) => (
                    <div key={preview.userId} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {preview.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {preview.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {preview.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPreviewModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSend}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Send Campaign
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CampaignDetailsModal
        campaignId={selectedCampaignId || ''}
        isOpen={!!selectedCampaignId}
        onClose={() => setSelectedCampaignId(null)}
      />

      <DeliveryLogsModal
        campaignId={selectedLogsCampaignId || ''}
        isOpen={!!selectedLogsCampaignId}
        onClose={() => setSelectedLogsCampaignId(null)}
      />
    </div>
  )
}
