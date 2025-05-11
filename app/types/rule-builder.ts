export type Metric = 'totalSpend' | 'visitCount' | 'daysInactive';
export type Operator = 'gt' | 'lt' | 'eq' | 'gte' | 'lte';

export const METRIC_LABELS = {
  totalSpend: "Total Spend",
  visitCount: "Visit Count",
  daysInactive: "Days Inactive"
};

export const OPERATOR_LABELS = {
  gt: ">",
  lt: "<",
  eq: "=",
  gte: "≥",
  lte: "≤"
};

export interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface RuleGroup {
  id: string;
  operator: 'AND' | 'OR';
  rules: Rule[];
  groups: RuleGroup[];
}

export interface RuleBuilderProps {
  value: RuleGroup;
  onChange: (value: RuleGroup) => void;
}

export interface RuleBuilderState {
  groups: RuleGroup[];
} 