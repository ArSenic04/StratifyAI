export enum AgentStatus {
  Idle = 'idle',
  Pending = 'pending',
  Active = 'active',
  Complete = 'complete'
}

export interface UseCase {
  title: string;
  description: string;
  impact: string;
  implementation: string;
  resources: string[];
}

export interface Resource {
  title: string;
  url: string;
}

export interface CompanyData {
  industry: string;
  useCases: UseCase[];
  resources: Resource[];
  financials?: CompanyFinancials;
  qaResponse?: string;
}

export interface CompanyFinancials {
  revenue: number[];
  profit: number[];
  years: string[];
  marketShare: number;
  growthRate: number;
}