import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ClipboardList, Sparkles, Save, BookOpen, Clock, Heart, Star, Calendar } from "lucide-react";
import { Subject, StudySession, WeeklyReview } from "../types";
import { getMondayOfCurrentWeek, formatDateString, addDays } from "../utils";

interface WeeklyReviewAndPlanningProps {
  subjects: Subject[];
  sessions: StudySession[];
}

export default function WeeklyReviewAndPlanning({
  subjects,
  sessions,
}: WeeklyReviewAndPlanningProps) {
  const [currentWeekMonday, setCurrentWeekMonday] = useState("");
  const [reflections, setReflections] = useState("");
  const [subjectGoals, setSubjectGoals] = useState<Record<string, string>>({});
  const [savedReviews, setSavedReviews] = useState<WeeklyReview[]>([]);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Initialize and load saved reviews from localStorage
  useEffect(() => {
    const monday = getMondayOfCurrentWeek(new Date());
    const mondayStr = formatDateString(monday);
    setCurrentWeekMonday(mondayStr);

    const stored = localStorage.getItem("study_tracker_weekly_reviews");
    let reviewsList: WeeklyReview[] = [];
    if (stored) {
      reviewsList = JSON.parse(stored);
      setSavedReviews(reviewsList);
    }

    // Try to find if there is a saved review for this week
    const currentReview = reviewsList.find((r) => r.weekStartDate === mondayStr);
    if (currentReview) {
      setReflections(currentReview.reflections);
      setSubjectGoals(currentReview.goals);
    } else {
      // Clear fields if no review for this week
      setReflections("");
      const initialGoals: Record<string, string> = {};
      subjects.forEach((sub) => {
        initialGoals[sub.id] = "";
      });
      setSubjectGoals(initialGoals);
    }
  }, [subjects, sessions]);

  // Group current week's sessions (Monday to Sunday)
  const monday = getMondayOfCurrentWeek(new Date());
  const sunday = addDays(monday, 6);
  const mondayStr = formatDateString(monday);
  const sundayStr = formatDateString(sunday);

  const weeklySessions = sessions.filter(
    (s) => s.date >= mondayStr && s.date <= sundayStr
  );

  // Calculate stats for the current week
  const statsBySubject = subjects.map((sub) => {
    const subSessions = weeklySessions.filter((s) => s.subjectId === sub.id);
    const totalMins = subSessions.reduce((sum, s) => sum + s.duration, 0);
    const hrs = Math.round((totalMins / 60) * 10) / 10;
    
    // Aggregate key topics covered
    const topics = subSessions
      .map((s) => s.notes.trim())
      .filter((n) => n.length > 0);

    return {
      id: sub.id,
      name: sub.name,
      hours: hrs,
      color: sub.color,
      topics,
    };
  });

  // Automatically generate a template from this week's logged sessions
  const handleGenerateTemplate = () => {
    let generatedText = "### Weekly Study Reflections\n\n";
    generatedText += `Reflections for the week of ${monday.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${sunday.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}:\n\n`;

    const coveredAny = statsBySubject.some((stat) => stat.hours > 0);

    if (!coveredAny) {
      generatedText += "• No study sessions logged yet this week. Need to scale up focus and adjust calendar blocks.\n";
    } else {
      statsBySubject.forEach((stat) => {
        if (stat.hours > 0) {
          generatedText += `• **${stat.name}** (${stat.hours} hours logged):\n`;
          if (stat.topics.length > 0) {
            stat.topics.forEach((t) => {
              generatedText += `  - Covered: ${t}\n`;
            });
          } else {
            generatedText += `  - Covered study materials and review quizzes.\n`;
          }
        }
      });
    }

    generatedText += "\n### What went well:\n• \n\n### What could be improved next week:\n• \n";
    setReflections(generatedText);

    // Also pre-populate focus areas if empty
    const updatedGoals = { ...subjectGoals };
    subjects.forEach((sub) => {
      if (!updatedGoals[sub.id]) {
        const stat = statsBySubject.find((s) => s.id === sub.id);
        if (stat && stat.hours > 0) {
          updatedGoals[sub.id] = `Consolidate key concepts studied this week and practice 3 exam-style questions.`;
        } else {
          updatedGoals[sub.id] = `Initiate study session, review syllabus, and meet target of ${sub.targetHours}h.`;
        }
      }
    });
    setSubjectGoals(updatedGoals);
  };

  const handleGoalChange = (subjectId: string, val: string) => {
    setSubjectGoals((prev) => ({
      ...prev,
      [subjectId]: val,
    }));
  };

  const handleSaveReview = () => {
    const mondayVal = getMondayOfCurrentWeek(new Date());
    const mondayStrVal = formatDateString(mondayVal);

    const newReview: WeeklyReview = {
      id: `rev-${Date.now()}`,
      weekStartDate: mondayStrVal,
      reflections,
      goals: subjectGoals,
    };

    // Remove any existing review for this exact week, and add new
    const cleanList = savedReviews.filter((r) => r.weekStartDate !== mondayStrVal);
    const updatedReviews = [...cleanList, newReview];

    setSavedReviews(updatedReviews);
    localStorage.setItem("study_tracker_weekly_reviews", JSON.stringify(updatedReviews));
    
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 font-mono flex items-center gap-1">
            <ClipboardList className="w-3.5 h-3.5" />
            Strategic Planning
          </span>
          <h2 className="text-xl font-bold font-display text-slate-900 tracking-tight">
            Weekly Review & Planning Engine
          </h2>
          <p className="text-xs text-slate-500 font-sans">
            Consolidate this week's learnings, draft honest reflections, and configure next week's focus areas
          </p>
        </div>

        <button
          id="btn-generate-template"
          onClick={handleGenerateTemplate}
          className="flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all self-start sm:self-center"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Auto-Fill Template
        </button>
      </div>

      {/* Week overview stats bar */}
      <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-150/60">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-1 font-display">
          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
          Current Week Study Hours Summary
        </h3>
        {subjects.length === 0 ? (
          <p className="text-xs text-slate-400">No subjects configured to display.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {statsBySubject.map((stat) => (
              <div key={stat.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }} />
                  <span className="text-[10px] font-bold text-slate-700 truncate block max-w-full">
                    {stat.name}
                  </span>
                </div>
                <p className="text-xs font-mono font-bold text-slate-800 flex items-baseline gap-0.5">
                  {stat.hours} <span className="text-[9px] text-slate-400 font-normal">hrs</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Reflections */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Reflections & Insights
          </label>
          <p className="text-[11px] text-slate-400 leading-normal">
            Reflect on your achievements, time-management challenges, or any blockages you encountered this week.
          </p>
          <textarea
            id="textarea-reflections"
            rows={10}
            value={reflections}
            onChange={(e) => setReflections(e.target.value)}
            placeholder="Type your notes or click 'Auto-Fill Template' above to pre-populate logs from last week..."
            className="w-full text-xs bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono resize-none transition-colors"
          />
        </div>

        {/* Right: Goals/Focus Areas per Subject */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Next Week Focus Areas
          </label>
          <p className="text-[11px] text-slate-400 leading-normal">
            Detail specific exam objectives, chapters, or practice problems you want to complete for each subject.
          </p>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {subjects.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Add subjects to define focus targets.</p>
            ) : (
              subjects.map((sub) => (
                <div key={sub.id} className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 w-1/3 min-w-[100px] flex-shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: sub.color }} />
                    <span className="text-xs font-semibold text-slate-700 truncate" title={sub.name}>
                      {sub.name}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={subjectGoals[sub.id] || ""}
                    onChange={(e) => handleGoalChange(sub.id, e.target.value)}
                    placeholder="e.g. Solve 10 practice problems"
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              ))
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              id="btn-save-weekly-review"
              onClick={handleSaveReview}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Save Reflections & Goals
            </button>
          </div>
        </div>
      </div>

      {/* Floating Success Toast */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute bottom-4 left-4 bg-teal-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 z-50 border border-teal-500"
          >
            <Star className="w-3.5 h-3.5 text-teal-200 fill-teal-200 animate-spin" />
            Weekly Planning Saved Successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
