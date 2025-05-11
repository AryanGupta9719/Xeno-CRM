"use client"

import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

type CampaignDetails = {
  _id: string
  campaignId: string
  name: string
  createdAt: string
  lastSentAt?: string
  segment: string
  status: string
  messageVariants: Array<{
    content: string
    type: string
  }>
  audienceRules?: {
    segment: string
    conditions: any[]
  }
  totalAudienceCount?: number
  deliveryStats?: {
    sent: number
    failed: number
  }
}

type Props = {
  campaignId: string
  isOpen: boolean
  onClose: () => void
}

export function CampaignDetailsModal({ campaignId, isOpen, onClose }: Props) {
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && campaignId) {
      fetchCampaignDetails()
    }
  }, [isOpen, campaignId])

  const fetchCampaignDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/campaigns/${campaignId}`)
      if (!response.ok) throw new Error('Failed to fetch campaign details')
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch campaign details')
      }
      setCampaign(data.campaign)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load campaign details')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Campaign Details</DialogTitle>
          <DialogDescription>
            View detailed information about this campaign
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {/* ... loading skeleton ... */}
          </div>
        ) : campaign ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Campaign Name</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{campaign.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{campaign.status}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {new Date(campaign.createdAt).toLocaleString()}
                </p>
              </div>
              {campaign.lastSentAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Sent At</h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(campaign.lastSentAt).toLocaleString()}
                  </p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Segment</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{campaign.audienceRules?.segment || 'No segment defined'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Audience Size</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {campaign.totalAudienceCount?.toLocaleString() || 'Not set'}
                </p>
              </div>
            </div>

            {/* Campaign Insight Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Campaign Insight</h3>
              <div className="space-y-2">
                <p className="text-blue-900 dark:text-blue-100">
                  Your campaign reached {campaign.totalAudienceCount?.toLocaleString() || 0} users. {campaign.deliveryStats?.sent?.toLocaleString() || 0} messages delivered successfully.
                </p>
                {campaign.deliveryStats && (
                  <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <div className="flex items-center gap-2">
                      <span>• Success Rate:</span>
                      <span className="font-medium">
                        {Math.round((campaign.deliveryStats.sent / (campaign.deliveryStats.sent + campaign.deliveryStats.failed)) * 100)}%
                      </span>
                      {campaign.deliveryStats.sent > 0 && (
                        <span className="text-green-600 dark:text-green-400">↑</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>• Failed Deliveries:</span>
                      <span className="font-medium">
                        {campaign.deliveryStats.failed?.toLocaleString() || 0} messages
                      </span>
                      {campaign.deliveryStats.failed > 0 && (
                        <span className="text-red-600 dark:text-red-400">↑</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>• Delivery Rate:</span>
                      <span className="font-medium">
                        {campaign.totalAudienceCount ? Math.round((campaign.deliveryStats.sent / campaign.totalAudienceCount) * 100) : 0}%
                      </span>
                      {campaign.totalAudienceCount && campaign.deliveryStats.sent > campaign.totalAudienceCount * 0.8 && (
                        <span className="text-green-600 dark:text-green-400">↑</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Stats */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Delivery Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400">Messages Sent</p>
                  <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
                    {(campaign.deliveryStats?.sent || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">Messages Failed</p>
                  <p className="text-2xl font-semibold text-red-700 dark:text-red-300">
                    {(campaign.deliveryStats?.failed || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Audience Rules */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Audience Rules</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Segment</h4>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {campaign.audienceRules?.segment || 'No segment defined'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Conditions</h4>
                  {campaign.audienceRules?.conditions && campaign.audienceRules.conditions.length > 0 ? (
                    <div className="space-y-2">
                      {campaign.audienceRules.conditions.map((condition, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="font-medium text-gray-700 dark:text-gray-300">
                              {condition.field}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                              {condition.operator}
                            </div>
                            <div className="text-gray-900 dark:text-white">
                              {typeof condition.value === 'object' 
                                ? JSON.stringify(condition.value)
                                : condition.value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No conditions defined</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">Campaign not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 