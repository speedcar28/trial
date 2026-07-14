import React, { useState, useEffect, useRef } from "react";
import { BookOpen, RefreshCw, GraduationCap, Github } from "lucide-react";
import { Subject, StudySession, DashboardStats } from "./types";
import {
  initializeStorage,
  getSubjects,
  saveSubjects,
  getSessions,
  saveSessions,
  calculateStats,
} from "./utils";
import Dashboard from "./components/Dashboard";
import SubjectProgressList from "./components/SubjectProgressList";
import LogSessionModal from "./components/LogSessionModal";
import RecentSessionsList from "./components/RecentSessionsList";
import WeeklyReviewAndPlanning from "./components/WeeklyReviewAndPlanning";
import RemindersManager from "./components/RemindersManager";

export default function App() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalHoursThisWeek: 0,
    streakDays: 0,
    subjectProgress: [],
  });

  const [isLogSessionOpen, setIsLogSessionOpen] = useState(false);
  const [shouldAutoExpandSubjectForm, setShouldAutoExpandSubjectForm] = useState(false);

  // Load and initialize data on component mount
  useEffect(() => {
    initializeStorage();
    const loadedSubjects = getSubjects();
    const loadedSessions = getSessions();
    setSubjects(loadedSubjects);
    setSessions(loadedSessions);
  }, []);

  // Re-calculate statistics whenever subjects or sessions change
  useEffect(() => {
    const updatedStats = calculateStats(subjects, sessions);
    setStats(updatedStats);
  }, [subjects, sessions]);

  // Handle adding a subject
  const handleAddSubject = (
    name: string,
    targetHours: number,
    color: string,
    priority: "High" | "Medium" | "Low" = "Medium"
  ) => {
    const newSubject: Subject = {
      id: `sub-${Date.now()}`,
      name,
      targetHours,
      color,
      priority,
    };
    const updated = [...subjects, newSubject];
    setSubjects(updated);
    saveSubjects(updated);
  };

  // Handle editing a subject
  const handleEditSubject = (
    id: string,
    name: string,
    targetHours: number,
    color: string,
    priority: "High" | "Medium" | "Low"
  ) => {
    const updated = subjects.map((sub) =>
      sub.id === id ? { ...sub, name, targetHours, color, priority } : sub
    );
    setSubjects(updated);
    saveSubjects(updated);
  };

  // Handle deleting a subject
  const handleDeleteSubject = (id: string) => {
    const updatedSubjects = subjects.filter((sub) => sub.id !== id);
    setSubjects(updatedSubjects);
    saveSubjects(updatedSubjects);
    
    // Note: We keep the session history, but because the subject is gone,
    // they will show up as "Deleted Subject" in the history.
  };

  // Handle logging a study session
  const handleLogSession = (subjectId: string, duration: number, date: string, notes: string) => {
    const newSession: StudySession = {
      id: `sess-${Date.now()}`,
      subjectId,
      duration,
      date,
      notes,
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    saveSessions(updated);
  };

  // Handle deleting a study session
  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    saveSessions(updated);
  };

  // Reset to default sample data
  const handleResetData = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all data back to the default 5 subjects and 10 sample sessions? This will overwrite your current progress."
      )
    ) {
      localStorage.removeItem("study_tracker_subjects");
      localStorage.removeItem("study_tracker_sessions");
      initializeStorage();
      setSubjects(getSubjects());
      setSessions(getSessions());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-500/20 antialiased selection:text-teal-900">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-100 py-4 px-6 md:px-12 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-teal-500 to-indigo-600 p-2 rounded-xl text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold font-display tracking-tight text-slate-900">
                AuraStudy
              </span>
              <span className="text-[10px] block font-mono font-bold text-slate-400 uppercase tracking-widest leading-none">
                University Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-reset-data"
              onClick={handleResetData}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-xl transition-all cursor-pointer font-semibold font-display"
              title="Reset sample data back to pristine state"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Data
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Top Section: Dashboard and milestones */}
        <Dashboard
          stats={stats}
          subjects={subjects}
          onAddSessionClick={() => setIsLogSessionOpen(true)}
          onAddSubjectClick={() => {
            // Find the manage subject card and scroll/highlight if needed, or simply expand the form
            setShouldAutoExpandSubjectForm(true);
            const element = document.getElementById("manage-subjects-section");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />

        {/* Weekly Review & Strategic Planning Section */}
        <WeeklyReviewAndPlanning
          subjects={subjects}
          sessions={sessions}
        />

        {/* Bottom Section: Side-by-Side History & Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent sessions - 2 cols wide on large screens */}
          <div className="lg:col-span-2">
            <RecentSessionsList
              sessions={sessions}
              subjects={subjects}
              onDeleteSession={handleDeleteSession}
            />
          </div>

          {/* Subject list and Alert triggers - 1 col wide on large screens */}
          <div id="manage-subjects-section" className="space-y-8 scroll-mt-24">
            <SubjectProgressList
              subjects={subjects}
              onAddSubject={handleAddSubject}
              onEditSubject={handleEditSubject}
              onDeleteSubject={handleDeleteSubject}
            />

            <RemindersManager
              subjects={subjects}
            />
          </div>
        </div>
      </main>

      {/* Log Session Dialog Overlay */}
      <LogSessionModal
        isOpen={isLogSessionOpen}
        onClose={() => setIsLogSessionOpen(false)}
        subjects={subjects}
        onLogSession={handleLogSession}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 AuraStudy Portal. Developed with pixel precision for university scholars.</p>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-semibold text-slate-600 font-display">Aura Design Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
