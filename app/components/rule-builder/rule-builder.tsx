"use client";

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Rule, RuleGroup, Metric, Operator, METRIC_LABELS, OPERATOR_LABELS } from '@/app/types/rule-builder';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, X, Loader2 } from 'lucide-react';

const createEmptyRule = (): Rule => ({
  id: uuidv4(),
  field: 'last_purchase',
  operator: 'less_than',
  value: ''
});

const createEmptyGroup = (): RuleGroup => ({
  id: uuidv4(),
  operator: 'AND',
  rules: [createEmptyRule()],
  groups: []
});

interface RuleBuilderProps {
  value: RuleGroup;
  onChange: (value: RuleGroup) => void;
}

const FIELD_OPTIONS = [
  { value: 'last_purchase', label: 'Last Purchase (days)' },
  { value: 'total_spend', label: 'Total Spend' },
  { value: 'visit_count', label: 'Visit Count' },
  { value: 'email_opens', label: 'Email Opens' },
  { value: 'inactive_days', label: 'Inactive Days' },
];

const OPERATOR_OPTIONS = [
  { value: 'greater_than', label: 'Greater than' },
  { value: 'less_than', label: 'Less than' },
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not equals' },
  { value: 'contains', label: 'Contains' },
];

export function RuleBuilder({ value, onChange }: RuleBuilderProps) {
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addRule = (groupId: string) => {
    const newRule = {
      id: Date.now().toString(),
      field: 'last_purchase',
      operator: 'less_than',
      value: '',
    };
    
    const updatedGroup = {
      ...value,
      rules: [...value.rules, newRule],
    };
    onChange(updatedGroup);
  };

  const removeRule = (ruleId: string) => {
    const updatedGroup = {
      ...value,
      rules: value.rules.filter(rule => rule.id !== ruleId),
    };
    onChange(updatedGroup);
  };

  const updateRule = (ruleId: string, field: string, newValue: string) => {
    const updatedGroup = {
      ...value,
      rules: value.rules.map(rule => 
        rule.id === ruleId ? { ...rule, [field]: newValue } : rule
      ),
    };
    onChange(updatedGroup);
  };

  const toggleOperator = () => {
    const updatedGroup = {
      ...value,
      operator: value.operator === 'AND' ? 'OR' as const : 'AND' as const,
    };
    onChange(updatedGroup);
  };

  const fetchAudiencePreview = async (rules: RuleGroup) => {
    try {
      const response = await fetch('/api/audience/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rules }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch audience preview')
      }

      const data = await response.json()
      return data.count
    } catch (error) {
      console.error('Error fetching audience preview:', error)
      throw error
    }
  }

  useEffect(() => {
    if (value.rules.length > 0) {
      const timeoutId = setTimeout(async () => {
        try {
          setIsLoading(true);
          const count = await fetchAudiencePreview(value);
          setPreviewCount(count);
        } catch (error) {
          console.error('Error fetching audience preview:', error);
          setPreviewCount(null);
        } finally {
          setIsLoading(false);
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setPreviewCount(null);
    }
  }, [value]);

  const renderRule = (rule: Rule, groupId: string) => (
    <div key={rule.id} className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      {rule.id !== value.rules[0].id && (
        <div className="md:w-20 py-2">
          <Button variant="outline" onClick={toggleOperator} className="w-full">
            {value.operator}
          </Button>
        </div>
      )}

      <div className="flex-1 grid md:grid-cols-3 gap-4">
        <Select value={rule.field} onValueChange={(value) => updateRule(rule.id, 'field', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {FIELD_OPTIONS.map((field) => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={rule.operator} onValueChange={(value) => updateRule(rule.id, 'operator', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select operator" />
          </SelectTrigger>
          <SelectContent>
            {OPERATOR_OPTIONS.map((operator) => (
              <SelectItem key={operator.value} value={operator.value}>
                {operator.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          value={rule.value}
          onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
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
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Audience Rules</h3>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Calculating...
            </div>
          ) : previewCount !== null ? (
            <div className="text-sm font-medium">
              Matching Audience: <span className="text-sky-600">{previewCount.toLocaleString()}</span> customers
            </div>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        {value.rules.map((rule) => renderRule(rule, value.id))}

        <Button variant="outline" onClick={() => addRule(value.id)}>
          <Plus size={16} className="mr-2" />
          Add Rule
        </Button>
      </div>
    </div>
  );
} 