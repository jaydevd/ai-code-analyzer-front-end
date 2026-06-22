import { Activity, Insight, Repository } from "../types/dashboard.types";

export const repositories: Repository[] = [
  {
    id: "1",
    name: "frontend-app",
    language: "React",
    status: "Ready",
    lastScan: "2h ago",
  },
  {
    id: "2",
    name: "backend-api",
    language: "Node.js",
    status: "Ready",
    lastScan: "5m ago",
  },
  {
    id: "3",
    name: "mobile-app",
    language: "Flutter",
    status: "Analyzing",
    lastScan: "30s ago",
  },
];

export const insights: Insight[] = [
  {
    id: "1",
    message: "18 dead files detected.",
  },
  {
    id: "2",
    message: "Authentication logic duplicated in 3 modules.",
  },
  {
    id: "3",
    message: "Large component detected (1300+ LOC).",
  },
];

export const activities: Activity[] = [
  {
    id: "1",
    action: "Repository scan completed",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    action: "Repository scan failed",
    timestamp: "15 min ago",
  },
  {
    id: "3",
    action: "New repository connected",
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    action: "GitHub integration activated",
    timestamp: "Yesterday",
  },
];