"use client"

import { useState } from "react"
import { Bell, Check, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Notification = {
  id: string
  title: string
  message: string
  type: "success" | "error" | "info" | "warning"
  date: string
  read: boolean
}

export function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Campaign Delivered",
      message: 'Your "Summer Sale Announcement" campaign was successfully delivered to 12,375 recipients.',
      type: "success",
      date: "2023-05-01T10:30:00Z",
      read: false,
    },
    {
      id: "2",
      title: "Delivery Issues",
      message: 'We encountered issues delivering to 125 recipients in your "Summer Sale Announcement" campaign.',
      type: "error",
      date: "2023-05-01T10:35:00Z",
      read: false,
    },
    {
      id: "3",
      title: "Segment Updated",
      message: 'Your "High Value Customers" segment has been automatically updated with 152 new contacts.',
      type: "info",
      date: "2023-04-28T14:15:00Z",
      read: true,
    },
    {
      id: "4",
      title: "Campaign Scheduled",
      message: 'Your "New Product Launch" campaign has been scheduled for May 15, 2023.',
      type: "info",
      date: "2023-04-25T09:45:00Z",
      read: true,
    },
    {
      id: "5",
      title: "Audience Insight",
      message: 'We detected a 15% increase in engagement from your "Recent Purchasers" segment.',
      type: "info",
      date: "2023-04-20T16:30:00Z",
      read: true,
    },
    {
      id: "6",
      title: "Segment Warning",
      message: 'Your "At Risk" segment has grown by 28% in the last 30 days.',
      type: "warning",
      date: "2023-04-15T11:20:00Z",
      read: true,
    },
  ])

  const [filter, setFilter] = useState<string>("all")

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    return notification.type === filter
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return (
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        )
      case "error":
        return (
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
            <X className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
        )
      case "warning":
        return (
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
        )
      default:
        return (
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        )
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full mr-3">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Notifications</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You have {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter notifications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All notifications</SelectItem>
                <SelectItem value="unread">Unread only</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Information</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="whitespace-nowrap">
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-4 p-4 rounded-lg transition-colors ${
                notification.read ? "bg-white dark:bg-gray-800" : "bg-sky-50 dark:bg-sky-900/10"
              } border border-gray-200 dark:border-gray-700`}
            >
              {getTypeIcon(notification.type)}

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3
                    className={`font-medium ${
                      notification.read ? "text-gray-900 dark:text-white" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {notification.title}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(notification.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
              </div>

              <div className="flex items-start space-x-2">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => markAsRead(notification.id)}
                    className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <Check size={16} />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteNotification(notification.id)}
                  className="h-8 w-8 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Bell className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No notifications</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {filter === "all"
                ? "You don't have any notifications yet."
                : "No notifications match your current filter."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
