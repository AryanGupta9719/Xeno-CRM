"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Send, Wand2, ChevronLeft, ChevronRight, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RuleBuilder } from './rule-builder'
import { useRouter } from "next/navigation"
import { NaturalLanguageRules } from "./natural-language-rules"

type MessageVariant = {
  id: string
  content: string
}

type RuleGroup = any; // Assuming a simple structure for RuleGroup

type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night'
type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

type ActivityStats = {
  visits: number
  purchases: number
  avgSpend: number
  engagement: number
  responseRate: number
}

type DayStats = {
  visits: number
  purchases: number
  engagement: number
}

type ActivityData = {
  hourlyActivity: Record<TimeSlot, ActivityStats>
  dailyActivity: Record<DayOfWeek, DayStats>
}

// Message templates based on intent
const messageTemplates = {
  reengagement: [
    "We've missed you! Here's 20% off just for you.",
    "Come back and see what's new—we've saved your spot!",
    "It's been a while. Ready to shop again?",
    "Your favorite items are waiting for you. Use code WELCOME20 for 20% off!",
    "We've got something special for you. Come back and save 20% today!",
    "Aapko yaad kar rahe hain! Aapke liye 20% ki special discount.",
    "Wapas aaiye, naye products check kijiye!",
    "Aapke favorite items aapka intezaar kar rahe hain.",
    "Special offer sirf aapke liye - 20% off on everything!",
    "Aapke bina adhoora sa lagta hai. Wapas aaiye!"
  ],
  promotion: [
    "Flash Sale Alert! Get 30% off on all items.",
    "Limited time offer: 30% off everything you love.",
    "Don't miss out! 30% off for the next 24 hours only.",
    "Special discount just for you: 30% off your entire purchase.",
    "Your exclusive offer: 30% off everything in store.",
    "Badiya deal! Sab kuch 30% off.",
    "Sirf 24 ghante ke liye - 30% ki special discount.",
    "Aapke liye special offer - 30% off on everything!",
    "Miss mat kijiye - 30% off on all products.",
    "Limited time offer - 30% off on your favorite items."
  ],
  feedback: [
    "We value your opinion! Take our quick survey and get ₹500 off.",
    "Help us improve! Share your feedback and earn rewards.",
    "Your feedback matters! Complete our survey and get a special discount.",
    "Tell us what you think and get ₹500 off your next purchase.",
    "We'd love to hear from you! Take our survey and earn rewards.",
    "Aapki raay hamare liye important hai! Survey bharein aur ₹500 off paayein.",
    "Help us improve! Apna feedback share karein aur rewards paayein.",
    "Aapki feedback se hum better ban sakte hain. Survey complete karein!",
    "Tell us what you think! Survey bharein aur ₹500 off paayein.",
    "Aapki suggestions hamare liye valuable hain. Survey complete karein!"
  ],
  announcement: [
    "Exciting news! Our new collection is now live.",
    "Big announcement: Check out our latest arrivals.",
    "You won't want to miss this! New products just dropped.",
    "Something special is coming your way. Stay tuned!",
    "Get ready for something amazing. New collection launching soon!",
    "Exciting news! Naya collection abhi launch ho gaya hai.",
    "Check out our latest arrivals - naye products just dropped!",
    "Something special is coming your way. Stay tuned!",
    "Get ready for something amazing - new collection launching soon!",
    "Naye products ka launch ho gaya hai. Check karein!"
  ],
  welcome: [
    "Welcome to our family! Enjoy 15% off on your first purchase.",
    "Thanks for joining us! Here's 15% off to get you started.",
    "Welcome aboard! Use code WELCOME15 for 15% off.",
    "We're excited to have you! Enjoy 15% off on everything.",
    "Welcome! Start shopping with 15% off on your first order.",
    "Swagat hai! Pehle purchase par 15% off.",
    "Thanks for joining! 15% off on your first order.",
    "Welcome to our family! 15% off on everything.",
    "We're excited to have you! 15% off on your first purchase.",
    "Start shopping with 15% off! Welcome to our family."
  ]
}

