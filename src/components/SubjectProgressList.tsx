import React, { useState } from "react";
import { Plus, Trash2, Edit2, Check, X, RefreshCw } from "lucide-react";
import { Subject } from "../types";

interface SubjectProgressListProps {
  subjects: Subject[];
  onAddSubject: (name: string, targetHours: number, color: string, priority: "High" | "Medium" | "Low") => void;
  onEditSubject: (id: string, name: string, targetHours: number, color: string, priority: "High" | "Medium" | "Low") => void;
  onDeleteSubject: (id: string) => void;
}

const PRESET_COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#8b5cf6", // Violet
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#06b6d4", // Sky Blue
  "#f97316", // Orange
  "#14b8a6", // Teal
];

export default function SubjectProgressList({
  subjects,
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
}: SubjectProgressListProps) {
  // Creating mode state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState<number>(4);
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("Medium");

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editTarget, setEditTarget] = useState<number>(4);
  const [editColor, setEditColor] = useState(PRESET_COLORS[0]);
  const [editPriority, setEditPriority] = useState<"High" | "Medium" | "Low">("Medium");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddSubject(newName.trim(), Math.max(1, newTarget), newColor, newPriority);
    setNewName("");
    setNewTarget(4);
    setNewPriority("Medium");
    setIsAdding(false);
  };

  const startEdit = (subject: Subject) => {
    setEditingId(subject.id);
    setEditName(subject.name);
    setEditTarget(subject.targetHours);
    setEditColor(subject.color);
    setEditPriority(subject.priority || "Medium");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    onEditSubject(id, editName.trim(), Math.max(1, editTarget), editColor, editPriority);
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
          <div>
            <h2 className="text-md font-bold font-display text-slate-900">
              Manage Subjects
            </h2>
            <p className="text-[11px] text-slate-400">
              Define your courses and weekly study targets
            </p>
          </div>

          {!isAdding && (
            <button
              id="btn-add-subject-toggle"
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          )}
        </div>

        {/* Adding Form */}
        {isAdding && (
          <form onSubmit={handleCreate} className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">New Subject</span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Subject Name
                </label>
                <input
                  id="input-subject-name"
                  type="text"
                  required
                  placeholder="e.g. Organic Chemistry, Algorithms"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Target Hours / Week
                </label>
                <input
                  id="input-subject-hours"
                  type="number"
                  min="1"
                  max="168"
                  required
                  value={newTarget}
                  onChange={(e) => setNewTarget(parseInt(e.target.value) || 0)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Priority Level
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["High", "Medium", "Low"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        newPriority === p
                          ? p === "High"
                            ? "bg-rose-600 text-white shadow-xs"
                            : p === "Medium"
                              ? "bg-amber-500 text-white shadow-xs"
                              : "bg-slate-700 text-white shadow-xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Color Tag
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewColor(color)}
                      className={`w-5 h-5 rounded-full transition-all cursor-pointer relative flex items-center justify-center`}
                      style={{ backgroundColor: color }}
                    >
                      {newColor === color && (
                        <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="btn-submit-subject"
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 rounded-lg text-xs cursor-pointer transition-colors"
              >
                Create Subject
              </button>
            </div>
          </form>
        )}

        {/* Subjects List */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {subjects.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              No subjects registered yet.
            </div>
          ) : (
            subjects.map((sub) => {
              const isEditing = editingId === sub.id;

              return (
                <div
                  key={sub.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isEditing 
                      ? "bg-slate-50 border-slate-300 shadow-sm" 
                      : "bg-white hover:bg-slate-50/50 border-slate-100"
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                          Edit Subject Name
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                            Hours/Week
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="168"
                            value={editTarget}
                            onChange={(e) => setEditTarget(parseInt(e.target.value) || 0)}
                            className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex-1">
                          <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                            Color Tag
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {PRESET_COLORS.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setEditColor(color)}
                                className="w-4 h-4 rounded-full flex items-center justify-center cursor-pointer"
                                style={{ backgroundColor: color }}
                              >
                                {editColor === color && (
                                  <Check className="w-2.5 h-2.5 text-white stroke-[3.5px]" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                            Priority
                          </label>
                          <div className="grid grid-cols-3 gap-0.5">
                            {(["High", "Medium", "Low"] as const).map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setEditPriority(p)}
                                className={`py-1 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                                  editPriority === p
                                    ? p === "High"
                                      ? "bg-rose-600 text-white"
                                      : p === "Medium"
                                        ? "bg-amber-500 text-white"
                                        : "bg-slate-700 text-white"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {p[0]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-2.5 py-1 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-md text-[11px] font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(sub.id)}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[11px] font-semibold cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 group/sub">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: sub.color }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-semibold text-slate-800 truncate max-w-[120px]" title={sub.name}>
                              {sub.name}
                            </p>
                            <span className={`px-1 py-0.5 rounded text-[8px] font-mono font-extrabold uppercase tracking-wider ${
                              sub.priority === "High"
                                ? "bg-rose-50 text-rose-600 border border-rose-100"
                                : sub.priority === "Low"
                                  ? "bg-slate-100 text-slate-500 border border-slate-200"
                                  : "bg-amber-50 text-amber-600 border border-amber-100"
                            }`}>
                              {sub.priority || "Medium"}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Target: {sub.targetHours}h / week
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(sub)}
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md cursor-pointer"
                          title="Edit Subject"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete ${sub.name}? Current study history for this subject will be retained as "(Deleted Course)".`
                              )
                            ) {
                              onDeleteSubject(sub.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
