"use client"

import { useState } from "react"
import Image from "next/image"
import { Send, Wand2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type MessageVariant = {
  id: string
  content: string
}

export function CampaignCreator() {
  const [campaignName, setCampaignName] = useState("")
  const [objective, setObjective] = useState("")
  const [selectedSegment, setSelectedSegment] = useState("")
  const [messageVariants, setMessageVariants] = useState<MessageVariant[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [campaignSent, setCampaignSent] = useState(false)

  const segments = [
    { id: "1", name: "High Value Customers" },
    { id: "2", name: "Recent Purchasers" },
    { id: "3", name: "At Risk" },
    { id: "4", name: "Newsletter Subscribers" },
    { id: "5", name: "First-time Customers" },
  ]

  const objectives = [
    { id: "awareness", name: "Brand Awareness" },
    { id: "conversion", name: "Conversion" },
    { id: "retention", name: "Customer Retention" },
    { id: "feedback", name: "Collect Feedback" },
    { id: "announcement", name: "Product Announcement" },
  ]

  const productImages = [
    "/mobile-app-showcase.png",
    "/elegant-ecommerce-display.png",
    "/placeholder.svg?key=kgeby",
    "/natural-light-product.png",
  ]

  const generateMessages = () => {
    setIsGenerating(true)

    // Simulate AI message generation
    setTimeout(() => {
      const newVariants: MessageVariant[] = [
        {
          id: "1",
          content: `Hi there! We noticed you haven't visited us in a while. We miss you and wanted to let you know about our latest collection that just dropped. Check it out and get 15% off your next purchase with code WELCOME15.`,
        },
        {
          id: "2",
          content: `Hey! Long time no see. We've got some exciting new products we think you'll love. Come back and enjoy 15% off your next order with code WELCOME15.`,
        },
        {
          id: "3",
          content: `We miss you! It's been a while since your last visit, and we've been busy adding new items to our collection. Use code WELCOME15 for 15% off your next purchase.`,
        },
      ]

      setMessageVariants(newVariants)
      setIsGenerating(false)
    }, 2000)
  }

  const nextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + productImages.length) % productImages.length)
  }

  const sendCampaign = () => {
    setIsSending(true)

    // Simulate campaign sending
    setTimeout(() => {
      setIsSending(false)
      setCampaignSent(true)
    }, 2000)
  }

  return (
    <div className="space-y-8">
      {campaignSent ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Campaign Sent Successfully!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your campaign "{campaignName}" has been sent to the selected audience segment.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => setCampaignSent(false)}>
              Create Another Campaign
            </Button>
            <Button>View Campaign Details</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Campaign Details</h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="campaign-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Campaign Name
                </label>
                <Input
                  id="campaign-name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., Summer Sale Announcement"
                  className="max-w-md"
                />
              </div>

              <div>
                <label htmlFor="objective" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Campaign Objective
                </label>
                <Select value={objective} onValueChange={setObjective}>
                  <SelectTrigger className="max-w-md">
                    <SelectValue placeholder="Select an objective" />
                  </SelectTrigger>
                  <SelectContent>
                    {objectives.map((obj) => (
                      <SelectItem key={obj.id} value={obj.id}>
                        {obj.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="segment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Audience
                </label>
                <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                  <SelectTrigger className="max-w-md">
                    <SelectValue placeholder="Select a segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {segments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        {segment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Message Content</h2>
              <Button
                onClick={generateMessages}
                disabled={!campaignName || !objective || !selectedSegment || isGenerating}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Messages"}
              </Button>
            </div>

            {messageVariants.length > 0 ? (
              <div className="space-y-4">
                {messageVariants.map((variant, index) => (
                  <div key={variant.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Variant {index + 1}</h3>
                    </div>
                    <Textarea
                      value={variant.content}
                      onChange={(e) => {
                        const updatedVariants = [...messageVariants]
                        updatedVariants[index].content = e.target.value
                        setMessageVariants(updatedVariants)
                      }}
                      rows={4}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {isGenerating ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mb-4"></div>
                    <p>Generating message variants...</p>
                  </div>
                ) : (
                  <p>Fill in the campaign details and click "Generate Messages" to create message variants.</p>
                )}
              </div>
            )}
          </div>

          {messageVariants.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Campaign Image</h2>

              <div className="relative">
                <div className="flex justify-center">
                  <div className="relative w-full max-w-2xl">
                    <Image
                      src={productImages[currentImageIndex] || "/placeholder.svg"}
                      alt={`Product image ${currentImageIndex + 1}`}
                      width={500}
                      height={300}
                      className="rounded-lg w-full h-auto object-cover"
                    />

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full h-10 w-10"
                    >
                      <ChevronLeft size={20} />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full h-10 w-10"
                    >
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 w-2 rounded-full mx-1 ${
                        currentImageIndex === index ? "bg-sky-600 dark:bg-sky-400" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {messageVariants.length > 0 && (
            <div className="flex justify-end">
              <Button onClick={sendCampaign} disabled={isSending} className="flex items-center">
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Send Campaign
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
