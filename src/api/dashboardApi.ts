/**
 * Dashboard API - Dashboard statistics and ticket ratios
 */

import { apiGet } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number;
  totalRefund: number;
  netRevenue: number;
  totalTickets: number;
  paidTickets: number;
  cancelledTickets: number;
  totalDoctors: number;
  totalContents: number;
  totalReviews: number;
  avgRating: number;
}

export interface TicketRatio {
  ticketStatus: string;
  totalCount: number;
  ratioPercent: number;
}

// ─── Query Keys ────────────────────────────────────────────────────────────────

export const dashboardKeys = {
  stats: ["dashboard", "stats"] as const,
  ticketRatios: ["dashboard", "ticket-ratios"] as const,
};

// ─── Service Functions ─────────────────────────────────────────────────────

async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await apiGet<DashboardStats>("/dashboard/stats");
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Khong the lay thong ke dashboard");
}

async function fetchTicketRatios(): Promise<TicketRatio[]> {
  const res = await apiGet<TicketRatio[]>("/dashboard/ticket-ratios");
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Khong the lay ty le phieu kham");
}

// ─── Hooks ─────────────────────────────────────────────────────────────────

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats,
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useTicketRatios() {
  return useQuery({
    queryKey: dashboardKeys.ticketRatios,
    queryFn: fetchTicketRatios,
    staleTime: 1000 * 60 * 5,
  });
}