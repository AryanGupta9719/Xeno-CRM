"use client"

import { useState } from "react"
import { Plus, Trash2, Save, Users, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Rule = {
  id: string
  field: string
  operator: string
  value: string
}

type LogicGate = "AND" | "OR"

export function SegmentBuilder() {
  const [segmentName, setSegmentName] = useState("")
  const [segmentDescription, setSegmentDescription] = useState("")
  const [rules, setRules] = useState<Rule[]>([{ id: "1", field: "last_purchase", operator: "less_than", value: "30" }])
  const [logicGate, setLogicGate] = useState<LogicGate>("AND")
  const [naturalLanguageRule, setNaturalLanguageRule] = useState("")
  const [previewCount, setPreviewCount] = useState<number | null>(null)

  const fields = [
    { value: "last_purchase", label: "Last Purchase (days)" },
    { value: "total_spend", label: "Total Spend" },
    { value: "visit_count", label: "Visit Count" },
    { value: "email_opens", label: "Email Opens" },
    { value: "inactive_days", label: "Inactive Days" },
  ]

  const operators = [
    { value: "greater_than", label: "Greater than" },
    { value: "less_than", label: "Less than" },
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Not equals" },
    { value: "contains", label: "Contains" },
  ]

  const addRule = () => {
    const newRule: Rule = {
      id: Date.now().toString(),
      field: "last_purchase",
      operator: "less_than",
      value: "",
    }
    setRules([...rules, newRule])
  }

  const removeRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  const updateRule = (id: string, field: keyof Rule, value: string) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule)))
  }

  const toggleLogicGate = () => {
    setLogicGate(logicGate === "AND" ? "OR" : "AND")
  }

  const convertNaturalLanguage = () => {
    // Simulate AI conversion of natural language to rules
    if (naturalLanguageRule.trim()) {
      // This is a simplified example - in a real app, this would call an AI service
      const newRules: Rule[] = []

      if (naturalLanguageRule.toLowerCase().includes("spend")) {
        newRules.push({
          id: Date.now().toString(),
          field: "total_spend",
          operator: "greater_than",
          value: "10000",
        })
      }

      if (naturalLanguageRule.toLowerCase().includes("visit")) {
        newRules.push({
          id: (Date.now() + 1).toString(),
          field: "visit_count",
          operator: "less_than",
          value: "3",
        })
      }

      if (naturalLanguageRule.toLowerCase().includes("inactive")) {
        newRules.push({
          id: (Date.now() + 2).toString(),
          field: "inactive_days",
          operator: "greater_than",
          value: "90",
        })
      }

      if (newRules.length > 0) {
        setRules(newRules)
        // If we have multiple rules, set the logic gate based on the input
        if (newRules.length > 1) {
          setLogicGate(naturalLanguageRule.toLowerCase().includes(" or ") ? "OR" : "AND")
        }
      }
    }
  }

  const previewAudience = () => {
    // Simulate audience preview calculation
    const randomCount = Math.floor(Math.random() * 10000) + 500
    setPreviewCount(randomCount)
  }

  const saveSegment = () => {
    // Simulate saving the segment
    alert(`Segment "${segmentName}" saved successfully!`)
  }

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Segment Details</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="segment-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Segment Name
            </label>
            <Input
              id="segment-name"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              placeholder="e.g., High Value Customers"
              className="max-w-md"
            />
          </div>

          <div>
            <label
              htmlFor="segment-description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description
            </label>
            <Textarea
              id="segment-description"
              value={segmentDescription}
              onChange={(e) => setSegmentDescription(e.target.value)}
              placeholder="Describe this segment..."
              className="max-w-md"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Natural Language Rule</h2>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Textarea
              value={naturalLanguageRule}
              onChange={(e) => setNaturalLanguageRule(e.target.value)}
              placeholder="e.g., spend > $10,000 AND visits < 3 OR inactive for 90 days"
              className="flex-1"
            />
            <Button onClick={convertNaturalLanguage} className="md:self-end">
              <Wand2 className="mr-2 h-4 w-4" />
              Convert to Rules
            </Button>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Describe your audience segment in plain language, and we'll convert it to rules.
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Segment Rules</h2>

        <div className="space-y-6">
          {rules.map((rule, index) => (
            <div key={rule.id} className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              {index > 0 && (
                <div className="md:w-20 py-2">
                  <Button variant="outline" onClick={toggleLogicGate} className="w-full">
                    {logicGate}
                  </Button>
                </div>
              )}

              <div className={`flex-1 grid ${index === 0 ? "md:grid-cols-3" : "md:grid-cols-3"} gap-4`}>
                <Select value={rule.field} onValueChange={(value) => updateRule(rule.id, "field", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={rule.operator} onValueChange={(value) => updateRule(rule.id, "operator", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((operator) => (
                      <SelectItem key={operator.value} value={operator.value}>
                        {operator.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  value={rule.value}
                  onChange={(e) => updateRule(rule.id, "value", e.target.value)}
                  placeholder="Value"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeRule(rule.id)}
                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))}

          <Button variant="outline" onClick={addRule}>
            <Plus size={16} className="mr-2" />
            Add Rule
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button variant="outline" onClick={previewAudience} className="flex items-center">
          <Users size={16} className="mr-2" />
          Preview Audience
          {previewCount !== null && (
            <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
              {previewCount.toLocaleString()} contacts
            </span>
          )}
        </Button>

        <Button onClick={saveSegment} disabled={!segmentName || rules.length === 0} className="flex items-center">
          <Save size={16} className="mr-2" />
          Save Segment
        </Button>
      </div>
    </div>
  )
}
