"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, GripVertical } from 'lucide-react'

type Operator = 'AND' | 'OR'

interface Rule {
  field: string
  operator: string
  value: number
}

interface RuleGroup {
  id: string
  operator: Operator
  rules: Rule[]
}

interface RuleBuilderProps {
  onRulesChange: (groups: RuleGroup[]) => void
}

const FIELD_OPTIONS = [
  { value: 'totalSpend', label: 'Total Spend' },
  { value: 'visitCount', label: 'Number of Visits' },
  { value: 'inactiveDays', label: 'Inactive Days' }
]

const OPERATOR_OPTIONS = [
  { value: 'gt', label: '>' },
  { value: 'lt', label: '<' },
  { value: 'eq', label: '=' },
  { value: 'gte', label: '>=' },
  { value: 'lte', label: '<=' }
]

export function RuleBuilder({ onRulesChange }: RuleBuilderProps) {
  const [groups, setGroups] = useState<RuleGroup[]>([])

  const addGroup = () => {
    const newGroup: RuleGroup = {
      id: Math.random().toString(36).substr(2, 9),
      operator: 'AND',
      rules: [],
    }
    const updatedGroups = [...groups, newGroup]
    setGroups(updatedGroups)
    onRulesChange(updatedGroups)
  }

  const removeGroup = (groupId: string) => {
    const updatedGroups = groups.filter(group => group.id !== groupId)
    setGroups(updatedGroups)
    onRulesChange(updatedGroups)
  }

  const addRule = (groupId: string) => {
    const newRule: Rule = {
      field: 'totalSpend',
      operator: '>',
      value: 0,
    }
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          rules: [...group.rules, newRule],
        }
      }
      return group
    })
    setGroups(updatedGroups)
    onRulesChange(updatedGroups)
  }

  const removeRule = (groupId: string, ruleIndex: number) => {
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          rules: group.rules.filter((_, index) => index !== ruleIndex),
        }
      }
      return group
    })
    setGroups(updatedGroups)
    onRulesChange(updatedGroups)
  }

  const updateRule = (groupId: string, ruleIndex: number, field: keyof Rule, value: string | number) => {
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        const updatedRules = [...group.rules]
        updatedRules[ruleIndex] = {
          ...updatedRules[ruleIndex],
          [field]: value,
        }
        return {
          ...group,
          rules: updatedRules,
        }
      }
      return group
    })
    setGroups(updatedGroups)
    onRulesChange(updatedGroups)
  }

  const updateGroupOperator = (groupId: string, operator: Operator) => {
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          operator,
        }
      }
      return group
    })
    setGroups(updatedGroups)
    onRulesChange(updatedGroups)
  }

  return (
    <div className="space-y-4">
      {groups.map((group, groupIndex) => (
        <div key={group.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <GripVertical className="h-5 w-5 text-gray-400" />
              <span className="font-medium">Group {groupIndex + 1}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={group.operator}
                onValueChange={(value: Operator) => updateGroupOperator(group.id, value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">AND</SelectItem>
                  <SelectItem value="OR">OR</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeGroup(group.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {group.rules.map((rule, ruleIndex) => (
              <div key={ruleIndex} className="flex items-center space-x-2">
                <Select
                  value={rule.field}
                  onValueChange={(value) => updateRule(group.id, ruleIndex, 'field', value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={rule.operator}
                  onValueChange={(value) => updateRule(group.id, ruleIndex, 'operator', value)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATOR_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  value={rule.value}
                  onChange={(e) => updateRule(group.id, ruleIndex, 'value', Number(e.target.value))}
                  className="w-32"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRule(group.id, ruleIndex)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => addRule(group.id)}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={addGroup}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Rule Group
      </Button>
    </div>
  )
} 