import { Subject, StudySession } from "./types";

export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: "sub-1",
    name: "Advanced Algorithms",
    targetHours: 8,
    color: "#6366f1", // Indigo
    priority: "High",
  },
  {
    id: "sub-2",
    name: "Organic Chemistry II",
    targetHours: 6,
    color: "#10b981", // Emerald
    priority: "High",
  },
  {
    id: "sub-3",
    name: "Linear Algebra",
    targetHours: 5,
    color: "#8b5cf6", // Violet
    priority: "Medium",
  },
  {
    id: "sub-4",
    name: "Modern World History",
    targetHours: 4,
    color: "#f59e0b", // Amber
    priority: "Low",
  },
  {
    id: "sub-5",
    name: "Creative Writing",
    targetHours: 3,
    color: "#ec4899", // Pink
    priority: "Low",
  },
];

// Past week relative to July 14, 2026:
// 2026-07-14 (Tue)
// 2026-07-13 (Mon)
// 2026-07-12 (Sun)
// 2026-07-11 (Sat)
// 2026-07-10 (Fri)
// 2026-07-09 (Thu)
// 2026-07-08 (Wed)
// 2026-07-07 (Tue)
export const DEFAULT_SESSIONS: StudySession[] = [
  {
    id: "sess-1",
    subjectId: "sub-1",
    duration: 90, // 1.5 hours
    date: "2026-07-07",
    notes: "Deep dive into Merge Sort and Quick Sort recursion trees and recurrence relations.",
  },
  {
    id: "sess-2",
    subjectId: "sub-3",
    duration: 60, // 1.0 hour
    date: "2026-07-08",
    notes: "Solved systems of linear equations using Gaussian elimination and back-substitution.",
  },
  {
    id: "sess-3",
    subjectId: "sub-2",
    duration: 120, // 2.0 hours
    date: "2026-07-09",
    notes: "Reviewed nucleophilic substitution mechanisms (SN1 vs SN2) and drew 3D reaction coordinate diagrams.",
  },
  {
    id: "sess-4",
    subjectId: "sub-4",
    duration: 45, // 0.75 hours
    date: "2026-07-09",
    notes: "Read Chapter 4 on the societal impacts of the Industrial Revolution in Britain.",
  },
  {
    id: "sess-5",
    subjectId: "sub-1",
    duration: 120, // 2.0 hours
    date: "2026-07-10",
    notes: "Implemented a binary search tree (BST) in TypeScript. Practiced tree traversal algorithms.",
  },
  {
    id: "sess-6",
    subjectId: "sub-5",
    duration: 90, // 1.5 hours
    date: "2026-07-11",
    notes: "Drafted the opening scene for the short story assignment. Focused on sensory details.",
  },
  {
    id: "sess-7",
    subjectId: "sub-2",
    duration: 60, // 1.0 hour
    date: "2026-07-12",
    notes: "Completed online practice quiz on stereochemistry and chiral centers.",
  },
  {
    id: "sess-8",
    subjectId: "sub-3",
    duration: 90, // 1.5 hours
    date: "2026-07-12",
    notes: "Studied vector spaces, subspaces, and conditions for linear independence.",
  },
  {
    id: "sess-9",
    subjectId: "sub-4",
    duration: 90, // 1.5 hours
    date: "2026-07-13",
    notes: "Summarized key events leading to WWI. Built a mind-map timeline of the July Crisis.",
  },
  {
    id: "sess-10",
    subjectId: "sub-1",
    duration: 60, // 1.0 hour
    date: "2026-07-14",
    notes: "Discussed graph representations (adjacency lists vs matrices) in study group.",
  },
];
