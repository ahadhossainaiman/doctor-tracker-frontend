export type ChartSeries = {
  labels: string[];
  values: number[];
};

export type TimeRange = "7d" | "30d" | "90d" | "12m";
export type TimeInterval = "day" | "week" | "month";

export type RecentDoctor = {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  createdAt: string;
};

export type RecentPatient = {
  id: string;
  name: string;
  condition: string;
  registeredAt: string;
  doctor: string;
  doctorName?: string;
};

export type DashboardSummary = {
  totalDoctors: number;
  totalPatients: number;
  patientsThisMonth: number;
  averagePatientsPerDoctor: number;
  recentDoctors: RecentDoctor[];
  recentPatients: RecentPatient[];
};
