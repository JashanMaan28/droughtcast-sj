import type { DroughtStage } from "./types";

export function classify(reservoirPct: number): DroughtStage {
  if (reservoirPct > 85) return "Normal";
  if (reservoirPct >= 75) return "Watch";
  if (reservoirPct >= 65) return "Warning";
  return "Emergency";
}

export const STAGE_COLOR: Record<DroughtStage, string> = {
  Normal: "#16a34a", // green-600
  Watch: "#eab308", // yellow-500
  Warning: "#f97316", // orange-500
  Emergency: "#dc2626", // red-600
};

export const STAGE_BG: Record<DroughtStage, string> = {
  Normal: "bg-green-600",
  Watch: "bg-yellow-500",
  Warning: "bg-orange-500",
  Emergency: "bg-red-600",
};

export const STAGE_TEXT: Record<DroughtStage, string> = {
  Normal: "Reservoir healthy. No mandatory restrictions.",
  Watch: "Voluntary 10% reduction. Monitor irrigation.",
  Warning: "Stage 2: 15% mandatory cut. Outdoor watering limits.",
  Emergency: "Stage 4: 30%+ cuts. Ag allocations slashed.",
};

export const STAGE_RANK: Record<DroughtStage, number> = {
  Normal: 0,
  Watch: 1,
  Warning: 2,
  Emergency: 3,
};
