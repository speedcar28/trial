import React, { useState } from "react";
import { X, Calendar, Clock, BookOpen, AlertCircle } from "lucide-react";
import { Subject } from "../types";
import { formatDateString } from "../utils";

interface LogSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onLogSession: (subjectId: string, duration: number, date: string, notes: string) => void;
}

const PRESET_DURATIONS = [
  { label: "30m", value: 30 },
  { label: "45m", value: 45 },
  { label: "1h", value: 60 },
  { label: "1.5h", value: 90 },
  { label: "2h", value: 120 },
  { label: "3h", value: 180 },
];

export default function LogSessionModal({
  isOpen,
  onClose,
  subjects,
  onLogSession,
}: LogSessionModalProps) {
  if (!isOpen) return null;

  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "");
  const [duration, setDuration] = useState<number>(60);
  const [date, setDate] = useState(formatDateString(new Date()));
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) {
      setError("Please select a subject.");
      return;
    }
    if (duration <= 0) {
      setError("Please enter a valid positive duration in minutes.");
      return;
    }
    if (!date) {
      setError("Please select a valid study date.");
      return;
    }

    onLogSession(subjectId, duration, date, notes.trim());
    
    // Reset state
    setNotes("");
    setDuration(60);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Modal Container */}
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden z-10 border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-50 p-6">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900">
              Log Study Session
            </h3>
            <p className="text-xs text-slate-400">
              Record your completed study time and insights
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {error && (
            <div className="flex items-center gap-2 bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Subject Selector */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              Select Course / Subject
            </label>
            {subjects.length === 0 ? (
              <div className="p-3 bg-amber-50 text-amber-700 text-xs rounded-xl border border-amber-100">
                You must create a subject first before logging a study session.
              </div>
            ) : (
              <select
                id="select-session-subject"
                required
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full text-sm bg-slate-50 hover:bg-slate-50/80 border border-slate-200 hover:border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans cursor-pointer transition-colors"
              >
                <option value="" disabled>Choose a course...</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Duration Selector */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Study Duration
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  id="input-session-duration"
                  type="number"
                  min="1"
                  required
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 pr-12 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                />
                <span className="absolute right-4 top-3 text-xs text-slate-400 font-medium font-sans">
                  mins
                </span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {PRESET_DURATIONS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setDuration(preset.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    duration === preset.value
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Study Date
            </label>
            <input
              id="input-session-date"
              type="date"
              required
              max={formatDateString(new Date())}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans cursor-pointer"
            />
          </div>

          {/* Session Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600">
              What did you cover? (Optional)
            </label>
            <textarea
              id="input-session-notes"
              rows={3}
              placeholder="e.g. Solved practice problems, outlined thesis statement, built study guides..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-50 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold py-3 rounded-xl text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-submit-session"
              type="submit"
              disabled={subjects.length === 0}
              className={`flex-1 font-semibold py-3 rounded-xl text-sm transition-all text-white cursor-pointer ${
                subjects.length === 0
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 shadow-md hover:shadow-lg"
              }`}
            >
              Log Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
