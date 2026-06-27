export type TrendDirection = 'up' | 'down' | 'flat';

export interface KPIMetric {
  id: string;
  label: string;
  value: string | number;
  previousValue?: string | number;
  change: number; // percentage
  trend: TrendDirection;
  unit?: string;
  prefix?: string;
  description?: string;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  target: number;
  deals: number;
}

export interface PipelineStage {
  id: string;
  name: string;
  value: number;
  count: number;
  color: string;
  percentage: number;
}

export interface ActivityItem {
  id: string;
  type: 'deal_won' | 'deal_lost' | 'client_added' | 'task_completed' | 'meeting_scheduled' | 'invoice_sent';
  title: string;
  description: string;
  user: {
    name: string;
    initials: string;
    color: string;
  };
  timestamp: string;
  relativeTime: string;
  meta?: string;
}

export interface TopClient {
  id: string;
  name: string;
  industry: string;
  revenue: number;
  deals: number;
  status: 'active' | 'at_risk' | 'churned';
  initials: string;
  color: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  deals: number;
  revenue: number;
  target: number;
  winRate: number;
}

export interface UpcomingTask {
  id: string;
  title: string;
  client: string;
  due: string;
  priority: 'high' | 'medium' | 'low';
  type: 'call' | 'meeting' | 'proposal' | 'follow_up' | 'demo';
}

export interface DashboardData {
  kpis: KPIMetric[];
  revenueChart: RevenueDataPoint[];
  pipeline: PipelineStage[];
  recentActivity: ActivityItem[];
  topClients: TopClient[];
  teamPerformance: TeamMember[];
  upcomingTasks: UpcomingTask[];
  lastUpdated: string;
}
