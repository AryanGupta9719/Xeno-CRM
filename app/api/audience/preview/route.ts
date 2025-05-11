import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Customer from '@/models/Customer';
import { RuleGroup, Rule } from '@/app/types/rule-builder';

interface CustomerData {
  [key: string]: any;
}

function evaluateRule(rule: Rule, customer: CustomerData): boolean {
  const { field, operator, value } = rule;
  const customerValue = customer[field];

  switch (operator) {
    case 'greater_than':
      return Number(customerValue) > Number(value);
    case 'less_than':
      return Number(customerValue) < Number(value);
    case 'equals':
      return customerValue === value;
    case 'not_equals':
      return customerValue !== value;
    case 'contains':
      return String(customerValue).includes(String(value));
        default:
      return false;
      }
}

function evaluateRuleGroup(group: RuleGroup, customer: CustomerData): boolean {
  const ruleResults = group.rules.map(rule => evaluateRule(rule, customer));
  const groupResults = group.groups.map(subGroup => evaluateRuleGroup(subGroup, customer));
  
  const allResults = [...ruleResults, ...groupResults];
  
  return group.operator === 'AND' 
    ? allResults.every(result => result)
    : allResults.some(result => result);
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { rules } = body

    // Mock logic to calculate audience count based on rules
    // In a real application, this would query your database
    let count = 0

    if (rules && rules.rules) {
      // Simple mock logic - each rule adds a random number of customers
      rules.rules.forEach((rule: any) => {
        const baseCount = 1000 // Base count per rule
        const randomFactor = Math.random() * 0.5 + 0.5 // Random factor between 0.5 and 1
        count += Math.floor(baseCount * randomFactor)
      })
    }

    // Add some randomness to make it feel more realistic
    count = Math.floor(count * (0.8 + Math.random() * 0.4)) // Random factor between 0.8 and 1.2

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error in audience preview:', error)
    return NextResponse.json(
      { error: 'Failed to calculate audience preview' },
      { status: 500 }
    )
  }
} 