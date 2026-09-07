export type BookingSource = "assistant" | "manual" | "phone";

export interface RevenueSummary {
  totalTetri: number;
  deltaPercent: number;
  averageCheckTetri: number;
}

export interface BookingsSummary {
  count: number;
  deltaPercent: number;
  byAssistant: number;
}

export interface AssistantSummary {
  handled: number;
  handledPercent: number;
  handedOff: number;
}

export interface WeekdayBookings {
  weekday: number;
  count: number;
}

export interface MonthlyGoal {
  targetTetri: number;
  reachedTetri: number;
  todayTetri: number;
  deltaPercent: number;
}

export interface TodayBooking {
  id: string;
  startsAt: Date;
  clientName: string;
  serviceName: string;
  staffName: string;
  priceTetri: number;
  source: BookingSource;
}

export interface UnreadSummary {
  total: number;
  instagram: number;
  whatsapp: number;
}

export interface HandoffSummary {
  count: number;
  reasons: string[];
}

export interface DashboardData {
  ownerName: string;
  revenue: RevenueSummary;
  bookings: BookingsSummary;
  assistant: AssistantSummary;
  week: WeekdayBookings[];
  goal: MonthlyGoal;
  today: TodayBooking[];
  unread: UnreadSummary;
  handoff: HandoffSummary | null;
}
