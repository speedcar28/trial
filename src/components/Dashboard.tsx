import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Flame, Calendar, BookOpen, CheckCircle } from "lucide-react";
import { DashboardStats, Subject } from "../types";

interface DashboardProps {
  stats: DashboardStats;
  subjects: Subject[];
  onAddSessionClick: () => void;
  onAddSubjectClick: () => void;
}

export default function Dashboard({
  stats,
  subjects,
  onAddSessionClick,
  onAddSubjectClick,
}: DashboardProps) {
  const currentMonday = new Date();
  const day = currentMonday.getDay();
  const diff = currentMonday.getDate() - day + (day === 0 ? -6 : 1);
  const mondayDate = new Date(currentMonday.setDate(diff));
  const sundayDate = new Date(mondayDate);
  sundayDate.setDate(sundayDate.getDate() + 6);

  const weekRangeString = `${mondayDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${sundayDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  // Find overall progress percentage for the entire week
  const [confetti, setConfetti] = useState<{ id: number; color: string; size: number; x: number; y: number; delay: number }[]>([]);

  const triggerConfetti = () => {
    const colors = ["#f59e0b", "#ec4899", "#10b981", "#6366f1", "#f97316", "#06b6d4", "#a855f7"];
    const newConfetti = Array.from({ length: 45 }).map((_, i) => ({
      id: Date.now() + i,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      x: Math.random() * 240 - 120, // horizontal scatter
      y: Math.random() * -150 - 50,  // vertical lift
      delay: Math.random() * 0.3,
    }));
    setConfetti(newConfetti);
  };

  // Automatically celebrate on load if user hits a milestone streak!
  useEffect(() => {
    if (stats.streakDays >= 7) {
      const timer = setTimeout(() => {
        triggerConfetti();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [stats.streakDays]);

  const totalTarget = subjects.reduce((acc, s) => acc + s.targetHours, 0);
  const overallPercentage = totalTarget > 0 ? Math.min(Math.round((stats.totalHoursThisWeek / totalTarget) * 100), 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Welcome / Overall Summary */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 md:p-8 rounded-3xl shadow-md relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 font-display">
            Weekly Focus Overview
          </span>
          <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight">
            Academic Performance Portal
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl">
            "The secret of getting ahead is getting started." Keep mapping your goals and fueling your study momentum!
          </p>
        </div>

        <div className="flex flex-wrap gap-3 z-10 md:self-end">
          <button
            id="btn-add-subject-top"
            onClick={onAddSubjectClick}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-teal-400" />
            Add Subject
          </button>
          <button
            id="btn-log-session-top"
            onClick={onAddSessionClick}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-teal-500/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Clock className="w-4 h-4 animate-pulse" />
            Log Study Session
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Hours Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-indigo-600 rounded-3xl p-6 text-white flex flex-col justify-between shadow-xl shadow-indigo-100 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl pointer-events-none -mr-4 -mt-4" />
          <div className="flex justify-between items-start z-10">
            <div className="p-2 bg-indigo-500 rounded-lg text-white">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200 font-mono">
              Total Time
            </span>
          </div>
          <div className="mt-8 z-10">
            <div className="text-5xl font-extrabold mb-1 font-display tracking-tight">
              {stats.totalHoursThisWeek}
            </div>
            <div className="text-indigo-100 text-sm font-sans">
              hours studied this week
            </div>
            {totalTarget > 0 ? (
              <p className="text-xs text-indigo-200 mt-3 flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 bg-teal-300 rounded-full animate-ping" />
                <span>
                  {overallPercentage}% of weekly target ({totalTarget}h) reached
                </span>
              </p>
            ) : (
              <p className="text-xs text-indigo-200 mt-3 font-sans">
                No target study hours configured yet
              </p>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-indigo-500/30 flex items-center justify-between text-[10px] text-indigo-200 font-mono z-10">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Week Range:
            </span>
            <span className="font-semibold">{weekRangeString}</span>
          </div>
        </motion.div>

        {/* Study Streak Card */}
        <motion.div
          id="streak-card-celebrate"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          onClick={triggerConfetti}
          className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden cursor-pointer select-none"
          title="Click to celebrate your streak!"
        >
          {/* Absolute Confetti particles */}
          <AnimatePresence>
            {confetti.map((part) => (
              <motion.div
                key={part.id}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  x: part.x,
                  y: part.y,
                  scale: [0, 1.3, 0.7],
                  rotate: [0, 200, 360],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.6,
                  ease: "easeOut",
                  delay: part.delay,
                }}
                className="absolute pointer-events-none rounded-sm z-30"
                style={{
                  backgroundColor: part.color,
                  width: part.size,
                  height: part.size,
                  left: "50%",
                  bottom: "30%",
                }}
              />
            ))}
          </AnimatePresence>

          <div className="flex justify-between items-start z-10">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Current Streak
            </span>
          </div>
          
          <div className="mt-8 z-10">
            <div className="flex items-baseline gap-1.5">
              <span className="text-5xl font-extrabold mb-1 font-display text-slate-800 tracking-tight">
                {stats.streakDays}
              </span>
              <span className="text-slate-400 text-xs font-mono">days</span>
            </div>
            <div className="text-slate-500 text-xs font-sans mt-1">
              active study days
            </div>
            <p className="text-xs text-slate-500 mt-3 font-sans">
              {stats.streakDays > 0 ? (
                <span className="font-semibold text-orange-600 flex items-center gap-1">
                  ⚡ Phenom pace! Click to ignite!
                </span>
              ) : (
                <span className="text-slate-400">Log study today to begin streak</span>
              )}
            </p>

            {/* Streak Milestones Badges */}
            {stats.streakDays >= 30 ? (
              <div className="mt-3 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[9px] font-bold text-amber-600 flex items-center justify-center gap-1 font-mono uppercase tracking-wider animate-bounce-subtle">
                🏆 30+ Day Godlike Streak! 🎉
              </div>
            ) : stats.streakDays >= 7 ? (
              <div className="mt-3 px-2.5 py-1 bg-teal-500/10 border border-teal-500/20 rounded-xl text-[9px] font-bold text-teal-600 flex items-center justify-center gap-1 font-mono uppercase tracking-wider animate-bounce-subtle">
                🌟 7+ Day Elite Milestone! 🎉
              </div>
            ) : stats.streakDays > 0 ? (
              <div className="mt-3 text-[9px] font-mono text-slate-400 italic text-center">
                Click card to celebrate! 🎊
              </div>
            ) : null}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between font-mono z-10">
            <span>Daily study target status</span>
            <span className={`font-semibold ${stats.streakDays > 0 ? "text-orange-500 font-bold" : "text-slate-500"}`}>
              {stats.streakDays > 0 ? "Active Streak" : "Inactive"}
            </span>
          </div>
        </motion.div>

        {/* Global Weekly Completion Dial */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Weekly Target Progress
            </span>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-extrabold font-display text-slate-800 tracking-tight">
                {overallPercentage}%
              </span>
              <span className="text-xs font-mono text-slate-400">
                {stats.totalHoursThisWeek} / {totalTarget} hrs
              </span>
            </div>
            {/* Progress Bar Container */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full"
              />
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mt-4 font-sans">
            Weekly targets help partition long-term study milestones. Add or adjust subjects to calibrate your load.
          </p>
        </motion.div>
      </div>

      {/* Subject-wise progress grid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-display text-slate-900 tracking-tight">
              Subject Focus Milestones
            </h2>
            <p className="text-xs text-slate-500 font-sans">
              Track progress against weekly self-imposed targets
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2.5 py-1 rounded-full border border-slate-150">
            {subjects.length} Active {subjects.length === 1 ? "Subject" : "Subjects"}
          </span>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-100">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500 max-w-xs mx-auto font-sans">
              You haven't tracked any subjects yet. Create your first academic subject with a target hour goal to begin tracking!
            </p>
            <button
              id="btn-add-subject-empty"
              onClick={onAddSubjectClick}
              className="mt-2 text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              + Create a Subject
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.subjectProgress.map((prog, index) => {
              const remainingHours = Math.max(0, prog.targetHours - prog.completedHours);
              const isGoalMet = prog.completedHours >= prog.targetHours;

              return (
                <motion.div
                  key={prog.subjectId}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className="p-5 rounded-2xl bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 flex flex-col justify-between group transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full ring-4 ring-white shadow-sm flex-shrink-0"
                          style={{ backgroundColor: prog.color }}
                        />
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h3 className="text-sm font-semibold font-display text-slate-800 truncate" title={prog.subjectName}>
                            {prog.subjectName}
                          </h3>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider flex-shrink-0 ${
                            prog.priority === "High"
                              ? "bg-rose-50 text-rose-600 border border-rose-100"
                              : prog.priority === "Low"
                                ? "bg-slate-100 text-slate-500 border border-slate-200"
                                : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}>
                            {prog.priority || "Medium"}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-500 whitespace-nowrap">
                        {prog.completedHours}h / <span className="text-slate-400">{prog.targetHours}h</span>
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="w-full h-2.5 bg-slate-200/50 rounded-full overflow-hidden border border-slate-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(prog.percentage, 100)}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: prog.color }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>{prog.percentage}% Complete</span>
                        <span className="font-semibold text-slate-500">{isGoalMet ? "Goal met! 🎉" : `${remainingHours}h remaining`}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
