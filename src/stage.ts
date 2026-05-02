import type { DroughtStage } from "./types";

export type StageTheme = {
  name: DroughtStage;
  accent: string;
  kind: "flowing" | "calm" | "cracked" | "fractured";
  gradient: readonly [string, string, string, string];
  gradientStops: readonly [number, number, number, number];
  gradFlat: string;
};

export function classify(reservoirPct: number): DroughtStage {
  if (reservoirPct > 85) return "Normal";
  if (reservoirPct >= 75) return "Watch";
  if (reservoirPct >= 65) return "Warning";
  return "Emergency";
}

export const STAGE_THEME: Record<DroughtStage, StageTheme> = {
  Normal: {
    name: "Normal",
    accent: "#A8E6FF",
    kind: "flowing",
    gradient: ["#0B2A4A", "#1A4D6E", "#2680A8", "#4FB3CC"],
    gradientStops: [0, 0.3, 0.65, 1],
    gradFlat: "#1A4D6E",
  },
  Watch: {
    name: "Watch",
    accent: "#C7E5C0",
    kind: "calm",
    gradient: ["#1F3D2E", "#355745", "#6B8771", "#A8C0A0"],
    gradientStops: [0, 0.35, 0.7, 1],
    gradFlat: "#355745",
  },
  Warning: {
    name: "Warning",
    accent: "#FFCB7A",
    kind: "cracked",
    gradient: ["#2A1A0E", "#5A3520", "#94532C", "#C77A3E"],
    gradientStops: [0, 0.35, 0.7, 1],
    gradFlat: "#5A3520",
  },
  Emergency: {
    name: "Emergency",
    accent: "#FF8A6B",
    kind: "fractured",
    gradient: ["#1A0606", "#4A1010", "#7A1F18", "#B8392A"],
    gradientStops: [0, 0.3, 0.6, 1],
    gradFlat: "#4A1010",
  },
};

// Legacy badge bg used in a few places; keep for compatibility.
export const STAGE_BG: Record<DroughtStage, string> = {
  Normal: "bg-green-600",
  Watch: "bg-yellow-500",
  Warning: "bg-orange-500",
  Emergency: "bg-red-600",
};

export const STAGE_COLOR: Record<DroughtStage, string> = {
  Normal: "#16a34a",
  Watch: "#eab308",
  Warning: "#f97316",
  Emergency: "#dc2626",
};

export const STAGE_RANK: Record<DroughtStage, number> = {
  Normal: 0,
  Watch: 1,
  Warning: 2,
  Emergency: 3,
};

export const STAGE_TEXT: Record<DroughtStage, string> = {
  Normal: "Reservoir healthy. No mandatory restrictions.",
  Watch: "Voluntary 10% reduction. Monitor irrigation.",
  Warning: "Stage 2: 15% mandatory cut. Outdoor watering limits.",
  Emergency: "Stage 4: 30%+ cuts. Ag allocations slashed.",
};

// Per-stage impact profile used by ImpactTab.
export type ImpactProfile = {
  severityHeadline: string;
  household: {
    gpd: number;
    cut: number;
    label: string;
    shower: string;
    lawn: string;
    pool: string;
  };
  farm: { allocation: number; label: string; acresFallowed: number };
  reservoir: { mult: number; level: string; boating: string; fishing: string };
  economic: { lossM: number; jobs: number };
};

export const IMPACT: Record<DroughtStage, ImpactProfile> = {
  Normal: {
    severityHeadline: "No action needed",
    household: {
      gpd: 100,
      cut: 0,
      label: "No restrictions",
      shower: "unlimited",
      lawn: "all days",
      pool: "open",
    },
    farm: { allocation: 100, label: "Full allocation", acresFallowed: 0 },
    reservoir: { mult: 1.0, level: "High", boating: "open", fishing: "open" },
    economic: { lossM: 0, jobs: 0 },
  },
  Watch: {
    severityHeadline: "Conserve voluntarily",
    household: {
      gpd: 90,
      cut: 10,
      label: "Voluntary 10% cut",
      shower: "5 min",
      lawn: "odd days",
      pool: "open",
    },
    farm: { allocation: 80, label: "20% reduction", acresFallowed: 8500 },
    reservoir: {
      mult: 0.85,
      level: "Below avg",
      boating: "open",
      fishing: "open",
    },
    economic: { lossM: 12, jobs: 180 },
  },
  Warning: {
    severityHeadline: "Restrictions in effect",
    household: {
      gpd: 75,
      cut: 25,
      label: "Mandatory 15% cut",
      shower: "4 min",
      lawn: "1 day/wk",
      pool: "no refill",
    },
    farm: { allocation: 55, label: "45% reduction", acresFallowed: 28000 },
    reservoir: {
      mult: 0.65,
      level: "Low",
      boating: "restricted",
      fishing: "permit only",
    },
    economic: { lossM: 65, jobs: 1200 },
  },
  Emergency: {
    severityHeadline: "Emergency declared",
    household: {
      gpd: 50,
      cut: 50,
      label: "Mandatory 25% cut · fines $500",
      shower: "2 min",
      lawn: "banned",
      pool: "closed",
    },
    farm: { allocation: 30, label: "70% reduction", acresFallowed: 51000 },
    reservoir: {
      mult: 0.4,
      level: "Critical",
      boating: "closed",
      fishing: "closed",
    },
    economic: { lossM: 240, jobs: 4800 },
  },
};
