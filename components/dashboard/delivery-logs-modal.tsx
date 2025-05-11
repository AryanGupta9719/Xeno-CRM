import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Download } from "lucide-react"

type DeliveryLog = {
  userId: string
  status: 'sent' | 'failed'
  timestamp: string
  error: string | null
}

type DeliveryLogsModalProps = {
  campaignId: string
  isOpen: boolean
  onClose: () => void
}

export function DeliveryLogsModal({ campaignId, isOpen, onClose }: DeliveryLogsModalProps) {
  const [logs, setLogs] = useState<DeliveryLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && campaignId) {
      fetchLogs()
    }
  }, [isOpen, campaignId])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/campaigns/${campaignId}/logs`)
      if (!response.ok) {
        throw new Error('Failed to fetch delivery logs')
      }
      
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch delivery logs')
      }
      
      setLogs(data.logs || [])
    } catch (error) {
      console.error('Error fetching delivery logs:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch delivery logs')
    } finally {
      setLoading(false)
    }
  }

  const downloadLogs = () => {
    const csvContent = [
      ['User ID', 'Status', 'Timestamp', 'Error'],
      ...logs.map(log => [
        log.userId,
        log.status,
        new Date(log.timestamp).toLocaleString(),
        log.error || ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `campaign-${campaignId}-logs.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Delivery Logs</span>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadLogs}
              className="flex items-center"
            >
              <Download size={14} className="mr-2" />
              Download CSV
            </Button>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Error
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                      {log.userId}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === 'sent' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      {log.error || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 