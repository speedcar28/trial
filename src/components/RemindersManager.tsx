import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Plus, Trash2, Clock, Check, X, Calendar, Sparkles, Play, AlertCircle } from "lucide-react";
import { Subject, StudyReminder } from "../types";

interface RemindersManagerProps {
  subjects: Subject[];
}

const DEFAULT_REMINDERS: StudyReminder[] = [
  {
    id: "rem-1",
    subjectId: "sub-1", // Advanced Algorithms
    time: "18:00",
    frequency: "Daily",
    isActive: true,
  },
  {
    id: "rem-2",
    subjectId: null, // General Study
    time: "14:00",
    frequency: "Weekly",
    isActive: true,
  },
];

export default function RemindersManager({ subjects }: RemindersManagerProps) {
  const [reminders, setReminders] = useState<StudyReminder[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  // New reminder form state
  const [subjectId, setSubjectId] = useState<string>("general");
  const [time, setTime] = useState("16:00");
  const [frequency, setFrequency] = useState<"Daily" | "Weekly" | "Mon-Fri">("Daily");

  // Notification Toast state
  const [activeNotification, setActiveNotification] = useState<{
    title: string;
    message: string;
    color: string;
  } | null>(null);

  // Load reminders
  useEffect(() => {
    const stored = localStorage.getItem("study_tracker_reminders");
    if (stored) {
      setReminders(JSON.parse(stored));
    } else {
      localStorage.setItem("study_tracker_reminders", JSON.stringify(DEFAULT_REMINDERS));
      setReminders(DEFAULT_REMINDERS);
    }
  }, []);

  // Save reminders
  const saveRemindersList = (updated: StudyReminder[]) => {
    setReminders(updated);
    localStorage.setItem("study_tracker_reminders", JSON.stringify(updated));
  };

  // Add new reminder
  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const newReminder: StudyReminder = {
      id: `rem-${Date.now()}`,
      subjectId: subjectId === "general" ? null : subjectId,
      time,
      frequency,
      isActive: true,
    };

    const updated = [...reminders, newReminder];
    saveRemindersList(updated);
    setIsAdding(false);
    
    // Reset form
    setSubjectId("general");
    setTime("16:00");
    setFrequency("Daily");
  };

  // Toggle status
  const handleToggleActive = (id: string) => {
    const updated = reminders.map((rem) =>
      rem.id === id ? { ...rem, isActive: !rem.isActive } : rem
    );
    saveRemindersList(updated);
  };

  // Delete reminder
  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter((rem) => rem.id !== id);
    saveRemindersList(updated);
  };

  // Trigger a simulated real-time browser notification
  const handleTriggerTest = (rem: StudyReminder) => {
    let title = "🔔 Study Reminder Alert!";
    let message = "Time to lock in and study your subjects!";
    let color = "#6366f1"; // Indigo default

    if (rem.subjectId) {
      const sub = subjects.find((s) => s.id === rem.subjectId);
      if (sub) {
        title = `🔔 [Study Reminder: ${sub.name}]`;
        message = `Focus alert! It's ${rem.time}. Let's make progress on your high-priority study target.`;
        color = sub.color;
      }
    } else {
      title = "🔔 [Study Reminder: General Focus]";
      message = `It's ${rem.time}! Perfect time to log a quick study session and extend your active streak.`;
    }

    setActiveNotification({ title, message, color });
    
    // Clear toast after 5 seconds
    setTimeout(() => {
      setActiveNotification(null);
    }, 5000);
  };

  // Subject helper map
  const subjectMap = new Map<string, Subject>();
  subjects.forEach((s) => subjectMap.set(s.id, s));

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-md font-bold font-display text-slate-900 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-orange-500 animate-swing" />
              Focus Reminders
            </h2>
            <p className="text-[11px] text-slate-400">
              Customize daily & weekly study triggers
            </p>
          </div>

          {!isAdding && (
            <button
              id="btn-add-reminder-toggle"
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Alert
            </button>
          )}
        </div>

        {/* Form */}
        {isAdding && (
          <form onSubmit={handleAddReminder} className="bg-slate-50 p-4 rounded-2xl border border-slate-150/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Configure Study Alert</span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                  Alert For
                </label>
                <select
                  required
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="general">General Study Session</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      Course: {sub.name} ({sub.priority || "Medium"} Priority)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                    Alert Time
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Mon-Fri">Mon - Fri</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 rounded-lg text-xs cursor-pointer transition-colors"
              >
                Create Alert Trigger
              </button>
            </div>
          </form>
        )}

        {/* Reminders list */}
        <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
          {reminders.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              No active study reminders.
            </div>
          ) : (
            reminders.map((rem) => {
              const sub = rem.subjectId ? subjectMap.get(rem.subjectId) : null;
              const title = sub ? sub.name : "General Study Focus";
              const priority = sub ? sub.priority || "Medium" : null;
              const color = sub ? sub.color : "#94a3b8";

              return (
                <div
                  key={rem.id}
                  className={`p-3 rounded-xl border transition-all ${
                    rem.isActive
                      ? "bg-white border-slate-200 shadow-2xs"
                      : "bg-slate-50/50 border-slate-100 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-xs font-semibold text-slate-800 truncate block max-w-[140px]">
                          {title}
                        </span>
                        {priority && (
                          <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider ${
                            priority === "High" 
                              ? "bg-rose-50 text-rose-600" 
                              : priority === "Medium"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-slate-100 text-slate-500"
                          }`}>
                            {priority}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1 font-bold text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {rem.time}
                        </span>
                        <span>•</span>
                        <span>{rem.frequency}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Test trigger */}
                      <button
                        onClick={() => handleTriggerTest(rem)}
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md cursor-pointer transition-colors"
                        title="Simulate Reminder Notification"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>

                      {/* Active Toggle switch */}
                      <button
                        onClick={() => handleToggleActive(rem.id)}
                        className={`w-8 h-4 rounded-full p-0.5 transition-all cursor-pointer relative flex items-center ${
                          rem.isActive ? "bg-teal-500" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full bg-white transition-all shadow-sm ${
                            rem.isActive ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteReminder(rem.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                        title="Delete Alert"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Embedded Simulated Alert System (gorgeous design!) */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl max-w-sm border border-slate-800 flex items-start gap-3.5"
          >
            <div className="p-2 rounded-xl text-white mt-1 flex-shrink-0" style={{ backgroundColor: activeNotification.color }}>
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-display" style={{ color: activeNotification.color }}>
                  {activeNotification.title}
                </span>
                <button
                  onClick={() => setActiveNotification(null)}
                  className="text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {activeNotification.message}
              </p>
              <div className="flex gap-2 pt-1.5">
                <button
                  onClick={() => {
                    setActiveNotification(null);
                    // Open logged session modal or do anything
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => setActiveNotification(null)}
                  className="text-[10px] text-slate-400 hover:text-slate-200 px-2 py-1 cursor-pointer"
                >
                  Snooze 5m
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