// Enhanced intent detection with Hindi support
const detectIntent = (text: string) => {
  const lowerText = text.toLowerCase()
  
  // Reengagement intent
  if (
    lowerText.includes('inactive') || 
    lowerText.includes('wapas') || 
    lowerText.includes('miss') || 
    lowerText.includes('come back') ||
    lowerText.includes('yaad') ||
    lowerText.includes('bina') ||
    lowerText.includes('adhoora')
  ) {
    return 'reengagement'
  }

  // Promotion intent
  if (
    lowerText.includes('sale') || 
    lowerText.includes('offer') || 
    lowerText.includes('discount') || 
    lowerText.includes('promotion') ||
    lowerText.includes('deal') ||
    lowerText.includes('badiya') ||
    lowerText.includes('special')
  ) {
    return 'promotion'
  }

  // Feedback intent
  if (
    lowerText.includes('feedback') || 
    lowerText.includes('survey') || 
    lowerText.includes('opinion') || 
    lowerText.includes('suggest') ||
    lowerText.includes('raay') ||
    lowerText.includes('suggestions') ||
    lowerText.includes('improve')
  ) {
    return 'feedback'
  }

  // Announcement intent
  if (
    lowerText.includes('new') || 
    lowerText.includes('announce') || 
    lowerText.includes('launch') || 
    lowerText.includes('coming') ||
    lowerText.includes('naya') ||
    lowerText.includes('latest') ||
    lowerText.includes('dropped')
  ) {
    return 'announcement'
  }

  // Welcome intent
  if (
    lowerText.includes('welcome') || 
    lowerText.includes('join') || 
    lowerText.includes('new user') || 
    lowerText.includes('first time') ||
    lowerText.includes('swagat') ||
    lowerText.includes('pehla') ||
    lowerText.includes('start')
  ) {
    return 'welcome'
  }
  
  return 'reengagement' // default intent
}

// Enhanced mock customer activity data with more metrics
const mockActivityData: ActivityData = {
  hourlyActivity: {
    morning: { 
      visits: 120, 
      purchases: 15, 
      avgSpend: 2500,
      engagement: 0.45,
      responseRate: 0.12
    },
    afternoon: { 
      visits: 180, 
      purchases: 25, 
      avgSpend: 3200,
      engagement: 0.52,
      responseRate: 0.15
    },
    evening: { 
      visits: 280, 
      purchases: 45, 
      avgSpend: 4500,
      engagement: 0.68,
      responseRate: 0.22
    },
    night: { 
      visits: 90, 
      purchases: 10, 
      avgSpend: 1800,
      engagement: 0.35,
      responseRate: 0.08
    }
  },
  dailyActivity: {
    monday: { visits: 450, purchases: 60, engagement: 0.48 },
    tuesday: { visits: 520, purchases: 75, engagement: 0.52 },
    wednesday: { visits: 580, purchases: 85, engagement: 0.55 },
    thursday: { visits: 650, purchases: 95, engagement: 0.58 },
    friday: { visits: 720, purchases: 110, engagement: 0.62 },
    saturday: { visits: 850, purchases: 130, engagement: 0.65 },
    sunday: { visits: 680, purchases: 100, engagement: 0.60 }
  }
}

// Add type for time slot data
type TimeSlotData = {
  hour: number
  purchases: number
  opens: number
  clicks: number
}

// Add type for similar users
type SimilarUser = {
  id: string
  name: string
  email: string
  lastActive: string
  totalSpend: number
  matchReason: string
}

// Helper functions outside component
const calculateTimeScore = (slot: TimeSlotData) => {
  // Default to 0 if any property is undefined
  const purchases = slot.purchases || 0
  const opens = slot.opens || 0
  const clicks = slot.clicks || 0
  
  // Weight the different metrics
  return (purchases * 3) + (opens * 2) + clicks
}

