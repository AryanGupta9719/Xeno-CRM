"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Sparkles } from "lucide-react"

// Enhanced rule parser with more patterns
const parseNaturalLanguage = (input: string) => {
  const rules = []
  
  // Convert to lowercase for easier matching
  const text = input.toLowerCase()
  
  // Check for spend amount with currency
  const spendMatch = text.match(/(?:spent|spend|purchase|bought).*?(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)/i)
  if (spendMatch) {
    const amount = parseInt(spendMatch[1].replace(/,/g, ''))
    rules.push({
      field: "totalSpend",
      operator: ">",
      value: amount
    })
  }
  
  // Check for inactivity period with more variations
  const inactiveMatch = text.match(/(?:inactive|not visited|haven't visited|no visit|last seen|last active).*?(\d+).*?(?:days|day|weeks|week|months|month)/i)
  if (inactiveMatch) {
    const days = parseInt(inactiveMatch[1])
    const unit = inactiveMatch[2]?.toLowerCase()
    const daysToAdd = unit?.includes('week') ? days * 7 : unit?.includes('month') ? days * 30 : days
    rules.push({
      field: "lastActive",
      operator: "<",
      value: `${daysToAdd} days ago`
    })
  }
  
  // Check for location with more variations
  const locationMatch = text.match(/(?:from|in|located in|based in|residing in|living in)\s+([a-zA-Z\s]+(?:city|state|country)?)/i)
  if (locationMatch) {
    rules.push({
      field: "location",
      operator: "=",
      value: locationMatch[1].trim()
    })
  }
  
  // Check for purchase frequency with more variations
  const frequencyMatch = text.match(/(?:purchased|bought|ordered).*?(\d+).*?(?:times|orders|purchases)/i)
  if (frequencyMatch) {
    rules.push({
      field: "purchaseCount",
      operator: ">",
      value: parseInt(frequencyMatch[1])
    })
  }

  // Check for average order value
  const aovMatch = text.match(/(?:average order|aov|order value).*?(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)/i)
  if (aovMatch) {
    const amount = parseInt(aovMatch[1].replace(/,/g, ''))
    rules.push({
      field: "averageOrderValue",
      operator: ">",
      value: amount
    })
  }

  // Check for cart abandonment
  if (text.includes('abandoned cart') || text.includes('left items in cart')) {
    rules.push({
      field: "hasAbandonedCart",
      operator: "=",
      value: true
    })
  }

  // Check for wishlist items
  const wishlistMatch = text.match(/(?:wishlist|saved items).*?(\d+)/i)
  if (wishlistMatch) {
    rules.push({
      field: "wishlistItems",
      operator: ">",
      value: parseInt(wishlistMatch[1])
    })
  }

  // Check for product category preferences
  const categoryMatch = text.match(/(?:interested in|prefers|likes).*?([a-zA-Z\s]+(?:category|products)?)/i)
  if (categoryMatch) {
    rules.push({
      field: "preferredCategory",
      operator: "=",
      value: categoryMatch[1].trim()
    })
  }

  return rules
}

type Props = {
  onRulesGenerated: (rules: any[]) => void
}

export function NaturalLanguageRules({ onRulesGenerated }: Props) {
  const [input, setInput] = useState("")
  const [parsedRules, setParsedRules] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsProcessing(true)

    if (!input.trim()) {
      setError("Please enter a rule description")
      setIsProcessing(false)
      return
    }

    try {
      const rules = parseNaturalLanguage(input)
      if (rules.length === 0) {
        setError("Could not parse any rules from the input. Try being more specific about amounts, time periods, or locations.")
        setIsProcessing(false)
        return
      }

      setParsedRules(rules)
      onRulesGenerated(rules)
    } catch (err) {
      setError("Failed to parse rules. Please try a different format.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          Natural Language Rules
        </CardTitle>
        <CardDescription>
          Describe your audience in natural language. For example: "Users who spent over ₹5000 and haven't visited in 90 days"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Example: Users who spent over ₹5000 and haven't visited in 90 days"
              className="min-h-[100px]"
            />
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <p className="font-medium mb-1">Try phrases like:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>"spent over ₹5000"</li>
                  <li>"haven't visited in 90 days"</li>
                  <li>"from Mumbai"</li>
                  <li>"purchased more than 3 times"</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Or try:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>"average order ₹2000"</li>
                  <li>"abandoned cart"</li>
                  <li>"5 items in wishlist"</li>
                  <li>"interested in electronics"</li>
                </ul>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {parsedRules.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Parsed Rules:</h4>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(parsedRules, null, 2)}
              </pre>
            </div>
          )}

          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Rules
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 