import { Subject, StudySession, DashboardStats } from "./types";
import { DEFAULT_SUBJECTS, DEFAULT_SESSIONS } from "./data";

// Helper to get formatted date string (YYYY-MM-DD)
export function formatDateString(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Helper to add/subtract days from a date
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Get Monday of the week containing the given date
export function getMondayOfCurrentWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  // day: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Format a date cleanly for human reading (e.g., "Tue, Jul 14" or "Today", "Yesterday")
export function formatHumanDate(dateStr: string, todayStr: string): string {
  if (dateStr === todayStr) return "Today";
  
  const today = new Date(todayStr + "T00:00:00");
  const target = new Date(dateStr + "T00:00:00");
  
  const diffTime = today.getTime() - target.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return "Yesterday";
  
  return target.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Initialize subjects and sessions in localStorage
export function initializeStorage() {
  const storedSubjects = localStorage.getItem("study_tracker_subjects");
  const storedSessions = localStorage.getItem("study_tracker_sessions");

  const today = new Date();
  const todayStr = formatDateString(today);

  // If we don't have stored subjects, initialize them
  if (!storedSubjects) {
    localStorage.setItem("study_tracker_subjects", JSON.stringify(DEFAULT_SUBJECTS));
  }

  // If we don't have stored sessions, initialize with relative dates
  if (!storedSessions) {
    // Relative offsets for DEFAULT_SESSIONS:
    // sess-10: Offset 0 (Today)
    // sess-9: Offset -1 (Yesterday)
    // sess-8: Offset -2
    // sess-7: Offset -2
    // sess-6: Offset -3
    // sess-5: Offset -4
    // sess-4: Offset -5
    // sess-3: Offset -5
    // sess-2: Offset -6
    // sess-1: Offset -7
    const offsets = [-7, -6, -5, -5, -4, -3, -2, -2, -1, 0];
    
    const relativeSessions: StudySession[] = DEFAULT_SESSIONS.map((session, index) => {
      const offset = offsets[index] !== undefined ? offsets[index] : 0;
      const sessionDate = addDays(today, offset);
      return {
        ...session,
        date: formatDateString(sessionDate),
      };
    });

    localStorage.setItem("study_tracker_sessions", JSON.stringify(relativeSessions));
  }
}

// Fetch subjects from localStorage
export function getSubjects(): Subject[] {
  const data = localStorage.getItem("study_tracker_subjects");
  return data ? JSON.parse(data) : DEFAULT_SUBJECTS;
}

// Save subjects to localStorage
export function saveSubjects(subjects: Subject[]) {
  localStorage.setItem("study_tracker_subjects", JSON.stringify(subjects));
}

// Fetch sessions from localStorage
export function getSessions(): StudySession[] {
  const data = localStorage.getItem("study_tracker_sessions");
  return data ? JSON.parse(data) : DEFAULT_SESSIONS;
}

// Save sessions to localStorage
export function saveSessions(sessions: StudySession[]) {
  localStorage.setItem("study_tracker_sessions", JSON.stringify(sessions));
}

// Calculate dashboard statistics
export function calculateStats(
  subjects: Subject[],
  sessions: StudySession[],
  currentDate: Date = new Date()
): DashboardStats {
  const todayStr = formatDateString(currentDate);
  const monday = getMondayOfCurrentWeek(currentDate);
  const sunday = addDays(monday, 6);
  
  const mondayStr = formatDateString(monday);
  const sundayStr = formatDateString(sunday);

  // 1. Calculate hours this week (Monday to Sunday)
  // Let's filter sessions where date >= mondayStr and date <= sundayStr
  const weeklySessions = sessions.filter(
    (s) => s.date >= mondayStr && s.date <= sundayStr
  );

  const totalMinutesThisWeek = weeklySessions.reduce((acc, s) => acc + s.duration, 0);
  const totalHoursThisWeek = Math.round((totalMinutesThisWeek / 60) * 10) / 10;

  // 2. Calculate progress per subject
  const subjectProgress = subjects.map((subject) => {
    const subjectSessions = weeklySessions.filter((s) => s.subjectId === subject.id);
    const completedMinutes = subjectSessions.reduce((acc, s) => acc + s.duration, 0);
    const completedHours = Math.round((completedMinutes / 60) * 10) / 10;
    
    let percentage = 0;
    if (subject.targetHours > 0) {
      percentage = Math.round((completedHours / subject.targetHours) * 100);
    }

    return {
      subjectId: subject.id,
      subjectName: subject.name,
      targetHours: subject.targetHours,
      completedHours,
      percentage,
      color: subject.color,
      priority: subject.priority || "Medium",
    };
  });

  // 3. Calculate streak (consecutive days of study ending either today or yesterday)
  // Build a set of all unique study dates in YYYY-MM-DD
  const studyDates = new Set(sessions.map((s) => s.date));
  
  let streakDays = 0;
  let checkDate = new Date(currentDate);
  let checkDateStr = formatDateString(checkDate);

  // Check if there is study today or yesterday to even keep a streak alive
  const studiedToday = studyDates.has(checkDateStr);
  const yesterdayStr = formatDateString(addDays(currentDate, -1));
  const studiedYesterday = studyDates.has(yesterdayStr);

  if (studiedToday || studiedYesterday) {
    // If we didn't study today but did study yesterday, start checking backwards from yesterday
    if (!studiedToday) {
      checkDate = addDays(currentDate, -1);
      checkDateStr = yesterdayStr;
    }

    // Go backwards day by day to count consecutive study days
    while (studyDates.has(checkDateStr)) {
      streakDays++;
      checkDate = addDays(checkDate, -1);
      checkDateStr = formatDateString(checkDate);
    }
  }

  return {
    totalHoursThisWeek,
    streakDays,
    subjectProgress,
  };
}