const getBestTimeSlot = (timeSlots: TimeSlotData[]) => {
  if (!timeSlots || timeSlots.length === 0) {
    return { hour: 9, score: 0 } // Default to 9 AM if no data
  }

  return timeSlots
    .map(slot => ({
      hour: slot.hour,
      score: calculateTimeScore(slot)
    }))
    .sort((a, b) => b.score - a.score)[0]
}

// Helper function to generate recommendation text
const getRecommendationText = (objective: string, timeStats: any, dayStats: any) => {
  const formatPercent = (num: number) => `${(num * 100).toFixed(1)}%`
  
  switch (objective) {
    case 'conversion':
      return `Best time for conversions with ${formatPercent(timeStats.engagement)} engagement and ₹${timeStats.avgSpend.toLocaleString()} average spend`
    case 'awareness':
      return `Optimal time for reach with ${timeStats.visits.toLocaleString()} average visits and ${formatPercent(timeStats.responseRate)} response rate`
    case 'retention':
      return `Ideal time for retention with ${formatPercent(timeStats.engagement)} engagement and ${formatPercent(timeStats.responseRate)} response rate`
    case 'feedback':
      return `Perfect time for feedback with ${formatPercent(timeStats.responseRate)} response rate and ${formatPercent(timeStats.engagement)} engagement`
    default:
      return `Recommended time with ${formatPercent(timeStats.engagement)} engagement and ${timeStats.visits.toLocaleString()} average visits`
  }
}

// Mock function to find similar users based on rules
const findSimilarUsers = (rules: RuleGroup[]): SimilarUser[] => {
  // Extract spend threshold from rules if exists
  const spendRule = rules.flatMap(group => group.rules)
    .find(rule => rule.field === 'totalSpend' && rule.operator === '>')
  
  const spendThreshold = spendRule ? parseInt(spendRule.value) : 0
  
  // Mock similar users data
  const mockUsers: SimilarUser[] = [
    {
      id: 'U001',
      name: 'Rahul Sharma',
      email: 'rahul.s@example.com',
      lastActive: '2 days ago',
      totalSpend: spendThreshold * 0.8,
      matchReason: 'Similar spending pattern'
    },
    {
      id: 'U002',
      name: 'Priya Patel',
      email: 'priya.p@example.com',
      lastActive: '1 day ago',
      totalSpend: spendThreshold * 0.9,
      matchReason: 'Recently active with high engagement'
    },
    {
      id: 'U003',
      name: 'Amit Kumar',
      email: 'amit.k@example.com',
      lastActive: '3 days ago',
      totalSpend: spendThreshold * 0.85,
      matchReason: 'Similar purchase history'
    },
    {
      id: 'U004',
      name: 'Neha Gupta',
      email: 'neha.g@example.com',
      lastActive: 'Just now',
      totalSpend: spendThreshold * 0.75,
      matchReason: 'High engagement, slightly lower spend'
    },
    {
      id: 'U005',
      name: 'Vikram Singh',
      email: 'vikram.s@example.com',
      lastActive: '5 days ago',
      totalSpend: spendThreshold * 0.95,
      matchReason: 'Very similar spending pattern'
    }
  ]

  return mockUsers
}

