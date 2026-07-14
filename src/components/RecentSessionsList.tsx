import React, { useState } from "react";
import { Search, Trash2, Calendar, BookOpen, Clock, AlertCircle } from "lucide-react";
import { StudySession, Subject } from "../types";
import { formatHumanDate, formatDateString } from "../utils";

interface RecentSessionsListProps {
  sessions: StudySession[];
  subjects: Subject[];
  onDeleteSession: (id: string) => void;
}

// Utility to format duration in minutes cleanly
function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hrs}h`;
  }
  return `${hrs}h ${mins}m`;
}

export default function RecentSessionsList({
  sessions,
  subjects,
  onDeleteSession,
}: RecentSessionsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const todayStr = formatDateString(new Date());

  // Quick lookup map for subject properties to keep complexity at O(1) inside render loop
  const subjectMap = new Map<string, Subject>();
  subjects.forEach((s) => subjectMap.set(s.id, s));

  // Filter sessions
  const filteredSessions = sessions
    .filter((session) => {
      // Filter by subject
      if (selectedSubjectId && session.subjectId !== selectedSubjectId) {
        return false;
      }
      // Search term
      if (searchTerm.trim() !== "") {
        const notesMatch = session.notes.toLowerCase().includes(searchTerm.toLowerCase());
        const subject = subjectMap.get(session.subjectId);
        const subjectNameMatch = subject?.name.toLowerCase().includes(searchTerm.toLowerCase());
        return notesMatch || subjectNameMatch;
      }
      return true;
    })
    // Sort by date desc, then by id desc for stable sort
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-50 pb-4">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-900 tracking-tight">
            Study History Logs
          </h2>
          <p className="text-xs text-slate-500 font-sans">
            Search, filter, and review your historic focus times
          </p>
        </div>
        <span className="text-xs text-slate-400 font-mono self-start sm:self-center bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full font-bold">
          {filteredSessions.length} Logs found
        </span>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            id="input-search-sessions"
            type="text"
            placeholder="Search logs or concepts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-slate-50 hover:bg-slate-50/80 border border-slate-200 focus:border-slate-300 rounded-xl p-3 pl-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Filter Dropdown */}
        <select
          id="select-filter-subject"
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="">All Subjects</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* Log Feed */}
      <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12 space-y-2 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-500">No matching logs found</p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Try resetting your filters or start logging new study sessions to populate your database.
            </p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const subject = subjectMap.get(session.subjectId);
            const subjectName = subject ? subject.name : "Deleted Subject";
            const subjectColor = subject ? subject.color : "#94a3b8"; // slate-400

            return (
              <div
                key={session.id}
                className="group relative flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-4 rounded-2xl bg-slate-50/60 hover:bg-slate-50 border border-slate-100/80 transition-all hover:shadow-xs"
              >
                {/* Left block (Subject tag + Notes + Details) */}
                <div className="space-y-2.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Subject color Pill */}
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-display uppercase tracking-wider text-white"
                      style={{ backgroundColor: subjectColor }}
                    >
                      <BookOpen className="w-3 h-3 stroke-[2.5px]" />
                      {subjectName}
                    </span>

                    {/* Duration badge */}
                    <span className="inline-flex items-center gap-1 bg-white border border-slate-200/80 text-slate-600 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formatDuration(session.duration)}
                    </span>

                    {/* Date label */}
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 font-medium">
                      <Calendar className="w-3 h-3 text-slate-300" />
                      {formatHumanDate(session.date, todayStr)}
                    </span>
                  </div>

                  {/* Notes content */}
                  {session.notes ? (
                    <p className="text-xs text-slate-700 leading-relaxed font-sans pr-4 whitespace-pre-wrap">
                      {session.notes}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No notes provided for this session.</p>
                  )}
                </div>

                {/* Right block: Action Buttons */}
                <div className="sm:self-center flex-shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to remove this logged study session?")) {
                        onDeleteSession(session.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors"
                    title="Delete study session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
