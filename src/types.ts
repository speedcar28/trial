export interface Subject {
  id: string;
  name: string;
  targetHours: number; // Target study hours per week
  color: string; // Tailwind hex or class name for category colors
  priority?: "High" | "Medium" | "Low"; // Priority Level
}

export interface StudySession {
  id: string;
  subjectId: string;
  duration: number; // in minutes
  date: string; // YYYY-MM-DD
  notes: string; // Brief note on what was covered
}

export interface StudyReminder {
  id: string;
  subjectId: string | null; // null means General Study
  time: string; // e.g., "16:00"
  frequency: "Daily" | "Weekly" | "Mon-Fri";
  isActive: boolean;
}

export interface WeeklyReview {
  id: string;
  weekStartDate: string; // YYYY-MM-DD (Monday)
  reflections: string;
  goals: Record<string, string>; // subjectId -> focus/goal string
}

export interface DashboardStats {
  totalHoursThisWeek: number;
  streakDays: number;
  subjectProgress: {
    subjectId: string;
    subjectName: string;
    targetHours: number;
    completedHours: number;
    percentage: number;
    color: string;
    priority: "High" | "Medium" | "Low";
  }[];
}

