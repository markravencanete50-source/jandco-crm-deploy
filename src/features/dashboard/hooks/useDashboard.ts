'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DashboardData } from '../types';
import { MOCK_DASHBOARD_DATA } from '../data';

interface UseDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => void;
  lastUpdated: Date | null;
}

// Simulates a Firebase Firestore fetch — swap for real SDK calls in Phase 13
async function fetchDashboardData(): Promise<DashboardData> {
  await new Promise((r) => setTimeout(r, 650));
  return {
    ...MOCK_DASHBOARD_DATA,
    lastUpdated: new Date().toISOString(),
  };
}

export function useDashboard(): UseDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const result = await fetchDashboardData();
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const refresh = useCallback(() => {
    load(true);
  }, [load]);

  return { data, loading, refreshing, error, refresh, lastUpdated };
}