// Enhanced tag detection function
const detectCampaignTag = (rules: RuleGroup[]): string => {
  // Flatten all rules for easier processing
  const allRules = rules.flatMap(group => group.rules)
  
  // Check for win-back campaigns
  const inactiveRule = allRules.find(rule => 
    rule.field === 'lastActive' && 
    rule.operator === '>' && 
    parseInt(rule.value) >= 60
  )
  if (inactiveRule) {
    return 'Win-back'
  }
  
  // Check for high-value customer campaigns
  const highValueRule = allRules.find(rule => 
    rule.field === 'totalSpend' && 
    rule.operator === '>' && 
    parseInt(rule.value) >= 10000
  )
  if (highValueRule) {
    return 'High-Value Customers'
  }
  
  // Check for new customer campaigns
  const newCustomerRule = allRules.find(rule => 
    rule.field === 'purchaseCount' && 
    rule.operator === '=' && 
    parseInt(rule.value) === 1
  )
  if (newCustomerRule) {
    return 'New Customers'
  }
  
  // Check for engagement campaigns
  const engagementRule = allRules.find(rule => 
    rule.field === 'lastActive' && 
    rule.operator === '<' && 
    parseInt(rule.value) <= 7
  )
  if (engagementRule) {
    return 'Engagement'
  }

  // Check for loyalty campaigns
  const loyaltyRule = allRules.find(rule => 
    rule.field === 'purchaseCount' && 
    rule.operator === '>' && 
    parseInt(rule.value) >= 5
  )
  if (loyaltyRule) {
    return 'Loyalty'
  }

  // Check for seasonal campaigns
  const seasonalRule = allRules.find(rule => 
    rule.field === 'lastPurchaseDate' && 
    rule.operator === '>' && 
    new Date(rule.value).getMonth() === new Date().getMonth()
  )
  if (seasonalRule) {
    return 'Seasonal'
  }

  // Check for feedback campaigns
  const feedbackRule = allRules.find(rule => 
    rule.field === 'lastFeedbackDate' && 
    rule.operator === '>' && 
    parseInt(rule.value) >= 90
  )
  if (feedbackRule) {
    return 'Feedback'
  }

  // Check for cart abandonment campaigns
  const cartAbandonmentRule = allRules.find(rule => 
    rule.field === 'cartValue' && 
    rule.operator === '>' && 
    parseInt(rule.value) > 0
  )
  if (cartAbandonmentRule) {
    return 'Cart Abandonment'
  }
  
  return 'General' // Default tag
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
  const [groups, setGroups] = useState<RuleGroup[]>([])
  const [error, setError] = useState<string | null>(null)
  const [intent, setIntent] = useState("")
  const [isGeneratingMessages, setIsGeneratingMessages] = useState(false)
  const [bestTime, setBestTime] = useState<{ hour: number; score: number } | null>(null)
  const [similarUsers, setSimilarUsers] = useState<SimilarUser[]>([])
  const [showSimilarUsers, setShowSimilarUsers] = useState(false)
  const [bestTimeSlot, setBestTimeSlot] = useState<{ hour: number; score: number } | null>(null)
  const router = useRouter()

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
    "/product-showcase.png",
    "/elegant-product-display.png",
    "/vibrant-product-display.png",
    "/placeholder.svg?key=rice3",
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

  const handleRulesChange = (updatedGroups: RuleGroup[]) => {
    setGroups(updatedGroups);
  };

  const handleRulesGenerated = (rules: any[]) => {
    setGroups(rules)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate required fields
      if (!campaignName) {
        throw new Error('Please enter a campaign name');
      }
      if (!objective) {
        throw new Error('Please select a campaign objective');
      }
      if (!selectedSegment) {
        throw new Error('Please select a segment');
      }
      if (!groups.length) {
        throw new Error('Please add at least one rule group');
      }
      if (!messageVariants.length) {
        throw new Error('Please generate message variants');
      }

      // Detect campaign tag based on rules
      const campaignTag = detectCampaignTag(groups)

      const response = await fetch('/api/campaigns/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: campaignName,
          objective,
          segment: selectedSegment,
          audienceRules: groups,
          messageVariants,
          tag: campaignTag,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create campaign');
      }

      if (!data.success || !data.campaign?._id) {
        throw new Error('Invalid response from server');
      }

      // Find similar users after successful campaign creation
      const similarUsers = findSimilarUsers(groups)
      setSimilarUsers(similarUsers)
      setShowSimilarUsers(true)

      // Redirect to campaign details page
      router.push(`/campaigns/${data.campaign._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const generateMessagesFromIntent = () => {
    setIsGeneratingMessages(true)
    
    // Simulate API delay
    setTimeout(() => {
      const detectedIntent = detectIntent(intent)
      const templates = messageTemplates[detectedIntent]
      
      // Randomly select 3 templates
      const selectedTemplates = templates
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
      
      const newVariants = selectedTemplates.map((content, index) => ({
        id: String(index + 1),
        content
      }))
      
      setMessageVariants(newVariants)
      setIsGeneratingMessages(false)
    }, 1500)
  }

  // Move useEffect inside component
  useEffect(() => {
    // Sample time slot data - replace with actual data from your backend
    const sampleTimeSlots: TimeSlotData[] = [
      { hour: 9, purchases: 10, opens: 50, clicks: 30 },
      { hour: 12, purchases: 15, opens: 60, clicks: 40 },
      { hour: 15, purchases: 20, opens: 70, clicks: 50 },
      { hour: 18, purchases: 25, opens: 80, clicks: 60 }
    ]

    const bestSlot = getBestTimeSlot(sampleTimeSlots)
    setBestTimeSlot(bestSlot)
  }, [])

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      
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
                  Campaign Name *
                </label>
                <Input
                  id="campaign-name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., Summer Sale Announcement"
                  className="max-w-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="objective" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Campaign Objective *
                </label>
                <Select value={objective} onValueChange={setObjective} required>
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
                  Target Audience *
                </label>
                <Select value={selectedSegment} onValueChange={setSelectedSegment} required>
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

              <div>
                <label
                  htmlFor="campaign-intent"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Campaign Intent
                </label>
                <div className="flex gap-2">
                  <Input
                    id="campaign-intent"
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    placeholder="e.g., inactive users ko wapas lao"
                    className="max-w-md"
                  />
                  <Button
                    onClick={generateMessagesFromIntent}
                    disabled={!intent.trim() || isGeneratingMessages}
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    {isGeneratingMessages ? "Generating..." : "Generate Messages"}
                  </Button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Describe your campaign goal in natural language. We'll generate message suggestions based on your intent.
                </p>
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

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Audience Rules *</h3>
            <NaturalLanguageRules onRulesGenerated={handleRulesGenerated} />
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Advanced Rules</h4>
              <RuleBuilder onRulesChange={handleRulesChange} />
            </div>
            {(!groups || groups.length === 0) && (
              <p className="text-sm text-red-500">Please add at least one rule group</p>
            )}
          </div>

          {messageVariants.length > 0 && (
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmit} 
                disabled={isSending || !groups || groups.length === 0}
                className="flex items-center"
              >
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

          {bestTime && (
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">
                    Best Time to Send
                  </h3>
                  <p className="mt-1 text-blue-800 dark:text-blue-200">
                    Based on customer activity data, we recommend sending this campaign at{' '}
                    <span className="font-semibold">{bestTime.hour}:00</span>
                  </p>
                  <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                    {bestTime.score.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showSimilarUsers && similarUsers.length > 0 && (
            <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-purple-900 dark:text-purple-100">
                    Similar Users You May Want to Target
                  </h3>
                  <p className="mt-1 text-purple-800 dark:text-purple-200">
                    Based on your audience rules, we found these users who might be interested in your campaign.
                  </p>
                  
                  <div className="mt-4 space-y-3">
                    {similarUsers.map((user) => (
                      <div key={user.id} className="bg-white dark:bg-purple-800/50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-purple-900 dark:text-purple-100">
                              {user.name}
                            </h4>
                            <p className="text-sm text-purple-600 dark:text-purple-300">
                              {user.email}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-purple-900 dark:text-purple-100">
                              ₹{user.totalSpend.toLocaleString()}
                            </div>
                            <div className="text-xs text-purple-600 dark:text-purple-300">
                              Last active: {user.lastActive}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-purple-700 dark:text-purple-200">
                          {user.matchReason}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-purple-600 dark:text-purple-400"
                      onClick={() => setShowSimilarUsers(false)}
                    >
                      Hide Suggestions
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
